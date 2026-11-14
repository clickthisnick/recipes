import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';
import {
    addCalendarDays,
    customFoodRecord,
    foodKeyFromName,
    formatUsDate,
    gallonsDrank,
    isoDate,
    sumSelectedNutrition,
} from '../src/site-logic.js';
import {
    cheapestListing,
    convertUnits,
    convertWithDensity,
    formatIngredient,
    i,
    normalizeInventory,
    normalizePlanConfig,
    schedulePlan,
    subscribeAndSavePercent,
    u,
} from '../dist/file.js';

const require = createRequire(import.meta.url);
const { requestPath, resolveSafePath } = require('../scripts/static-path.js');
const root = resolve('fixtures-root');

test('gallon math follows the chart instead of drifting constants', () => {
    assert.equal(gallonsDrank(3.78, 0).gallons, 1);
    assert.equal(gallonsDrank(0, 5.12).gallons, 1);
    assert.equal(gallonsDrank('1', '0').ok, true);
    assert.equal(gallonsDrank('', 1).ok, false);
    assert.equal(gallonsDrank(-1, 0).ok, false);
    assert.equal(gallonsDrank('nope', 0).ok, false);
});

test('expiration dates stay on the local calendar', () => {
    const start = new Date(2026, 10, 14);
    assert.equal(formatUsDate(start), '11/14/2026');
    assert.equal(isoDate(addCalendarDays(start, 3)), '2026-11-17');
    assert.equal(isoDate(addCalendarDays(new Date(2026, 0, 30), 3)), '2026-02-02');
});

test('custom food JSON rejects empty and negative values', () => {
    const missing = customFoodRecord('  ', { calories: 1 });
    assert.equal(missing.ok, false);
    const negative = customFoodRecord('Tea', { calories: -5, protein: 0, carbs: 0, total_fat: 0, saturated_fat: 0, fiber: 0, sugar: 0, sodium: 0 });
    assert.equal(negative.ok, false);
    const built = customFoodRecord('Raspberry Bar', { calories: 10, protein: 1, carbs: 2, total_fat: 0, saturated_fat: 0, fiber: 0, sugar: 0, sodium: 3 });
    assert.equal(built.ok, true);
    assert.equal(built.record.key, foodKeyFromName('Raspberry Bar'));
    assert.equal(built.record.entry.calories.unit, 'cal');
    assert.equal(built.record.entry.sodium.value, 3);
});

test('nutrition totals multiply quantity and skip unknown foods', () => {
    const foods = {
        oats: { calories: { value: 100 }, protein: { value: 4 } },
        tea: { nutrition: { calories: { value: 0 }, protein: { value: 0 } } },
    };
    const totals = sumSelectedNutrition(foods, { oats: 2, tea: 1, missing: 4 }, ['calories', 'protein']);
    assert.deepEqual(totals, { calories: 200, protein: 8 });
});

test('unit conversion and ingredient text', () => {
    assert.equal(convertUnits(16, 'tbsp', 'cup'), 1);
    assert.equal(convertUnits(1, 'pound', 'ounce'), 16);
    assert.equal(convertUnits(1, 'cup', 'g'), null);
    assert.equal(formatIngredient(i.seaSalt(0.5, u.tsp)), '½ tsp Sea Salt');
    assert.equal(formatIngredient(i.seaSalt(2, u.tbsp)), '2 tbsp Sea Salt');
    assert.equal(formatIngredient(i.seaSalt(2, u.cup)), '2 cups Sea Salt');
    assert.equal(formatIngredient(i.seaSalt(2 / 3, u.tsp)), '⅔ tsp Sea Salt');
    assert.equal(formatIngredient(i.seaSalt(1.5, u.cup)), '1½ cups Sea Salt');
});

test('density conversion stops when units cycle', () => {
    const conversions = {
        cup: { to: { name: 'tbsp' }, factor: 16 },
        tbsp: { to: { name: 'cup' }, factor: 1 / 16 },
    };
    assert.equal(convertWithDensity(1, 'cup', 'g', conversions), null);
    assert.equal(convertWithDensity(2, 'cup', 'tbsp', conversions), 32);
});

test('saved plan and inventory ignore corrupt values', () => {
    const fallback = normalizePlanConfig('nope');
    assert.equal(fallback.blocks[0].start, '07:00');
    assert.equal(fallback.caloriesCutoff, '14:00');
    const kept = normalizePlanConfig({
        blocks: [
            { id: 'ok', start: '09:00', end: '10:00', type: 'home' },
            { id: 'ok', start: '11:00', end: '12:00', type: 'home' },
            { id: 'bad', start: '99:00', end: '10:00', type: 'home' },
        ],
        caloriesCutoff: 'noon',
    });
    assert.equal(kept.blocks.length, 1);
    assert.equal(kept.blocks[0].id, 'ok');
    assert.equal(kept.caloriesCutoff, '14:00');
    const empty = normalizePlanConfig({ blocks: [], caloriesCutoff: '08:30' });
    assert.deepEqual(empty.blocks, []);
    assert.equal(empty.caloriesCutoff, '08:30');
    assert.deepEqual(normalizeInventory({ salt: 1, bad: '2', nan: Number.NaN, missing: null }), { salt: 1 });
    assert.deepEqual(normalizeInventory(['nope']), {});
});

test('the day plan skips blocks that cannot hold the recipe', () => {
    const recipe = { id: 'snack', name: 'Snack', steps: [], portable: true, planMinutes: 30 };
    const result = schedulePlan({
        blocks: [
            { id: 'away', start: '08:00', end: '12:00', type: 'away' },
            { id: 'lunch', start: '12:00', end: '12:20', type: 'portable' },
            { id: 'later', start: '15:00', end: '16:00', type: 'home' },
        ],
        caloriesCutoff: '14:00',
    }, [{ recipe, count: 1 }]);
    assert.equal(result.scheduled.length, 1);
    assert.equal(result.scheduled[0].startMin, 15 * 60);
    assert.equal(result.scheduled[0].afterCutoff, true);
    assert.deepEqual(result.unscheduled, []);
});

test('listing price uses the cheapest priced offer', () => {
    assert.equal(cheapestListing({ brand: 'Jar', listings: [{ price: 5 }, { price: 3 }, {}] }).price, 3);
    assert.equal(cheapestListing({ brand: 'Jar', listings: [{}, {}] }), undefined);
    assert.equal(subscribeAndSavePercent({ subscribeAndSave5: true, subscribeAndSave15: true }), 15);
    assert.equal(subscribeAndSavePercent(undefined), undefined);
});

test('the static server rejects paths that leave the site root', () => {
    assert.equal(resolveSafePath(root, '/'), root);
    assert.equal(resolveSafePath(root, '/index.html'), resolve(root, 'index.html'));
    assert.equal(resolveSafePath(root, '/../package.json'), null);
    assert.equal(resolveSafePath(root, requestPath('/%2e%2e/package.json')), null);
    assert.equal(resolveSafePath(root, requestPath('/index.html?x=1')), resolve(root, 'index.html'));
    assert.equal(resolveSafePath(root, '/%'), null);
    assert.equal(resolveSafePath(root, '/.git/config'), null);
    assert.equal(resolveSafePath(root, '/ok/../../etc/passwd'), null);
});

test('static pages keep the fixes agents and the calculators rely on', () => {
    const tracker = readFileSync(resolve('tracker.html'), 'utf8');
    assert.match(tracker, /key: '4_Kalamata_Olives'/);
    assert.doesNotMatch(tracker, /kalamata_olives_4/);
    assert.match(tracker, /id="custom"/);
    assert.match(tracker, /id="food-select"/);
    assert.doesNotMatch(tracker, /category:hover/);

    const water = readFileSync(resolve('waterIntake.html'), 'utf8');
    assert.match(water, /id="liters-per-gallon"/);
    assert.match(water, />3\.78</);
    assert.match(water, />5\.12</);
    assert.doesNotMatch(water, /\*\s*\.26|\*\s*0\.26/);

    const expiration = readFileSync(resolve('expirationCalculator.html'), 'utf8');
    assert.match(expiration, /data-expiration-days="3"/);
    assert.match(expiration, /data-expiration-days="7"/);
    assert.doesNotMatch(expiration, /weekAhead/);
    assert.match(expiration, />Mushrooms</);
    assert.match(expiration, />Sausage</);
    assert.match(expiration, />Carrot</);

    const index = readFileSync(resolve('index.html'), 'utf8');
    assert.match(index, /<title>Kitchen tools \| Recipes<\/title>/);
    assert.equal(index.match(/<h1>/g).length, 1);
    assert.match(index, /tracker\.html/);
});
