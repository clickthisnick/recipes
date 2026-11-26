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
