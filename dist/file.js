// ============================================================
// RECIPE SYSTEM
// Single-file architecture optimized for readability and AI context
// ============================================================
const PLAN_CONFIG_KEY = 'recipe-plan-config';
const DEFAULT_PLAN_CONFIG = {
    blocks: [
        { id: 'b1', start: '07:00', end: '08:00', type: 'home' },
        { id: 'b2', start: '08:00', end: '12:00', type: 'away' },
        { id: 'b3', start: '12:00', end: '12:30', type: 'portable' },
        { id: 'b4', start: '12:30', end: '17:00', type: 'away' },
        { id: 'b5', start: '17:00', end: '22:00', type: 'home' },
    ],
    caloriesCutoff: '14:00',
};
function loadPlanConfig() {
    try {
        const raw = localStorage.getItem(PLAN_CONFIG_KEY);
        if (raw)
            return JSON.parse(raw);
    }
    catch { }
    return JSON.parse(JSON.stringify(DEFAULT_PLAN_CONFIG));
}
function savePlanConfig(cfg) {
    localStorage.setItem(PLAN_CONFIG_KEY, JSON.stringify(cfg));
}
// ============================================================
// GLOBAL STATE
// ============================================================
// Recipe IDs to pin to the top of the list. Edit at build time.
const FAVORITE_RECIPE_IDS = [
    'blueprint-smoothie',
];
const state = {
    recipes: new Map(),
    bundles: new Map(),
    selectedRecipeIds: [],
    timers: new Map(),
    screen: 'select',
    searchQuery: '',
    cookingPlanSteps: [],
    cookingStartedAt: null,
    cookingElapsedInterval: null,
    audioUnlocked: false,
};
const macroTargets = { calories: 2550, protein: 147, fat: 114, saturatedFat: 20, transFat: 0, carbs: 234, sodium: 2300, fiber: 38 };
const nutritionExclusions = new Map();
const eatenRecipeIds = new Set();
const nutritionExpanded = new Set();
function getNutritionExcluded(recipeId) {
    if (!nutritionExclusions.has(recipeId))
        nutritionExclusions.set(recipeId, new Set());
    return nutritionExclusions.get(recipeId);
}
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
// Extends convertUnits with ingredient-specific density conversions (e.g. unit → cup → oz).
// Recursively chains density hops until a physical conversion closes the gap, or returns null.
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
    return convertWithDensity(afterDensity, intermediate, to, conversions);
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
export function prep(text, opts = {}) {
    return createStep({ type: 'instruction', text, prep: true, ...opts });
}
export function prepOnly(text, opts = {}) {
    return createStep({ type: 'instruction', text, prep: true, prepOnly: true, ...opts });
}
export function timerStep(label, durationSeconds, opts = {}) {
    return createStep({ type: 'timer', text: label, durationSeconds, ...opts });
}
export const Timer = {
    set: (amount, unit, label, opts = {}) => {
        const seconds = unit === 's' ? amount : unit === 'm' ? amount * 60 : amount * 3600;
        return createStep({ type: 'timer', text: label, durationSeconds: seconds, ...opts });
    },
};
export function cleanup(equipmentName) {
    return createStep({
        type: 'cleanup',
        text: `Clean and put away ${equipmentName}`,
        equipment: [equipmentName],
    });
}
export function info(text, opts = {}) {
    return createStep({ type: 'info', text, ...opts });
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
class NuwaveEquipment extends Equipment {
    constructor(label) { super('Nuwave pan', label); }
    preheat(temperature) {
        const duration = temperature === 350 ? time.minutes(2) : time.minutes(3);
        return timerStep(`Preheat ${this.name} to ${temperature}°`, duration, { equipment: [this.name] });
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
    colander: (label) => new Equipment('colander', label),
    nuwavePan: (label) => new NuwaveEquipment(label),
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
function withPlan(recipe, opts) {
    return Object.assign(recipe, opts);
}
export function registerGroup(group, recipes) {
    recipes.forEach((recipe) => registerRecipe({ ...recipe, group }));
}
export function registerBundle(bundle) {
    state.bundles.set(bundle.id, bundle);
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
        if (a.sortOrder !== undefined && b.sortOrder !== undefined)
            return a.sortOrder - b.sortOrder;
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
    const steps = recipes.flatMap(r => r.steps.filter(s => !s.prepOnly));
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
const emptyTotals = () => ({ calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 });
const addTotals = (a, b) => ({
    calories: a.calories + b.calories,
    fat: a.fat + b.fat,
    saturatedFat: a.saturatedFat + b.saturatedFat,
    transFat: a.transFat + b.transFat,
    cholesterol: a.cholesterol + b.cholesterol,
    carbs: a.carbs + b.carbs,
    sodium: a.sodium + b.sodium,
    sugar: a.sugar + b.sugar,
    protein: a.protein + b.protein,
    fiber: a.fiber + b.fiber,
});
const scaleTotals = (t, n) => ({
    calories: t.calories * n,
    fat: t.fat * n,
    saturatedFat: t.saturatedFat * n,
    transFat: t.transFat * n,
    cholesterol: t.cholesterol * n,
    carbs: t.carbs * n,
    sodium: t.sodium * n,
    sugar: t.sugar * n,
    protein: t.protein * n,
    fiber: t.fiber * n,
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
            fat: (facts.fat ?? 0) * servingsUsed,
            saturatedFat: (facts.saturatedFat ?? 0) * servingsUsed,
            transFat: (facts.transFat ?? 0) * servingsUsed,
            cholesterol: (facts.cholesterol ?? 0) * servingsUsed,
            carbs: (facts.carbs ?? 0) * servingsUsed,
            sodium: (facts.sodium ?? 0) * servingsUsed,
            sugar: (facts.sugar ?? 0) * servingsUsed,
            protein: (facts.protein ?? 0) * servingsUsed,
            fiber: (facts.fiber ?? 0) * servingsUsed,
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
    return `${costStr}${Math.round(t.calories)} cal · ${Math.round(t.protein)} g protein · ` +
        `${Math.round(t.fat)} g fat (${Math.round(t.saturatedFat)} sat${t.transFat > 0 ? ` / ${Math.round(t.transFat)} trans` : ''}) · ` +
        `${Math.round(t.cholesterol)} mg chol · ` +
        `${Math.round(t.carbs)} g carbs · ` +
        `${Math.round(t.fiber)} g fiber · ${Math.round(t.sugar)} g sugar · ${Math.round(t.sodium)} mg sodium`;
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
    if (state.bundles.size > 0 && !state.searchQuery) {
        const bundleHeading = document.createElement('h3');
        bundleHeading.textContent = 'Bundles';
        bundleHeading.className = 'group-heading';
        root.appendChild(bundleHeading);
        state.bundles.forEach((bundle) => {
            const row = document.createElement('div');
            row.className = 'bundle-row';
            const btn = document.createElement('button');
            btn.className = 'bundle-btn';
            btn.textContent = bundle.name;
            const sub = document.createElement('span');
            sub.className = 'bundle-sub';
            sub.textContent = bundle.recipeIds
                .map(id => state.recipes.get(id)?.name ?? id)
                .join(' · ');
            btn.appendChild(sub);
            btn.addEventListener('click', () => {
                for (const id of bundle.recipeIds)
                    state.selectedRecipeIds.push(id);
                unlockAudioContext();
                renderRecipeList();
                updateActionButtons();
            });
            row.appendChild(btn);
            root.appendChild(row);
        });
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
    const planBtn = createButton('📅 Plan', () => navigateTo('plan'));
    planBtn.className = 'action-btn action-btn-plan';
    actions.appendChild(shopBtn);
    actions.appendChild(nutritionBtn);
    actions.appendChild(planBtn);
    const selectedRecipes = getSelectedRecipes();
    const hasPrep = selectedRecipes.some(r => r.steps.some(function walk(s) {
        return !!s.prep || (s.children?.some(walk) ?? false);
    }));
    if (hasPrep) {
        const prepBtn = createButton('🔪 Prep', () => navigateTo('prep'));
        prepBtn.className = 'action-btn action-btn-prep';
        actions.appendChild(prepBtn);
    }
    const hasCookable = selectedRecipes.some(r => !r.adhoc);
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
            const sorted = [...products].sort((a, b) => {
                const aPpu = a.price !== undefined && a.size !== undefined ? a.price / a.size : Infinity;
                const bPpu = b.price !== undefined && b.size !== undefined ? b.price / b.size : Infinity;
                return aPpu - bPpu;
            });
            sorted.forEach((product) => {
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
                const ppu = product.price !== undefined && product.size !== undefined
                    ? ` ($${(product.price / product.size).toFixed(2)}/${product.sizeUnit?.name ?? 'unit'})`
                    : '';
                const sasPpu = product.discount?.subscribeAndSave !== undefined && product.size !== undefined
                    ? ` ($${(product.discount.subscribeAndSave / product.size).toFixed(2)}/${product.sizeUnit?.name ?? 'unit'})` : '';
                const sas = product.discount?.subscribeAndSave !== undefined
                    ? ` · S&S $${product.discount.subscribeAndSave}${sasPpu}` : '';
                const pick = product === chosen ? ' ✓' : '';
                a.textContent = `${product.brand}${variant}${where}${pkg}${ppu}${sas}${pick}`;
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
// MACRO TARGETS PANEL
// ============================================================
function renderMacroTargetsPanel(grand) {
    const panel = createPanel();
    panel.className = 'panel macro-targets';
    const title = document.createElement('div');
    title.className = 'macro-targets-title';
    title.textContent = 'Daily Targets';
    panel.appendChild(title);
    const header = document.createElement('div');
    header.className = 'macro-row macro-header';
    ['', 'Target', 'Eaten', 'Remaining'].forEach(text => {
        const cell = document.createElement('span');
        cell.textContent = text;
        header.appendChild(cell);
    });
    panel.appendChild(header);
    const totalCals = grand.calories > 0 ? grand.calories : null;
    const pct = (grams, calsPerGram) => grams !== null && totalCals ? ` (${Math.round((grams * calsPerGram / totalCals) * 100)}%)` : '';
    const totalMacroG = grand.protein + grand.fat + grand.carbs;
    const macroPct = (grams) => grams !== null && totalMacroG > 0 ? ` / ${Math.round((grams / totalMacroG) * 100)}%` : '';
    const rows = [
        { label: 'Calories', key: 'calories', actual: grand.calories > 0 ? Math.round(grand.calories) : null, unit: 'kcal' },
        { label: 'Protein', key: 'protein', actual: grand.protein > 0 ? Math.round(grand.protein) : null, unit: 'g', calPct: pct(grand.protein > 0 ? grand.protein : null, 4), macroPct: macroPct(grand.protein > 0 ? grand.protein : null) },
        { label: 'Fat', key: 'fat', actual: grand.fat > 0 ? Math.round(grand.fat) : null, unit: 'g', calPct: pct(grand.fat > 0 ? grand.fat : null, 9), macroPct: macroPct(grand.fat > 0 ? grand.fat : null) },
        { label: '↳ Sat Fat', key: 'saturatedFat', actual: grand.saturatedFat > 0 ? Math.round(grand.saturatedFat * 10) / 10 : null, unit: 'g', indent: true, cap: true, calPct: pct(grand.saturatedFat > 0 ? grand.saturatedFat : null, 9) },
        { label: '↳ Trans Fat', key: 'transFat', actual: grand.transFat > 0 ? Math.round(grand.transFat * 10) / 10 : null, unit: 'g', indent: true, cap: true, calPct: pct(grand.transFat > 0 ? grand.transFat : null, 9) },
        { label: 'Carbs', key: 'carbs', actual: grand.carbs > 0 ? Math.round(grand.carbs) : null, unit: 'g', calPct: pct(grand.carbs > 0 ? grand.carbs : null, 4), macroPct: macroPct(grand.carbs > 0 ? grand.carbs : null) },
        { label: 'Fiber', key: 'fiber', actual: grand.fiber > 0 ? Math.round(grand.fiber) : null, unit: 'g' },
        { label: 'Sodium', key: 'sodium', actual: grand.sodium > 0 ? Math.round(grand.sodium) : null, unit: 'mg', cap: true },
    ];
    rows.forEach(({ label, key, actual, unit, indent, cap, calPct, macroPct }) => {
        const row = document.createElement('div');
        row.className = 'macro-row' + (indent ? ' macro-row-indent' : '');
        const labelEl = document.createElement('span');
        labelEl.className = 'macro-label' + (indent ? ' macro-label-sub' : '');
        labelEl.textContent = label;
        row.appendChild(labelEl);
        const inputWrap = document.createElement('span');
        inputWrap.className = 'macro-target-wrap';
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.className = 'macro-target-input';
        input.value = String(macroTargets[key]);
        const unitLabel = document.createElement('span');
        unitLabel.className = 'macro-unit-label';
        unitLabel.textContent = unit;
        inputWrap.appendChild(input);
        inputWrap.appendChild(unitLabel);
        row.appendChild(inputWrap);
        const actualEl = document.createElement('span');
        actualEl.className = 'macro-actual';
        actualEl.textContent = actual !== null ? `${actual} ${unit}${calPct ?? ''}${macroPct ?? ''}` : '—';
        row.appendChild(actualEl);
        const initRemaining = actual !== null ? macroTargets[key] - actual : null;
        const remainClass = (rem) => {
            if (rem === null)
                return 'macro-remaining';
            if (cap)
                return rem < 0 ? 'macro-remaining over' : rem === 0 ? 'macro-remaining met' : 'macro-remaining';
            return rem <= 0 ? 'macro-remaining met' : 'macro-remaining';
        };
        const remainText = (rem) => {
            if (rem === null)
                return '—';
            if (cap)
                return rem < 0 ? `${Math.round(-rem)} ${unit} over` : rem === 0 ? '✓ at limit' : `${Math.round(rem)} ${unit} left`;
            return rem > 0 ? `${Math.round(rem)} ${unit}` : '✓ met';
        };
        const remainEl = document.createElement('span');
        remainEl.className = remainClass(initRemaining);
        remainEl.textContent = remainText(initRemaining);
        row.appendChild(remainEl);
        input.addEventListener('change', () => {
            const v = parseFloat(input.value);
            if (!isNaN(v) && v > 0) {
                macroTargets[key] = v;
                const newRemaining = actual !== null ? v - actual : null;
                remainEl.textContent = remainText(newRemaining);
                remainEl.className = remainClass(newRemaining);
            }
        });
        panel.appendChild(row);
    });
    return panel;
}
function buildRecipeSuggestions(grand) {
    const remCals = macroTargets.calories - grand.calories;
    if (remCals < 50)
        return []; // nearly full — no suggestions needed
    const remaining = {
        calories: Math.max(0, remCals),
        protein: Math.max(0, macroTargets.protein - grand.protein),
        fat: Math.max(0, macroTargets.fat - grand.fat),
        carbs: Math.max(0, macroTargets.carbs - grand.carbs),
    };
    const results = [];
    for (const recipe of state.recipes.values()) {
        if (recipe.adhoc)
            continue;
        const nutr = recipeNutrition(recipe);
        if (nutr.covered === 0)
            continue;
        const t = nutr.totals;
        const macros = [
            { val: t.calories, rem: remaining.calories, w: 0.4 },
            { val: t.protein, rem: remaining.protein, w: 0.3 },
            { val: t.fat, rem: remaining.fat, w: 0.15 },
            { val: t.carbs, rem: remaining.carbs, w: 0.15 },
        ];
        let score = 0;
        let totalWeight = 0;
        for (const { val, rem, w } of macros) {
            if (rem <= 0)
                continue;
            score += Math.min(val / rem, 1) * w;
            totalWeight += w;
        }
        if (totalWeight === 0)
            continue;
        score /= totalWeight;
        // Penalise recipes that would meaningfully bust cap nutrients
        const sodiumRemaining = macroTargets.sodium - grand.sodium;
        if (sodiumRemaining > 0 && t.sodium > sodiumRemaining * 1.5)
            score *= 0.7;
        const satFatRemaining = macroTargets.saturatedFat - grand.saturatedFat;
        if (satFatRemaining > 0 && t.saturatedFat > satFatRemaining * 1.5)
            score *= 0.8;
        results.push({ recipe, score, totals: t });
    }
    return results.sort((a, b) => b.score - a.score).slice(0, 3);
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
    // Pre-compute effective totals per recipe, zeroing out excluded ingredients
    const perRecipeEff = perRecipe.map(({ recipe, servings, nutrition }) => {
        const excluded = getNutritionExcluded(recipe.id);
        const effTotals = nutrition.breakdown.reduce((acc, b) => excluded.has(b.ing) || b.result.status !== 'ok' ? acc : addTotals(acc, b.result.totals), emptyTotals());
        const effCost = nutrition.breakdown.reduce((acc, b) => excluded.has(b.ing) || b.costResult.status !== 'ok' ? acc : acc + b.costResult.cost, 0);
        return { recipe, servings, nutrition, excluded, effTotals, effCost };
    });
    // ── Grand total ──────────────────────────────────────────
    const grand = perRecipeEff.reduce((acc, p) => addTotals(acc, scaleTotals(p.effTotals, p.servings)), emptyTotals());
    const grandCost = perRecipeEff.reduce((acc, p) => acc + p.effCost * p.servings, 0);
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
    // 30-day cost projection
    if (hasCostData) {
        const monthly = document.createElement('div');
        monthly.className = 'nutrition-monthly-cost';
        monthly.textContent = `$${(grandCost * 30).toFixed(2)} / 30 days`;
        totalCard.appendChild(monthly);
    }
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
    root.appendChild(renderMacroTargetsPanel(grand));
    // ── Per recipe (expandable) ──────────────────────────────
    perRecipeEff.forEach(({ recipe, servings, nutrition, excluded, effTotals, effCost }) => {
        const section = createPanel();
        section.className = 'panel nutrition-recipe';
        if (eatenRecipeIds.has(recipe.id))
            section.classList.add('nutrition-recipe-eaten');
        const flaggedCount = nutrition.missing + nutrition.uncomputable;
        const sectionTotals = scaleTotals(effTotals, servings);
        const sectionCost = effCost * servings;
        const recipeHasCostData = nutrition.total > nutrition.costMissing;
        const header = document.createElement('div');
        header.className = 'nutrition-recipe-header';
        const caret = document.createElement('span');
        caret.className = 'nutrition-caret';
        caret.textContent = nutritionExpanded.has(recipe.id) ? '▾' : '▸';
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
        const servingControls = document.createElement('div');
        servingControls.className = 'nutrition-serving-controls';
        const minusBtn = document.createElement('button');
        minusBtn.className = 'nutrition-serving-btn';
        minusBtn.textContent = '−';
        minusBtn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            const idx = state.selectedRecipeIds.lastIndexOf(recipe.id);
            if (idx !== -1)
                state.selectedRecipeIds.splice(idx, 1);
            renderNutritionScreen();
        });
        const countLabel = document.createElement('span');
        countLabel.className = 'nutrition-serving-count';
        countLabel.textContent = `×${servings}`;
        const plusBtn = document.createElement('button');
        plusBtn.className = 'nutrition-serving-btn';
        plusBtn.textContent = '+';
        plusBtn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            state.selectedRecipeIds.push(recipe.id);
            renderNutritionScreen();
        });
        servingControls.appendChild(minusBtn);
        servingControls.appendChild(countLabel);
        servingControls.appendChild(plusBtn);
        const eatenBtn = document.createElement('button');
        eatenBtn.className = 'nutrition-eaten-btn';
        eatenBtn.textContent = eatenRecipeIds.has(recipe.id) ? '✓' : '○';
        eatenBtn.title = eatenRecipeIds.has(recipe.id) ? 'Mark as not eaten' : 'Mark as eaten';
        eatenBtn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            if (eatenRecipeIds.has(recipe.id))
                eatenRecipeIds.delete(recipe.id);
            else
                eatenRecipeIds.add(recipe.id);
            renderNutritionScreen();
        });
        header.appendChild(caret);
        header.appendChild(name);
        header.appendChild(servingControls);
        header.appendChild(eatenBtn);
        header.appendChild(sub);
        section.appendChild(header);
        const cov = document.createElement('div');
        cov.className = 'nutrition-coverage' + (flaggedCount > 0 ? ' flagged' : '');
        const costNote = nutrition.costMissing > 0
            ? ` · ⚠ ${nutrition.costMissing} missing price`
            : '';
        cov.textContent = (flaggedCount > 0 ? '⚠ ' : '') +
            coverageLabel(nutrition.covered, nutrition.total, flaggedCount) + costNote;
        section.appendChild(cov);
        // Per-ingredient breakdown
        const list = document.createElement('div');
        const isExpanded = nutritionExpanded.has(recipe.id);
        list.className = 'nutrition-ingredients' + (isExpanded ? '' : ' collapsed');
        nutrition.breakdown.forEach(({ ing, result, costResult }) => {
            const isExcluded = excluded.has(ing);
            const row = document.createElement('div');
            row.className = 'nutrition-ingredient-row';
            if (isExcluded)
                row.classList.add('nutrition-ingredient-excluded');
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'nutrition-ingredient-toggle';
            toggleBtn.textContent = isExcluded ? '+' : '−';
            toggleBtn.title = isExcluded ? 'Include in totals' : 'Exclude from totals';
            toggleBtn.addEventListener('click', () => {
                if (isExcluded)
                    excluded.delete(ing);
                else
                    excluded.add(ing);
                renderNutritionScreen();
            });
            row.appendChild(toggleBtn);
            const ingName = document.createElement('span');
            ingName.className = 'nutrition-ingredient-name';
            const scaledIng = { ...ing, quantity: (ing.quantity ?? 0) * servings };
            ingName.textContent = formatIngredient(scaledIng);
            row.appendChild(ingName);
            const detail = document.createElement('span');
            if (isExcluded) {
                detail.className = 'nutrition-ingredient-value';
                detail.textContent = '— excluded';
            }
            else if (result.status === 'ok') {
                detail.className = 'nutrition-ingredient-value';
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
            if (!isExcluded && result.status === 'uncomputable') {
                const reason = document.createElement('div');
                reason.className = 'nutrition-flag-reason';
                reason.textContent = result.reason;
                row.appendChild(reason);
            }
            if (!isExcluded && result.status === 'ok' && costResult.status !== 'ok') {
                const costFlag = document.createElement('div');
                costFlag.className = 'nutrition-cost-flag';
                costFlag.textContent = costResult.status === 'missing'
                    ? '⚠ no price data'
                    : `⚠ cost can't compute — ${costResult.reason}`;
                row.appendChild(costFlag);
            }
            if (!isExcluded && result.status === 'ok' && result.brand) {
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
        header.addEventListener('click', (ev) => {
            if (ev.target.closest('.nutrition-serving-controls'))
                return;
            if (ev.target.closest('.nutrition-eaten-btn'))
                return;
            const collapsed = list.classList.toggle('collapsed');
            caret.textContent = collapsed ? '▸' : '▾';
            if (collapsed)
                nutritionExpanded.delete(recipe.id);
            else
                nutritionExpanded.add(recipe.id);
        });
        root.appendChild(section);
    });
    // ── Recipe suggestions ────────────────────────────────────
    const suggestions = buildRecipeSuggestions(grand);
    if (suggestions.length > 0) {
        const suggestPanel = createPanel();
        suggestPanel.className = 'panel nutrition-suggestions';
        const suggestTitle = document.createElement('div');
        suggestTitle.className = 'nutrition-suggestions-title';
        suggestTitle.textContent = 'Suggested to fill your gap';
        suggestPanel.appendChild(suggestTitle);
        suggestions.forEach(({ recipe, score, totals }) => {
            const row = document.createElement('div');
            row.className = 'suggestion-row';
            const info = document.createElement('div');
            info.className = 'suggestion-info';
            const name = document.createElement('span');
            name.className = 'suggestion-name';
            name.textContent = recipe.name;
            info.appendChild(name);
            const stats = document.createElement('span');
            stats.className = 'suggestion-stats';
            stats.textContent = `${Math.round(totals.calories)} cal · ${Math.round(totals.protein)}g protein · ${Math.round(score * 100)}% match`;
            info.appendChild(stats);
            const addBtn = document.createElement('button');
            addBtn.className = 'suggestion-add-btn';
            addBtn.textContent = '+ Add';
            addBtn.addEventListener('click', () => {
                state.selectedRecipeIds.push(recipe.id);
                renderNutritionScreen();
            });
            row.appendChild(info);
            row.appendChild(addBtn);
            suggestPanel.appendChild(row);
        });
        root.appendChild(suggestPanel);
    }
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
                header.appendChild(createSoundTestPanel());
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
    if (step.type === 'timer' && step.durationSeconds) {
        const secs = step.durationSeconds;
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        const parts = [];
        if (h)
            parts.push(`${h}h`);
        if (m)
            parts.push(`${m}m`);
        if (s || parts.length === 0)
            parts.push(`${s}s`);
        const badge = document.createElement('span');
        badge.className = 'timer-duration-badge';
        badge.textContent = parts.join(' ');
        panel.appendChild(badge);
    }
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
    if (step.type === 'info') {
        panel.textContent = '';
        panel.className = 'panel info-step info-step-collapsed';
        const header = document.createElement('div');
        header.className = 'info-step-header';
        const caret = document.createElement('span');
        caret.className = 'info-step-caret';
        caret.textContent = '▸';
        const label = document.createElement('span');
        label.className = 'info-step-label';
        label.textContent = 'Notes';
        header.appendChild(caret);
        header.appendChild(label);
        const body = document.createElement('div');
        body.className = 'info-step-body';
        body.textContent = step.text;
        panel.appendChild(header);
        panel.appendChild(body);
        header.addEventListener('click', () => {
            const collapsed = panel.classList.toggle('info-step-collapsed');
            caret.textContent = collapsed ? '▸' : '▾';
        });
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
        nutritionExclusions.clear();
        eatenRecipeIds.clear();
        nutritionExpanded.clear();
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
function createSoundTestPanel() {
    const step = timerStep('🔔 Sound Test', 1);
    const panel = renderStep(step, () => panel.replaceWith(createSoundTestPanel()));
    panel.classList.add('sound-check-btn');
    return panel;
}
// ============================================================
// URL ROUTING
// ============================================================
function getRecipeIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('recipe');
}
// ============================================================
// SCREEN: PREP
// ============================================================
function renderPrepScreen() {
    const root = getElement('app');
    clear(root);
    const heading = document.createElement('h2');
    heading.textContent = 'Prep';
    root.appendChild(heading);
    function collectPrepSteps(steps) {
        const out = [];
        for (const s of steps) {
            if (s.prep)
                out.push(s);
            if (s.children)
                out.push(...collectPrepSteps(s.children));
        }
        return out;
    }
    function collectInfoSteps(steps) {
        const out = [];
        for (const s of steps) {
            if (s.type === 'info')
                out.push(s);
            if (s.children)
                out.push(...collectInfoSteps(s.children));
        }
        return out;
    }
    let anyFound = false;
    getSelectedRecipes().filter(r => !r.adhoc).forEach(recipe => {
        const count = state.selectedRecipeIds.filter(id => id === recipe.id).length;
        const prepSteps = collectPrepSteps(recipe.steps);
        if (prepSteps.length === 0)
            return;
        anyFound = true;
        const title = document.createElement('div');
        title.className = 'prep-recipe-title';
        title.textContent = recipe.name + (count > 1 ? ` ×${count}` : '');
        root.appendChild(title);
        const infoSteps = collectInfoSteps(recipe.steps);
        infoSteps.forEach(step => {
            const note = document.createElement('div');
            note.className = 'prep-info-note prep-info-collapsed';
            const noteHeader = document.createElement('div');
            noteHeader.className = 'prep-info-header';
            const noteCaret = document.createElement('span');
            noteCaret.textContent = '▸';
            noteHeader.appendChild(noteCaret);
            noteHeader.appendChild(document.createTextNode(' Notes'));
            noteHeader.addEventListener('click', () => {
                const collapsed = note.classList.toggle('prep-info-collapsed');
                noteCaret.textContent = collapsed ? '▸' : '▾';
            });
            const noteBody = document.createElement('div');
            noteBody.className = 'prep-info-body';
            noteBody.textContent = step.text;
            note.appendChild(noteHeader);
            note.appendChild(noteBody);
            root.appendChild(note);
        });
        prepSteps.forEach(step => {
            const card = createPanel();
            card.className += ' prep-step';
            const text = document.createElement('span');
            text.textContent = step.text;
            card.appendChild(text);
            if (step.ingredients && step.ingredients.length > 0) {
                const ingList = document.createElement('div');
                ingList.className = 'prep-step-ingredients';
                ingList.textContent = step.ingredients.map(i => formatIngredient(i)).join(', ');
                card.appendChild(ingList);
            }
            card.addEventListener('click', () => {
                card.classList.toggle('prep-done');
            });
            root.appendChild(card);
        });
    });
    if (!anyFound) {
        const empty = document.createElement('p');
        empty.textContent = 'No prep steps in the selected recipes.';
        empty.style.color = '#888';
        root.appendChild(empty);
    }
    const backBtn = createButton('← Back', () => navigateTo('select'));
    backBtn.className = 'start-over-btn';
    root.appendChild(backBtn);
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
        case 'prep': return renderPrepScreen();
        case 'plan': return renderPlanScreen();
    }
}
// ============================================================
// SCREEN: PLAN
// ============================================================
function toMinutes(hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
}
function fromMinutes(mins) {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    const ampm = h < 12 ? 'AM' : 'PM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}
function schedulePlan(cfg, recipes) {
    const cutoffMin = toMinutes(cfg.caloriesCutoff);
    const blocks = [...cfg.blocks]
        .filter(b => b.type !== 'away')
        .sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
    const cursors = new Map();
    blocks.forEach(b => cursors.set(b.id, toMinutes(b.start)));
    const scheduled = [];
    const unscheduled = [];
    for (const { recipe, count } of recipes) {
        const dur = recipe.planMinutes ?? 0;
        const needsHome = !recipe.portable;
        const compatible = blocks.filter(b => needsHome ? b.type === 'home' : true);
        let placed = false;
        for (const block of compatible) {
            const cursor = cursors.get(block.id);
            const blockEnd = toMinutes(block.end);
            const startMin = cursor;
            if (startMin + dur <= blockEnd) {
                const afterCutoff = startMin >= cutoffMin;
                scheduled.push({ recipe, count, startMin, blockType: block.type === 'home' ? 'home' : 'portable', afterCutoff });
                cursors.set(block.id, startMin + Math.max(dur, 1));
                placed = true;
                break;
            }
        }
        if (!placed)
            unscheduled.push({ recipe, count });
    }
    scheduled.sort((a, b) => a.startMin - b.startMin);
    return { scheduled, unscheduled };
}
function renderPlanScreen() {
    const root = getElement('app');
    clear(root);
    let cfg = loadPlanConfig();
    const heading = document.createElement('h2');
    heading.textContent = 'Day Planner';
    root.appendChild(heading);
    // ── Config panel ──────────────────────────────────────────
    const configPanel = document.createElement('div');
    configPanel.className = 'plan-config-panel';
    const configTitle = document.createElement('div');
    configTitle.className = 'plan-section-title';
    configTitle.textContent = 'Time Blocks';
    configPanel.appendChild(configTitle);
    const blockList = document.createElement('div');
    blockList.className = 'plan-block-list';
    configPanel.appendChild(blockList);
    function renderBlocks() {
        clear(blockList);
        cfg.blocks.forEach((block, idx) => {
            const row = document.createElement('div');
            row.className = 'plan-block-row';
            const startIn = document.createElement('input');
            startIn.type = 'time';
            startIn.value = block.start;
            startIn.className = 'plan-time-input';
            startIn.addEventListener('change', () => { cfg.blocks[idx].start = startIn.value; savePlanConfig(cfg); scheduleAndRender(); });
            const sep = document.createElement('span');
            sep.textContent = '→';
            sep.className = 'plan-block-sep';
            const endIn = document.createElement('input');
            endIn.type = 'time';
            endIn.value = block.end;
            endIn.className = 'plan-time-input';
            endIn.addEventListener('change', () => { cfg.blocks[idx].end = endIn.value; savePlanConfig(cfg); scheduleAndRender(); });
            const typeSelect = document.createElement('select');
            typeSelect.className = 'plan-type-select';
            [['home', '🏠 Home'], ['portable', '🎒 Portable'], ['away', '🏢 Away']].forEach(([val, label]) => {
                const opt = document.createElement('option');
                opt.value = val;
                opt.textContent = label;
                if (val === block.type)
                    opt.selected = true;
                typeSelect.appendChild(opt);
            });
            typeSelect.addEventListener('change', () => { cfg.blocks[idx].type = typeSelect.value; savePlanConfig(cfg); scheduleAndRender(); });
            const delBtn = document.createElement('button');
            delBtn.textContent = '×';
            delBtn.className = 'plan-block-del';
            delBtn.addEventListener('click', () => { cfg.blocks.splice(idx, 1); savePlanConfig(cfg); renderBlocks(); scheduleAndRender(); });
            row.appendChild(startIn);
            row.appendChild(sep);
            row.appendChild(endIn);
            row.appendChild(typeSelect);
            row.appendChild(delBtn);
            blockList.appendChild(row);
        });
        const addBtn = document.createElement('button');
        addBtn.textContent = '+ Add Block';
        addBtn.className = 'plan-add-block-btn';
        addBtn.addEventListener('click', () => {
            const last = cfg.blocks[cfg.blocks.length - 1];
            const newStart = last ? last.end : '07:00';
            const [h, m] = newStart.split(':').map(Number);
            const newEnd = `${String(Math.min(h + 1, 23)).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
            cfg.blocks.push({ id: String(Date.now()), start: newStart, end: newEnd, type: 'home' });
            savePlanConfig(cfg);
            renderBlocks();
            scheduleAndRender();
        });
        blockList.appendChild(addBtn);
    }
    const cutoffRow = document.createElement('div');
    cutoffRow.className = 'plan-cutoff-row';
    const cutoffLabel = document.createElement('span');
    cutoffLabel.textContent = '🎯 Calorie cutoff (eat before):';
    cutoffLabel.className = 'plan-cutoff-label';
    const cutoffIn = document.createElement('input');
    cutoffIn.type = 'time';
    cutoffIn.value = cfg.caloriesCutoff;
    cutoffIn.className = 'plan-time-input';
    cutoffIn.addEventListener('change', () => { cfg.caloriesCutoff = cutoffIn.value; savePlanConfig(cfg); scheduleAndRender(); });
    cutoffRow.appendChild(cutoffLabel);
    cutoffRow.appendChild(cutoffIn);
    configPanel.appendChild(cutoffRow);
    root.appendChild(configPanel);
    // ── Schedule output ───────────────────────────────────────
    const scheduleTitle = document.createElement('div');
    scheduleTitle.className = 'plan-section-title';
    scheduleTitle.style.marginTop = '24px';
    root.appendChild(scheduleTitle);
    const scheduleOut = document.createElement('div');
    root.appendChild(scheduleOut);
    function scheduleAndRender() {
        clear(scheduleOut);
        const selectedRecipes = getSelectedRecipes().filter(r => !r.adhoc);
        const deduped = [];
        const seen = new Set();
        for (const id of state.selectedRecipeIds) {
            const r = state.recipes.get(id);
            if (!r || r.adhoc)
                continue;
            if (seen.has(id)) {
                const e = deduped.find(x => x.recipe.id === id);
                if (e)
                    e.count++;
            }
            else {
                seen.add(id);
                deduped.push({ recipe: r, count: 1 });
            }
        }
        if (deduped.length === 0) {
            const empty = document.createElement('p');
            empty.textContent = 'No recipes selected.';
            empty.style.color = '#888';
            scheduleOut.appendChild(empty);
            return;
        }
        scheduleTitle.textContent = `📋 Suggested Schedule`;
        const { scheduled, unscheduled } = schedulePlan(cfg, deduped);
        scheduled.forEach(({ recipe, count, startMin, blockType, afterCutoff }) => {
            const card = document.createElement('div');
            card.className = 'plan-slot' + (afterCutoff ? ' plan-slot-late' : '');
            const timeEl = document.createElement('span');
            timeEl.className = 'plan-slot-time';
            timeEl.textContent = fromMinutes(startMin);
            const nameEl = document.createElement('span');
            nameEl.className = 'plan-slot-name';
            nameEl.textContent = recipe.name + (count > 1 ? ` ×${count}` : '');
            const meta = [];
            if (recipe.planMinutes)
                meta.push(`${recipe.planMinutes} min`);
            if (recipe.portable)
                meta.push('portable');
            if (afterCutoff)
                meta.push('⚠ after cutoff');
            const metaEl = document.createElement('span');
            metaEl.className = 'plan-slot-meta';
            metaEl.textContent = meta.join(' · ');
            card.appendChild(timeEl);
            card.appendChild(nameEl);
            card.appendChild(metaEl);
            scheduleOut.appendChild(card);
        });
        if (unscheduled.length > 0) {
            const warn = document.createElement('div');
            warn.className = 'plan-unscheduled';
            warn.textContent = '⚠ No available slot: ' + unscheduled.map(x => x.recipe.name).join(', ');
            scheduleOut.appendChild(warn);
        }
        const noPlan = deduped.filter(x => !x.recipe.planMinutes);
        if (noPlan.length > 0) {
            const note = document.createElement('div');
            note.className = 'plan-no-duration';
            note.textContent = 'No duration set (won\'t block time): ' + noPlan.map(x => x.recipe.name).join(', ');
            scheduleOut.appendChild(note);
        }
        const batchPrep = deduped.filter(x => x.recipe.prepMinutes);
        if (batchPrep.length > 0) {
            const batchTitle = document.createElement('div');
            batchTitle.className = 'plan-section-title';
            batchTitle.style.marginTop = '24px';
            batchTitle.textContent = '🥘 Batch Prep (cook ahead)';
            scheduleOut.appendChild(batchTitle);
            batchPrep.forEach(({ recipe }) => {
                const row = document.createElement('div');
                row.className = 'plan-batch-row';
                const mins = recipe.prepMinutes;
                const days = recipe.perishableDays;
                row.textContent = `${recipe.name} — ${mins} min cook time` + (days ? ` · keeps ${days} day${days > 1 ? 's' : ''} in fridge` : '');
                scheduleOut.appendChild(row);
            });
        }
    }
    renderBlocks();
    scheduleAndRender();
    const backBtn = createButton('← Back', () => navigateTo('select'));
    backBtn.className = 'start-over-btn';
    root.appendChild(backBtn);
}
// ============================================================
// STYLES
// ============================================================
const styles = `
* { box-sizing: border-box; }

/* Prevent double-tap zoom on interactive elements without breaking scroll */
button, a, input, select { touch-action: manipulation; }

body {
    background: #111;
    color: #f0f0f0;
    font-family: sans-serif;
    padding: 24px;
    padding-bottom: max(24px, env(safe-area-inset-bottom));
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

.panel.sound-check-btn {
    padding: 4px 8px;
    font-size: 16px;
    background: transparent;
    color: #666;
    border: 1px solid #444;
    border-radius: 8px;
    margin: 0;
}
.panel.sound-check-btn:hover { color: #aaa; border-color: #666; }
.panel.sound-check-btn .timer-duration-badge { display: none; }
.panel.sound-check-btn.timer { font-size: 14px; padding: 4px 8px; margin: 0; }

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
    padding: 16px 24px; padding-bottom: max(16px, env(safe-area-inset-bottom));
    display: flex; gap: 16px; flex-wrap: wrap;
}

.action-btn { flex: 1; font-size: 24px; padding: 20px; border-radius: 12px; border: none; cursor: pointer; font-weight: bold; }
.action-btn:first-child { background: #2563eb; color: white; }
.action-btn:last-child  { background: #16a34a; color: white; }
.actions .action-btn-nutrition { background: #7c3aed; color: white; }
.actions .action-btn-prep { background: #b45309; color: white; }
.actions .action-btn-plan { background: #0e7490; color: white; }
/* ── Plan screen ── */
.plan-config-panel { background: #1a1a1a; border-radius: 12px; padding: 16px; margin-bottom: 8px; }
.plan-section-title { font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 12px; }
.plan-block-list { display: flex; flex-direction: column; gap: 8px; }
.plan-block-row { display: flex; align-items: center; gap: 8px; }
.plan-time-input { background: #222; color: #f0f0f0; border: 1px solid #333; border-radius: 8px; padding: 6px 10px; font-size: 16px; width: 110px; }
.plan-block-sep { color: #666; font-size: 18px; }
.plan-type-select { background: #222; color: #f0f0f0; border: 1px solid #333; border-radius: 8px; padding: 6px 10px; font-size: 15px; flex: 1; }
.plan-block-del { background: none; border: 1px solid #444; color: #888; border-radius: 8px; padding: 6px 12px; font-size: 18px; cursor: pointer; }
.plan-add-block-btn { background: none; border: 1px dashed #444; color: #888; border-radius: 8px; padding: 8px 14px; font-size: 15px; cursor: pointer; margin-top: 4px; width: 100%; }
.plan-cutoff-row { display: flex; align-items: center; gap: 12px; margin-top: 14px; padding-top: 14px; border-top: 1px solid #222; }
.plan-cutoff-label { font-size: 15px; color: #aaa; flex: 1; }
.plan-slot { display: flex; align-items: baseline; gap: 12px; padding: 12px 0; border-bottom: 1px solid #1a1a1a; }
.plan-slot:last-of-type { border-bottom: none; }
.plan-slot-late { opacity: 0.55; }
.plan-slot-time { font-size: 15px; color: #6b9c6b; min-width: 80px; font-variant-numeric: tabular-nums; }
.plan-slot-name { font-size: 19px; flex: 1; }
.plan-slot-meta { font-size: 13px; color: #666; white-space: nowrap; }
.plan-unscheduled { margin-top: 16px; color: #f87171; font-size: 14px; }
.plan-no-duration { margin-top: 8px; color: #888; font-size: 13px; font-style: italic; }
.plan-batch-row { padding: 10px 0; border-bottom: 1px solid #1a1a1a; font-size: 16px; color: #c4a35a; }
/* ── Prep screen ── */
.prep-recipe-title { font-size: 16px; color: #888; text-transform: uppercase; letter-spacing: 0.07em; margin: 20px 0 8px; }
.prep-step { cursor: pointer; user-select: none; }
.prep-step.prep-done { opacity: 0.4; text-decoration: line-through; }
.prep-step-ingredients { font-size: 14px; color: #888; margin-top: 6px; }
.prep-info-note { border: 1px dashed #374151; border-radius: 10px; padding: 10px 14px; margin: 0 0 8px; }
.prep-info-header { display: flex; align-items: center; gap: 6px; cursor: pointer; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; user-select: none; }
.prep-info-body { margin-top: 8px; font-size: 16px; color: #d1d5db; }
.prep-info-collapsed .prep-info-body { display: none; }
/* ── Info step (cooking screen) ── */
.info-step { cursor: default !important; border-color: #2a2a2a; background: #111827; }
.info-step-header { display: flex; align-items: center; gap: 8px; cursor: pointer; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; user-select: none; }
.info-step-caret { font-size: 11px; }
.info-step-body { margin-top: 12px; font-size: 18px; color: #d1d5db; }
.info-step-collapsed .info-step-body { display: none; }

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
.timer-duration-badge { margin-left: 10px; font-size: 13px; font-weight: 600; color: #ca8a04; background: #1a1a0a; border: 1px solid #ca8a04; border-radius: 6px; padding: 1px 7px; vertical-align: middle; white-space: nowrap; }
.panel.timer .timer-duration-badge { display: none; }
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

/* 30-day cost projection */
.nutrition-monthly-cost { font-size: 15px; color: #6b9fcf; margin-top: 6px; }

/* Partial-cost note — shown when some but not all ingredients have price data */
.nutrition-cost-note { font-size: 13px; color: #f59e0b; margin-top: 4px; font-style: italic; }

.panel.nutrition-recipe { cursor: default; padding: 0; }
.nutrition-recipe-header { display: flex; align-items: center; gap: 10px; padding: 16px 20px 6px; cursor: pointer; }
.nutrition-caret { color: #888; font-size: 16px; }
.nutrition-recipe-name { font-size: 22px; flex: 1; }
.nutrition-recipe-sub { font-size: 14px; color: #888; text-align: right; white-space: nowrap; }
.panel.nutrition-recipe .nutrition-coverage { padding: 0 20px 14px; margin-top: 0; }

.nutrition-serving-controls { display: flex; align-items: center; gap: 4px; }
.nutrition-serving-btn { font-size: 18px; width: 32px; height: 32px; border-radius: 8px; border: 1px solid #555; background: #2a2a2a; color: #f0f0f0; cursor: pointer; line-height: 1; padding: 0; }
.nutrition-serving-btn:hover { background: #3a3a3a; border-color: #888; }
.nutrition-serving-count { font-size: 14px; color: #aaa; min-width: 28px; text-align: center; }

/* ── Bundles ── */
.bundle-row { margin: 6px 0; }
.bundle-btn { width: 100%; text-align: left; font-size: 20px; padding: 16px 20px; border-radius: 12px; border: 2px solid #2d5a8a; background: #0f2a45; color: #f0f0f0; cursor: pointer; display: flex; flex-direction: column; gap: 4px; }
.bundle-btn:hover { background: #163556; border-color: #4a8ac4; }
.bundle-sub { font-size: 13px; color: #6b9fcf; font-weight: normal; }

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
.nutrition-recipe-eaten { border-color: #2d9e4a; }
.nutrition-recipe-eaten .nutrition-recipe-name { color: #2d9e4a; }
.nutrition-eaten-btn { background: none; border: 1px solid #555; color: #888; border-radius: 50%; width: 26px; height: 26px; font-size: 13px; cursor: pointer; flex-shrink: 0; padding: 0; line-height: 1; }
.nutrition-eaten-btn:hover { border-color: #2d9e4a; color: #2d9e4a; }
.nutrition-recipe-eaten .nutrition-eaten-btn { background: #2d9e4a; border-color: #2d9e4a; color: white; }
.nutrition-ingredient-toggle { background: none; border: 1px solid #444; color: #666; border-radius: 4px; width: 20px; height: 20px; font-size: 13px; cursor: pointer; flex-shrink: 0; padding: 0; line-height: 1; margin-right: 6px; }
.nutrition-ingredient-toggle:hover { border-color: #aaa; color: #f0f0f0; }
.nutrition-ingredient-excluded { opacity: 0.4; }

/* ── Macro targets panel ── */

.panel.macro-targets { cursor: default; border-color: #3b3b3b; background: #161616; }

.macro-targets-title { font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 10px; }

.macro-row {
    display: grid;
    grid-template-columns: 80px 1fr 1fr 1fr;
    gap: 8px;
    align-items: center;
    padding: 7px 0;
    border-bottom: 1px solid #222;
}
.macro-row:last-child { border-bottom: none; }

.macro-header span { font-size: 12px; color: #555; text-transform: uppercase; letter-spacing: 0.06em; }

.macro-label { font-size: 17px; color: #f0f0f0; }

.macro-target-wrap { display: flex; align-items: center; gap: 5px; }

.macro-target-input {
    width: 72px;
    background: #252525;
    border: 1px solid #555;
    border-radius: 8px;
    color: #f0f0f0;
    font-size: 15px;
    padding: 4px 8px;
}
.macro-target-input:focus { outline: none; border-color: #60a5fa; background: #1e2a3a; }

.macro-unit-label { font-size: 13px; color: #666; }

.macro-actual { font-size: 16px; color: #aaa; }

.macro-remaining { font-size: 16px; color: #aaa; }
.macro-remaining.met  { color: #2d9e4a; font-weight: bold; }
.macro-remaining.over { color: #ef4444; font-weight: bold; }

.macro-row-indent { border-bottom: none; padding: 3px 0; }
.macro-label-sub  { font-size: 14px; color: #888; padding-left: 12px; }

/* ── Recipe suggestions ── */
.panel.nutrition-suggestions { cursor: default; border-color: #2d4a2d; background: #0f1f0f; }
.nutrition-suggestions-title { font-size: 14px; color: #4a8c4a; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 12px; }
.suggestion-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #1a2a1a; }
.suggestion-row:last-child { border-bottom: none; }
.suggestion-info { flex: 1; display: flex; flex-direction: column; gap: 3px; }
.suggestion-name { font-size: 18px; color: #f0f0f0; }
.suggestion-stats { font-size: 13px; color: #6b9c6b; }
.suggestion-add-btn { font-size: 16px; padding: 8px 18px; border-radius: 10px; border: 1px solid #2d9e4a; background: transparent; color: #2d9e4a; cursor: pointer; white-space: nowrap; }
.suggestion-add-btn:hover { background: #1a5c2a; color: #f0f0f0; }

@media (max-width: 500px) {
    body { padding: 14px; padding-bottom: max(14px, env(safe-area-inset-bottom)); font-size: 18px; }
    h2 { font-size: 22px; }

    .search-input { font-size: 20px; padding: 12px; }
    .recipe-btn { font-size: 18px; padding: 14px 16px; }

    /* Actions bar: 2-per-row wrap on narrow screens */
    .actions { gap: 8px; padding: 10px 12px; padding-bottom: max(10px, env(safe-area-inset-bottom)); }
    .action-btn { font-size: 17px; padding: 14px 8px; flex: 1 1 calc(50% - 4px); }
    #recipe-list { padding-bottom: 180px; }

    /* Macro targets: tighter grid */
    .macro-row { grid-template-columns: 65px 70px 1fr 1fr; gap: 4px; }
    .macro-label { font-size: 14px; }
    .macro-target-input { width: 58px; font-size: 13px; }
    .macro-actual, .macro-remaining { font-size: 13px; }

    /* Nutrition header: allow sub to wrap below the name row */
    .nutrition-recipe-header { flex-wrap: wrap; }
    .nutrition-recipe-sub { white-space: normal; flex-basis: 100%; text-align: left; padding-left: 26px; }
    .nutrition-recipe-name { font-size: 18px; }

    .panel { font-size: 18px; padding: 14px; }
}
`;
// ============================================================
// BOOTSTRAP
// ============================================================
function bootstrap() {
    document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);
    document.body.innerHTML = `<div id="app"></div>`;
    document.addEventListener('click', () => unlockAudioContext(), { once: true });
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
        pomegranateSeeds: '', avocadoOil: '',
        abbotPeaItalianSausage: '', lentilSpaghetti: '', spaghettiSauce: '',
        pankoBreadCrumbs: '', salt: '', garlicPowder: '', cornstarch: '',
        blackPepper: '', paprika: '',
        cassavaFlour: '', kingOysterMushroom: '',
        whiteVinegar: '', bakingSoda: '',
        babyBellaMushroom: '', yellowOnion: '', oliveOil: '',
        rosemary: '', thyme: '',
    }),
    asianSaladKit: ingredientFactory('Asian Inspired Salad Kit', {
        defaultBrand: '365',
        products: [{
                brand: '365', variant: 'Organic Asian Inspired (12 oz)', store: stores.wholeFoods,
                price: 5.99, size: 1, sizeUnit: u.unit,
                link: 'https://www.amazon.com/dp/B07B67Y9MH',
            }],
        nutrition: {
            // per whole bag (2 × 1-cup servings): 170 cal × 2, estimated fat/carbs from ingredients
            [u.unit.name]: { servings: 1, servingSize: 1, calories: 340, fat: 18, saturatedFat: 2, transFat: 0, cholesterol: 0, carbs: 28, sodium: 780, sugar: 12, protein: 6, fiber: 6 },
        },
    }),
    carrot: ingredientFactory('Carrots', {
        nutrition: {
            [u.cup.name]: { servings: 1, servingSize: 1, calories: 52, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 12, sodium: 88, sugar: 6, protein: 1, fiber: 3 },
        },
        conversions: {
            [u.cup.name]: { to: u.pound, factor: 0.24 },
        },
    }),
    edamame: ingredientFactory('Shelled Edamame', {
        defaultBrand: '365',
        products: [{
                brand: '365', variant: 'Organic Frozen Shelled', store: stores.wholeFoods,
                price: 3.49, size: 10, sizeUnit: u.ounce,
                link: 'https://www.amazon.com/dp/B074H6S8D8',
            }],
        nutrition: {
            [u.cup.name]: { servings: 1, servingSize: 1, calories: 190, fat: 8, saturatedFat: 1, transFat: 0, cholesterol: 0, carbs: 14, sodium: 9, sugar: 3, protein: 17, fiber: 8 },
        },
        conversions: {
            [u.cup.name]: { to: u.ounce, factor: 5.3 }, // 1 cup shelled ≈ 5.3 oz
        },
    }),
    cabbage: ingredientFactory('Green Cabbage', {
        nutrition: {
            [u.cup.name]: { servings: 1, servingSize: 1, calories: 22, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 5, sodium: 16, sugar: 3, protein: 1, fiber: 2 },
        },
    }),
    greenOnion: ingredientFactory('Green Onion', {
        nutrition: {
            [u.unit.name]: { servings: 1, servingSize: 1, calories: 5, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 1, sodium: 5, sugar: 0, protein: 0, fiber: 0 },
        },
    }),
    almond: ingredientFactory('Almonds', {
        nutrition: {
            [u.handful.name]: { servings: 1, servingSize: 1, calories: 164, fat: 14, saturatedFat: 1, transFat: 0, cholesterol: 0, carbs: 6, sodium: 0, sugar: 1, protein: 6, fiber: 3 },
        },
        conversions: {
            [u.handful.name]: { to: u.ounce, factor: 1 },
        },
    }),
    whiteMiso: ingredientFactory('White Miso', {
        nutrition: {
            [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 35, fat: 1, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 5, sodium: 600, sugar: 1, protein: 2, fiber: 0 },
        },
    }),
    tamari: ingredientFactory('Tamari (Low-Sodium)', {
        nutrition: {
            [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 11, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 1, sodium: 700, sugar: 0, protein: 2, fiber: 0 },
        },
    }),
    riceVinegar: ingredientFactory('Rice Vinegar', {
        nutrition: {
            [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 3, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 1, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
        },
    }),
    sesameSeed: ingredientFactory('Sesame Seeds', {
        nutrition: {
            [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 52, fat: 4, saturatedFat: 1, transFat: 0, cholesterol: 0, carbs: 2, sodium: 1, sugar: 0, protein: 2, fiber: 1 },
        },
    }),
    limeJuice: ingredientFactory('Lime Juice', {
        nutrition: {
            [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 4, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 1, sodium: 1, sugar: 0, protein: 0, fiber: 0 },
        },
    }),
    chickpeas: ingredientFactory('Chickpeas (Garbanzo Beans)', {
        defaultBrand: '365',
        conversions: {
            [u.cup.name]: { to: u.ounce, factor: 13.4 / 1.5 }, // 13.4 oz per ~1.5 cups (3 × ½ cup servings)
        },
        products: [{
                brand: '365', variant: 'Organic Unsalted (13.4 oz)', store: stores.wholeFoods,
                price: 1.59, size: 13.4, sizeUnit: u.ounce,
                link: 'https://www.amazon.com/dp/B074H5SRPW',
            }],
        nutrition: {
            [u.cup.name]: { servings: 1, servingSize: 1, calories: 220, fat: 4, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 36, sodium: 20, sugar: 2, protein: 12, fiber: 10 },
        },
    }),
    cannelliniBean: ingredientFactory('Cannellini Beans', {
        defaultBrand: '365',
        conversions: {
            [u.cup.name]: { to: u.ounce, factor: 13.4 / 1.5 }, // 13.4 oz per 1.5 cups (3 × ½ cup servings)
        },
        products: [{
                brand: '365', variant: 'Organic Unsalted (13.4 oz)', store: stores.wholeFoods,
                price: 1.59, size: 13.4, sizeUnit: u.ounce,
                link: 'https://www.amazon.com/dp/B074H5J2V7',
            }],
        nutrition: {
            [u.cup.name]: { servings: 1, servingSize: 1, calories: 180, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 32, sodium: 10, sugar: 2, protein: 12, fiber: 12 },
        },
    }),
    macadamiaNutMilk: ingredientFactory('Macadamia Nut Milk', {
        requiresDateLabel: true,
        defaultBrand: 'Milkadamia',
        products: [{
                brand: 'Milkadamia', variant: 'Unsweetened', store: stores.wholeFoods,
                link: 'https://www.amazon.com/dp/B01JH2O854',
                price: 6.19, size: 32, sizeUnit: u.fluidOunce,
                nutrition: {
                    [u.cup.name]: { servings: 4, servingSize: 1, calories: 50, fat: 5, saturatedFat: 0.5, transFat: 0, cholesterol: 0, carbs: 1, sodium: 75, sugar: 0, protein: 1, fiber: 0 },
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
                    [u.cup.name]: { servings: 1, servingSize: 1, calories: 960, fat: 95, saturatedFat: 15, transFat: 0, cholesterol: 0, carbs: 18, sodium: 7, sugar: 6, protein: 11, fiber: 9 },
                },
            },
            {
                brand: 'Blueprint', variant: 'Raw', store: stores.amazon,
                link: 'https://www.amazon.com/Blueprint-Bryan-Johnson-Macadamia-Nuts/dp/B0DNGJFBS1',
                price: 12, size: 4, sizeUnit: u.ounce, organic: false,
            },
        ],
    }),
    cocoaNibs: ingredientFactory('Cocoa Nibs', {
        defaultBrand: 'Navitas',
        products: [{
                brand: 'Navitas', variant: 'Organic Raw',
                nutrition: {
                    [u.tsp.name]: { servings: 1, servingSize: 1, calories: 20, fat: 1.5, saturatedFat: 0.5, transFat: 0, cholesterol: 0, carbs: 1.5, sodium: 0, sugar: 0, protein: 0.3, fiber: 1 },
                },
            }],
    }),
    chiaSeed: ingredientFactory('Chia Seed', {
        defaultBrand: '365',
        products: [{
                brand: '365', variant: 'Organic Black', store: stores.wholeFoods,
                nutrition: {
                    [u.tsp.name]: { servings: 1, servingSize: 1, calories: 19, fat: 1, saturatedFat: 0.1, transFat: 0, cholesterol: 0, carbs: 1.5, sodium: 0, sugar: 0, protein: 1, fiber: 2 },
                },
            }],
    }),
    hempSeed: ingredientFactory('Hemp Seed', {
        defaultBrand: 'Manitoba Harvest',
        products: [{
                brand: 'Manitoba Harvest', variant: 'Hemp Hearts', store: stores.wholeFoods,
                nutrition: {
                    [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 55, fat: 4, saturatedFat: 0.5, transFat: 0, cholesterol: 0, carbs: 1, sodium: 0, sugar: 0.5, protein: 3.3, fiber: 0 },
                },
            }],
    }),
    antiOxidantBerryBlend: ingredientFactory('Antioxidant Berry Blend', {
        defaultBrand: '365',
        products: [{
                brand: '365', variant: 'Organic Antioxidant Fruit Blend (frozen)', store: stores.wholeFoods,
                size: 16, sizeUnit: u.ounce, organic: true,
                nutrition: {
                    [u.cup.name]: { servings: 4, servingSize: 1, calories: 70, fat: 0.5, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 17, sodium: 0, sugar: 13, protein: 1, fiber: 4 },
                },
            }],
    }),
    vanillaExtract: ingredientFactory('Vanilla Extract', {
        defaultBrand: '365',
        products: [{
                brand: '365', variant: 'Organic Vanilla Extract', store: stores.wholeFoods,
                nutrition: { [u.fluidOunce.name]: { servings: 2, servingSize: 2, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 } },
                price: 8.79, size: 2, sizeUnit: u.fluidOunce, organic: true,
                link: 'https://www.amazon.com/365-Everyday-Value-Organic-Vanilla/dp/B074VBL8R9',
            }],
    }),
    lemonJuice: ingredientFactory('Lemon Juice', {
        defaultBrand: '365',
        products: [{
                brand: '365', variant: 'Organic Lemon Juice', store: stores.wholeFoods,
                nutrition: { [u.tsp.name]: { servings: 59, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 } },
                price: 3.49, size: 10, sizeUnit: u.fluidOunce, organic: true,
                link: 'https://www.amazon.com/365-Everyday-Value-Organic-Concentrate/dp/B074J5WZS8?th=1',
            }],
    }),
    cherry: ingredientFactory('Cherry', {
        defaultBrand: '365',
        conversions: {
            [u.unit.name]: { to: u.cup, factor: 1 / 15 }, // ~15 dark cherries per cup
            [u.cup.name]: { to: u.ounce, factor: 5 }, // 1 cup dark cherries ≈ 5 oz
        },
        products: [{
                brand: '365', variant: 'Organic Sweet Dark Cherries (frozen)', store: stores.wholeFoods,
                link: 'https://www.amazon.com/dp/B074H57SNZ',
                price: 4.29, size: 10, sizeUnit: u.ounce,
                organic: true,
                nutrition: {
                    [u.cup.name]: { servings: 2, servingSize: 1, calories: 90, fat: 0.3, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 23, sodium: 0, sugar: 18, protein: 1, fiber: 3 },
                },
            }],
    }),
    celery: ingredientFactory('Celery', {
        nutrition: { [u.unit.name]: { servings: 1, servingSize: 1, calories: 6, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 1.5, sodium: 32, sugar: 1, protein: 0.3, fiber: 1 } },
    }),
    spinach: ingredientFactory('Spinach', {
        nutrition: { [u.handful.name]: { servings: 1, servingSize: 1, calories: 7, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 1, sodium: 24, sugar: 0.1, protein: 0.9, fiber: 1 } },
    }),
    kale: ingredientFactory('Kale', {
        nutrition: { [u.handful.name]: { servings: 1, servingSize: 1, calories: 8, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 1.5, sodium: 11, sugar: 0.2, protein: 0.7, fiber: 1 } },
    }),
    banana: ingredientFactory('Organic Banana', {
        nutrition: { [u.unit.name]: { servings: 1, servingSize: 1, calories: 105, fat: 0.3, saturatedFat: 0.1, transFat: 0, cholesterol: 0, carbs: 27, sodium: 1, sugar: 14, protein: 1.3, fiber: 3 } },
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
            [u.fluidOunce.name]: { servings: 8, servingSize: 7, calories: 110, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 26, sodium: 0, sugar: 22, protein: 2, fiber: 0 },
        },
    }),
    water: ingredientFactory('Water', {
        conversions: {
            [u.ounce.name]: { to: u.fluidOunce, factor: 1 },
        },
        nutrition: {
            [u.fluidOunce.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
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
        conversions: {
            [u.tbsp.name]: { to: u.ounce, factor: 0.214 }, // 12 oz / 56 tbsp servings
        },
        products: [{
                brand: '365', variant: 'Organic Whole Flakes', store: stores.wholeFoods,
                link: 'https://www.amazon.com/dp/B0CDQJRFGX',
                price: 17.49, size: 12, sizeUnit: u.ounce,
                organic: true,
                nutrition: {
                    [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 15, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 5, sodium: 5, sugar: 0, protein: 0, fiber: 5 },
                },
            }, {
                brand: '365', variant: 'Organic Whole Flakes', store: stores.amazon,
                link: 'https://www.amazon.com/dp/B0CDQJJ5TF',
                price: 18.48, size: 12, sizeUnit: u.ounce,
                organic: true,
            }],
    }),
    blueprintMacadamiaBar: ingredientFactory('Blueprint Macadamia Bar', {
        defaultBrand: 'Blueprint',
        products: [
            {
                brand: 'Blueprint', variant: 'Raspberry', store: stores.amazon,
                link: 'https://www.amazon.com/dp/B0DQLSW6FB',
                price: 29.00, size: 12, sizeUnit: u.unit,
                discount: { subscribeAndSave: 26.10 },
                nutrition: {
                    [u.unit.name]: { servings: 12, servingSize: 1, calories: 160, fat: 12, saturatedFat: 2, transFat: 0, cholesterol: 0, carbs: 5, sodium: 80, sugar: 1, protein: 9, fiber: 2 },
                },
            },
        ],
    }),
    blackLentils: ingredientFactory('Black Lentils', {
        defaultBrand: '365',
        conversions: {
            [u.gram.name]: { to: u.cup, factor: 1 / 180 }, // 45g = ¼ cup dry, per nutrition label
        },
        products: [{
                brand: '365', variant: 'Organic, Black, dry', store: stores.wholeFoods,
                price: 3.29, size: 16, sizeUnit: u.ounce, organic: true,
                link: 'https://www.amazon.com/dp/B084NHD2R9',
                nutrition: {
                    [u.cup.name]: { servings: 11, servingSize: 1, calories: 600, fat: 2, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 106, sodium: 0, sugar: 4, protein: 44, fiber: 20 },
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
                    [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 120, fat: 14, saturatedFat: 2, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
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
                    [u.unit.name]: { servings: 1, servingSize: 1, calories: 200, fat: 5, saturatedFat: 0.5, transFat: 0, cholesterol: 0, carbs: 13, sodium: 200, sugar: 0, protein: 26, fiber: 1 },
                },
            }],
    }),
    blueberryNutMix: ingredientFactory('Blueberry Nut Mix', {
        defaultBrand: 'Blueprint',
        products: [{
                brand: 'Blueprint', variant: 'Macadamia + Walnut + Blueberry', store: stores.amazon,
                price: 37, size: 30, sizeUnit: u.unit,
                discount: { subscribeAndSave: 33.30 },
                link: 'https://www.amazon.com/Blueprint-Bryan-Johnson-Blueberry-Nut/dp/B0D3FZ29RJ',
                nutrition: {
                    // Per 1 scoop (15g), 30 servings per container
                    [u.unit.name]: { servings: 30, servingSize: 1, calories: 70, fat: 4.5, saturatedFat: 0.5, transFat: 0, cholesterol: 0, carbs: 8, sodium: 0, sugar: 5, protein: 1, fiber: 2 },
                },
            }],
    }),
    longevityMix: ingredientFactory('Longevity Mix', {
        defaultBrand: 'Blueprint',
        products: [{
                brand: 'Blueprint', variant: 'Blood Orange (30 servings)', store: stores.amazon,
                price: 49, size: 30, sizeUnit: u.unit,
                link: 'https://www.amazon.com/dp/B0D3GBRNSX',
                discount: { subscribeAndSave: 44.10 },
            }],
        nutrition: {
            [u.unit.name]: { servings: 30, servingSize: 1, calories: 10, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 3, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
        },
    }),
    blueprintCollagen: ingredientFactory('Collagen Peptides', {
        defaultBrand: 'Blueprint',
        products: [{
                brand: 'Blueprint', variant: 'Hydrolyzed Type I, II & III (30 servings)', store: stores.amazon,
                price: 45, size: 30, sizeUnit: u.unit,
                link: 'https://www.amazon.com/dp/B0DV1PQDWH',
                discount: { subscribeAndSave: 40.50 },
            }],
        nutrition: {
            [u.unit.name]: { servings: 30, servingSize: 1, calories: 80, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 20, fiber: 0 },
        },
    }),
    blueprintCreatine: ingredientFactory('Creatine Monohydrate', {
        defaultBrand: 'Blueprint',
        products: [{
                brand: 'Blueprint', variant: 'Unflavored (100 servings)', store: stores.amazon,
                price: 40, size: 100, sizeUnit: u.unit,
                link: 'https://www.amazon.com/dp/B0DQLW13S2',
                discount: { subscribeAndSave: 36.00 },
            }],
        nutrition: {
            [u.unit.name]: { servings: 100, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
        },
    }),
    manukaHoney: ingredientFactory('Manuka Honey', {
        defaultBrand: 'Blueprint',
        products: [{
                brand: 'Blueprint', variant: 'Manuka Honey', store: stores.amazon,
                link: 'https://www.amazon.com/dp/B0DQLSXYZ',
            }],
    }),
    nutThins: ingredientFactory('Nut Thins', {
        defaultBrand: 'Blue Diamond',
        products: [
            {
                brand: 'Blue Diamond', variant: 'Hint Of Sea Salt', store: stores.amazon,
                link: 'https://www.amazon.com/dp/B00FBO8FF2',
                price: 3.97, size: 4.25, sizeUnit: u.ounce,
                discount: { subscribeAndSave: 3.37 },
                nutrition: {
                    // 19 crackers per serving, 4 servings per container
                    [u.unit.name]: { servings: 4, servingSize: 19, calories: 130, fat: 4, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 22, sodium: 80, sugar: 0, protein: 3, fiber: 1 },
                },
            },
            {
                brand: 'Blue Diamond', variant: 'Hint Of Sea Salt', store: stores.wholeFoods,
                price: 4.39, size: 4.25, sizeUnit: u.ounce,
            },
            {
                brand: 'Blue Diamond', variant: 'Hint Of Sea Salt (Family Size)', store: stores.amazon,
                link: 'https://www.amazon.com/dp/B07XHRRB1T',
                price: 6.57, size: 7.7, sizeUnit: u.ounce,
                discount: { subscribeAndSave: 5.58 },
                nutrition: {
                    // 19 crackers per serving, 7 servings per container
                    [u.unit.name]: { servings: 7, servingSize: 19, calories: 130, fat: 4, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 22, sodium: 55, sugar: 0, protein: 3, fiber: 1 },
                },
            },
            {
                brand: 'Blue Diamond', variant: 'Hint Of Sea Salt (Family Size)', store: stores.wholeFoods,
                link: 'https://www.amazon.com/dp/B07XHRRB1T',
                price: 7.99, size: 7.7, sizeUnit: u.ounce,
            },
        ],
    }),
    chickenThigh: ingredientFactory('Chicken Thighs (Boneless Skinless)', {
        isMeatProduct: true,
        defaultBrand: '365',
        products: [{
                brand: '365', variant: 'Organic Boneless Skinless (1.5 lb)', store: stores.wholeFoods,
                price: 9.99, size: 1.5, sizeUnit: u.pound,
                link: 'https://www.amazon.com/dp/B07813VZHR',
            }],
    }),
};
// ============================================================
// RECIPES
// ============================================================
registerGroup('Breakfast', [
    withPlan(createRecipe('blueprint-smoothie', 'Blueprint Smoothie', (() => {
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
            i.banana(1, u.unit),
            i.kale(1, u.handful),
            i.spinach(1, u.handful),
        ]));
        s(Timer.set(30, 's', 'Let mixer settle'));
        s(mixer.mix());
        return steps;
    })(), undefined, 8), { planMinutes: 8, portable: false }),
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
    withPlan(createRecipe('asian-dense-bean-salad-kit', 'Asian Dense Bean Salad (Kit Version)', (() => {
        const steps = [];
        const s = (...newSteps) => steps.push(...newSteps);
        const bowl = e.bowl('salad bowl');
        const EDAMAME = i.edamame(1, u.cup);
        s(bowl.add([i.asianSaladKit(1, u.unit)]));
        s(Timer.set(80, 's', 'Microwave edamame until just thawed'));
        s(instruction('Pat edamame dry, then add to bowl', { ingredients: [EDAMAME], equipment: [bowl.name] }));
        s(bowl.add([
            i.chickpeas(1, u.cup),
            i.cannelliniBean(1, u.cup),
        ]));
        s(instruction('Add dressing and toppings from kit, toss to combine', { equipment: [bowl.name] }));
        return steps;
    })()), { planMinutes: 10, portable: false }),
    createRecipe('asian-dense-bean-salad', 'Asian Dense Bean Salad', (() => {
        const saladBowl = e.bowl('salad bowl');
        const dressBowl = e.bowl('dressing bowl');
        const ALMONDS = i.almond(1, u.handful);
        const CARROTS = i.carrot(1, u.cup);
        const CABBAGE = i.cabbage(2, u.cup);
        const CHICKPEAS = i.chickpeas(1, u.cup);
        const CANNELLINI = i.cannelliniBean(1, u.cup);
        const steps = [];
        const s = (...newSteps) => steps.push(...newSteps);
        s(prep('Soak chickpeas and cannellini beans overnight', { ingredients: [CHICKPEAS, CANNELLINI] }));
        s(prep('Peel and shred carrots', { ingredients: [CARROTS] }));
        s(prep('Shred cabbage (can be done the day before)', { ingredients: [CABBAGE] }));
        s(saladBowl.add([
            [CHICKPEAS, 'cooked, soaked overnight'],
            [CANNELLINI, 'cooked, soaked overnight'],
            i.edamame(1, u.cup),
            [CABBAGE, 'shredded'],
            [CARROTS, 'shredded'],
            [i.greenOnion(4, u.unit), 'thinly sliced'],
        ]));
        s(dressBowl.add([
            i.whiteMiso(3, u.tbsp),
            i.tamari(2, u.tbsp),
            i.riceVinegar(2, u.tbsp),
            i.sesameSeed(2, u.tbsp),
            i.limeJuice(1, u.tbsp),
            i.blueprintOliveOil(1, u.tsp),
            i.manukaHoney(1, u.tsp),
        ]));
        const dressingReady = dressBowl.mix('miso sesame dressing');
        s(dressingReady);
        s(saladBowl.combine([dressBowl.result], 'pour dressing over salad, toss gently to coat').waitFor(dressingReady));
        s(instruction('Divide into bowls and top with chopped almonds', { ingredients: [ALMONDS] }));
        s(Timer.set(30, 'm', 'Optional: chill before serving'));
        return steps;
    })()),
    createRecipe('nuwave-chicken-thighs', 'Nuwave Chicken Thighs (350°F)', (() => {
        const pan = e.nuwavePan();
        const seasoningBowl = e.bowl('seasoning bowl');
        const THIGHS = i.chickenThigh();
        const steps = [];
        const s = (...newSteps) => steps.push(...newSteps);
        s(seasoningBowl.add([
            i.salt(0.5, u.tsp),
            i.blackPepper(0.5, u.tsp),
            i.paprika(0.5, u.tsp),
            i.garlicPowder(0.5, u.tsp),
        ]));
        s(seasoningBowl.mix());
        s(instruction(`Season ${THIGHS.name} on both sides with seasoning mixture`, { ingredients: [THIGHS] }));
        s(pan.preheat(350));
        s(pan.add([i.avocadoOil(1, u.spray)]));
        s(pan.add([THIGHS], 'smooth side down'));
        s(pan.cook('Cook first side — do not move', time.minutes(8), 350));
        s(pan.flip());
        s(pan.cook('Cook second side', time.minutes(8), 350));
        s(instruction('Check internal temperature in the thickest thigh — target 175–180°F', { ingredients: [THIGHS], equipment: [pan.name] }));
        s(instruction('If 170–174°F, cook another 1–2 minutes and recheck', { equipment: [pan.name], ingredients: [THIGHS] }));
        s(Timer.set(5, 'm', `Rest ${THIGHS.name} before eating`, { ingredients: [THIGHS], equipment: [pan.name] }));
        return steps;
    })()),
]);
registerGroup('Blueprint', [
    withPlan(createRecipe('protein-nutmix-oliveoil', 'Blueprint (Nutty Pudding) - Protein, Nut Mix & Olive Oil', [
        instruction('Have 1 scoop Blueprint longevity protein on hand', {
            ingredients: [i.longevityProtein(1, u.unit)],
        }),
        instruction('Have 1 scoop Blueprint blueberry nut mix on hand', {
            ingredients: [i.blueberryNutMix(1, u.unit)],
        }),
        instruction('Take 2 shots of Blueprint olive oil', {
            ingredients: [i.blueprintOliveOil(2, u.shot)],
        }),
    ]), { planMinutes: 5, portable: false }),
    withPlan(createRecipe('blueprint-longevity-drink', 'Blueprint Longevity Drink (Longevity Mix, Collagen, Creatine)', [
        instruction('Add 1 scoop Blueprint Longevity Mix (Blood Orange) to a glass of water', {
            ingredients: [i.longevityMix(1, u.unit)],
        }),
        instruction('Add 1 scoop Blueprint Collagen Peptides', {
            ingredients: [i.blueprintCollagen(1, u.unit)],
        }),
        instruction('Add 1 scoop (5g) Blueprint Creatine Monohydrate and stir until dissolved', {
            ingredients: [i.blueprintCreatine(1, u.unit)],
        }),
    ]), { planMinutes: 3, portable: false }),
]);
registerGroup('Lentils', [
    withPlan(createRecipe('ing-black-lentils-induction-195g', 'Black Lentils (195g ×3) (Induction Stovetop)', (() => {
        const steps = [];
        const s = (...newSteps) => steps.push(...newSteps);
        const LENTILS = i.blackLentils(195, u.gram);
        const WATER = i.water(26, u.fluidOunce);
        const pot = e.pot();
        const colander = e.colander();
        s(info('195g dry lentils → ~495g cooked. Keeps in the fridge for 3 days.'));
        s(pot.add([LENTILS, WATER]));
        s(instruction('Place lid fully on pot', { equipment: [pot.name] }));
        s(instruction('Set induction stovetop to 215°', { equipment: [pot.name] }));
        s(Timer.set(24, 'm', 'Cook lentils'));
        s(instruction('Strain lentils through a colander', { equipment: [pot.name, colander.name] }));
        s(Timer.set(10, 'm', 'Let lentils cool'));
        s(instruction('Portion cooked lentils into thirds (~165g each) into three stainless steel containers', { ingredients: [LENTILS] }));
        s(instruction('Rinse pot and wipe dry with a paper towel (Otherwise Pot Stains)', { equipment: [pot.name] }));
        return steps;
    })()), { planMinutes: 3, portable: true, prepMinutes: 24, perishableDays: 3, sortOrder: 0 }),
    withPlan(createRecipe('ing-black-lentils-induction-130g', 'Black Lentils (130g ×2) (Induction Stovetop)', (() => {
        const steps = [];
        const s = (...newSteps) => steps.push(...newSteps);
        const LENTILS = i.blackLentils(130, u.gram);
        const WATER = i.water(26, u.fluidOunce);
        const pot = e.pot();
        const colander = e.colander();
        s(info('130g dry lentils → ~330g cooked. Keeps in the fridge for 3 days.'));
        s(pot.add([LENTILS, WATER]));
        s(instruction('Place lid fully on pot', { equipment: [pot.name] }));
        s(instruction('Set induction stovetop to 215°', { equipment: [pot.name] }));
        s(Timer.set(24, 'm', 'Cook lentils'));
        s(instruction('Strain lentils through a colander', { equipment: [pot.name, colander.name] }));
        s(Timer.set(10, 'm', 'Let lentils cool'));
        s(instruction('Portion cooked lentils in half (~165g each) into two stainless steel containers', { ingredients: [LENTILS] }));
        s(instruction('Rinse pot and wipe dry with a paper towel (Otherwise Pot Stains)', { equipment: [pot.name] }));
        return steps;
    })()), { planMinutes: 3, portable: true, prepMinutes: 24, perishableDays: 3, sortOrder: 1 }),
    withPlan(createRecipe('ing-black-lentils-induction', 'Black Lentils (65g ×1) (Induction Stovetop)', (() => {
        const steps = [];
        const s = (...newSteps) => steps.push(...newSteps);
        const LENTILS = i.blackLentils(65, u.gram);
        const WATER = i.water(15, u.fluidOunce);
        const pot = e.pot();
        const colander = e.colander();
        s(info('65g dry lentils → 165g cooked. Keeps in the fridge for 3 days.'));
        s(pot.add([LENTILS, WATER]));
        s(instruction('Place lid fully on pot', { equipment: [pot.name] }));
        s(instruction('Set induction stovetop to 215°', { equipment: [pot.name] }));
        s(Timer.set(21, 'm', 'Cook lentils'));
        s(instruction('Strain lentils through a colander', { equipment: [pot.name, colander.name] }));
        s(instruction('Portion 65g cooked lentils into stainless steel container', { ingredients: [LENTILS] }));
        s(instruction('Rinse pot and wipe dry with a paper towel (Otherwise Pot Stains)', { equipment: [pot.name] }));
        return steps;
    })()), { planMinutes: 3, portable: true, prepMinutes: 21, perishableDays: 3, sortOrder: 2 }),
    withPlan(createRecipe('ing-black-lentils-gas', 'Black Lentils (65g ×1) (Gas Stovetop)', (() => {
        const steps = [];
        const s = (...newSteps) => steps.push(...newSteps);
        const LENTILS = i.blackLentils(65, u.gram);
        const pot = e.pot();
        const colander = e.colander();
        s(info('65g dry lentils → 165g cooked. Keeps in the fridge for 3 days.'));
        s(pot.add([LENTILS]));
        s(instruction('Add water to pot', { equipment: [pot.name] }));
        s(Timer.set(21, 'm', 'Cook lentils'));
        s(instruction('Strain lentils through a colander', { equipment: [pot.name, colander.name] }));
        s(instruction('Portion 65g cooked lentils into stainless steel container', { ingredients: [LENTILS] }));
        s(instruction('Rinse pot and wipe dry with a paper towel (Otherwise Pot Stains)', { equipment: [pot.name] }));
        return steps;
    })()), { planMinutes: 3, portable: true, prepMinutes: 21, perishableDays: 3, sortOrder: 3 }),
]);
registerGroup('Ingredients', [
    withPlan(createRecipe('ing-macadamia-bar', 'Blueprint Macadamia Bar', [
        instruction('Have 1 Blueprint Macadamia Bar on hand', {
            ingredients: [i.blueprintMacadamiaBar(1, u.unit)],
        }),
    ]), { planMinutes: 2, portable: true }),
    withPlan(createRecipe('ing-psyllium-husk', 'Psyllium Husk (1 tbsp)', [
        instruction('Have 1 tbsp psyllium husk on hand', {
            ingredients: [i.psyllium(1, u.tbsp)],
        }),
    ]), { planMinutes: 3, portable: false }),
]);
// ============================================================
// BUNDLES
// ============================================================
registerBundle({
    id: 'daily-blueprint',
    name: 'Daily Blueprint',
    recipeIds: [
        'blueprint-smoothie',
        'blueprint-longevity-drink',
        'ing-black-lentils-induction',
        'ing-macadamia-bar',
        'ing-macadamia-bar',
        'ing-psyllium-husk',
        'protein-nutmix-oliveoil',
        'asian-dense-bean-salad-kit',
    ],
});
// ============================================================
// START APP
// ============================================================
document.addEventListener('DOMContentLoaded', bootstrap);
