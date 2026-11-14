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
