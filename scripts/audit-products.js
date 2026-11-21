'use strict';

// ── Audit every product in src/file.js against its live page ──────────────────
//
// For each Amazon listing on an ingredient in src/file.js, this attaches to an already-running
// Chrome and checks:
//
//   - base price:        file's `price` vs. what the page shows now
//   - subscribeAndSave:  recalculates the S&S price from the *current* scraped
//                        price at whichever tier (5/10/15%) is recorded in the
//                        file, and flags a recorded tier on a non-Amazon `store`
//                        (S&S only applies buying directly from Amazon)
//   - nutrition:         best-effort only — most grocery listings show the
//                        nutrition label as a photo, not text, so this can
//                        only catch the listings that happen to expose it as a
//                        real HTML table/bullets. A "not found" here does NOT
//                        mean the file's nutrition data is wrong, just that it
//                        couldn't be checked automatically.
//
// A delay between requests (DELAY_MS) keeps this from hammering the site and
// tripping a bot/robot-check page.
//
// Results are written to scripts/audit-report.md AS THEY'RE FOUND (rewritten
// after every product), so you can have it open and watch it fill in live
// instead of waiting on the terminal — nothing is held back until the end.
//
// Usage:
//   node scripts/audit-products.js
//   DELAY_MS=8000 LIMIT=5 FILTER=blueprint node scripts/audit-products.js
//
// Passing one or more raw URLs instead skips the file.js diffing entirely and just prints
// what's on each page — for pulling in a brand-new ingredient's price/nutrition by hand:
//   node scripts/audit-products.js <url> [<url> ...]
//
// Chrome needs to already be running with its CDP debugging port open:
//
//   Headless (no display server, e.g. over SSH/code-server):
//     nohup chromium --headless=new --remote-debugging-port=9222 \
//       --user-data-dir="$HOME/chrome-debug-profile" --no-sandbox \
//       > /tmp/chromium-debug.log 2>&1 < /dev/null &
//
//   With a real window (macOS example, close other Chrome windows first):
//     /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
//       --remote-debugging-port=9222 --user-data-dir="$HOME/chrome-debug-profile"
//
// Verify it's up: curl http://localhost:9222/json/version

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const FILE_PATH = path.resolve(__dirname, '../src/file.js');
const REPORT_PATH = path.resolve(__dirname, 'audit-report.md');
const CDP_URL = process.env.CDP_URL || 'http://localhost:9222';
const DELAY_MS = Number(process.env.DELAY_MS || 5000);
const LIMIT = process.env.LIMIT ? Number(process.env.LIMIT) : undefined;
const FILTER = process.env.FILTER;

// Listings come from the live ingredient catalogue, not a source parse.
async function loadAmazonListings(source) {
    const { i } = await import('../src/file.js');
    const sourceLines = source.split('\n');
    const products = [];
    let cursor = 0;
    for (const [ingredientKey, factory] of Object.entries(i)) {
        if (typeof factory !== 'function') continue;
        const sample = factory();
        const ingredientNutrition = sample.nutrition;
        for (const product of sample.products ?? []) {
            const productNutrition = product.nutrition;
            const nutrition = productNutrition && Object.keys(productNutrition).length > 0
                ? productNutrition
                : ingredientNutrition;
            for (const listing of product.listings ?? []) {
                const link = listing.link;
                if (!link || !link.includes('amazon.com')) continue;
                const idx = source.indexOf(link, cursor);
                const line = idx >= 0 ? source.slice(0, idx).split('\n').length : undefined;
                if (idx >= 0) cursor = idx + link.length;
                let priceLine = line;
                if (line) {
                    const from = Math.max(0, line - 4);
                    const to = Math.min(sourceLines.length, line + 3);
                    for (let i = from; i < to; i++) {
                        if (/price:\s*[0-9.]+/.test(sourceLines[i])) {
                            priceLine = i + 1;
                            break;
                        }
                    }
                }
                products.push({
                    ingredientKey,
                    brand: product.brand,
                    variant: product.variant,
                    store: listing.store,
                    link,
                    price: listing.price,
                    size: product.size,
                    sizeUnit: product.sizeUnit && product.sizeUnit.name,
                    nutrition,
                    discount: listing.discount ?? {},
                    line,
                    priceLine,
                });
            }
        }
    }
    return products;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function computeNutritionDiff(product, scraped) {
    if (!scraped) return undefined;
    const entries = Object.entries(product.nutrition ?? {});
    let recorded;
    if (entries.length === 1) {
        recorded = entries[0][1];
    } else if (entries.length > 1) {
        const rawUnit = scraped.servingUnitRaw.toLowerCase();
        const match = entries.find(([key]) => rawUnit.includes(key.toLowerCase()) || key.toLowerCase().includes(rawUnit));
        recorded = match?.[1];
    }
    if (!recorded) return undefined;

    const changes = [];
    for (const field of ['calories', 'sodium', 'fiber', 'sugar', 'protein']) {
        const oldVal = recorded[field];
        const newVal = scraped[field];
        if (oldVal !== undefined && newVal !== undefined && Math.abs(oldVal - newVal) > 0.5) {
            changes.push({ field, old: oldVal, new: newVal });
        }
    }
    return changes.length > 0 ? { servingSizeText: scraped.servingSizeText, changes } : undefined;
}

function expectedTier(discount) {
    if (discount.subscribeAndSave15) return 15;
    if (discount.subscribeAndSave10) return 10;
    if (discount.subscribeAndSave5) return 5;
    return undefined;
}

// Amazon's condensed nutrition-summary widget always follows this template:
//   "Nutrition summary {servings} servings per container | {size} {unit} ({weight}g)
//    {calories} {sodium}mg {fiber}g {sugar}g {protein}g Calories Sodium Dietary Fiber Sugars Protein"
// — five values always appear in that fixed order right before their own labels, so they can
// be pulled out positionally without needing to parse the surrounding diet-tag/ingredient text.
function parseNutritionSummary(text) {
    if (!text) return undefined;
    const match = text.match(
        /Nutrition summary\s+[\d.]+\s+servings per container\s*\|\s*(.+?)\s*\((\d+(?:\.\d+)?)g\)\s*(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)mg\s+(\d+(?:\.\d+)?)g\s+(\d+(?:\.\d+)?)g\s+(\d+(?:\.\d+)?)g\s+Calories/i
    );
    if (!match) return undefined;

    const [, servingSizeText, , calories, sodium, fiber, sugar, protein] = match;
    const sizeMatch = servingSizeText.match(/^([\d./]+)\s*(.+)$/);

    return {
        servingSizeText: servingSizeText.trim(),
        servingUnitRaw: sizeMatch ? sizeMatch[2].trim() : servingSizeText.trim(),
        calories: Number(calories),
        sodium: Number(sodium),
        fiber: Number(fiber),
        sugar: Number(sugar),
        protein: Number(protein),
    };
}

// ── Scrape a single Amazon product page ────────────────────────────────────────

async function scrapeProductPage(page, url) {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const isRobotCheck = await page.evaluate(() => {
        return /Robot Check|Enter the characters you see below/i.test(document.body.innerText || '');
    });
    if (isRobotCheck) {
        return { isRobotCheck: true };
    }

    const title = await page.title();

    const price = await page.evaluate(() => {
        const el =
            document.querySelector('.apex-pricetopay-value .a-offscreen') ||
            document.querySelector('#corePriceDisplay_desktop_feature_div .a-offscreen') ||
            document.querySelector('.a-price .a-offscreen');
        if (!el) return undefined;
        const num = parseFloat(el.textContent.replace(/[^0-9.]/g, ''));
        return Number.isFinite(num) ? num : undefined;
    });

    // Best-effort only — see the file header comment on why this often comes up empty.
    // innerText (not textContent) so we only get rendered text, not inline <script> blobs
    // that happen to sit inside a container whose id/class matches "nutrition". Requires an
    // actual "Nutrition summary" section — some listings only expose diet-tag badges (e.g.
    // "Diet type USDA Organic... Ingredients") in a nutrition-id'd container with no real
    // macro data, which isn't worth flagging.
    const rawNutritionText = await page.evaluate(() => {
        const selectors = ['#nutrition-information', '#nutritional-information', '[id*="nutrition" i]'];
        for (const sel of selectors) {
            for (const el of document.querySelectorAll(sel)) {
                const text = el.innerText?.trim().replace(/\s+/g, ' ');
                if (text && text.length > 20 && /nutrition summary/i.test(text)) return text;
            }
        }
        return undefined;
    });

    const nutrition = parseNutritionSummary(rawNutritionText);

    // The full Nutrition Facts table (fat/carbs/cholesterol/etc, beyond the condensed
    // summary above) — only used by the ad-hoc lookup mode (see main()), for pulling in a
    // brand-new ingredient's complete macros by hand when the page happens to expose one.
    const fullNutritionTable = await page.evaluate(() => {
        const table = Array.from(document.querySelectorAll('table')).find((t) => /total fat|saturated fat|cholesterol/i.test(t.innerText));
        return table?.innerText;
    });

    return { isRobotCheck: false, title, price, nutrition, fullNutritionTable };
}

// ── Live report ─────────────────────────────────────────────────────────────
//
// Rewritten to disk after every product so it can be tailed/watched live
// instead of only appearing once the whole run finishes.

function buildReportMarkdown(state) {
    const { startedAt, total, results, done } = state;
    const flagged = results.filter((r) => r.status === 'flagged');
    const lines = [];

    lines.push('# Product Audit');
    lines.push('');
    lines.push(`Started: ${startedAt}`);
    lines.push(
        done
            ? `**Status: done** — ${results.length}/${total} checked, ${flagged.length} flagged.`
            : `**Status: running** — ${results.length}/${total} checked so far, ${flagged.length} flagged.`
    );
    lines.push('');

    if (flagged.length > 0) {
        lines.push('## Flagged');
        lines.push('');
        for (const r of flagged) {
            lines.push(...renderResultSection(r));
        }
    }

    const ok = results.filter((r) => r.status === 'ok');
    if (ok.length > 0) {
        lines.push('## OK');
        lines.push('');
        for (const r of ok) {
            lines.push(`- \`${r.product.ingredientKey ?? '?'}\` — ${r.product.brand ?? '?'} — [file.js:${r.product.line}](../src/file.js#L${r.product.line}) · ${r.product.link}`);
        }
        lines.push('');
    }

    return lines.join('\n');
}

function renderResultSection(r) {
    const { product } = r;
    const lines = [];
    const title = `${product.ingredientKey ?? '?'} — ${product.brand ?? '?'}${product.variant ? ` (${product.variant})` : ''}`;
    lines.push(`### ${title}`);
    lines.push(`[file.js:${product.line}](../src/file.js#L${product.line}) · ${product.link}`);
    lines.push('');

    if (r.priceDiff) {
        lines.push('```diff');
        lines.push(`- ${r.priceDiff.oldLineText}`);
        lines.push(`+ ${r.priceDiff.newLineText}`);
        lines.push('```');
        lines.push('');
    }

    if (r.nutritionDiff) {
        lines.push(`Nutrition (per ${r.nutritionDiff.servingSizeText}):`);
        lines.push('```diff');
        for (const c of r.nutritionDiff.changes) {
            lines.push(`- ${c.field}: ${c.old}`);
            lines.push(`+ ${c.field}: ${c.new}`);
        }
        lines.push('```');
        lines.push('');
    }

    if (r.notes.length > 0) {
        for (const note of r.notes) lines.push(`- ${note}`);
        lines.push('');
    }

    return lines;
}

function writeReport(state) {
    fs.writeFileSync(REPORT_PATH, buildReportMarkdown(state));
}

// ── Main ────────────────────────────────────────────────────────────────────

// Ad-hoc lookup mode: raw URLs passed as CLI args are scraped and printed directly,
// bypassing the file.js diff pipeline entirely — for a brand-new ingredient not in the file yet.
async function lookupUrls(urls) {
    const browser = await chromium.connectOverCDP(CDP_URL);
    const context = browser.contexts()[0] ?? (await browser.newContext());
    const page = context.pages()[0] ?? (await context.newPage());

    for (const url of urls) {
        console.log(`==== ${url}`);
        try {
            const result = await scrapeProductPage(page, url);
            console.log(JSON.stringify(result, null, 2));
        } catch (err) {
            console.log(`ERROR: ${err.message}`);
        }
    }

    await browser.close();
}

async function main() {
    const argUrls = process.argv.slice(2).filter((a) => /^https?:\/\//.test(a));
    if (argUrls.length > 0) {
        await lookupUrls(argUrls);
        return;
    }

    const source = fs.readFileSync(FILE_PATH, 'utf8');
    const sourceLines = source.split('\n');
    const { stores } = await import('../src/file.js');
    let products = await loadAmazonListings(source);

    if (FILTER) {
        const needle = FILTER.toLowerCase();
        products = products.filter(
            (p) => (p.ingredientKey ?? '').toLowerCase().includes(needle) || (p.brand ?? '').toLowerCase().includes(needle)
        );
    }
    if (LIMIT) products = products.slice(0, LIMIT);

    console.log(`Auditing ${products.length} Amazon-linked product(s), ${DELAY_MS}ms delay between requests.`);
    console.log(`Live report: ${REPORT_PATH}\n`);

    const state = { startedAt: new Date().toISOString(), total: products.length, results: [], done: false };
    writeReport(state);

    const browser = await chromium.connectOverCDP(CDP_URL);
    const context = browser.contexts()[0] ?? (await browser.newContext());
    const page = context.pages()[0] ?? (await context.newPage());

    for (const [i, product] of products.entries()) {
        const label = `${product.ingredientKey ?? '?'} — ${product.brand ?? '?'}${product.variant ? ` (${product.variant})` : ''}`;
        console.log(`[${i + 1}/${products.length}] ${label}`);
        console.log(`    ${product.link}`);
        process.stdout.write('    -> ');

        let scraped;
        try {
            scraped = await scrapeProductPage(page, product.link);
        } catch (err) {
            console.log(`ERROR: ${err.message}`);
            state.results.push({ status: 'flagged', product, priceDiff: undefined, notes: [`request failed: ${err.message}`] });
            writeReport(state);
            await sleep(DELAY_MS);
            continue;
        }

        if (scraped.isRobotCheck) {
            console.log('BLOCKED (Amazon robot check — try again later or increase DELAY_MS)');
            state.results.push({
                status: 'flagged',
                product,
                priceDiff: undefined,
                notes: ['blocked by Amazon robot check'],
            });
            writeReport(state);
            await sleep(DELAY_MS);
            continue;
        }

        const notes = [];
        let priceDiff;

        // Whole Foods items sold through Amazon are priced per physical store and vary by
        // delivery location — with no address set on this profile, the scraped price is
        // essentially a random nearby store's price, not specific enough to compare against
        // the recorded value. Skip the price check entirely for these rather than flag noise.
        if (product.store === stores.wholeFoods) {
            // no-op — price intentionally not checked
        } else if (scraped.price === undefined) {
            notes.push('could not read price from page (layout changed / out of stock?)');
        } else if (product.price !== undefined && Math.abs(scraped.price - product.price) > 0.01) {
            const oldLineText = product.priceLine ? sourceLines[product.priceLine - 1] : `price: ${product.price},`;
            const newLineText = oldLineText.replace(
                /price:\s*[0-9.]+/,
                `price: ${scraped.price.toFixed(2)}`
            );
            priceDiff = { old: product.price, new: scraped.price, oldLineText: oldLineText.trim(), newLineText: newLineText.trim() };
        }

        const tier = expectedTier(product.discount);
        if (tier !== undefined) {
            if (product.store !== stores.amazon) {
                notes.push(`recorded subscribeAndSave${tier} but store is not Amazon — S&S wouldn't apply here`);
            }
            const base = scraped.price ?? product.price;
            if (base !== undefined) {
                const recalculated = base * (1 - tier / 100);
                notes.push(`recalculated S&S @ ${tier}% off current price: $${recalculated.toFixed(2)}`);
            }
        }

        const nutritionDiff = computeNutritionDiff(product, scraped.nutrition);
        if (nutritionDiff) {
            const changesText = nutritionDiff.changes.map((c) => `${c.field} ${c.old} -> ${c.new}`).join(', ');
            notes.push(`nutrition differs from file (per ${nutritionDiff.servingSizeText}): ${changesText}`);
        }

        const flagged = Boolean(priceDiff) || Boolean(nutritionDiff) || notes.length > 0;
        console.log(flagged ? 'FLAGGED' : 'OK');
        if (flagged) notes.forEach((note) => console.log(`    - ${note}`));

        state.results.push({ status: flagged ? 'flagged' : 'ok', product, priceDiff, nutritionDiff, notes });
        writeReport(state);

        if (i < products.length - 1) await sleep(DELAY_MS);
    }

    state.done = true;
    writeReport(state);

    const flaggedCount = state.results.filter((r) => r.status === 'flagged').length;
    console.log(`\nDone. ${flaggedCount} of ${products.length} product(s) flagged for review.`);
    console.log(`Full report: ${REPORT_PATH}`);

    // Detaches Playwright only — the real Chrome window/process stays open.
    await browser.close();
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
