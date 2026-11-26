import assert from 'node:assert/strict';
import test from 'node:test';
import {
    Timer,
    cleanup,
    convertUnits,
    convertWithDensity,
    createRecipe,
    e,
    formatIngredient,
    generateCleanupLabels,
    getSelectedRecipes,
    getServings,
    i,
    info,
    instruction,
    isHhmm,
    normalizePlanConfig,
    prep,
    prepOnly,
    schedulePlan,
    subscribeAndSavePercent,
    time,
    timerStep,
    u,
    walkSteps,
} from '../src/file.js';

test('clock strings and plan config keep only blocks the planner can use', () => {
    assert.equal(isHhmm('23:59'), true);
    assert.equal(isHhmm('24:00'), false);
    assert.equal(isHhmm('7:00'), false);
    assert.equal(isHhmm(700), false);
    const fallback = normalizePlanConfig(null);
    assert.equal(fallback.blocks.length, 5);
    assert.equal(normalizePlanConfig({ caloriesCutoff: '08:00' }).blocks.length, 5);
    const dropped = normalizePlanConfig({
        blocks: [null, { id: 'bad', start: '01:00', end: '02:00', type: 'nope' }],
        caloriesCutoff: '99:00',
    });
    assert.equal(dropped.blocks[0].start, '07:00');
    assert.equal(dropped.caloriesCutoff, '14:00');
});

test('subscribe and save uses the highest tier and units convert within a cluster', () => {
    assert.equal(subscribeAndSavePercent({}), undefined);
    assert.equal(subscribeAndSavePercent({ subscribeAndSave10: true }), 10);
    assert.equal(subscribeAndSavePercent({ subscribeAndSave5: true }), 5);
    assert.equal(convertUnits(2, 'cup', 'cup'), 2);
    assert.equal(time.hours(1), 3600);
    assert.equal(convertWithDensity(1, 'cup', 'g', { tbsp: { to: { name: 'cup' }, factor: 1 / 16 } }), null);
});

test('ingredient text covers unnamed units and counted items', () => {
    assert.equal(formatIngredient({ name: 'Pinch' }), 'Pinch');
    assert.equal(formatIngredient({ name: 'Egg', quantity: 2, unit: u.unit }), '2 Eggs');
    assert.equal(formatIngredient({ name: 'Egg', quantity: 1, unit: u.unit }), '1 Egg');
});

test('step builders chain dependencies and date labels land after the last use', () => {
    const first = instruction('crack');
    const second = instruction('whisk').waitFor(first);
    second.startWhen(first);
    assert.deepEqual(second.waitForIds, [first.id]);
    assert.deepEqual(second.startWhenIds, [first.id]);
    assert.equal(prep('soak').prep, true);
    assert.equal(prepOnly('portion').prepOnly, true);
    assert.equal(Timer.set(1, 'h', 'rest').durationSeconds, 3600);
    assert.equal(Timer.gate('set?', 30, 's').type, 'gate');
    assert.match(cleanup('pan').text, /pan/);
    assert.equal(info('note', { linkRecipeId: 'scrambled-eggs' }).type, 'info');
    const milk = i.macadamiaNutMilk(1, u.cup);
    milk.requiresDateLabel = true;
    assert.match(generateCleanupLabels([milk], { [milk.name]: 'Label the jar' })[0].text, /Label the jar/);
    const heat = timerStep('heat milk', 60, { ingredients: [milk], equipment: ['pan'] });
    const recipe = createRecipe('label-test', 'Label test', [heat]);
    assert.equal(recipe.steps.length, 2);
    assert.match(recipe.steps[1].text, /date/);
    assert.deepEqual(
        [...walkSteps(recipe.steps)].map((step) => step.type),
        ['timer', 'instruction'],
    );
});

test('the NuWave pan preheats in 2 minutes and other appliances stay at 15', () => {
    const pan = e.pan();
    const step = pan.preheat(350);
    assert.equal(pan.targetTemp, 350);
    assert.equal(step.text, 'Preheat Nuwave pan to 350°');
    assert.equal(step.durationSeconds, time.minutes(2));
    assert.equal(e.pan().preheat(300).durationSeconds, time.minutes(2));
    assert.equal(e.pan().preheat(400).durationSeconds, time.minutes(2));
    assert.equal(e.oven().preheat(450).durationSeconds, time.minutes(15));
    assert.equal(e.pot().preheat(215).durationSeconds, time.minutes(15));
    assert.equal(e.toasterOven().preheat(350).durationSeconds, time.minutes(15));
});

test('an empty selection reports no servings', () => {
    assert.equal(getServings('not-selected'), 0);
    assert.deepEqual(getSelectedRecipes(), []);
});

test('a recipe with nowhere to sit stays unscheduled', () => {
    const result = schedulePlan(
        {
            blocks: [{ id: 'away', start: '08:00', end: '12:00', type: 'away' }],
            caloriesCutoff: '14:00',
        },
        [{ recipe: { id: 'lunch', name: 'Lunch', steps: [], portable: false, planMinutes: 20 }, count: 1 }],
    );
    assert.deepEqual(result.scheduled, []);
    assert.equal(result.unscheduled.length, 1);
    const zero = schedulePlan(
        {
            blocks: [{ id: 'home', start: '08:00', end: '09:00', type: 'home' }],
            caloriesCutoff: '14:00',
        },
        [{ recipe: { id: 'note', name: 'Note', steps: [], portable: false }, count: 2 }],
    );
    assert.equal(zero.scheduled.length, 1);
    assert.equal(zero.scheduled[0].count, 2);
});

test('pot boilWater times a real timer from heat and ounces', () => {
    const pot = e.pot();
    const calibrated = pot.boilWater(575, 21);
    assert.equal(calibrated.type, 'timer');
    assert.equal(calibrated.durationSeconds, 7 * 60);
    assert.deepEqual(calibrated.equipment, ['pot']);
    assert.equal(calibrated.text, 'Bring water to a boil in pot (575°) ~7 min');
    assert.equal(calibrated.text.includes('Estimated'), false);

    const goodles = pot.boilWater(575, 20);
    assert.equal(goodles.durationSeconds, 6 * 60 + 40);
    assert.equal(goodles.text, 'Bring water to a boil in pot (575°) Estimated ~6 min 40 sec');

    const moreWater = pot.boilWater(575, 32);
    assert.equal(moreWater.durationSeconds, 10 * 60 + 40);
    assert.equal(moreWater.text, 'Bring water to a boil in pot (575°) Estimated ~10 min 40 sec');

    const cooler = pot.boilWater(450, 21);
    assert.equal(cooler.durationSeconds, 9 * 60 + 18);
    assert.equal(cooler.text, 'Bring water to a boil in pot (450°) Estimated ~9 min 18 sec');

    const labeled = e.pot('6-quart pot').boilWater(575, 48);
    assert.equal(labeled.durationSeconds, 16 * 60);
    assert.equal(labeled.text, 'Bring water to a boil in 6-quart pot (575°) Estimated ~16 min');

    const longBoil = pot.boilWater(213, 200);
    assert.ok(longBoil.durationSeconds > 3600);
    assert.match(longBoil.text, /Estimated ~\d+ hr /);

    const fewSeconds = pot.boilWater(575, 0.05);
    assert.equal(fewSeconds.durationSeconds, 1);
    assert.match(fewSeconds.text, /Estimated ~1 sec/);

    const none = pot.boilWater(575, 0.01);
    assert.equal(none.durationSeconds, 0);
    assert.match(none.text, /Estimated ~0 sec/);

    assert.throws(() => pot.boilWater(70, 21), /room temperature/);
    assert.throws(() => pot.boilWater(32, 21), /room temperature/);
    assert.throws(() => pot.boilWater(Number.NaN, 21), /room temperature/);
    assert.throws(() => pot.boilWater(212, 21), /boiling/);
    assert.throws(() => pot.boilWater(180, 21), /boiling/);
    assert.throws(() => pot.boilWater(575, 0), /ounces/);
    assert.throws(() => pot.boilWater(575, -4), /ounces/);
    assert.throws(() => pot.boilWater(575, Number.NaN), /ounces/);
});
