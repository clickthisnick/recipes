// Shared calculator and form helpers for the static kitchen pages.
// Plain ESM so the pages can import it without a build step.

export const GALLON_RATES = {
    litersPerGallon: 3.78,
    bottlesPerGallon: 5.12,
};

export const TRACKER_NUTRIENTS = [
    ['calories', 'Calories', 'cal'],
    ['protein', 'Protein', 'g'],
    ['carbs', 'Carbs', 'g'],
    ['total_fat', 'Total fat', 'g'],
    ['saturated_fat', 'Saturated fat', 'g'],
    ['fiber', 'Fiber', 'g'],
    ['sugar', 'Sugar', 'g'],
    ['sodium', 'Sodium', 'mg'],
];

function parseAmount(value) {
    if (typeof value === 'number') return value;
    const text = String(value ?? '').trim();
    if (!text) return Number.NaN;
    return Number(text);
}

export function gallonsDrank(liters, cleanBottles, rates = GALLON_RATES) {
    const parsed = [liters, cleanBottles].map(parseAmount);
    if (parsed.some((amount) => !Number.isFinite(amount) || amount < 0)) {
        return {
            ok: false,
            gallons: null,
            error: 'Enter zero or a positive number for each container.',
        };
    }
    if (!(rates.litersPerGallon > 0) || !(rates.bottlesPerGallon > 0)) {
        return { ok: false, gallons: null, error: 'The chart is missing a per-gallon amount.' };
    }
    const [literCount, bottleCount] = parsed;
    const gallons = literCount / rates.litersPerGallon + bottleCount / rates.bottlesPerGallon;
    return { ok: true, gallons, error: null };
}

export function addCalendarDays(date, days) {
    const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    next.setDate(next.getDate() + days);
    return next;
}

export function formatUsDate(date) {
    return date.toLocaleDateString('en-US');
}

export function isoDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function sumSelectedNutrition(foods, selected, nutrients) {
    const totals = {};
    for (const nutrient of nutrients) totals[nutrient] = 0;
    for (const [key, quantity] of Object.entries(selected ?? {})) {
        const food = foods?.[key];
        if (!food || !Number.isFinite(quantity)) continue;
        const source = food.nutrition || food;
        for (const nutrient of nutrients) {
            const raw = source[nutrient];
            const value = typeof raw === 'number' ? raw : Number(raw?.value);
            totals[nutrient] += (Number.isFinite(value) ? value : 0) * quantity;
        }
    }
    return totals;
}

export function foodKeyFromName(name) {
    const key = String(name ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    return key || 'custom_food';
}

export function customFoodRecord(name, values) {
    const errors = [];
    const trimmed = typeof name === 'string' ? name.trim() : '';
    if (!trimmed) errors.push('Name is required.');
    const nutrition = {};
    for (const [key, label, unit] of TRACKER_NUTRIENTS) {
        const raw = values?.[key];
        const amount = typeof raw === 'number' ? raw : Number(String(raw ?? '').trim());
        if (!Number.isFinite(amount)) errors.push(`${label} must be a number.`);
        else if (amount < 0) errors.push(`${label} cannot be negative.`);
        else nutrition[key] = { value: amount, unit };
    }
    if (errors.length) return { ok: false, errors, record: null };
    return {
        ok: true,
        errors: [],
        record: {
            key: foodKeyFromName(trimmed),
            entry: { name: trimmed, ...nutrition },
        },
    };
}

// Keep aria-invalid aligned with the field after blur or submit, not while typing.
export function bindUserInvalid(form) {
    const fields = [...form.querySelectorAll('input, select, textarea')];
    const dirty = new WeakSet();

    const linkError = (field, shown) => {
        const errorId = field.dataset.error;
        if (!errorId) return;
        const ids = (field.getAttribute('aria-describedby') || '')
            .split(/\s+/)
            .filter((id) => id && id !== errorId);
        if (shown) ids.push(errorId);
        if (ids.length) field.setAttribute('aria-describedby', ids.join(' '));
        else field.removeAttribute('aria-describedby');
    };

    const paint = (field, showError) => {
        const invalid = showError && !field.validity.valid;
        field.classList.toggle('user-invalid-fallback', invalid);
        field.setAttribute('aria-invalid', invalid ? 'true' : 'false');
        linkError(field, invalid);
    };

    for (const field of fields) {
        field.setAttribute('aria-invalid', 'false');
        field.addEventListener('input', () => {
            dirty.add(field);
            if (field.validity.valid) paint(field, false);
        });
        field.addEventListener('blur', () => {
            if (!dirty.has(field)) return;
            paint(field, true);
        });
    }

    form.addEventListener('submit', (event) => {
        const invalid = fields.filter((field) => !field.validity.valid);
        if (!invalid.length) return;
        event.preventDefault();
        for (const field of fields) paint(field, true);
        invalid[0].focus();
    });
}

// WebMCP is an early Chromium preview. Other browsers have no modelContext, so this is a no-op.
export const SITE_PAGES = [
    { id: 'home', name: 'Kitchen tools', path: 'index.html' },
    { id: 'recipes', name: 'Recipes', path: 'dist/main.html' },
    { id: 'tracker', name: 'Nutrition tracker', path: 'tracker.html' },
    { id: 'tracker-custom', name: 'Add custom food', path: 'tracker.html#custom' },
    { id: 'meat-temperature', name: 'Meat temperature', path: 'meatTemp.html' },
    { id: 'water-intake', name: 'Water intake', path: 'waterIntake.html' },
    { id: 'grocery-list', name: 'Grocery list', path: 'groceryList.html' },
    { id: 'expiration', name: 'Expiration calculator', path: 'expirationCalculator.html' },
    { id: 'cord-slicer', name: 'Pull cord slicer', path: 'cordSlicer.html' },
    { id: 'frozen-food', name: 'Frozen food portions', path: 'frozenFood.html' },
    { id: 'eat-this', name: 'Eat this instead', path: 'eatThis.html' },
];

function siteRootHref() {
    const url = new URL(window.location.href);
    return new URL(url.pathname.includes('/dist/') ? '../' : './', url);
}

export function siteNavigationTools() {
    if (typeof window === 'undefined') return [];
    const hrefFor = (path) => new URL(path, siteRootHref()).href;
    return [
        {
            name: 'list-pages',
            description: 'List every kitchen tool page and its address.',
            inputSchema: { type: 'object', properties: {} },
            execute() {
                return { pages: SITE_PAGES.map((page) => ({ id: page.id, name: page.name, href: hrefFor(page.path) })) };
            },
            annotations: { readOnlyHint: true },
        },
        {
            name: 'open-page',
            description: 'Open another kitchen tool page.',
            inputSchema: {
                type: 'object',
                properties: { pageId: { type: 'string', description: 'Page id from list-pages.' } },
                required: ['pageId'],
            },
            execute(input) {
                const page = SITE_PAGES.find((entry) => entry.id === input?.pageId);
                if (!page) return { error: 'Unknown page.', pages: SITE_PAGES.map((entry) => entry.id) };
                const href = hrefFor(page.path);
                window.location.assign(href);
                return { opened: page.id, href };
            },
            annotations: { readOnlyHint: false },
        },
    ];
}

export function registerAgentTools(tools) {
    const context = typeof document !== 'undefined' ? document.modelContext : undefined;
    if (!context || typeof context.registerTool !== 'function') return () => {};
    const controller = new AbortController();
    for (const tool of [...tools, ...siteNavigationTools()]) {
        Promise.resolve(context.registerTool(tool, { signal: controller.signal })).catch(() => {});
    }
    const stop = () => controller.abort();
    if (typeof window !== 'undefined') window.addEventListener('pagehide', stop, { once: true });
    return stop;
}
