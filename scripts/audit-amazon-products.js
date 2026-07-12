'use strict';

// ── Audit every Amazon-linked product in src/file.ts against the live page ────
//
// For each product object in src/file.ts whose `link` points at amazon.com,
// this attaches to an already-running Chrome and checks:
//
//   - base price:        file's `price` vs. what the page shows now
//   - subscribeAndSave:  recalculates the S&S price from the *current* scraped
//                        price at whichever tier (5/10/15%) is recorded in the
//                        file, and flags a recorded tier on a non-Amazon `store`
//                        (S&S only applies buying directly from Amazon)
//   - nutrition:         best-effort only — most Amazon grocery listings show
//                        the nutrition label as a photo, not text, so this can
//                        only catch the listings that happen to expose it as a
//                        real HTML table/bullets. A "not found" here does NOT
//                        mean the file's nutrition data is wrong, just that it
//                        couldn't be checked automatically.
//
// A delay between requests (DELAY_MS) keeps this from hammering Amazon and
// tripping a bot/robot-check page.
//
// Results are written to scripts/audit-report.md AS THEY'RE FOUND (rewritten
// after every product), so you can have it open and watch it fill in live
// instead of waiting on the terminal — nothing is held back until the end.
//
// Usage:
//   node scripts/audit-amazon-products.js
//   DELAY_MS=8000 LIMIT=5 FILTER=blueprint node scripts/audit-amazon-products.js
//
// Passing one or more raw URLs instead skips the file.ts diffing entirely and just prints
// what's on each page — for pulling in a brand-new ingredient's price/nutrition by hand:
//   node scripts/audit-amazon-products.js <url> [<url> ...]
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
const ts = require('typescript');
const { chromium } = require('playwright');

const FILE_PATH = path.resolve(__dirname, '../src/file.ts');
const REPORT_PATH = path.resolve(__dirname, 'audit-report.md');
const CDP_URL = process.env.CDP_URL || 'http://localhost:9222';
const DELAY_MS = Number(process.env.DELAY_MS || 5000);
const LIMIT = process.env.LIMIT ? Number(process.env.LIMIT) : undefined;
const FILTER = process.env.FILTER;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Extract every Amazon-linked product object from src/file.ts ───────────────

function getStringLiteral(node) {
    return node && ts.isStringLiteral(node) ? node.text : undefined;
}

function getNumberLiteral(node) {
    return node && ts.isNumericLiteral(node) ? Number(node.text) : undefined;
}

function getPropName(node) {
    // `u.ounce` / `stores.amazon` -> 'ounce' / 'amazon'
    return node && ts.isPropertyAccessExpression(node) ? node.name.text : undefined;
}

function getBoolLiteral(node) {
    if (!node) return undefined;
    if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
    return undefined;
}

function findEnclosingIngredientCall(node) {
    let current = node.parent;
    while (current) {
        if (ts.isCallExpression(current) && ts.isIdentifier(current.expression) && current.expression.text === 'ingredientFactory') {
            return current;
        }
        current = current.parent;
    }
    return undefined;
}

function findEnclosingIngredientKey(node) {
    const call = findEnclosingIngredientCall(node);
    if (call && call.parent && ts.isPropertyAssignment(call.parent)) {
        const keyNode = call.parent.name;
        return ts.isIdentifier(keyNode) ? keyNode.text : keyNode.getText();
    }
    return undefined;
}

function getObjectProp(objNode, propName) {
    if (!objNode || !ts.isObjectLiteralExpression(objNode)) return undefined;
    const prop = objNode.properties.find((p) => ts.isPropertyAssignment(p) && ts.isIdentifier(p.name) && p.name.text === propName);
    return prop ? prop.initializer : undefined;
}

// `export const u = { ounce: { name: 'ounce', ... }, fluidOunce: { name: 'fl oz', ... }, ... }`
// Some unit keys' `.name` differs from the object key itself (fluidOunce -> 'fl oz', gram ->
// 'g'), so nutrition-object keys (`[u.fluidOunce.name]`) can't be resolved by identifier text
// alone — this walks the real `u` declaration once to build identifier -> name-string.
function extractUnitNameMap(sourceFile) {
    const map = {};
    function visit(node) {
        if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'u' && node.initializer && ts.isObjectLiteralExpression(node.initializer)) {
            for (const prop of node.initializer.properties) {
                if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name) && ts.isObjectLiteralExpression(prop.initializer)) {
                    const nameNode = getObjectProp(prop.initializer, 'name');
                    const nameText = getStringLiteral(nameNode);
                    if (nameText !== undefined) map[prop.name.text] = nameText;
                }
            }
        }
        ts.forEachChild(node, visit);
    }
    visit(sourceFile);
    return map;
}

// Resolves a nutrition object's computed property key, e.g. `u.fluidOunce.name`, to the
// runtime string it evaluates to ('fl oz'), via the identifier -> name-string map above.
function resolveNutritionKey(exprNode, unitNameMap) {
    if (
        exprNode &&
        ts.isPropertyAccessExpression(exprNode) &&
        exprNode.name.text === 'name' &&
        ts.isPropertyAccessExpression(exprNode.expression) &&
        ts.isIdentifier(exprNode.expression.expression) &&
        exprNode.expression.expression.text === 'u'
    ) {
        return unitNameMap[exprNode.expression.name.text];
    }
    return undefined;
}

function extractNutritionMap(objNode, unitNameMap) {
    const map = {};
    if (!objNode || !ts.isObjectLiteralExpression(objNode)) return map;
    for (const prop of objNode.properties) {
        if (!ts.isPropertyAssignment(prop)) continue;
        let key;
        if (ts.isComputedPropertyName(prop.name)) {
            key = resolveNutritionKey(prop.name.expression, unitNameMap);
        } else if (ts.isStringLiteral(prop.name)) {
            key = prop.name.text;
        } else if (ts.isIdentifier(prop.name)) {
            key = prop.name.text;
        }
        if (!key || !ts.isObjectLiteralExpression(prop.initializer)) continue;
        const fields = {};
        for (const fp of prop.initializer.properties) {
            if (ts.isPropertyAssignment(fp) && ts.isIdentifier(fp.name)) {
                fields[fp.name.text] = getNumberLiteral(fp.initializer);
            }
        }
        map[key] = fields;
    }
    return map;
}

function extractDiscount(discountNode) {
    const discount = {};
    if (discountNode && ts.isObjectLiteralExpression(discountNode)) {
        for (const dp of discountNode.properties) {
            if (ts.isPropertyAssignment(dp) && ts.isIdentifier(dp.name)) {
                discount[dp.name.text] = getBoolLiteral(dp.initializer);
            }
        }
    }
    return discount;
}

// Each result is one (product, listing) pair, matching how the app itself resolves a
// row to display/price — a Product (brand/variant/size/nutrition) can have several
// Listings (store/link/price/discount), one per retailer it's sold through.
function extractAmazonListings(sourceFile) {
    const results = [];
    const unitNameMap = extractUnitNameMap(sourceFile);

    function visit(node) {
        if (
            ts.isObjectLiteralExpression(node) &&
            node.parent && ts.isArrayLiteralExpression(node.parent) &&
            node.parent.parent && ts.isPropertyAssignment(node.parent.parent) &&
            ts.isIdentifier(node.parent.parent.name) && node.parent.parent.name.text === 'products'
        ) {
            const props = {};
            for (const prop of node.properties) {
                if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) props[prop.name.text] = prop.initializer;
            }

            const listingsNode = props.listings;
            if (listingsNode && ts.isArrayLiteralExpression(listingsNode)) {
                // Resolution order matches the app's own documented rule (requirements.md):
                // a product's own `nutrition` wins if present, else the ingredient's shared one.
                const productNutrition = extractNutritionMap(props.nutrition, unitNameMap);
                const ingredientCall = findEnclosingIngredientCall(node);
                const ingredientNutritionNode = getObjectProp(ingredientCall?.arguments[1], 'nutrition');
                const ingredientNutrition = extractNutritionMap(ingredientNutritionNode, unitNameMap);
                const nutrition = Object.keys(productNutrition).length > 0 ? productNutrition : ingredientNutrition;
                const ingredientKey = findEnclosingIngredientKey(node);
                const brand = getStringLiteral(props.brand);
                const variant = getStringLiteral(props.variant);
                const size = getNumberLiteral(props.size);
                const sizeUnit = getPropName(props.sizeUnit);

                for (const listingEl of listingsNode.elements) {
                    if (!ts.isObjectLiteralExpression(listingEl)) continue;
                    const listingProps = {};
                    const listingPropNodes = {};
                    for (const lp of listingEl.properties) {
                        if (ts.isPropertyAssignment(lp) && ts.isIdentifier(lp.name)) {
                            listingProps[lp.name.text] = lp.initializer;
                            listingPropNodes[lp.name.text] = lp;
                        }
                    }
                    const link = getStringLiteral(listingProps.link);
                    if (!link || !link.includes('amazon.com')) continue;

                    results.push({
                        ingredientKey,
                        brand,
                        variant,
                        store: getPropName(listingProps.store),
                        link,
                        price: getNumberLiteral(listingProps.price),
                        size,
                        sizeUnit,
                        nutrition,
                        discount: extractDiscount(listingProps.discount),
                        line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
                        priceLine: listingPropNodes.price
                            ? sourceFile.getLineAndCharacterOfPosition(listingPropNodes.price.getStart()).line + 1
                            : undefined,
                    });
                }
            }
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return results;
}

// Compares scraped macros against whichever nutrition entry file.ts records for this product
// (or its ingredient, per the resolution order captured in `nutrition`). With exactly one
// recorded unit entry (the common case) it's used directly; with several, only compares when
// the scraped serving unit confidently matches one of them — otherwise stays silent rather
// than risk comparing the wrong serving size against the wrong unit.
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
    const sizeMatch = servingSizeText.match(/^([\d.\/]+)\s*(.+)$/);

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

    lines.push('# Amazon Product Audit');
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
            lines.push(`- \`${r.product.ingredientKey ?? '?'}\` — ${r.product.brand ?? '?'} — [file.ts:${r.product.line}](../src/file.ts#L${r.product.line}) · ${r.product.link}`);
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
    lines.push(`[file.ts:${product.line}](../src/file.ts#L${product.line}) · ${product.link}`);
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
// bypassing the file.ts diff pipeline entirely — for a brand-new ingredient not in the file yet.
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
    const sourceFile = ts.createSourceFile(FILE_PATH, source, ts.ScriptTarget.Latest, true);
    let products = extractAmazonListings(sourceFile);

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
        if (product.store === 'wholeFoods') {
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
            if (product.store !== 'amazon') {
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
