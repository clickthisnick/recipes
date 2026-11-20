// Before/after UI snapshot harness (not run in CI).
//
//   npx playwright install webkit
//   npm run build
//   SNAP_DIR=/tmp/snap-before node tests/snapshot.mjs     # on main
//   SNAP_DIR=/tmp/snap-after  node tests/snapshot.mjs     # on your branch
//   node tests/snapshot.mjs --compare /tmp/snap-before /tmp/snap-after
//
// Drives every screen of the recipe app and every static page in WebKit at an
// iPhone-sized viewport with a frozen clock, then saves each screen's DOM
// (normalized) and a screenshot. --compare diffs the DOM text and the PNG bytes.
import { spawn } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

if (process.argv[2] === '--compare') {
    const [a, b] = process.argv.slice(3);
    let diffs = 0;
    for (const file of readdirSync(a).sort()) {
        const left = readFileSync(join(a, file));
        let right;
        try { right = readFileSync(join(b, file)); } catch { console.log(`missing  ${file}`); diffs++; continue; }
        if (!left.equals(right)) { console.log(`differs  ${file}`); diffs++; }
    }
    console.log(diffs ? `${diffs} file(s) differ` : 'identical');
    process.exit(diffs ? 1 : 0);
}

const { webkit } = await import('playwright');
const out = process.env.SNAP_DIR || '/tmp/snap';
mkdirSync(out, { recursive: true });
const port = Number(process.env.SNAP_PORT || 3917);
const server = spawn(process.execPath, ['scripts/serve.js'], { env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 600));
const base = `http://localhost:${port}`;
const FIXED = new Date('2026-11-20T18:00:00-05:00');

const browser = await webkit.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: false });
const errors = [];

async function open(path) {
    const page = await context.newPage();
    page.on('pageerror', (e) => errors.push(`${path}: ${e.message}`));
    // Headless WebKit audio is flaky; the alarm logic, not the speaker, is under test.
    await page.addInitScript(() => {
        HTMLMediaElement.prototype.play = function play() { return Promise.resolve(); };
        HTMLMediaElement.prototype.pause = function pause() {};
    });
    await page.clock.install({ time: FIXED });
    await page.goto(base + path);
    await page.waitForLoadState('load');
    return page;
}

async function snap(page, name) {
    await page.waitForTimeout(150);
    const html = await page.evaluate(() => {
        const clone = document.body.cloneNode(true);
        clone.querySelectorAll('.build-footer').forEach((el) => { el.textContent = 'BUILD'; });
        // Attribute order is not behavior: sort it so refactors that set props in a
        // different order compare equal.
        for (const el of [clone, ...clone.querySelectorAll('*')]) {
            const attrs = [...el.attributes].map((a) => [a.name, a.value]).sort(([a], [b]) => a.localeCompare(b));
            for (const [name] of attrs) el.removeAttribute(name);
            for (const [name, value] of attrs) el.setAttribute(name, value);
        }
        return clone.outerHTML.replace(/>\s+</g, '><').replace(/adhoc:([a-z-]+):\d+-\d+/g, 'adhoc:$1:ID');
    });
    writeFileSync(join(out, `${name}.html`), html + '\n');
    await page.mouse.move(0, 0);
    await page.screenshot({ path: join(out, `${name}.png`), fullPage: true, animations: 'disabled', caret: 'hide', mask: [page.locator('.build-footer')] });
}

const tid = (page, id) => page.locator(`[data-testid="${id}"]`);

async function selectRecipes(page, ids) {
    for (const id of ids) await tid(page, `recipe-${id}`).click();
}

// ── Recipe app ──────────────────────────────────────────────
let p = await open('/dist/main.html');
await snap(p, '01-select');
await selectRecipes(p, ['blueprint-smoothie', 'blueprint-smoothie', 'quinoa-falafel']);
await snap(p, '02-select-picked');
await tid(p, 'remove-serving-blueprint-smoothie').click();
await p.locator('.show-hidden-toggle').click();
await snap(p, '03-select-hidden');
await p.locator('.show-hidden-toggle').click();
await tid(p, 'recipe-search').fill('chicken');
await snap(p, '04-select-search');
await p.close();

p = await open('/dist/main.html');
await tid(p, 'bundle-daily-blueprint').click();
await snap(p, '05-select-bundle');
await p.close();

p = await open('/dist/main.html');
await selectRecipes(p, ['quinoa-falafel', 'pan-seared-chicken-sausage', 'pan-seared-chicken-sausage']);
await tid(p, 'go-shopping').click();
await snap(p, '06-shopping');
await p.locator('.inventory-have-input').first().fill('1');
await p.locator('.panel').nth(1).click({ position: { x: 5, y: 5 } });
await snap(p, '07-shopping-edited');
await p.close();

p = await open('/dist/main.html');
await selectRecipes(p, ['quinoa-falafel', 'blueprint-smoothie', 'blueprint-smoothie']);
await tid(p, 'open-nutrition').click();
await snap(p, '08-nutrition');
await p.locator('.nutrition-recipe-header').first().click({ position: { x: 5, y: 5 } });
await p.locator('.nutrition-ingredient-toggle').first().click();
await p.locator('.nutrition-eaten-btn').nth(1).click();
await snap(p, '09-nutrition-expanded');
await tid(p, 'nutrition-recipe-search').fill('egg');
await snap(p, '10-nutrition-search');
await p.locator('.nutrition-serving-btn').nth(1).click();
await snap(p, '11-nutrition-plus');
await p.close();

p = await open('/dist/main.html');
await selectRecipes(p, ['quinoa-falafel', 'asian-dense-bean-salad']);
await tid(p, 'open-prep').click();
await snap(p, '12-prep');
await p.locator('.prep-step').first().click();
await p.getByText('Notes', { exact: false }).first().click();
await snap(p, '13-prep-notes');
await p.close();

p = await open('/dist/main.html');
await selectRecipes(p, ['quinoa-falafel', 'blueprint-smoothie', 'asian-dense-bean-salad']);
await tid(p, 'open-plan').click();
await snap(p, '14-plan');
await tid(p, 'add-plan-block').click();
await p.locator('.plan-block-del').first().click();
await snap(p, '15-plan-edited');
await p.close();

p = await open('/dist/main.html');
await tid(p, 'add-ingredient').click();
await snap(p, '16-add-ingredient');
await tid(p, 'ingredient-search').fill('salt');
await p.locator('.adhoc-item').first().click();
await snap(p, '17-add-ingredient-detail');
await p.locator('.adhoc-confirm').click();
await snap(p, '18-select-adhoc');
await tid(p, 'open-nutrition').click();
await snap(p, '19-nutrition-adhoc');
await p.close();

p = await open('/dist/main.html?recipe=test-recipe-all-features');
await snap(p, '20-cooking-all-features');
for (const notes of await p.locator('.info-step-header, .info-step summary').all()) await notes.click();
await snap(p, '21-cooking-notes-open');
const timer = p.locator('.panel:not(.step-locked):not(.sound-check-btn)').filter({ has: p.locator('.timer-duration-badge') }).first();
await timer.click();
await p.clock.runFor(3000);
await snap(p, '22-cooking-timer-running');
await p.clock.runFor(60 * 60 * 1000);
await snap(p, '23-cooking-timer-ringing');
await p.locator('h1').click();
await snap(p, '24-cooking-timer-done');
await p.close();

p = await open('/dist/main.html');
await selectRecipes(p, ['pan-seared-chicken-sausage', 'nuwave-pork-shoulder']);
await tid(p, 'start-cooking').click();
await p.clock.runFor(5000);
await snap(p, '25-cooking-two-recipes');
await p.locator('.gate-no-btn').first().click();
await p.clock.runFor(2000);
await snap(p, '26-cooking-gate-retry');
await p.close();

// ── Static pages ────────────────────────────────────────────
for (const page of ['index', 'meatTemp', 'cordSlicer', 'frozenFood', 'eatThis', 'groceryList', 'expirationCalculator', 'waterIntake', 'tracker']) {
    p = await open(`/${page}.html`);
    await snap(p, `30-${page}`);
    if (page === 'groceryList' || page === 'eatThis' || page === 'expirationCalculator') {
        await p.locator('tbody input[type="checkbox"]').first().check();
        await snap(p, `31-${page}-checked`);
    }
    if (page === 'waterIntake') {
        await tid(p, 'liters').fill('2');
        await tid(p, 'calculate-gallons').click();
        await snap(p, '31-waterIntake-result');
    }
    if (page === 'tracker') {
        await tid(p, 'food-select').selectOption({ index: 2 });
        await tid(p, 'update-nutrition').click();
        await snap(p, '31-tracker-table');
        await tid(p, 'tab-custom').click();
        await tid(p, 'custom-name').fill('Test food');
        for (const input of await p.locator('#nutrient-fields input').all()) await input.fill('1');
        await tid(p, 'build-custom-food').click();
        await snap(p, '32-tracker-custom');
    }
    await p.close();
}

await browser.close();
server.kill();
writeFileSync(join(out, 'errors.txt'), errors.join('\n') + '\n');
console.log(`saved to ${out}${errors.length ? ` with ${errors.length} page error(s)` : ''}`);
