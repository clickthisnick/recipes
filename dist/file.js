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
export function getSelectedRecipes() {
    return state.selectedRecipeIds
        .map((id) => state.recipes.get(id))
        .filter(Boolean);
}
function getFilteredRecipes() {
    const q = state.searchQuery.toLowerCase();
    const all = [...state.recipes.values()];
    const matched = q ? all.filter((r) => r.name.toLowerCase().includes(q)) : all;
    return matched.sort((a, b) => {
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
    const combined = new Map();
    getSelectedRecipes().forEach((recipe) => {
        recipe.steps.forEach((step) => {
            step.ingredients?.forEach((ingredient) => {
                const key = `${ingredient.name}-${ingredient.unit?.name ?? ''}`;
                const existing = combined.get(key);
                if (!existing) {
                    combined.set(key, { ...ingredient });
                    return;
                }
                existing.quantity = (existing.quantity ?? 0) + (ingredient.quantity ?? 0);
            });
        });
    });
    return [...combined.values()];
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
            const btn = document.createElement('button');
            btn.className = 'recipe-btn';
            btn.textContent = recipe.name;
            const isSelected = state.selectedRecipeIds.includes(recipe.id);
            btn.classList.toggle('selected', isSelected);
            btn.addEventListener('click', () => {
                if (state.selectedRecipeIds.includes(recipe.id)) {
                    state.selectedRecipeIds = state.selectedRecipeIds.filter((id) => id !== recipe.id);
                    btn.classList.remove('selected');
                }
                else {
                    state.selectedRecipeIds.push(recipe.id);
                    btn.classList.add('selected');
                    // Unlock audio on first recipe selection
                    unlockAudioContext();
                }
                updateActionButtons();
            });
            const copyBtn = createCopyButton(recipe.id);
            row.appendChild(star);
            row.appendChild(btn);
            row.appendChild(copyBtn);
            root.appendChild(row);
        });
    });
}
function updateActionButtons() {
    const actions = getElement('actions');
    clear(actions);
    if (state.selectedRecipeIds.length === 0)
        return;
    const shopBtn = createButton('🛒 Go Shopping', () => navigateTo('shopping'));
    shopBtn.className = 'action-btn';
    const cookBtn = createButton('🍳 Start Cooking', () => navigateTo('cooking'));
    cookBtn.className = 'action-btn';
    actions.appendChild(shopBtn);
    actions.appendChild(cookBtn);
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
        if (ingredient.purchaseLinks) {
            const links = document.createElement('div');
            links.className = 'purchase-links';
            Object.entries(ingredient.purchaseLinks).forEach(([store, variants]) => {
                Object.entries(variants).forEach(([variant, products]) => {
                    products.forEach((product) => {
                        const a = document.createElement('a');
                        a.href = product.link;
                        a.target = '_blank';
                        a.className = 'purchase-link';
                        a.textContent = `${store}${variant !== 'standard' ? ` (${variant})` : ''} — $${product.price} / ${product.quantity} ${product.quantityUnit.name}`;
                        links.appendChild(a);
                    });
                });
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
    const selected = getSelectedRecipes();
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

.action-btn:first-child { background: #2563eb; color: white; }
.action-btn:last-child  { background: #16a34a; color: white; }

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
        antiOxidantBerryBlend: '',
        frozenBerries: '',
        cocoaFlavanols: '',
        chiaSeed: '',
        hempSeed: '',
        wheatGrassPowder: '',
        creatine: '',
        chlorellaPowder: '',
        aminoComplex: '',
        acaiFrozenMix: '',
        blueprintBlueberryWalnut: '',
        blueprintCacao: '',
        banana: '',
        frozenStrawberry: '',
        cocoaNibs: '',
        frozenCauliflower: '',
        frozenBroccoli: '',
        frozenBlueberry: '',
        cherry: '',
        blueprintNuttyPudding: '',
        vanillaExtract: '',
        lemonJuice: '',
        celery: '',
        spinach: '',
        kale: '',
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
    macadamiaNutMilk: ingredientFactory('Macadamia Nut Milk', {
        requiresDateLabel: true,
    }),
    peanutButter: ingredientFactory('Peanut Butter', {
        purchaseLinks: {
            [stores.wholeFoods]: {
                organic: [{ price: 4.19, quantity: 16, quantityUnit: u.ounce, organic: true, link: 'https://www.amazon.com/365-Everyday-Value-Organic-Unsweetened/dp/B074H61LYV/ref=sr_1_9_0o_wf' }],
                creamy: [{ price: 2.49, quantity: 16, quantityUnit: u.ounce, organic: false, link: 'https://www.amazon.com/365-Everyday-Value-Peanut-Butter/dp/B074H57SPT/ref=sr_1_7_0o_wf' }],
                crunchy: [{ price: 4.99, quantity: 36, quantityUnit: u.ounce, organic: false, link: 'https://www.amazon.com/Everyday-Value-Peanut-Butter-Crunchy/dp/B074Y2V88X/ref=sr_1_16_0o_wf' }],
            },
            [stores.amazon]: {
                creamy: [{ price: 4.69, quantity: 40, quantityUnit: u.ounce, organic: false, link: 'https://www.amazon.com/dp/B07KWGSCW2/ref=sns_myd_detail_page', discount: { subscribe5Products: 5 } }],
            },
        },
    }),
    pittedDates: ingredientFactory('Pitted Dates', {
        purchaseLinks: {
            [stores.wholeFoods]: {
                standard: [{ price: 3.99, quantity: 8, quantityUnit: u.ounce, organic: false, link: 'https://www.amazon.com/365-Everyday-Value-Dates-Pitted/dp/B074VDMNH7/ref=sr_1_5_0o_wf' }],
            },
            [stores.amazon]: {
                organic: [{ price: 16.59, quantity: 2.5, quantityUnit: u.pound, organic: true, link: 'https://www.amazon.com/ORGANIC-Pitted-Dates-Deglet-Nour/dp/B0872L82ZK/ref=sr_1_10', discount: { subscribe5Products: 5 } }],
            },
        },
    }),
    orangeJuice: ingredientFactory('Orange Juice', {
        nutrition: {
            [u.fluidOunce.name]: { servings: 8, servingSize: 7, calories: 110, sodium: 0, sugar: 22, protein: 2 },
        },
    }),
    macadamiaNut: ingredientFactory('Macadamia Nut', {
        purchaseLinks: {
            [stores.wholeFoods]: {
                organic: [{ price: 10.79, quantity: 8, quantityUnit: u.ounce, organic: true, link: 'https://www.wholefoodsmarket.com/product/365-by-whole-foods-market-organic-macadamia-nuts-8-oz-b086hk83yf' }],
            },
        },
    }),
    strawberry: ingredientFactory('Strawberry', {
        purchaseLinks: {
            [stores.wholeFoods]: {
                organic: [{ price: 6.69, quantity: 32, quantityUnit: u.ounce, organic: true, link: 'https://www.wholefoodsmarket.com/product/365-by-whole-foods-market-365-whole-foods-market-organic-whole-strawberries-b09gcp3jng' }],
            },
        },
    }),
    collagenPowder: ingredientFactory('Collagen Powder', {
        purchaseLinks: {
            [stores.amazon]: {
                standard: [{ price: 17.99, quantity: 1, quantityUnit: u.pound, organic: false, link: 'https://www.amazon.com/gp/product/B071S8D69C/ref=ppx_yo_dt_b_asin_title_o00_s00', discount: { subscribe5Products: 5 } }],
            },
        },
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
