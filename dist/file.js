// ============================================================
// RECIPE SYSTEM
// Single-file architecture optimized for readability and AI context
// ============================================================
// ============================================================
// GLOBAL STATE
// ============================================================
// Recipe IDs to pin to the top of the list. Edit at build time.
const FAVORITE_RECIPE_IDS = [
    'blueprint-smoothie',
];
const state = {
    recipes: new Map(),
    selectedRecipeIds: [],
    timers: new Map(),
    screen: 'select',
    searchQuery: '',
    cookingPlanSteps: [],
    cookingStartedAt: null,
    cookingElapsedInterval: null,
    audioUnlocked: false,
};
// ============================================================
// ID HELPERS
// ============================================================
let nextStepId = 1;
function createId() { return nextStepId++; }
// ============================================================
// TIME HELPERS
// ============================================================
export const time = {
    seconds: (v) => v,
    minutes: (v) => v * 60,
    hours: (v) => v * 3600,
};
// ============================================================
// UNITS
// ============================================================
export const u = {
    none: { name: '' },
    cup: { name: 'cup', plural: 'cups' },
    tbsp: { name: 'tbsp' },
    tsp: { name: 'tsp' },
    ounce: { name: 'ounce', plural: 'ounces' },
    pound: { name: 'pound', plural: 'pounds' },
    fluidOunce: { name: 'fl oz', plural: 'fl oz' },
    unit: { name: 'unit' },
    handful: { name: 'handful' },
    spray: { name: 'spray' },
    bag: { name: 'bag' },
    gram: { name: 'g', plural: 'g' },
    shot: { name: 'shot', plural: 'shots' },
};
// ============================================================
// UNIT CONVERSION
// ============================================================
const CONVERSION_FACTORS = {
    // Volume cluster
    [u.tsp.name]: { [u.tsp.name]: 1, [u.tbsp.name]: 1 / 3, [u.cup.name]: 1 / 48, [u.fluidOunce.name]: 1 / 6 },
    [u.tbsp.name]: { [u.tsp.name]: 3, [u.tbsp.name]: 1, [u.cup.name]: 1 / 16, [u.fluidOunce.name]: 1 / 2 },
    [u.cup.name]: { [u.tsp.name]: 48, [u.tbsp.name]: 16, [u.cup.name]: 1, [u.fluidOunce.name]: 8 },
    [u.fluidOunce.name]: { [u.tsp.name]: 6, [u.tbsp.name]: 2, [u.cup.name]: 1 / 8, [u.fluidOunce.name]: 1 },
    // Weight cluster
    [u.ounce.name]: { [u.ounce.name]: 1, [u.pound.name]: 1 / 16, [u.gram.name]: 28.3495 },
    [u.pound.name]: { [u.ounce.name]: 16, [u.pound.name]: 1, [u.gram.name]: 453.592 },
    [u.gram.name]: { [u.ounce.name]: 1 / 28.3495, [u.pound.name]: 1 / 453.592, [u.gram.name]: 1 },
};
function convertUnits(quantity, from, to) {
    if (from === to)
        return quantity;
    const factor = CONVERSION_FACTORS[from]?.[to];
    if (factor === undefined)
        return null;
    return quantity * factor;
}
// Extends convertUnits with ingredient-specific density conversions (e.g. cup → oz).
// Tries: physical → density → density + physical chained.
// Returns null if no path exists.
function convertWithDensity(quantity, from, to, conversions) {
    const physical = convertUnits(quantity, from, to);
    if (physical !== null)
        return physical;
    if (!conversions)
        return null;
    const density = conversions[from];
    if (!density)
        return null;
    const afterDensity = quantity * density.factor;
    const intermediate = density.to.name;
    if (intermediate === to)
        return afterDensity;
    return convertUnits(afterDensity, intermediate, to);
}
// ============================================================
// FORMATTERS
// ============================================================
function pluralize(word, count) {
    return count === 1 ? word : `${word}s`;
}
function formatQuantity(quantity) {
    const fractions = {
        0.125: '⅛', 0.25: '¼', 0.333: '⅓', 0.5: '½', 0.75: '¾',
    };
    const whole = Math.floor(quantity);
    const decimal = Number((quantity - whole).toFixed(3));
    const fraction = Object.entries(fractions).find(([v]) => Math.abs(decimal - Number(v)) < 0.01)?.[1];
    if (!fraction)
        return String(quantity);
    return `${whole || ''}${fraction}`;
}
function formatIngredient(ingredient) {
    const { quantity, unit, name } = ingredient;
    if (!unit || !unit.name)
        return name;
    if (unit.name === 'unit')
        return `${formatQuantity(quantity ?? 0)} ${pluralize(name, quantity ?? 0)}`;
    const unitText = quantity === 1
        ? unit.name
        : unit.plural || pluralize(unit.name, quantity ?? 0);
    return `${formatQuantity(quantity ?? 0)} ${unitText} ${name}`;
}
// ============================================================
// STEP FACTORIES
// ============================================================
function createStep(input) {
    const step = { id: createId(), equipment: [], ingredients: [], children: [], ...input };
    step.waitFor = function (...steps) {
        for (const dep of steps) {
            step.waitForIds = [...(step.waitForIds ?? []), dep.id];
        }
        return step;
    };
    return step;
}
export function instruction(text, opts = {}) {
    return createStep({ type: 'instruction', text, ...opts });
}
export function timerStep(label, durationSeconds, opts = {}) {
    return createStep({ type: 'timer', text: label, durationSeconds, ...opts });
}
export const Timer = {
    set: (amount, unit, label) => {
        const seconds = unit === 's' ? amount : unit === 'm' ? amount * 60 : amount * 3600;
        return createStep({ type: 'timer', text: label, durationSeconds: seconds });
    },
};
export function cleanup(equipmentName) {
    return createStep({
        type: 'cleanup',
        text: `Clean and put away ${equipmentName}`,
        equipment: [equipmentName],
    });
}
export function generateCleanupLabels(ingredients, customTexts) {
    return ingredients
        .filter(ing => ing.requiresDateLabel)
        .map(ing => instruction(customTexts?.[ing.name] ?? `Write today's date on the ${ing.name} bottle with a Sharpie`));
}
// ============================================================
// EQUIPMENT
// ============================================================
class Equipment {
    constructor(type, label) {
        this.type = type;
        this.label = label;
        this.contents = [];
        this.nestedVessels = [];
        this._result = null;
    }
    get name() { return this.label ?? this.type; }
    get result() {
        if (!this._result)
            throw new Error(`${this.name}.result accessed before any mix() or combine() call`);
        return this._result;
    }
    getContents() {
        return [
            ...this.contents,
            ...this.nestedVessels.flatMap(v => v.getContents()),
        ];
    }
    getAllEquipment() {
        return [
            this.name,
            ...this.nestedVessels.flatMap(v => [v.name, ...v.nestedVessels.map(n => n.name)]),
        ];
    }
    preheat(temperature) {
        return timerStep(`Preheat ${this.name} to ${temperature}°`, time.minutes(15), {
            equipment: [this.name],
        });
    }
    cook(label, durationSeconds, temperature, extraEquipment = []) {
        const text = temperature !== undefined ? `${label} (${temperature}°)` : label;
        const allEquipment = [...this.getAllEquipment(), ...extraEquipment.map(eq => eq.name)];
        const allIngredients = [...this.getContents(), ...extraEquipment.flatMap(eq => eq.getContents())];
        return timerStep(text, durationSeconds, {
            equipment: allEquipment,
            ingredients: allIngredients,
        });
    }
    add(ingredients, note) {
        const allIngredients = ingredients.map(e => Array.isArray(e) ? e[0] : e);
        this.contents.push(...allIngredients);
        const children = ingredients.map((entry) => {
            const [ing, itemNote] = Array.isArray(entry) ? entry : [entry, undefined];
            return createStep({
                type: 'instruction',
                text: itemNote
                    ? `${formatIngredient(ing)} — ${itemNote}`
                    : formatIngredient(ing),
                ingredients: [ing],
                equipment: [this.name],
            });
        });
        return createStep({
            type: 'instruction',
            text: `Add to ${this.name}${note ? ` — ${note}` : ''}`,
            equipment: [this.name],
            ingredients: allIngredients,
            children,
        });
    }
    transfer(target, ingredients) {
        for (const ing of ingredients) {
            const idx = this.contents.findIndex(c => c.name === ing.name);
            if (idx === -1) {
                throw new Error(`transfer() from '${this.name}' to '${target.name}': ` +
                    `'${ing.name}' is not in ${this.name}. ` +
                    `Contents: [${this.contents.map(c => c.name).join(', ') || 'empty'}]`);
            }
            this.contents.splice(idx, 1);
        }
        target.contents.push(...ingredients);
        const names = ingredients.map(ing => formatIngredient(ing)).join(', ');
        return createStep({
            type: 'instruction',
            text: `Transfer ${names} from ${this.name} to ${target.name}`,
            equipment: [this.name, target.name],
            ingredients,
        });
    }
    broil(label, durationSeconds) {
        const allEquipment = this.getAllEquipment();
        const allIngredients = this.getContents();
        return timerStep(`Broil — ${label}`, durationSeconds, {
            equipment: allEquipment,
            ingredients: allIngredients,
        });
    }
    slice(ingredient) {
        return createStep({
            type: 'instruction',
            text: `Slice ${ingredient.name}`,
            equipment: [this.name],
            ingredients: [ingredient],
        });
    }
    spray(ingredient) {
        return createStep({
            type: 'instruction',
            text: `Spray ${ingredient.name} on ${this.name}`,
            equipment: [this.name],
            ingredients: [ingredient],
        });
    }
    flip() {
        return createStep({
            type: 'instruction',
            text: `Flip contents of ${this.name}`,
            equipment: [this.name],
            ingredients: [...this.contents],
        });
    }
    place(vessel, label, durationSeconds, temperature) {
        this.nestedVessels.push(vessel);
        const allEquipment = [this.name, vessel.name];
        const allIngredients = vessel.getContents();
        if (label && durationSeconds !== undefined) {
            const text = temperature !== undefined ? `${label} (${temperature}°)` : label;
            return timerStep(text, durationSeconds, {
                equipment: allEquipment,
                ingredients: allIngredients,
            });
        }
        return createStep({
            type: 'instruction',
            text: `Place ${vessel.name} in ${this.name}`,
            equipment: allEquipment,
            ingredients: allIngredients,
        });
    }
    stir() { return instruction(`Stir ${this.name}`, { equipment: [this.name] }); }
    mix(resultName) {
        const allContents = this.getContents();
        if (resultName) {
            const produced = { name: resultName, quantity: 1, unit: u.none };
            produced.rename = (newName) => { produced.name = newName; };
            produced._constituents = allContents;
            this.contents = [produced];
            this._result = produced;
        }
        return instruction(`Mix ${this.name}`, { equipment: [this.name], ingredients: allContents });
    }
    combine(ingredients, note) {
        const allConstituents = [...this.getContents(), ...ingredients];
        const produced = {
            name: ingredients.map(i => i.name).join(' + '),
            quantity: ingredients[0]?.quantity ?? 1,
            unit: ingredients[0]?.unit ?? u.none,
            _constituents: allConstituents,
        };
        produced.rename = (newName) => { produced.name = newName; };
        this.contents = [produced];
        this._result = produced;
        return createStep({
            type: 'instruction',
            text: `Combine ${ingredients.map(i => i.name).join(', ')} in ${this.name}${note ? ` — ${note}` : ''}`,
            equipment: [this.name],
            ingredients: allConstituents,
        });
    }
}
export const e = {
    bowl: (label) => new Equipment('bowl', label),
    pan: (label) => new Equipment('pan', label),
    pot: (label) => new Equipment('pot', label),
    oven: (label) => new Equipment('oven', label),
    toasterOven: (label) => new Equipment('toaster oven', label),
    instantPot: (label) => new Equipment('instant pot', label),
    bulletMixer: (label) => new Equipment('bullet mixer', label),
    knife: (label) => new Equipment('knife', label),
    cuttingBoard: (label) => new Equipment('cutting board', label),
};
// ============================================================
// RECIPE REGISTRATION
// ============================================================
function collectIngredientsWithLabel(steps) {
    const collected = new Map();
    function walkSteps(steps) {
        for (const step of steps) {
            for (const ing of (step.ingredients ?? [])) {
                if (ing.requiresDateLabel && !collected.has(ing))
                    collected.set(ing, ing);
            }
            if (step.children)
                walkSteps(step.children);
        }
    }
    walkSteps(steps);
    return [...collected.values()];
}
function findLastStepIndexForIngredient(steps, targetIng) {
    let lastIndex = -1;
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const isContainerOrTimer = (step.type === 'instruction' && step.children && step.children.length > 0) ||
            step.type === 'timer';
        if (isContainerOrTimer) {
            for (const ing of (step.ingredients ?? [])) {
                if (ing === targetIng) {
                    lastIndex = i;
                    break;
                }
            }
        }
    }
    return lastIndex;
}
export function createRecipe(id, name, steps, group, estimatedMinutes) {
    steps.forEach(s => { s.recipeId = id; });
    const ingredientsToLabel = collectIngredientsWithLabel(steps);
    const stepsToInsert = [];
    for (const ing of ingredientsToLabel) {
        const lastIndex = findLastStepIndexForIngredient(steps, ing);
        if (lastIndex !== -1) {
            const cleanupStep = generateCleanupLabels([ing])[0];
            stepsToInsert.push({ index: lastIndex, step: cleanupStep });
        }
    }
    stepsToInsert.sort((a, b) => b.index - a.index);
    for (const { index, step } of stepsToInsert)
        steps.splice(index + 1, 0, step);
    return { id, name, steps, group, estimatedMinutes };
}
export function registerRecipe(recipe) {
    state.recipes.set(recipe.id, recipe);
}
export function registerGroup(group, recipes) {
    recipes.forEach((recipe) => registerRecipe({ ...recipe, group }));
}
// ============================================================
// AD-HOC INGREDIENTS
// ============================================================
const ADHOC_GROUP = 'Custom additions';
function createAdhocRecipe(ingredient) {
    const id = `adhoc:${ingredient.name.toLowerCase().replace(/\s+/g, '-')}:${Date.now()}-${Math.floor(Math.random() * 1e4)}`;
    const step = instruction(`Have ${formatIngredient(ingredient)} on hand`, { ingredients: [ingredient] });
    step.recipeId = id;
    return { id, name: formatIngredient(ingredient), group: ADHOC_GROUP, steps: [step], adhoc: true };
}
export function getSelectedRecipes() {
    const seen = new Set();
    const out = [];
    for (const id of state.selectedRecipeIds) {
        if (seen.has(id))
            continue;
        seen.add(id);
        const r = state.recipes.get(id);
        if (r)
            out.push(r);
    }
    return out;
}
export function getServings(recipeId) {
    return state.selectedRecipeIds.filter(id => id === recipeId).length;
}
function getFilteredRecipes() {
    const q = state.searchQuery.toLowerCase();
    const all = [...state.recipes.values()];
    const matched = q ? all.filter((r) => r.name.toLowerCase().includes(q)) : all;
    return matched.sort((a, b) => {
        const aAdhoc = a.adhoc ? 0 : 1;
        const bAdhoc = b.adhoc ? 0 : 1;
        if (aAdhoc !== bAdhoc)
            return aAdhoc - bAdhoc;
        const aFav = FAVORITE_RECIPE_IDS.includes(a.id) ? 0 : 1;
        const bFav = FAVORITE_RECIPE_IDS.includes(b.id) ? 0 : 1;
        if (aFav !== bFav)
            return aFav - bFav;
        return a.name.localeCompare(b.name);
    });
}
// ============================================================
// COOK TIME
// ============================================================
function recipeCookSeconds(recipe) {
    const releaseAt = new Map();
    function claimKeysForStep(step) {
        const keys = [];
        for (const eq of (step.equipment ?? []))
            keys.push(`eq::${eq}`);
        for (const ing of (step.ingredients ?? []))
            keys.push(`ing::${ing.name}`);
        return keys;
    }
    let totalTime = 0;
    for (const step of recipe.steps) {
        if (step.type !== 'timer')
            continue;
        const keys = claimKeysForStep(step);
        const startAt = keys.reduce((m, k) => Math.max(m, releaseAt.get(k) ?? 0), 0);
        const endAt = startAt + (step.durationSeconds ?? 0);
        for (const k of keys)
            releaseAt.set(k, endAt);
        totalTime = Math.max(totalTime, endAt);
    }
    return totalTime;
}
function formatCookTime(seconds) {
    const totalMinutes = Math.ceil(seconds / 60);
    if (totalMinutes < 60)
        return `${totalMinutes} min`;
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return mins === 0 ? `${hrs} hr` : `${hrs} hr ${mins} min`;
}
// ============================================================
// COOKING PLAN
// ============================================================
function buildCookingPlan(recipes) {
    const steps = recipes.flatMap(r => r.steps);
    const manualWaits = new Map();
    steps.forEach(s => {
        if (s.waitForIds && s.waitForIds.length > 0)
            manualWaits.set(s.id, [...s.waitForIds]);
        s.waitForIds = undefined;
    });
    const equipClaims = new Map();
    const ingClaims = new Map();
    function getBlockingIds(step) {
        const blocking = new Set();
        for (const eq of (step.equipment ?? [])) {
            const id = equipClaims.get(`${step.recipeId}::eq::${eq}`);
            if (id !== undefined)
                blocking.add(id);
        }
        for (const ing of (step.ingredients ?? [])) {
            const id = ingClaims.get(ing);
            if (id !== undefined)
                blocking.add(id);
        }
        return [...blocking];
    }
    function setClaims(step) {
        for (const eq of (step.equipment ?? []))
            equipClaims.set(`${step.recipeId}::eq::${eq}`, step.id);
        for (const ing of (step.ingredients ?? []))
            ingClaims.set(ing, step.id);
    }
    for (const step of steps) {
        const waitFor = new Set();
        for (const id of (manualWaits.get(step.id) ?? []))
            waitFor.add(id);
        for (const id of getBlockingIds(step))
            waitFor.add(id);
        if (waitFor.size > 0)
            step.waitForIds = [...waitFor];
        if (step.type === 'timer' || (step.waitForIds && step.waitForIds.length > 0))
            setClaims(step);
    }
    return steps;
}
// ============================================================
// SHOPPING LIST
// ============================================================
function buildShoppingList() {
    const combined = new Map();
    getSelectedRecipes().forEach((recipe) => {
        const servings = getServings(recipe.id);
        const distinct = new Set();
        const walk = (steps) => {
            for (const step of steps) {
                for (const ing of step.ingredients ?? [])
                    distinct.add(ing);
                if (step.children)
                    walk(step.children);
            }
        };
        walk(recipe.steps);
        for (const ingredient of distinct) {
            if (isComposite(ingredient))
                continue;
            const key = `${ingredient.name}-${ingredient.unit?.name ?? ''}`;
            const addQty = (ingredient.quantity ?? 0) * servings;
            const existing = combined.get(key);
            if (!existing) {
                combined.set(key, { ...ingredient, quantity: addQty });
            }
            else {
                existing.quantity = (existing.quantity ?? 0) + addQty;
            }
        }
    });
    return [...combined.values()];
}
const emptyTotals = () => ({ calories: 0, sodium: 0, sugar: 0, protein: 0 });
const addTotals = (a, b) => ({
    calories: a.calories + b.calories,
    sodium: a.sodium + b.sodium,
    sugar: a.sugar + b.sugar,
    protein: a.protein + b.protein,
});
const scaleTotals = (t, n) => ({
    calories: t.calories * n,
    sodium: t.sodium * n,
    sugar: t.sugar * n,
    protein: t.protein * n,
});
function isComposite(ing) {
    return Array.isArray(ing._constituents);
}
function selectedProduct(ing) {
    const ps = ing.products ?? [];
    if (ps.length === 0)
        return undefined;
    return ps.find(p => p.brand === ing.defaultBrand) ?? ps[0];
}
function nutritionSource(ing) {
    const product = selectedProduct(ing);
    if (product?.nutrition)
        return { label: product.nutrition, brand: product.brand };
    return { label: ing.nutrition };
}
function resolveNutritionFacts(ing, label) {
    const recipeUnit = ing.unit?.name ?? '';
    const qty = ing.quantity ?? 0;
    // 1. Exact match
    if (label[recipeUnit]) {
        return { facts: label[recipeUnit], convertedQty: qty, matchedUnit: recipeUnit };
    }
    // 2. Physical or density conversion into each keyed unit
    for (const keyedUnit of Object.keys(label)) {
        const converted = convertWithDensity(qty, recipeUnit, keyedUnit, ing.conversions);
        if (converted !== null) {
            return { facts: label[keyedUnit], convertedQty: converted, matchedUnit: keyedUnit };
        }
    }
    return null;
}
function ingredientNutrition(ing) {
    const { label, brand } = nutritionSource(ing);
    if (!label || Object.keys(label).length === 0)
        return { status: 'missing' };
    if (!ing.unit || !ing.unit.name) {
        return { status: 'uncomputable', reason: 'no unit on the recipe ingredient' };
    }
    const resolved = resolveNutritionFacts(ing, label);
    if (!resolved) {
        const keyed = Object.keys(label).map(k => `"${k}"`).join(', ');
        return {
            status: 'uncomputable',
            reason: `recipe uses "${ing.unit.name}" but ${brand ? `${brand}'s ` : ''}data is keyed by ${keyed} (no conversion path)`,
        };
    }
    const { facts, convertedQty } = resolved;
    const servingSize = facts.servingSize ?? 0;
    if (servingSize <= 0)
        return { status: 'uncomputable', reason: 'serving size is missing or zero' };
    const servingsUsed = convertedQty / servingSize;
    return {
        status: 'ok',
        brand,
        totals: {
            calories: (facts.calories ?? 0) * servingsUsed,
            sodium: (facts.sodium ?? 0) * servingsUsed,
            sugar: (facts.sugar ?? 0) * servingsUsed,
            protein: (facts.protein ?? 0) * servingsUsed,
        },
    };
}
function ingredientCost(ing) {
    const product = selectedProduct(ing);
    if (!product)
        return { status: 'missing' };
    if (product.price === undefined || product.size === undefined || !product.sizeUnit) {
        return { status: 'missing' };
    }
    if (!ing.unit || !ing.unit.name) {
        return { status: 'uncomputable', reason: 'no unit on the recipe ingredient' };
    }
    const recipeUnit = ing.unit.name;
    const packageUnit = product.sizeUnit.name;
    const qty = ing.quantity ?? 0;
    const convertedQty = convertWithDensity(qty, recipeUnit, packageUnit, ing.conversions);
    if (convertedQty === null) {
        return {
            status: 'uncomputable',
            reason: `recipe uses "${recipeUnit}" but package is in "${packageUnit}" (no conversion path)`,
        };
    }
    return {
        status: 'ok',
        brand: product.brand,
        cost: (product.price / product.size) * convertedQty,
    };
}
function recipeNutrition(recipe) {
    const seen = new Set();
    const walk = (steps) => {
        for (const step of steps) {
            for (const ing of step.ingredients ?? [])
                seen.add(ing);
            if (step.children)
                walk(step.children);
        }
    };
    walk(recipe.steps);
    const breakdown = [...seen]
        .filter(ing => !isComposite(ing))
        .map(ing => ({ ing, result: ingredientNutrition(ing), costResult: ingredientCost(ing) }));
    const totals = breakdown.reduce((acc, b) => b.result.status === 'ok' ? addTotals(acc, b.result.totals) : acc, emptyTotals());
    const cost = breakdown.reduce((acc, b) => b.costResult.status === 'ok' ? acc + b.costResult.cost : acc, 0);
    return {
        totals,
        cost,
        covered: breakdown.filter(b => b.result.status === 'ok').length,
        missing: breakdown.filter(b => b.result.status === 'missing').length,
        uncomputable: breakdown.filter(b => b.result.status === 'uncomputable').length,
        costMissing: breakdown.filter(b => b.costResult.status !== 'ok').length,
        total: breakdown.length,
        breakdown,
    };
}
function formatTotals(t, cost) {
    const costStr = cost !== undefined ? `$${cost.toFixed(2)} · ` : '';
    return `${costStr}${Math.round(t.calories)} cal · ${Math.round(t.sodium)} mg sodium · ` +
        `${Math.round(t.sugar)} g sugar · ${Math.round(t.protein)} g protein`;
}
function coverageLabel(covered, total, flagged) {
    if (total === 0)
        return 'No ingredients';
    if (flagged === 0)
        return `All ${total} ingredients have data`;
    return `${covered} of ${total} ingredients have data · ${flagged} flagged`;
}
// ============================================================
// DOM HELPERS
// ============================================================
function getElement(id) {
    const el = document.getElementById(id);
    if (!el)
        throw new Error(`Missing element: ${id}`);
    return el;
}
function clear(el) { el.innerHTML = ''; }
function createButton(label, onClick) {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.addEventListener('click', onClick);
    return btn;
}
function createPanel() {
    const panel = document.createElement('div');
    panel.className = 'panel';
    return panel;
}
// ============================================================
// COPY TO CLIPBOARD
// ============================================================
function getRecipeURL(recipeId) {
    const baseURL = window.location.origin + window.location.pathname;
    return `${baseURL}?recipe=${recipeId}`;
}
function copyToClipboard(text) {
    return navigator.clipboard.writeText(text).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    });
}
function createCopyButton(recipeId) {
    const btn = document.createElement('button');
    btn.className = 'copy-link-btn';
    btn.textContent = '🔗';
    btn.title = 'Copy recipe link';
    btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        copyToClipboard(getRecipeURL(recipeId)).then(() => {
            const original = btn.textContent;
            btn.textContent = '✓';
            setTimeout(() => { btn.textContent = original; }, 1500);
        });
    });
    return btn;
}
// ============================================================
// AUDIO UNLOCK
// ============================================================
function unlockAudioContext() {
    if (state.audioUnlocked)
        return;
    const silentAudio = new Audio();
    silentAudio.src = 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==';
    silentAudio.play().catch(() => { });
    state.audioUnlocked = true;
}
// ============================================================
// SCREEN: SELECT
// ============================================================
function renderSelectScreen() {
    const root = getElement('app');
    clear(root);
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search recipes...';
    searchInput.value = state.searchQuery;
    searchInput.className = 'search-input';
    searchInput.addEventListener('input', () => {
        state.searchQuery = searchInput.value;
        renderRecipeList();
    });
    root.appendChild(searchInput);
    const recipeList = document.createElement('div');
    recipeList.id = 'recipe-list';
    root.appendChild(recipeList);
    const actions = document.createElement('div');
    actions.id = 'actions';
    actions.className = 'actions';
    root.appendChild(actions);
    renderRecipeList();
    updateActionButtons();
}
function renderRecipeList() {
    const root = getElement('recipe-list');
    clear(root);
    const recipes = getFilteredRecipes();
    if (recipes.length === 0) {
        const empty = document.createElement('p');
        empty.textContent = 'No recipes found.';
        empty.className = 'empty';
        root.appendChild(empty);
        appendAddIngredientButton(root);
        return;
    }
    const groups = new Map();
    recipes.forEach((recipe) => {
        const key = recipe.group ?? '';
        if (!groups.has(key))
            groups.set(key, []);
        groups.get(key).push(recipe);
    });
    groups.forEach((groupRecipes, groupName) => {
        if (groupName) {
            const heading = document.createElement('h3');
            heading.textContent = groupName;
            heading.className = 'group-heading';
            root.appendChild(heading);
        }
        groupRecipes.forEach((recipe) => {
            const row = document.createElement('div');
            row.className = 'recipe-row';
            if (!recipe.adhoc && FAVORITE_RECIPE_IDS.includes(recipe.id)) {
                const star = document.createElement('span');
                star.className = 'fav-star';
                star.textContent = '★';
                row.appendChild(star);
            }
            else if (!recipe.adhoc) {
                const spacer = document.createElement('span');
                spacer.className = 'fav-star fav-star-spacer';
                row.appendChild(spacer);
            }
            const btn = document.createElement('button');
            btn.className = 'recipe-btn';
            const count = state.selectedRecipeIds.filter(id => id === recipe.id).length;
            btn.classList.toggle('selected', count > 0);
            const nameSpan = document.createElement('span');
            nameSpan.textContent = recipe.name;
            btn.appendChild(nameSpan);
            if (count > 1) {
                const badge = document.createElement('span');
                badge.className = 'count-badge';
                badge.textContent = `×${count}`;
                btn.appendChild(badge);
            }
            btn.addEventListener('click', () => {
                state.selectedRecipeIds.push(recipe.id);
                unlockAudioContext();
                renderRecipeList();
                updateActionButtons();
            });
            const minusBtn = document.createElement('button');
            minusBtn.className = 'count-minus-btn';
            minusBtn.textContent = '−';
            minusBtn.title = 'Remove one serving';
            minusBtn.style.visibility = count > 0 ? 'visible' : 'hidden';
            minusBtn.addEventListener('click', (ev) => {
                ev.stopPropagation();
                const idx = state.selectedRecipeIds.lastIndexOf(recipe.id);
                if (idx !== -1)
                    state.selectedRecipeIds.splice(idx, 1);
                renderRecipeList();
                updateActionButtons();
            });
            row.appendChild(btn);
            row.appendChild(minusBtn);
            if (recipe.adhoc) {
                const removeBtn = document.createElement('button');
                removeBtn.className = 'adhoc-remove-btn';
                removeBtn.textContent = '×';
                removeBtn.title = 'Remove this ad-hoc ingredient';
                removeBtn.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    state.selectedRecipeIds = state.selectedRecipeIds.filter(id => id !== recipe.id);
                    state.recipes.delete(recipe.id);
                    renderRecipeList();
                    updateActionButtons();
                });
                row.appendChild(removeBtn);
            }
            else {
                row.appendChild(createCopyButton(recipe.id));
            }
            root.appendChild(row);
        });
    });
    appendAddIngredientButton(root);
}
function appendAddIngredientButton(root) {
    const addRow = document.createElement('div');
    addRow.className = 'add-ingredient-row';
    const addBtn = createButton('+ Add an ingredient', () => navigateTo('add-ingredient'));
    addBtn.className = 'add-ingredient-btn';
    addRow.appendChild(addBtn);
    root.appendChild(addRow);
}
function updateActionButtons() {
    const actions = getElement('actions');
    clear(actions);
    if (state.selectedRecipeIds.length === 0)
        return;
    const shopBtn = createButton('🛒 Go Shopping', () => navigateTo('shopping'));
    shopBtn.className = 'action-btn';
    const nutritionBtn = createButton('📊 Nutrition', () => navigateTo('nutrition'));
    nutritionBtn.className = 'action-btn action-btn-nutrition';
    actions.appendChild(shopBtn);
    actions.appendChild(nutritionBtn);
    const hasCookable = getSelectedRecipes().some(r => !r.adhoc);
    if (hasCookable) {
        const cookBtn = createButton('🍳 Start Cooking', () => navigateTo('cooking'));
        cookBtn.className = 'action-btn';
        actions.appendChild(cookBtn);
    }
}
// ============================================================
// SCREEN: SHOPPING
// ============================================================
function renderShoppingScreen() {
    const root = getElement('app');
    clear(root);
    const heading = document.createElement('h2');
    heading.textContent = 'Shopping List';
    root.appendChild(heading);
    buildShoppingList().forEach((ingredient) => {
        const panel = createPanel();
        const label = document.createElement('span');
        label.textContent = formatIngredient(ingredient);
        panel.appendChild(label);
        const products = ingredient.products ?? [];
        if (products.length > 0) {
            const links = document.createElement('div');
            links.className = 'purchase-links';
            const chosen = selectedProduct(ingredient);
            products.forEach((product) => {
                const a = document.createElement('a');
                a.href = product.link ?? '#';
                a.target = '_blank';
                a.className = 'purchase-link';
                if (product === chosen)
                    a.classList.add('default-product');
                const variant = product.variant ? ` ${product.variant}` : '';
                const where = product.store ? ` · ${product.store}` : '';
                const pkg = product.price !== undefined && product.size !== undefined
                    ? ` — $${product.price} / ${product.size} ${product.sizeUnit?.name ?? ''}`.trimEnd()
                    : '';
                const pick = product === chosen ? ' ✓' : '';
                a.textContent = `${product.brand}${variant}${where}${pkg}${pick}`;
                links.appendChild(a);
            });
            panel.appendChild(links);
        }
        panel.addEventListener('click', (ev) => {
            if (ev.target.tagName === 'A')
                return;
            panel.classList.toggle('completed');
        });
        root.appendChild(panel);
    });
    root.appendChild(createStartOverButton());
}
// ============================================================
// SCREEN: NUTRITION
// ============================================================
function renderNutritionScreen() {
    const root = getElement('app');
    clear(root);
    const heading = document.createElement('h2');
    heading.textContent = 'Nutrition';
    root.appendChild(heading);
    const recipes = getSelectedRecipes();
    if (recipes.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'empty';
        empty.textContent = 'No recipes selected.';
        root.appendChild(empty);
        root.appendChild(createStartOverButton());
        return;
    }
    const perRecipe = recipes.map(r => ({
        recipe: r,
        servings: getServings(r.id),
        nutrition: recipeNutrition(r),
    }));
    // ── Grand total ──────────────────────────────────────────
    const grand = perRecipe.reduce((acc, p) => addTotals(acc, scaleTotals(p.nutrition.totals, p.servings)), emptyTotals());
    const grandCost = perRecipe.reduce((acc, p) => acc + p.nutrition.cost * p.servings, 0);
    const gCovered = perRecipe.reduce((a, p) => a + p.nutrition.covered, 0);
    const gFlagged = perRecipe.reduce((a, p) => a + p.nutrition.missing + p.nutrition.uncomputable, 0);
    const gTotal = perRecipe.reduce((a, p) => a + p.nutrition.total, 0);
    const gCostMissing = perRecipe.reduce((a, p) => a + p.nutrition.costMissing, 0);
    const grandServings = perRecipe.reduce((a, p) => a + p.servings, 0);
    const hasCostData = gTotal > gCostMissing;
    const totalCard = createPanel();
    totalCard.className = 'panel nutrition-total';
    const totalTitle = document.createElement('div');
    totalTitle.className = 'nutrition-total-title';
    if (recipes.length === 1 && perRecipe[0].servings === 1) {
        totalTitle.textContent = recipes[0].name;
    }
    else if (recipes.length === 1) {
        totalTitle.textContent = `${recipes[0].name} ×${perRecipe[0].servings}`;
    }
    else {
        totalTitle.textContent = `All selected recipes (${grandServings} serving${grandServings === 1 ? '' : 's'})`;
    }
    totalCard.appendChild(totalTitle);
    const totalValue = document.createElement('div');
    totalValue.className = 'nutrition-values';
    if (gCovered > 0) {
        totalValue.textContent = formatTotals(grand, hasCostData ? grandCost : undefined);
    }
    else if (hasCostData) {
        totalValue.textContent = `$${grandCost.toFixed(2)}`;
    }
    else {
        totalValue.textContent = '— no computable data';
    }
    totalCard.appendChild(totalValue);
    // Partial cost warning
    if (gCostMissing > 0 && hasCostData) {
        const costNote = document.createElement('div');
        costNote.className = 'nutrition-cost-note';
        costNote.textContent = `⚠ cost is partial — ${gCostMissing} ingredient${gCostMissing === 1 ? '' : 's'} missing price data`;
        totalCard.appendChild(costNote);
    }
    const totalCoverage = document.createElement('div');
    totalCoverage.className = 'nutrition-coverage' + (gFlagged > 0 ? ' flagged' : '');
    totalCoverage.textContent = (gFlagged > 0 ? '⚠ ' : '') + coverageLabel(gCovered, gTotal, gFlagged);
    totalCard.appendChild(totalCoverage);
    root.appendChild(totalCard);
    // ── Per recipe (expandable) ──────────────────────────────
    perRecipe.forEach(({ recipe, servings, nutrition }) => {
        const section = createPanel();
        section.className = 'panel nutrition-recipe';
        const flaggedCount = nutrition.missing + nutrition.uncomputable;
        const sectionTotals = scaleTotals(nutrition.totals, servings);
        const sectionCost = nutrition.cost * servings;
        const recipeHasCostData = nutrition.total > nutrition.costMissing;
        const header = document.createElement('div');
        header.className = 'nutrition-recipe-header';
        const caret = document.createElement('span');
        caret.className = 'nutrition-caret';
        caret.textContent = '▸';
        const name = document.createElement('span');
        name.className = 'nutrition-recipe-name';
        name.textContent = servings > 1 ? `${recipe.name} ×${servings}` : recipe.name;
        const sub = document.createElement('span');
        sub.className = 'nutrition-recipe-sub';
        if (nutrition.covered > 0) {
            sub.textContent = formatTotals(sectionTotals, recipeHasCostData ? sectionCost : undefined);
        }
        else if (recipeHasCostData) {
            sub.textContent = `$${sectionCost.toFixed(2)}`;
        }
        else {
            sub.textContent = '— no computable data';
        }
        header.appendChild(caret);
        header.appendChild(name);
        header.appendChild(sub);
        section.appendChild(header);
        const cov = document.createElement('div');
        cov.className = 'nutrition-coverage' + (flaggedCount > 0 ? ' flagged' : '');
        cov.textContent = (flaggedCount > 0 ? '⚠ ' : '') +
            coverageLabel(nutrition.covered, nutrition.total, flaggedCount);
        section.appendChild(cov);
        // Per-ingredient breakdown
        const list = document.createElement('div');
        list.className = 'nutrition-ingredients collapsed';
        nutrition.breakdown.forEach(({ ing, result, costResult }) => {
            const row = document.createElement('div');
            row.className = 'nutrition-ingredient-row';
            const ingName = document.createElement('span');
            ingName.className = 'nutrition-ingredient-name';
            const scaledIng = { ...ing, quantity: (ing.quantity ?? 0) * servings };
            ingName.textContent = formatIngredient(scaledIng);
            row.appendChild(ingName);
            const detail = document.createElement('span');
            if (result.status === 'ok') {
                detail.className = 'nutrition-ingredient-value';
                // Append cost to the nutrition line when available
                const costSuffix = costResult.status === 'ok'
                    ? ` · $${(costResult.cost * servings).toFixed(2)}`
                    : '';
                detail.textContent = formatTotals(scaleTotals(result.totals, servings)) + costSuffix;
            }
            else if (result.status === 'missing') {
                row.classList.add('flagged');
                detail.className = 'nutrition-flag';
                detail.textContent = '⚠ no nutrition data';
            }
            else {
                row.classList.add('flagged');
                detail.className = 'nutrition-flag';
                detail.textContent = "⚠ can't compute";
                detail.title = result.reason;
            }
            row.appendChild(detail);
            if (result.status === 'uncomputable') {
                const reason = document.createElement('div');
                reason.className = 'nutrition-flag-reason';
                reason.textContent = result.reason;
                row.appendChild(reason);
            }
            // Cost flag — only shown when nutrition resolved fine but cost didn't
            if (result.status === 'ok' && costResult.status !== 'ok') {
                const costFlag = document.createElement('div');
                costFlag.className = 'nutrition-cost-flag';
                costFlag.textContent = costResult.status === 'missing'
                    ? '⚠ no price data'
                    : `⚠ cost can't compute — ${costResult.reason}`;
                row.appendChild(costFlag);
            }
            // Brand provenance
            if (result.status === 'ok' && result.brand) {
                const product = selectedProduct(ing);
                const variant = product?.variant ? ` · ${product.variant}` : '';
                const via = document.createElement('div');
                via.className = 'nutrition-provenance';
                via.textContent = `via ${result.brand}${variant}`;
                row.appendChild(via);
            }
            list.appendChild(row);
        });
        section.appendChild(list);
        header.addEventListener('click', () => {
            const collapsed = list.classList.toggle('collapsed');
            caret.textContent = collapsed ? '▸' : '▾';
        });
        root.appendChild(section);
    });
    root.appendChild(createStartOverButton());
}
// ============================================================
// SCREEN: ADD INGREDIENT
// ============================================================
let adhocSearchQuery = '';
let adhocSelectedKey = null;
let adhocQuantity = 1;
let adhocUnitName = '';
function pickDefaultUnit(ing) {
    const productUnits = ing.products?.[0]?.nutrition && Object.keys(ing.products[0].nutrition);
    const ownUnits = ing.nutrition && Object.keys(ing.nutrition);
    const hint = productUnits?.[0] ?? ownUnits?.[0];
    if (hint) {
        const match = Object.values(u).find(unit => unit.name === hint);
        if (match)
            return match;
    }
    return u.unit;
}
let adhocCatalog = null;
function getAdhocCatalog() {
    if (adhocCatalog)
        return adhocCatalog;
    adhocCatalog = Object.entries(i).map(([key, factory]) => {
        const sample = factory();
        return { key, name: sample.name, sample };
    }).sort((a, b) => a.name.localeCompare(b.name));
    return adhocCatalog;
}
function renderAddIngredientScreen() {
    const root = getElement('app');
    clear(root);
    const heading = document.createElement('h2');
    heading.textContent = 'Add an ingredient';
    root.appendChild(heading);
    const sub = document.createElement('p');
    sub.className = 'adhoc-sub';
    sub.textContent = 'Pick an ingredient to add to your shopping list and nutrition totals.';
    root.appendChild(sub);
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search ingredients…';
    searchInput.value = adhocSearchQuery;
    searchInput.className = 'search-input';
    searchInput.addEventListener('input', () => {
        adhocSearchQuery = searchInput.value;
        renderAdhocList();
    });
    root.appendChild(searchInput);
    const list = document.createElement('div');
    list.id = 'adhoc-list';
    root.appendChild(list);
    const detail = document.createElement('div');
    detail.id = 'adhoc-detail';
    detail.className = 'adhoc-detail';
    root.appendChild(detail);
    const backBtn = createButton('← Back', () => {
        adhocSearchQuery = '';
        adhocSelectedKey = null;
        adhocQuantity = 1;
        adhocUnitName = '';
        navigateTo('select');
    });
    backBtn.className = 'start-over-btn';
    root.appendChild(backBtn);
    renderAdhocList();
    renderAdhocDetail();
}
function renderAdhocList() {
    const root = getElement('adhoc-list');
    clear(root);
    const q = adhocSearchQuery.toLowerCase().trim();
    const all = getAdhocCatalog();
    const matched = q ? all.filter(c => c.name.toLowerCase().includes(q)) : all;
    if (matched.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'empty';
        empty.textContent = 'No matching ingredients.';
        root.appendChild(empty);
        return;
    }
    matched.forEach(({ key, name }) => {
        const btn = document.createElement('button');
        btn.className = 'adhoc-item';
        btn.textContent = name;
        if (adhocSelectedKey === key)
            btn.classList.add('selected');
        btn.addEventListener('click', () => {
            adhocSelectedKey = key;
            const sample = all.find(c => c.key === key).sample;
            adhocQuantity = 1;
            adhocUnitName = pickDefaultUnit(sample).name;
            renderAdhocList();
            renderAdhocDetail();
        });
        root.appendChild(btn);
    });
}
function renderAdhocDetail() {
    const root = getElement('adhoc-detail');
    clear(root);
    if (!adhocSelectedKey)
        return;
    const catalogEntry = getAdhocCatalog().find(c => c.key === adhocSelectedKey);
    if (!catalogEntry)
        return;
    const label = document.createElement('div');
    label.className = 'adhoc-detail-label';
    label.textContent = `How much ${catalogEntry.name}?`;
    root.appendChild(label);
    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.min = '0';
    qtyInput.step = '0.25';
    qtyInput.value = String(adhocQuantity);
    qtyInput.className = 'adhoc-qty';
    qtyInput.addEventListener('input', () => {
        const v = parseFloat(qtyInput.value);
        adhocQuantity = isNaN(v) ? 0 : v;
    });
    root.appendChild(qtyInput);
    const unitSelect = document.createElement('select');
    unitSelect.className = 'adhoc-unit';
    for (const unit of Object.values(u)) {
        const opt = document.createElement('option');
        opt.value = unit.name;
        opt.textContent = unit.name || '(none)';
        if (unit.name === adhocUnitName)
            opt.selected = true;
        unitSelect.appendChild(opt);
    }
    unitSelect.addEventListener('change', () => { adhocUnitName = unitSelect.value; });
    root.appendChild(unitSelect);
    const confirmBtn = createButton('Add to list', () => {
        const factory = i[adhocSelectedKey];
        const unit = Object.values(u).find(uu => uu.name === adhocUnitName) ?? u.unit;
        const fresh = factory(adhocQuantity, unit);
        const recipe = createAdhocRecipe(fresh);
        registerRecipe(recipe);
        state.selectedRecipeIds.push(recipe.id);
        adhocSearchQuery = '';
        adhocSelectedKey = null;
        adhocQuantity = 1;
        adhocUnitName = '';
        navigateTo('select');
    });
    confirmBtn.className = 'adhoc-confirm';
    root.appendChild(confirmBtn);
}
// ============================================================
// SCREEN: COOKING
// ============================================================
function formatElapsed(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${String(s).padStart(2, '0')}s` : `${s}s`;
}
let readySection = null;
let waitingSection = null;
function getOrCreateCookingSections() {
    if (!readySection || !document.body.contains(readySection)) {
        readySection = document.createElement('div');
        readySection.id = 'ready-section';
    }
    if (!waitingSection || !document.body.contains(waitingSection)) {
        waitingSection = document.createElement('div');
        waitingSection.id = 'waiting-section';
        const waitLabel = document.createElement('div');
        waitLabel.className = 'waiting-section-label';
        waitLabel.textContent = '⏳ Waiting on timers';
        waitingSection.appendChild(waitLabel);
    }
    return { ready: readySection, waiting: waitingSection };
}
function promotePanelToReady(panel) {
    if (!readySection)
        return;
    if (readySection.contains(panel))
        return;
    if (panel.closest('.container-children'))
        return;
    const incomingIndex = parseInt(panel.dataset.stepIndex ?? '0', 10);
    const panels = Array.from(readySection.querySelectorAll(':scope > .panel[data-step-index]'));
    const insertBefore = panels.find(p => {
        if (p.classList.contains('completed') || p.classList.contains('skipped'))
            return false;
        return parseInt(p.dataset.stepIndex ?? '0', 10) > incomingIndex;
    });
    if (insertBefore) {
        readySection.insertBefore(panel, insertBefore);
    }
    else {
        readySection.appendChild(panel);
    }
    if (waitingSection) {
        const remainingLocked = waitingSection.querySelectorAll('.panel:not(.waiting-section-label)');
        if (remainingLocked.length === 0)
            waitingSection.style.display = 'none';
    }
}
function renderCookingScreen() {
    const root = getElement('app');
    clear(root);
    readySection = null;
    waitingSection = null;
    if (state.cookingStartedAt === null)
        state.cookingStartedAt = Date.now();
    const selected = getSelectedRecipes().filter(r => !r.adhoc);
    state.cookingPlanSteps = buildCookingPlan(selected);
    if (selected.length > 1) {
        const totalSecs = selected.reduce((s, r) => s + recipeCookSeconds(r), 0);
        const hardcodedTotal = selected.reduce((s, r) => s + (r.estimatedMinutes ? r.estimatedMinutes * 60 : 0), 0);
        const banner = document.createElement('div');
        banner.className = 'cook-time-banner';
        banner.textContent = hardcodedTotal > 0
            ? `Total: ${formatCookTime(hardcodedTotal)} goal (${formatCookTime(totalSecs)} calculated)`
            : `Total cook time: ${formatCookTime(totalSecs)}`;
        root.appendChild(banner);
    }
    const { ready, waiting } = getOrCreateCookingSections();
    root.appendChild(ready);
    root.appendChild(waiting);
    let lastRecipeId;
    for (const step of state.cookingPlanSteps) {
        if (step.recipeId && step.recipeId !== lastRecipeId) {
            lastRecipeId = step.recipeId;
            const recipe = state.recipes.get(step.recipeId);
            if (recipe) {
                const header = document.createElement('div');
                header.className = 'recipe-title-row';
                const title = document.createElement('h2');
                title.textContent = recipe.name;
                const badge = document.createElement('span');
                badge.className = 'cook-time-badge';
                const calculatedSecs = recipeCookSeconds(recipe);
                const calculatedText = formatCookTime(calculatedSecs);
                const hardcodedText = recipe.estimatedMinutes ? `${recipe.estimatedMinutes} min` : null;
                const updateBadge = () => {
                    const secs = Math.floor((Date.now() - state.cookingStartedAt) / 1000);
                    const estimateDisplay = hardcodedText
                        ? `estimated ${hardcodedText} (${calculatedText} calculated)`
                        : `estimated ${calculatedText}`;
                    badge.textContent = `${estimateDisplay} · actual ${formatElapsed(secs)}`;
                };
                updateBadge();
                if (state.cookingElapsedInterval !== null)
                    window.clearInterval(state.cookingElapsedInterval);
                state.cookingElapsedInterval = window.setInterval(() => {
                    const hasSteps = document.querySelector(`#app .panel:not(.completed):not(.skipped)`);
                    if (!hasSteps) {
                        window.clearInterval(state.cookingElapsedInterval);
                        state.cookingElapsedInterval = null;
                        return;
                    }
                    updateBadge();
                }, 1000);
                header.appendChild(title);
                header.appendChild(badge);
                header.appendChild(createCopyButton(recipe.id));
                ready.appendChild(header);
            }
        }
        const panel = renderStep(step);
        const stepIndex = state.cookingPlanSteps.indexOf(step);
        panel.dataset.stepIndex = String(stepIndex);
        const isLocked = !!(step.waitForIds && step.waitForIds.length > 0);
        if (isLocked) {
            waiting.appendChild(panel);
        }
        else {
            ready.appendChild(panel);
        }
    }
    const lockedPanels = waiting.querySelectorAll('.panel');
    if (lockedPanels.length === 0)
        waiting.style.display = 'none';
    root.appendChild(createStartOverButton());
}
// ============================================================
// STEP LOCKING
// ============================================================
function applyLock(panel, step) {
    const waitForIds = step.waitForIds;
    if (!waitForIds || waitForIds.length === 0)
        return;
    const appEl = document.getElementById('app');
    if (!appEl)
        return;
    const isUnlocked = () => waitForIds.every(id => {
        const el = document.getElementById(`step-${id}`);
        return !el || el.classList.contains('completed') || el.classList.contains('skipped');
    });
    panel.classList.add('step-locked');
    const pill = document.createElement('div');
    pill.className = 'waiting-pill';
    pill.textContent = '⏳ waiting…';
    panel.appendChild(pill);
    const unlock = () => {
        if (!isUnlocked())
            return;
        observer.disconnect();
        panel.classList.remove('step-locked');
        pill.remove();
        panel.classList.add('step-unlocked');
        setTimeout(() => {
            panel.classList.remove('step-unlocked');
            promotePanelToReady(panel);
        }, 800);
    };
    const observer = new MutationObserver(unlock);
    observer.observe(appEl, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    setTimeout(unlock, 0);
}
// ============================================================
// STEP RENDERING
// ============================================================
function renderStep(step, onDone) {
    const panel = createPanel();
    panel.id = `step-${step.id}`;
    if (step.children && step.children.length > 0) {
        panel.classList.add('container-step');
        const header = document.createElement('div');
        header.className = 'container-header';
        header.textContent = step.text;
        panel.appendChild(header);
        const childWrap = document.createElement('div');
        childWrap.className = 'container-children';
        panel.appendChild(childWrap);
        const checkDone = () => {
            const remaining = childWrap.querySelectorAll('.panel:not(.done-child)').length;
            if (remaining === 0) {
                panel.remove();
                onDone?.();
            }
        };
        step.children.forEach((child) => {
            if (step.waitForIds && !child.waitForIds)
                child.waitForIds = step.waitForIds;
            childWrap.appendChild(renderStep(child, checkDone));
        });
        applyLock(panel, step);
        return panel;
    }
    panel.textContent = step.text;
    if (step.type === 'timer') {
        let clickCount = 0;
        let clickTimer = 0;
        panel.addEventListener('click', () => {
            if (panel.classList.contains('step-locked'))
                return;
            if (panel.classList.contains('completed') || panel.classList.contains('skipped'))
                return;
            if (!state.timers.has(step.id)) {
                startTimer(step, panel, onDone);
                return;
            }
            clickCount++;
            window.clearTimeout(clickTimer);
            if (clickCount >= 3) {
                clickCount = 0;
                skipTimer(step, panel, onDone);
                return;
            }
            clickTimer = window.setTimeout(() => { clickCount = 0; }, 600);
        });
        applyLock(panel, step);
        return panel;
    }
    panel.addEventListener('click', () => {
        if (panel.classList.contains('step-locked'))
            return;
        panel.classList.add('done-child');
        panel.remove();
        onDone?.();
    });
    applyLock(panel, step);
    return panel;
}
function completeTimer(step, panel, onDone) {
    panel.classList.remove('timer');
    panel.classList.add('completed');
    const completedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    panel.textContent = `✓ ${step.text} — completed at ${completedAt}`;
    onDone?.();
}
function skipTimer(step, panel, onDone) {
    const intervalId = state.timers.get(step.id);
    if (intervalId !== undefined) {
        window.clearInterval(intervalId);
        state.timers.delete(step.id);
    }
    panel.classList.remove('timer');
    panel.classList.add('skipped');
    const skippedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    panel.textContent = `⏭ ${step.text} — skipped at ${skippedAt}`;
    onDone?.();
}
// ============================================================
// START OVER
// ============================================================
function createStartOverButton() {
    const btn = createButton('↩ Start Over', () => {
        state.timers.forEach((id) => window.clearInterval(id));
        state.timers.clear();
        state.selectedRecipeIds = [];
        state.cookingPlanSteps = [];
        state.searchQuery = '';
        state.cookingStartedAt = null;
        state.audioUnlocked = false;
        for (const [id, recipe] of state.recipes) {
            if (recipe.adhoc)
                state.recipes.delete(id);
        }
        if (state.cookingElapsedInterval !== null) {
            window.clearInterval(state.cookingElapsedInterval);
            state.cookingElapsedInterval = null;
        }
        navigateTo('select');
    });
    btn.className = 'start-over-btn';
    return btn;
}
// ============================================================
// NAVIGATION
// ============================================================
function navigateTo(screen) {
    state.screen = screen;
    render();
}
// ============================================================
// TIMERS
// ============================================================
function startTimer(step, panel, onDone) {
    if (!step.durationSeconds || state.timers.has(step.id))
        return;
    let remaining = step.durationSeconds;
    panel.classList.add('timer');
    const intervalId = window.setInterval(() => {
        const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
        const ss = String(remaining % 60).padStart(2, '0');
        panel.textContent = `${mm}:${ss} ${step.text} — tap 3× to skip`;
        remaining--;
        if (remaining < 0) {
            window.clearInterval(intervalId);
            state.timers.delete(step.id);
            completeTimer(step, panel, onDone);
            playSound();
        }
    }, 1000);
    state.timers.set(step.id, intervalId);
}
// ============================================================
// AUDIO
// ============================================================
const audio = new Audio('../src/sounds/pager-beep.mp3');
function playSound() { audio.currentTime = 0; audio.play().catch(console.error); }
// ============================================================
// URL ROUTING
// ============================================================
function getRecipeIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('recipe');
}
// ============================================================
// RENDER
// ============================================================
function render() {
    switch (state.screen) {
        case 'select': return renderSelectScreen();
        case 'shopping': return renderShoppingScreen();
        case 'cooking': return renderCookingScreen();
        case 'nutrition': return renderNutritionScreen();
        case 'add-ingredient': return renderAddIngredientScreen();
    }
}
// ============================================================
// STYLES
// ============================================================
const styles = `
* { box-sizing: border-box; }

body {
    background: #111;
    color: #f0f0f0;
    font-family: sans-serif;
    padding: 24px;
    font-size: 20px;
}

h2 { margin-top: 0; font-size: 28px; }

.group-heading {
    font-size: 18px;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 20px 0 6px;
    font-weight: normal;
}

.search-input {
    width: 100%;
    font-size: 24px;
    padding: 16px;
    border-radius: 12px;
    border: 2px solid #444;
    background: #222;
    color: #f0f0f0;
    margin-bottom: 16px;
}

.recipe-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 8px 0;
}

.recipe-btn {
    flex: 1;
    font-size: 22px;
    padding: 18px 20px;
    border-radius: 12px;
    border: 2px solid #444;
    background: #222;
    color: #f0f0f0;
    cursor: pointer;
    text-align: left;
}

.recipe-btn.selected {
    background: #1a5c2a;
    border-color: #2d9e4a;
    color: white;
}

.count-badge {
    margin-left: 10px;
    font-size: 18px;
    font-weight: bold;
    background: rgba(255, 255, 255, 0.2);
    padding: 2px 10px;
    border-radius: 12px;
}

.count-minus-btn {
    font-size: 28px;
    padding: 10px 16px;
    background: #2a2a2a;
    border: 2px solid #444;
    border-radius: 12px;
    color: #f0f0f0;
    cursor: pointer;
    line-height: 1;
}

.adhoc-remove-btn {
    font-size: 22px;
    padding: 10px 14px;
    background: none;
    border: none;
    color: #ef4444;
    cursor: pointer;
    line-height: 1;
}
.adhoc-remove-btn:hover { color: #f87171; }

.add-ingredient-row { margin-top: 16px; display: flex; }
.add-ingredient-btn {
    flex: 1;
    font-size: 20px;
    padding: 16px;
    border-radius: 12px;
    border: 2px dashed #555;
    background: transparent;
    color: #aaa;
    cursor: pointer;
}
.add-ingredient-btn:hover { border-color: #888; color: #f0f0f0; }

.adhoc-sub { color: #888; margin: 0 0 16px 0; }

#adhoc-list {
    max-height: 50vh;
    overflow-y: auto;
    border: 2px solid #333;
    border-radius: 12px;
    padding: 8px;
    margin-bottom: 16px;
}
.adhoc-item {
    display: block;
    width: 100%;
    text-align: left;
    background: #1a1a1a;
    border: 2px solid #333;
    border-radius: 10px;
    color: #f0f0f0;
    font-size: 18px;
    padding: 12px 16px;
    margin: 4px 0;
    cursor: pointer;
}
.adhoc-item.selected { background: #1a5c2a; border-color: #2d9e4a; }

.adhoc-detail {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    padding: 12px 0;
}
.adhoc-detail:empty { display: none; }
.adhoc-detail-label { flex-basis: 100%; font-size: 18px; color: #f0f0f0; }
.adhoc-qty {
    flex: 1; min-width: 80px;
    background: #222; border: 2px solid #444; border-radius: 10px;
    color: #f0f0f0; font-size: 20px; padding: 12px;
}
.adhoc-unit {
    flex: 1; min-width: 100px;
    background: #222; border: 2px solid #444; border-radius: 10px;
    color: #f0f0f0; font-size: 20px; padding: 12px;
}
.adhoc-confirm {
    flex-basis: 100%;
    background: #16a34a; color: white; border: none;
    border-radius: 12px; font-size: 22px; font-weight: bold;
    padding: 18px; cursor: pointer;
}
.adhoc-confirm:hover { background: #15803d; }

.fav-star { font-size: 20px; width: 32px; color: #f5c518; user-select: none; flex-shrink: 0; }
.fav-star-spacer { color: transparent; }

.copy-link-btn { font-size: 18px; padding: 10px 12px; background: none; border: none; color: #666; cursor: pointer; line-height: 1; transition: color 0.3s; }
.copy-link-btn:hover  { color: #60a5fa; }
.copy-link-btn:active { color: #2d9e4a; }

.actions {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: #111; border-top: 2px solid #333;
    padding: 16px 24px; display: flex; gap: 16px;
}

.action-btn { flex: 1; font-size: 24px; padding: 20px; border-radius: 12px; border: none; cursor: pointer; font-weight: bold; }
.action-btn:first-child { background: #2563eb; color: white; }
.action-btn:last-child  { background: #16a34a; color: white; }
.actions .action-btn-nutrition { background: #7c3aed; color: white; }

#recipe-list { padding-bottom: 120px; }

.panel {
    border: 2px solid #444; border-radius: 12px; padding: 20px; margin: 10px 0;
    cursor: pointer; font-size: 22px; position: relative;
    transition: opacity 0.3s, border-color 0.3s, background 0.3s;
}

.panel.container-step { border-color: #555; background: #1a1a1a; cursor: default; padding: 0; }

.container-header {
    padding: 16px 20px 12px; font-size: 18px; color: #888;
    text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #333;
}

.container-children { padding: 8px 12px 12px; display: flex; flex-direction: column; gap: 6px; }
.container-children .panel { margin: 0; font-size: 20px; padding: 14px 16px; }

.panel.timer     { background: #ca8a04; color: black; border-color: #ca8a04; }
.panel.completed { background: #1a5c2a; color: white; border-color: #2d9e4a; }
.panel.skipped   { background: #374151; color: #9ca3af; border-color: #4b5563; text-decoration: line-through; }

.panel.step-locked { opacity: 0.45; cursor: not-allowed; border-color: #333; border-left: 4px solid #ef4444; border-left-color: #ef4444; }

.waiting-pill {
    display: inline-block; margin-top: 8px; font-size: 13px;
    color: #ef4444; background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 20px;
    padding: 2px 10px; letter-spacing: 0.04em;
}

@keyframes unlockFlash {
    0%   { border-color: #2d9e4a; background: rgba(45, 158, 74, 0.15); }
    100% { border-color: #444;    background: transparent; }
}
.panel.step-unlocked { animation: unlockFlash 0.8s ease-out forwards; }

.purchase-links { margin-top: 10px; display: flex; flex-direction: column; gap: 6px; }
.purchase-link { color: #60a5fa; font-size: 16px; text-decoration: none; }
.purchase-link:hover { text-decoration: underline; }
.purchase-link.default-product { color: #2d9e4a; font-weight: bold; }

.start-over-btn { margin-top: 32px; font-size: 20px; padding: 16px 32px; border-radius: 12px; border: 2px solid #444; background: #222; color: #f0f0f0; cursor: pointer; }

.empty { color: #666; font-style: italic; }

.recipe-title-row { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
.recipe-title-row h2 { margin: 0; flex: 1; }
.recipe-title-row .copy-link-btn { margin-left: auto; }
.cook-time-badge { font-size: 16px; color: #888; white-space: nowrap; }
.cook-time-banner { font-size: 16px; color: #888; border: 1px solid #333; border-radius: 10px; padding: 10px 16px; margin-bottom: 16px; text-align: center; }

#ready-section   { margin-bottom: 8px; }
#waiting-section { margin-top: 24px; border-top: 1px solid #2a2a2a; padding-top: 8px; }
.waiting-section-label { font-size: 14px; color: #555; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 6px; padding-left: 4px; pointer-events: none; user-select: none; }

/* ── Nutrition screen ── */

.panel.nutrition-total { cursor: default; border-color: #555; background: #1a1a1a; }

.nutrition-total-title { font-size: 16px; color: #888; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }

.nutrition-values { font-size: 20px; color: #f0f0f0; }

.nutrition-coverage { font-size: 14px; color: #888; margin-top: 8px; }
.nutrition-coverage.flagged { color: #f59e0b; }

/* Partial-cost note — shown when some but not all ingredients have price data */
.nutrition-cost-note { font-size: 13px; color: #f59e0b; margin-top: 4px; font-style: italic; }

.panel.nutrition-recipe { cursor: default; padding: 0; }
.nutrition-recipe-header { display: flex; align-items: baseline; gap: 10px; padding: 16px 20px 6px; cursor: pointer; }
.nutrition-caret { color: #888; font-size: 16px; }
.nutrition-recipe-name { font-size: 22px; flex: 1; }
.nutrition-recipe-sub { font-size: 14px; color: #888; text-align: right; white-space: nowrap; }
.panel.nutrition-recipe .nutrition-coverage { padding: 0 20px 14px; margin-top: 0; }

.nutrition-ingredients { border-top: 1px solid #333; padding: 6px 20px 14px; display: flex; flex-direction: column; }
.nutrition-ingredients.collapsed { display: none; }

.nutrition-ingredient-row {
    display: flex; flex-wrap: wrap; justify-content: space-between;
    align-items: baseline; gap: 4px 14px; font-size: 16px;
    padding: 8px 0; border-bottom: 1px solid #222;
}
.nutrition-ingredient-row:last-child { border-bottom: none; }
.nutrition-ingredient-name { color: #f0f0f0; }
.nutrition-ingredient-value { color: #888; text-align: right; }

.nutrition-flag {
    color: #f59e0b; font-size: 13px;
    background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: 16px; padding: 2px 10px; white-space: nowrap;
}

.nutrition-flag-reason { flex-basis: 100%; font-size: 13px; color: #d97706; font-style: italic; margin-top: 2px; }

/* Cost flag — shown on a row where nutrition is ok but price is missing/uncomputable */
.nutrition-cost-flag { flex-basis: 100%; font-size: 12px; color: #f59e0b; font-style: italic; margin-top: 1px; opacity: 0.8; }

.nutrition-provenance { flex-basis: 100%; font-size: 12px; color: #666; font-style: italic; margin-top: 2px; }
`;
// ============================================================
// BOOTSTRAP
// ============================================================
function bootstrap() {
    document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);
    document.body.innerHTML = `<div id="app"></div>`;
    const recipeIdFromURL = getRecipeIdFromURL();
    if (recipeIdFromURL && state.recipes.has(recipeIdFromURL)) {
        state.selectedRecipeIds = [recipeIdFromURL];
        unlockAudioContext();
        navigateTo('cooking');
    }
    else {
        render();
    }
}
// ============================================================
// STORES
// ============================================================
export const stores = {
    amazon: 'Amazon',
    amazonFresh: 'Amazon Fresh',
    wholeFoods: 'Whole Foods',
};
// ============================================================
// INGREDIENT FACTORY
// ============================================================
function ingredientFactory(name, defaults = {}) {
    return (quantity = 0, unit = u.none) => {
        const ing = { name, quantity, unit, ...defaults };
        ing.rename = (newName) => { ing.name = newName; };
        return ing;
    };
}
function keyToName(key) {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (c) => c.toUpperCase());
}
function simpleIngredients(map) {
    return Object.fromEntries(Object.entries(map).map(([key, name]) => [
        key,
        ingredientFactory(name || keyToName(key)),
    ]));
}
// ============================================================
// ITEMS
// ============================================================
export const i = {
    ...simpleIngredients({
        apple: '', frozenBerries: '', cocoaFlavanols: '', wheatGrassPowder: '',
        creatine: '', chlorellaPowder: '', aminoComplex: '', acaiFrozenMix: '',
        blueprintBlueberryWalnut: '', blueprintCacao: '', frozenStrawberry: '',
        frozenCauliflower: '', frozenBroccoli: '', frozenBlueberry: '',
        blueprintNuttyPudding: '', egg: '', milk: '', bread: '',
        pomegranateSeeds: '', water: '', avocadoOil: '',
        abbotPeaItalianSausage: '', lentilSpaghetti: '', spaghettiSauce: '',
        pankoBreadCrumbs: '', salt: '', garlicPowder: '', cornstarch: '',
        cassavaFlour: '', kingOysterMushroom: '',
        whiteVinegar: '', bakingSoda: '',
        carrot: '', babyBellaMushroom: '', yellowOnion: '', oliveOil: '',
        rosemary: '', thyme: '',
    }),
    macadamiaNutMilk: ingredientFactory('Macadamia Nut Milk', {
        requiresDateLabel: true,
        defaultBrand: 'Milkadamia',
        products: [{
                brand: 'Milkadamia', variant: 'Unsweetened', store: stores.wholeFoods,
                link: 'https://www.amazon.com/dp/B01JH2O854',
                price: 6.19, size: 32, sizeUnit: u.fluidOunce,
                nutrition: {
                    [u.cup.name]: { servings: 4, servingSize: 1, calories: 50, sodium: 75, sugar: 0, protein: 1 },
                },
            }],
    }),
    macadamiaNut: ingredientFactory('Macadamia Nut', {
        defaultBrand: 'Blueprint',
        conversions: {
            [u.cup.name]: { to: u.ounce, factor: 4 }, // 1 cup ≈ 4 oz by weight
        },
        products: [
            {
                brand: '365', variant: 'Organic Raw', store: stores.wholeFoods,
                link: 'https://www.wholefoodsmarket.com/product/365-by-whole-foods-market-organic-macadamia-nuts-8-oz-b086hk83yf',
                price: 10.79, size: 8, sizeUnit: u.ounce, organic: true,
                nutrition: {
                    [u.cup.name]: { servings: 1, servingSize: 1, calories: 960, sodium: 7, sugar: 6, protein: 11 },
                },
            },
            {
                brand: 'Blueprint', variant: 'Raw', store: stores.amazon,
                link: 'https://www.amazon.com/Blueprint-Bryan-Johnson-Macadamia-Nuts/dp/B0DNGJFBS1',
                price: 12, size: 4, sizeUnit: u.ounce, organic: false,
                nutrition: {
                    [u.ounce.name]: { servings: 4, servingSize: 1, calories: 210, sodium: 2, sugar: 1, protein: 2 },
                },
            },
        ],
    }),
    cocoaNibs: ingredientFactory('Cocoa Nibs', {
        defaultBrand: 'Navitas',
        products: [{
                brand: 'Navitas', variant: 'Organic Raw',
                nutrition: {
                    [u.tsp.name]: { servings: 1, servingSize: 1, calories: 20, sodium: 0, sugar: 0, protein: 0.3 },
                },
            }],
    }),
    chiaSeed: ingredientFactory('Chia Seed', {
        defaultBrand: '365',
        products: [{
                brand: '365', variant: 'Organic Black', store: stores.wholeFoods,
                nutrition: {
                    [u.tsp.name]: { servings: 1, servingSize: 1, calories: 19, sodium: 0, sugar: 0, protein: 1 },
                },
            }],
    }),
    hempSeed: ingredientFactory('Hemp Seed', {
        defaultBrand: 'Manitoba Harvest',
        products: [{
                brand: 'Manitoba Harvest', variant: 'Hemp Hearts', store: stores.wholeFoods,
                nutrition: {
                    [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 55, sodium: 0, sugar: 0.5, protein: 3.3 },
                },
            }],
    }),
    antiOxidantBerryBlend: ingredientFactory('Antioxidant Berry Blend', {
        defaultBrand: '365',
        products: [{
                brand: '365', variant: 'Organic Antioxidant Fruit Blend (frozen)', store: stores.wholeFoods,
                size: 16, sizeUnit: u.ounce, organic: true,
                nutrition: {
                    [u.cup.name]: { servings: 4, servingSize: 1, calories: 70, sodium: 0, sugar: 13, protein: 1 },
                },
            }],
    }),
    vanillaExtract: ingredientFactory('Vanilla Extract', {
        defaultBrand: '365',
        products: [{
                brand: '365', variant: 'Organic Vanilla Extract', store: stores.wholeFoods,
                nutrition: { [u.fluidOunce.name]: { servings: 2, servingSize: 2, calories: 0, sodium: 0, sugar: 0, protein: 0 } },
                price: 8.79, size: 2, sizeUnit: u.fluidOunce, organic: true,
                link: 'https://www.amazon.com/365-Everyday-Value-Organic-Vanilla/dp/B074VBL8R9',
            }],
    }),
    lemonJuice: ingredientFactory('Lemon Juice', {
        defaultBrand: '365',
        products: [{
                brand: '365', variant: 'Organic Lemon Juice', store: stores.wholeFoods,
                nutrition: { [u.tsp.name]: { servings: 59, servingSize: 1, calories: 0, sodium: 0, sugar: 0, protein: 0 } },
                price: 3.49, size: 10, sizeUnit: u.fluidOunce, organic: true,
                link: 'https://www.amazon.com/365-Everyday-Value-Organic-Concentrate/dp/B074J5WZS8?th=1',
            }],
    }),
    cherry: ingredientFactory('Cherry', {
        nutrition: { [u.unit.name]: { servings: 1, servingSize: 1, calories: 5, sodium: 0, sugar: 1, protein: 0 } },
    }),
    celery: ingredientFactory('Celery', {
        nutrition: { [u.unit.name]: { servings: 1, servingSize: 1, calories: 6, sodium: 32, sugar: 1, protein: 0.3 } },
    }),
    spinach: ingredientFactory('Spinach', {
        nutrition: { [u.handful.name]: { servings: 1, servingSize: 1, calories: 7, sodium: 24, sugar: 0.1, protein: 0.9 } },
    }),
    kale: ingredientFactory('Kale', {
        nutrition: { [u.handful.name]: { servings: 1, servingSize: 1, calories: 8, sodium: 11, sugar: 0.2, protein: 0.7 } },
    }),
    banana: ingredientFactory('Organic Banana', {
        nutrition: { [u.unit.name]: { servings: 1, servingSize: 1, calories: 105, sodium: 1, sugar: 14, protein: 1.3 } },
    }),
    peanutButter: ingredientFactory('Peanut Butter', {
        defaultBrand: '365',
        products: [
            { brand: '365', variant: 'Organic Unsweetened', store: stores.wholeFoods,
                price: 4.19, size: 16, sizeUnit: u.ounce, organic: true,
                link: 'https://www.amazon.com/365-Everyday-Value-Organic-Unsweetened/dp/B074H61LYV/ref=sr_1_9_0o_wf' },
            { brand: '365', variant: 'Creamy', store: stores.wholeFoods,
                price: 2.49, size: 16, sizeUnit: u.ounce,
                link: 'https://www.amazon.com/365-Everyday-Value-Peanut-Butter/dp/B074H57SPT/ref=sr_1_7_0o_wf' },
            { brand: '365', variant: 'Crunchy', store: stores.wholeFoods,
                price: 4.99, size: 36, sizeUnit: u.ounce,
                link: 'https://www.amazon.com/Everyday-Value-Peanut-Butter-Crunchy/dp/B074Y2V88X/ref=sr_1_16_0o_wf' },
            { brand: 'Amazon Brand', variant: 'Creamy', store: stores.amazon,
                price: 4.69, size: 40, sizeUnit: u.ounce,
                link: 'https://www.amazon.com/dp/B07KWGSCW2/ref=sns_myd_detail_page',
                discount: { subscribe5Products: 5 } },
        ],
    }),
    pittedDates: ingredientFactory('Pitted Dates', {
        defaultBrand: '365',
        products: [
            { brand: '365', store: stores.wholeFoods, price: 3.99, size: 8, sizeUnit: u.ounce,
                link: 'https://www.amazon.com/365-Everyday-Value-Dates-Pitted/dp/B074VDMNH7/ref=sr_1_5_0o_wf' },
            { brand: 'Food to Live', variant: 'Organic Deglet Nour', store: stores.amazon,
                price: 16.59, size: 2.5, sizeUnit: u.pound, organic: true,
                link: 'https://www.amazon.com/ORGANIC-Pitted-Dates-Deglet-Nour/dp/B0872L82ZK/ref=sr_1_10',
                discount: { subscribe5Products: 5 } },
        ],
    }),
    orangeJuice: ingredientFactory('Orange Juice', {
        nutrition: {
            [u.fluidOunce.name]: { servings: 8, servingSize: 7, calories: 110, sodium: 0, sugar: 22, protein: 2 },
        },
    }),
    strawberry: ingredientFactory('Strawberry', {
        defaultBrand: '365',
        products: [{
                brand: '365', variant: 'Organic Whole Strawberries (frozen)', store: stores.wholeFoods,
                price: 6.69, size: 32, sizeUnit: u.ounce, organic: true,
                link: 'https://www.wholefoodsmarket.com/product/365-by-whole-foods-market-365-whole-foods-market-organic-whole-strawberries-b09gcp3jng',
            }],
    }),
    collagenPowder: ingredientFactory('Collagen Powder', {
        defaultBrand: 'Sports Research',
        products: [{
                brand: 'Sports Research', store: stores.amazon,
                price: 17.99, size: 1, sizeUnit: u.pound,
                link: 'https://www.amazon.com/gp/product/B071S8D69C/ref=ppx_yo_dt_b_asin_title_o00_s00',
                discount: { subscribe5Products: 5 },
            }],
    }),
    psyllium: ingredientFactory('Psyllium Husk', {
        defaultBrand: '365',
        products: [{
                brand: '365', variant: 'Organic Whole Flakes', store: stores.wholeFoods,
                link: 'https://www.amazon.com/365-Whole-Foods-Market-Psyllium/dp/B0CDQJRFGX',
                nutrition: {
                    [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 15, sodium: 5, sugar: 0, protein: 0 },
                },
            }],
    }),
    blueprintMacadamiaBar: ingredientFactory('Blueprint Macadamia Bar', {
        defaultBrand: 'Blueprint',
        products: [{
                brand: 'Blueprint', variant: 'White Cocoa Macadamia Protein Bar', store: stores.amazon,
                link: 'https://www.amazon.com/Blueprint-Bryan-Johnson-Macadamia-White/dp/B0DQLV78BG',
                nutrition: {
                    [u.unit.name]: { servings: 1, servingSize: 1, calories: 160, sodium: 80, sugar: 1, protein: 9 },
                },
            }],
    }),
    blackLentils: ingredientFactory('Black Lentils', {
        defaultBrand: '365',
        conversions: {
            [u.gram.name]: { to: u.cup, factor: 1 / 172 }, // 43g = ¼ cup dry, per nutrition label
        },
        products: [{
                brand: '365', variant: 'Organic, Black, dry', store: stores.wholeFoods,
                size: 16, sizeUnit: u.ounce, organic: true,
                link: 'https://www.amazon.com/365-Whole-Foods-Market-Organic/dp/B084NHD2R9',
                nutrition: {
                    [u.cup.name]: { servings: 1, servingSize: 1, calories: 600, sodium: 0, sugar: 0, protein: 44 },
                },
            }],
    }),
    blueprintOliveOil: ingredientFactory('Extra Virgin Olive Oil', {
        defaultBrand: 'Blueprint',
        conversions: {
            [u.shot.name]: { to: u.fluidOunce, factor: 1 }, // 1 shot = 1 fl oz
        },
        products: [{
                brand: 'Blueprint', variant: 'Snake Oil (High Polyphenol EVOO)', store: stores.amazon,
                size: 25, sizeUnit: u.fluidOunce,
                price: 35,
                link: 'https://www.amazon.com/Blueprint-Bryan-Johnson-Olive-Oil/dp/B0F1P5SR2M',
                nutrition: {
                    [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 120, sodium: 0, sugar: 0, protein: 0 },
                },
            }],
    }),
    longevityProtein: ingredientFactory('Longevity Protein', {
        defaultBrand: 'Blueprint',
        products: [{
                brand: 'Blueprint', variant: 'Chocolate (30 servings)', store: stores.amazon,
                price: 94,
                size: 30, sizeUnit: u.unit, // 30 scoops per container
                link: 'https://www.amazon.com/Blueprint-Bryan-Johnson-Longevity-Protein/dp/B0DNGJRLQF',
                nutrition: {
                    [u.unit.name]: { servings: 1, servingSize: 1, calories: 200, sodium: 200, sugar: 0, protein: 26 },
                },
            }],
    }),
    blueberryNutMix: ingredientFactory('Blueberry Nut Mix', {
        defaultBrand: 'Blueprint',
        products: [{
                brand: 'Blueprint', variant: 'Macadamia + Walnut + Blueberry', store: stores.amazon,
                price: 37,
                size: 30, sizeUnit: u.unit, // 30 scoops per container
                link: 'https://www.amazon.com/Blueprint-Bryan-Johnson-Blueberry-Nut/dp/B0D3FZ29RJ',
                nutrition: {
                    [u.unit.name]: { servings: 1, servingSize: 1, calories: 70, sodium: 0, sugar: 5, protein: 1 },
                },
            }],
    }),
};
// ============================================================
// RECIPES
// ============================================================
registerGroup('Breakfast', [
    createRecipe('blueprint-smoothie', 'Blueprint Smoothie', (() => {
        const mixer = e.bulletMixer();
        const MACADAMIA_MILK = i.macadamiaNutMilk(1, u.cup);
        const steps = [];
        const s = (...newSteps) => steps.push(...newSteps);
        s(mixer.add([
            MACADAMIA_MILK,
            i.lemonJuice(2, u.tbsp),
            i.macadamiaNut(0.25, u.cup),
            i.cocoaNibs(1, u.tsp),
            i.chiaSeed(1, u.tsp),
            i.hempSeed(1, u.tbsp),
            i.cherry(3, u.unit),
            i.antiOxidantBerryBlend(0.5, u.cup),
            i.vanillaExtract(0.25, u.tsp),
        ]));
        s(mixer.mix());
        s(mixer.add([
            i.celery(1, u.unit),
            i.spinach(1, u.handful),
            i.kale(1, u.handful),
            i.banana(1, u.unit),
        ]));
        s(Timer.set(30, 's', 'Let mixer settle'));
        s(mixer.mix());
        return steps;
    })(), undefined, 8),
]);
// Moved out of the Dinner array — registers itself under its own 'Cleaning' group
registerRecipe(createRecipe('clean-water-bottle', 'Clean Water Bottle', [
    instruction('Make sure the straw is in the water bottle'),
    instruction('Power wash the top to remove dust'),
    instruction('Add about 10 seconds of water to the bottle'),
    instruction('Add vinegar', {
        ingredients: [i.whiteVinegar(1, u.tsp)],
    }),
    Timer.set(45, 's', 'Shake'),
    instruction('Dump out the water'),
    instruction('Clean the straw with a straw pipe cleaner'),
    instruction('Add about 10 seconds of water to the bottle'),
    instruction('Add baking soda', {
        ingredients: [i.bakingSoda(0.5, u.tsp)],
    }),
    Timer.set(45, 's', 'Shake'),
    instruction('Dump out the water'),
    instruction('Add about 10 seconds of water to the bottle'),
    Timer.set(20, 's', 'Shake'),
    instruction('Dump out the water'),
    instruction('Fill the bottle about ¼ full with water'),
    instruction('Dump out the water'),
    instruction('Let the bottle air dry'),
], 'Cleaning'));
registerGroup('Dinner', [
    createRecipe('breaded-mushrooms', 'Breaded Mushrooms', (() => {
        const pankoPan = e.pan('panko pan');
        const pankoBowl = e.bowl('panko bowl');
        const oven = e.oven();
        const batter = e.bowl('batter bowl');
        const cuttingBoard = e.cuttingBoard();
        const PANKO = i.pankoBreadCrumbs(3, u.cup);
        const MUSHROOMS = i.kingOysterMushroom(4, u.unit);
        const steps = [];
        const s = (...newSteps) => steps.push(...newSteps);
        s(oven.preheat(450));
        s(pankoPan.add([PANKO]));
        s(oven.place(pankoPan, 'Toast panko', time.minutes(5), 450));
        const transferToBowl = pankoPan.transfer(pankoBowl, [PANKO]);
        s(transferToBowl);
        s(batter.add([
            i.water(7, u.ounce),
            i.salt(0.5, u.tsp),
            i.garlicPowder(0.5, u.tsp),
            i.cornstarch(2, u.tbsp),
            i.cassavaFlour(0.5, u.cup),
        ]));
        s(batter.mix('batter'));
        s(cuttingBoard.slice(MUSHROOMS));
        s(batter.combine([MUSHROOMS], 'dip, let drain').waitFor(transferToBowl));
        s(pankoPan.spray(i.avocadoOil(1, u.spray)));
        s(pankoBowl.combine([batter.result], 'coat with panko'));
        pankoBowl.result.rename('Breaded King Oyster Mushroom');
        s(pankoBowl.transfer(pankoPan, [pankoBowl.result]));
        s(pankoPan.spray(i.avocadoOil(1, u.spray)));
        s(oven.place(pankoPan));
        s(oven.cook('Bake mushrooms (first half)', time.minutes(12), 450));
        s(pankoPan.flip());
        s(oven.cook('Bake mushrooms (second half)', time.minutes(13), 450));
        s(oven.broil('Broil mushrooms', time.minutes(1)));
        return steps;
    })()),
    createRecipe('steakhouse-roasted-vegetables', 'Heart-Healthy "Steakhouse" Roasted Vegetables', (() => {
        const oven = e.oven();
        const bowl = e.bowl();
        const CARROTS = i.carrot(1, u.pound);
        const MUSHROOMS = i.babyBellaMushroom(8, u.ounce);
        const ONION = i.yellowOnion(1, u.unit);
        const steps = [];
        const s = (...newSteps) => steps.push(...newSteps);
        s(oven.preheat(450));
        s(instruction('Place sheet pan in oven while it preheats', { equipment: ['oven', 'sheet pan'] }));
        s(bowl.add([
            [CARROTS, 'peeled, cut lengthwise or into thick diagonals'],
            [MUSHROOMS, 'halved'],
            [ONION, 'cut into 8 wedges'],
            i.oliveOil(1, u.tbsp),
            i.salt(1, u.tsp),
            i.rosemary(2, u.tsp),
            i.thyme(2, u.tsp),
        ]));
        s(bowl.mix());
        s(instruction('Carefully spread vegetables onto the hot sheet pan in a single layer, leaving space between pieces', {
            equipment: ['sheet pan'],
            ingredients: [CARROTS, MUSHROOMS, ONION],
        }));
        s(Timer.set(20, 'm', 'Roast — do not move'));
        s(instruction('Flip everything on the sheet pan', { equipment: ['sheet pan'], ingredients: [CARROTS, MUSHROOMS, ONION] }));
        s(Timer.set(17, 'm', 'Roast until carrots are caramelized, mushrooms deeply browned, onions soft with crispy tips'));
        s(Timer.set(5, 'm', 'Rest vegetables before serving'));
        return steps;
    })(), undefined, 45),
    createRecipe('abbot-pea-protein-spaghetti', 'Abbot Pea Protein Spaghetti', (() => {
        const pot = e.pot();
        const pan = e.pan();
        const steps = [];
        const s = (...newSteps) => steps.push(...newSteps);
        s(pan.add([i.avocadoOil(1, u.spray), i.abbotPeaItalianSausage(1, u.bag)]));
        s(pan.cook('Cook sausage', time.minutes(5), 5));
        s(pot.add([i.water(30, u.ounce)]));
        s(pot.cook('Bring water to boil', time.minutes(6), 9));
        s(pot.add([
            i.avocadoOil(1, u.spray),
            [i.lentilSpaghetti(8, u.ounce), 'break into 3 even sections first'],
        ]));
        s(pan.cook('Continue cooking sausage', time.minutes(10), 7));
        s(pot.cook('Cook spaghetti (first half)', time.minutes(7), 7));
        s(pot.stir());
        s(pot.cook('Cook spaghetti (second half)', time.minutes(7), 7));
        s(pan.add([i.spaghettiSauce(1, u.bag)]));
        s(pan.cook('Simmer sauce with sausage', time.minutes(5), 7));
        return steps;
    })()),
]);
registerGroup('Ingredients', [
    createRecipe('ing-black-lentils', 'Black Lentils (65g)', [
        instruction('Have 65g black lentils on hand', { ingredients: [i.blackLentils(65, u.gram)] }),
    ]),
    createRecipe('ing-macadamia-bar', 'Blueprint Macadamia Bar', [
        instruction('Have 1 Blueprint Macadamia Bar on hand', {
            ingredients: [i.blueprintMacadamiaBar(1, u.unit)],
        }),
    ]),
    createRecipe('ing-psyllium-husk', 'Psyllium Husk (1 tbsp)', [
        instruction('Have 1 tbsp psyllium husk on hand', {
            ingredients: [i.psyllium(1, u.tbsp)],
        }),
    ]),
]);
registerRecipe(createRecipe('protein-nutmix-oliveoil', 'Blueprint (Nutty Pudding) - Protein, Nut Mix & Olive Oil', [
    instruction('Have 1 scoop Blueprint longevity protein on hand', {
        ingredients: [i.longevityProtein(1, u.unit)],
    }),
    instruction('Have 1 scoop Blueprint blueberry nut mix on hand', {
        ingredients: [i.blueberryNutMix(1, u.unit)],
    }),
    instruction('Take 2 shots of Blueprint olive oil', {
        ingredients: [i.blueprintOliveOil(2, u.shot)],
    }),
]));
// ============================================================
// START APP
// ============================================================
document.addEventListener('DOMContentLoaded', bootstrap);
