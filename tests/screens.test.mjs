import assert from 'node:assert/strict';
import test from 'node:test';
import { parseHTML } from 'linkedom';

test('the recipe screens render from the select list through cooking', async () => {
    const { document, window } = parseHTML('<!doctype html><html><head></head><body></body></html>');
    globalThis.document = document;
    globalThis.window = window;
    for (const key of [
        'HTMLElement',
        'HTMLButtonElement',
        'HTMLInputElement',
        'HTMLSelectElement',
        'Document',
        'Node',
        'Event',
    ]) {
        if (window[key]) globalThis[key] = window[key];
    }
    window.setTimeout = (fn) => {
        fn();
        return 1;
    };
    window.clearTimeout = () => {};
    window.setInterval = () => 1;
    window.clearInterval = () => {};
    window.location = { origin: 'http://localhost:3000', pathname: '/main.html', search: '', hash: '' };
    globalThis.MutationObserver = class {
        observe() {}
        disconnect() {}
    };
    document.modelContext = {
        registerTool() {
            return Promise.resolve();
        },
    };

    await import('../src/file.js');
    document.dispatchEvent(new window.Event('DOMContentLoaded'));

    assert.equal(document.title, 'Recipes');
    const recipe = document.querySelector('[data-testid="recipe-scrambled-eggs"]');
    assert.ok(recipe);
    recipe.click();
    assert.equal(document.querySelectorAll('.recipe-btn.selected').length, 1);

    const open = (id) => document.querySelector(`[data-testid="${id}"]`).click();
    const back = () =>
        [...document.querySelectorAll('button')].find((button) => /Back/.test(button.textContent)).click();
    const startOver = () =>
        [...document.querySelectorAll('button')].find((button) => /Start Over/.test(button.textContent)).click();
    const heading = () => document.querySelector('h1, h2').textContent;

    open('go-shopping');
    assert.match(heading(), /Shopping/);
    startOver();
    document.querySelector('[data-testid="recipe-scrambled-eggs"]').click();

    open('open-nutrition');
    assert.match(heading(), /Nutrition/);
    startOver();
    document.querySelector('[data-testid="recipe-scrambled-eggs"]').click();

    open('open-plan');
    assert.match(heading(), /Day Planner/);
    back();
    assert.match(heading(), /Recipes/);
    document.querySelector('[data-testid="recipe-scrambled-eggs"]').click();

    open('start-cooking');
    assert.match(heading(), /Cooking/);
    assert.ok(document.querySelectorAll('.panel').length > 1);
    const eggPreheat = [...document.querySelectorAll('.panel')].find((panel) =>
        panel.textContent.includes('Preheat Nuwave pan to 300°'),
    );
    assert.equal(eggPreheat.querySelector('.timer-duration-badge').textContent, '2m');

    startOver();
    document.querySelector('[data-testid="recipe-pan-seared-chicken-sausage"]').click();
    open('start-cooking');
    const sausagePreheat = [...document.querySelectorAll('.panel')].find((panel) =>
        panel.textContent.includes('Preheat Nuwave pan to 350°'),
    );
    assert.equal(sausagePreheat.querySelector('.timer-duration-badge').textContent, '2m');

    startOver();
    document.querySelector('[data-testid="recipe-steakhouse-roasted-vegetables"]').click();
    open('start-cooking');
    const ovenPreheat = [...document.querySelectorAll('.panel')].find((panel) =>
        panel.textContent.includes('Preheat oven to 450°'),
    );
    assert.equal(ovenPreheat.querySelector('.timer-duration-badge').textContent, '15m');

    startOver();
    assert.match(heading(), /Recipes/);
    document.querySelector('[data-testid="recipe-goodles-noodles"]').click();
    open('start-cooking');
    assert.match(heading(), /Cooking/);
    const cooking = document.body.textContent;
    assert.match(cooking, /21 ounces Water/);
    assert.match(
        cooking,
        /Bring water to a boil in pot \(575°\)\. Estimated ~7 min\. At 575°: 16 oz ~5 min 20 sec, 21 oz ~7 min, 32 oz ~10 min 40 sec, 48 oz ~16 min/,
    );
    assert.match(cooking, /macaroni only; set the cheese packet aside/);
    assert.match(cooking, /Cook the macaroni, stirring occasionally/);
    const badges = [...document.querySelectorAll('.timer-duration-badge')].map((badge) => badge.textContent);
    assert.ok(badges.includes('7m'));
    assert.ok(badges.includes('9m'));
    assert.equal(cooking.includes('32 ounces'), false);
});
