import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import {
    bindRowCheckboxes,
    bindUserInvalid,
    customFoodRecord,
    foodKeyFromName,
    gallonsDrank,
} from '../src/site-logic.js';
import { readTableTool, registerAgentTools } from '../src/webmcp.js';

const require = createRequire(import.meta.url);
const { requestPath, resolveSafePath } = require('../scripts/static-path.js');

test('gallon math rejects a chart with no per-gallon amount', () => {
    const result = gallonsDrank(1, 1, { litersPerGallon: 0, bottlesPerGallon: 5 });
    assert.equal(result.ok, false);
    assert.match(result.error, /chart/);
});

test('custom food keys drop punctuation and reject a missing number', () => {
    assert.equal(foodKeyFromName('  ***  '), 'custom_food');
    assert.equal(foodKeyFromName('Blue-Zones Bar!'), 'blue_zones_bar');
    const built = customFoodRecord('Tea', { calories: 'nope' });
    assert.equal(built.ok, false);
    assert.match(built.errors[0], /Calories/);
});

test('the static server rejects a null byte and a broken escape', () => {
    assert.equal(resolveSafePath('/tmp', '/ok\0'), null);
    assert.equal(resolveSafePath('/tmp', requestPath('/%E0%A4%A')), null);
    assert.equal(requestPath(''), '/');
});

test('checklist and form helpers announce from the elements they are given', () => {
    const status = { textContent: '' };
    const box = {
        checked: false,
        listeners: {},
        closest() {
            return { cells: [{ textContent: 'Kefir' }] };
        },
        addEventListener(type, fn) {
            this.listeners[type] = fn;
        },
    };
    const previous = globalThis.document;
    globalThis.document = { querySelectorAll: () => [box] };
    bindRowCheckboxes(status, 'marked tried', 'marked not tried');
    box.checked = true;
    box.listeners.change();
    assert.equal(status.textContent, 'Kefir marked tried');
    globalThis.document = previous;

    const field = fakeField({ valid: false });
    const form = fakeForm([field]);
    bindUserInvalid(form);
    field.listeners.input();
    field.listeners.blur();
    assert.equal(field.attrs['aria-invalid'], 'true');
    let prevented = false;
    form.listeners.submit({
        preventDefault() {
            prevented = true;
        },
    });
    assert.equal(prevented, true);
    assert.equal(field.focused, true);
});

test('the shared table tool reads rows, attributes, and lists', () => {
    const link = {
        textContent: 'Recipes',
        getAttribute: () => './main.html',
        querySelector: () => null,
    };
    const row = {
        querySelector(selector) {
            if (selector === 'th') return { textContent: 'Mushrooms' };
            if (selector === 'td') return { textContent: '' };
            return null;
        },
    };
    const note = { textContent: 'Freeze flat' };
    const previous = globalThis.document;
    globalThis.document = {
        querySelectorAll(selector) {
            if (selector === 'nav a') return [link];
            if (selector === 'tbody tr') return [row];
            if (selector === 'main li') return [note];
            return [];
        },
    };
    const tools = readTableTool('list-kitchen-tools', 'List tools', {
        row: 'nav a',
        resultKey: 'tools',
        columns: { name: {}, href: { attr: 'href' } },
    });
    assert.deepEqual(tools.execute(), { tools: [{ name: 'Recipes', href: './main.html' }] });
    const slices = readTableTool('read-slice-amounts', 'Read slices', {
        row: 'tbody tr',
        require: 'slices',
        columns: { item: { selector: 'th' }, slices: { selector: 'td' } },
    });
    assert.deepEqual(slices.execute(), { rows: [] });
    const notes = readTableTool('read-freezer-notes', 'Read notes', { row: 'main li', text: true, resultKey: 'notes' });
    assert.deepEqual(notes.execute(), { notes: ['Freeze flat'] });
    globalThis.document = previous;
});

test('WebMCP registration stores tools and stops on page hide', async () => {
    const registered = [];
    let hidden = null;
    const previousDocument = globalThis.document;
    const previousWindow = globalThis.window;
    globalThis.document = {
        modelContext: {
            registerTool(tool) {
                registered.push(tool.name);
                return Promise.resolve();
            },
        },
    };
    globalThis.window = {
        addEventListener(type, fn) {
            if (type === 'pagehide') hidden = fn;
        },
    };
    const stop = registerAgentTools([{ name: 'search-recipes' }, { name: 'list-selected-recipes' }]);
    await Promise.resolve();
    assert.deepEqual(registered, ['search-recipes', 'list-selected-recipes']);
    assert.equal(typeof stop, 'function');
    stop();
    assert.equal(typeof hidden, 'function');
    hidden();
    globalThis.document = previousDocument;
    globalThis.window = previousWindow;
});

test('the app shell stays well formed and the old URL still redirects', () => {
    const main = readFileSync(resolve('main.html'), 'utf8');
    const redirect = readFileSync(resolve('dist/main.html'), 'utf8');
    assert.match(main, /<\/html>\s*$/);
    assert.match(redirect, /location\.replace\('\.\.\/main\.html' \+ location\.search \+ location\.hash\)/);
    assert.match(redirect, /http-equiv="refresh"/);
    assert.match(redirect, /href="\.\.\/main\.html"/);
});

function fakeField({ valid }) {
    return {
        validity: { valid },
        dataset: { error: 'liters-error' },
        attrs: {},
        listeners: {},
        classList: { toggle() {} },
        focused: false,
        setAttribute(name, value) {
            this.attrs[name] = value;
        },
        getAttribute(name) {
            return this.attrs[name] || '';
        },
        removeAttribute(name) {
            delete this.attrs[name];
        },
        addEventListener(type, fn) {
            this.listeners[type] = fn;
        },
        focus() {
            this.focused = true;
        },
    };
}

function fakeForm(fields) {
    return {
        listeners: {},
        querySelectorAll: () => fields,
        addEventListener(type, fn) {
            this.listeners[type] = fn;
        },
    };
}
