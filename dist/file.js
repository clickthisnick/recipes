// ============================================================
// RECIPE SYSTEM
// Single-file architecture optimized for readability and AI context
// ============================================================
// ============================================================
// GLOBAL STATE
// ============================================================
const state = {
    recipes: new Map(),
    selectedRecipeIds: [],
    favoriteRecipeIds: [],
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
};
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
//
// Each Equipment instance tracks its current contents (ingredients that
// have been .add()ed or .transfer()ed into it). This lets cook() and
// broil() automatically claim the contents of any extraEquipment vessel
// passed to them, so steps that transfer or use those contents are
// correctly locked without the recipe author having to list ingredients
// manually.
//
// transfer() validates at recipe-definition time (startup) that the
// ingredients being moved are actually present in the source vessel,
// giving clear error messages before the app is served.
class Equipment {
    // label is an optional display name to distinguish multiple instances
    // of the same equipment type, e.g. e.pan('panko pan') vs e.pan('sauce pan').
    // It scopes the claim key so the locking system treats them as separate lanes.
    constructor(type, label) {
        this.type = type;
        this.label = label;
        // Tracks ingredients currently inside this vessel.
        // Updated by add(), transfer(), mix(), and combine().
        this.contents = [];
        // Tracks vessels placed inside this one via place().
        // cook() and broil() automatically claim these and their contents.
        this.nestedVessels = [];
        // Holds the ingredient produced by the last mix() or combine() call.
        // Access via vessel.result immediately after the call.
        this._result = null;
    }
    get name() { return this.label ?? this.type; }
    get result() {
        if (!this._result)
            throw new Error(`${this.name}.result accessed before any mix() or combine() call`);
        return this._result;
    }
    // Returns all ingredients currently in this vessel plus any nested vessels.
    getContents() {
        return [
            ...this.contents,
            ...this.nestedVessels.flatMap(v => v.getContents()),
        ];
    }
    // Returns all equipment names claimed by this vessel (itself + nested vessels).
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
    // cook() automatically inherits the contents of any extraEquipment vessels
    // cook() automatically claims this vessel, any vessels placed inside it via place(),
    // and all their contents — no extraEquipment needed once a vessel is placed.
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
        // Track contents
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
    // Moves ingredients from this vessel into target, validating at definition
    // time that the ingredients are actually present in this vessel.
    // Throws a descriptive error immediately if not, catching mistakes before serving.
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
    // place() registers a vessel inside this one. If a label and duration are
    // provided it becomes a timer step (e.g. "Toast panko (450°)"), combining
    // the placement and the cook into a single visual card.
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
    // mix() combines all current contents into a single named ingredient.
    // The vessel's contents are replaced with the new ingredient.
    // Access the produced ingredient via vessel.result immediately after.
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
    // combine() applies this vessel's contents to the given ingredients,
    // producing a new named ingredient that represents the combination.
    // The vessel retains its contents (not emptied until transfer()).
    // Access the produced ingredient via vessel.result immediately after.
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
    const collected = new Map(); // Use object reference as key
    function walkSteps(steps) {
        for (const step of steps) {
            for (const ing of (step.ingredients ?? [])) {
                if (ing.requiresDateLabel && !collected.has(ing)) {
                    collected.set(ing, ing);
                }
            }
            if (step.children) {
                walkSteps(step.children);
            }
        }
    }
    walkSteps(steps);
    return [...collected.values()];
}
function findLastStepIndexForIngredient(steps, targetIng) {
    let lastIndex = -1;
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        // Only consider container steps (add, transfer, combine, etc.) and timer steps
        // Skip simple instruction steps that might have derived ingredient lists from equipment
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
    // Automatically generate cleanup label steps and insert after last usage
    const ingredientsToLabel = collectIngredientsWithLabel(steps);
    const stepsToInsert = [];
    for (const ing of ingredientsToLabel) {
        const lastIndex = findLastStepIndexForIngredient(steps, ing);
        if (lastIndex !== -1) {
            const cleanupStep = generateCleanupLabels([ing])[0];
            stepsToInsert.push({ index: lastIndex, step: cleanupStep });
        }
    }
    // Sort by index in descending order so we insert from the end backwards
    // (prevents earlier insertions from shifting later indices)
    stepsToInsert.sort((a, b) => b.index - a.index);
    // Insert cleanup steps after their last usage
    for (const { index, step } of stepsToInsert) {
        steps.splice(index + 1, 0, step);
    }
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
//
// Wraps a single ingredient into a one-step synthetic recipe so it flows
// through the shopping list and nutrition rollup using the same codepaths as
// hand-authored recipes — no parallel "loose ingredients" pipeline.
//
// The fiction is intentional: the single step exists only so the existing
// step-walking logic in buildShoppingList and recipeNutrition finds the
// ingredient. The cooking screen filters adhoc recipes out (see
// getCookableRecipes) so the synthetic step never reaches the cook flow.
const ADHOC_GROUP = 'Custom additions';
function createAdhocRecipe(ingredient) {
    // Unique id per call — same ingredient added twice produces two recipes,
    // so the user can adjust them independently and they each get a "×N"
    // counter like any other recipe.
    const id = `adhoc:${ingredient.name.toLowerCase().replace(/\s+/g, '-')}:${Date.now()}-${Math.floor(Math.random() * 1e4)}`;
    const step = instruction(`Have ${formatIngredient(ingredient)} on hand`, {
        ingredients: [ingredient],
    });
    step.recipeId = id;
    return {
        id,
        name: formatIngredient(ingredient),
        group: ADHOC_GROUP,
        steps: [step],
        adhoc: true,
    };
}
export function getSelectedRecipes() {
    // Returns each selected recipe ONCE, in the order it first appeared in the
    // selection list. Servings-per-recipe is tracked separately via getServings()
    // — cooking treats each recipe as one batch, but shopping and nutrition
    // multiply by serving count.
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
// How many servings of a given recipe are currently selected. Same recipe can
// be tapped multiple times to add servings; the shopping list and nutrition
// screen scale by this count.
export function getServings(recipeId) {
    return state.selectedRecipeIds.filter(id => id === recipeId).length;
}
function getFilteredRecipes() {
    const q = state.searchQuery.toLowerCase();
    const all = [...state.recipes.values()];
    const matched = q ? all.filter((r) => r.name.toLowerCase().includes(q)) : all;
    return matched.sort((a, b) => {
        // Ad-hoc additions float to the very top — they're transient session
        // items the user just added and likely wants to see/adjust.
        const aAdhoc = a.adhoc ? 0 : 1;
        const bAdhoc = b.adhoc ? 0 : 1;
        if (aAdhoc !== bAdhoc)
            return aAdhoc - bAdhoc;
        // Then favorites
        const aFav = state.favoriteRecipeIds.includes(a.id) ? 0 : 1;
        const bFav = state.favoriteRecipeIds.includes(b.id) ? 0 : 1;
        if (aFav !== bFav)
            return aFav - bFav;
        return a.name.localeCompare(b.name);
    });
}
// ============================================================
// COOK TIME
// ============================================================
function recipeCookSeconds(recipe) {
    // Critical path calculation — simulates parallel execution.
    // Each claim key tracks the wall-clock time at which that equipment/
    // ingredient becomes free. A step can only start once all of its
    // claimed keys are free (paths converge at the max). Timer steps then
    // push their keys' release times forward by their duration (paths diverge
    // when unrelated keys are updated independently).
    const releaseAt = new Map();
    function claimKeysForStep(step) {
        const keys = [];
        for (const eq of (step.equipment ?? [])) {
            keys.push(`eq::${eq}`);
        }
        for (const ing of (step.ingredients ?? [])) {
            keys.push(`ing::${ing.name}`);
        }
        return keys;
    }
    let totalTime = 0;
    for (const step of recipe.steps) {
        if (step.type !== 'timer')
            continue;
        const keys = claimKeysForStep(step);
        // This step starts when all its claimed resources are free —
        // paths converge here via max.
        const startAt = keys.reduce((m, k) => Math.max(m, releaseAt.get(k) ?? 0), 0);
        const endAt = startAt + (step.durationSeconds ?? 0);
        // Push release times forward for all claimed keys — paths diverge
        // here because unrelated keys remain on their own independent timelines.
        for (const k of keys) {
            releaseAt.set(k, endAt);
        }
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
// COOKING PLAN — PER-STEP LOCK INJECTION
// ============================================================
//
// Called once when the user hits "Start Cooking". Walks steps in authored
// order and attaches waitForIds directly to each step that needs to wait
// for a timer to finish before it becomes interactable.
//
// Algorithm:
//   A timer step "claims" all of its equipment and ingredients.
//   Any later step that shares a claimed equipment or ingredient is locked,
//   waiting for the claiming timer to complete.
//   Claims are keyed as "recipeId::equipment" or "recipeId::ingredient"
//   so the same equipment name in two different recipes stays separate.
//
//   Example: "Cook sausage (5 min)" claims the pan.
//   "Continue cooking sausage" also uses the pan → locked until cook timer done.
//   "Bring water to boil (6 min)" claims the pot.
//   "Add lentil spaghetti to pot" also uses the pot → locked until boil done.
function buildCookingPlan(recipes) {
    const steps = recipes
        .flatMap(r => r.steps);
    // Preserve manually declared waitForIds (set via waitFor()) — store them
    // keyed by step id so we can merge them back after the derived pass.
    const manualWaits = new Map();
    steps.forEach(s => {
        if (s.waitForIds && s.waitForIds.length > 0) {
            manualWaits.set(s.id, [...s.waitForIds]);
        }
        s.waitForIds = undefined;
    });
    // Equipment claims keyed by "recipeId::eq::name" — equipment is identified
    // by name since there's only ever one instance of a named vessel.
    // Ingredient claims keyed by object reference — two calls to i.avocadoOil()
    // produce separate objects and are treated as independent instances.
    const equipClaims = new Map();
    const ingClaims = new Map();
    function getBlockingIds(step) {
        const blocking = new Set();
        for (const eq of (step.equipment ?? [])) {
            const key = `${step.recipeId}::eq::${eq}`;
            const id = equipClaims.get(key);
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
        for (const eq of (step.equipment ?? [])) {
            equipClaims.set(`${step.recipeId}::eq::${eq}`, step.id);
        }
        for (const ing of (step.ingredients ?? [])) {
            ingClaims.set(ing, step.id);
        }
    }
    for (const step of steps) {
        // Collect any active claims that block this step
        const waitFor = new Set();
        // Seed with manual waits declared via waitFor()
        for (const id of (manualWaits.get(step.id) ?? [])) {
            waitFor.add(id);
        }
        // Add derived waits from equipment/ingredient conflicts
        for (const id of getBlockingIds(step)) {
            waitFor.add(id);
        }
        if (waitFor.size > 0) {
            step.waitForIds = [...waitFor];
        }
        // Any step that is itself waiting (has waitForIds) creates claims on its
        // equipment and ingredients — not just timers. This means downstream steps
        // that share the same equipment/ingredients will transitively inherit the
        // block without needing explicit waitFor() declarations.
        if (step.type === 'timer' || (step.waitForIds && step.waitForIds.length > 0)) {
            setClaims(step);
        }
    }
    return steps;
}
// ============================================================
// SHOPPING LIST
// ============================================================
function buildShoppingList() {
    // Object-reference dedup first — the SAME ingredient object appears across
    // many steps (parent, children, mix contents), so summing by step would
    // multi-count it. Walk to a Set of distinct objects, then sum by name+unit
    // across those, scaled by the recipe's serving count.
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
            // Skip composites from mix()/combine() — they're roll-ups of real
            // ingredients already counted on their own.
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
// Scale a totals row by a serving count — used so the nutrition screen reports
// the actual amount the user will consume when they select N servings of a recipe.
const scaleTotals = (t, n) => ({
    calories: t.calories * n,
    sodium: t.sodium * n,
    sugar: t.sugar * n,
    protein: t.protein * n,
});
// Composite ingredients produced by mix()/combine() carry _constituents and
// are roll-ups of real ingredients that are already counted on their own —
// excluding them avoids double counting and noisy false "missing" flags.
function isComposite(ing) {
    return Array.isArray(ing._constituents);
}
// The single product whose label drives this ingredient's nutrition (and which
// the shopping list marks as the pick). Prefers the product matching
// defaultBrand; otherwise the first listed. Nutrition is NEVER blended across
// brands — one brand is in the dish, so one label is used.
function selectedProduct(ing) {
    const ps = ing.products ?? [];
    if (ps.length === 0)
        return undefined;
    return ps.find(p => p.brand === ing.defaultBrand) ?? ps[0];
}
// Resolution order: the selected product's label (brand-specific), else the
// ingredient's own generic label (for produce). Brand-bearing goods keep their
// label on the Product; brand-independent produce keeps it on the ingredient.
function nutritionSource(ing) {
    const product = selectedProduct(ing);
    if (product?.nutrition)
        return { label: product.nutrition, brand: product.brand };
    return { label: ing.nutrition };
}
function ingredientNutrition(ing) {
    const { label, brand } = nutritionSource(ing);
    if (!label || Object.keys(label).length === 0) {
        return { status: 'missing' };
    }
    if (!ing.unit || !ing.unit.name) {
        return { status: 'uncomputable', reason: 'no unit on the recipe ingredient' };
    }
    const facts = label[ing.unit.name];
    if (!facts) {
        const keyed = Object.keys(label).map(k => `"${k}"`).join(', ');
        return {
            status: 'uncomputable',
            reason: `recipe uses "${ing.unit.name}" but ${brand ? `${brand}'s ` : ''}data is only keyed by ${keyed} (no unit conversion)`,
        };
    }
    const servingSize = facts.servingSize ?? 0;
    if (servingSize <= 0) {
        return { status: 'uncomputable', reason: 'serving size is missing or zero' };
    }
    const servingsUsed = (ing.quantity ?? 0) / servingSize;
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
function recipeNutrition(recipe) {
    // Dedupe by object reference — the SAME ingredient object appears across
    // multiple steps (e.g. PANKO in add/place/transfer). Reference-dedup counts
    // each real quantity exactly once. Composites are filtered out (see above).
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
        .map(ing => ({ ing, result: ingredientNutrition(ing) }));
    const totals = breakdown.reduce((acc, b) => b.result.status === 'ok' ? addTotals(acc, b.result.totals) : acc, emptyTotals());
    return {
        totals,
        covered: breakdown.filter(b => b.result.status === 'ok').length,
        missing: breakdown.filter(b => b.result.status === 'missing').length,
        uncomputable: breakdown.filter(b => b.result.status === 'uncomputable').length,
        total: breakdown.length,
        breakdown,
    };
}
function formatTotals(t) {
    return `${Math.round(t.calories)} cal · ${Math.round(t.sodium)} mg sodium · ` +
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
        // Fallback for older browsers
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
        const url = getRecipeURL(recipeId);
        copyToClipboard(url).then(() => {
            const original = btn.textContent;
            btn.textContent = '✓';
            setTimeout(() => {
                btn.textContent = original;
            }, 1500);
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
    // Create a silent audio element just to unlock the browser's audio context
    const silentAudio = new Audio();
    silentAudio.src = 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==';
    silentAudio.play().catch(() => {
        // Fail silently if autoplay is blocked
    });
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
            // Ad-hoc rows skip the star (transient — favoriting one-offs is
            // noise) and the copy link (the ID is a Date.now-stamped key that
            // won't survive a page reload, so a shareable URL is meaningless).
            if (!recipe.adhoc) {
                const star = document.createElement('button');
                const isFav = state.favoriteRecipeIds.includes(recipe.id);
                star.className = 'star-btn';
                star.textContent = isFav ? '★' : '☆';
                star.classList.toggle('starred', isFav);
                star.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    if (state.favoriteRecipeIds.includes(recipe.id)) {
                        state.favoriteRecipeIds = state.favoriteRecipeIds.filter((id) => id !== recipe.id);
                    }
                    else {
                        state.favoriteRecipeIds.push(recipe.id);
                    }
                    renderRecipeList();
                });
                row.appendChild(star);
            }
            else {
                // Spacer so ad-hoc rows align with starred ones
                const spacer = document.createElement('span');
                spacer.className = 'star-spacer';
                row.appendChild(spacer);
            }
            const btn = document.createElement('button');
            btn.className = 'recipe-btn';
            const count = state.selectedRecipeIds.filter(id => id === recipe.id).length;
            btn.classList.toggle('selected', count > 0);
            // Recipe name, with a small ×N badge when selected more than once
            const nameSpan = document.createElement('span');
            nameSpan.textContent = recipe.name;
            btn.appendChild(nameSpan);
            if (count > 1) {
                const badge = document.createElement('span');
                badge.className = 'count-badge';
                badge.textContent = `×${count}`;
                btn.appendChild(badge);
            }
            // Tap adds one serving. Same recipe can appear multiple times in
            // selectedRecipeIds — each occurrence is one serving of the recipe.
            btn.addEventListener('click', () => {
                state.selectedRecipeIds.push(recipe.id);
                unlockAudioContext();
                renderRecipeList();
                updateActionButtons();
            });
            // When at least one serving is selected, show a "−" button so the
            // user can remove servings one at a time. Hidden at count: 0.
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
            // For ad-hoc rows, an "×" button removes the recipe entirely
            // (drops all servings AND unregisters the synthetic recipe so it
            // stops cluttering the list once the user is done with it).
            // For real recipes, we keep the share-link button instead.
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
    // "+ Add an ingredient" — opens a picker screen for adding a one-off
    // ingredient (no recipe). The picker creates a synthetic adhoc recipe so
    // the rest of the app's machinery (shopping/nutrition) works unchanged.
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
    // Only show "Start Cooking" when at least one real (non-adhoc) recipe is
    // selected — there's nothing to cook for ad-hoc-only shopping lists.
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
//
// Three levels of drill-down, top to bottom:
//   1. Grand total across all selected recipes (pinned at top).
//   2. Per recipe — a collapsible section showing the recipe subtotal.
//   3. Per ingredient — tap a recipe header to expand its ingredient rows.
//
// Ingredients that can't contribute a trustworthy number are flagged inline:
//   • "no nutrition data" — the ingredient has no nutrition block.
//   • "can't compute"     — it has data but the unit doesn't match (or the
//                           serving size is unusable); the reason is shown.
// Every recipe and the grand total also carry a coverage line so a subtotal
// built from only some of its ingredients is never read as complete.
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
    // Sum the SCALED per-recipe totals (each multiplied by its serving count).
    const grand = perRecipe.reduce((acc, p) => addTotals(acc, scaleTotals(p.nutrition.totals, p.servings)), emptyTotals());
    const gCovered = perRecipe.reduce((a, p) => a + p.nutrition.covered, 0);
    const gFlagged = perRecipe.reduce((a, p) => a + p.nutrition.missing + p.nutrition.uncomputable, 0);
    const gTotal = perRecipe.reduce((a, p) => a + p.nutrition.total, 0);
    const grandServings = perRecipe.reduce((a, p) => a + p.servings, 0);
    const totalCard = createPanel();
    totalCard.className = 'panel nutrition-total';
    const totalTitle = document.createElement('div');
    totalTitle.className = 'nutrition-total-title';
    // Title disambiguates "1 recipe ×3" from "3 different recipes" — the grand
    // total card scales by servings, so the reader should always know exactly
    // what's being summed.
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
    totalValue.textContent = gCovered > 0 ? formatTotals(grand) : '— no computable data';
    totalCard.appendChild(totalValue);
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
        // Scaled subtotal — what the user will actually consume for the chosen
        // number of servings.
        const sectionTotals = scaleTotals(nutrition.totals, servings);
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
        sub.textContent = nutrition.covered > 0 ? formatTotals(sectionTotals) : '— no computable data';
        header.appendChild(caret);
        header.appendChild(name);
        header.appendChild(sub);
        section.appendChild(header);
        const cov = document.createElement('div');
        cov.className = 'nutrition-coverage' + (flaggedCount > 0 ? ' flagged' : '');
        cov.textContent = (flaggedCount > 0 ? '⚠ ' : '') +
            coverageLabel(nutrition.covered, nutrition.total, flaggedCount);
        section.appendChild(cov);
        // Per-ingredient breakdown — collapsed until the header is tapped
        const list = document.createElement('div');
        list.className = 'nutrition-ingredients collapsed';
        nutrition.breakdown.forEach(({ ing, result }) => {
            const row = document.createElement('div');
            row.className = 'nutrition-ingredient-row';
            const ingName = document.createElement('span');
            ingName.className = 'nutrition-ingredient-name';
            // Scale the displayed quantity per serving count so the row's
            // amount matches the row's nutrition (e.g. "2 cups Macadamia Milk").
            const scaledIng = { ...ing, quantity: (ing.quantity ?? 0) * servings };
            ingName.textContent = formatIngredient(scaledIng);
            row.appendChild(ingName);
            const detail = document.createElement('span');
            if (result.status === 'ok') {
                detail.className = 'nutrition-ingredient-value';
                detail.textContent = formatTotals(scaleTotals(result.totals, servings));
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
            // Spell out why an ingredient with data still couldn't be used
            if (result.status === 'uncomputable') {
                const reason = document.createElement('div');
                reason.className = 'nutrition-flag-reason';
                reason.textContent = result.reason;
                row.appendChild(reason);
            }
            // Brand provenance — show which product's label these numbers came
            // from, so a reader knows the figures are brand-specific (and what
            // they'd change by if they swapped to a different listed product).
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
//
// Picker for adding a one-off ingredient to the current shopping/nutrition
// session without going through a recipe. The user searches the registered
// ingredients (from `i`), picks one, sets a quantity and unit, and confirms.
// Confirmation creates a synthetic adhoc recipe via createAdhocRecipe() and
// selects one serving of it, after which it flows through every existing
// pipeline as if it were a real recipe.
//
// State is local to the screen (search query + selection) — kept in module
// vars rather than the global state because it's transient and discarded when
// the user leaves the picker.
let adhocSearchQuery = '';
let adhocSelectedKey = null;
let adhocQuantity = 1;
let adhocUnitName = '';
// Best guess at a natural unit for an ingredient — inspects any nutrition
// block (on the ingredient or its first product) and uses one of its keyed
// units. Falls back to `u.unit` so the picker always has something to show.
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
// Enumerate every registered ingredient factory in `i`, instantiating each
// once at zero quantity to read its display name and default unit. Cached on
// first call — the set of factories doesn't change at runtime.
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
    // Search box — filters the ingredient catalog by name substring.
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
    // Quantity + unit + confirm — only shown once an ingredient is selected.
    const detail = document.createElement('div');
    detail.id = 'adhoc-detail';
    detail.className = 'adhoc-detail';
    root.appendChild(detail);
    const backBtn = createButton('← Back', () => {
        // Reset transient picker state when leaving
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
            // Reset quantity/unit to defaults when picking a new ingredient
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
    // Quantity input
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
    // Unit dropdown — every supported unit is offered (no unit-conversion
    // logic exists, so we don't try to restrict per ingredient).
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
    unitSelect.addEventListener('change', () => {
        adhocUnitName = unitSelect.value;
    });
    root.appendChild(unitSelect);
    // Confirm — builds a fresh ingredient object at the chosen qty/unit,
    // wraps it in a synthetic adhoc recipe, registers + selects it, then
    // returns to the select screen so the user sees it in the list.
    const confirmBtn = createButton('Add to list', () => {
        const factory = i[adhocSelectedKey];
        const unit = Object.values(u).find(uu => uu.name === adhocUnitName) ?? u.unit;
        const fresh = factory(adhocQuantity, unit);
        const recipe = createAdhocRecipe(fresh);
        registerRecipe(recipe);
        state.selectedRecipeIds.push(recipe.id);
        // Clear picker state
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
    return m > 0
        ? `${m}m ${String(s).padStart(2, '0')}s`
        : `${s}s`;
}
// ============================================================
// COOKING LAYOUT — ACTIONABLE STEPS FIRST
// ============================================================
//
// The cooking screen renders two zones:
//
//   ┌─────────────────────────────────────────┐
//   │  [Ready section]                        │
//   │  Steps with no waitForIds, or steps     │
//   │  whose waited-on timers are done        │
//   ├─────────────────────────────────────────┤
//   │  [Waiting section]  (collapsible label) │
//   │  Steps that are still locked            │
//   └─────────────────────────────────────────┘
//
// Each step panel is rendered once and physically moved between zones
// whenever its lock state changes. This keeps authored ordering within
// each zone while always surfacing actionable steps at the top.
//
// Movement is triggered by the same MutationObserver that drives the
// unlock animation — when a step unlocks, promotePanelToReady() is
// called immediately after the unlock flash, sliding the panel into
// the ready zone.
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
    // Never independently promote a child panel — it lives inside its
    // container and the container handles its own promotion.
    if (panel.closest('.container-children'))
        return;
    const incomingIndex = parseInt(panel.dataset.stepIndex ?? '0', 10);
    // Only consider direct children of readySection that have a step index.
    // Skip completed/skipped panels — treat them as index -1 (pinned at top),
    // so newly promoted steps always insert after them.
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
    // Hide the waiting section label if nothing is left waiting
    if (waitingSection) {
        const remainingLocked = waitingSection.querySelectorAll('.panel:not(.waiting-section-label)');
        if (remainingLocked.length === 0) {
            waitingSection.style.display = 'none';
        }
    }
}
function renderCookingScreen() {
    const root = getElement('app');
    clear(root);
    // Reset section references for a fresh render
    readySection = null;
    waitingSection = null;
    // Record when cooking started (only on first render, not on re-render)
    if (state.cookingStartedAt === null) {
        state.cookingStartedAt = Date.now();
    }
    // Ad-hoc ingredients are tracked as synthetic recipes for shopping/nutrition
    // purposes, but they carry no real steps — exclude them from cooking so the
    // cook flow doesn't sprout meaningless "Have X on hand" cards.
    const selected = getSelectedRecipes().filter(r => !r.adhoc);
    state.cookingPlanSteps = buildCookingPlan(selected);
    // Total time banner when multiple recipes selected
    if (selected.length > 1) {
        const totalSecs = selected.reduce((s, r) => {
            const recipeSecs = recipeCookSeconds(r);
            return s + recipeSecs;
        }, 0);
        const hardcodedTotal = selected.reduce((s, r) => {
            return s + (r.estimatedMinutes ? r.estimatedMinutes * 60 : 0);
        }, 0);
        const banner = document.createElement('div');
        banner.className = 'cook-time-banner';
        let bannerText = `Total cook time: ${formatCookTime(totalSecs)}`;
        if (hardcodedTotal > 0) {
            bannerText = `Total: ${formatCookTime(hardcodedTotal)} goal (${formatCookTime(totalSecs)} calculated)`;
        }
        banner.textContent = bannerText;
        root.appendChild(banner);
    }
    const { ready, waiting } = getOrCreateCookingSections();
    root.appendChild(ready);
    root.appendChild(waiting);
    let lastRecipeId;
    for (const step of state.cookingPlanSteps) {
        // Insert recipe title headings into the ready section (they always appear there)
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
                if (state.cookingElapsedInterval !== null) {
                    window.clearInterval(state.cookingElapsedInterval);
                }
                state.cookingElapsedInterval = window.setInterval(() => {
                    const hasSteps = document.querySelector(`#app .panel:not(.completed):not(.skipped)`);
                    if (!hasSteps) {
                        window.clearInterval(state.cookingElapsedInterval);
                        state.cookingElapsedInterval = null;
                        return;
                    }
                    updateBadge();
                }, 1000);
                const copyBtn = createCopyButton(recipe.id);
                header.appendChild(title);
                header.appendChild(badge);
                header.appendChild(copyBtn);
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
    // Hide the waiting section if it has no locked panels
    const lockedPanels = waiting.querySelectorAll('.panel');
    if (lockedPanels.length === 0) {
        waiting.style.display = 'none';
    }
    root.appendChild(createStartOverButton());
}
// ============================================================
// STEP LOCKING
// ============================================================
//
// A locked step is dimmed, shows a "waiting" label, and ignores taps.
// It watches the DOM via MutationObserver and unlocks itself the moment
// all waited-on timer step elements are completed or skipped.
// On unlock it briefly flashes a "ready" style, then promotePanelToReady()
// physically moves it from the waiting section into the ready section.
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
        // Move the panel to the ready section after the flash animation
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
    // ── Container step (has children) ────────────────────────
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
            if (step.waitForIds && !child.waitForIds) {
                child.waitForIds = step.waitForIds;
            }
            const childPanel = renderStep(child, checkDone);
            childWrap.appendChild(childPanel);
        });
        applyLock(panel, step);
        return panel;
    }
    // ── Timer step ───────────────────────────────────────────
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
    // ── Instruction / cleanup step ───────────────────────────
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
        // Drop ad-hoc recipes — they're transient session items and shouldn't
        // outlive a Start Over. Real recipes stay registered for next time.
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

/* Small "×N" badge inside the recipe button when more than one serving is
   selected — placed inline after the name so the button stays tappable as a
   whole and the count is obvious at a glance. */
.count-badge {
    margin-left: 10px;
    font-size: 18px;
    font-weight: bold;
    background: rgba(255, 255, 255, 0.2);
    padding: 2px 10px;
    border-radius: 12px;
}

/* The "−" button next to a selected recipe, used to remove one serving at a
   time. Hidden (visibility:hidden, not display:none) when count is 0 so the
   row layout doesn't shift as servings are added/removed. */
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

/* Reserved space where the star would go for ad-hoc rows — keeps the recipe
   button column aligned across rows with and without favoriting. */
.star-spacer {
    display: inline-block;
    width: 52px;  /* matches .star-btn padding + char width */
}

/* "×" delete on ad-hoc rows — removes the synthetic recipe entirely. Red so
   it's visually distinguished from the "−" servings button. */
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

/* ── Add-ingredient screen ── */

/* The bottom "+ Add an ingredient" affordance on the recipe list — visually
   distinct from the recipe rows so it reads as a separate action. */
.add-ingredient-row {
    margin-top: 16px;
    display: flex;
}
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
.add-ingredient-btn:hover {
    border-color: #888;
    color: #f0f0f0;
}

.adhoc-sub {
    color: #888;
    margin: 0 0 16px 0;
}

/* Scrollable list of catalog ingredients in the picker. Capped height so the
   quantity + unit controls below stay reachable on short screens. */
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
.adhoc-item.selected {
    background: #1a5c2a;
    border-color: #2d9e4a;
}

/* Quantity + unit + confirm row, shown once an ingredient is picked. */
.adhoc-detail {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    padding: 12px 0;
}
.adhoc-detail:empty { display: none; }
.adhoc-detail-label {
    flex-basis: 100%;
    font-size: 18px;
    color: #f0f0f0;
}
.adhoc-qty {
    flex: 1;
    min-width: 80px;
    background: #222;
    border: 2px solid #444;
    border-radius: 10px;
    color: #f0f0f0;
    font-size: 20px;
    padding: 12px;
}
.adhoc-unit {
    flex: 1;
    min-width: 100px;
    background: #222;
    border: 2px solid #444;
    border-radius: 10px;
    color: #f0f0f0;
    font-size: 20px;
    padding: 12px;
}
.adhoc-confirm {
    flex-basis: 100%;
    background: #16a34a;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 22px;
    font-weight: bold;
    padding: 18px;
    cursor: pointer;
}
.adhoc-confirm:hover { background: #15803d; }

.star-btn {
    font-size: 28px;
    padding: 12px;
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    line-height: 1;
}

.star-btn.starred { color: #f5c518; }

.copy-link-btn {
    font-size: 18px;
    padding: 10px 12px;
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    line-height: 1;
    transition: color 0.3s;
}

.copy-link-btn:hover {
    color: #60a5fa;
}

.copy-link-btn:active {
    color: #2d9e4a;
}

.actions {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: #111;
    border-top: 2px solid #333;
    padding: 16px 24px;
    display: flex;
    gap: 16px;
}

.action-btn {
    flex: 1;
    font-size: 24px;
    padding: 20px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    font-weight: bold;
}

/* Default positional coloring (used when all three buttons are present:
   Shopping blue, Cooking green). When only Shopping + Nutrition are shown
   (ad-hoc-only selection), the Nutrition button would otherwise inherit
   the green :last-child rule — the more specific selector below overrides
   that so Nutrition stays purple regardless of position. */
.action-btn:first-child { background: #2563eb; color: white; }
.action-btn:last-child  { background: #16a34a; color: white; }
.actions .action-btn-nutrition { background: #7c3aed; color: white; }

#recipe-list { padding-bottom: 120px; }

.panel {
    border: 2px solid #444;
    border-radius: 12px;
    padding: 20px;
    margin: 10px 0;
    cursor: pointer;
    font-size: 22px;
    position: relative;
    transition: opacity 0.3s, border-color 0.3s, background 0.3s;
}

.panel.container-step {
    border-color: #555;
    background: #1a1a1a;
    cursor: default;
    padding: 0;
}

.container-header {
    padding: 16px 20px 12px;
    font-size: 18px;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #333;
}

.container-children {
    padding: 8px 12px 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.container-children .panel {
    margin: 0;
    font-size: 20px;
    padding: 14px 16px;
}

.panel.timer     { background: #ca8a04; color: black; border-color: #ca8a04; }
.panel.completed { background: #1a5c2a; color: white; border-color: #2d9e4a; }
.panel.skipped   { background: #374151; color: #9ca3af; border-color: #4b5563; text-decoration: line-through; }

/* Locked step — dimmed with a left red border accent */
.panel.step-locked {
    opacity: 0.45;
    cursor: not-allowed;
    border-left: 4px solid #ef4444;
    border-color: #333;
    border-left-color: #ef4444;
}

/* Small pill shown inside locked steps */
.waiting-pill {
    display: inline-block;
    margin-top: 8px;
    font-size: 13px;
    color: #ef4444;
    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 20px;
    padding: 2px 10px;
    letter-spacing: 0.04em;
}

/* Brief green flash when a step unlocks */
@keyframes unlockFlash {
    0%   { border-color: #2d9e4a; background: rgba(45, 158, 74, 0.15); }
    100% { border-color: #444;    background: transparent; }
}

.panel.step-unlocked {
    animation: unlockFlash 0.8s ease-out forwards;
}

.purchase-links { margin-top: 10px; display: flex; flex-direction: column; gap: 6px; }

.purchase-link { color: #60a5fa; font-size: 16px; text-decoration: none; }
.purchase-link:hover { text-decoration: underline; }

/* The product selected as the default — its label drives nutrition, and it's
   highlighted on the shopping list so the user can see which one is "the pick". */
.purchase-link.default-product {
    color: #2d9e4a;
    font-weight: bold;
}

.start-over-btn {
    margin-top: 32px;
    font-size: 20px;
    padding: 16px 32px;
    border-radius: 12px;
    border: 2px solid #444;
    background: #222;
    color: #f0f0f0;
    cursor: pointer;
}

.empty { color: #666; font-style: italic; }

/* Recipe title row with cook time badge */
.recipe-title-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 4px;
}

.recipe-title-row h2 { margin: 0; flex: 1; }

.recipe-title-row .copy-link-btn {
    margin-left: auto;
}

.cook-time-badge {
    font-size: 16px;
    color: #888;
    white-space: nowrap;
}

.cook-time-elapsed {
    font-size: 16px;
    color: #60a5fa;
    white-space: nowrap;
    margin-left: auto;
}

/* Total cook time banner (multi-recipe) */
.cook-time-banner {
    font-size: 16px;
    color: #888;
    border: 1px solid #333;
    border-radius: 10px;
    padding: 10px 16px;
    margin-bottom: 16px;
    text-align: center;
}

/* ── Cooking layout zones ── */

/* Ready section: unlocked, actionable steps */
#ready-section {
    margin-bottom: 8px;
}

/* Waiting section: locked steps, separated with a label */
#waiting-section {
    margin-top: 24px;
    border-top: 1px solid #2a2a2a;
    padding-top: 8px;
}

.waiting-section-label {
    font-size: 14px;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-bottom: 6px;
    padding-left: 4px;
    pointer-events: none;
    user-select: none;
}

/* ── Nutrition screen ── */

/* Grand-total card pinned at the top */
.panel.nutrition-total {
    cursor: default;
    border-color: #555;
    background: #1a1a1a;
}

.nutrition-total-title {
    font-size: 16px;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
}

.nutrition-values {
    font-size: 20px;
    color: #f0f0f0;
}

/* Coverage line — turns amber whenever anything is flagged so a
   subtotal built from partial data is never read as complete */
.nutrition-coverage {
    font-size: 14px;
    color: #888;
    margin-top: 8px;
}

.nutrition-coverage.flagged { color: #f59e0b; }

/* Collapsible per-recipe section */
.panel.nutrition-recipe {
    cursor: default;
    padding: 0;
}

.nutrition-recipe-header {
    display: flex;
    align-items: baseline;
    gap: 10px;
    padding: 16px 20px 6px;
    cursor: pointer;
}

.nutrition-caret { color: #888; font-size: 16px; }

.nutrition-recipe-name { font-size: 22px; flex: 1; }

.nutrition-recipe-sub {
    font-size: 14px;
    color: #888;
    text-align: right;
    white-space: nowrap;
}

.panel.nutrition-recipe .nutrition-coverage {
    padding: 0 20px 14px;
    margin-top: 0;
}

.nutrition-ingredients {
    border-top: 1px solid #333;
    padding: 6px 20px 14px;
    display: flex;
    flex-direction: column;
}

.nutrition-ingredients.collapsed { display: none; }

.nutrition-ingredient-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: baseline;
    gap: 4px 14px;
    font-size: 16px;
    padding: 8px 0;
    border-bottom: 1px solid #222;
}

.nutrition-ingredient-row:last-child { border-bottom: none; }

.nutrition-ingredient-name { color: #f0f0f0; }

.nutrition-ingredient-value { color: #888; text-align: right; }

/* Inline flag pill for missing / uncomputable ingredients */
.nutrition-flag {
    color: #f59e0b;
    font-size: 13px;
    background: rgba(245, 158, 11, 0.12);
    border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: 16px;
    padding: 2px 10px;
    white-space: nowrap;
}

/* Full-width explanation under an uncomputable ingredient */
.nutrition-flag-reason {
    flex-basis: 100%;
    font-size: 13px;
    color: #d97706;
    font-style: italic;
    margin-top: 2px;
}

/* "via {brand}" provenance shown under an ingredient whose numbers came from
   a selected product's label — full-width, muted, italic. Acknowledges that
   nutrition is brand-specific and tells the reader where the figures came from. */
.nutrition-provenance {
    flex-basis: 100%;
    font-size: 12px;
    color: #666;
    font-style: italic;
    margin-top: 2px;
}

`;
// ============================================================
// BOOTSTRAP
// ============================================================
function bootstrap() {
    document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);
    document.body.innerHTML = `<div id="app"></div>`;
    // Check if a recipe ID is provided in the URL (e.g. ?recipe=blueprint-smoothie)
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
        apple: '',
        frozenBerries: '',
        cocoaFlavanols: '',
        wheatGrassPowder: '',
        creatine: '',
        chlorellaPowder: '',
        aminoComplex: '',
        acaiFrozenMix: '',
        blueprintBlueberryWalnut: '',
        blueprintCacao: '',
        frozenStrawberry: '',
        frozenCauliflower: '',
        frozenBroccoli: '',
        frozenBlueberry: '',
        blueprintNuttyPudding: '',
        // The following Blueprint Smoothie ingredients are declared separately
        // below with nutrition blocks: banana, lemonJuice, cocoaNibs, chiaSeed,
        // hempSeed, cherry, antiOxidantBerryBlend, vanillaExtract, celery,
        // spinach, kale (plus macadamiaNutMilk and macadamiaNut, already factories).
        egg: '',
        milk: '',
        bread: '',
        pomegranateSeeds: '',
        water: '',
        avocadoOil: '',
        abbotPeaItalianSausage: '',
        lentilSpaghetti: '',
        spaghettiSauce: '',
        pankoBreadCrumbs: '',
        salt: '',
        garlicPowder: '',
        cornstarch: '',
        cassavaFlour: '',
        kingOysterMushroom: '',
    }),
    // ──────────────────────────────────────────────────────────────────────
    // Blueprint Smoothie ingredients
    //
    // Packaged goods carry their nutrition on a Product (brand-specific), with
    // defaultBrand pointing at the SKU actually used. Produce (lemon, cherry,
    // celery, spinach, kale, banana) keeps a single brand-independent nutrition
    // block on the ingredient itself. Each label is keyed by the exact unit the
    // recipe uses — there's no unit conversion. Sodium in mg; sugar/protein in g.
    // ──────────────────────────────────────────────────────────────────────
    macadamiaNutMilk: ingredientFactory('Macadamia Nut Milk', {
        requiresDateLabel: true,
        defaultBrand: 'Milkadamia',
        products: [
            {
                brand: 'Milkadamia',
                variant: 'Unsweetened',
                store: stores.wholeFoods,
                link: 'https://www.amazon.com/dp/B01JH2O854',
                size: 32, sizeUnit: u.fluidOunce,
                nutrition: {
                    [u.cup.name]: { servings: 4, servingSize: 1, calories: 50, sodium: 75, sugar: 0, protein: 1 },
                },
            },
        ],
    }),
    macadamiaNut: ingredientFactory('Macadamia Nut', {
        defaultBrand: '365',
        products: [
            {
                brand: '365',
                variant: 'Organic Raw',
                store: stores.wholeFoods,
                link: 'https://www.wholefoodsmarket.com/product/365-by-whole-foods-market-organic-macadamia-nuts-8-oz-b086hk83yf',
                price: 10.79, size: 8, sizeUnit: u.ounce, organic: true,
                nutrition: {
                    [u.cup.name]: { servings: 1, servingSize: 1, calories: 960, sodium: 7, sugar: 6, protein: 11 },
                },
            },
        ],
    }),
    cocoaNibs: ingredientFactory('Cocoa Nibs', {
        defaultBrand: 'Navitas',
        products: [
            {
                brand: 'Navitas',
                variant: 'Organic Raw',
                nutrition: {
                    [u.tsp.name]: { servings: 1, servingSize: 1, calories: 20, sodium: 0, sugar: 0, protein: 0.3 },
                },
            },
        ],
    }),
    chiaSeed: ingredientFactory('Chia Seed', {
        defaultBrand: '365',
        products: [
            {
                brand: '365',
                variant: 'Organic Black',
                store: stores.wholeFoods,
                nutrition: {
                    [u.tsp.name]: { servings: 1, servingSize: 1, calories: 19, sodium: 0, sugar: 0, protein: 1 },
                },
            },
        ],
    }),
    hempSeed: ingredientFactory('Hemp Seed', {
        defaultBrand: 'Manitoba Harvest',
        products: [
            {
                brand: 'Manitoba Harvest',
                variant: 'Hemp Hearts',
                store: stores.wholeFoods,
                nutrition: {
                    [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 55, sodium: 0, sugar: 0.5, protein: 3.3 },
                },
            },
        ],
    }),
    antiOxidantBerryBlend: ingredientFactory('Antioxidant Berry Blend', {
        defaultBrand: '365',
        products: [
            {
                brand: '365',
                variant: 'Organic Antioxidant Fruit Blend (frozen)',
                store: stores.wholeFoods,
                size: 16, sizeUnit: u.ounce, organic: true,
                nutrition: {
                    [u.cup.name]: { servings: 4, servingSize: 1, calories: 70, sodium: 0, sugar: 13, protein: 1 },
                },
            },
        ],
    }),
    vanillaExtract: ingredientFactory('Vanilla Extract', {
        defaultBrand: '365',
        products: [
            {
                brand: '365',
                variant: 'Pure Vanilla Extract',
                store: stores.wholeFoods,
                nutrition: {
                    [u.tsp.name]: { servings: 1, servingSize: 1, calories: 12, sodium: 0, sugar: 0.5, protein: 0 },
                },
            },
        ],
    }),
    // Lemon juice — produce, brand-independent.
    lemonJuice: ingredientFactory('Lemon Juice', {
        nutrition: {
            [u.unit.name]: { servings: 1, servingSize: 1, calories: 10, sodium: 0, sugar: 2, protein: 0.2 },
        },
    }),
    // Sweet cherries — produce.
    cherry: ingredientFactory('Cherry', {
        nutrition: {
            [u.unit.name]: { servings: 1, servingSize: 1, calories: 5, sodium: 0, sugar: 1, protein: 0 },
        },
    }),
    // Celery — produce, per medium stalk (~40 g).
    celery: ingredientFactory('Celery', {
        nutrition: {
            [u.unit.name]: { servings: 1, servingSize: 1, calories: 6, sodium: 32, sugar: 1, protein: 0.3 },
        },
    }),
    // Raw spinach — produce, per handful (≈ 1 cup / ~30 g).
    spinach: ingredientFactory('Spinach', {
        nutrition: {
            [u.handful.name]: { servings: 1, servingSize: 1, calories: 7, sodium: 24, sugar: 0.1, protein: 0.9 },
        },
    }),
    // Raw kale — produce, per handful (≈ 1 cup chopped / ~21 g).
    kale: ingredientFactory('Kale', {
        nutrition: {
            [u.handful.name]: { servings: 1, servingSize: 1, calories: 8, sodium: 11, sugar: 0.2, protein: 0.7 },
        },
    }),
    // Organic banana — produce, per medium banana (~118 g).
    banana: ingredientFactory('Organic Banana', {
        nutrition: {
            [u.unit.name]: { servings: 1, servingSize: 1, calories: 105, sodium: 1, sugar: 14, protein: 1.3 },
        },
    }),
    // ──────────────────────────────────────────────────────────────────────
    // Other ingredients (purchase info migrated from old purchaseLinks to
    // products[]). Nutrition not yet researched — these will flag as `missing`
    // in the Nutrition screen until labels are added per default brand.
    // ──────────────────────────────────────────────────────────────────────
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
            { brand: '365', store: stores.wholeFoods,
                price: 3.99, size: 8, sizeUnit: u.ounce,
                link: 'https://www.amazon.com/365-Everyday-Value-Dates-Pitted/dp/B074VDMNH7/ref=sr_1_5_0o_wf' },
            { brand: 'Food to Live', variant: 'Organic Deglet Nour', store: stores.amazon,
                price: 16.59, size: 2.5, sizeUnit: u.pound, organic: true,
                link: 'https://www.amazon.com/ORGANIC-Pitted-Dates-Deglet-Nour/dp/B0872L82ZK/ref=sr_1_10',
                discount: { subscribe5Products: 5 } },
        ],
    }),
    orangeJuice: ingredientFactory('Orange Juice', {
        // No purchase link yet; nutrition on the ingredient until a brand is added.
        nutrition: {
            [u.fluidOunce.name]: { servings: 8, servingSize: 7, calories: 110, sodium: 0, sugar: 22, protein: 2 },
        },
    }),
    strawberry: ingredientFactory('Strawberry', {
        defaultBrand: '365',
        products: [
            { brand: '365', variant: 'Organic Whole Strawberries (frozen)', store: stores.wholeFoods,
                price: 6.69, size: 32, sizeUnit: u.ounce, organic: true,
                link: 'https://www.wholefoodsmarket.com/product/365-by-whole-foods-market-365-whole-foods-market-organic-whole-strawberries-b09gcp3jng' },
        ],
    }),
    collagenPowder: ingredientFactory('Collagen Powder', {
        defaultBrand: 'Sports Research',
        products: [
            { brand: 'Sports Research', store: stores.amazon,
                price: 17.99, size: 1, sizeUnit: u.pound,
                link: 'https://www.amazon.com/gp/product/B071S8D69C/ref=ppx_yo_dt_b_asin_title_o00_s00',
                discount: { subscribe5Products: 5 } },
        ],
    }),
    // ──────────────────────────────────────────────────────────────────────
    // Added: Whole Foods 365 + Blueprint by Bryan Johnson products
    // Each carries its label on a Product so the brand drives nutrition.
    // ──────────────────────────────────────────────────────────────────────
    // 365 Organic Psyllium Husk Whole Flakes — per 1 tbsp (5 g).
    psyllium: ingredientFactory('Psyllium Husk', {
        defaultBrand: '365',
        products: [
            { brand: '365', variant: 'Organic Whole Flakes', store: stores.wholeFoods,
                link: 'https://www.amazon.com/365-Whole-Foods-Market-Psyllium/dp/B0CDQJRFGX',
                nutrition: {
                    [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 20, sodium: 0, sugar: 0, protein: 0 },
                } },
        ],
    }),
    // Blueprint Macadamia Nut Protein Bar (White Cocoa) — per 1 bar.
    // Nutrition is keyed by 'unit' since the natural quantity is "1 bar".
    blueprintMacadamiaBar: ingredientFactory('Blueprint Macadamia Bar', {
        defaultBrand: 'Blueprint',
        products: [
            { brand: 'Blueprint', variant: 'White Cocoa Macadamia Protein Bar',
                store: stores.amazon,
                link: 'https://www.amazon.com/Blueprint-Bryan-Johnson-Macadamia-White/dp/B0DQLV78BG',
                nutrition: {
                    [u.unit.name]: { servings: 1, servingSize: 1, calories: 160, sodium: 80, sugar: 1, protein: 9 },
                } },
        ],
    }),
    // 365 Organic Black Lentils (dry) — per ¼ cup dry (35 g).
    // Note: this is the dried legume, NOT the lentilSpaghetti pasta used by
    // the dinner recipe. Keep them as separate ingredients.
    blackLentils: ingredientFactory('Black Lentils', {
        defaultBrand: '365',
        products: [
            { brand: '365', variant: 'Organic, Black, dry', store: stores.wholeFoods,
                size: 16, sizeUnit: u.ounce, organic: true,
                link: 'https://www.amazon.com/365-Whole-Foods-Market-Organic/dp/B084NHD2R9',
                nutrition: {
                    // Recipe convention so far is to express recipe amounts in cups.
                    // Label is per ¼ cup dry, so 1 cup dry = 4× label values.
                    [u.cup.name]: { servings: 1, servingSize: 1, calories: 600, sodium: 0, sugar: 4, protein: 44 },
                } },
        ],
    }),
    // Blueprint Extra Virgin Olive Oil ("Snake Oil") — per 1 tbsp (15 ml).
    blueprintOliveOil: ingredientFactory('Extra Virgin Olive Oil', {
        defaultBrand: 'Blueprint',
        products: [
            { brand: 'Blueprint', variant: 'Snake Oil (High Polyphenol EVOO)',
                store: stores.amazon, size: 750, sizeUnit: u.fluidOunce,
                link: 'https://www.amazon.com/Blueprint-Bryan-Johnson-Olive-Oil/dp/B0F1P5SR2M',
                nutrition: {
                    [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 120, sodium: 0, sugar: 0, protein: 0 },
                } },
        ],
    }),
    // Blueprint Longevity Protein (Chocolate) — per 1 scoop (~38 g).
    // Plant protein (pea + hemp + flax) with allulose, cocoa, polyphenol extracts.
    longevityProtein: ingredientFactory('Longevity Protein', {
        defaultBrand: 'Blueprint',
        products: [
            { brand: 'Blueprint', variant: 'Chocolate (30 servings)',
                store: stores.amazon,
                link: 'https://www.amazon.com/Blueprint-Bryan-Johnson-Longevity-Protein/dp/B0DNGJRLQF',
                nutrition: {
                    // Keyed by 'scoop'? — units list doesn't include scoop. Use 'unit'
                    // since the natural recipe amount is "1 scoop = 1 unit".
                    [u.unit.name]: { servings: 1, servingSize: 1, calories: 200, sodium: 190, sugar: 0, protein: 26 },
                } },
        ],
    }),
    // Blueprint Blueberry Nut Mix — per 1 scoop (15 g). Macadamias + walnuts +
    // blueberries; no added sugar. Sugar listed is natural from the blueberries.
    blueberryNutMix: ingredientFactory('Blueberry Nut Mix', {
        defaultBrand: 'Blueprint',
        products: [
            { brand: 'Blueprint', variant: 'Macadamia + Walnut + Blueberry',
                store: stores.amazon,
                link: 'https://www.amazon.com/Blueprint-Bryan-Johnson-Blueberry-Nut/dp/B0D3FZ29RJ',
                nutrition: {
                    [u.unit.name]: { servings: 1, servingSize: 1, calories: 70, sodium: 0, sugar: 2, protein: 1 },
                } },
        ],
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
        // Step 1: Grind nuts/seeds smooth with liquid
        s(mixer.add([
            MACADAMIA_MILK,
            i.lemonJuice(0.5, u.unit),
            i.macadamiaNut(0.25, u.cup), // Hard items
            i.cocoaNibs(1, u.tsp),
            i.chiaSeed(1, u.tsp),
            i.hempSeed(1, u.tbsp),
            i.cherry(3, u.unit),
            i.antiOxidantBerryBlend(0.5, u.cup),
            i.vanillaExtract(0.25, u.tsp),
        ]));
        s(mixer.mix()); // Blend until completely smooth
        // Step 2: Add greens and soft fruits
        s(mixer.add([
            i.celery(1, u.unit),
            i.spinach(1, u.handful),
            i.kale(1, u.handful),
            i.banana(1, u.unit),
        ]));
        s(Timer.set(30, 's', 'Let mixer settle'));
        s(mixer.mix()); // Final blend
        return steps;
    })(), undefined, 8), // estimatedMinutes: 8
]);
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
        // Oven lane — longest lane (31 min), start first
        s(oven.preheat(450));
        // Pan lane — place pan in oven to toast panko
        s(pankoPan.add([PANKO]));
        s(oven.place(pankoPan, 'Toast panko', time.minutes(5), 450));
        const transferToBowl = pankoPan.transfer(pankoBowl, [PANKO]);
        s(transferToBowl);
        // Bowl lane — prep batter while panko toasts
        s(batter.add([
            i.water(7, u.ounce),
            i.salt(0.5, u.tsp),
            i.garlicPowder(0.5, u.tsp),
            i.cornstarch(2, u.tbsp),
            i.cassavaFlour(0.5, u.cup),
        ]));
        s(batter.mix('batter'));
        // Prep — slice, dip, coat
        // dip must wait for panko transfer — culinary constraint, not derivable from code
        s(cuttingBoard.slice(MUSHROOMS));
        s(batter.combine([MUSHROOMS], 'dip, let drain').waitFor(transferToBowl));
        s(pankoPan.spray(i.avocadoOil(1, u.spray)));
        s(pankoBowl.combine([batter.result], 'coat with panko'));
        pankoBowl.result.rename('Breaded King Oyster Mushroom');
        s(pankoBowl.transfer(pankoPan, [pankoBowl.result]));
        s(pankoPan.spray(i.avocadoOil(1, u.spray)));
        // Oven lane resumes — locked until preheat done
        s(oven.place(pankoPan));
        s(oven.cook('Bake mushrooms (first half)', time.minutes(12), 450));
        s(pankoPan.flip());
        s(oven.cook('Bake mushrooms (second half)', time.minutes(13), 450));
        s(oven.broil('Broil mushrooms', time.minutes(1)));
        return steps;
    })()),
    createRecipe('abbot-pea-protein-spaghetti', 'Abbot Pea Protein Spaghetti', (() => {
        const pot = e.pot();
        const pan = e.pan();
        const steps = [];
        const s = (...newSteps) => steps.push(...newSteps);
        // Pan lane — more total timer time, start first
        s(pan.add([i.avocadoOil(1, u.spray), i.abbotPeaItalianSausage(1, u.bag)]));
        s(pan.cook('Cook sausage', time.minutes(5), 5));
        // Pot lane — runs in parallel
        s(pot.add([i.water(30, u.ounce)]));
        s(pot.cook('Bring water to boil', time.minutes(6), 9));
        // Pot lane resumes — auto-locked until boil timer clears
        s(pot.add([
            i.avocadoOil(1, u.spray),
            [i.lentilSpaghetti(8, u.ounce), 'break into 3 even sections first'],
        ]));
        // Pan lane continues freely
        s(pan.cook('Continue cooking sausage', time.minutes(10), 7));
        // Pot lane — auto-locked until pan timer clears
        s(pot.cook('Cook spaghetti (first half)', time.minutes(7), 7));
        s(pot.stir());
        s(pot.cook('Cook spaghetti (second half)', time.minutes(7), 7));
        // Pan lane — auto-locked until pot timer clears
        s(pan.add([i.spaghettiSauce(1, u.bag)]));
        s(pan.cook('Simmer sauce with sausage', time.minutes(5), 7));
        return steps;
    })()),
]);
// ============================================================
// START APP
// ============================================================
document.addEventListener('DOMContentLoaded', bootstrap);
