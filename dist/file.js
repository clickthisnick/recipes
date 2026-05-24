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
    return { id: createId(), equipment: [], ingredients: [], children: [], ...input };
}
export function instruction(text, opts = {}) {
    return createStep({ type: 'instruction', text, ...opts });
}
export const text = {
    set: (lines) => createStep({ type: 'text', text: lines.join('\n') }),
};
export function timerStep(label, durationSeconds, opts = {}) {
    return createStep({ type: 'timer', text: label, durationSeconds, ...opts });
}
export const Timer = {
    set: (amount, unit, label) => {
        const seconds = unit === 's' ? amount : unit === 'm' ? amount * 60 : amount * 3600;
        return createStep({ type: 'timer', text: label, durationSeconds: seconds });
    },
    end: () => createStep({ type: 'text', text: '' }),
};
export function cleanup(equipmentName) {
    return createStep({
        type: 'cleanup',
        text: `Clean and put away ${equipmentName}`,
        equipment: [equipmentName],
    });
}
// ============================================================
// EQUIPMENT
// ============================================================
class Equipment {
    constructor(name) {
        this.name = name;
    }
    preheat(temperature) {
        return timerStep(`Preheat ${this.name} to ${temperature}°`, time.minutes(15), {
            equipment: [this.name],
        });
    }
    cook(label, durationSeconds, temperature) {
        const text = temperature !== undefined ? `${label} (heat ${temperature})` : label;
        return timerStep(text, durationSeconds, { equipment: [this.name] });
    }
    add(ingredients, note) {
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
        const allIngredients = ingredients.map(e => Array.isArray(e) ? e[0] : e);
        return createStep({
            type: 'instruction',
            text: `Add to ${this.name}${note ? ` — ${note}` : ''}`,
            equipment: [this.name],
            ingredients: allIngredients,
            children,
        });
    }
    stir() { return instruction(`Stir ${this.name}`, { equipment: [this.name] }); }
    mix() { return instruction(`Mix ${this.name}`, { equipment: [this.name] }); }
}
export const e = {
    bowl: () => new Equipment('bowl'),
    pan: () => new Equipment('pan'),
    pot: () => new Equipment('pot'),
    oven: () => new Equipment('oven'),
    toasterOven: () => new Equipment('toaster oven'),
    instantPot: () => new Equipment('instant pot'),
    bulletMixer: () => new Equipment('bullet mixer'),
    knife: () => new Equipment('knife'),
    cuttingBoard: () => new Equipment('cutting board'),
};
// ============================================================
// RECIPE REGISTRATION
// ============================================================
export function createRecipe(id, name, steps, group) {
    steps.forEach(s => { s.recipeId = id; });
    return { id, name, steps, group };
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
        .flatMap(r => r.steps)
        .filter(s => !(s.type === 'text' && s.text === ''));
    // Clear any waitForIds from a previous cook session
    steps.forEach(s => { s.waitForIds = undefined; });
    // Maps "recipeId::equipment" or "recipeId::ingredient name" → timer step ID
    // that currently claims it. A claim persists until it is explicitly
    // superseded by a newer timer on the same key (at which point the new
    // timer becomes the one to wait for instead).
    const claims = new Map();
    function claimKeys(step) {
        const keys = [];
        for (const eq of (step.equipment ?? [])) {
            keys.push(`${step.recipeId}::eq::${eq}`);
        }
        for (const ing of (step.ingredients ?? [])) {
            keys.push(`${step.recipeId}::ing::${ing.name}`);
        }
        return keys;
    }
    for (const step of steps) {
        const keys = claimKeys(step);
        // Collect any active claims that block this step
        const waitFor = new Set();
        for (const key of keys) {
            const claimingId = claims.get(key);
            if (claimingId !== undefined) {
                waitFor.add(claimingId);
            }
        }
        if (waitFor.size > 0) {
            step.waitForIds = [...waitFor];
        }
        // If this step is a timer, it now claims all its equipment/ingredients,
        // replacing any prior claim on those keys.
        if (step.type === 'timer') {
            for (const key of keys) {
                claims.set(key, step.id);
            }
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
                }
                updateActionButtons();
            });
            row.appendChild(star);
            row.appendChild(btn);
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
function renderCookingScreen() {
    const root = getElement('app');
    clear(root);
    // Record when cooking started (only on first render, not on re-render)
    if (state.cookingStartedAt === null) {
        state.cookingStartedAt = Date.now();
    }
    const selected = getSelectedRecipes();
    state.cookingPlanSteps = buildCookingPlan(selected);
    // Total time banner when multiple recipes selected
    if (selected.length > 1) {
        const totalSecs = selected.reduce((s, r) => s + recipeCookSeconds(r), 0);
        const banner = document.createElement('div');
        banner.className = 'cook-time-banner';
        banner.textContent = `Total cook time: ${formatCookTime(totalSecs)}`;
        root.appendChild(banner);
    }
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
                // Badge: "estimated 20 min · actual 4m 32s"
                // Stops ticking when all steps are done.
                const badge = document.createElement('span');
                badge.className = 'cook-time-badge';
                const estimateText = formatCookTime(recipeCookSeconds(recipe));
                const updateBadge = () => {
                    const secs = Math.floor((Date.now() - state.cookingStartedAt) / 1000);
                    badge.textContent = `estimated ${estimateText} · actual ${formatElapsed(secs)}`;
                };
                updateBadge();
                if (state.cookingElapsedInterval !== null) {
                    window.clearInterval(state.cookingElapsedInterval);
                }
                state.cookingElapsedInterval = window.setInterval(() => {
                    // Stop ticking when no active step panels remain
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
                root.appendChild(header);
            }
        }
        root.appendChild(renderStep(step));
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
// On unlock it briefly flashes a "ready" style before settling normally.
function applyLock(panel, step) {
    const waitForIds = step.waitForIds;
    if (!waitForIds || waitForIds.length === 0)
        return;
    const appEl = document.getElementById('app');
    if (!appEl)
        return;
    // Timer panels stay in the DOM after finishing (as completed/skipped cards)
    // so we can't rely on element absence alone — also treat completed/skipped as done.
    const isUnlocked = () => waitForIds.every(id => {
        const el = document.getElementById(`step-${id}`);
        return !el || el.classList.contains('completed') || el.classList.contains('skipped');
    });
    // Apply locked appearance immediately — don't check isUnlocked() yet
    // because waited-on panels may not be in the DOM at this point
    // (renderStep builds panels before they're appended to #app).
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
        setTimeout(() => panel.classList.remove('step-unlocked'), 800);
    };
    const observer = new MutationObserver(unlock);
    observer.observe(appEl, { childList: true, subtree: true });
    // Defer the initial check until after the full render pass has
    // appended all panels to the DOM — use setTimeout 0 for this.
    setTimeout(unlock, 0);
}
// ============================================================
// STEP RENDERING
// ============================================================
function renderStep(step, onDone) {
    const panel = createPanel();
    panel.id = `step-${step.id}`;
    // ── Text / note step ─────────────────────────────────────
    if (step.type === 'text') {
        panel.textContent = step.text;
        panel.classList.add('text-step');
        panel.addEventListener('click', () => {
            panel.remove();
            onDone?.();
        });
        return panel;
    }
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
            // Inherit the container's waitForIds so child ingredient
            // panels are individually locked — tapping an ingredient
            // inside a locked container is silently ignored.
            if (step.waitForIds && !child.waitForIds) {
                child.waitForIds = step.waitForIds;
            }
            const childPanel = renderStep(child, checkDone);
            childWrap.appendChild(childPanel);
        });
        // Lock the whole container if needed
        applyLock(panel, step);
        return panel;
    }
    // ── Timer step ───────────────────────────────────────────
    panel.textContent = step.text;
    if (step.type === 'timer') {
        let clickCount = 0;
        let clickTimer = 0;
        panel.addEventListener('click', () => {
            // Ignore taps while locked
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

.panel.text-step {
    border-color: #333;
    color: #aaa;
    font-style: italic;
    font-size: 18px;
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
    align-items: baseline;
    gap: 12px;
    margin-bottom: 4px;
}

.recipe-title-row h2 { margin: 0; }

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

`;
// ============================================================
// BOOTSTRAP
// ============================================================
function bootstrap() {
    document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);
    document.body.innerHTML = `<div id="app"></div>`;
    const unlockAudio = () => {
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
        }).catch(() => { });
        document.removeEventListener('click', unlockAudio);
    };
    document.addEventListener('click', unlockAudio);
    render();
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
    return (quantity = 0, unit = u.none) => ({ name, quantity, unit, ...defaults });
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
        antiOxidantBerryBlend: 'Anti-Oxidant Berry Blend',
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
        macadamiaNutMilk: '',
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
        abbotPeaItalianSausage: 'Abbot Pea Italian Sausage',
        lentilSpaghetti: 'Lentil Spaghetti',
        spaghettiSauce: '',
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
    createRecipe('blueprint-smoothie', 'Blueprint Smoothie', [
        e.bulletMixer().add([
            i.macadamiaNutMilk(1, u.cup),
            i.banana(1, u.unit),
            i.macadamiaNut(0.25, u.cup),
            i.cherry(3, u.unit),
            i.antiOxidantBerryBlend(0.5, u.cup),
            i.cocoaNibs(1, u.tsp),
            i.hempSeed(1, u.tbsp),
            i.vanillaExtract(0.25, u.tsp),
            i.chiaSeed(1, u.tsp),
            i.lemonJuice(0.5, u.unit),
            i.celery(1, u.unit),
        ]),
        e.bulletMixer().mix(),
        e.bulletMixer().add([i.spinach(1, u.handful), i.kale(1, u.handful)]),
        Timer.set(30, 's', 'Let mixer settle so liquid goes down'),
        Timer.end(),
        e.bulletMixer().mix(),
        text.set(['Garnish with strawberry and mint']),
    ]),
    createRecipe('scrambled-eggs', 'Scrambled Eggs', [
        e.bowl().add([i.egg(3, u.unit), i.milk(0.25, u.cup)]),
        e.bowl().mix(),
        e.pan().cook('Cook eggs in pan', time.minutes(5)),
        instruction('Serve immediately'),
        cleanup('bowl'),
        cleanup('pan'),
    ]),
]);
registerGroup('Quick', [
    createRecipe('toast', 'Toast', [
        e.toasterOven().preheat(350),
        timerStep('Toast bread', time.minutes(3)),
        cleanup('toaster oven'),
    ]),
]);
registerGroup('Dinner', [
    createRecipe('abbot-pea-protein-spaghetti', 'Abbot Pea Protein Spaghetti', [
        // Pot lane
        e.pot().add([i.water(30, u.ounce)]),
        e.pot().cook('Bring water to boil', time.minutes(6), 9),
        // Pan lane — free to start in parallel, no lock needed
        e.pan().add([i.avocadoOil(1, u.spray), i.abbotPeaItalianSausage(1, u.bag)]),
        e.pan().cook('Cook sausage', time.minutes(5), 5),
        // Pot lane resumes — will be auto-locked until boil timer clears
        e.pot().add([
            i.avocadoOil(1, u.spray),
            [i.lentilSpaghetti(8, u.ounce), 'break into 3 even sections first'],
        ]),
        // Pan lane continues freely — not locked because the boil timer
        // started BEFORE the pan's own "Cook sausage" timer
        e.pan().cook('Continue cooking sausage', time.minutes(10), 7),
        // Pot lane — auto-locked until pan timer clears
        e.pot().cook('Cook spaghetti (first half)', time.minutes(7), 7),
        e.pot().stir(),
        e.pot().cook('Cook spaghetti (second half)', time.minutes(7), 7),
        // Pan lane — auto-locked until pot timer clears
        e.pan().add([i.spaghettiSauce(1, u.bag)]),
        e.pan().cook('Simmer sauce with sausage', time.minutes(5), 7),
    ]),
]);
// ============================================================
// START APP
// ============================================================
document.addEventListener('DOMContentLoaded', bootstrap);
