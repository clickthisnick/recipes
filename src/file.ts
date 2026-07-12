// ============================================================
// RECIPE SYSTEM
// Single-file architecture optimized for readability and AI context
// ============================================================

// ============================================================
// TYPES
// ============================================================

export type StepType = 'instruction' | 'timer' | 'cleanup' | 'info' | 'gate';
export type Screen   = 'select' | 'shopping' | 'cooking' | 'nutrition' | 'add-ingredient' | 'prep' | 'plan';

export interface Unit {
    name: string;
    plural?: string;
}

// A nutrition label, keyed by unit name (e.g. 'cup', 'tsp'). Values are per
// serving; servingSize is in the keyed unit.
export type NutritionLabel = Record<string, {
    servings: number;
    servingSize: number;
    calories: number;
    fat: number;
    saturatedFat: number;
    transFat: number;
    cholesterol: number;
    carbs: number;
    sodium: number;
    sugar: number;
    protein: number;
    fiber: number;
}>;

// Amazon's Subscribe & Save auto-delivery discount, expressed as eligibility for each
// percent tier rather than a hardcoded price — the discounted price is always a percent
// off whatever this product's current price is, so it can't go stale as price changes.
// Only applies when bought directly from Amazon (checked against product.store at the
// call site); Whole Foods and other retailers don't offer it even for the same item.
export interface Discount {
    subscribeAndSave5?: boolean;
    subscribeAndSave10?: boolean;
    subscribeAndSave15?: boolean;
    // Amazon's separate "5+ subscriptions in one delivery" bonus; value is the flat
    // percent bonus, unrelated to the subscribeAndSave tiers above.
    subscribe5Products?: number;
}

export function subscribeAndSavePercent(discount?: Discount): number | undefined {
    if (!discount) return undefined;
    if (discount.subscribeAndSave15) return 15;
    if (discount.subscribeAndSave10) return 10;
    if (discount.subscribeAndSave5) return 5;
    return undefined;
}

// Where/how a Product can be bought — retailer-specific and non-exclusive: the same
// physical product can have several of these (e.g. the same jar sold on Amazon AND on
// the brand's own site, at different prices with different links). Nutrition/brand/size
// stay on Product since those describe the item itself, not where you buy it.
export interface Listing {
    store?: string;
    link?: string;
    price?: number;
    discount?: Discount;
}

export interface Product {
    brand: string;
    variant?: string;
    size?: number;
    sizeUnit?: Unit;
    organic?: boolean;
    nutrition?: NutritionLabel;
    listings?: Listing[];
    // Most products are bought as a discrete, countable container (a can, a bag,
    // a bunch) — size/sizeUnit describe that one container, so "have N of them"
    // tracking on the shopping screen is on by default, labeled with this word
    // when set (falls back to the generic "package" otherwise).
    packageUnit?: Unit;
    // Set for products priced per unit weight/volume with no real fixed-size
    // container to count (e.g. cabbage sold loose per lb) — disables package
    // tracking so the shopping screen falls back to entering the recipe unit
    // (cups, lbs, ...) directly instead of a fake "package" count.
    bulk?: boolean;
}

// The listing (of the selected product) actually used for cost/price display — the
// cheapest one, since that's what a shopper would realistically buy. Listings with no
// price are ignored, and returns undefined only if none of them have a price at all.
export function cheapestListing(product: Product): Listing | undefined {
    return (product.listings ?? []).reduce<Listing | undefined>((cheapest, listing) => {
        if (listing.price === undefined) return cheapest;
        if (cheapest === undefined || cheapest.price === undefined || listing.price < cheapest.price) return listing;
        return cheapest;
    }, undefined);
}

declare const __ingredient: unique symbol;

// Substance-specific unit conversions (e.g. volume → weight via density).
// Keyed by the "from" unit name; value is the target unit and multiplication factor.
// Used after physical CONVERSION_FACTORS fail, before declaring uncomputable.
export type IngredientConversions = Record<string, { to: Unit; factor: number }>;

export interface Ingredient {
    readonly [__ingredient]: true;
    name: string;
    quantity?: number;
    unit?: Unit;
    perishableDays?: number;
    nutrition?: NutritionLabel;
    products?: Product[];
    defaultBrand?: string;
    isMeatProduct?: boolean;
    requiresDateLabel?: boolean;
    conversions?: IngredientConversions;
    rename(newName: string): void;
}

export interface Step {
    id: number;
    type: StepType;
    text: string;
    durationSeconds?: number;
    equipment?: string[];
    ingredients?: Ingredient[];
    children?: Step[];
    recipeId?: string;
    waitForIds?: number[];
    prep?: boolean;
    prepOnly?: boolean;
    linkRecipeId?: string;  // info steps only: renders a clickable link to another recipe
    waitFor(...steps: Step[]): this;
}

export interface Recipe {
    id: string;
    name: string;
    group?: string;
    steps: Step[];
    estimatedMinutes?: number;
    adhoc?: boolean;
    portable?: boolean;       // can be eaten away from home (no cooking needed)
    planMinutes?: number;     // eating time on the day (assumes prepped if applicable)
    prepMinutes?: number;     // advance prep/cook time (can be done ahead of eating)
    perishableDays?: number;  // days the prepped item keeps in the fridge
    sortOrder?: number;       // overrides alphabetical sort among recipes that both define it
    hidden?: boolean;         // excluded from the default recipe list; still reachable by search or "Show hidden"
}

export interface PlanBlock {
    id: string;
    start: string;  // "HH:MM" 24h
    end: string;
    type: 'home' | 'away' | 'portable';
}

export interface PlanConfig {
    blocks: PlanBlock[];
    caloriesCutoff: string;  // "HH:MM" — prefer placing all eating before this time
}

const PLAN_CONFIG_KEY = 'recipe-plan-config';

const DEFAULT_PLAN_CONFIG: PlanConfig = {
    blocks: [
        { id: 'b1', start: '07:00', end: '08:00', type: 'home' },
        { id: 'b2', start: '08:00', end: '12:00', type: 'away' },
        { id: 'b3', start: '12:00', end: '12:30', type: 'portable' },
        { id: 'b4', start: '12:30', end: '17:00', type: 'away' },
        { id: 'b5', start: '17:00', end: '22:00', type: 'home' },
    ],
    caloriesCutoff: '14:00',
};

function loadPlanConfig(): PlanConfig {
    try {
        const raw = localStorage.getItem(PLAN_CONFIG_KEY);
        if (raw) return JSON.parse(raw) as PlanConfig;
    } catch {}
    return JSON.parse(JSON.stringify(DEFAULT_PLAN_CONFIG));
}

function savePlanConfig(cfg: PlanConfig): void {
    localStorage.setItem(PLAN_CONFIG_KEY, JSON.stringify(cfg));
}

export interface RecipeBundle {
    id: string;
    name: string;
    recipeIds: string[];
}

// ============================================================
// GLOBAL STATE
// ============================================================

const SHOW_HIDDEN_RECIPES_KEY = 'recipe-show-hidden';

const state = {
    recipes:           new Map<string, Recipe>(),
    bundles:           new Map<string, RecipeBundle>(),
    selectedRecipeIds: [] as string[],
    timers:            new Map<number, number>(),
    ringingAlarms:     new Map<number, number>(),
    gateRunCounts:     new Map<number, number>(),
    screen:            'select' as Screen,
    searchQuery:       '',
    cookingPlanSteps:  [] as Step[],
    cookingStartedAt:  null as number | null,
    cookingElapsedInterval: null as number | null,
    audioUnlocked:     false,
    showHidden:        localStorage.getItem(SHOW_HIDDEN_RECIPES_KEY) === 'true',
};

function setShowHidden(value: boolean): void {
    state.showHidden = value;
    localStorage.setItem(SHOW_HIDDEN_RECIPES_KEY, String(value));
}

const macroTargets = { calories: 2550, protein: 147, fat: 114, saturatedFat: 20, transFat: 0, carbs: 234, sodium: 2300, fiber: 38 };

const nutritionExclusions = new Map<string, Set<Ingredient>>();
// Recipes explicitly deselected from nutrition totals. Absence = counted (selected by default).
const nutritionRecipeExclusions = new Set<string>();
const nutritionExpanded   = new Set<string>();
let nutritionAddRecipeQuery = '';
function getNutritionExcluded(recipeId: string): Set<Ingredient> {
    if (!nutritionExclusions.has(recipeId)) nutritionExclusions.set(recipeId, new Set());
    return nutritionExclusions.get(recipeId)!;
}

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
    bunch:      { name: 'bunch', plural: 'bunches' },
    can:        { name: 'can' },
    package:    { name: 'package', plural: 'packages' },
    gram:       { name: 'g', plural: 'g' },
    milliliter: { name: 'ml', plural: 'ml' },
    shot:       { name: 'shot', plural: 'shots' },

};

// ============================================================
// UNIT CONVERSION
// ============================================================

const CONVERSION_FACTORS: Record<string, Record<string, number>> = {
    // Volume cluster
    [u.tsp.name]:        { [u.tsp.name]: 1,    [u.tbsp.name]: 1/3,  [u.cup.name]: 1/48, [u.fluidOunce.name]: 1/6  },
    [u.tbsp.name]:       { [u.tsp.name]: 3,    [u.tbsp.name]: 1,    [u.cup.name]: 1/16, [u.fluidOunce.name]: 1/2  },
    [u.cup.name]:        { [u.tsp.name]: 48,   [u.tbsp.name]: 16,   [u.cup.name]: 1,    [u.fluidOunce.name]: 8    },
    [u.fluidOunce.name]: { [u.tsp.name]: 6,    [u.tbsp.name]: 2,    [u.cup.name]: 1/8,  [u.fluidOunce.name]: 1    },
    // Weight cluster
    [u.ounce.name]: { [u.ounce.name]: 1,         [u.pound.name]: 1/16,       [u.gram.name]: 28.3495 },
    [u.pound.name]: { [u.ounce.name]: 16,        [u.pound.name]: 1,          [u.gram.name]: 453.592 },
    [u.gram.name]:  { [u.ounce.name]: 1/28.3495, [u.pound.name]: 1/453.592,  [u.gram.name]: 1        },
};

function convertUnits(quantity: number, from: string, to: string): number | null {
    if (from === to) return quantity;
    const factor = CONVERSION_FACTORS[from]?.[to];
    if (factor === undefined) return null;
    return quantity * factor;
}

// Extends convertUnits with ingredient-specific density conversions (e.g. unit → cup → oz).
// Recursively chains density hops until a physical conversion closes the gap, or returns null.
function convertWithDensity(
    quantity: number,
    from: string,
    to: string,
    conversions?: IngredientConversions
): number | null {
    const physical = convertUnits(quantity, from, to);
    if (physical !== null) return physical;
    if (!conversions) return null;
    const density = conversions[from];
    if (!density) return null;
    const afterDensity = quantity * density.factor;
    const intermediate = density.to.name;
    if (intermediate === to) return afterDensity;
    return convertWithDensity(afterDensity, intermediate, to, conversions);
}

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

// Same as formatIngredient but without the item name — used to describe an
// arbitrary quantity (e.g. "how much is still needed") in an ingredient's unit.
function formatQuantityUnit(quantity: number, unit?: Unit): string {
    if (!unit || !unit.name) return formatQuantity(quantity);
    const unitText = quantity === 1
        ? unit.name
        : unit.plural || pluralize(unit.name, quantity);
    return `${formatQuantity(quantity)} ${unitText}`;
}

// ============================================================
// STEP FACTORIES
// ============================================================

function createStep(input: Partial<Step> & { type: StepType; text: string }): Step {
    const step: Step = { id: createId(), equipment: [], ingredients: [], children: [], ...input } as any;
    (step as any).waitFor = function(...steps: Step[]): Step {
        for (const dep of steps) {
            step.waitForIds = [...(step.waitForIds ?? []), dep.id];
        }
        return step;
    };
    return step;
}

export function instruction(text: string, opts: Partial<Step> = {}): Step {
    return createStep({ type: 'instruction', text, ...opts });
}

export function prep(text: string, opts: Partial<Step> = {}): Step {
    return createStep({ type: 'instruction', text, prep: true, ...opts });
}

export function prepOnly(text: string, opts: Partial<Step> = {}): Step {
    return createStep({ type: 'instruction', text, prep: true, prepOnly: true, ...opts });
}

export function timerStep(
    label: string,
    durationSeconds: number,
    opts: Partial<Step> = {}
): Step {
    return createStep({ type: 'timer', text: label, durationSeconds, ...opts });
}

export const Timer = {
    set: (amount: number, unit: 's' | 'm' | 'h', label: string, opts: Partial<Step> = {}): Step => {
        const seconds = unit === 's' ? amount : unit === 'm' ? amount * 60 : amount * 3600;
        return createStep({ type: 'timer', text: label, durationSeconds: seconds, ...opts });
    },
    // Asks `question` immediately. "No" cooks for `retryAmount retryUnit` (with an alarm at
    // the end) and re-asks; "Yes" completes the step. Loops until answered "Yes".
    gate: (question: string, retryAmount: number, retryUnit: 's' | 'm' | 'h', opts: Partial<Step> = {}): Step => {
        const seconds = retryUnit === 's' ? retryAmount : retryUnit === 'm' ? retryAmount * 60 : retryAmount * 3600;
        return createStep({ type: 'gate', text: question, durationSeconds: seconds, ...opts });
    },
};

export function cleanup(equipmentName: string): Step {
    return createStep({
        type: 'cleanup',
        text: `Clean and put away ${equipmentName}`,
        equipment: [equipmentName],
    });
}

export function info(text: string, opts: Partial<Step> = {}): Step {
    return createStep({ type: 'info', text, ...opts });
}

export function generateCleanupLabels(
    ingredients: Ingredient[],
    customTexts?: Record<string, string>
): Step[] {
    return ingredients
        .filter(ing => ing.requiresDateLabel)
        .map(ing => instruction(
            customTexts?.[ing.name] ?? `Write today's date on the ${ing.name} bottle with a Sharpie`
        ));
}

// ============================================================
// EQUIPMENT
// ============================================================

class Equipment {
    constructor(public type: string, public label?: string) {}

    get name(): string { return this.label ?? this.type; }

    private contents: Ingredient[] = [];
    private nestedVessels: Equipment[] = [];
    private _result: Ingredient | null = null;

    get result(): Ingredient {
        if (!this._result) throw new Error(`${this.name}.result accessed before any mix() or combine() call`);
        return this._result;
    }

    getContents(): Ingredient[] {
        return [
            ...this.contents,
            ...this.nestedVessels.flatMap(v => v.getContents()),
        ];
    }

    private getAllEquipment(): string[] {
        return [
            this.name,
            ...this.nestedVessels.flatMap(v => [v.name, ...v.nestedVessels.map(n => n.name)]),
        ];
    }

    preheat(temperature: number): Step {
        return timerStep(`Preheat ${this.name} to ${temperature}°`, time.minutes(15), {
            equipment: [this.name],
        });
    }

    cook(label: string, durationSeconds: number, temperature?: number, extraEquipment: Equipment[] = []): Step {
        const text = temperature !== undefined ? `${label} (${temperature}°)` : label;
        const allEquipment   = [...this.getAllEquipment(), ...extraEquipment.map(eq => eq.name)];
        const allIngredients = [...this.getContents(), ...extraEquipment.flatMap(eq => eq.getContents())];
        return timerStep(text, durationSeconds, {
            equipment:   allEquipment,
            ingredients: allIngredients,
        });
    }

    add(ingredients: (Ingredient | [Ingredient, string])[], note?: string): Step {
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

    transfer(target: Equipment, ingredients: Ingredient[]): Step {
        for (const ing of ingredients) {
            const idx = this.contents.findIndex(c => c.name === ing.name);
            if (idx === -1) {
                throw new Error(
                    `transfer() from '${this.name}' to '${target.name}': ` +
                    `'${ing.name}' is not in ${this.name}. ` +
                    `Contents: [${this.contents.map(c => c.name).join(', ') || 'empty'}]`
                );
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

    broil(label: string, durationSeconds: number): Step {
        const allEquipment   = this.getAllEquipment();
        const allIngredients = this.getContents();
        return timerStep(`Broil — ${label}`, durationSeconds, {
            equipment:   allEquipment,
            ingredients: allIngredients,
        });
    }

    slice(ingredient: Ingredient): Step {
        return createStep({
            type: 'instruction',
            text: `Slice ${ingredient.name}`,
            equipment: [this.name],
            ingredients: [ingredient],
        });
    }

    spray(ingredient: Ingredient): Step {
        return createStep({
            type: 'instruction',
            text: `Spray ${ingredient.name} on ${this.name}`,
            equipment: [this.name],
            ingredients: [ingredient],
        });
    }

    flip(): Step {
        return createStep({
            type: 'instruction',
            text: `Flip contents of ${this.name}`,
            equipment: [this.name],
            ingredients: [...this.contents],
        });
    }

    place(vessel: Equipment, label?: string, durationSeconds?: number, temperature?: number): Step {
        this.nestedVessels.push(vessel);
        const allEquipment   = [this.name, vessel.name];
        const allIngredients = vessel.getContents();
        if (label && durationSeconds !== undefined) {
            const text = temperature !== undefined ? `${label} (${temperature}°)` : label;
            return timerStep(text, durationSeconds, {
                equipment:   allEquipment,
                ingredients: allIngredients,
            });
        }
        return createStep({
            type: 'instruction',
            text: `Place ${vessel.name} in ${this.name}`,
            equipment:   allEquipment,
            ingredients: allIngredients,
        });
    }

    stir(): Step { return instruction(`Stir ${this.name}`, { equipment: [this.name] }); }

    mix(resultName?: string): Step {
        const allContents = this.getContents();
        if (resultName) {
            const produced: any = { name: resultName, quantity: 1, unit: u.none };
            produced.rename = (newName: string) => { produced.name = newName; };
            produced._constituents = allContents;
            this.contents = [produced as Ingredient];
            this._result  = produced as Ingredient;
        }
        return instruction(`Mix ${this.name}`, { equipment: [this.name], ingredients: allContents });
    }

    combine(ingredients: Ingredient[], note?: string): Step {
        const allConstituents = [...this.getContents(), ...ingredients];
        const produced: any = {
            name: ingredients.map(i => i.name).join(' + '),
            quantity: ingredients[0]?.quantity ?? 1,
            unit: ingredients[0]?.unit ?? u.none,
            _constituents: allConstituents,
        };
        produced.rename = (newName: string) => { produced.name = newName; };
        this.contents = [produced as Ingredient];
        this._result  = produced as Ingredient;
        return createStep({
            type: 'instruction',
            text: `Combine ${ingredients.map(i => i.name).join(', ')} in ${this.name}${note ? ` — ${note}` : ''}`,
            equipment:   [this.name],
            ingredients: allConstituents,
        });
    }
}

class NuwaveEquipment extends Equipment {
    constructor(label?: string) { super('Nuwave pan', label); }
    preheat(temperature: number): Step {
        const duration = temperature === 325 ? time.minutes(2) : time.minutes(3);
        return timerStep(`Preheat ${this.name} to ${temperature}°`, duration, { equipment: [this.name] });
    }
}

export const e = {
    bowl:         (label?: string) => new Equipment('bowl',          label),
    pan:          (label?: string) => new Equipment('pan',           label),
    pot:          (label?: string) => new Equipment('pot',           label),
    oven:         (label?: string) => new Equipment('oven',          label),
    toasterOven:  (label?: string) => new Equipment('toaster oven',  label),
    instantPot:   (label?: string) => new Equipment('instant pot',   label),
    microwave:    (label?: string) => new Equipment('microwave',     label),
    bulletMixer:  (label?: string) => new Equipment('bullet mixer',  label),
    knife:        (label?: string) => new Equipment('knife',         label),
    cuttingBoard: (label?: string) => new Equipment('cutting board', label),
    colander:     (label?: string) => new Equipment('colander',      label),
    platter:      (label?: string) => new Equipment('platter',       label),
    kettle:       (label?: string) => new Equipment('tea kettle',    label),
    nuwavePan:    (label?: string) => new NuwaveEquipment(label),
};

// ============================================================
// RECIPE REGISTRATION
// ============================================================

function collectIngredientsWithLabel(steps: Step[]): Ingredient[] {
    const collected = new Map<Ingredient, Ingredient>();
    function walkSteps(steps: Step[]): void {
        for (const step of steps) {
            for (const ing of (step.ingredients ?? [])) {
                if (ing.requiresDateLabel && !collected.has(ing)) collected.set(ing, ing);
            }
            if (step.children) walkSteps(step.children);
        }
    }
    walkSteps(steps);
    return [...collected.values()];
}

function findLastStepIndexForIngredient(steps: Step[], targetIng: Ingredient): number {
    let lastIndex = -1;
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const isContainerOrTimer = (step.type === 'instruction' && step.children && step.children.length > 0) ||
                                   step.type === 'timer' || step.type === 'gate';
        if (isContainerOrTimer) {
            for (const ing of (step.ingredients ?? [])) {
                if (ing === targetIng) { lastIndex = i; break; }
            }
        }
    }
    return lastIndex;
}

export function createRecipe(
    id: string,
    name: string,
    steps: Step[],
    group?: string,
    estimatedMinutes?: number
): Recipe {
    steps.forEach(s => { s.recipeId = id; });
    const ingredientsToLabel = collectIngredientsWithLabel(steps);
    const stepsToInsert: { index: number; step: Step }[] = [];
    for (const ing of ingredientsToLabel) {
        const lastIndex = findLastStepIndexForIngredient(steps, ing);
        if (lastIndex !== -1) {
            const cleanupStep = generateCleanupLabels([ing])[0];
            stepsToInsert.push({ index: lastIndex, step: cleanupStep });
        }
    }
    stepsToInsert.sort((a, b) => b.index - a.index);
    for (const { index, step } of stepsToInsert) steps.splice(index + 1, 0, step);
    return { id, name, steps, group, estimatedMinutes };
}

export function registerRecipe(recipe: Recipe): void {
    state.recipes.set(recipe.id, recipe);
}

function withPlan(recipe: Recipe, opts: { planMinutes?: number; portable?: boolean; prepMinutes?: number; perishableDays?: number; sortOrder?: number; hidden?: boolean }): Recipe {
    return Object.assign(recipe, opts);
}

export function registerGroup(group: string, recipes: Recipe[]): void {
    recipes.forEach((recipe) => registerRecipe({ ...recipe, group }));
}

export function registerBundle(bundle: RecipeBundle): void {
    state.bundles.set(bundle.id, bundle);
}

// ============================================================
// AD-HOC INGREDIENTS
// ============================================================

const ADHOC_GROUP = 'Custom additions';

function createAdhocRecipe(ingredient: Ingredient): Recipe {
    const id  = `adhoc:${ingredient.name.toLowerCase().replace(/\s+/g, '-')}:${Date.now()}-${Math.floor(Math.random() * 1e4)}`;
    const step = instruction(`Have ${formatIngredient(ingredient)} on hand`, { ingredients: [ingredient] });
    step.recipeId = id;
    return { id, name: formatIngredient(ingredient), group: ADHOC_GROUP, steps: [step], adhoc: true };
}

export function getSelectedRecipes(): Recipe[] {
    const seen = new Set<string>();
    const out: Recipe[] = [];
    for (const id of state.selectedRecipeIds) {
        if (seen.has(id)) continue;
        seen.add(id);
        const r = state.recipes.get(id);
        if (r) out.push(r);
    }
    return out;
}

export function getServings(recipeId: string): number {
    return state.selectedRecipeIds.filter(id => id === recipeId).length;
}

function getFilteredRecipes(): Recipe[] {
    const q   = state.searchQuery.toLowerCase();
    const all = [...state.recipes.values()];
    // Hidden recipes are excluded from the unfiltered list, but still turn up
    // when the user searches by name, or once "Show hidden" has been toggled on.
    const matched = q
        ? all.filter((r) => r.name.toLowerCase().includes(q))
        : all.filter((r) => !r.hidden || state.showHidden);
    return matched.sort((a, b) => {
        const aAdhoc = a.adhoc ? 0 : 1;
        const bAdhoc = b.adhoc ? 0 : 1;
        if (aAdhoc !== bAdhoc) return aAdhoc - bAdhoc;
        if (a.sortOrder !== undefined && b.sortOrder !== undefined) return a.sortOrder - b.sortOrder;
        return a.name.localeCompare(b.name);
    });
}

// Like getFilteredRecipes(), but keyed off its own search string rather than the Select
// screen's `state.searchQuery` — used by the Nutrition screen's "Add a recipe" search so
// typing there doesn't clobber (or get clobbered by) whatever's typed on Select. Ad-hoc
// recipes are excluded: they're synthetic one-offs created by the ingredient picker, not
// reusable catalog entries to search for.
function getNutritionAddableRecipes(query: string): Recipe[] {
    const q   = query.toLowerCase().trim();
    const all = [...state.recipes.values()].filter((r) => !r.adhoc);
    const matched = q
        ? all.filter((r) => r.name.toLowerCase().includes(q))
        : all.filter((r) => !r.hidden || state.showHidden);
    return matched.sort((a, b) => a.name.localeCompare(b.name));
}

// ============================================================
// COOK TIME
// ============================================================

function recipeCookSeconds(recipe: Recipe): number {
    const releaseAt = new Map<string, number>();
    function claimKeysForStep(step: Step): string[] {
        const keys: string[] = [];
        for (const eq of (step.equipment ?? [])) keys.push(`eq::${eq}`);
        for (const ing of (step.ingredients ?? [])) keys.push(`ing::${ing.name}`);
        return keys;
    }
    let totalTime = 0;
    for (const step of recipe.steps) {
        if (step.type !== 'timer' && step.type !== 'gate') continue;
        const keys    = claimKeysForStep(step);
        const startAt = keys.reduce((m, k) => Math.max(m, releaseAt.get(k) ?? 0), 0);
        const endAt   = startAt + (step.durationSeconds ?? 0);
        for (const k of keys) releaseAt.set(k, endAt);
        totalTime = Math.max(totalTime, endAt);
    }
    return totalTime;
}

function formatCookTime(seconds: number): string {
    const totalMinutes = Math.ceil(seconds / 60);
    if (totalMinutes < 60) return `${totalMinutes} min`;
    const hrs  = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return mins === 0 ? `${hrs} hr` : `${hrs} hr ${mins} min`;
}

// ============================================================
// COOKING PLAN
// ============================================================

function buildCookingPlan(recipes: Recipe[]): Step[] {
    const steps = recipes.flatMap(r => r.steps.filter(s => !s.prepOnly));
    const manualWaits = new Map<number, number[]>();
    steps.forEach(s => {
        if (s.waitForIds && s.waitForIds.length > 0) manualWaits.set(s.id, [...s.waitForIds]);
        s.waitForIds = undefined;
    });
    const equipClaims: Map<string, number>     = new Map();
    const ingClaims:   Map<Ingredient, number> = new Map();
    function getBlockingIds(step: Step): number[] {
        const blocking = new Set<number>();
        for (const eq of (step.equipment ?? [])) {
            const id = equipClaims.get(`${step.recipeId}::eq::${eq}`);
            if (id !== undefined) blocking.add(id);
        }
        for (const ing of (step.ingredients ?? [])) {
            const id = ingClaims.get(ing);
            if (id !== undefined) blocking.add(id);
        }
        return [...blocking];
    }
    function setClaims(step: Step): void {
        for (const eq of (step.equipment ?? [])) equipClaims.set(`${step.recipeId}::eq::${eq}`, step.id);
        for (const ing of (step.ingredients ?? [])) ingClaims.set(ing, step.id);
    }
    for (const step of steps) {
        const waitFor = new Set<number>();
        for (const id of (manualWaits.get(step.id) ?? [])) waitFor.add(id);
        for (const id of getBlockingIds(step)) waitFor.add(id);
        if (waitFor.size > 0) step.waitForIds = [...waitFor];
        setClaims(step);
    }
    return steps;
}

// ============================================================
// SHOPPING LIST
// ============================================================

function buildShoppingList(): Ingredient[] {
    const combined = new Map<string, Ingredient>();
    getSelectedRecipes().forEach((recipe) => {
        const servings = getServings(recipe.id);
        const distinct = new Set<Ingredient>();
        const walk = (steps: Step[]) => {
            for (const step of steps) {
                for (const ing of step.ingredients ?? []) distinct.add(ing);
                if (step.children) walk(step.children);
            }
        };
        walk(recipe.steps);
        for (const ingredient of distinct) {
            if (isComposite(ingredient)) continue;
            const key      = `${ingredient.name}-${ingredient.unit?.name ?? ''}`;
            const addQty   = (ingredient.quantity ?? 0) * servings;
            const existing = combined.get(key);
            if (!existing) {
                combined.set(key, { ...ingredient, quantity: addQty } as Ingredient);
            } else {
                (existing as any).quantity = (existing.quantity ?? 0) + addQty;
            }
        }
    });
    return [...combined.values()];
}

// ============================================================
// PANTRY INVENTORY
// ============================================================

// How much of each ingredient (name + unit) is already on hand, independent of
// which recipes are selected. Persisted in localStorage so it survives reloads.
const INVENTORY_KEY = 'recipe-inventory';

function loadInventory(): Record<string, number> {
    try {
        const raw = localStorage.getItem(INVENTORY_KEY);
        if (raw) return JSON.parse(raw) as Record<string, number>;
    } catch {}
    return {};
}

function saveInventory(inventory: Record<string, number>): void {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
}

// Same key shape buildShoppingList() combines on, so "have" quantities line up
// with combined shopping-list quantities regardless of which recipes contributed them.
// byPackage gets its own key suffix so a value entered as "packages" is never
// misread as raw recipe-unit quantity (or vice versa) if the tracking mode changes.
function inventoryKey(ingredient: Ingredient, byPackage: boolean): string {
    const base = `${ingredient.name}-${ingredient.unit?.name ?? ''}`;
    return byPackage ? `${base}::pkg` : base;
}

// ============================================================
// NUTRITION + COST
// ============================================================

interface NutritionTotals { calories: number; fat: number; saturatedFat: number; transFat: number; cholesterol: number; carbs: number; sodium: number; sugar: number; protein: number; fiber: number; }

type NutritionResult =
    | { status: 'ok'; totals: NutritionTotals; brand?: string }
    | { status: 'missing' }
    | { status: 'uncomputable'; reason: string };

type CostResult =
    | { status: 'ok'; cost: number; brand?: string }
    | { status: 'missing' }
    | { status: 'uncomputable'; reason: string };

const emptyTotals = (): NutritionTotals => ({ calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 });

const addTotals = (a: NutritionTotals, b: NutritionTotals): NutritionTotals => ({
    calories:     a.calories     + b.calories,
    fat:          a.fat          + b.fat,
    saturatedFat: a.saturatedFat + b.saturatedFat,
    transFat:     a.transFat     + b.transFat,
    cholesterol:  a.cholesterol  + b.cholesterol,
    carbs:        a.carbs        + b.carbs,
    sodium:       a.sodium       + b.sodium,
    sugar:        a.sugar        + b.sugar,
    protein:      a.protein      + b.protein,
    fiber:        a.fiber        + b.fiber,
});

const scaleTotals = (t: NutritionTotals, n: number): NutritionTotals => ({
    calories:     t.calories     * n,
    fat:          t.fat          * n,
    saturatedFat: t.saturatedFat * n,
    transFat:     t.transFat     * n,
    cholesterol:  t.cholesterol  * n,
    carbs:        t.carbs        * n,
    sodium:       t.sodium       * n,
    sugar:        t.sugar        * n,
    protein:      t.protein      * n,
    fiber:        t.fiber        * n,
});

function isComposite(ing: Ingredient): boolean {
    return Array.isArray((ing as any)._constituents);
}

function selectedProduct(ing: Ingredient): Product | undefined {
    const ps = ing.products ?? [];
    if (ps.length === 0) return undefined;
    return ps.find(p => p.brand === ing.defaultBrand) ?? ps[0];
}

function nutritionSource(ing: Ingredient): { label?: NutritionLabel; brand?: string } {
    const product = selectedProduct(ing);
    if (product?.nutrition) return { label: product.nutrition, brand: product.brand };
    return { label: ing.nutrition };
}

function resolveNutritionFacts(
    ing: Ingredient,
    label: NutritionLabel
): { facts: NutritionLabel[string]; convertedQty: number; matchedUnit: string } | null {
    const recipeUnit = ing.unit?.name ?? '';
    const qty        = ing.quantity ?? 0;

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

function ingredientNutrition(ing: Ingredient): NutritionResult {
    const { label, brand } = nutritionSource(ing);
    if (!label || Object.keys(label).length === 0) return { status: 'missing' };
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
    if (servingSize <= 0) return { status: 'uncomputable', reason: 'serving size is missing or zero' };

    const servingsUsed = convertedQty / servingSize;
    return {
        status: 'ok',
        brand,
        totals: {
            calories:     (facts.calories     ?? 0) * servingsUsed,
            fat:          (facts.fat          ?? 0) * servingsUsed,
            saturatedFat: (facts.saturatedFat ?? 0) * servingsUsed,
            transFat:     (facts.transFat     ?? 0) * servingsUsed,
            cholesterol:  (facts.cholesterol  ?? 0) * servingsUsed,
            carbs:        (facts.carbs        ?? 0) * servingsUsed,
            sodium:       (facts.sodium       ?? 0) * servingsUsed,
            sugar:        (facts.sugar        ?? 0) * servingsUsed,
            protein:      (facts.protein      ?? 0) * servingsUsed,
            fiber:        (facts.fiber        ?? 0) * servingsUsed,
        },
    };
}

function ingredientCost(ing: Ingredient): CostResult {
    const product = selectedProduct(ing);
    if (!product) return { status: 'missing' };
    const listing = cheapestListing(product);
    if (!listing || listing.price === undefined || product.size === undefined || !product.sizeUnit) {
        return { status: 'missing' };
    }
    if (!ing.unit || !ing.unit.name) {
        return { status: 'uncomputable', reason: 'no unit on the recipe ingredient' };
    }

    const recipeUnit  = ing.unit.name;
    const packageUnit = product.sizeUnit.name;
    const qty         = ing.quantity ?? 0;

    const convertedQty = convertWithDensity(qty, recipeUnit, packageUnit, ing.conversions);
    if (convertedQty === null) {
        return {
            status: 'uncomputable',
            reason: `recipe uses "${recipeUnit}" but package is in "${packageUnit}" (no conversion path)`,
        };
    }

    return {
        status: 'ok',
        brand:  product.brand,
        cost:   (listing.price / product.size) * convertedQty,
    };
}

// How many recipe-unit quantities (e.g. cups) a single package (e.g. a 13.4oz can)
// contains — the inverse of the recipeUnit → packageUnit conversion used above, derived
// from the same physical/density conversion data rather than a separately entered figure.
function unitsPerPackage(ing: Ingredient, product: Product): number | null {
    const recipeUnit = ing.unit?.name;
    if (!recipeUnit || product.size === undefined || !product.sizeUnit) return null;
    const packageUnit = product.sizeUnit.name;
    if (recipeUnit === packageUnit) return product.size;
    const packageUnitsPerRecipeUnit = convertWithDensity(1, recipeUnit, packageUnit, ing.conversions);
    if (!packageUnitsPerRecipeUnit) return null;
    return product.size / packageUnitsPerRecipeUnit;
}

interface RecipeNutrition {
    totals:       NutritionTotals;
    cost:         number;         // sum of ok ingredient costs (unscaled — multiply by servings)
    covered:      number;
    missing:      number;
    uncomputable: number;
    costMissing:  number;         // ingredients with no price data (missing or uncomputable)
    total:        number;
    breakdown:    { ing: Ingredient; result: NutritionResult; costResult: CostResult }[];
}

function recipeNutrition(recipe: Recipe): RecipeNutrition {
    const seen = new Set<Ingredient>();
    const walk = (steps: Step[]) => {
        for (const step of steps) {
            for (const ing of step.ingredients ?? []) seen.add(ing);
            if (step.children) walk(step.children);
        }
    };
    walk(recipe.steps);

    const breakdown = [...seen]
        .filter(ing => !isComposite(ing))
        .map(ing => ({ ing, result: ingredientNutrition(ing), costResult: ingredientCost(ing) }));

    const totals = breakdown.reduce(
        (acc, b) => b.result.status === 'ok' ? addTotals(acc, b.result.totals) : acc,
        emptyTotals(),
    );
    const cost = breakdown.reduce(
        (acc, b) => b.costResult.status === 'ok' ? acc + b.costResult.cost : acc,
        0,
    );

    return {
        totals,
        cost,
        covered:     breakdown.filter(b => b.result.status === 'ok').length,
        missing:     breakdown.filter(b => b.result.status === 'missing').length,
        uncomputable:breakdown.filter(b => b.result.status === 'uncomputable').length,
        costMissing: breakdown.filter(b => b.costResult.status !== 'ok').length,
        total:       breakdown.length,
        breakdown,
    };
}

function formatTotals(t: NutritionTotals, cost?: number): string {
    const costStr = cost !== undefined ? `$${cost.toFixed(2)} · ` : '';
    return `${costStr}${Math.round(t.calories)} cal · ${Math.round(t.protein)} g protein · ` +
           `${Math.round(t.fat)} g fat (${Math.round(t.saturatedFat)} sat${t.transFat > 0 ? ` / ${Math.round(t.transFat)} trans` : ''}) · ` +
           `${Math.round(t.cholesterol)} mg chol · ` +
           `${Math.round(t.carbs)} g carbs · ` +
           `${Math.round(t.fiber)} g fiber · ${Math.round(t.sugar)} g sugar · ${Math.round(t.sodium)} mg sodium`;
}

function coverageLabel(covered: number, total: number, flagged: number): string {
    if (total === 0) return 'No ingredients';
    if (flagged === 0) return `All ${total} ingredients have data`;
    return `${covered} of ${total} ingredients have data · ${flagged} flagged`;
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
// COPY TO CLIPBOARD
// ============================================================

function getRecipeURL(recipeId: string): string {
    const baseURL = window.location.origin + window.location.pathname;
    return `${baseURL}?recipe=${recipeId}`;
}

function copyToClipboard(text: string): Promise<void> {
    return navigator.clipboard.writeText(text).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    });
}

function createCopyButton(recipeId: string): HTMLButtonElement {
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

function unlockAudioContext(): void {
    if (state.audioUnlocked) return;
    state.audioUnlocked = true;
    // Prime the *actual* alarm element with a direct, gesture-triggered play(), not a
    // separate throwaway one — some browsers (notably Safari) grant "allowed to autoplay"
    // per media element based on it having been played directly during a user gesture at
    // least once, rather than unlocking playback page-wide. Without this, the alarm's
    // audio.play() call — which always fires later from a setInterval callback, not a
    // gesture — gets rejected with NotAllowedError the first time a real (non-test) timer
    // tries to ring.
    const wasMuted = audio.muted;
    audio.muted = true;
    audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.muted = wasMuted;
    }).catch(() => { audio.muted = wasMuted; });
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

    const hasHiddenRecipes = [...state.recipes.values()].some(r => r.hidden);
    if (hasHiddenRecipes) {
        const toggleBtn = createButton(
            state.showHidden ? 'Hide hidden recipes' : 'Show hidden recipes',
            () => {
                setShowHidden(!state.showHidden);
                renderRecipeList();
                toggleBtn.textContent = state.showHidden ? 'Hide hidden recipes' : 'Show hidden recipes';
            }
        );
        toggleBtn.className = 'show-hidden-toggle';
        root.appendChild(toggleBtn);
    }

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
        appendAddIngredientButton(root);
        appendBuildFooter(root);
        return;
    }

    if (state.bundles.size > 0 && !state.searchQuery) {
        const bundleHeading = document.createElement('h3');
        bundleHeading.textContent = 'Bundles';
        bundleHeading.className   = 'group-heading';
        root.appendChild(bundleHeading);

        state.bundles.forEach((bundle) => {
            const row = document.createElement('div');
            row.className = 'bundle-row';

            const btn = document.createElement('button');
            btn.className   = 'bundle-btn';
            btn.textContent = bundle.name;

            const sub = document.createElement('span');
            sub.className   = 'bundle-sub';
            const counts = new Map<string, number>();
            for (const id of bundle.recipeIds) counts.set(id, (counts.get(id) ?? 0) + 1);
            sub.textContent = [...counts.entries()]
                .map(([id, count]) => {
                    const name = state.recipes.get(id)?.name ?? id;
                    return count > 1 ? `${name} ×${count}` : name;
                })
                .join(' · ');

            btn.appendChild(sub);
            btn.addEventListener('click', () => {
                for (const id of bundle.recipeIds) state.selectedRecipeIds.push(id);
                unlockAudioContext();
                renderRecipeList();
                updateActionButtons();
            });

            row.appendChild(btn);
            root.appendChild(row);
        });
    }

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


            const btn     = document.createElement('button');
            btn.className = 'recipe-btn';
            const count   = state.selectedRecipeIds.filter(id => id === recipe.id).length;
            btn.classList.toggle('selected', count > 0);

            const nameSpan = document.createElement('span');
            nameSpan.textContent = recipe.name;
            btn.appendChild(nameSpan);
            if (recipe.hidden) {
                const hiddenBadge = document.createElement('span');
                hiddenBadge.className   = 'hidden-badge';
                hiddenBadge.textContent = 'hidden';
                btn.appendChild(hiddenBadge);
            }
            if (count > 1) {
                const badge = document.createElement('span');
                badge.className   = 'count-badge';
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
            minusBtn.className        = 'count-minus-btn';
            minusBtn.textContent      = '−';
            minusBtn.title            = 'Remove one serving';
            minusBtn.style.visibility = count > 0 ? 'visible' : 'hidden';
            minusBtn.addEventListener('click', (ev) => {
                ev.stopPropagation();
                const idx = state.selectedRecipeIds.lastIndexOf(recipe.id);
                if (idx !== -1) state.selectedRecipeIds.splice(idx, 1);
                renderRecipeList();
                updateActionButtons();
            });

            row.appendChild(btn);
            row.appendChild(minusBtn);
            if (recipe.adhoc) {
                const removeBtn = document.createElement('button');
                removeBtn.className   = 'adhoc-remove-btn';
                removeBtn.textContent = '×';
                removeBtn.title       = 'Remove this ad-hoc ingredient';
                removeBtn.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    state.selectedRecipeIds = state.selectedRecipeIds.filter(id => id !== recipe.id);
                    state.recipes.delete(recipe.id);
                    renderRecipeList();
                    updateActionButtons();
                });
                row.appendChild(removeBtn);
            } else {
                row.appendChild(createCopyButton(recipe.id));
            }
            root.appendChild(row);
        });
    });

    appendAddIngredientButton(root);
    appendBuildFooter(root);
}

function appendAddIngredientButton(root: HTMLElement): void {
    const addRow = document.createElement('div');
    addRow.className = 'add-ingredient-row';
    const addBtn = createButton('+ Add an ingredient', () => {
        adhocReturnScreen = state.screen;
        navigateTo('add-ingredient');
    });
    addBtn.className = 'add-ingredient-btn';
    addRow.appendChild(addBtn);
    root.appendChild(addRow);
}

function updateActionButtons(): void {
    const actions = getElement<HTMLDivElement>('actions');
    clear(actions);
    if (state.selectedRecipeIds.length === 0) return;

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
    const hasPrep = selectedRecipes.some(r =>
        r.steps.some(function walk(s: Step): boolean {
            return !!s.prep || (s.children?.some(walk) ?? false);
        })
    );
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

function renderShoppingScreen(): void {
    const root = getElement<HTMLDivElement>('app');
    clear(root);

    const heading = document.createElement('h2');
    heading.textContent = 'Shopping List';
    root.appendChild(heading);

    const inventory = loadInventory();

    buildShoppingList().forEach((ingredient) => {
        const panel = createPanel();

        const label = document.createElement('span');
        label.textContent = formatIngredient(ingredient);
        panel.appendChild(label);

        const required    = ingredient.quantity ?? 0;
        const product      = selectedProduct(ingredient);
        // Track "have" in whole packages by default — size/sizeUnit already describe
        // one real container for almost every product. Bulk items (cabbage sold loose
        // per lb) opt out via `bulk`, falling back to entering the recipe unit directly
        // rather than guessing a fake "package".
        const packageUnit = product && !product.bulk ? (product.packageUnit ?? u.package) : undefined;
        const perPackage   = packageUnit && product ? unitsPerPackage(ingredient, product) : null;
        const trackByPackage = perPackage !== null && perPackage > 0;
        const key = inventoryKey(ingredient, trackByPackage);

        const packageWord = (count: number): string => {
            const unit = packageUnit as Unit;
            return count === 1 ? unit.name : (unit.plural || pluralize(unit.name, count));
        };

        const invRow = document.createElement('div');
        invRow.className = 'inventory-row';

        const haveLabel = document.createElement('label');
        haveLabel.className   = 'inventory-have-label';
        haveLabel.textContent = trackByPackage ? `Have (${packageWord(2)}):` : 'Have:';
        invRow.appendChild(haveLabel);

        const haveInput = document.createElement('input');
        haveInput.type      = 'number';
        haveInput.min       = '0';
        haveInput.step      = 'any';
        haveInput.className = 'inventory-have-input';
        haveInput.placeholder = '0';
        haveInput.value = inventory[key] ? String(inventory[key]) : '';
        invRow.appendChild(haveInput);

        const neededEl = document.createElement('span');
        neededEl.className = 'inventory-needed';
        invRow.appendChild(neededEl);

        if (trackByPackage) {
            const hint = document.createElement('span');
            hint.className   = 'inventory-package-hint';
            hint.textContent = `1 ${packageWord(1)} ≈ ${formatQuantityUnit(perPackage as number, ingredient.unit)}${product?.variant ? ` (${product.variant})` : ''}`;
            invRow.appendChild(hint);
        }

        const updateNeeded = (have: number) => {
            const haveInRecipeUnits = trackByPackage ? have * (perPackage as number) : have;
            const needed = Math.max(0, required - haveInRecipeUnits);
            if (needed <= 0 && required > 0) {
                neededEl.textContent = '✓ have enough';
                neededEl.classList.add('inventory-satisfied');
            } else {
                let text = `Need ${formatQuantityUnit(needed, ingredient.unit)} more`;
                if (trackByPackage) {
                    const packagesNeeded = Math.ceil(needed / (perPackage as number));
                    if (packagesNeeded > 0) text += ` (~${packagesNeeded} more ${packageWord(packagesNeeded)})`;
                }
                neededEl.textContent = text;
                neededEl.classList.remove('inventory-satisfied');
            }
        };
        updateNeeded(inventory[key] ?? 0);

        haveInput.addEventListener('click', (ev) => ev.stopPropagation());
        haveInput.addEventListener('input', () => {
            const v = parseFloat(haveInput.value);
            const have = isNaN(v) || v < 0 ? 0 : v;
            if (have > 0) inventory[key] = have;
            else delete inventory[key];
            saveInventory(inventory);
            updateNeeded(have);
        });

        panel.appendChild(invRow);

        const products = ingredient.products ?? [];
        // One row per (product, listing) pair — a single product can have several listings
        // (e.g. the same item sold on Amazon and on the brand's own site at different prices).
        const pairs = products.flatMap((product) => (product.listings ?? []).map((listing) => ({ product, listing })));
        if (pairs.length > 0) {
            const links = document.createElement('div');
            links.className = 'purchase-links';
            const chosenProduct = selectedProduct(ingredient);
            const chosenListing = chosenProduct ? cheapestListing(chosenProduct) : undefined;
            const sorted = [...pairs].sort((a, b) => {
                const aPpu = a.listing.price !== undefined && a.product.size !== undefined ? a.listing.price / a.product.size : Infinity;
                const bPpu = b.listing.price !== undefined && b.product.size !== undefined ? b.listing.price / b.product.size : Infinity;
                return aPpu - bPpu;
            });
            sorted.forEach(({ product, listing }) => {
                const a    = document.createElement('a');
                a.href     = listing.link ?? '#';
                a.target   = '_blank';
                a.className = 'purchase-link';
                const isChosen = product === chosenProduct && listing === chosenListing;
                if (isChosen) a.classList.add('default-product');
                const variant = product.variant ? ` ${product.variant}` : '';
                const where   = listing.store ? ` · ${listing.store}` : '';
                const pkg     = listing.price !== undefined && product.size !== undefined
                    ? ` — $${listing.price} / ${product.size} ${product.sizeUnit?.name ?? ''}`.trimEnd()
                    : '';
                const ppu     = listing.price !== undefined && product.size !== undefined
                    ? ` ($${(listing.price / product.size).toFixed(2)}/${product.sizeUnit?.name ?? 'unit'})`
                    : '';
                const sasPercent = listing.store === stores.amazon ? subscribeAndSavePercent(listing.discount) : undefined;
                const sasPrice   = sasPercent !== undefined && listing.price !== undefined
                    ? listing.price * (1 - sasPercent / 100) : undefined;
                const sasPpu  = sasPrice !== undefined && product.size !== undefined
                    ? ` ($${(sasPrice / product.size).toFixed(2)}/${product.sizeUnit?.name ?? 'unit'})` : '';
                const sas     = sasPrice !== undefined
                    ? ` · S&S ${sasPercent}% $${sasPrice.toFixed(2)}${sasPpu}` : '';
                const pick    = isChosen ? ' ✓' : '';
                a.textContent = `${product.brand}${variant}${where}${pkg}${ppu}${sas}${pick}`;
                links.appendChild(a);
            });
            panel.appendChild(links);
        }

        panel.addEventListener('click', (ev) => {
            const tag = (ev.target as HTMLElement).tagName;
            if (tag === 'A' || tag === 'INPUT' || tag === 'LABEL') return;
            panel.classList.toggle('completed');
        });
        root.appendChild(panel);
    });

    root.appendChild(createStartOverButton());
}

// ============================================================
// MACRO TARGETS PANEL
// ============================================================

function renderMacroTargetsPanel(grand: NutritionTotals): HTMLElement {
    const panel = createPanel();
    panel.className = 'panel macro-targets';

    const title = document.createElement('div');
    title.className   = 'macro-targets-title';
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
    const pct = (grams: number | null, calsPerGram: number): string =>
        grams !== null && totalCals ? ` (${Math.round((grams * calsPerGram / totalCals) * 100)}%)` : '';

    const totalMacroG = grand.protein + grand.fat + grand.carbs;
    const macroPct = (grams: number | null): string =>
        grams !== null && totalMacroG > 0 ? ` / ${Math.round((grams / totalMacroG) * 100)}%` : '';

    const rows: { label: string; key: keyof typeof macroTargets; actual: number | null; unit: string; indent?: boolean; cap?: boolean; calPct?: string; macroPct?: string }[] = [
        { label: 'Calories',    key: 'calories',    actual: grand.calories    > 0 ? Math.round(grand.calories)           : null, unit: 'kcal' },
        { label: 'Protein',     key: 'protein',     actual: grand.protein     > 0 ? Math.round(grand.protein)            : null, unit: 'g', calPct: pct(grand.protein     > 0 ? grand.protein     : null, 4), macroPct: macroPct(grand.protein > 0 ? grand.protein : null) },
        { label: 'Fat',         key: 'fat',         actual: grand.fat         > 0 ? Math.round(grand.fat)                : null, unit: 'g', calPct: pct(grand.fat         > 0 ? grand.fat         : null, 9), macroPct: macroPct(grand.fat     > 0 ? grand.fat     : null) },
        { label: '↳ Sat Fat',   key: 'saturatedFat', actual: grand.saturatedFat > 0 ? Math.round(grand.saturatedFat * 10) / 10 : null, unit: 'g', indent: true, cap: true, calPct: pct(grand.saturatedFat > 0 ? grand.saturatedFat : null, 9) },
        { label: '↳ Trans Fat', key: 'transFat',    actual: grand.transFat    > 0 ? Math.round(grand.transFat * 10) / 10 : null, unit: 'g', indent: true, cap: true, calPct: pct(grand.transFat    > 0 ? grand.transFat    : null, 9) },
        { label: 'Carbs',       key: 'carbs',       actual: grand.carbs       > 0 ? Math.round(grand.carbs)              : null, unit: 'g', calPct: pct(grand.carbs       > 0 ? grand.carbs       : null, 4), macroPct: macroPct(grand.carbs   > 0 ? grand.carbs   : null) },
        { label: 'Fiber',       key: 'fiber',       actual: grand.fiber       > 0 ? Math.round(grand.fiber)              : null, unit: 'g' },
        { label: 'Sodium',      key: 'sodium',      actual: grand.sodium      > 0 ? Math.round(grand.sodium)             : null, unit: 'mg', cap: true },
    ];

    rows.forEach(({ label, key, actual, unit, indent, cap, calPct, macroPct }) => {
        const row = document.createElement('div');
        row.className = 'macro-row' + (indent ? ' macro-row-indent' : '');

        const labelEl = document.createElement('span');
        labelEl.className   = 'macro-label' + (indent ? ' macro-label-sub' : '');
        labelEl.textContent = label;
        row.appendChild(labelEl);

        const inputWrap = document.createElement('span');
        inputWrap.className = 'macro-target-wrap';
        const input = document.createElement('input');
        input.type      = 'number';
        input.min       = '0';
        input.className = 'macro-target-input';
        input.value     = String(macroTargets[key]);
        const unitLabel = document.createElement('span');
        unitLabel.className   = 'macro-unit-label';
        unitLabel.textContent = unit;
        inputWrap.appendChild(input);
        inputWrap.appendChild(unitLabel);
        row.appendChild(inputWrap);

        const actualEl = document.createElement('span');
        actualEl.className   = 'macro-actual';
        actualEl.textContent = actual !== null ? `${actual} ${unit}${calPct ?? ''}${macroPct ?? ''}` : '—';
        row.appendChild(actualEl);

        const initRemaining = actual !== null ? macroTargets[key] - actual : null;
        const remainClass = (rem: number | null) => {
            if (rem === null) return 'macro-remaining';
            if (cap) return rem < 0 ? 'macro-remaining over' : rem === 0 ? 'macro-remaining met' : 'macro-remaining';
            return rem <= 0 ? 'macro-remaining met' : 'macro-remaining';
        };
        const remainText = (rem: number | null) => {
            if (rem === null) return '—';
            if (cap) return rem < 0 ? `${Math.round(-rem)} ${unit} over` : rem === 0 ? '✓ at limit' : `${Math.round(rem)} ${unit} left`;
            return rem > 0 ? `${Math.round(rem)} ${unit}` : '✓ met';
        };
        const remainEl = document.createElement('span');
        remainEl.className   = remainClass(initRemaining);
        remainEl.textContent = remainText(initRemaining);
        row.appendChild(remainEl);

        input.addEventListener('change', () => {
            const v = parseFloat(input.value);
            if (!isNaN(v) && v > 0) {
                macroTargets[key] = v;
                const newRemaining = actual !== null ? v - actual : null;
                remainEl.textContent = remainText(newRemaining);
                remainEl.className   = remainClass(newRemaining);
            }
        });

        panel.appendChild(row);
    });

    return panel;
}

// ============================================================
// RECIPE SUGGESTIONS
// ============================================================

interface SuggestedRecipe { recipe: Recipe; score: number; totals: NutritionTotals; }

function buildRecipeSuggestions(grand: NutritionTotals): SuggestedRecipe[] {
    const remCals = macroTargets.calories - grand.calories;
    if (remCals < 50) return [];  // nearly full — no suggestions needed

    const remaining = {
        calories: Math.max(0, remCals),
        protein:  Math.max(0, macroTargets.protein - grand.protein),
        fat:      Math.max(0, macroTargets.fat     - grand.fat),
        carbs:    Math.max(0, macroTargets.carbs   - grand.carbs),
    };

    const results: SuggestedRecipe[] = [];

    for (const recipe of state.recipes.values()) {
        if (recipe.adhoc) continue;
        const nutr = recipeNutrition(recipe);
        if (nutr.covered === 0) continue;

        const t = nutr.totals;
        const macros = [
            { val: t.calories, rem: remaining.calories, w: 0.4 },
            { val: t.protein,  rem: remaining.protein,  w: 0.3 },
            { val: t.fat,      rem: remaining.fat,      w: 0.15 },
            { val: t.carbs,    rem: remaining.carbs,    w: 0.15 },
        ];

        let score = 0;
        let totalWeight = 0;
        for (const { val, rem, w } of macros) {
            if (rem <= 0) continue;
            score += Math.min(val / rem, 1) * w;
            totalWeight += w;
        }
        if (totalWeight === 0) continue;
        score /= totalWeight;

        // Penalise recipes that would meaningfully bust cap nutrients
        const sodiumRemaining = macroTargets.sodium - grand.sodium;
        if (sodiumRemaining > 0 && t.sodium > sodiumRemaining * 1.5) score *= 0.7;
        const satFatRemaining = macroTargets.saturatedFat - grand.saturatedFat;
        if (satFatRemaining > 0 && t.saturatedFat > satFatRemaining * 1.5) score *= 0.8;

        results.push({ recipe, score, totals: t });
    }

    return results.sort((a, b) => b.score - a.score).slice(0, 3);
}

// ============================================================
// SCREEN: NUTRITION
// ============================================================

function renderNutritionScreen(): void {
    const root = getElement<HTMLDivElement>('app');
    clear(root);

    const heading = document.createElement('h2');
    heading.textContent = 'Nutrition';
    root.appendChild(heading);

    const recipes = getSelectedRecipes();

    if (recipes.length === 0) {
        const empty = document.createElement('p');
        empty.className   = 'empty';
        empty.textContent = 'No recipes selected.';
        root.appendChild(empty);
        root.appendChild(createStartOverButton());
        return;
    }

    const perRecipe = recipes.map(r => ({
        recipe:    r,
        servings:  getServings(r.id),
        nutrition: recipeNutrition(r),
    }));

    // Pre-compute effective totals per recipe, zeroing out excluded ingredients
    const perRecipeEff = perRecipe.map(({ recipe, servings, nutrition }) => {
        const excluded = getNutritionExcluded(recipe.id);
        const effTotals = nutrition.breakdown.reduce(
            (acc, b) => excluded.has(b.ing) || b.result.status !== 'ok' ? acc : addTotals(acc, b.result.totals),
            emptyTotals()
        );
        const effCost = nutrition.breakdown.reduce(
            (acc, b) => excluded.has(b.ing) || b.costResult.status !== 'ok' ? acc : acc + b.costResult.cost,
            0
        );
        return { recipe, servings, nutrition, excluded, effTotals, effCost };
    });

    // ── Grand total ──────────────────────────────────────────
    // Deselected recipes (nutritionRecipeExclusions) contribute nothing to the grand total.
    const grand         = perRecipeEff.reduce((acc, p) => nutritionRecipeExclusions.has(p.recipe.id) ? acc : addTotals(acc, scaleTotals(p.effTotals, p.servings)), emptyTotals());
    const grandCost     = perRecipeEff.reduce((acc, p) => nutritionRecipeExclusions.has(p.recipe.id) ? acc : acc + p.effCost * p.servings, 0);
    const gCovered      = perRecipe.reduce((a, p) => a + p.nutrition.covered, 0);
    const gFlagged      = perRecipe.reduce((a, p) => a + p.nutrition.missing + p.nutrition.uncomputable, 0);
    const gTotal        = perRecipe.reduce((a, p) => a + p.nutrition.total, 0);
    const gCostMissing  = perRecipe.reduce((a, p) => a + p.nutrition.costMissing, 0);
    const grandServings = perRecipe.reduce((a, p) => a + p.servings, 0);
    const hasCostData   = gTotal > gCostMissing;

    const totalCard = createPanel();
    totalCard.className = 'panel nutrition-total';

    const totalTitle = document.createElement('div');
    totalTitle.className = 'nutrition-total-title';
    if (recipes.length === 1 && perRecipe[0].servings === 1) {
        totalTitle.textContent = recipes[0].name;
    } else if (recipes.length === 1) {
        totalTitle.textContent = `${recipes[0].name} ×${perRecipe[0].servings}`;
    } else {
        totalTitle.textContent = `All selected recipes (${grandServings} serving${grandServings === 1 ? '' : 's'})`;
    }
    totalCard.appendChild(totalTitle);

    const totalValue = document.createElement('div');
    totalValue.className = 'nutrition-values';
    if (gCovered > 0) {
        totalValue.textContent = formatTotals(grand, hasCostData ? grandCost : undefined);
    } else if (hasCostData) {
        totalValue.textContent = `$${grandCost.toFixed(2)}`;
    } else {
        totalValue.textContent = '— no computable data';
    }
    totalCard.appendChild(totalValue);

    // 30-day cost projection
    if (hasCostData) {
        const monthly = document.createElement('div');
        monthly.className   = 'nutrition-monthly-cost';
        monthly.textContent = `$${(grandCost * 30).toFixed(2)} / 30 days`;
        totalCard.appendChild(monthly);
    }

    // Partial cost warning
    if (gCostMissing > 0 && hasCostData) {
        const costNote = document.createElement('div');
        costNote.className   = 'nutrition-cost-note';
        costNote.textContent = `⚠ cost is partial — ${gCostMissing} ingredient${gCostMissing === 1 ? '' : 's'} missing price data`;
        totalCard.appendChild(costNote);
    }

    const totalCoverage = document.createElement('div');
    totalCoverage.className   = 'nutrition-coverage' + (gFlagged > 0 ? ' flagged' : '');
    totalCoverage.textContent = (gFlagged > 0 ? '⚠ ' : '') + coverageLabel(gCovered, gTotal, gFlagged);
    totalCard.appendChild(totalCoverage);

    root.appendChild(totalCard);
    root.appendChild(renderMacroTargetsPanel(grand));

    // ── Bulk select/unselect ─────────────────────────────────
    const bulkActions = document.createElement('div');
    bulkActions.className = 'nutrition-bulk-actions';

    const selectAllBtn = createButton('Select All', () => {
        recipes.forEach(r => nutritionRecipeExclusions.delete(r.id));
        renderNutritionScreen();
    });
    selectAllBtn.className = 'nutrition-bulk-btn';

    const unselectAllBtn = createButton('Unselect All', () => {
        recipes.forEach(r => nutritionRecipeExclusions.add(r.id));
        renderNutritionScreen();
    });
    unselectAllBtn.className = 'nutrition-bulk-btn';

    bulkActions.appendChild(selectAllBtn);
    bulkActions.appendChild(unselectAllBtn);
    root.appendChild(bulkActions);

    // ── Per recipe (expandable) ──────────────────────────────
    perRecipeEff.forEach(({ recipe, servings, nutrition, excluded, effTotals, effCost }) => {
        const section = createPanel();
        section.className = 'panel nutrition-recipe';
        if (nutritionRecipeExclusions.has(recipe.id)) section.classList.add('nutrition-recipe-excluded');
        else section.classList.add('nutrition-recipe-eaten');

        const flaggedCount      = nutrition.missing + nutrition.uncomputable;
        const sectionTotals     = scaleTotals(effTotals, servings);
        const sectionCost       = effCost * servings;
        const recipeHasCostData = nutrition.total > nutrition.costMissing;

        const header = document.createElement('div');
        header.className = 'nutrition-recipe-header';

        const caret = document.createElement('span');
        caret.className   = 'nutrition-caret';
        caret.textContent = nutritionExpanded.has(recipe.id) ? '▾' : '▸';

        const name = document.createElement('span');
        name.className   = 'nutrition-recipe-name';
        name.textContent = servings > 1 ? `${recipe.name} ×${servings}` : recipe.name;

        const sub = document.createElement('span');
        sub.className = 'nutrition-recipe-sub';
        if (nutrition.covered > 0) {
            sub.textContent = formatTotals(sectionTotals, recipeHasCostData ? sectionCost : undefined);
        } else if (recipeHasCostData) {
            sub.textContent = `$${sectionCost.toFixed(2)}`;
        } else {
            sub.textContent = '— no computable data';
        }

        const servingControls = document.createElement('div');
        servingControls.className = 'nutrition-serving-controls';

        const minusBtn = document.createElement('button');
        minusBtn.className   = 'nutrition-serving-btn';
        minusBtn.textContent = '−';
        minusBtn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            const idx = state.selectedRecipeIds.lastIndexOf(recipe.id);
            if (idx !== -1) state.selectedRecipeIds.splice(idx, 1);
            renderNutritionScreen();
        });

        const countLabel = document.createElement('span');
        countLabel.className   = 'nutrition-serving-count';
        countLabel.textContent = `×${servings}`;

        const plusBtn = document.createElement('button');
        plusBtn.className   = 'nutrition-serving-btn';
        plusBtn.textContent = '+';
        plusBtn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            state.selectedRecipeIds.push(recipe.id);
            renderNutritionScreen();
        });

        servingControls.appendChild(minusBtn);
        servingControls.appendChild(countLabel);
        servingControls.appendChild(plusBtn);

        const isRecipeExcluded = nutritionRecipeExclusions.has(recipe.id);
        const eatenBtn = document.createElement('button');
        eatenBtn.className   = 'nutrition-eaten-btn';
        eatenBtn.textContent = isRecipeExcluded ? '○' : '✓';
        eatenBtn.title       = isRecipeExcluded ? 'Include in totals' : 'Exclude from totals';
        eatenBtn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            if (isRecipeExcluded) nutritionRecipeExclusions.delete(recipe.id);
            else nutritionRecipeExclusions.add(recipe.id);
            renderNutritionScreen();
        });

        header.appendChild(caret);
        header.appendChild(name);
        header.appendChild(servingControls);
        header.appendChild(eatenBtn);
        header.appendChild(sub);
        section.appendChild(header);

        const cov = document.createElement('div');
        cov.className   = 'nutrition-coverage' + (flaggedCount > 0 ? ' flagged' : '');
        const costNote  = nutrition.costMissing > 0
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
            if (isExcluded) row.classList.add('nutrition-ingredient-excluded');

            const toggleBtn = document.createElement('button');
            toggleBtn.className   = 'nutrition-ingredient-toggle';
            toggleBtn.textContent = isExcluded ? '+' : '−';
            toggleBtn.title       = isExcluded ? 'Include in totals' : 'Exclude from totals';
            toggleBtn.addEventListener('click', () => {
                if (isExcluded) excluded.delete(ing); else excluded.add(ing);
                renderNutritionScreen();
            });
            row.appendChild(toggleBtn);

            const ingName = document.createElement('span');
            ingName.className   = 'nutrition-ingredient-name';
            const scaledIng     = { ...ing, quantity: (ing.quantity ?? 0) * servings };
            ingName.textContent = formatIngredient(scaledIng as Ingredient);
            row.appendChild(ingName);

            const detail = document.createElement('span');
            if (isExcluded) {
                detail.className   = 'nutrition-ingredient-value';
                detail.textContent = '— excluded';
            } else if (result.status === 'ok') {
                detail.className = 'nutrition-ingredient-value';
                const costSuffix = costResult.status === 'ok'
                    ? ` · $${(costResult.cost * servings).toFixed(2)}`
                    : '';
                detail.textContent = formatTotals(scaleTotals(result.totals, servings)) + costSuffix;
            } else if (result.status === 'missing') {
                row.classList.add('flagged');
                detail.className   = 'nutrition-flag';
                detail.textContent = '⚠ no nutrition data';
            } else {
                row.classList.add('flagged');
                detail.className   = 'nutrition-flag';
                detail.textContent = "⚠ can't compute";
                detail.title       = result.reason;
            }
            row.appendChild(detail);

            if (!isExcluded && result.status === 'uncomputable') {
                const reason = document.createElement('div');
                reason.className   = 'nutrition-flag-reason';
                reason.textContent = result.reason;
                row.appendChild(reason);
            }

            if (!isExcluded && result.status === 'ok' && costResult.status !== 'ok') {
                const costFlag = document.createElement('div');
                costFlag.className = 'nutrition-cost-flag';
                costFlag.textContent = costResult.status === 'missing'
                    ? '⚠ no price data'
                    : `⚠ cost can't compute — ${(costResult as { reason: string }).reason}`;
                row.appendChild(costFlag);
            }

            if (!isExcluded && result.status === 'ok' && result.brand) {
                const product = selectedProduct(ing);
                const variant = product?.variant ? ` · ${product.variant}` : '';
                const via = document.createElement('div');
                via.className   = 'nutrition-provenance';
                via.textContent = `via ${result.brand}${variant}`;
                row.appendChild(via);
            }

            list.appendChild(row);
        });

        section.appendChild(list);

        header.addEventListener('click', (ev) => {
            if ((ev.target as HTMLElement).closest('.nutrition-serving-controls')) return;
            if ((ev.target as HTMLElement).closest('.nutrition-eaten-btn')) return;
            const collapsed = list.classList.toggle('collapsed');
            caret.textContent = collapsed ? '▸' : '▾';
            if (collapsed) nutritionExpanded.delete(recipe.id);
            else nutritionExpanded.add(recipe.id);
        });

        root.appendChild(section);
    });

    // ── Recipe suggestions ────────────────────────────────────
    const suggestions = buildRecipeSuggestions(grand);
    if (suggestions.length > 0) {
        const suggestPanel = createPanel();
        suggestPanel.className = 'panel nutrition-suggestions';

        const suggestTitle = document.createElement('div');
        suggestTitle.className   = 'nutrition-suggestions-title';
        suggestTitle.textContent = 'Suggested to fill your gap';
        suggestPanel.appendChild(suggestTitle);

        suggestions.forEach(({ recipe, score, totals }) => {
            const row = document.createElement('div');
            row.className = 'suggestion-row';

            const info = document.createElement('div');
            info.className = 'suggestion-info';

            const name = document.createElement('span');
            name.className   = 'suggestion-name';
            name.textContent = recipe.name;
            info.appendChild(name);

            const stats = document.createElement('span');
            stats.className   = 'suggestion-stats';
            stats.textContent = `${Math.round(totals.calories)} cal · ${Math.round(totals.protein)}g protein · ${Math.round(score * 100)}% match`;
            info.appendChild(stats);

            const addBtn = document.createElement('button');
            addBtn.className   = 'suggestion-add-btn';
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

    // ── Add more, without leaving this screen ──────────────────
    const addMoreHeading = document.createElement('h3');
    addMoreHeading.textContent = 'Add more';
    addMoreHeading.className   = 'group-heading';
    root.appendChild(addMoreHeading);

    const addRecipeSearch = document.createElement('input');
    addRecipeSearch.type        = 'text';
    addRecipeSearch.placeholder = 'Search recipes to add…';
    addRecipeSearch.value       = nutritionAddRecipeQuery;
    addRecipeSearch.className   = 'search-input';
    addRecipeSearch.addEventListener('input', () => {
        nutritionAddRecipeQuery = addRecipeSearch.value;
        renderNutritionAddRecipeList();
    });
    root.appendChild(addRecipeSearch);

    const addRecipeList = document.createElement('div');
    addRecipeList.id = 'nutrition-add-recipe-list';
    root.appendChild(addRecipeList);
    renderNutritionAddRecipeList();

    appendAddIngredientButton(root);
    root.appendChild(createStartOverButton());
}

function renderNutritionAddRecipeList(): void {
    const root = getElement<HTMLDivElement>('nutrition-add-recipe-list');
    clear(root);

    const matched   = getNutritionAddableRecipes(nutritionAddRecipeQuery);
    const MAX_SHOWN = 8;
    const shown     = matched.slice(0, MAX_SHOWN);

    shown.forEach((recipe) => {
        const row = document.createElement('div');
        row.className = 'suggestion-row';

        const info = document.createElement('div');
        info.className = 'suggestion-info';
        const name = document.createElement('span');
        name.className   = 'suggestion-name';
        name.textContent = recipe.name;
        info.appendChild(name);

        const addBtn = document.createElement('button');
        addBtn.className   = 'suggestion-add-btn';
        addBtn.textContent = '+ Add';
        addBtn.addEventListener('click', () => {
            state.selectedRecipeIds.push(recipe.id);
            renderNutritionScreen();
        });

        row.appendChild(info);
        row.appendChild(addBtn);
        root.appendChild(row);
    });

    if (matched.length > shown.length) {
        const hint = document.createElement('div');
        hint.className   = 'suggestion-more-hint';
        hint.textContent = `+${matched.length - shown.length} more — refine your search`;
        root.appendChild(hint);
    } else if (matched.length === 0) {
        const empty = document.createElement('p');
        empty.className   = 'empty';
        empty.textContent = 'No matching recipes.';
        root.appendChild(empty);
    }
}

// ============================================================
// SCREEN: ADD INGREDIENT
// ============================================================

let adhocSearchQuery = '';
let adhocSelectedKey: string | null = null;
let adhocQuantity   = 1;
let adhocUnitName   = '';
// Which screen opened the ingredient picker (Select or Nutrition) — Back/Add to list return
// here instead of always landing on Select, so adding from Nutrition doesn't strand the user
// somewhere they didn't ask to go.
let adhocReturnScreen: Screen = 'select';

function pickDefaultUnit(ing: Ingredient): Unit {
    const productUnits = ing.products?.[0]?.nutrition && Object.keys(ing.products[0].nutrition);
    const ownUnits     = ing.nutrition && Object.keys(ing.nutrition);
    const hint = productUnits?.[0] ?? ownUnits?.[0];
    if (hint) {
        const match = Object.values(u).find(unit => unit.name === hint);
        if (match) return match;
    }
    return u.unit;
}

let adhocCatalog: { key: string; name: string; sample: Ingredient }[] | null = null;
function getAdhocCatalog(): { key: string; name: string; sample: Ingredient }[] {
    if (adhocCatalog) return adhocCatalog;
    adhocCatalog = Object.entries(i).map(([key, factory]) => {
        const sample = (factory as (q?: number, u?: Unit) => Ingredient)();
        return { key, name: sample.name, sample };
    }).sort((a, b) => a.name.localeCompare(b.name));
    return adhocCatalog;
}

function renderAddIngredientScreen(): void {
    const root = getElement<HTMLDivElement>('app');
    clear(root);

    const heading = document.createElement('h2');
    heading.textContent = 'Add an ingredient';
    root.appendChild(heading);

    const sub = document.createElement('p');
    sub.className   = 'adhoc-sub';
    sub.textContent = 'Pick an ingredient to add to your shopping list and nutrition totals.';
    root.appendChild(sub);

    const searchInput = document.createElement('input');
    searchInput.type        = 'text';
    searchInput.placeholder = 'Search ingredients…';
    searchInput.value       = adhocSearchQuery;
    searchInput.className   = 'search-input';
    searchInput.addEventListener('input', () => {
        adhocSearchQuery = searchInput.value;
        renderAdhocList();
    });
    root.appendChild(searchInput);

    const list = document.createElement('div');
    list.id = 'adhoc-list';
    root.appendChild(list);

    const detail = document.createElement('div');
    detail.id        = 'adhoc-detail';
    detail.className = 'adhoc-detail';
    root.appendChild(detail);

    const backBtn = createButton('← Back', () => {
        adhocSearchQuery = '';
        adhocSelectedKey = null;
        adhocQuantity    = 1;
        adhocUnitName    = '';
        navigateTo(adhocReturnScreen);
    });
    backBtn.className = 'start-over-btn';
    root.appendChild(backBtn);

    renderAdhocList();
    renderAdhocDetail();
}

function renderAdhocList(): void {
    const root = getElement<HTMLDivElement>('adhoc-list');
    clear(root);

    const q   = adhocSearchQuery.toLowerCase().trim();
    const all = getAdhocCatalog();
    const matched = q ? all.filter(c => c.name.toLowerCase().includes(q)) : all;

    if (matched.length === 0) {
        const empty = document.createElement('p');
        empty.className   = 'empty';
        empty.textContent = 'No matching ingredients.';
        root.appendChild(empty);
        return;
    }

    matched.forEach(({ key, name }) => {
        const btn = document.createElement('button');
        btn.className   = 'adhoc-item';
        btn.textContent = name;
        if (adhocSelectedKey === key) btn.classList.add('selected');
        btn.addEventListener('click', () => {
            adhocSelectedKey = key;
            const sample  = all.find(c => c.key === key)!.sample;
            adhocQuantity = 1;
            adhocUnitName = pickDefaultUnit(sample).name;
            renderAdhocList();
            renderAdhocDetail();
        });
        root.appendChild(btn);
    });
}

function renderAdhocDetail(): void {
    const root = getElement<HTMLDivElement>('adhoc-detail');
    clear(root);
    if (!adhocSelectedKey) return;

    const catalogEntry = getAdhocCatalog().find(c => c.key === adhocSelectedKey);
    if (!catalogEntry) return;

    const label = document.createElement('div');
    label.className   = 'adhoc-detail-label';
    label.textContent = `How much ${catalogEntry.name}?`;
    root.appendChild(label);

    const qtyInput = document.createElement('input');
    qtyInput.type      = 'number';
    qtyInput.min       = '0';
    qtyInput.step      = '0.25';
    qtyInput.value     = String(adhocQuantity);
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
        opt.value       = unit.name;
        opt.textContent = unit.name || '(none)';
        if (unit.name === adhocUnitName) opt.selected = true;
        unitSelect.appendChild(opt);
    }
    unitSelect.addEventListener('change', () => { adhocUnitName = unitSelect.value; });
    root.appendChild(unitSelect);

    const confirmBtn = createButton('Add to list', () => {
        const factory  = (i as any)[adhocSelectedKey!] as (q?: number, u?: Unit) => Ingredient;
        const unit     = Object.values(u).find(uu => uu.name === adhocUnitName) ?? u.unit;
        const fresh    = factory(adhocQuantity, unit);
        const recipe   = createAdhocRecipe(fresh);
        registerRecipe(recipe);
        state.selectedRecipeIds.push(recipe.id);
        adhocSearchQuery = '';
        adhocSelectedKey = null;
        adhocQuantity    = 1;
        adhocUnitName    = '';
        navigateTo(adhocReturnScreen);
    });
    confirmBtn.className = 'adhoc-confirm';
    root.appendChild(confirmBtn);
}

// ============================================================
// SCREEN: COOKING
// ============================================================

function formatElapsed(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${String(s).padStart(2, '0')}s` : `${s}s`;
}


function renderCookingScreen(): void {
    const root = getElement<HTMLDivElement>('app');
    clear(root);

    if (state.cookingStartedAt === null) state.cookingStartedAt = Date.now();

    const selected = getSelectedRecipes().filter(r => !r.adhoc);
    state.cookingPlanSteps = buildCookingPlan(selected);

    if (selected.length > 1) {
        const totalSecs      = selected.reduce((s, r) => s + recipeCookSeconds(r), 0);
        const hardcodedTotal = selected.reduce((s, r) => s + (r.estimatedMinutes ? r.estimatedMinutes * 60 : 0), 0);
        const banner = document.createElement('div');
        banner.className   = 'cook-time-banner';
        banner.textContent = hardcodedTotal > 0
            ? `Total: ${formatCookTime(hardcodedTotal)} goal (${formatCookTime(totalSecs)} calculated)`
            : `Total cook time: ${formatCookTime(totalSecs)}`;
        root.appendChild(banner);
    }

    let lastRecipeId: string | undefined;

    // Every step renders in its natural recipe order, whether locked or not — a locked
    // step just looks/behaves locked in place (see applyLock). Nothing ever moves once
    // it's on screen, so unlocking never shifts the layout around it.
    for (let idx = 0; idx < state.cookingPlanSteps.length; idx++) {
        const step = state.cookingPlanSteps[idx];
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
                const hardcodedText  = recipe.estimatedMinutes ? `${recipe.estimatedMinutes} min` : null;

                const updateBadge = () => {
                    const secs = Math.floor((Date.now() - state.cookingStartedAt!) / 1000);
                    const estimateDisplay = hardcodedText
                        ? `estimated ${hardcodedText} (${calculatedText} calculated)`
                        : `estimated ${calculatedText}`;
                    badge.textContent = `${estimateDisplay} · actual ${formatElapsed(secs)}`;
                };
                updateBadge();

                if (state.cookingElapsedInterval !== null) window.clearInterval(state.cookingElapsedInterval);
                state.cookingElapsedInterval = window.setInterval(() => {
                    const hasSteps = document.querySelector(`#app .panel:not(.completed):not(.skipped)`);
                    if (!hasSteps) {
                        window.clearInterval(state.cookingElapsedInterval!);
                        state.cookingElapsedInterval = null;
                        return;
                    }
                    updateBadge();
                }, 1000);

                header.appendChild(title);
                header.appendChild(badge);
                header.appendChild(createSoundTestPanel());
                header.appendChild(createCopyButton(recipe.id));
                root.appendChild(header);
            }
        }

        if (step.type === 'info') {
            const group: Step[] = [step];
            while (
                idx + 1 < state.cookingPlanSteps.length &&
                state.cookingPlanSteps[idx + 1].type === 'info' &&
                state.cookingPlanSteps[idx + 1].recipeId === step.recipeId
            ) {
                idx++;
                group.push(state.cookingPlanSteps[idx]);
            }
            root.appendChild(renderInfoGroup(group));
            continue;
        }

        root.appendChild(renderStep(step));
    }

    root.appendChild(createStartOverButton());
}

function renderInfoGroup(steps: Step[]): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'panel info-step info-step-collapsed';

    const header = document.createElement('div');
    header.className = 'info-step-header';

    const caret = document.createElement('span');
    caret.className   = 'info-step-caret';
    caret.textContent = '▸';

    const label = document.createElement('span');
    label.className   = 'info-step-label';
    label.textContent = 'Notes';

    header.appendChild(caret);
    header.appendChild(label);

    const body = document.createElement('div');
    body.className = 'info-step-body';

    steps.forEach(step => {
        const line = document.createElement('div');
        line.className = 'info-step-note';
        line.textContent = step.text;
        body.appendChild(line);

        if (step.linkRecipeId) {
            const targetRecipe = state.recipes.get(step.linkRecipeId);
            const link = document.createElement('a');
            link.className   = 'info-step-link';
            link.href        = getRecipeURL(step.linkRecipeId);
            link.textContent = `→ ${targetRecipe?.name ?? 'Open recipe'}`;
            link.addEventListener('click', (ev) => ev.stopPropagation());
            line.appendChild(link);
        }
    });

    panel.appendChild(header);
    panel.appendChild(body);

    header.addEventListener('click', () => {
        const collapsed = panel.classList.toggle('info-step-collapsed');
        caret.textContent = collapsed ? '▸' : '▾';
    });

    return panel;
}

// ============================================================
// STEP LOCKING
// ============================================================

function applyLock(panel: HTMLElement, step: Step): void {
    const waitForIds = step.waitForIds;
    if (!waitForIds || waitForIds.length === 0) return;

    const appEl = document.getElementById('app');
    if (!appEl) return;

    const isUnlocked = () => waitForIds.every(id => {
        const el = document.getElementById(`step-${id}`);
        return !el || el.classList.contains('completed') || el.classList.contains('skipped') || el.classList.contains('ringing');
    });

    panel.classList.add('step-locked');
    const pill = document.createElement('div');
    pill.className   = 'waiting-pill';
    pill.textContent = '⏳ waiting…';
    panel.appendChild(pill);

    const unlock = () => {
        if (!isUnlocked()) return;
        observer.disconnect();
        panel.classList.remove('step-locked');
        pill.remove();
        panel.classList.add('step-unlocked');
        setTimeout(() => panel.classList.remove('step-unlocked'), 800);
    };

    const observer = new MutationObserver(unlock);
    observer.observe(appEl, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    setTimeout(unlock, 0);
}

// ============================================================
// STEP RENDERING
// ============================================================

function renderStep(step: Step, onDone?: () => void): HTMLElement {
    const panel = createPanel();
    panel.id    = `step-${step.id}`;

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
            if (remaining === 0) { panel.remove(); onDone?.(); }
        };

        step.children.forEach((child) => {
            if (step.waitForIds && !child.waitForIds) child.waitForIds = step.waitForIds;
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
        if (h) parts.push(`${h}h`);
        if (m) parts.push(`${m}m`);
        if (s || parts.length === 0) parts.push(`${s}s`);
        const badge = document.createElement('span');
        badge.className = 'timer-duration-badge';
        badge.textContent = parts.join(' ');
        panel.appendChild(badge);
    }

    if (step.type === 'timer') {
        let clickCount = 0;
        let clickTimer = 0;
        panel.addEventListener('click', () => {
            if (panel.classList.contains('step-locked')) return;
            if (panel.classList.contains('completed') || panel.classList.contains('skipped')) return;
            // While ringing, the document-wide click listener (see startAlarm) handles
            // dismissal — just make sure this handler doesn't restart the timer.
            if (panel.classList.contains('ringing')) return;
            if (!state.timers.has(step.id)) { startTimer(step, panel, onDone); return; }
            clickCount++;
            window.clearTimeout(clickTimer);
            if (clickCount >= 3) { clickCount = 0; skipTimer(step, panel, onDone); return; }
            clickTimer = window.setTimeout(() => { clickCount = 0; }, 600);
        });
        applyLock(panel, step);
        return panel;
    }

    if (step.type === 'gate') {
        let clickCount = 0;
        let clickTimer = 0;
        panel.addEventListener('click', () => {
            if (panel.classList.contains('step-locked')) return;
            if (panel.classList.contains('completed') || panel.classList.contains('skipped')) return;
            // While ringing, the document-wide click listener (see startAlarm) handles dismissal.
            if (panel.classList.contains('ringing')) return;
            if (!state.timers.has(step.id)) return; // awaiting a Yes/No answer, not a countdown
            clickCount++;
            window.clearTimeout(clickTimer);
            if (clickCount >= 3) { clickCount = 0; skipGateRetryTimer(step, panel, onDone); return; }
            clickTimer = window.setTimeout(() => { clickCount = 0; }, 600);
        });
        applyLock(panel, step);
        renderGateQuestion(step, panel, onDone);
        return panel;
    }

    if (step.type === 'info') {
        panel.textContent = '';
        panel.className = 'panel info-step info-step-collapsed';

        const header = document.createElement('div');
        header.className = 'info-step-header';

        const caret = document.createElement('span');
        caret.className   = 'info-step-caret';
        caret.textContent = '▸';

        const label = document.createElement('span');
        label.className   = 'info-step-label';
        label.textContent = 'Notes';

        header.appendChild(caret);
        header.appendChild(label);

        const body = document.createElement('div');
        body.className   = 'info-step-body';
        body.textContent = step.text;

        if (step.linkRecipeId) {
            const targetRecipe = state.recipes.get(step.linkRecipeId);
            const link = document.createElement('a');
            link.className   = 'info-step-link';
            link.href        = getRecipeURL(step.linkRecipeId);
            link.textContent = `→ ${targetRecipe?.name ?? 'Open recipe'}`;
            link.addEventListener('click', (ev) => ev.stopPropagation());
            body.appendChild(link);
        }

        panel.appendChild(header);
        panel.appendChild(body);

        header.addEventListener('click', () => {
            const collapsed = panel.classList.toggle('info-step-collapsed');
            caret.textContent = collapsed ? '▸' : '▾';
        });

        return panel;
    }

    panel.addEventListener('click', () => {
        if (panel.classList.contains('step-locked')) return;
        panel.classList.add('done-child');
        panel.remove();
        onDone?.();
    });

    applyLock(panel, step);
    return panel;
}

// `dueAt` — the timer's original deadline, if this completion followed a countdown (omitted
// for a gate's immediate "Yes", which never ran one) — lets the card show not just when it
// was acknowledged but how late that was, mirroring the overdue readout shown while ringing.
function completeTimer(step: Step, panel: HTMLElement, onDone?: () => void, dueAt?: number): void {
    panel.classList.remove('timer');
    panel.classList.add('completed');
    const completedAtMs = Date.now();
    const completedAt   = formatClockTime(completedAtMs);
    const runCount = state.gateRunCounts.get(step.id) ?? 0;
    const checkedSuffix = runCount > 0 ? ` (checked ${runCount}×)` : '';
    const overdueSuffix = dueAt !== undefined
        ? ` (up at ${formatClockTime(dueAt)} — overdue by ${formatOverdueDuration(Math.max(0, Math.round((completedAtMs - dueAt) / 1000)))})`
        : '';
    panel.textContent = `✓ ${step.text} — completed at ${completedAt}${overdueSuffix}${checkedSuffix}`;
    onDone?.();
}

function skipTimer(step: Step, panel: HTMLElement, onDone?: () => void): void {
    const intervalId = state.timers.get(step.id);
    if (intervalId !== undefined) { window.clearInterval(intervalId); state.timers.delete(step.id); }
    releaseWakeLockIfIdle();
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
        releaseWakeLockIfIdle();
        state.ringingAlarms.forEach((id) => window.clearInterval(id));
        state.ringingAlarms.clear();
        activeAlarms.clear();
        continuousRingSteps.clear();
        audio.loop = false;
        audio.pause();
        audio.currentTime = 0;
        state.gateRunCounts.clear();
        state.selectedRecipeIds = [];
        state.cookingPlanSteps  = [];
        state.searchQuery       = '';
        state.cookingStartedAt  = null;
        state.audioUnlocked     = false;
        nutritionExclusions.clear();
        nutritionRecipeExclusions.clear();
        nutritionExpanded.clear();
        for (const [id, recipe] of state.recipes) {
            if (recipe.adhoc) state.recipes.delete(id);
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

function navigateTo(screen: Screen): void {
    state.screen = screen;
    render();
}

// ============================================================
// WAKE LOCK
// ============================================================
//
// Prevents the screen from auto-locking while a timer/gate countdown is running. Without
// it, the screen sleeps mid-cook, the browser suspends the page's JS (including the
// countdown's setInterval), and a long timer can silently fail to ring.

let wakeLockSentinel: WakeLockSentinel | null = null;

async function acquireWakeLock(): Promise<void> {
    if (wakeLockSentinel || !('wakeLock' in navigator)) return;
    try {
        wakeLockSentinel = await navigator.wakeLock.request('screen');
        wakeLockSentinel.addEventListener('release', () => { wakeLockSentinel = null; });
    } catch (err) {
        console.error('Wake lock request failed:', err);
    }
}

function releaseWakeLockIfIdle(): void {
    if (state.timers.size > 0) return;
    wakeLockSentinel?.release();
    wakeLockSentinel = null;
}

// The wake lock is auto-released by the browser whenever the document is hidden (e.g. the
// user switches apps) — if a timer is still running when the page becomes visible again,
// re-acquire it rather than leaving the screen free to sleep for the rest of the cook.
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && state.timers.size > 0) acquireWakeLock();
});

// ============================================================
// TIMERS
// ============================================================

// Ticks against an absolute deadline (rather than decrementing a counter once per tick) so
// that a countdown suspended by the browser (backgrounded tab, locked screen) still fires
// immediately once the page wakes back up, instead of needing to "catch up" one tick at a
// time for however many seconds were left when it was suspended.
function formatClockTime(ms: number): string {
    return new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function runCountdown(
    step: Step,
    panel: HTMLElement,
    durationSeconds: number,
    formatLabel: (mm: string, ss: string, dueAtLabel: string) => string,
    onComplete: (dueAt: number) => void
): void {
    const endAt = Date.now() + durationSeconds * 1000;
    const dueAtLabel = formatClockTime(endAt);
    panel.classList.add('timer');
    acquireWakeLock();
    const intervalId = window.setInterval(() => {
        const remaining = Math.max(0, Math.round((endAt - Date.now()) / 1000));
        const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
        const ss = String(remaining % 60).padStart(2, '0');
        panel.textContent = formatLabel(mm, ss, dueAtLabel);
        if (Date.now() >= endAt) {
            window.clearInterval(intervalId);
            state.timers.delete(step.id);
            releaseWakeLockIfIdle();
            panel.classList.remove('timer');
            onComplete(endAt);
        }
    }, 1000);
    state.timers.set(step.id, intervalId);
}

function startTimer(step: Step, panel: HTMLElement, onDone?: () => void): void {
    if (!step.durationSeconds || state.timers.has(step.id)) return;
    runCountdown(
        step, panel, step.durationSeconds,
        (mm, ss, dueAtLabel) => `${mm}:${ss} ${step.text} — up at ${dueAtLabel} — tap 3× to skip`,
        (dueAt) => {
            if (panel.classList.contains('sound-check-btn')) {
                // Quick sound test button — beep once and reset immediately, no alarm loop.
                playSound(panel);
                completeTimer(step, panel, onDone, dueAt);
            } else {
                startAlarm(step, panel, dueAt, () => completeTimer(step, panel, onDone, dueAt));
            }
        }
    );
}

// ============================================================
// GATE (check-then-loop) STEPS
// ============================================================

function renderGateQuestion(step: Step, panel: HTMLElement, onDone?: () => void): void {
    panel.classList.remove('timer');
    panel.textContent = '';

    const question = document.createElement('div');
    question.className   = 'gate-question';
    question.textContent = step.text;
    panel.appendChild(question);

    const runCount = state.gateRunCounts.get(step.id) ?? 0;
    if (runCount > 0) {
        const runCountLabel = document.createElement('div');
        runCountLabel.className   = 'gate-run-count';
        runCountLabel.textContent = `Checked ${runCount}×`;
        panel.appendChild(runCountLabel);
    }

    const buttonRow = document.createElement('div');
    buttonRow.className = 'gate-button-row';

    const yesBtn = document.createElement('button');
    yesBtn.type        = 'button';
    yesBtn.className   = 'gate-yes-btn';
    yesBtn.textContent = 'Yes';
    yesBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (panel.classList.contains('step-locked')) return;
        completeTimer(step, panel, onDone);
    });

    const noBtn = document.createElement('button');
    noBtn.type        = 'button';
    noBtn.className   = 'gate-no-btn';
    noBtn.textContent = 'No';
    noBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (panel.classList.contains('step-locked')) return;
        startGateRetryTimer(step, panel, onDone);
    });

    buttonRow.appendChild(yesBtn);
    buttonRow.appendChild(noBtn);
    panel.appendChild(buttonRow);
}

function startGateRetryTimer(step: Step, panel: HTMLElement, onDone?: () => void): void {
    if (!step.durationSeconds || state.timers.has(step.id)) return;
    state.gateRunCounts.set(step.id, (state.gateRunCounts.get(step.id) ?? 0) + 1);
    panel.textContent = '';
    runCountdown(
        step, panel, step.durationSeconds,
        (mm, ss, dueAtLabel) => `${mm}:${ss} cooking more — up at ${dueAtLabel} — tap 3× to skip`,
        (dueAt) => {
            startAlarm(step, panel, dueAt, () => renderGateQuestion(step, panel, onDone));
        }
    );
}

function skipGateRetryTimer(step: Step, panel: HTMLElement, onDone?: () => void): void {
    const intervalId = state.timers.get(step.id);
    if (intervalId !== undefined) { window.clearInterval(intervalId); state.timers.delete(step.id); }
    releaseWakeLockIfIdle();
    panel.classList.remove('timer');
    renderGateQuestion(step, panel, onDone);
}

// ============================================================
// AUDIO
// ============================================================

const audio = new Audio('../src/sounds/pager-beep.mp3');

// audio.play() can silently reject (e.g. autoplay blocked after the page has sat idle/
// backgrounded for a while) — surface that visibly instead of only logging it, since a
// failed alarm sound is otherwise indistinguishable from a timer that's still running.
let soundBlockedBanner: HTMLElement | null = null;

function showSoundBlockedBanner(): void {
    if (soundBlockedBanner) return;
    const banner = document.createElement('div');
    banner.className   = 'sound-blocked-banner';
    banner.textContent = '🔇 Alarm sound was blocked by the browser — tap anywhere to enable it';
    document.body.appendChild(banner);
    soundBlockedBanner = banner;
}

function hideSoundBlockedBanner(): void {
    if (!soundBlockedBanner) return;
    soundBlockedBanner.remove();
    soundBlockedBanner = null;
}

// Attaches the specific error to the step that tried to ring, so it's visible without
// opening devtools. Skipped if the panel's already been replaced/removed (e.g. the sound
// test panel swaps itself out immediately after triggering the failed play()).
function showSoundErrorOnPanel(panel: HTMLElement, err: unknown): void {
    if (!panel.isConnected) return;
    const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    let errEl = panel.querySelector<HTMLElement>('.sound-error');
    if (!errEl) {
        errEl = document.createElement('div');
        errEl.className = 'sound-error';
        panel.appendChild(errEl);
    }
    errEl.textContent = `🔇 sound failed: ${message}`;
}

function playSound(panel?: HTMLElement): void {
    audio.currentTime = 0;
    audio.play().then(hideSoundBlockedBanner).catch((err) => {
        console.error(err);
        showSoundBlockedBanner();
        if (panel) showSoundErrorOnPanel(panel, err);
    });
}

// A timer/gate step that reaches zero shows a 30s countdown ("in case the
// initial sound is missed"), then rings continuously until the user taps
// anywhere on the site or hits Stop Alarm.
const ALARM_WARNING_SECONDS = 30;

// Steps whose alarm is currently ringing (countdown or continuous phase),
// keyed by step id, so a click anywhere on the page can dismiss them.
const activeAlarms = new Map<number, { panel: HTMLElement; onAcknowledge: () => void }>();
// Steps currently in the continuous-loop phase — the shared `audio` element only
// truly stops once none of them are ringing anymore.
const continuousRingSteps = new Set<number>();

// mm:ss for durations under an hour; h:mm:ss once overdue runs past 60 minutes.
function formatOverdueDuration(totalSeconds: number): string {
    const h  = Math.floor(totalSeconds / 3600);
    const m  = Math.floor((totalSeconds % 3600) / 60);
    const s  = totalSeconds % 60;
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function startAlarm(step: Step, panel: HTMLElement, dueAt: number, onAcknowledge: () => void): void {
    panel.classList.add('ringing');
    panel.textContent = '';

    const dueAtLabel = formatClockTime(dueAt);

    const label = document.createElement('div');
    label.className   = 'ringing-label';
    label.textContent = `⏰ ${step.text} — time's up!`;
    panel.appendChild(label);

    const countdown = document.createElement('div');
    countdown.className = 'ringing-countdown';
    panel.appendChild(countdown);

    const stopBtn = document.createElement('button');
    stopBtn.type        = 'button';
    stopBtn.className   = 'stop-alarm-btn';
    stopBtn.textContent = 'Stop Alarm';
    stopBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        acknowledgeAlarm(step.id);
    });
    panel.appendChild(stopBtn);

    activeAlarms.set(step.id, { panel, onAcknowledge });

    let remaining = ALARM_WARNING_SECONDS;
    let ringingContinuously = false;

    // Overdue keeps incrementing (based on the original deadline, not this alarm's start)
    // for as long as the alarm is left ringing, so a user who steps away can see exactly
    // how late they are when they come back — not just that they're late.
    const updateDisplay = (): void => {
        const overdue = Math.max(0, Math.round((Date.now() - dueAt) / 1000));
        const overdueLabel = `up at ${dueAtLabel} — overdue by ${formatOverdueDuration(overdue)}`;
        countdown.textContent = ringingContinuously
            ? overdueLabel
            : `${overdueLabel} — next alarm in ${remaining}s`;
    };

    updateDisplay();
    playSound(panel);

    const intervalId = window.setInterval(() => {
        if (!ringingContinuously) {
            remaining--;
            if (remaining <= 0) {
                ringingContinuously = true;
                startContinuousRing(step.id);
            }
        }
        updateDisplay();
    }, 1000);
    state.ringingAlarms.set(step.id, intervalId);
}

function startContinuousRing(stepId: number): void {
    continuousRingSteps.add(stepId);
    audio.loop = true;
    playSound(activeAlarms.get(stepId)?.panel);
}

function stopContinuousRing(stepId: number): void {
    continuousRingSteps.delete(stepId);
    if (continuousRingSteps.size === 0) {
        audio.loop = false;
        audio.pause();
        audio.currentTime = 0;
    }
}

function stopAlarm(stepId: number): void {
    const intervalId = state.ringingAlarms.get(stepId);
    if (intervalId !== undefined) { window.clearInterval(intervalId); state.ringingAlarms.delete(stepId); }
    stopContinuousRing(stepId);
    activeAlarms.delete(stepId);
    // Dismissing an alarm means the user has already dealt with it — don't leave the
    // "retry on next click" banner armed to unexpectedly blast sound on some later,
    // unrelated click (e.g. navigating away) that has nothing to do with this alarm.
    hideSoundBlockedBanner();
}

function acknowledgeAlarm(stepId: number): void {
    const alarm = activeAlarms.get(stepId);
    if (!alarm) return; // already acknowledged
    stopAlarm(stepId);
    alarm.panel.classList.remove('ringing');
    alarm.onAcknowledge();
}

// Any interaction anywhere on the page — any button, any click — dismisses
// whatever alarm(s) are currently ringing.
document.addEventListener('click', () => {
    // Capture before dismissing: retry blocked playback only when this click is actually
    // dismissing a still-active (blocked) alarm, so the user hears at least one beep for
    // it — not for every future unrelated click for the rest of the session.
    const retryBlockedSound = activeAlarms.size > 0 && soundBlockedBanner !== null;
    for (const stepId of [...activeAlarms.keys()]) acknowledgeAlarm(stepId);
    if (retryBlockedSound) playSound();
});

function createSoundTestPanel(): HTMLElement {
    const step = timerStep('🔔 Sound Test', 1);
    const panel = renderStep(step, () => panel.replaceWith(createSoundTestPanel()));
    panel.classList.add('sound-check-btn');
    return panel;
}



// ============================================================
// URL ROUTING
// ============================================================

function getRecipeIdFromURL(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('recipe');
}

// ============================================================
// SCREEN: PREP
// ============================================================

function renderPrepScreen(): void {
    const root = getElement<HTMLDivElement>('app');
    clear(root);

    const heading = document.createElement('h2');
    heading.textContent = 'Prep';
    root.appendChild(heading);

    function collectPrepSteps(steps: Step[]): Step[] {
        const out: Step[] = [];
        for (const s of steps) {
            if (s.prep) out.push(s);
            if (s.children) out.push(...collectPrepSteps(s.children));
        }
        return out;
    }

    function collectInfoSteps(steps: Step[]): Step[] {
        const out: Step[] = [];
        for (const s of steps) {
            if (s.type === 'info') out.push(s);
            if (s.children) out.push(...collectInfoSteps(s.children));
        }
        return out;
    }

    let anyFound = false;
    getSelectedRecipes().filter(r => !r.adhoc).forEach(recipe => {
        const count = state.selectedRecipeIds.filter(id => id === recipe.id).length;
        const prepSteps = collectPrepSteps(recipe.steps);
        if (prepSteps.length === 0) return;
        anyFound = true;

        const title = document.createElement('div');
        title.className = 'prep-recipe-title';
        title.textContent = recipe.name + (count > 1 ? ` ×${count}` : '');
        root.appendChild(title);

        const infoSteps = collectInfoSteps(recipe.steps);
        if (infoSteps.length > 0) {
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
            infoSteps.forEach(step => {
                const line = document.createElement('div');
                line.className = 'prep-info-line';
                line.textContent = step.text;
                noteBody.appendChild(line);
            });

            note.appendChild(noteHeader);
            note.appendChild(noteBody);
            root.appendChild(note);
        }

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

function render(): void {
    switch (state.screen) {
        case 'select':         return renderSelectScreen();
        case 'shopping':       return renderShoppingScreen();
        case 'cooking':        return renderCookingScreen();
        case 'nutrition':      return renderNutritionScreen();
        case 'add-ingredient': return renderAddIngredientScreen();
        case 'prep':           return renderPrepScreen();
        case 'plan':           return renderPlanScreen();
    }
}

// ============================================================
// SCREEN: PLAN
// ============================================================

function toMinutes(hhmm: string): number {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
}

function fromMinutes(mins: number): string {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    const ampm = h < 12 ? 'AM' : 'PM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

interface ScheduledItem {
    recipe: Recipe;
    count: number;
    startMin: number;
    blockType: 'home' | 'portable';
    afterCutoff: boolean;
}

function schedulePlan(cfg: PlanConfig, recipes: { recipe: Recipe; count: number }[]): { scheduled: ScheduledItem[]; unscheduled: { recipe: Recipe; count: number }[] } {
    const cutoffMin = toMinutes(cfg.caloriesCutoff);
    const blocks = [...cfg.blocks]
        .filter(b => b.type !== 'away')
        .sort((a, b) => toMinutes(a.start) - toMinutes(b.start));

    const cursors = new Map<string, number>();
    blocks.forEach(b => cursors.set(b.id, toMinutes(b.start)));

    const scheduled: ScheduledItem[] = [];
    const unscheduled: { recipe: Recipe; count: number }[] = [];

    for (const { recipe, count } of recipes) {
        const dur = recipe.planMinutes ?? 0;
        const needsHome = !recipe.portable;

        const compatible = blocks.filter(b => needsHome ? b.type === 'home' : true);
        let placed = false;

        for (const block of compatible) {
            const cursor = cursors.get(block.id)!;
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
        if (!placed) unscheduled.push({ recipe, count });
    }

    scheduled.sort((a, b) => a.startMin - b.startMin);
    return { scheduled, unscheduled };
}

function renderPlanScreen(): void {
    const root = getElement<HTMLDivElement>('app');
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
            startIn.type = 'time'; startIn.value = block.start; startIn.className = 'plan-time-input';
            startIn.addEventListener('change', () => { cfg.blocks[idx].start = startIn.value; savePlanConfig(cfg); scheduleAndRender(); });

            const sep = document.createElement('span');
            sep.textContent = '→'; sep.className = 'plan-block-sep';

            const endIn = document.createElement('input');
            endIn.type = 'time'; endIn.value = block.end; endIn.className = 'plan-time-input';
            endIn.addEventListener('change', () => { cfg.blocks[idx].end = endIn.value; savePlanConfig(cfg); scheduleAndRender(); });

            const typeSelect = document.createElement('select');
            typeSelect.className = 'plan-type-select';
            [['home', '🏠 Home'], ['portable', '🎒 Portable'], ['away', '🏢 Away']].forEach(([val, label]) => {
                const opt = document.createElement('option');
                opt.value = val; opt.textContent = label;
                if (val === block.type) opt.selected = true;
                typeSelect.appendChild(opt);
            });
            typeSelect.addEventListener('change', () => { cfg.blocks[idx].type = typeSelect.value as PlanBlock['type']; savePlanConfig(cfg); scheduleAndRender(); });

            const delBtn = document.createElement('button');
            delBtn.textContent = '×'; delBtn.className = 'plan-block-del';
            delBtn.addEventListener('click', () => { cfg.blocks.splice(idx, 1); savePlanConfig(cfg); renderBlocks(); scheduleAndRender(); });

            row.appendChild(startIn); row.appendChild(sep); row.appendChild(endIn);
            row.appendChild(typeSelect); row.appendChild(delBtn);
            blockList.appendChild(row);
        });

        const addBtn = document.createElement('button');
        addBtn.textContent = '+ Add Block'; addBtn.className = 'plan-add-block-btn';
        addBtn.addEventListener('click', () => {
            const last = cfg.blocks[cfg.blocks.length - 1];
            const newStart = last ? last.end : '07:00';
            const [h, m] = newStart.split(':').map(Number);
            const newEnd = `${String(Math.min(h + 1, 23)).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
            cfg.blocks.push({ id: String(Date.now()), start: newStart, end: newEnd, type: 'home' });
            savePlanConfig(cfg); renderBlocks(); scheduleAndRender();
        });
        blockList.appendChild(addBtn);
    }

    const cutoffRow = document.createElement('div');
    cutoffRow.className = 'plan-cutoff-row';
    const cutoffLabel = document.createElement('span');
    cutoffLabel.textContent = '🎯 Calorie cutoff (eat before):';
    cutoffLabel.className = 'plan-cutoff-label';
    const cutoffIn = document.createElement('input');
    cutoffIn.type = 'time'; cutoffIn.value = cfg.caloriesCutoff; cutoffIn.className = 'plan-time-input';
    cutoffIn.addEventListener('change', () => { cfg.caloriesCutoff = cutoffIn.value; savePlanConfig(cfg); scheduleAndRender(); });
    cutoffRow.appendChild(cutoffLabel); cutoffRow.appendChild(cutoffIn);
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
        const deduped: { recipe: Recipe; count: number }[] = [];
        const seen = new Set<string>();
        for (const id of state.selectedRecipeIds) {
            const r = state.recipes.get(id);
            if (!r || r.adhoc) continue;
            if (seen.has(id)) { const e = deduped.find(x => x.recipe.id === id); if (e) e.count++; }
            else { seen.add(id); deduped.push({ recipe: r, count: 1 }); }
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

            const meta: string[] = [];
            if (recipe.planMinutes) meta.push(`${recipe.planMinutes} min`);
            if (recipe.portable) meta.push('portable');
            if (afterCutoff) meta.push('⚠ after cutoff');

            const metaEl = document.createElement('span');
            metaEl.className = 'plan-slot-meta';
            metaEl.textContent = meta.join(' · ');

            card.appendChild(timeEl); card.appendChild(nameEl); card.appendChild(metaEl);
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
                const mins = recipe.prepMinutes!;
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

/* Block pinch-zoom gestures page-wide (belt-and-suspenders alongside the viewport meta
   tag's maximum-scale/user-scalable, which some iOS versions/accessibility settings can
   partially override) — still allow normal scrolling in both directions. */
html, body { touch-action: pan-x pan-y; }

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

.show-hidden-toggle {
    font-size: 14px;
    padding: 8px 14px;
    border-radius: 8px;
    border: 1px solid #555;
    background: #2a2a2a;
    color: #aaa;
    cursor: pointer;
    margin-bottom: 16px;
}
.show-hidden-toggle:hover { background: #3a3a3a; border-color: #888; color: #f0f0f0; }

.hidden-badge {
    margin-left: 10px;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #888;
    border: 1px solid #555;
    border-radius: 10px;
    padding: 2px 8px;
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
.prep-info-line { padding: 8px 0; }
.prep-info-line:first-child { padding-top: 0; }
.prep-info-line:not(:first-child) { border-top: 1px dashed #374151; }
/* ── Info step (cooking screen) ── */
.info-step { cursor: default !important; border-color: #2a2a2a; background: #111827; }
.info-step-header { display: flex; align-items: center; gap: 8px; cursor: pointer; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; user-select: none; }
.info-step-caret { font-size: 11px; }
.info-step-body { margin-top: 12px; font-size: 18px; color: #d1d5db; }
.info-step-note { padding: 10px 0; }
.info-step-note:first-child { padding-top: 0; }
.info-step-note:not(:first-child) { border-top: 1px dashed #2a2a2a; }
.info-step-link { display: block; margin-top: 10px; color: #60a5fa; font-size: 17px; text-decoration: none; }
.info-step-link:hover { text-decoration: underline; }
.info-step-collapsed .info-step-body { display: none; }

#recipe-list { padding-bottom: 120px; }
.build-footer { margin-top: 24px; text-align: center; font-size: 12px; color: #666; }

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

.panel.ringing { background: #7f1d1d; color: white; border-color: #ef4444; animation: alarmPulse 1s ease-in-out infinite; }
@keyframes alarmPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.65; } }
.ringing-label { font-weight: 600; }
.ringing-countdown { margin-top: 6px; font-size: 15px; opacity: 0.85; }

.sound-blocked-banner {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    background: #7f1d1d; color: white; border-bottom: 2px solid #ef4444;
    padding: 10px 16px; text-align: center; font-size: 15px; font-weight: 600;
    cursor: pointer; animation: alarmPulse 1s ease-in-out infinite;
}
.sound-error {
    margin-top: 8px; font-size: 13px; font-weight: 600; color: #fecaca;
    background: rgba(0, 0, 0, 0.25); border-radius: 6px; padding: 4px 8px;
}
.stop-alarm-btn {
    display: block; width: 100%; margin-top: 14px; font-size: 20px; padding: 14px;
    border-radius: 10px; border: 2px solid #fca5a5; background: #991b1b; color: white;
    cursor: pointer; font-weight: 600;
}
.stop-alarm-btn:hover { background: #b91c1c; }

.gate-question { margin-bottom: 14px; }
.gate-run-count { margin: -8px 0 14px; font-size: 13px; opacity: 0.75; }
.gate-button-row { display: flex; gap: 12px; }
.gate-yes-btn, .gate-no-btn {
    flex: 1; font-size: 20px; padding: 14px; border-radius: 10px; border: 2px solid;
    cursor: pointer; font-weight: 600;
}
.gate-yes-btn { background: #1a5c2a; border-color: #2d9e4a; color: white; }
.gate-no-btn  { background: #7f1d1d; border-color: #ef4444; color: white; }

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

.inventory-row { margin-top: 10px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; cursor: default; }
.inventory-have-label { font-size: 14px; color: #888; }
.inventory-have-input {
    width: 70px; font-size: 16px; padding: 4px 8px; border-radius: 6px;
    border: 1px solid #444; background: #1a1a1a; color: #f0f0f0;
}
.inventory-have-input:focus { outline: none; border-color: #60a5fa; background: #1e2a3a; }
.inventory-needed { font-size: 14px; color: #f59e0b; }
.inventory-needed.inventory-satisfied { color: #2d9e4a; font-weight: 600; }
.inventory-package-hint { font-size: 12px; color: #666; font-style: italic; width: 100%; }

.start-over-btn { margin-top: 32px; font-size: 20px; padding: 16px 32px; border-radius: 12px; border: 2px solid #444; background: #222; color: #f0f0f0; cursor: pointer; }

.empty { color: #666; font-style: italic; }

.recipe-title-row { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
.recipe-title-row h2 { margin: 0; flex: 1; }
.recipe-title-row .copy-link-btn { margin-left: auto; }
.cook-time-badge { font-size: 16px; color: #888; white-space: nowrap; }
.cook-time-banner { font-size: 16px; color: #888; border: 1px solid #333; border-radius: 10px; padding: 10px 16px; margin-bottom: 16px; text-align: center; }

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

.nutrition-bulk-actions { display: flex; gap: 8px; margin: 0 0 14px; }
.nutrition-bulk-btn { font-size: 13px; padding: 6px 12px; border-radius: 8px; border: 1px solid #555; background: #2a2a2a; color: #aaa; cursor: pointer; }
.nutrition-bulk-btn:hover { background: #3a3a3a; border-color: #888; color: #f0f0f0; }

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
.nutrition-recipe-excluded { opacity: 0.5; }
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
.suggestion-more-hint { font-size: 13px; color: #888; padding: 8px 0; }

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

    .inventory-have-input { width: 58px; font-size: 14px; }
    .inventory-have-label, .inventory-needed { font-size: 13px; }

    /* Nutrition header: allow sub to wrap below the name row */
    .nutrition-recipe-header { flex-wrap: wrap; }
    .nutrition-recipe-sub { white-space: normal; flex-basis: 100%; text-align: left; padding-left: 26px; }
    .nutrition-recipe-name { font-size: 18px; }

    .panel { font-size: 18px; padding: 14px; }
}
`;

// ============================================================
// BUILD INFO
// ============================================================

// Replaced with the real compile timestamp by scripts/validate-recipes.js's postbuild
// step, right after `tsc` emits dist/file.js. Left as-is (and reported as "dev build")
// when running straight from source, e.g. under `vite`.
const BUILD_TIME = '__BUILD_TIME__';

function formatBuildTime(): string {
    const date = new Date(BUILD_TIME);
    if (isNaN(date.getTime())) return 'dev build';
    return date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}

function appendBuildFooter(root: HTMLElement): void {
    const footer = document.createElement('div');
    footer.className   = 'build-footer';
    footer.textContent = `Last compiled: ${formatBuildTime()}`;
    root.appendChild(footer);
}

// ============================================================
// BOOTSTRAP
// ============================================================

function bootstrap(): void {
    document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);
    document.body.innerHTML = `<div id="app"></div>`;
    document.addEventListener('click', () => unlockAudioContext(), { once: true });

    // iOS Safari fires its own non-standard gesture events for pinch-zoom that aren't
    // fully covered by touch-action — block those directly. Feature-detected since only
    // WebKit dispatches them.
    if ('ongesturestart' in document) {
        document.addEventListener('gesturestart', (e) => e.preventDefault());
    }

    const recipeIdFromURL = getRecipeIdFromURL();
    if (recipeIdFromURL && state.recipes.has(recipeIdFromURL)) {
        state.selectedRecipeIds = [recipeIdFromURL];
        unlockAudioContext();
        navigateTo('cooking');
    } else {
        render();
    }
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

type IngredientDefaults = Partial<Omit<Ingredient, typeof __ingredient>>;

// Every ingredient must resolve to real nutrition data — there is no "missing" path. That data
// can live in exactly one of two places, and the two overloads below are what enforce it at
// compile time:
//   1. A single `nutrition` label on the ingredient itself — for a true single product just
//      sold at multiple retailers (e.g. the same jar of jam at Amazon vs. Whole Foods).
//   2. `nutrition` on every entry in `products` — for a genuine multi-SKU category (e.g. peanut
//      butter: Organic Unsweetened / Creamy / Crunchy really do have different macros, so no
//      single generic number would be honest for whichever variant isn't selected).
// Passing neither is a compile error, not a silently-missing-data ingredient.
function ingredientFactory(
    name: string,
    defaults: IngredientDefaults & { nutrition: NutritionLabel }
): (quantity?: number, unit?: Unit) => Ingredient;
function ingredientFactory(
    name: string,
    defaults: IngredientDefaults & { products: (Product & { nutrition: NutritionLabel })[] }
): (quantity?: number, unit?: Unit) => Ingredient;
function ingredientFactory(name: string, defaults: IngredientDefaults = {}) {
    return (quantity = 0, unit: Unit = u.none): Ingredient => {
        const ing: any = { name, quantity, unit, ...defaults };
        ing.rename = (newName: string) => { ing.name = newName; };
        return ing as unknown as Ingredient;
    };
}

// ============================================================
// ITEMS
// ============================================================

export const i = {
    // No nutrition available yet — a real fruit with meaningful calories/carbs, so a zero
    // placeholder would be actively misleading.
    // Generic/typical nutrition (not from this listing's own label) — a standard whole
    // grapefruit, ~236g. Real produce values, just not brand-specific.
    grapefruit: ingredientFactory('Pink Grapefruit', {
        defaultBrand: 'Organic',
        products: [{
            brand: 'Organic', variant: 'Red Grapefruit', size: 1, sizeUnit: u.unit,
            listings: [{ price: 1.79, link: 'https://www.amazon.com/Fresh-Produce-Brands-Vary-B000P6G148/dp/B000P6G148' }],
            nutrition: {
                [u.unit.name]: { servings: 1, servingSize: 1, calories: 100, fat: 0.2, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 25, sodium: 0, sugar: 16, protein: 2, fiber: 4 },
            },
        }],
    }),

    // Nutrition zeroed at the user's request — vinegar is close enough to calorie-free at
    // typical usage to be a defensible placeholder (same reasoning as whiteVinegar above).
    champagneVinegar: ingredientFactory('Champagne Vinegar', {
        defaultBrand: 'O Olive Oil & Vinegar',
        products: [{
            brand: 'O Olive Oil & Vinegar', variant: 'California Champagne Vinegar', size: 10.1, sizeUnit: u.fluidOunce,
            listings: [{ price: 7.96, link: 'https://www.amazon.com/Olive-Oil-California-Champagne-Vinegar/dp/B07CQQ35PK' }],
            nutrition: {
                [u.milliliter.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    // Generic/typical nutrition (not from this listing's own label) — salt is essentially
    // pure sodium chloride regardless of brand, so ~2300mg sodium/tsp is a standard real value.
    seaSalt: ingredientFactory('Sea Salt', {
        defaultBrand: 'Ancient',
        products: [{
            brand: 'Ancient', variant: 'Spring Salt, Organic', size: 7, sizeUnit: u.ounce, organic: true,
            listings: [{ price: 14.5, link: 'https://www.amazon.com/Spring-Salt-Organic-Natural-Microplastic/dp/B091V3KBC2' }],
            nutrition: {
                [u.tsp.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 2300, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    // Nutrition zeroed at the user's request — the label is image-only on Amazon (typical
    // for dried herbs), so this is a placeholder, not a real (scraped or measured) value.
    rosemary: ingredientFactory('Rosemary', {
        defaultBrand: '365',
        products: [{
            brand: '365', variant: 'Organic', organic: true,
            listings: [{ store: stores.wholeFoods, price: 3.99, link: 'https://www.amazon.com/365-Everyday-Value-Organic-Rosemary/dp/B074H6M37H' }],
            nutrition: {
                [u.tsp.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    // Generic/typical nutrition (not from this listing's own label) — standard mushroom
    // values, per roughly one whole king trumpet mushroom (~100g).
    kingOysterMushroom: ingredientFactory('King Trumpet Mushroom', {
        defaultBrand: 'Mushroom King Farm',
        products: [{
            brand: 'Mushroom King Farm', variant: 'Organic Sliced', size: 4, sizeUnit: u.ounce, organic: true,
            listings: [{ price: 6.29, link: 'https://www.amazon.com/MUSHROOM-Organic-King-Trumpet-Mushrooms/dp/B0F9LQG2V8' }],
            nutrition: {
                [u.unit.name]: { servings: 1, servingSize: 1, calories: 22, fat: 0.3, saturatedFat: 0.1, transFat: 0, cholesterol: 0, carbs: 3, sodium: 5, sugar: 2, protein: 3, fiber: 1 },
            },
        }],
    }),

    cassavaFlour: ingredientFactory('Cassava Flour', {
        defaultBrand: "Otto's Naturals",
        products: [{
            brand: "Otto's Naturals", variant: 'Organic', size: 1.5, sizeUnit: u.pound, organic: true,
            listings: [{ price: 19.99, link: 'https://www.amazon.com/Ottos-Naturals-Organic-Grain-Free-Gluten-Free/dp/B08QZVC7WH' }],
            nutrition: {
                [u.cup.name]: { servings: 1, servingSize: 0.25, calories: 110, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 28, sodium: 0, sugar: 0, protein: 1, fiber: 3 },
            },
        }],
    }),

    cornstarch: ingredientFactory('Corn Starch', {
        defaultBrand: '365',
        products: [{
            brand: '365', size: 16, sizeUnit: u.ounce,
            listings: [{ store: stores.wholeFoods, price: 2.18, link: 'https://www.amazon.com/365-Everyday-Value-Corn-Starch/dp/B074H67H5C' }],
            nutrition: {
                [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 30, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 7, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    // Generic/typical nutrition (not from this listing's own label) — standard fennel bulb
    // values, per one medium bulb (~234g).
    fennel: ingredientFactory('Fennel', {
        defaultBrand: 'Organic',
        products: [{
            brand: 'Organic', size: 1, sizeUnit: u.unit,
            listings: [{ price: 2.21, link: 'https://www.amazon.com/Fresh-Produce-Brands-May-Vary/dp/B00E3J6RC4' }],
            nutrition: {
                [u.unit.name]: { servings: 1, servingSize: 1, calories: 73, fat: 0.5, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 17, sodium: 122, sugar: 9, protein: 3, fiber: 7 },
            },
        }],
    }),

    // Generic/typical nutrition (not from this listing's own label) — standard radicchio
    // values, per one head (~350g).
    radicchio: ingredientFactory('Radicchio', {
        defaultBrand: 'Organic',
        products: [{
            brand: 'Organic', size: 1, sizeUnit: u.unit,
            listings: [{ price: 4.61, link: 'https://www.amazon.com/produce-aisle-101767-Organic-Radicchio/dp/B00E3KS6LS' }],
            nutrition: {
                [u.unit.name]: { servings: 1, servingSize: 1, calories: 81, fat: 0.9, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 16, sodium: 77, sugar: 2, protein: 5, fiber: 3 },
            },
        }],
    }),

    // Nutrition zeroed at the user's request — the label is image-only on Amazon (typical
    // for dried herbs), so this is a placeholder, not a real (scraped or measured) value.
    dillWeed: ingredientFactory('Dill Weed', {
        defaultBrand: '365',
        products: [{
            brand: '365', variant: 'Organic', size: 0.46, sizeUnit: u.ounce, organic: true,
            listings: [{ store: stores.wholeFoods, price: 3.99, link: 'https://www.amazon.com/365-Everyday-Value-Organic-Dill/dp/B074H773GP' }],
            nutrition: {
                [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    // Nutrition zeroed at the user's request — the label is image-only on Amazon; distilled
    // white vinegar is also close enough to calorie-free at typical usage to be a defensible
    // placeholder even so, but flagging same as the others since it's not from a real label.
    whiteVinegar: ingredientFactory('White Vinegar', {
        defaultBrand: '365',
        products: [{
            brand: '365', variant: 'Organic Distilled', size: 32, sizeUnit: u.fluidOunce, organic: true,
            listings: [{ store: stores.wholeFoods, price: 2.99, link: 'https://www.amazon.com/365-Everyday-Value-Organic-Distilled/dp/B074J6FD4L' }],
            nutrition: {
                [u.tsp.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    thyme: ingredientFactory('Thyme', {
        defaultBrand: '365',
        products: [{
            brand: '365', variant: 'Organic', size: 0.67, sizeUnit: u.ounce, organic: true,
            listings: [{ store: stores.wholeFoods, price: 3.99, link: 'https://www.amazon.com/365-Everyday-Value-Organic-Thyme/dp/B074HBKSCL' }],
            nutrition: {
                [u.tsp.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    // Generic/typical nutrition — recipes use this by the spray (a mister/pump dose, ~0.2g),
    // which is genuinely small enough that standard cooking-oil-spray labels round it to
    // 0 cal/0g fat per spray (the same convention as e.g. PAM) — not a placeholder zero.
    avocadoOil: ingredientFactory('Avocado Oil', {
        defaultBrand: 'Chosen Foods',
        products: [{
            brand: 'Chosen Foods', variant: 'Organic 100% Avocado Oil', size: 16.9, sizeUnit: u.fluidOunce, organic: true,
            listings: [{ price: 14.99, link: 'https://www.amazon.com/CHOSEN-FOODS-Organic-100-Avocado/dp/B0CTCXXG2J' }],
            nutrition: {
                [u.spray.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    // Generic/typical nutrition (not from this listing's own label) — standard honey-mustard
    // dressing values, per 1 tbsp (15g).
    honeyDijonMustard: ingredientFactory('Honey Dijon Mustard', {
        defaultBrand: 'SideDish',
        products: [{
            brand: 'SideDish', variant: 'Honey Dijon Dressing', size: 8, sizeUnit: u.fluidOunce,
            listings: [{ price: 9.99, link: 'https://www.amazon.com/SideDish-Honey-Dijon-Dressing-OZ/dp/B0CSTW8YFP' }],
            nutrition: {
                [u.gram.name]: { servings: 1, servingSize: 15, calories: 50, fat: 4.5, saturatedFat: 0.5, transFat: 0, cholesterol: 0, carbs: 3, sodium: 90, sugar: 3, protein: 0, fiber: 0 },
            },
        }],
    }),

    // Generic/typical nutrition (not from this listing's own label) — a standard medium
    // orange, ~131g.
    orange: ingredientFactory('Orange', {
        defaultBrand: 'Organic',
        products: [{
            brand: 'Organic', variant: 'Valencia', size: 1, sizeUnit: u.unit,
            listings: [{ price: 1.32, link: 'https://www.amazon.com/365-by-Whole-Foods-Market/dp/B003TQ3554' }],
            nutrition: {
                [u.unit.name]: { servings: 1, servingSize: 1, calories: 62, fat: 0.2, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 15, sodium: 0, sugar: 12, protein: 1, fiber: 3 },
            },
        }],
    }),

    // Generic/typical nutrition (not from this listing's own label) — standard arugula
    // values, per 100g.
    arugula: ingredientFactory('Arugula', {
        defaultBrand: '365',
        products: [{
            brand: '365', variant: 'Organic Baby Arugula Salad', size: 5, sizeUnit: u.ounce, organic: true,
            listings: [{ store: stores.wholeFoods, price: 3.99, link: 'https://www.amazon.com/365-Whole-Foods-Market-Organic/dp/B09ZHX8Y9V' }],
            nutrition: {
                [u.gram.name]: { servings: 1, servingSize: 100, calories: 25, fat: 0.7, saturatedFat: 0.1, transFat: 0, cholesterol: 0, carbs: 4, sodium: 27, sugar: 2, protein: 3, fiber: 2 },
            },
        }],
    }),

    // Cholesterol left at 0 — the scraped nutrition table for this listing didn't include a
    // cholesterol line at all (dairy sour cream normally has some), so that field specifically
    // is unconfirmed rather than a verified zero. Everything else here is real scraped data.
    sourCream: ingredientFactory('Sour Cream', {
        defaultBrand: '365',
        products: [{
            brand: '365', variant: 'Organic', size: 16, sizeUnit: u.ounce, organic: true,
            listings: [{ store: stores.wholeFoods, price: 3.39, link: 'https://www.amazon.com/365-Whole-Foods-Market-Organic/dp/B07BS4YGL5' }],
            nutrition: {
                [u.tbsp.name]: { servings: 8, servingSize: 2, calories: 60, fat: 5, saturatedFat: 3, transFat: 0, cholesterol: 0, carbs: 2, sodium: 20, sugar: 2, protein: 1, fiber: 0 },
            },
        }],
    }),

    paprika: ingredientFactory('Paprika', {
        defaultBrand: '365',
        products: [{
            brand: '365', variant: 'Organic', size: 1.69, sizeUnit: u.ounce, organic: true,
            listings: [{ store: stores.wholeFoods, price: 3.99, link: 'https://www.amazon.com/365-Everyday-Value-Organic-Paprika/dp/B074H81LWT' }],
            nutrition: {
                [u.tsp.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    // Nutrition zeroed at the user's request — Amazon's label for this listing is
    // image-only, so this is a placeholder, not a real (scraped or measured) value.
    garlicPowder: ingredientFactory('Garlic Powder', {
        defaultBrand: '365',
        products: [{
            brand: '365', variant: 'Organic', size: 2.33, sizeUnit: u.ounce, organic: true,
            listings: [{ store: stores.wholeFoods, price: 3.99, link: 'https://www.amazon.com/365-Everyday-Value-Organic-Garlic/dp/B00JJZ57FK' }],
            nutrition: {
                [u.tsp.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    // Generic/typical nutrition (not from this listing's own label) — standard mayonnaise
    // values, scaled up from a typical ~94 cal/tbsp to a full cup (16 tbsp), matching how
    // this ingredient is actually consumed in the one recipe that uses it.
    mayonnaise: ingredientFactory('Mayonnaise', {
        defaultBrand: '365',
        products: [{
            brand: '365', variant: 'Organic Squeezable', size: 11.2, sizeUnit: u.fluidOunce, organic: true,
            listings: [{ store: stores.wholeFoods, price: 3.79, link: 'https://www.amazon.com/365-Everyday-Value-Mayonnaise-Squeezable/dp/B074H64C5R' }],
            nutrition: {
                [u.cup.name]: { servings: 1, servingSize: 1, calories: 1500, fat: 165, saturatedFat: 25, transFat: 0, cholesterol: 100, carbs: 0, sodium: 1400, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    babyBellaMushroom: ingredientFactory('Baby Bella Mushroom', {
        defaultBrand: '365',
        products: [{
            brand: '365', variant: 'Organic Whole', size: 8, sizeUnit: u.ounce, organic: true,
            listings: [{ store: stores.wholeFoods, price: 3.79, link: 'https://www.amazon.com/365-Everyday-Value-Organic-Mushrooms/dp/B07NQDLF47' }],
            nutrition: {
                [u.gram.name]: { servings: 2, servingSize: 84, calories: 18, fat: 0.29, saturatedFat: 0.05, transFat: 0, cholesterol: 0, carbs: 3.3, sodium: 8, sugar: 2.1, protein: 1.772, fiber: 1.1 },
            },
        }],
    }),

    // Generic/typical nutrition (not from this listing's own label) — standard plant-based
    // Italian sausage values, scaled to the whole 10oz (283g) package (recipe consumes it as
    // "1 bag").
    abbotPeaItalianSausage: ingredientFactory('Abbot\'s Plant-Based Italian Sausage', {
        defaultBrand: "Abbot's",
        products: [{
            brand: "Abbot's", size: 10, sizeUnit: u.ounce,
            listings: [{ price: 9.49, link: 'https://www.amazon.com/Abbots-Plant-Based-Italian-Gluten-Free-High-Protein/dp/B0FB447RLJ' }],
            nutrition: {
                [u.bag.name]: { servings: 1, servingSize: 1, calories: 570, fat: 34, saturatedFat: 6, transFat: 0, cholesterol: 0, carbs: 23, sodium: 1700, sugar: 3, protein: 45, fiber: 8 },
            },
        }],
    }),

    egg: ingredientFactory('Egg', {
        defaultBrand: '365',
        products: [{
            brand: '365', variant: 'Organic Large Brown Grade A (12 Count)', size: 12, sizeUnit: u.unit, organic: true,
            listings: [{ store: stores.wholeFoods, price: 5.99, link: 'https://www.amazon.com/365-Everyday-Value-Brown-Organic/dp/B07PDH5138' }],
            nutrition: {
                [u.unit.name]: { servings: 12, servingSize: 1, calories: 80, fat: 5, saturatedFat: 2, transFat: 0, cholesterol: 210, carbs: 0, sodium: 80, sugar: 0, protein: 7, fiber: 0 },
            },
        }],
    }),

    spaghettiSauce: ingredientFactory('Spaghetti Sauce', {
        defaultBrand: '365',
        products: [{
            brand: '365', variant: 'Organic 4 Cheese Pasta Sauce', size: 25, sizeUnit: u.ounce, organic: true,
            listings: [{ store: stores.wholeFoods, price: 3.49, link: 'https://www.amazon.com/365-Everyday-Value-Organic-Cheese/dp/B074H66176' }],
            nutrition: {
                // Recipe consumes this as "1 bag" (the whole 25oz jar) — label is 1/2 cup
                // (118g), 6 servings/container, so these are the per-jar totals (per-serving × 6).
                [u.bag.name]: { servings: 1, servingSize: 1, calories: 420, fat: 21, saturatedFat: 6, transFat: 0, cholesterol: 30, carbs: 48, sodium: 2460, sugar: 24, protein: 18, fiber: 12 },
            },
        }],
    }),

    // No nutrition available yet — Amazon didn't expose a text nutrition table for this
    // listing (baking soda is chemically invariant across brands, but serving-size
    // conventions differ enough between labels that a real one is still needed here).
    // Nutrition zeroed at the user's request — no text nutrition table was available for
    // this listing, so this is a placeholder, not a real (scraped or measured) value.
    bakingSoda: ingredientFactory('Baking Soda', {
        defaultBrand: 'Arm & Hammer',
        products: [{
            brand: 'Arm & Hammer', size: 16, sizeUnit: u.ounce,
            listings: [{ price: 4.50, link: 'https://www.amazon.com/Arm-Hammer-Pure-Baking-Soda/dp/B00K1JFAVE' }],
            nutrition: {
                [u.tsp.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    pankoBreadCrumbs: ingredientFactory('Panko Bread Crumbs', {
        defaultBrand: '365',
        products: [{
            brand: '365', size: 8, sizeUnit: u.ounce,
            listings: [{ store: stores.wholeFoods, price: 1.99, link: 'https://www.amazon.com/365-Everyday-Value-Panko-Crumbs/dp/B074H5LYGT' }],
            nutrition: {
                [u.cup.name]: { servings: 8, servingSize: 0.333, calories: 110, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 23, sodium: 100, sugar: 1, protein: 4, fiber: 1 },
            },
        }],
    }),

    // Nutrition zeroed at the user's request — the label is image-only on Amazon (typical
    // for dried herbs), so this is a placeholder, not a real (scraped or measured) value.
    parsleyFlakes: ingredientFactory('Parsley Flakes', {
        defaultBrand: '365',
        products: [{
            brand: '365', variant: 'Organic Parsley', size: 0.24, sizeUnit: u.ounce, organic: true,
            listings: [{ store: stores.wholeFoods, price: 3.99, link: 'https://www.amazon.com/365-Everyday-Value-Organic-Parsley/dp/B074H81M9K' }],
            nutrition: {
                [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    lentilSpaghetti: ingredientFactory('Lentil Spaghetti', {
        defaultBrand: 'Whole Foods Market',
        products: [{
            brand: 'Whole Foods Market', variant: 'Organic Red Lentil Gluten Free', size: 8, sizeUnit: u.ounce, organic: true,
            listings: [{ store: stores.wholeFoods, price: 3.29, link: 'https://www.amazon.com/Whole-Foods-Market-Organic-Spaghetti/dp/B07FX14M71' }],
            nutrition: {
                // 2 oz (56g / 1/4 package) dry, 4 servings per container
                [u.ounce.name]: { servings: 4, servingSize: 2, calories: 210, fat: 1, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 36, sodium: 0, sugar: 0.99, protein: 15, fiber: 6 },
            },
        }],
    }),

    instantOatmeal: ingredientFactory('Instant Oatmeal (Maple & Brown Sugar, Lower Sugar)', {
        defaultBrand: 'Quaker',
        products: [{
            brand: 'Quaker', variant: 'Lower Sugar, Maple & Brown Sugar (1.19 oz, Pack of 44)', listings: [{ store: stores.amazon, price: 13.72, discount: { subscribeAndSave15: true }, link: 'https://www.amazon.com/dp/B094TG5HDJ' }], size: 44, sizeUnit: u.unit,
        }],
        nutrition: {
            [u.unit.name]: { servings: 44, servingSize: 1, calories: 120, fat: 2, saturatedFat: 0.5, transFat: 0, cholesterol: 0, carbs: 24, sodium: 240, sugar: 4, protein: 4, fiber: 3 },
        },
    }),

    // Generic/typical nutrition (not from this listing's own label) — standard onion values,
    // per 1 tbsp minced (~10g), matching how this ingredient is actually used in recipes.
    whiteOnion: ingredientFactory('White Onion', {
        defaultBrand: 'Organic',
        products: [{
            brand: 'Organic', size: 1, sizeUnit: u.unit,
            listings: [{ price: 1.49, link: 'https://www.amazon.com/Organic-White-Onion-1-Each/dp/B0787Z3T3B' }],
            nutrition: {
                [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 4, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 1, sodium: 0, sugar: 0.4, protein: 0, fiber: 0 },
            },
        }],
    }),

    // Nutrition zeroed at the user's request — Amazon's label for these listings is
    // image-only, so this is a placeholder, not a real (scraped or measured) value.
    blackPepper: ingredientFactory('Black Pepper', {
        defaultBrand: '365',
        products: [{
            brand: '365', variant: 'Organic Ground (1.8 oz)', size: 1.8, sizeUnit: u.ounce, organic: true,
            listings: [
                { store: stores.wholeFoods, price: 4.29, link: 'https://www.amazon.com/dp/B074H6GRM7' },
                { store: stores.amazon, price: 4.69, discount: { subscribeAndSave5: true }, link: 'https://www.amazon.com/dp/B075M4KPWW' },
            ],
            nutrition: {
                [u.tsp.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
                [u.ounce.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }, {
            brand: 'Watkins', variant: 'Organic Ground (4 oz Tin)', listings: [{ store: stores.amazon, price: 6.99, discount: { subscribeAndSave5: true }, link: 'https://www.amazon.com/dp/B0B5YCWGST' }], size: 4, sizeUnit: u.ounce, organic: true,
            nutrition: {
                [u.tsp.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
                [u.ounce.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    asianSaladKit: ingredientFactory('Asian Inspired Salad Kit', {
        defaultBrand: '365',
        products: [{
            brand: '365', variant: 'Organic Asian Inspired (12 oz)', listings: [{ store: stores.wholeFoods, price: 5.99, link: 'https://www.amazon.com/dp/B07B67Y9MH' }], size: 1, sizeUnit: u.unit,
        }],
        nutrition: {
            // per whole bag (2 × 1-cup servings): 170 cal × 2, estimated fat/carbs from ingredients
            [u.unit.name]: { servings: 1, servingSize: 1, calories: 340, fat: 18, saturatedFat: 2, transFat: 0, cholesterol: 0, carbs: 28, sodium: 780, sugar: 12, protein: 6, fiber: 6 },
        },
    }),

    carrot: ingredientFactory('Carrots', {
        defaultBrand: '365',
        products: [{
            brand: '365', variant: 'Organic Shredded (10 oz)', listings: [{ store: stores.wholeFoods, price: 2.99, link: 'https://www.amazon.com/dp/B078J1FS9V' }], size: 10, sizeUnit: u.ounce,
        }, {
            brand: 'CAL ORGANIC', variant: 'Organic Whole (16 oz)', listings: [{ store: stores.wholeFoods, price: 1.79, link: 'https://www.amazon.com/dp/B00E3JELZ4' }], size: 16, sizeUnit: u.ounce, organic: true,
        }],
        nutrition: {
            [u.cup.name]:  { servings: 1, servingSize: 1, calories: 52,  fat: 0,    saturatedFat: 0,   transFat: 0, cholesterol: 0, carbs: 12, sodium: 88, sugar: 6, protein: 1,   fiber: 3   },
            [u.unit.name]: { servings: 5, servingSize: 1, calories: 32, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 7, sodium: 54, sugar: 4, protein: 1, fiber: 2 },
        },
        conversions: {
            [u.cup.name]: { to: u.pound, factor: 0.24 },
        },
    }),

    edamame: ingredientFactory('Shelled Edamame', {
        defaultBrand: '365',
        products: [{
            brand: '365', variant: 'Organic Frozen Shelled', listings: [{ store: stores.wholeFoods, price: 3.49, link: 'https://www.amazon.com/dp/B074H6S8D8' }], size: 10, sizeUnit: u.ounce, packageUnit: u.bag,
        }],
        nutrition: {
            [u.cup.name]: { servings: 1, servingSize: 1, calories: 190, fat: 8, saturatedFat: 1, transFat: 0, cholesterol: 0, carbs: 14, sodium: 9, sugar: 3, protein: 17, fiber: 8 },
        },
        conversions: {
            [u.cup.name]: { to: u.ounce, factor: 5.3 },  // 1 cup shelled ≈ 5.3 oz
        },
    }),

    yellowOnion: ingredientFactory('Yellow Onion', {
        defaultBrand: 'Whole Foods Market',
        products: [{
            brand: 'Whole Foods Market', variant: 'Organic, Loose', listings: [{ store: stores.wholeFoods, price: 2.99, link: 'https://www.amazon.com/dp/B07QV6B5WV' }], size: 1, sizeUnit: u.pound, organic: true, bulk: true,
        }],
        nutrition: {
            [u.cup.name]: { servings: 3, servingSize: 0.5, calories: 32, fat: 0.08, saturatedFat: 0.03, transFat: 0, cholesterol: 0, carbs: 7, sodium: 3.2, sugar: 3.392, protein: 0.88, fiber: 1.4 },
        },
        conversions: {
            [u.cup.name]:  { to: u.pound, factor: 0.35 },  // 1 cup chopped onion ≈ 160g ≈ 0.35 lb
            [u.unit.name]: { to: u.cup, factor: 1 },       // 1 medium onion ≈ 1 cup chopped
        },
    }),

    cabbage: ingredientFactory('Green Cabbage', {
        defaultBrand: 'Whole Foods Market',
        products: [{
            brand: 'Whole Foods Market', variant: 'Organic, Loose (~2.5 lb head)', listings: [{ store: stores.wholeFoods, price: 1.99, link: 'https://www.amazon.com/dp/B0787TK5FV' }], size: 1, sizeUnit: u.pound, organic: true, bulk: true,
        }],
        nutrition: {
            [u.cup.name]: { servings: 1, servingSize: 1, calories: 22, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 5, sodium: 16, sugar: 3, protein: 1, fiber: 2 },
        },
        conversions: {
            [u.cup.name]: { to: u.pound, factor: 0.2 },  // 1 cup shredded cabbage ≈ 89g ≈ 0.2 lb
        },
    }),

    coleslawMix: ingredientFactory('Coleslaw Mix', {
        // Green cabbage, red cabbage, and carrots
        defaultBrand: '365',
        products: [{
            brand: '365', variant: 'Organic (12 oz)', listings: [{ store: stores.wholeFoods, price: 3.49, link: 'https://www.amazon.com/dp/B07FWN3244' }], size: 12, sizeUnit: u.ounce, packageUnit: u.bag,
        }],
        nutrition: {
            // Label: ~4 servings per bag, serving size 1 cup (85g)
            [u.cup.name]: { servings: 4, servingSize: 1, calories: 25, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 6, sodium: 30, sugar: 3, protein: 1, fiber: 2 },
        },
        conversions: {
            // 12 oz bag / 4 servings = 3 oz per cup serving (matches label's 85g ≈ 3 oz)
            [u.cup.name]: { to: u.ounce, factor: 3 },
        },
    }),

    greenOnion: ingredientFactory('Green Onion', {
        defaultBrand: 'Whole Foods Market',
        products: [{
            brand: 'Whole Foods Market', variant: 'Organic Scallions (1 Bunch)', listings: [{ store: stores.wholeFoods, price: 1.99, link: 'https://www.amazon.com/dp/B07883LXVL' }], size: 1, sizeUnit: u.bunch, packageUnit: u.bunch,
        }],
        nutrition: {
            [u.unit.name]: { servings: 1, servingSize: 1, calories: 5, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 1, sodium: 5, sugar: 0, protein: 0, fiber: 0 },
        },
        conversions: {
            [u.unit.name]: { to: u.bunch, factor: 1 / 5 },  // 5 scallions per bunch
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

    creamySesameDressing: ingredientFactory('Creamy Sesame Salad Dressing', {
        defaultBrand: 'SideDish',
        products: [{
            brand: 'SideDish', variant: 'Creamy Sesame (8 fl oz)', listings: [{ store: stores.wholeFoods, price: 6.53, link: 'https://www.amazon.com/dp/B0CR56SHBK' }], size: 8, sizeUnit: u.fluidOunce,
        }],
        nutrition: {
            // Label: ~7 servings per container, serving size 2 tbsp (30g)
            [u.tbsp.name]: { servings: 7, servingSize: 2, calories: 100, fat: 7, saturatedFat: 1, transFat: 0, cholesterol: 0, carbs: 9, sodium: 330, sugar: 6, protein: 2, fiber: 1 },
        },
    }),

    chickpeas: ingredientFactory('Chickpeas (Garbanzo Beans)', {
        defaultBrand: '365',
        conversions: {
            [u.cup.name]: { to: u.ounce, factor: 13.4 / 1.5 },  // 13.4 oz per ~1.5 cups (3 × ½ cup servings)
        },
        products: [{
            brand: '365', variant: 'Organic Unsalted (13.4 oz)', listings: [{ store: stores.wholeFoods, price: 1.59, link: 'https://www.amazon.com/dp/B074H5SRPW' }], size: 13.4, sizeUnit: u.ounce, packageUnit: u.can,
        }],
        nutrition: {
            [u.cup.name]: { servings: 1, servingSize: 1, calories: 220, fat: 4, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 36, sodium: 20, sugar: 2, protein: 12, fiber: 10 },
        },
    }),

    cannelliniBean: ingredientFactory('Cannellini Beans', {
        defaultBrand: '365',
        conversions: {
            [u.cup.name]: { to: u.ounce, factor: 13.4 / 1.5 },  // 13.4 oz per 1.5 cups (3 × ½ cup servings)
        },
        products: [{
            brand: '365', variant: 'Organic Unsalted (13.4 oz)', listings: [{ store: stores.wholeFoods, price: 1.59, link: 'https://www.amazon.com/dp/B074H5J2V7' }], size: 13.4, sizeUnit: u.ounce, packageUnit: u.can,
        }],
        nutrition: {
            [u.cup.name]: { servings: 1, servingSize: 1, calories: 180, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 32, sodium: 10, sugar: 2, protein: 12, fiber: 12 },
        },
    }),

    macadamiaNutMilk: ingredientFactory('Macadamia Nut Milk', {
        requiresDateLabel: true,
        defaultBrand: 'Milkadamia',
        products: [{
            brand: 'Milkadamia', variant: 'Unsweetened', listings: [{ store: stores.wholeFoods, link: 'https://www.amazon.com/dp/B01JH2O854', price: 6.19 }], size: 32, sizeUnit: u.fluidOunce,
            nutrition: {
                [u.cup.name]: { servings: 4, servingSize: 1, calories: 50, fat: 5, saturatedFat: 0.5, transFat: 0, cholesterol: 0, carbs: 1, sodium: 75, sugar: 0, protein: 1, fiber: 0 },
            },
        }],
    }),

    macadamiaNut: ingredientFactory('Macadamia Nut', {
        defaultBrand: 'Blueprint',
        conversions: {
            [u.cup.name]: { to: u.ounce, factor: 4 },  // 1 cup ≈ 4 oz by weight
        },
        products: [
            {
                brand: '365', variant: 'Organic Raw', listings: [{ store: stores.wholeFoods, link: 'https://www.wholefoodsmarket.com/product/365-by-whole-foods-market-organic-macadamia-nuts-8-oz-b086hk83yf', price: 10.79 }], size: 8, sizeUnit: u.ounce, organic: true,
                nutrition: {
                    [u.cup.name]: { servings: 1, servingSize: 1, calories: 960, fat: 95, saturatedFat: 15, transFat: 0, cholesterol: 0, carbs: 18, sodium: 7, sugar: 6, protein: 11, fiber: 9 },
                },
            },
            {
                brand: 'Blueprint', variant: 'Raw', listings: [{ store: stores.amazon, link: 'https://www.amazon.com/Blueprint-Bryan-Johnson-Macadamia-Nuts/dp/B0DNGJFBS1', price: 12 }], size: 4, sizeUnit: u.ounce, organic: false,
                nutrition: {
                    // Label: 1 oz (28g) serving = 210 cal etc; scaled ×4 to a per-cup value (1 cup ≈ 4 oz, per the ingredient's conversion factor above)
                    [u.cup.name]: { servings: 1, servingSize: 1, calories: 840, fat: 88, saturatedFat: 16, transFat: 0, cholesterol: 0, carbs: 16, sodium: 8, sugar: 4, protein: 8, fiber: 12 },
                },
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
            brand: '365', variant: 'Organic Black', listings: [{ store: stores.wholeFoods }],
            nutrition: {
                [u.tsp.name]: { servings: 1, servingSize: 1, calories: 19, fat: 1, saturatedFat: 0.1, transFat: 0, cholesterol: 0, carbs: 1.5, sodium: 0, sugar: 0, protein: 1, fiber: 2 },
            },
        }],
    }),

    hempSeed: ingredientFactory('Hemp Seed', {
        defaultBrand: 'Manitoba Harvest',
        products: [{
            brand: 'Manitoba Harvest', variant: 'Hemp Hearts', listings: [{ store: stores.wholeFoods }],
            nutrition: {
                [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 55, fat: 4, saturatedFat: 0.5, transFat: 0, cholesterol: 0, carbs: 1, sodium: 0, sugar: 0.5, protein: 3.3, fiber: 0 },
            },
        }],
    }),

    antiOxidantBerryBlend: ingredientFactory('Antioxidant Berry Blend', {
        defaultBrand: '365',
        products: [{
            brand: '365', variant: 'Organic Antioxidant Fruit Blend (frozen)', listings: [{ store: stores.wholeFoods }],
            size: 16, sizeUnit: u.ounce, organic: true,
            nutrition: {
                [u.cup.name]: { servings: 4, servingSize: 1, calories: 70, fat: 0.5, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 17, sodium: 0, sugar: 13, protein: 1, fiber: 4 },
            },
        }],
    }),

    vanillaExtract: ingredientFactory('Vanilla Extract', {
        defaultBrand: '365',
        products: [{
            brand: '365', variant: 'Organic Vanilla Extract', listings: [{ store: stores.wholeFoods, price: 8.79, link: 'https://www.amazon.com/365-Everyday-Value-Organic-Vanilla/dp/B074VBL8R9' }],
            nutrition: { [u.fluidOunce.name]: { servings: 2, servingSize: 2, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 } }, size: 2, sizeUnit: u.fluidOunce, organic: true,
        }],
    }),

    lemonJuice: ingredientFactory('Lemon Juice', {
        defaultBrand: '365',
        products: [{
            brand: '365', variant: 'Organic Lemon Juice', listings: [{ store: stores.wholeFoods, price: 3.49, link: 'https://www.amazon.com/365-Everyday-Value-Organic-Concentrate/dp/B074J5WZS8?th=1' }],
            nutrition: { [u.tsp.name]: { servings: 59, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 } }, size: 10, sizeUnit: u.fluidOunce, organic: true,
        }],
    }),

    cherry: ingredientFactory('Cherry', {
        defaultBrand: '365',
        conversions: {
            [u.unit.name]: { to: u.cup, factor: 1/15 },  // ~15 dark cherries per cup
            [u.cup.name]:  { to: u.ounce, factor: 5 },   // 1 cup dark cherries ≈ 5 oz
        },
        products: [{
            brand: '365', variant: 'Organic Sweet Dark Cherries (frozen)', listings: [{ store: stores.wholeFoods, link: 'https://www.amazon.com/dp/B074H57SNZ', price: 4.29 }], size: 10, sizeUnit: u.ounce,
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
        defaultBrand: '365',
        products: [{
            brand: '365', variant: 'Organic Whole Leaf (Frozen, 16 oz)', listings: [{ store: stores.wholeFoods, price: 3.59, link: 'https://www.amazon.com/dp/B074H5Y441' }], size: 16, sizeUnit: u.ounce,
        }],
        nutrition: { [u.ounce.name]: { servings: 1, servingSize: 1, calories: 7, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 1, sodium: 24, sugar: 0.1, protein: 0.9, fiber: 1 } },
        conversions: {
            // Package label: 1 cup (100g) per serving → 100g / 28.3495 g/oz ≈ 3.53 oz/cup
            [u.cup.name]: { to: u.ounce, factor: 3.53 },
        },
    }),

    kale: ingredientFactory('Kale', {
        defaultBrand: '365',
        products: [{
            brand: '365', variant: 'Organic Chopped (Frozen, 16 oz)', listings: [{ store: stores.wholeFoods, price: 3.59, link: 'https://www.amazon.com/dp/B074H5Y3WB' }], size: 16, sizeUnit: u.ounce,
        }],
        nutrition: { [u.ounce.name]: { servings: 1, servingSize: 1, calories: 8, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 1.5, sodium: 11, sugar: 0.2, protein: 0.7, fiber: 1 } },
        conversions: {
            // Package label: 1⅓ cup (85g) per serving → 85g / 1.333 cup / 28.3495 g/oz ≈ 2.25 oz/cup
            [u.cup.name]: { to: u.ounce, factor: 2.25 },
        },
    }),

    banana: ingredientFactory('Organic Banana', {
        nutrition: { [u.unit.name]: { servings: 1, servingSize: 1, calories: 105, fat: 0.3, saturatedFat: 0.1, transFat: 0, cholesterol: 0, carbs: 27, sodium: 1, sugar: 14, protein: 1.3, fiber: 3 } },
    }),

    peanutButter: ingredientFactory('Peanut Butter', {
        defaultBrand: '365',
        products: [
            {
                brand: '365', variant: 'Organic Unsweetened', listings: [{ store: stores.wholeFoods, price: 4.19, link: 'https://www.amazon.com/365-Everyday-Value-Organic-Unsweetened/dp/B074H61LYV/ref=sr_1_9_0o_wf' }], size: 16, sizeUnit: u.ounce, organic: true,
                nutrition: {
                    [u.tbsp.name]: { servings: 14, servingSize: 2, calories: 190, fat: 17, saturatedFat: 3.5, transFat: 0, cholesterol: 0, carbs: 6, sodium: 100, sugar: 1, protein: 7, fiber: 2 },
                },
            },
            {
                brand: '365', variant: 'Creamy', listings: [{ store: stores.wholeFoods, price: 2.49, link: 'https://www.amazon.com/365-Everyday-Value-Peanut-Butter/dp/B074H57SPT/ref=sr_1_7_0o_wf' }], size: 16, sizeUnit: u.ounce,
                nutrition: {
                    [u.tbsp.name]: { servings: 14, servingSize: 2, calories: 190, fat: 16, saturatedFat: 2.5, transFat: 0, cholesterol: 0, carbs: 7, sodium: 120, sugar: 2, protein: 8, fiber: 3 },
                },
            },
            {
                brand: '365', variant: 'Crunchy', listings: [{ store: stores.wholeFoods, price: 4.99, link: 'https://www.amazon.com/Everyday-Value-Peanut-Butter-Crunchy/dp/B074Y2V88X/ref=sr_1_16_0o_wf' }], size: 36, sizeUnit: u.ounce,
                nutrition: {
                    [u.tbsp.name]: { servings: 32, servingSize: 2, calories: 190, fat: 16, saturatedFat: 2.5, transFat: 0, cholesterol: 0, carbs: 7, sodium: 100, sugar: 2, protein: 8, fiber: 3 },
                },
            },
            {
                brand: 'Amazon Brand', variant: 'Creamy', listings: [{ store: stores.amazon, price: 3.97, link: 'https://www.amazon.com/dp/B07KWGSCW2/ref=sns_myd_detail_page', discount: { subscribe5Products: 5 } }], size: 40, sizeUnit: u.ounce,
                nutrition: {
                    [u.tbsp.name]: { servings: 35, servingSize: 2, calories: 180, fat: 15, saturatedFat: 2.5, transFat: 0, cholesterol: 0, carbs: 7, sodium: 130, sugar: 3, protein: 7, fiber: 2 },
                },
            },
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
        products: [{ brand: 'Tap', listings: [{ price: 0 }], size: 1, sizeUnit: u.fluidOunce }],
    }),

    psyllium: ingredientFactory('Psyllium Husk', {
        defaultBrand: '365',
        conversions: {
            [u.tbsp.name]: { to: u.ounce, factor: 0.214 },  // 12 oz / 56 tbsp servings
        },
        products: [{
            brand: '365', variant: 'Organic Whole Flakes', size: 12, sizeUnit: u.ounce,
            organic: true,
            listings: [
                { store: stores.wholeFoods, link: 'https://www.amazon.com/dp/B0CDQJRFGX', price: 17.49 },
                { store: stores.amazon, link: 'https://www.amazon.com/dp/B0CDQJJ5TF', price: 18.48 },
            ],
            nutrition: {
                [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 15, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 5, sodium: 5, sugar: 0, protein: 0, fiber: 5 },
            },
        }],
    }),

    macadamiaBar: ingredientFactory('Macadamia Bar', {
        defaultBrand: 'Blueprint',
        products: [
            {
                brand: 'Blueprint', variant: 'Raspberry', listings: [{ store: stores.amazon, link: 'https://www.amazon.com/dp/B0DQLSW6FB', price: 29.00, discount: { subscribeAndSave10: true } }], size: 12, sizeUnit: u.unit,
                nutrition: {
                    [u.unit.name]: { servings: 12, servingSize: 1, calories: 160, fat: 12, saturatedFat: 2, transFat: 0, cholesterol: 0, carbs: 5, sodium: 80, sugar: 1, protein: 9, fiber: 2 },
                },
            },
        ],
    }),

    blackLentils: ingredientFactory('Black Lentils', {
        defaultBrand: '365',
        conversions: {
            [u.gram.name]: { to: u.cup, factor: 1/180 },  // 45g = ¼ cup dry, per nutrition label
        },
        products: [{
            brand: '365', variant: 'Organic, Black, dry', listings: [{ store: stores.wholeFoods, price: 3.29, link: 'https://www.amazon.com/dp/B084NHD2R9' }], size: 16, sizeUnit: u.ounce, organic: true,
            nutrition: {
                [u.cup.name]: { servings: 11, servingSize: 1, calories: 600, fat: 2, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 106, sodium: 0, sugar: 4, protein: 44, fiber: 20 },
            },
        }],
    }),

    oliveOil: ingredientFactory('Extra Virgin Olive Oil', {
        defaultBrand: 'Blueprint',
        conversions: {
            [u.shot.name]: { to: u.fluidOunce, factor: 1 },  // 1 shot = 1 fl oz
        },
        products: [{
            brand: 'Blueprint', variant: 'Snake Oil (High Polyphenol EVOO)', listings: [{ store: stores.amazon, price: 35, link: 'https://www.amazon.com/Blueprint-Bryan-Johnson-Olive-Oil/dp/B0F1P5SR2M' }],
            size: 25, sizeUnit: u.fluidOunce,
            nutrition: {
                [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 120, fat: 14, saturatedFat: 2, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    longevityProtein: ingredientFactory('Longevity Protein', {
        defaultBrand: 'Blueprint',
        products: [{
            brand: 'Blueprint', variant: 'Chocolate (30 servings)', listings: [{ store: stores.amazon, price: 94, link: 'https://www.amazon.com/Blueprint-Bryan-Johnson-Longevity-Protein/dp/B0DNGJRLQF' }], 
            size: 30, sizeUnit: u.unit,
            nutrition: {
                [u.unit.name]: { servings: 1, servingSize: 1, calories: 200, fat: 5, saturatedFat: 0.5, transFat: 0, cholesterol: 0, carbs: 13, sodium: 200, sugar: 0, protein: 26, fiber: 1 },
            },
        }],
    }),

    blueberryNutMix: ingredientFactory('Blueberry Nut Mix', {
        defaultBrand: 'Blueprint',
        products: [{
            brand: 'Blueprint', variant: 'Macadamia + Walnut + Blueberry', listings: [{ store: stores.amazon, price: 37, discount: { subscribeAndSave10: true }, link: 'https://www.amazon.com/Blueprint-Bryan-Johnson-Blueberry-Nut/dp/B0D3FZ29RJ' }], size: 30, sizeUnit: u.unit,
            nutrition: {
                // Per 1 scoop (15g), 30 servings per container
                [u.unit.name]: { servings: 30, servingSize: 1, calories: 70, fat: 4.5, saturatedFat: 0.5, transFat: 0, cholesterol: 0, carbs: 8, sodium: 0, sugar: 5, protein: 1, fiber: 2 },
            },
        }],
    }),

    longevityMix: ingredientFactory('Longevity Mix', {
        defaultBrand: 'Blueprint',
        products: [{
            brand: 'Blueprint', variant: 'Blood Orange (30 servings)', listings: [{ store: stores.amazon, price: 49, link: 'https://www.amazon.com/dp/B0D3GBRNSX', discount: { subscribeAndSave10: true } }], size: 30, sizeUnit: u.unit,
        }],
        nutrition: {
            [u.unit.name]: { servings: 30, servingSize: 1, calories: 10, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 3, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
        },
    }),

    collagenPowder: ingredientFactory('Collagen Peptides', {
        defaultBrand: 'Blueprint',
        products: [{
            brand: 'Blueprint', variant: 'Hydrolyzed Type I, II & III (30 servings)', listings: [{ store: stores.amazon, price: 45, link: 'https://www.amazon.com/dp/B0DV1PQDWH', discount: { subscribeAndSave10: true } }], size: 30, sizeUnit: u.unit,
        }],
        nutrition: {
            [u.unit.name]: { servings: 30, servingSize: 1, calories: 80, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 20, fiber: 0 },
        },
    }),

    creatine: ingredientFactory('Creatine Monohydrate', {
        defaultBrand: 'Blueprint',
        products: [{
            brand: 'Blueprint', variant: 'Unflavored (100 servings)', listings: [{ store: stores.amazon, price: 40, link: 'https://www.amazon.com/dp/B0DQLW13S2', discount: { subscribeAndSave10: true } }], size: 100, sizeUnit: u.unit,
        }],
        nutrition: {
            [u.unit.name]: { servings: 100, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
        },
    }),

    // Generic/typical nutrition (not from this listing's own label) — standard honey values,
    // per 1 tsp (~7g). Link is also currently dead ("Page Not Found") — needs a fresh one.
    manukaHoney: ingredientFactory('Manuka Honey', {
        defaultBrand: 'Blueprint',
        products: [{
            brand: 'Blueprint', variant: 'Manuka Honey', listings: [{ store: stores.amazon, link: 'https://www.amazon.com/dp/B0DQLSXYZ' }],
            nutrition: {
                [u.tsp.name]: { servings: 1, servingSize: 1, calories: 21, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 6, sodium: 0, sugar: 6, protein: 0, fiber: 0 },
            },
        }],
    }),

    nutThins: ingredientFactory('Nut Thins', {
        defaultBrand: 'Blue Diamond',
        products: [
            {
                brand: 'Blue Diamond', variant: 'Hint Of Sea Salt', size: 4.25, sizeUnit: u.ounce,
                listings: [
                    { store: stores.amazon, link: 'https://www.amazon.com/dp/B00FBO8FF2', price: 3.97, discount: { subscribeAndSave15: true } },
                    { store: stores.wholeFoods, price: 4.39 },
                ],
                nutrition: {
                    // 19 crackers per serving, 4 servings per container
                    [u.unit.name]: { servings: 4, servingSize: 19, calories: 130, fat: 4, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 22, sodium: 80, sugar: 0, protein: 3, fiber: 1 },
                },
            },
            {
                brand: 'Blue Diamond', variant: 'Hint Of Sea Salt (Family Size)', size: 7.7, sizeUnit: u.ounce,
                listings: [
                    { store: stores.amazon, link: 'https://www.amazon.com/dp/B07XHRRB1T', price: 6.57, discount: { subscribeAndSave15: true } },
                    { store: stores.wholeFoods, link: 'https://www.amazon.com/dp/B07XHRRB1T', price: 7.99 },
                ],
                nutrition: {
                    // 19 crackers per serving, 7 servings per container
                    [u.unit.name]: { servings: 7, servingSize: 19, calories: 130, fat: 4, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 22, sodium: 55, sugar: 0, protein: 3, fiber: 1 },
                },
            },
        ],
    }),

    // Generic/typical nutrition (not from this listing's own label) — standard raw boneless
    // skinless chicken thigh values, per 1 lb (453.6g).
    chickenThigh: ingredientFactory('Chicken Thighs (Boneless Skinless)', {
        isMeatProduct: true,
        defaultBrand: '365',
        products: [{
            brand: '365', variant: 'Organic Boneless Skinless (1.5 lb)', listings: [{ store: stores.wholeFoods, price: 9.99, link: 'https://www.amazon.com/dp/B07813VZHR' }], size: 1.5, sizeUnit: u.pound,
            nutrition: {
                [u.pound.name]: { servings: 1, servingSize: 1, calories: 708, fat: 37, saturatedFat: 10, transFat: 0, cholesterol: 372, carbs: 0, sodium: 345, sugar: 0, protein: 90, fiber: 0 },
            },
        }],
    }),

};

// ============================================================
// RECIPES
// ============================================================

registerGroup('Breakfast', [
    withPlan(createRecipe('blueprint-smoothie', 'Blueprint Smoothie (Nutribullet)', (() => {
        const mixer = e.bulletMixer();
        const MACADAMIA_MILK = i.macadamiaNutMilk(1, u.cup);
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);

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
            i.kale(0.5, u.cup),
            i.spinach(0.25, u.cup),
        ]));
        s(Timer.set(30, 's', 'Let mixer settle', { equipment: [mixer.name] }));
        s(mixer.mix());

        return steps;
    })(), undefined, 8), { planMinutes: 8, portable: false }),
    withPlan(createRecipe('blueprint-smoothie-nuwave', 'Blueprint Smoothie (Nuwave) (x2)', (() => {
        const mixer = e.bulletMixer();
        const MACADAMIA_MILK = i.macadamiaNutMilk(2, u.cup);
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);

        s(mixer.add([
            MACADAMIA_MILK,
            i.lemonJuice(4, u.tbsp),
            i.macadamiaNut(0.5, u.cup),
            i.cocoaNibs(2, u.tsp),
            i.chiaSeed(2, u.tsp),
            i.hempSeed(2, u.tbsp),
            i.cherry(6, u.unit),
            i.antiOxidantBerryBlend(1, u.cup),
            i.vanillaExtract(0.5, u.tsp),
        ]));
        s(mixer.mix());

        s(mixer.add([
            i.celery(2, u.unit),
            i.banana(2, u.unit),
            i.kale(1, u.cup),
            i.spinach(0.5, u.cup),
        ]));
        s(Timer.set(30, 's', 'Let mixer settle', { equipment: [mixer.name] }));
        s(mixer.mix());

        return steps;
    })(), undefined, 8), { planMinutes: 8, portable: false }),
    withPlan(createRecipe('instant-oatmeal-maple-brown-sugar', 'Instant Oatmeal (Maple & Brown Sugar, Lower Sugar)', (() => {
        const bowl   = e.bowl();
        const kettle = e.kettle();
        const OATMEAL = i.instantOatmeal(2, u.unit);
        const WATER   = i.water(8, u.fluidOunce);
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);

        s(bowl.add([OATMEAL]));
        s(kettle.add([WATER]));
        s(kettle.cook('Boil water', time.minutes(3), 475));
        s(kettle.transfer(bowl, [WATER]));
        s(bowl.mix());
        s(Timer.set(60, 's', 'Let sit', { equipment: [bowl.name] }));

        return steps;
    })()), { planMinutes: 5, portable: false }),
]);

// Moved out of the Dinner array — registers itself under its own 'Cleaning' group
registerRecipe(createRecipe(
    'clean-water-bottle',
    'Clean Water Bottle',
    [
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
    ],
    'Cleaning',
));

registerRecipe(createRecipe(
    'dill-dip',
    'Dill Dip',
    (() => {
        const bowl         = e.bowl();
        const cuttingBoard = e.cuttingBoard();
        const ONION = i.whiteOnion(2, u.tbsp);
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);

        s(instruction('Mince white onion', { ingredients: [ONION], equipment: [cuttingBoard.name] }));
        s(bowl.add([
            i.sourCream(1, u.cup),
            i.mayonnaise(1, u.cup),
            i.dillWeed(2, u.tbsp),
            ONION,
            i.parsleyFlakes(2, u.tbsp),
            i.seaSalt(2, u.tsp),
        ]));
        s(bowl.mix());

        return steps;
    })(),
    'Sides',
));

registerGroup('Dinner', [
    createRecipe('breaded-mushrooms', 'Breaded Mushrooms', (() => {
        const pankoPan     = e.pan('panko pan');
        const pankoBowl    = e.bowl('panko bowl');
        const oven         = e.oven();
        const batter       = e.bowl('batter bowl');
        const cuttingBoard = e.cuttingBoard();
        const PANKO        = i.pankoBreadCrumbs(3, u.cup);
        const MUSHROOMS    = i.kingOysterMushroom(4, u.unit);
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);

        s(oven.preheat(450));
        s(pankoPan.add([PANKO]));
        s(oven.place(pankoPan, 'Toast panko', time.minutes(5), 450));
        const transferToBowl = pankoPan.transfer(pankoBowl, [PANKO]);
        s(transferToBowl);

        s(batter.add([
            i.water(7, u.ounce),
            i.seaSalt(0.5, u.tsp),
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
        const oven      = e.oven();
        const bowl      = e.bowl();
        const CARROTS   = i.carrot(1, u.pound);
        const MUSHROOMS = i.babyBellaMushroom(8, u.ounce);
        const ONION     = i.yellowOnion(1, u.unit);
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);

        s(oven.preheat(450));
        s(instruction('Place sheet pan in oven while it preheats', { equipment: ['oven', 'sheet pan'] }));
        s(bowl.add([
            [CARROTS, 'peeled, cut lengthwise or into thick diagonals'],
            [MUSHROOMS, 'halved'],
            [ONION, 'cut into 8 wedges'],
            i.oliveOil(1, u.tbsp),
            i.seaSalt(1, u.tsp),
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
        s(Timer.set(17, 'm', 'Roast until carrots are caramelized, mushrooms deeply browned, onions soft with crispy tips', { equipment: ['sheet pan'], ingredients: [CARROTS, MUSHROOMS, ONION] }));
        s(Timer.set(5, 'm', 'Rest vegetables before serving'));

        return steps;
    })(), undefined, 45),

    createRecipe('abbot-pea-protein-spaghetti', 'Abbot Pea Protein Spaghetti', (() => {
        const pot = e.pot();
        const pan = e.pan();
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);

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
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);
        const bowl = e.bowl('salad bowl');
        const microwave = e.microwave();

        const EDAMAME = i.edamame(1, u.cup);
        s(bowl.add([i.asianSaladKit(1, u.unit)]));
        s(Timer.set(80, 's', 'Microwave edamame until just thawed', { equipment: [microwave.name], ingredients: [EDAMAME] }));
        s(instruction('Pat edamame dry, then add to bowl', { ingredients: [EDAMAME], equipment: [bowl.name] }));
        s(bowl.add([
            i.chickpeas(1, u.cup),
            i.cannelliniBean(1, u.cup),
        ]));
        s(instruction('Add dressing and toppings from kit, toss to combine', { equipment: [bowl.name] }));

        return steps;
    })()), { planMinutes: 10, portable: false, hidden: true }),

    withPlan(createRecipe('asian-dense-bean-salad-original', 'Asian Dense Bean Salad (Original Blueprint Version)', (() => {
        const saladBowl = e.bowl('salad bowl');
        const dressBowl = e.bowl('dressing bowl');
        const ALMONDS   = i.almond(1, u.handful);
        const CARROTS   = i.carrot(1, u.cup);
        CARROTS.defaultBrand = 'CAL ORGANIC';  // this recipe shreds whole carrots itself, not pre-shredded
        const CABBAGE   = i.cabbage(2, u.cup);
        const CHICKPEAS = i.chickpeas(1, u.cup);
        const CANNELLINI = i.cannelliniBean(1, u.cup);
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);

        s(prep('Soak chickpeas and cannellini beans overnight', { ingredients: [CHICKPEAS, CANNELLINI] }));
        s(prep('Peel and shred carrots', { ingredients: [CARROTS] }));
        s(prep('Shred cabbage (can be done the day before)', { ingredients: [CABBAGE] }));

        s(saladBowl.add([
            [CHICKPEAS,                  'cooked, soaked overnight'],
            [CANNELLINI,                 'cooked, soaked overnight'],
            i.edamame(1, u.cup),
            [CABBAGE,                    'shredded'],
            [CARROTS,                    'shredded'],
            [i.greenOnion(4, u.unit),    'thinly sliced'],
        ]));

        s(dressBowl.add([
            i.whiteMiso(3, u.tbsp),
            i.tamari(2, u.tbsp),
            i.riceVinegar(2, u.tbsp),
            i.sesameSeed(2, u.tbsp),
            i.limeJuice(1, u.tbsp),
            i.oliveOil(1, u.tsp),
            i.manukaHoney(1, u.tsp),
        ]));
        const dressingReady = dressBowl.mix('miso sesame dressing');
        s(dressingReady);

        s(saladBowl.combine([dressBowl.result], 'pour dressing over salad, toss gently to coat').waitFor(dressingReady));
        s(instruction('Divide into bowls and top with chopped almonds', { ingredients: [ALMONDS] }));
        s(Timer.set(30, 'm', 'Optional: chill before serving'));

        return steps;
    })()), { hidden: true }),

    createRecipe('asian-dense-bean-salad', 'Asian Dense Bean Salad', (() => {
        const saladBowl = e.bowl('salad bowl');
        const CARROTS      = i.carrot(1, u.cup);
        CARROTS.defaultBrand = 'CAL ORGANIC';  // this recipe shreds whole carrots itself, not pre-shredded
        const CABBAGE      = i.cabbage(2, u.cup);
        const CHICKPEAS    = i.chickpeas(1, u.cup);
        const CANNELLINI   = i.cannelliniBean(1, u.cup);
        const EDAMAME      = i.edamame(1, u.cup);
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);
        const microwave = e.microwave();

        s(Timer.set(80, 's', 'If eating right away and edamame is frozen: microwave edamame', { equipment: [microwave.name], ingredients: [EDAMAME] }));
        s(prep('Peel and shred carrots', { ingredients: [CARROTS] }));
        s(prep('Shred cabbage (can be done the day before)', { ingredients: [CABBAGE] }));

        const addProduce = saladBowl.add([
            [CARROTS,                 'shredded'],
            [CABBAGE,                 'shredded'],
            [i.greenOnion(2, u.unit), 'chopped'],
            CHICKPEAS,
            CANNELLINI,
            EDAMAME,
        ]);
        addProduce.prep = true;
        s(addProduce);

        s(saladBowl.add([i.creamySesameDressing(2, u.tbsp)], 'pour dressing over salad, toss gently to coat'));

        return steps;
    })()),

    createRecipe('nuwave-chicken-thighs', 'Nuwave Chicken Thighs (325°F)', (() => {
        const pan = e.nuwavePan();
        const seasoningBowl = e.bowl('seasoning bowl');
        const THIGHS = i.chickenThigh();
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);

        s(seasoningBowl.add([
            i.seaSalt(0.5, u.tsp),
            i.blackPepper(0.5, u.tsp),
            i.paprika(0.5, u.tsp),
            i.garlicPowder(0.5, u.tsp),
        ]));
        s(seasoningBowl.mix());
        s(instruction(`Season ${THIGHS.name} on both sides with seasoning mixture`, { ingredients: [THIGHS] }));
        s(pan.preheat(325));
        s(pan.add([
            i.avocadoOil(1, u.spray),
            [THIGHS, 'smooth side down'],
        ]));
        s(instruction('Place lid fully on pan', { equipment: [pan.name] }));
        s(pan.cook('Cook first side, covered — do not move', time.minutes(6), 325));
        s(pan.flip());
        s(pan.cook('Cook second side, covered', time.minutes(6), 325));
        s(instruction('Remove lid', { equipment: [pan.name] }));
        s(Timer.gate('Is the thickest thigh at least 175°F?', 2, 'm', { ingredients: [THIGHS], equipment: [pan.name] }));
        s(Timer.set(5, 'm', `Rest ${THIGHS.name} before eating`, { ingredients: [THIGHS], equipment: [pan.name] }));

        return steps;
    })()),

    createRecipe('fennel-radicchio-citrus-salad', 'Fennel, Radicchio, and Citrus Salad', (() => {
        const board     = e.cuttingBoard();
        const knife     = e.knife();
        const soakBowl  = e.bowl('lemon water bowl');
        const platter   = e.platter();
        const dressBowl = e.bowl('dressing bowl');

        const FENNEL     = i.fennel(2, u.unit);
        const RADICCHIO  = i.radicchio(1, u.unit);
        const ARUGULA    = i.arugula(140, u.gram);
        const ORANGE     = i.orange(1, u.unit);
        const GRAPEFRUIT = i.grapefruit(1, u.unit);

        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);

        s(prep('Trim fennel stalks and slice bulbs thinly, reserving the fronds', {
            equipment: [board.name, knife.name], ingredients: [FENNEL],
        }));
        s(soakBowl.add([
            [i.water(2, u.cup), 'with a squeeze of lemon juice'],
            FENNEL,
        ], 'to prevent browning'));

        s(prep('Remove core from radicchio and slice thinly', {
            equipment: [board.name, knife.name], ingredients: [RADICCHIO],
        }));

        s(prep('Peel and segment orange and grapefruit', {
            equipment: [board.name, knife.name], ingredients: [ORANGE, GRAPEFRUIT],
        }));

        s(platter.add([RADICCHIO, FENNEL, ORANGE, GRAPEFRUIT, ARUGULA], 'arrange on platter'));

        s(dressBowl.add([
            i.oliveOil(2, u.tbsp),
            i.champagneVinegar(30, u.milliliter),
            i.lemonJuice(30, u.milliliter),
            i.honeyDijonMustard(5, u.gram),
            FENNEL,
        ]));
        const dressingReady = dressBowl.mix('fennel vinaigrette');
        s(dressingReady);

        s(platter.combine([dressBowl.result], 'drizzle dressing over salad').waitFor(dressingReady));
        s(instruction('Season with salt and pepper, garnish, and serve', {
            ingredients: [i.seaSalt(0.25, u.tsp), i.blackPepper(0.25, u.tsp)], equipment: [platter.name],
        }));

        return steps;
    })()),
]);

registerGroup('Blueprint', [
    withPlan(createRecipe(
        'protein-nutmix-oliveoil',
        'Blueprint (Nutty Pudding) - Protein, Nut Mix & Olive Oil',
        [
            instruction('Have 1 scoop Blueprint longevity protein on hand', {
                ingredients: [i.longevityProtein(1, u.unit)],
            }),
            instruction('Have 1 scoop Blueprint blueberry nut mix on hand', {
                ingredients: [i.blueberryNutMix(1, u.unit)],
            }),
            instruction('Take 2 shots of Blueprint olive oil', {
                ingredients: [i.oliveOil(2, u.shot)],
            }),
        ],
    ), { planMinutes: 5, portable: false }),
    withPlan(createRecipe(
        'blueprint-longevity-drink',
        'Blueprint Longevity Drink (Longevity Mix, Collagen, Creatine)',
        [
            instruction('Add 1 scoop Blueprint Longevity Mix (Blood Orange) to a glass of water', {
                ingredients: [i.longevityMix(1, u.unit)],
            }),
            instruction('Add 1 scoop Blueprint Collagen Peptides', {
                ingredients: [i.collagenPowder(1, u.unit)],
            }),
            instruction('Add 1 scoop (5g) Blueprint Creatine Monohydrate and stir until dissolved', {
                ingredients: [i.creatine(1, u.unit)],
            }),
        ],
    ), { planMinutes: 3, portable: false }),
]);

registerGroup('Lentils', [
    withPlan(createRecipe('ing-black-lentils-induction-195g', 'Black Lentils (195g ×3) (Induction Stovetop)', (() => {
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);
        const LENTILS = i.blackLentils(195, u.gram);
        const WATER = i.water(24, u.fluidOunce);
        const pot = e.pot();
        const colander = e.colander();
        s(info('195g dry lentils → ~418g cooked (~139g per portion, measured). Keeps in the fridge for 3 days.'));
        s(pot.add([LENTILS, WATER]));
        s(instruction('Place lid fully on pot', { equipment: [pot.name] }));
        s(instruction('Set induction stovetop to 215°', { equipment: [pot.name] }));
        s(Timer.set(24, 'm', 'Cook lentils', { equipment: [pot.name], ingredients: [LENTILS, WATER] }));
        s(instruction('Strain lentils through a colander', { equipment: [pot.name, colander.name], ingredients: [LENTILS] }));
        s(Timer.set(10, 'm', 'Let lentils cool', { ingredients: [LENTILS] }));
        s(instruction('Portion cooked lentils into thirds (~139g each) into three stainless steel containers', { equipment: [pot.name], ingredients: [LENTILS] }));
        s(instruction('Rinse pot and wipe dry with a paper towel (Otherwise Pot Stains)', { equipment: [pot.name] }));
        return steps;
    })()), { planMinutes: 3, portable: true, prepMinutes: 24, perishableDays: 3, sortOrder: 0 }),
    withPlan(createRecipe('ing-black-lentils-induction-130g', 'Black Lentils (130g ×2) (Induction Stovetop)', (() => {
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);
        const LENTILS = i.blackLentils(130, u.gram);
        const WATER = i.water(24, u.fluidOunce);
        const pot = e.pot();
        const colander = e.colander();
        s(info('130g dry lentils → ~330g cooked. Keeps in the fridge for 3 days.'));
        s(info('Tip: you can cook 3 days worth in one batch instead.', { linkRecipeId: 'ing-black-lentils-induction-195g' }));
        s(pot.add([LENTILS, WATER]));
        s(instruction('Place lid fully on pot', { equipment: [pot.name] }));
        s(instruction('Set induction stovetop to 215°', { equipment: [pot.name] }));
        s(Timer.set(24, 'm', 'Cook lentils', { equipment: [pot.name], ingredients: [LENTILS, WATER] }));
        s(instruction('Strain lentils through a colander', { equipment: [pot.name, colander.name], ingredients: [LENTILS] }));
        s(Timer.set(10, 'm', 'Let lentils cool', { ingredients: [LENTILS] }));
        s(instruction('Portion cooked lentils in half (~165g each) into two stainless steel containers', { ingredients: [LENTILS] }));
        s(instruction('Rinse pot and wipe dry with a paper towel (Otherwise Pot Stains)', { equipment: [pot.name] }));
        return steps;
    })()), { planMinutes: 3, portable: true, prepMinutes: 24, perishableDays: 3, sortOrder: 1, hidden: true }),
    withPlan(createRecipe('ing-black-lentils-induction', 'Black Lentils (65g ×1) (Induction Stovetop)', (() => {
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);
        const LENTILS = i.blackLentils(65, u.gram);
        const WATER = i.water(15, u.fluidOunce);
        const pot = e.pot();
        const colander = e.colander();
        s(info('65g dry lentils → 165g cooked. Keeps in the fridge for 3 days.'));
        s(info('Tip: you can cook 3 days worth in one batch instead.', { linkRecipeId: 'ing-black-lentils-induction-195g' }));
        s(pot.add([LENTILS, WATER]));
        s(instruction('Place lid fully on pot', { equipment: [pot.name] }));
        s(instruction('Set induction stovetop to 215°', { equipment: [pot.name] }));
        s(Timer.set(21, 'm', 'Cook lentils', { equipment: [pot.name], ingredients: [LENTILS, WATER] }));
        s(instruction('Strain lentils through a colander', { equipment: [pot.name, colander.name], ingredients: [LENTILS] }));
        s(instruction('Portion 65g cooked lentils into stainless steel container', { ingredients: [LENTILS] }));
        s(instruction('Rinse pot and wipe dry with a paper towel (Otherwise Pot Stains)', { equipment: [pot.name] }));
        return steps;
    })()), { planMinutes: 3, portable: true, prepMinutes: 21, perishableDays: 3, sortOrder: 2 }),
    withPlan(createRecipe('ing-black-lentils-gas', 'Black Lentils (65g ×1) (Gas Stovetop)', (() => {
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);
        const LENTILS = i.blackLentils(65, u.gram);
        const WATER = i.water(15, u.fluidOunce);
        const pot = e.pot();
        const colander = e.colander();
        s(info('65g dry lentils → 165g cooked. Keeps in the fridge for 3 days.'));
        s(info('Tip: you can cook 3 days worth in one batch instead.', { linkRecipeId: 'ing-black-lentils-induction-195g' }));
        s(pot.add([LENTILS]));
        s(instruction('Add water to pot', { equipment: [pot.name], ingredients: [WATER] }));
        s(Timer.set(21, 'm', 'Cook lentils', { equipment: [pot.name], ingredients: [LENTILS, WATER] }));
        s(instruction('Strain lentils through a colander', { equipment: [pot.name, colander.name], ingredients: [LENTILS] }));
        s(instruction('Portion 65g cooked lentils into stainless steel container', { ingredients: [LENTILS] }));
        s(instruction('Rinse pot and wipe dry with a paper towel (Otherwise Pot Stains)', { equipment: [pot.name] }));
        return steps;
    })()), { planMinutes: 3, portable: true, prepMinutes: 21, perishableDays: 3, sortOrder: 3, hidden: true }),
]);

registerGroup('Ingredients', [
    withPlan(createRecipe('ing-macadamia-bar', 'Blueprint Macadamia Bar', [
        instruction('Have 1 Blueprint Macadamia Bar on hand', {
            ingredients: [i.macadamiaBar(1, u.unit)],
        }),
    ]), { planMinutes: 2, portable: true }),
    withPlan(createRecipe('ing-psyllium-husk', 'Psyllium Husk (1 tbsp)', [
        instruction('Have 1 tbsp psyllium husk on hand', {
            ingredients: [i.psyllium(1, u.tbsp)],
        }),
    ]), { planMinutes: 3, portable: false }),
]);

// ============================================================
// TESTING
// ============================================================
// Not a real dish — exercises every step type, equipment method, and
// nutrition/cost edge case in one flow so app changes can be manually smoke
// tested end to end. Hidden from the default Select list; reachable via
// search, "Show hidden recipes", or ?recipe=test-recipe-all-features.
// Timers/gates are kept short (≤10s) — tap 3× rapidly on any of them to skip
// instantly anyway.

registerRecipe(withPlan(createRecipe(
    'test-recipe-all-features',
    'Test Recipe (All Features)',
    (() => {
        const bowl         = e.bowl('test bowl');
        const mixBowl      = e.bowl('mix bowl');
        const pan          = e.pan('test pan');
        const pot          = e.pot();
        const oven         = e.oven();
        const nuwave       = e.nuwavePan();
        const cuttingBoard = e.cuttingBoard();
        const platter      = e.platter();

        // requiresDateLabel: true — exercises the auto-inserted put-away/date-label step
        const MACADAMIA_MILK = i.macadamiaNutMilk(1, u.cup);
        // ok nutrition + ok cost, via a chained density conversion (cup → pound → ounce)
        const CARROT_OK      = i.carrot(1, u.cup);
        // uncomputable nutrition: has data, but no unit was given on the recipe ingredient
        const CARROT_NO_UNIT = i.carrot();
        // uncomputable nutrition + cost: recipe unit ("bag") has no conversion path to the label's keyed unit
        const CHICKPEAS_BAG  = i.chickpeas(1, u.bag);
        // missing nutrition + missing cost: no nutrition block, no products at all
        const OIL_SPRAY       = i.avocadoOil(1, u.spray);
        // missing nutrition, but ok cost — exercises the split ok/missing state on one ingredient
        const PEPPER_OZ        = i.blackPepper(1, u.ounce);
        const MUSHROOM         = i.kingOysterMushroom(1, u.unit);

        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);

        s(info('Test recipe — exercises every step type, equipment method, and nutrition/cost edge case. Tap 3× rapidly on any timer/gate to skip it instantly.'));
        s(info('Info steps can link to another recipe.', { linkRecipeId: 'blueprint-smoothie' }));

        s(prepOnly('Prep-only step — only visible on the Prep screen'));
        s(prep('Prep step — visible on both the Prep screen and here'));

        s(bowl.add([MACADAMIA_MILK, CARROT_OK, CARROT_NO_UNIT, CHICKPEAS_BAG, OIL_SPRAY, PEPPER_OZ], 'nutrition/cost edge cases'));
        // Auto-inserted cleanup-label step for MACADAMIA_MILK lands right here.
        s(bowl.mix('test mix result'));
        s(instruction('Use the mix result (composite ingredient — excluded from the nutrition breakdown)', {
            ingredients: [bowl.result], equipment: [bowl.name],
        }));

        s(oven.preheat(400));    // fixed 15 min duration — tap 3× to skip
        s(nuwave.preheat(325));  // NuwaveEquipment override — fixed 2 min duration — tap 3× to skip

        s(pan.add([i.oliveOil(1, u.tbsp)]));
        s(cuttingBoard.slice(MUSHROOM));
        s(pan.add([MUSHROOM]));
        // pot gets contents *before* being nested/broiled so the steps below actually exercise
        // place()/broil()'s auto-inheritance of a nested vessel's contents, not an empty snapshot.
        s(pot.add([i.seaSalt(0.25, u.tsp), i.water(8, u.fluidOunce)]));
        s(oven.place(pan, 'Bake test pan', time.seconds(8), 375));
        s(oven.place(pot));  // label/duration-less overload — plain instruction step
        const panTransferred = pan.transfer(mixBowl, [MUSHROOM]);
        s(panTransferred);
        s(mixBowl.spray(i.avocadoOil(1, u.spray)));
        s(mixBowl.flip());
        s(mixBowl.stir());
        s(oven.broil('Broil test', time.seconds(8)));  // inherits contents from both nested vessels (pan + pot)

        s(pot.combine([i.blackPepper(0.1, u.tsp)], 'season'));
        s(platter.combine([pot.result], 'plate it').waitFor(panTransferred));

        s(Timer.gate('Did it finish cooking?', 5, 's'));

        const garnishPrepped = instruction('Garnish prep (no shared resources with the next step)');
        s(garnishPrepped);
        s(instruction('Add garnish').waitFor(garnishPrepped));

        s(Timer.set(5, 's', '⏰ Quick alarm test'));

        s(cleanup(pan.name));
        s(cleanup(mixBowl.name));

        s(instruction('Test recipe complete ✅'));

        return steps;
    })(),
    'Testing',
    2,
), { planMinutes: 2, portable: false, prepMinutes: 1, perishableDays: 1, hidden: true }));

// ============================================================
// BUNDLES
// ============================================================

const DAILY_BLUEPRINT_RECIPE_IDS: string[] = [
    'blueprint-smoothie',
    'blueprint-longevity-drink',
    'ing-black-lentils-induction',
    'ing-macadamia-bar',
    'ing-macadamia-bar',
    'ing-psyllium-husk',
    'protein-nutmix-oliveoil',
    'asian-dense-bean-salad',
];

registerBundle({
    id: 'daily-blueprint',
    name: 'Daily Blueprint',
    recipeIds: DAILY_BLUEPRINT_RECIPE_IDS,
});

registerBundle({
    id: 'weekly-blueprint',
    name: 'Weekly Blueprint (×5)',
    recipeIds: Array(5).fill(DAILY_BLUEPRINT_RECIPE_IDS).flat(),
});

// ============================================================
// START APP
// ============================================================

document.addEventListener('DOMContentLoaded', bootstrap);