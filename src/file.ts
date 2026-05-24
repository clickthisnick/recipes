// ============================================================
// RECIPE SYSTEM
// Single-file architecture optimized for readability and AI context
// ============================================================

// ============================================================
// TYPES
// ============================================================

export type StepType = 'instruction' | 'timer' | 'cleanup' | 'text';
export type Screen   = 'select' | 'shopping' | 'cooking';

export interface Unit {
    name: string;
    plural?: string;
}

export interface StoreProduct {
    price: number;
    quantity: number;
    quantityUnit: Unit;
    link: string;
    organic?: boolean;
    discount?: Record<string, number>;
}

// Branded so only ingredientFactory can produce valid Ingredient values.
// Plain object literals like { name: 'egg', quantity: 3 } will be rejected
// by tsc — every ingredient must be registered in `items`.
declare const __ingredient: unique symbol;

export interface Ingredient {
    readonly [__ingredient]: true;
    name: string;
    quantity?: number;
    unit?: Unit;
    perishableDays?: number;
    nutrition?: Record<string, {
        servings?: number;
        servingSize?: number;
        calories?: number;
        sodium?: number;
        sugar?: number;
        protein?: number;
    }>;
    purchaseLinks?: Record<string, Record<string, StoreProduct[]>>;
    isMeatProduct?: boolean;
}

export interface Step {
    id: number;
    type: StepType;
    text: string;
    durationSeconds?: number;
    equipment?: string[];
    ingredients?: Ingredient[];
    children?: Step[];
}

export interface Recipe {
    id: string;
    name: string;
    group?: string;
    steps: Step[];
}

// ============================================================
// GLOBAL STATE
// ============================================================

const state = {
    recipes:           new Map<string, Recipe>(),
    selectedRecipeIds: [] as string[],
    favoriteRecipeIds: [] as string[],
    timers:            new Map<number, number>(),
    screen:            'select' as Screen,
    searchQuery:       '',
};

// ============================================================
// ID HELPERS
// ============================================================

let nextStepId = 1;
function createId(): number { return nextStepId++; }

// ============================================================
// TIME HELPERS
// ============================================================

export const time = {
    seconds: (v: number): number => v,
    minutes: (v: number): number => v * 60,
    hours:   (v: number): number => v * 3600,
};

// ============================================================
// UNITS
// ============================================================

export const u = {
    none:       { name: '' },
    cup:        { name: 'cup',    plural: 'cups' },
    tbsp:       { name: 'tbsp' },
    tsp:        { name: 'tsp' },
    ounce:      { name: 'ounce', plural: 'ounces' },
    pound:      { name: 'pound', plural: 'pounds' },
    fluidOunce: { name: 'fl oz', plural: 'fl oz' },
    unit:       { name: 'unit' },
    handful:    { name: 'handful' },
    spray:      { name: 'spray' },
    bag:        { name: 'bag' },
};

// ============================================================
// FORMATTERS
// ============================================================

function pluralize(word: string, count: number): string {
    return count === 1 ? word : `${word}s`;
}

function formatQuantity(quantity: number): string {
    const fractions: Record<number, string> = {
        0.125: '⅛', 0.25: '¼', 0.333: '⅓', 0.5: '½', 0.75: '¾',
    };
    const whole   = Math.floor(quantity);
    const decimal = Number((quantity - whole).toFixed(3));
    const fraction = Object.entries(fractions).find(
        ([v]) => Math.abs(decimal - Number(v)) < 0.01
    )?.[1];
    if (!fraction) return String(quantity);
    return `${whole || ''}${fraction}`;
}

function formatIngredient(ingredient: Ingredient): string {
    const { quantity, unit, name } = ingredient;
    if (!unit || !unit.name) return name;
    if (unit.name === 'unit') return `${formatQuantity(quantity ?? 0)} ${pluralize(name, quantity ?? 0)}`;
    const unitText = quantity === 1
        ? unit.name
        : unit.plural || pluralize(unit.name, quantity ?? 0);
    return `${formatQuantity(quantity ?? 0)} ${unitText} ${name}`;
}

// ============================================================
// STEP FACTORIES
// ============================================================

function createStep(input: Partial<Step> & { type: StepType; text: string }): Step {
    return { id: createId(), equipment: [], ingredients: [], children: [], ...input };
}

export function instruction(text: string, opts: Partial<Step> = {}): Step {
    return createStep({ type: 'instruction', text, ...opts });
}

// Note step — renders as dimmed italic, dismissable by tap
export const text = {
    set: (lines: string[]): Step =>
        createStep({ type: 'text', text: lines.join('\n') }),
};

export function timerStep(
    label: string,
    durationSeconds: number,
    opts: Partial<Step> = {}
): Step {
    return createStep({ type: 'timer', text: label, durationSeconds, ...opts });
}

// Two-part timer: Timer.set(...) opens it, Timer.end() closes
// (Both produce Step values — Timer.end() is a no-op marker step
//  that the renderer skips; the pair reads naturally in DSL.)
export const Timer = {
    set: (amount: number, unit: 's' | 'm' | 'h', label: string): Step => {
        const seconds = unit === 's' ? amount : unit === 'm' ? amount * 60 : amount * 3600;
        return createStep({ type: 'timer', text: label, durationSeconds: seconds });
    },
    end: (): Step => createStep({ type: 'text', text: '' }),
};

export function cleanup(equipmentName: string): Step {
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
    constructor(public name: string) {}

    preheat(temperature: number): Step {
        return timerStep(`Preheat ${this.name} to ${temperature}°`, time.minutes(15), {
            equipment: [this.name],
        });
    }

    cook(label: string, durationSeconds: number): Step {
        return timerStep(label, durationSeconds, { equipment: [this.name] });
    }

    add(ingredients: Ingredient[]): Step {
        // Each ingredient becomes its own child step.
        // The container shows the equipment name and disappears once
        // all children have been checked off.
        const children = ingredients.map((ing) =>
            createStep({
                type: 'instruction',
                text: formatIngredient(ing),
                ingredients: [ing],
                equipment: [this.name],
            })
        );
        return createStep({
            type: 'instruction',
            text: `Add to ${this.name}`,
            equipment: [this.name],
            ingredients,
            children,
        });
    }

    stir(): Step { return instruction(`Stir ${this.name}`, { equipment: [this.name] }); }
    mix():  Step { return instruction(`Mix ${this.name}`,  { equipment: [this.name] }); }
}

export const e = {
    bowl:         () => new Equipment('bowl'),
    pan:          () => new Equipment('pan'),
    pot:          () => new Equipment('pot'),
    oven:         () => new Equipment('oven'),
    toasterOven:  () => new Equipment('toaster oven'),
    instantPot:   () => new Equipment('instant pot'),
    bulletMixer:  () => new Equipment('bullet mixer'),
    knife:        () => new Equipment('knife'),
    cuttingBoard: () => new Equipment('cutting board'),
};

// ============================================================
// RECIPE REGISTRATION
// ============================================================

export function createRecipe(id: string, name: string, steps: Step[], group?: string): Recipe {
    return { id, name, steps, group };
}

export function registerRecipe(recipe: Recipe): void {
    state.recipes.set(recipe.id, recipe);
}

// Register multiple variations under a shared group name
export function registerGroup(group: string, recipes: Recipe[]): void {
    recipes.forEach((recipe) => registerRecipe({ ...recipe, group }));
}

export function getSelectedRecipes(): Recipe[] {
    return state.selectedRecipeIds
        .map((id) => state.recipes.get(id))
        .filter(Boolean) as Recipe[];
}

function getFilteredRecipes(): Recipe[] {
    const q   = state.searchQuery.toLowerCase();
    const all = [...state.recipes.values()];
    const matched = q ? all.filter((r) => r.name.toLowerCase().includes(q)) : all;

    return matched.sort((a, b) => {
        const aFav = state.favoriteRecipeIds.includes(a.id) ? 0 : 1;
        const bFav = state.favoriteRecipeIds.includes(b.id) ? 0 : 1;
        if (aFav !== bFav) return aFav - bFav;
        return a.name.localeCompare(b.name);
    });
}

// ============================================================
// SHOPPING LIST
// ============================================================

function buildShoppingList(): Ingredient[] {
    const combined = new Map<string, Ingredient>();

    getSelectedRecipes().forEach((recipe) => {
        recipe.steps.forEach((step) => {
            step.ingredients?.forEach((ingredient) => {
                const key      = `${ingredient.name}-${ingredient.unit?.name ?? ''}`;
                const existing = combined.get(key);
                if (!existing) { combined.set(key, { ...ingredient }); return; }
                (existing as any).quantity = (existing.quantity ?? 0) + (ingredient.quantity ?? 0);
            });
        });
    });

    return [...combined.values()];
}

// ============================================================
// DOM HELPERS
// ============================================================

function getElement<T extends HTMLElement>(id: string): T {
    const el = document.getElementById(id);
    if (!el) throw new Error(`Missing element: ${id}`);
    return el as T;
}

function clear(el: HTMLElement): void { el.innerHTML = ''; }

function createButton(label: string, onClick: () => void): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.addEventListener('click', onClick);
    return btn;
}

function createPanel(): HTMLDivElement {
    const panel = document.createElement('div');
    panel.className = 'panel';
    return panel;
}

// ============================================================
// SCREEN: SELECT
// ============================================================

function renderSelectScreen(): void {
    const root = getElement<HTMLDivElement>('app');
    clear(root);

    const searchInput = document.createElement('input');
    searchInput.type        = 'text';
    searchInput.placeholder = 'Search recipes...';
    searchInput.value       = state.searchQuery;
    searchInput.className   = 'search-input';
    searchInput.addEventListener('input', () => {
        state.searchQuery = searchInput.value;
        renderRecipeList();
    });
    root.appendChild(searchInput);

    const recipeList = document.createElement('div');
    recipeList.id = 'recipe-list';
    root.appendChild(recipeList);

    const actions = document.createElement('div');
    actions.id        = 'actions';
    actions.className = 'actions';
    root.appendChild(actions);

    renderRecipeList();
    updateActionButtons();
}

function renderRecipeList(): void {
    const root = getElement<HTMLDivElement>('recipe-list');
    clear(root);

    const recipes = getFilteredRecipes();

    if (recipes.length === 0) {
        const empty = document.createElement('p');
        empty.textContent = 'No recipes found.';
        empty.className   = 'empty';
        root.appendChild(empty);
        return;
    }

    // Group recipes under their group heading
    const groups = new Map<string, Recipe[]>();
    recipes.forEach((recipe) => {
        const key = recipe.group ?? '';
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(recipe);
    });

    groups.forEach((groupRecipes, groupName) => {
        if (groupName) {
            const heading = document.createElement('h3');
            heading.textContent = groupName;
            heading.className   = 'group-heading';
            root.appendChild(heading);
        }

        groupRecipes.forEach((recipe) => {
            const row = document.createElement('div');
            row.className = 'recipe-row';

            const star   = document.createElement('button');
            const isFav  = state.favoriteRecipeIds.includes(recipe.id);
            star.className   = 'star-btn';
            star.textContent = isFav ? '★' : '☆';
            star.classList.toggle('starred', isFav);
            star.addEventListener('click', (ev) => {
                ev.stopPropagation();
                if (state.favoriteRecipeIds.includes(recipe.id)) {
                    state.favoriteRecipeIds = state.favoriteRecipeIds.filter((id) => id !== recipe.id);
                } else {
                    state.favoriteRecipeIds.push(recipe.id);
                }
                renderRecipeList();
            });

            const btn        = document.createElement('button');
            btn.className    = 'recipe-btn';
            btn.textContent  = recipe.name;
            const isSelected = state.selectedRecipeIds.includes(recipe.id);
            btn.classList.toggle('selected', isSelected);
            btn.addEventListener('click', () => {
                if (state.selectedRecipeIds.includes(recipe.id)) {
                    state.selectedRecipeIds = state.selectedRecipeIds.filter((id) => id !== recipe.id);
                    btn.classList.remove('selected');
                } else {
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

function updateActionButtons(): void {
    const actions = getElement<HTMLDivElement>('actions');
    clear(actions);
    if (state.selectedRecipeIds.length === 0) return;

    const shopBtn  = createButton('🛒 Go Shopping',   () => navigateTo('shopping'));
    const cookBtn  = createButton('🍳 Start Cooking',  () => navigateTo('cooking'));
    shopBtn.className = 'action-btn';
    cookBtn.className = 'action-btn';
    actions.appendChild(shopBtn);
    actions.appendChild(cookBtn);
}

// ============================================================
// SCREEN: SHOPPING
// ============================================================

function renderShoppingScreen(): void {
    const root = getElement<HTMLDivElement>('app');
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
                        const a      = document.createElement('a');
                        a.href       = product.link;
                        a.target     = '_blank';
                        a.className  = 'purchase-link';
                        a.textContent = `${store}${variant !== 'standard' ? ` (${variant})` : ''} — $${product.price} / ${product.quantity} ${product.quantityUnit.name}`;
                        links.appendChild(a);
                    });
                });
            });

            panel.appendChild(links);
        }

        panel.addEventListener('click', (ev) => {
            if ((ev.target as HTMLElement).tagName === 'A') return;
            panel.classList.toggle('completed');
        });

        root.appendChild(panel);
    });

    root.appendChild(createStartOverButton());
}

// ============================================================
// SCREEN: COOKING
// ============================================================

function renderCookingScreen(): void {
    const root = getElement<HTMLDivElement>('app');
    clear(root);

    getSelectedRecipes().forEach((recipe) => {
        const title = document.createElement('h2');
        title.textContent = recipe.name;
        root.appendChild(title);

        recipe.steps.forEach((step) => {
            // Timer.end() produces an empty text step — skip rendering it
            if (step.type === 'text' && step.text === '') return;
            root.appendChild(renderStep(step));
        });
    });

    root.appendChild(createStartOverButton());
}

function renderStep(step: Step, onDone?: () => void): HTMLElement {
    const panel = createPanel();
    panel.id    = `step-${step.id}`;

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
        header.className   = 'container-header';
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
            const childPanel = renderStep(child, checkDone);
            childWrap.appendChild(childPanel);
        });

        return panel;
    }

    // ── Timer step ───────────────────────────────────────────
    panel.textContent = step.text;

    if (step.type === 'timer') {
        let clickCount = 0;
        let clickTimer = 0;

        panel.addEventListener('click', () => {
            if (panel.classList.contains('completed') || panel.classList.contains('skipped')) return;

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

        return panel;
    }

    // ── Instruction / cleanup step ───────────────────────────
    panel.addEventListener('click', () => {
        panel.classList.add('done-child');
        panel.remove();
        onDone?.();
    });

    return panel;
}

function completeTimer(step: Step, panel: HTMLElement, onDone?: () => void): void {
    panel.classList.remove('timer');
    panel.classList.add('completed');
    const completedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    panel.textContent = `✓ ${step.text} — completed at ${completedAt}`;
    onDone?.();
}

function skipTimer(step: Step, panel: HTMLElement, onDone?: () => void): void {
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

function createStartOverButton(): HTMLButtonElement {
    const btn = createButton('↩ Start Over', () => {
        state.timers.forEach((id) => window.clearInterval(id));
        state.timers.clear();
        state.selectedRecipeIds = [];
        state.searchQuery       = '';
        navigateTo('select');
    });
    btn.className = 'start-over-btn';
    return btn;
}

// ============================================================
// NAVIGATION
// ============================================================

function navigateTo(screen: Screen): void {
    state.screen = screen;
    render();
}

// ============================================================
// TIMERS
// ============================================================

function startTimer(step: Step, panel: HTMLElement, onDone?: () => void): void {
    if (!step.durationSeconds || state.timers.has(step.id)) return;

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
function playSound(): void { audio.currentTime = 0; audio.play().catch(console.error); }

// ============================================================
// RENDER
// ============================================================

function render(): void {
    switch (state.screen) {
        case 'select':   return renderSelectScreen();
        case 'shopping': return renderShoppingScreen();
        case 'cooking':  return renderCookingScreen();
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
`;

// ============================================================
// BOOTSTRAP
// ============================================================

function bootstrap(): void {
    document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);
    document.body.innerHTML = `<div id="app"></div>`;

    // Browsers block audio until the user has interacted with the page.
    // On the first tap anywhere, silently play and immediately pause the
    // audio so the context is unlocked before a timer actually fires.
    const unlockAudio = () => {
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
        }).catch(() => {});
        document.removeEventListener('click', unlockAudio);
    };
    document.addEventListener('click', unlockAudio);

    render();
}

// ============================================================
// STORES
// ============================================================

export const stores = {
    amazon:      'Amazon',
    amazonFresh: 'Amazon Fresh',
    wholeFoods:  'Whole Foods',
};

// ============================================================
// INGREDIENT FACTORY
// ============================================================

// The cast to `as Ingredient` is the only place the brand is attached.
// All other code receives a properly typed Ingredient and cannot
// construct one without going through this factory.
function ingredientFactory(name: string, defaults: Partial<Omit<Ingredient, typeof __ingredient>> = {}) {
    return (quantity = 0, unit: Unit = u.none): Ingredient =>
        ({ name, quantity, unit, ...defaults }) as unknown as Ingredient;
}

// Converts a camelCase key to a Title Case display name.
// e.g. 'chiaSeed' -> 'Chia Seed', 'frozenBlueberry' -> 'Frozen Blueberry'
function keyToName(key: string): string {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (c) => c.toUpperCase());
}

// Generates typed ingredient factories from a compact name map.
// Pass '' to derive the display name from the key automatically via keyToName.
// Only supply an explicit name when the auto-generated one is wrong
// (e.g. different casing, hyphens, proper nouns).
// IntelliSense works: i.banana autocompletes and is callable as (quantity, unit).
function simpleIngredients<T extends Record<string, string>>(map: T): {
    [K in keyof T]: (quantity?: number, unit?: Unit) => Ingredient;
} {
    return Object.fromEntries(
        Object.entries(map).map(([key, name]) => [
            key,
            ingredientFactory(name || keyToName(key)),
        ])
    ) as any;
}

// ============================================================
// ITEMS
// ============================================================

export const i = {
    ...simpleIngredients({
        apple:                    '',
        antiOxidantBerryBlend:    'Anti-Oxidant Berry Blend', // hyphen can't be derived
        frozenBerries:            '',
        cocoaFlavanols:           '',
        chiaSeed:                 '',
        hempSeed:                 '',
        wheatGrassPowder:         '',
        creatine:                 '',
        chlorellaPowder:          '',
        aminoComplex:             '',
        acaiFrozenMix:            '',
        blueprintBlueberryWalnut: '',
        blueprintCacao:           '',
        banana:                   '',
        frozenStrawberry:         '',
        cocoaNibs:                '',
        frozenCauliflower:        '',
        frozenBroccoli:           '',
        frozenBlueberry:          '',
        cherry:                   '',
        blueprintNuttyPudding:    '',
        macadamiaNutMilk:         '',
        vanillaExtract:           '',
        lemonJuice:               '',
        celery:                   '',
        spinach:                  '',
        kale:                     '',
        egg:                      '',
        milk:                     '',
        bread:                    '',
        pomegranateSeeds:         '',
        water:                    '',
        avocadoOil:               '',
        abbotPeaItalianSausage:   '',
        lentilSpaghetti:          '',
        spaghettiSauce:           '',
    }),

    peanutButter: ingredientFactory('Peanut Butter', {
        purchaseLinks: {
            [stores.wholeFoods]: {
                organic: [{ price: 4.19,  quantity: 16, quantityUnit: u.ounce, organic: true,  link: 'https://www.amazon.com/365-Everyday-Value-Organic-Unsweetened/dp/B074H61LYV/ref=sr_1_9_0o_wf' }],
                creamy:  [{ price: 2.49,  quantity: 16, quantityUnit: u.ounce, organic: false, link: 'https://www.amazon.com/365-Everyday-Value-Peanut-Butter/dp/B074H57SPT/ref=sr_1_7_0o_wf' }],
                crunchy: [{ price: 4.99,  quantity: 36, quantityUnit: u.ounce, organic: false, link: 'https://www.amazon.com/Everyday-Value-Peanut-Butter-Crunchy/dp/B074Y2V88X/ref=sr_1_16_0o_wf' }],
            },
            [stores.amazon]: {
                creamy:  [{ price: 4.69,  quantity: 40, quantityUnit: u.ounce, organic: false, link: 'https://www.amazon.com/dp/B07KWGSCW2/ref=sns_myd_detail_page', discount: { subscribe5Products: 5 } }],
            },
        },
    }),

    pittedDates: ingredientFactory('Pitted Dates', {
        purchaseLinks: {
            [stores.wholeFoods]: {
                standard: [{ price: 3.99,  quantity: 8,   quantityUnit: u.ounce, organic: false, link: 'https://www.amazon.com/365-Everyday-Value-Dates-Pitted/dp/B074VDMNH7/ref=sr_1_5_0o_wf' }],
            },
            [stores.amazon]: {
                organic:  [{ price: 16.59, quantity: 2.5, quantityUnit: u.pound, organic: true,  link: 'https://www.amazon.com/ORGANIC-Pitted-Dates-Deglet-Nour/dp/B0872L82ZK/ref=sr_1_10', discount: { subscribe5Products: 5 } }],
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
                organic: [{ price: 10.79, quantity: 8,  quantityUnit: u.ounce, organic: true, link: 'https://www.wholefoodsmarket.com/product/365-by-whole-foods-market-organic-macadamia-nuts-8-oz-b086hk83yf' }],
            },
        },
    }),

    strawberry: ingredientFactory('Strawberry', {
        purchaseLinks: {
            [stores.wholeFoods]: {
                organic: [{ price: 6.69,  quantity: 32, quantityUnit: u.ounce, organic: true, link: 'https://www.wholefoodsmarket.com/product/365-by-whole-foods-market-365-whole-foods-market-organic-whole-strawberries-b09gcp3jng' }],
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
            i.macadamiaNutMilk(1,    u.cup),
            i.banana(1,              u.unit),
            i.macadamiaNut(0.25,     u.cup),
            i.cherry(3,              u.unit),
            i.antiOxidantBerryBlend(0.5, u.cup),
            i.cocoaNibs(1,           u.tsp),
            i.hempSeed(1,            u.tbsp),
            i.vanillaExtract(0.25,   u.tsp),
            i.chiaSeed(1,            u.tsp),
            i.lemonJuice(0.5,        u.unit),
            i.celery(1,              u.unit),
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
        // Start pot of water
        e.pot().add([i.water(30, u.ounce)]),
        e.pot().cook('Bring water to boil', time.minutes(6)),

        // Brown sausage in pan
        e.pan().add([i.avocadoOil(1, u.spray), i.abbotPeaItalianSausage(1, u.bag)]),
        e.pan().cook('Cook sausage', time.minutes(5)),

        // Add spaghetti once water is boiling
        text.set(['Break lentil spaghetti (8 oz) into 3 even sections and add to pot']),

        // Continue cooking both
        e.pan().cook('Continue cooking sausage', time.minutes(10)),
        e.pot().cook('Cook spaghetti (first half)', time.minutes(7)),
        e.pot().stir(),
        e.pot().cook('Cook spaghetti (second half)', time.minutes(7)),

        // Add sauce to pan
        e.pan().add([i.spaghettiSauce(1, u.bag)]),
        e.pan().cook('Simmer sauce with sausage', time.minutes(5)),
    ]),
]);

// ============================================================
// START APP
// ============================================================

document.addEventListener('DOMContentLoaded', bootstrap);
