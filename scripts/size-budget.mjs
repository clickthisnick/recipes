import { readFileSync, statSync } from 'node:fs';

// Shipped bytes are the pages, scripts, styles, and alarm sound GitHub Pages serves.
// Tests, docs, and node_modules are not part of the budget.
const budget = JSON.parse(readFileSync(new URL('../guardrails.json', import.meta.url), 'utf8'));
const files = [
    'main.html',
    'dist/main.html',
    'index.html',
    'tracker.html',
    'waterIntake.html',
    'groceryList.html',
    'expirationCalculator.html',
    'meatTemp.html',
    'cordSlicer.html',
    'frozenFood.html',
    'eatThis.html',
    'src/file.js',
    'src/app.css',
    'src/site.css',
    'src/site-logic.js',
    'src/webmcp.js',
    'src/sounds/pager-beep.mp3',
];
let total = 0;
for (const file of files) total += statSync(file).size;
const max = budget.size.maxBytes;
console.log(`shipped ${total} bytes (budget ${max})`);
if (total > max) {
    console.error(`shipped assets grew by ${total - max} bytes`);
    process.exit(1);
}
