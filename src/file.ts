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

const NUTRIENT_KEYS = ['calories', 'fat', 'saturatedFat', 'transFat', 'cholesterol', 'carbs', 'sodium', 'sugar', 'protein', 'fiber'] as const;
type NutritionTotals = Record<typeof NUTRIENT_KEYS[number], number>;

// A nutrition label, keyed by unit name (e.g. 'cup', 'tsp'). Values are per
// serving; servingSize is in the keyed unit.
export type NutritionLabel = Record<string, { servings: number; servingSize: number } & NutritionTotals>;

// Amazon's Subscribe & Save auto-delivery discount, expressed as eligibility for each
// percent tier rather than a hardcoded price - the discounted price is always a percent
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

// Where/how a Product can be bought - retailer-specific and non-exclusive: the same
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
    // a bunch) - size/sizeUnit describe that one container, so "have N of them"
    // tracking on the shopping screen is on by default, labeled with this word
    // when set (falls back to the generic "package" otherwise).
    packageUnit?: Unit;
    // Set for products priced per unit weight/volume with no real fixed-size
    // container to count (e.g. cabbage sold loose per lb) - disables package
    // tracking so the shopping screen falls back to entering the recipe unit
    // (cups, lbs, ...) directly instead of a fake "package" count.
    bulk?: boolean;
}

// The listing (of the selected product) actually used for cost/price display - the
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
    // Recipe ingredients must always be measured.  Keeping these required makes an
    // unmeasured i.ingredient() call a TypeScript/build error instead of silently
    // rendering as an ingredient with no amount.
    quantity: number;
    unit: Unit;
    perishableDays?: number;
    nutrition?: NutritionLabel;
    products?: Product[];
    defaultBrand?: string;
    isMeatProduct?: boolean;
    requiresDateLabel?: boolean;
    conversions?: IngredientConversions;
    // Pan temp at which this fat reaches its shimmer point.  Refined/high-smoke-point oils
    // (e.g. avocado) shimmer hotter; delicate ones (e.g. extra-virgin olive oil)
    // shimmer cooler.  Heat steps read this to time how long the oil needs in a hot pan.
    shimmerAt?: number;
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
    startWhenIds?: number[];
    prep?: boolean;
    prepOnly?: boolean;
    linkRecipeId?: string;  // info steps only: renders a clickable link to another recipe
    waitFor(...steps: Step[]): this;
    startWhen(...steps: Step[]): this;
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
    caloriesCutoff: string;  // "HH:MM" - prefer placing all eating before this time
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

export function isHhmm(value: unknown): value is string {
    return typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

// Saved plans are untrusted (old builds, partial writes, private-mode exceptions).
// Drop entries that would crash the planner, and keep a valid empty block list
// when the user deleted every block on purpose.
export function normalizePlanConfig(value: unknown): PlanConfig {
    const fallback = JSON.parse(JSON.stringify(DEFAULT_PLAN_CONFIG)) as PlanConfig;
    if (!value || typeof value !== 'object' || Array.isArray(value)) return fallback;
    const raw = value as { blocks?: unknown; caloriesCutoff?: unknown };
    if (!Array.isArray(raw.blocks)) return fallback;
    const seen = new Set<string>();
    const blocks = raw.blocks.flatMap((block): PlanBlock[] => {
        if (!block || typeof block !== 'object') return [];
        const candidate = block as Partial<PlanBlock>;
        if (typeof candidate.id !== 'string' || !candidate.id || seen.has(candidate.id)) return [];
        if (!isHhmm(candidate.start) || !isHhmm(candidate.end)) return [];
        if (candidate.type !== 'home' && candidate.type !== 'away' && candidate.type !== 'portable') return [];
        seen.add(candidate.id);
        return [{ id: candidate.id, start: candidate.start, end: candidate.end, type: candidate.type }];
    });
    if (raw.blocks.length > 0 && blocks.length === 0) return fallback;
    return {
        blocks,
        caloriesCutoff: isHhmm(raw.caloriesCutoff) ? raw.caloriesCutoff : fallback.caloriesCutoff,
    };
}

function storageGet(key: string): string | null {
    try {
        if (typeof localStorage === 'undefined') return null;
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function storageSet(key: string, value: string): void {
    try {
        if (typeof localStorage === 'undefined') return;
        localStorage.setItem(key, value);
    } catch {
        // Private mode and full storage should not take down the cook screen.
    }
}

function loadPlanConfig(): PlanConfig {
    const raw = storageGet(PLAN_CONFIG_KEY);
    if (!raw) return normalizePlanConfig(undefined);
    try {
        return normalizePlanConfig(JSON.parse(raw));
    } catch {
        return normalizePlanConfig(undefined);
    }
}

function savePlanConfig(cfg: PlanConfig): void {
    storageSet(PLAN_CONFIG_KEY, JSON.stringify(cfg));
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
    showHidden:        storageGet(SHOW_HIDDEN_RECIPES_KEY) === 'true',
};

function setShowHidden(value: boolean): void {
    state.showHidden = value;
    storageSet(SHOW_HIDDEN_RECIPES_KEY, String(value));
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

export function convertUnits(quantity: number, from: string, to: string): number | null {
    if (from === to) return quantity;
    const factor = CONVERSION_FACTORS[from]?.[to];
    if (factor === undefined) return null;
    return quantity * factor;
}

// Extends convertUnits with ingredient-specific density conversions (e.g. unit → cup → oz).
// Recursively chains density hops until a physical conversion closes the gap, or returns null.
export function convertWithDensity(
    quantity: number,
    from: string,
    to: string,
    conversions?: IngredientConversions,
    seen: Set<string> = new Set()
): number | null {
    const physical = convertUnits(quantity, from, to);
    if (physical !== null) return physical;
    if (!conversions || seen.has(from)) return null;
    seen.add(from);
    const density = conversions[from];
    if (!density) return null;
    const afterDensity = quantity * density.factor;
    const intermediate = density.to.name;
    if (intermediate === to) return afterDensity;
    return convertWithDensity(afterDensity, intermediate, to, conversions, seen);
}

// ============================================================
// FORMATTERS
// ============================================================

function pluralize(word: string, count: number): string {
    return Math.abs(count) <= 1 ? word : `${word}s`;
}

function formatQuantity(quantity: number): string {
    const fractions: Record<number, string> = {
        0.125: '⅛', 0.167: '⅙', 0.25: '¼', 0.333: '⅓', 0.5: '½', 0.667: '⅔', 0.75: '¾',
    };
    const whole   = Math.floor(quantity);
    const decimal = Number((quantity - whole).toFixed(3));
    const fraction = Object.entries(fractions).find(
        ([v]) => Math.abs(decimal - Number(v)) < 0.01
    )?.[1];
    if (!fraction) return String(quantity);
    return `${whole || ''}${fraction}`;
}

export function formatIngredient(ingredient: Ingredient): string {
    const { quantity, unit, name } = ingredient;
    if (!unit || !unit.name) return name;
    const amount = quantity ?? 0;
    if (unit.name === 'unit') return `${formatQuantity(amount)} ${pluralize(name, amount)}`;
    // Abbreviations with no explicit plural (tsp, tbsp) stay as written.
    // "2 tbsps" and "½ tsps" were display bugs, not recipe wording.
    const unitText = Math.abs(amount) <= 1 ? unit.name : (unit.plural || unit.name);
    return `${formatQuantity(amount)} ${unitText} ${name}`;
}

// Same as formatIngredient but without the item name - used to describe an
// arbitrary quantity (e.g. "how much is still needed") in an ingredient's unit.
function formatQuantityUnit(quantity: number, unit?: Unit): string {
    if (!unit || !unit.name) return formatQuantity(quantity);
    const unitText = Math.abs(quantity) <= 1 ? unit.name : (unit.plural || unit.name);
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
    (step as any).startWhen = function(...steps: Step[]): Step {
        for (const dep of steps) {
            step.startWhenIds = [...(step.startWhenIds ?? []), dep.id];
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

const toSeconds = (amount: number, unit: 's' | 'm' | 'h'): number =>
    ({ s: time.seconds, m: time.minutes, h: time.hours })[unit](amount);

export const Timer = {
    set: (amount: number, unit: 's' | 'm' | 'h', label: string, opts: Partial<Step> = {}): Step => {
        return createStep({ type: 'timer', text: label, durationSeconds: toSeconds(amount, unit), ...opts });
    },
    // Asks `question` immediately. "No" cooks for `retryAmount retryUnit` (with an alarm at
    // the end) and re-asks; "Yes" completes the step. Loops until answered "Yes".
    gate: (question: string, retryAmount: number, retryUnit: 's' | 'm' | 'h', opts: Partial<Step> = {}): Step => {
        return createStep({ type: 'gate', text: question, durationSeconds: toSeconds(retryAmount, retryUnit), ...opts });
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

    // The target temp this vessel was last preheated to.  Later steps (e.g. addOil +
    // heatUp) read it so the heat-up wait reflects how hot the pan already is.
    // Pan overrides preheat with the NuWave induction timings. Other equipment keeps
    // the 15-minute default below.
    protected _targetTemp: number | undefined;

    get targetTemp(): number | undefined { return this._targetTemp; }

    preheat(temperature: number): Step {
        this._targetTemp = temperature;
        return timerStep(`Preheat ${this.name} to ${temperature}°`, time.minutes(15), {
            equipment: [this.name],
        });
    }

    setTemp(temperature: number): Step {
        this._targetTemp = temperature;
        return createStep({
            type: 'instruction',
            text: `Set ${this.name} to ${temperature}°`,
            equipment: [this.name],
        });
    }

    // Adds oil to this vessel.  Mirror of add() - keeps the oil in `contents` so later
    // steps can reference it,but gives oils a dedicated verb on Equipment: e.g.
    // `pan.addOil(oil)`` then `pan.heatUp()` reads the pan's temp to time the wait..

    addOil(oil: Ingredient, note?: string): Step {
        this.contents.push(oil);
        const single = createStep({
            type: 'instruction',
            text: formatIngredient(oil),
            ingredients: [oil],
            equipment: [this.name],
        });
        return createStep({
            type: 'instruction',
            text: `Add ${formatIngredient(oil)} to ${this.name}${note ? ` - ${note}` : ''}`,
            equipment: [this.name],
            ingredients: [oil],
            children: [single],
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
                    ? `${formatIngredient(ing)} - ${itemNote}`
                    : formatIngredient(ing),
                ingredients: [ing],
                equipment: [this.name],
            });
        });
        return createStep({
            type: 'instruction',
            text: `Add to ${this.name}${note ? ` - ${note}` : ''}`,
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
        return timerStep(`Broil - ${label}`, durationSeconds, {
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

    spray(ingredient: Ingredient, opts: { heatUp?: boolean } = {}): Step[] {
        const sprayStep = createStep({
            type: 'instruction',
            text: `Spray ${ingredient.name} on ${this.name}`,
            equipment: [this.name],
            ingredients: [ingredient],
        });
        if (!opts.heatUp) return [sprayStep];
        // Two independent top-level steps (spray, then heat-up timer) rather than a
        // container: keeps the heat-up timer on screen after it completes and avoids
        // duplicating the "spray" text in a container header + child.
        return [sprayStep, this.heatUp(ingredient)];
    }

    // Heats oil on this pan up to its shimmer point before food goes in.  A real countdown
    // timer, not a passive instruction -the point is the delay.  How long depends on how hot
    // the pan already is (its preheat target)and on the oil:a hotter pan shimmers faster,
    // and an oil with a lower shimmerAt reaches shimmer sooner than a high-temp one..
    heatUp(oil?: Ingredient, overrideSeconds?: number): Step {
        const target = this.targetTemp ?? 325;
        const shimmerAt = oil ? (oil.shimmerAt ?? 300) : 300;
        const delta = Math.max(Math.min(target - shimmerAt, 150), 20);
        const seconds = overrideSeconds ?? Math.round((delta / 65 + 0.6) * 30);
        const what = oil ? formatIngredient(oil) : 'Oil';
        return timerStep(
            overrideSeconds !== undefined
                ? `Let ${what} heat up in ${this.name} until it shimmers`
                : `Heat ${what} to shimmer (${target}° pan)`,
            seconds,
            { equipment: [this.name], ...(oil ? { ingredients: [oil] } : {}) }
        );
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
            text: `Combine ${ingredients.map(i => i.name).join(', ')} in ${this.name}${note ? ` - ${note}` : ''}`,
            equipment:   [this.name],
            ingredients: allConstituents,
        });
    }
}

// The one stovetop pan. Every recipe pan is this NuWave induction pan.
// A label overrides the displayed name (granola's 8×8, the panko pan, the test pan)
// without changing preheat timings. Instances stay separate so contents and the
// preheat target do not leak between recipes.
class Pan extends Equipment {
    constructor(label?: string) { super('Nuwave pan', label); }

    preheat(temperature: number): Step {
        this._targetTemp = temperature;
        const duration = temperature <= 350 ? time.seconds(45) : time.minutes(2);
        return timerStep(`Preheat ${this.name} to ${temperature}°`, duration, { equipment: [this.name] });
    }
}

export const e = {
    bowl:         (label?: string) => new Equipment('bowl',          label),
    pan:          (label?: string) => new Pan(label),
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
    glass:        (label?: string) => new Equipment('glass',         label),
    siliconeBag:  (label?: string) => new Equipment('silicone bag',  label),
};

// ============================================================
// RECIPE REGISTRATION
// ============================================================

// Every step, parent before its children, in recipe order.
export function* walkSteps(steps: Step[]): Generator<Step> {
    for (const step of steps) {
        yield step;
        if (step.children) yield* walkSteps(step.children);
    }
}

// Distinct ingredients used anywhere in these steps, in first-use order.
function stepIngredients(steps: Step[]): Set<Ingredient> {
    return new Set([...walkSteps(steps)].flatMap(step => step.ingredients ?? []));
}

function collectIngredientsWithLabel(steps: Step[]): Ingredient[] {
    return [...stepIngredients(steps)].filter(ing => ing.requiresDateLabel);
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
    return [...new Set(state.selectedRecipeIds)].flatMap(id => state.recipes.get(id) ?? []);
}

// How many times each id appears, in first-appearance order.
function countBy(ids: string[]): Map<string, number> {
    const counts = new Map<string, number>();
    for (const id of ids) counts.set(id, (counts.get(id) ?? 0) + 1);
    return counts;
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
// screen's `state.searchQuery` - used by the Nutrition screen's "Add a recipe" search so
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
        if (step.prepOnly) continue;
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
    const manualStartWhens = new Map<number, number[]>();
    steps.forEach(s => {
        if (s.waitForIds && s.waitForIds.length > 0) manualWaits.set(s.id, [...s.waitForIds]);
        s.waitForIds = undefined;
        if (s.startWhenIds && s.startWhenIds.length > 0) manualStartWhens.set(s.id, [...s.startWhenIds]);
        s.startWhenIds = undefined;
    });
    const equipClaims: Map<string, number>     = new Map();
    const ingClaims:   Map<Ingredient, number> = new Map();
    const claimableIng = (ing: Ingredient): boolean => ing.name !== 'Water';
    function getBlockingIds(step: Step): number[] {
        const blocking = new Set<number>();
        for (const eq of (step.equipment ?? [])) {
            const id = equipClaims.get(`${step.recipeId}::eq::${eq}`);
            if (id !== undefined) blocking.add(id);
        }
        for (const ing of (step.ingredients ?? [])) {
            if (!claimableIng(ing)) continue;
            const id = ingClaims.get(ing);
            if (id !== undefined) blocking.add(id);
        }
        return [...blocking];
    }
    function setClaims(step: Step): void {
        for (const eq of (step.equipment ?? [])) equipClaims.set(`${step.recipeId}::eq::${eq}`, step.id);
        for (const ing of (step.ingredients ?? [])) {
            if (!claimableIng(ing)) continue;
            ingClaims.set(ing, step.id);
        }
    }
    for (const step of steps) {
        const startWhen = new Set<number>();
        for (const id of (manualStartWhens.get(step.id) ?? [])) startWhen.add(id);
        if (startWhen.size > 0) step.startWhenIds = [...startWhen];
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
        for (const ingredient of stepIngredients(recipe.steps)) {
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

export function normalizeInventory(value: unknown): Record<string, number> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    const inventory: Record<string, number> = {};
    for (const [key, amount] of Object.entries(value)) {
        if (typeof amount === 'number' && Number.isFinite(amount)) inventory[key] = amount;
    }
    return inventory;
}

function loadInventory(): Record<string, number> {
    const raw = storageGet(INVENTORY_KEY);
    if (!raw) return {};
    try {
        return normalizeInventory(JSON.parse(raw));
    } catch {
        return {};
    }
}

function saveInventory(inventory: Record<string, number>): void {
    storageSet(INVENTORY_KEY, JSON.stringify(inventory));
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

type NutritionResult =
    | { status: 'ok'; totals: NutritionTotals; brand?: string }
    | { status: 'missing' }
    | { status: 'uncomputable'; reason: string };

type CostResult =
    | { status: 'ok'; cost: number; brand?: string }
    | { status: 'missing' }
    | { status: 'uncomputable'; reason: string };

const mapTotals = (fn: (key: keyof NutritionTotals) => number): NutritionTotals =>
    Object.fromEntries(NUTRIENT_KEYS.map(key => [key, fn(key)])) as NutritionTotals;
const emptyTotals = (): NutritionTotals => mapTotals(() => 0);
const addTotals   = (a: NutritionTotals, b: NutritionTotals): NutritionTotals => mapTotals(key => a[key] + b[key]);
const scaleTotals = (t: NutritionTotals, n: number): NutritionTotals => mapTotals(key => t[key] * n);

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
        totals: mapTotals(key => (facts[key] ?? 0) * servingsUsed),
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
// contains - the inverse of the recipeUnit → packageUnit conversion used above, derived
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
    cost:         number;         // sum of ok ingredient costs (unscaled - multiply by servings)
    covered:      number;
    missing:      number;
    uncomputable: number;
    costMissing:  number;         // ingredients with no price data (missing or uncomputable)
    total:        number;
    breakdown:    { ing: Ingredient; result: NutritionResult; costResult: CostResult }[];
}

function recipeNutrition(recipe: Recipe): RecipeNutrition {
    const breakdown = [...stepIngredients(recipe.steps)]
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

// Nutrition line when any ingredient has data, else just the cost, else a placeholder.
function totalsText(covered: number, totals: NutritionTotals, hasCost: boolean, cost: number): string {
    if (covered > 0) return formatTotals(totals, hasCost ? cost : undefined);
    return hasCost ? `$${cost.toFixed(2)}` : '- no computable data';
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

type Child = Node | string | null | undefined | false;
interface Props {
    class?: string;
    text?: string;
    testid?: string;
    attrs?: Record<string, string>;
    on?: { [K in keyof HTMLElementEventMap]?: (ev: HTMLElementEventMap[K]) => void };
    [prop: string]: unknown;  // any other DOM property: id, type, value, htmlFor, href, min...
}

// Build an element in one call: h('span', { class: 'badge', text: '×2' }, child, ...).
// Buttons default to type="button".
function h<K extends keyof HTMLElementTagNameMap>(tag: K, props: Props = {}, ...children: Child[]): HTMLElementTagNameMap[K] {
    const el = document.createElement(tag);
    const { class: className, text, testid, attrs, on, ...rest } = props;
    if (el instanceof HTMLButtonElement) el.type = 'button';
    Object.assign(el, rest);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    if (testid) el.setAttribute('data-testid', testid);
    for (const [name, value] of Object.entries(attrs ?? {})) el.setAttribute(name, value);
    for (const [type, listener] of Object.entries(on ?? {})) el.addEventListener(type, listener as EventListener);
    el.append(...children.filter((child): child is Node | string => child !== null && child !== undefined && child !== false));
    return el;
}

// Extra words for screen readers only, e.g. which recipe a "−" button belongs to.
function srOnly(text: string): HTMLSpanElement {
    return h('span', { class: 'visually-hidden', text: ` ${text}` });
}

function announce(message: string): void {
    const region = document.getElementById('status-live');
    if (!region) return;
    region.textContent = '';
    window.setTimeout(() => { region.textContent = message; }, 50);
}

// Clear #app and give the screen its heading.
function screen(title: string): HTMLDivElement {
    const root = getElement<HTMLDivElement>('app');
    clear(root);
    root.appendChild(h('h1', { text: title }));
    return root;
}

function searchField(id: string, label: string, placeholder: string, value: string, onInput: (value: string) => void): [HTMLLabelElement, HTMLInputElement] {
    return [
        h('label', { htmlFor: id, class: 'search-label', text: label }),
        h('input', {
            id, type: 'search', placeholder, value, class: 'search-input', autocomplete: 'off', testid: id,
            on: { input: (ev) => onInput((ev.target as HTMLInputElement).value) },
        }),
    ];
}

function backButton(label: string, onClick: () => void): HTMLButtonElement {
    return h('button', { class: 'start-over-btn', text: label, on: { click: onClick } });
}

function removeServing(recipeId: string): void {
    const idx = state.selectedRecipeIds.lastIndexOf(recipeId);
    if (idx !== -1) state.selectedRecipeIds.splice(idx, 1);
}

// ============================================================
// COPY TO CLIPBOARD
// ============================================================

function getRecipeURL(recipeId: string): string {
    const baseURL = window.location.origin + window.location.pathname;
    return `${baseURL}?recipe=${recipeId}`;
}

function createCopyButton(recipeId: string): HTMLButtonElement {
    const recipeName = state.recipes.get(recipeId)?.name ?? recipeId;
    const restingLabel = `Copy link to ${recipeName}`;
    // Show the result for 1.5s, then go back to "Copy".
    const flash = (text: string, label: string): void => {
        btn.textContent = text;
        btn.setAttribute('aria-label', label);
        announce(label);
        setTimeout(() => {
            btn.textContent = 'Copy';
            btn.setAttribute('aria-label', restingLabel);
        }, 1500);
    };
    const btn = h('button', {
        class: 'copy-link-btn', text: 'Copy', attrs: { 'aria-label': restingLabel }, testid: `copy-${recipeId}`,
        on: {
            click: (ev) => {
                ev.stopPropagation();
                // Wrapped so a missing Clipboard API (plain-http LAN address) also reads "Copy failed".
                Promise.resolve().then(() => navigator.clipboard.writeText(getRecipeURL(recipeId))).then(
                    () => flash('Copied', `Copied link to ${recipeName}`),
                    () => flash('Copy failed', `Copy failed for ${recipeName}`),
                );
            },
        },
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
    // separate throwaway one - some browsers (notably Safari) grant "allowed to autoplay"
    // per media element based on it having been played directly during a user gesture at
    // least once, rather than unlocking playback page-wide. Without this, the alarm's
    // audio.play() call - which always fires later from a setInterval callback, not a
    // gesture - gets rejected with NotAllowedError the first time a real (non-test) timer
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
    const root = screen('Recipes');
    root.appendChild(h('search', {}, ...searchField('recipe-search', 'Search recipes', 'Recipe name', state.searchQuery, (value) => {
        state.searchQuery = value;
        renderRecipeList();
    })));

    if ([...state.recipes.values()].some(r => r.hidden)) {
        const toggleLabel = () => state.showHidden ? 'Hide hidden recipes' : 'Show hidden recipes';
        const toggleBtn = h('button', {
            class: 'show-hidden-toggle', text: toggleLabel(),
            on: {
                click: () => {
                    setShowHidden(!state.showHidden);
                    renderRecipeList();
                    toggleBtn.textContent = toggleLabel();
                },
            },
        });
        root.appendChild(toggleBtn);
    }

    root.append(h('div', { id: 'recipe-list' }), h('div', { id: 'actions', class: 'actions' }));
    refreshSelect();
}

function renderRecipeList(): void {
    const root = getElement<HTMLDivElement>('recipe-list');
    clear(root);

    const recipes = getFilteredRecipes();

    if (recipes.length === 0) {
        root.appendChild(h('p', { text: 'No recipes found.', class: 'empty' }));
        appendAddIngredientButton(root);
        appendBuildFooter(root);
        return;
    }

    if (state.bundles.size > 0 && !state.searchQuery) {
        root.appendChild(h('h2', { text: 'Bundles', class: 'group-heading' }));
        state.bundles.forEach((bundle) => {
            const names = [...countBy(bundle.recipeIds)]
                .map(([id, count]) => {
                    const name = state.recipes.get(id)?.name ?? id;
                    return count > 1 ? `${name} ×${count}` : name;
                })
                .join(' · ');
            root.appendChild(h('div', { class: 'bundle-row' },
                h('button', {
                    class: 'bundle-btn', testid: `bundle-${bundle.id}`, text: bundle.name,
                    on: {
                        click: () => {
                            for (const id of bundle.recipeIds) state.selectedRecipeIds.push(id);
                            unlockAudioContext();
                            refreshSelect();
                        },
                    },
                }, h('span', { class: 'bundle-sub', text: names })),
            ));
        });
    }

    const groups = new Map<string, Recipe[]>();
    recipes.forEach((recipe) => {
        const key = recipe.group ?? '';
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(recipe);
    });

    groups.forEach((groupRecipes, groupName) => {
        if (groupName) root.appendChild(h('h2', { text: groupName, class: 'group-heading' }));

        groupRecipes.forEach((recipe) => {
            const count = getServings(recipe.id);
            const btn = h('button', {
                class: 'recipe-btn', testid: `recipe-${recipe.id}`,
                on: {
                    click: () => {
                        state.selectedRecipeIds.push(recipe.id);
                        unlockAudioContext();
                        announce(`Added a serving of ${recipe.name}. ${getServings(recipe.id)} selected.`);
                        refreshSelect();
                    },
                },
            },
                h('span', { text: recipe.name }),
                recipe.hidden && h('span', { class: 'hidden-badge', text: 'hidden' }),
                count > 1 && h('span', { class: 'count-badge', text: `×${count}` }),
            );
            btn.classList.toggle('selected', count > 0);

            const minusBtn = h('button', {
                class: 'count-minus-btn', text: '−', testid: `remove-serving-${recipe.id}`,
                on: {
                    click: (ev) => {
                        ev.stopPropagation();
                        removeServing(recipe.id);
                        announce(`Removed a serving of ${recipe.name}. ${getServings(recipe.id)} selected.`);
                        refreshSelect();
                    },
                },
            }, srOnly(`Remove one serving of ${recipe.name}`));
            minusBtn.style.visibility = count > 0 ? 'visible' : 'hidden';

            const lastBtn = recipe.adhoc
                ? h('button', {
                    class: 'adhoc-remove-btn', text: '×',
                    on: {
                        click: (ev) => {
                            ev.stopPropagation();
                            state.selectedRecipeIds = state.selectedRecipeIds.filter(id => id !== recipe.id);
                            state.recipes.delete(recipe.id);
                            refreshSelect();
                        },
                    },
                }, srOnly(`Remove ${recipe.name}`))
                : createCopyButton(recipe.id);
            root.appendChild(h('div', { class: 'recipe-row' }, btn, minusBtn, lastBtn));
        });
    });

    appendAddIngredientButton(root);
    appendBuildFooter(root);
}

function refreshSelect(): void {
    renderRecipeList();
    updateActionButtons();
}

function appendAddIngredientButton(root: HTMLElement): void {
    root.appendChild(h('div', { class: 'add-ingredient-row' },
        h('button', {
            class: 'add-ingredient-btn', testid: 'add-ingredient', text: '+ Add an ingredient',
            on: {
                click: () => {
                    adhocReturnScreen = state.screen;
                    navigateTo('add-ingredient');
                },
            },
        }),
    ));
}

function updateActionButtons(): void {
    const actions = getElement<HTMLDivElement>('actions');
    clear(actions);
    if (state.selectedRecipeIds.length === 0) return;

    const selectedRecipes = getSelectedRecipes();
    const hasPrep     = selectedRecipes.some(r => [...walkSteps(r.steps)].some(s => s.prep));
    const hasCookable = selectedRecipes.some(r => !r.adhoc);
    // Order matters: .action-btn:first-child / :last-child pick the blue and green colors.
    const buttons: [label: string, screen: Screen, className: string, testid: string, show: boolean][] = [
        ['🛒 Go Shopping',   'shopping',  'action-btn',                      'go-shopping',   true],
        ['📊 Nutrition',     'nutrition', 'action-btn action-btn-nutrition', 'open-nutrition', true],
        ['📅 Plan',          'plan',      'action-btn action-btn-plan',      'open-plan',      true],
        ['🔪 Prep',          'prep',      'action-btn action-btn-prep',      'open-prep',      hasPrep],
        ['🍳 Start Cooking', 'cooking',   'action-btn',                      'start-cooking',  hasCookable],
    ];
    for (const [label, screen, className, testid, show] of buttons) {
        if (!show) continue;
        actions.appendChild(h('button', { class: className, testid, text: label, on: { click: () => navigateTo(screen) } }));
    }
}

// ============================================================
// SCREEN: SHOPPING
// ============================================================

function renderShoppingScreen(): void {
    const root = screen('Shopping List');
    const inventory = loadInventory();

    buildShoppingList().forEach((ingredient) => {
        const panel = h('div', { class: 'panel' }, h('span', { text: formatIngredient(ingredient) }));

        const required    = ingredient.quantity ?? 0;
        const product      = selectedProduct(ingredient);
        // Track "have" in whole packages by default - size/sizeUnit already describe
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

        const haveId = `have-${key.replace(/[^a-z0-9]+/gi, '-')}`;
        const neededEl = h('span', { class: 'inventory-needed' });
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

        const haveInput = h('input', {
            id: haveId, type: 'number', min: '0', step: 'any', class: 'inventory-have-input', placeholder: '0', autocomplete: 'off',
            value: inventory[key] ? String(inventory[key]) : '',
            on: {
                click: (ev) => ev.stopPropagation(),
                input: () => {
                    const v = parseFloat(haveInput.value);
                    const have = isNaN(v) || v < 0 ? 0 : v;
                    if (have > 0) inventory[key] = have;
                    else delete inventory[key];
                    saveInventory(inventory);
                    updateNeeded(have);
                },
            },
        });

        panel.appendChild(h('div', { class: 'inventory-row' },
            h('label', { class: 'inventory-have-label', htmlFor: haveId, text: trackByPackage ? `Have (${packageWord(2)}):` : 'Have:' }),
            haveInput,
            neededEl,
            trackByPackage && h('span', {
                class: 'inventory-package-hint',
                text: `1 ${packageWord(1)} ≈ ${formatQuantityUnit(perPackage as number, ingredient.unit)}${product?.variant ? ` (${product.variant})` : ''}`,
            }),
        ));

        const products = ingredient.products ?? [];
        // One row per (product, listing) pair - a single product can have several listings
        // (e.g. the same item sold on Amazon and on the brand's own site at different prices).
        const pairs = products.flatMap((product) => (product.listings ?? []).map((listing) => ({ product, listing })));
        if (pairs.length > 0) {
            const chosenProduct = selectedProduct(ingredient);
            const chosenListing = chosenProduct ? cheapestListing(chosenProduct) : undefined;
            const perUnit = (price: number | undefined, size: number | undefined): number =>
                price !== undefined && size !== undefined ? price / size : Infinity;
            const sorted = [...pairs].sort((a, b) => perUnit(a.listing.price, a.product.size) - perUnit(b.listing.price, b.product.size));
            panel.appendChild(h('div', { class: 'purchase-links' }, ...sorted.map(({ product, listing }) => {
                const isChosen = product === chosenProduct && listing === chosenListing;
                const unitName = product.sizeUnit?.name ?? 'unit';
                const variant = product.variant ? ` ${product.variant}` : '';
                const where   = listing.store ? ` · ${listing.store}` : '';
                const pkg     = listing.price !== undefined && product.size !== undefined
                    ? ` - $${listing.price} / ${product.size} ${product.sizeUnit?.name ?? ''}`.trimEnd()
                    : '';
                const ppu     = listing.price !== undefined && product.size !== undefined
                    ? ` ($${(listing.price / product.size).toFixed(2)}/${unitName})`
                    : '';
                const sasPercent = listing.store === stores.amazon ? subscribeAndSavePercent(listing.discount) : undefined;
                const sasPrice   = sasPercent !== undefined && listing.price !== undefined
                    ? listing.price * (1 - sasPercent / 100) : undefined;
                const sasPpu  = sasPrice !== undefined && product.size !== undefined
                    ? ` ($${(sasPrice / product.size).toFixed(2)}/${unitName})` : '';
                const sas     = sasPrice !== undefined
                    ? ` · S&S ${sasPercent}% $${sasPrice.toFixed(2)}${sasPpu}` : '';
                const pick    = isChosen ? ' ✓' : '';
                return h('a', {
                    href: listing.link ?? '#', target: '_blank', class: isChosen ? 'purchase-link default-product' : 'purchase-link',
                    text: `${product.brand}${variant}${where}${pkg}${ppu}${sas}${pick}`,
                });
            })));
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
    const panel = h('div', { class: 'panel macro-targets' },
        h('div', { class: 'macro-targets-title', text: 'Daily Targets' }),
        h('div', { class: 'macro-row macro-header' }, ...['', 'Target', 'Eaten', 'Remaining'].map(text => h('span', { text }))),
    );

    const totalCals = grand.calories > 0 ? grand.calories : null;
    const pct = (grams: number | null, calsPerGram: number): string =>
        grams !== null && totalCals ? ` (${Math.round((grams * calsPerGram / totalCals) * 100)}%)` : '';

    const totalMacroG = grand.protein + grand.fat + grand.carbs;
    const macroPct = (grams: number | null): string =>
        grams !== null && totalMacroG > 0 ? ` / ${Math.round((grams / totalMacroG) * 100)}%` : '';

    const round1 = (v: number): number => Math.round(v * 10) / 10;
    const rowDefs: { label: string; key: keyof typeof macroTargets; unit: string; round?: (v: number) => number; calsPerGram?: number; macro?: boolean; indent?: boolean; cap?: boolean }[] = [
        { label: 'Calories',    key: 'calories',     unit: 'kcal' },
        { label: 'Protein',     key: 'protein',      unit: 'g',  calsPerGram: 4, macro: true },
        { label: 'Fat',         key: 'fat',          unit: 'g',  calsPerGram: 9, macro: true },
        { label: '↳ Sat Fat',   key: 'saturatedFat', unit: 'g',  calsPerGram: 9, round: round1, indent: true, cap: true },
        { label: '↳ Trans Fat', key: 'transFat',     unit: 'g',  calsPerGram: 9, round: round1, indent: true, cap: true },
        { label: 'Carbs',       key: 'carbs',        unit: 'g',  calsPerGram: 4, macro: true },
        { label: 'Fiber',       key: 'fiber',        unit: 'g' },
        { label: 'Sodium',      key: 'sodium',       unit: 'mg', cap: true },
    ];
    const rows = rowDefs.map((def) => {
        const grams = grand[def.key] > 0 ? grand[def.key] : null;
        return {
            ...def,
            actual:   grams === null ? null : (def.round ?? Math.round)(grams),
            calPct:   def.calsPerGram ? pct(grams, def.calsPerGram) : undefined,
            macroPct: def.macro ? macroPct(grams) : undefined,
        };
    });

    rows.forEach(({ label, key, actual, unit, indent, cap, calPct, macroPct }) => {
        const initRemaining = actual !== null ? macroTargets[key] - actual : null;
        const remainClass = (rem: number | null) => {
            if (rem === null) return 'macro-remaining';
            if (cap) return rem < 0 ? 'macro-remaining over' : rem === 0 ? 'macro-remaining met' : 'macro-remaining';
            return rem <= 0 ? 'macro-remaining met' : 'macro-remaining';
        };
        const remainText = (rem: number | null) => {
            if (rem === null) return '-';
            if (cap) return rem < 0 ? `${Math.round(-rem)} ${unit} over` : rem === 0 ? '✓ at limit' : `${Math.round(rem)} ${unit} left`;
            return rem > 0 ? `${Math.round(rem)} ${unit}` : '✓ met';
        };
        const remainEl = h('span', { class: remainClass(initRemaining), text: remainText(initRemaining) });
        const input = h('input', {
            type: 'number', min: '0', class: 'macro-target-input', value: String(macroTargets[key]),
            on: {
                change: () => {
                    const v = parseFloat(input.value);
                    if (!isNaN(v) && v > 0) {
                        macroTargets[key] = v;
                        const newRemaining = actual !== null ? v - actual : null;
                        remainEl.textContent = remainText(newRemaining);
                        remainEl.className   = remainClass(newRemaining);
                    }
                },
            },
        });

        panel.appendChild(h('div', { class: 'macro-row' + (indent ? ' macro-row-indent' : '') },
            h('span', { class: 'macro-label' + (indent ? ' macro-label-sub' : ''), text: label }),
            h('span', { class: 'macro-target-wrap' }, input, h('span', { class: 'macro-unit-label', text: unit })),
            h('span', { class: 'macro-actual', text: actual !== null ? `${actual} ${unit}${calPct ?? ''}${macroPct ?? ''}` : '-' }),
            remainEl,
        ));
    });

    return panel;
}

// ============================================================
// RECIPE SUGGESTIONS
// ============================================================

interface SuggestedRecipe { recipe: Recipe; score: number; totals: NutritionTotals; }

function buildRecipeSuggestions(grand: NutritionTotals): SuggestedRecipe[] {
    const remCals = macroTargets.calories - grand.calories;
    if (remCals < 50) return [];  // nearly full - no suggestions needed

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
    const root = screen('Nutrition');
    const recipes = getSelectedRecipes();

    if (recipes.length === 0) {
        root.append(h('p', { class: 'empty', text: 'No recipes selected.' }), createStartOverButton());
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

    const totalTitle = recipes.length > 1
        ? `All selected recipes (${grandServings} serving${grandServings === 1 ? '' : 's'})`
        : perRecipe[0].servings === 1 ? recipes[0].name : `${recipes[0].name} ×${perRecipe[0].servings}`;
    root.appendChild(h('div', { class: 'panel nutrition-total' },
        h('div', { class: 'nutrition-total-title', text: totalTitle }),
        h('div', { class: 'nutrition-values', text: totalsText(gCovered, grand, hasCostData, grandCost) }),
        // 30-day cost projection
        hasCostData && h('div', { class: 'nutrition-monthly-cost', text: `$${(grandCost * 30).toFixed(2)} / 30 days` }),
        gCostMissing > 0 && hasCostData && h('div', {
            class: 'nutrition-cost-note',
            text: `⚠ cost is partial - ${gCostMissing} ingredient${gCostMissing === 1 ? '' : 's'} missing price data`,
        }),
        h('div', {
            class: 'nutrition-coverage' + (gFlagged > 0 ? ' flagged' : ''),
            text: (gFlagged > 0 ? '⚠ ' : '') + coverageLabel(gCovered, gTotal, gFlagged),
        }),
    ));
    root.appendChild(renderMacroTargetsPanel(grand));

    // ── Bulk select/unselect ─────────────────────────────────
    const bulkButton = (text: string, apply: (id: string) => void) => h('button', {
        class: 'nutrition-bulk-btn', text,
        on: { click: () => { recipes.forEach(r => apply(r.id)); renderNutritionScreen(); } },
    });
    root.appendChild(h('div', { class: 'nutrition-bulk-actions' },
        bulkButton('Select All', id => nutritionRecipeExclusions.delete(id)),
        bulkButton('Unselect All', id => nutritionRecipeExclusions.add(id)),
    ));

    // Header buttons re-render the screen; stopPropagation keeps the header from toggling first.
    const headerButton = (cls: string, text: string, hidden: string, onClick: () => void) => h('button', {
        class: cls, text,
        on: { click: (ev) => { ev.stopPropagation(); onClick(); renderNutritionScreen(); } },
    }, srOnly(hidden));

    // ── Per recipe (expandable) ──────────────────────────────
    perRecipeEff.forEach(({ recipe, servings, nutrition, excluded, effTotals, effCost }) => {
        const isRecipeExcluded  = nutritionRecipeExclusions.has(recipe.id);
        const flaggedCount      = nutrition.missing + nutrition.uncomputable;
        const sectionTotals     = scaleTotals(effTotals, servings);
        const sectionCost       = effCost * servings;
        const recipeHasCostData = nutrition.total > nutrition.costMissing;
        const isExpanded        = nutritionExpanded.has(recipe.id);

        const caret = h('span', { class: 'nutrition-caret', text: isExpanded ? '▾' : '▸' });
        const header = h('div', { class: 'nutrition-recipe-header' },
            caret,
            h('span', { class: 'nutrition-recipe-name', text: servings > 1 ? `${recipe.name} ×${servings}` : recipe.name }),
            h('div', { class: 'nutrition-serving-controls' },
                headerButton('nutrition-serving-btn', '−', `Remove one serving of ${recipe.name}`, () => removeServing(recipe.id)),
                h('span', { class: 'nutrition-serving-count', text: `×${servings}` }),
                headerButton('nutrition-serving-btn', '+', `Add a serving of ${recipe.name}`, () => state.selectedRecipeIds.push(recipe.id)),
            ),
            headerButton('nutrition-eaten-btn', isRecipeExcluded ? '○' : '✓',
                isRecipeExcluded ? `Include ${recipe.name} in totals` : `Exclude ${recipe.name} from totals`,
                () => {
                    if (isRecipeExcluded) nutritionRecipeExclusions.delete(recipe.id);
                    else nutritionRecipeExclusions.add(recipe.id);
                }),
            h('span', { class: 'nutrition-recipe-sub', text: totalsText(nutrition.covered, sectionTotals, recipeHasCostData, sectionCost) }),
        );

        const costNote = nutrition.costMissing > 0 ? ` · ⚠ ${nutrition.costMissing} missing price` : '';

        // Per-ingredient breakdown
        const list = h('div', { class: 'nutrition-ingredients' + (isExpanded ? '' : ' collapsed') },
            ...nutrition.breakdown.map(({ ing, result, costResult }) => {
                const isExcluded = excluded.has(ing);
                const scaledIng  = { ...ing, quantity: (ing.quantity ?? 0) * servings };
                const flagged    = !isExcluded && result.status !== 'ok';
                const detail = isExcluded
                    ? h('span', { class: 'nutrition-ingredient-value', text: '- excluded' })
                    : result.status === 'ok'
                        ? h('span', {
                            class: 'nutrition-ingredient-value',
                            text: formatTotals(scaleTotals(result.totals, servings)) +
                                (costResult.status === 'ok' ? ` · $${(costResult.cost * servings).toFixed(2)}` : ''),
                        })
                        : result.status === 'missing'
                            ? h('span', { class: 'nutrition-flag', text: '⚠ no nutrition data' })
                            : h('span', { class: 'nutrition-flag', text: "⚠ can't compute", title: result.reason });
                const product = selectedProduct(ing);
                return h('div', { class: 'nutrition-ingredient-row' + (isExcluded ? ' nutrition-ingredient-excluded' : flagged ? ' flagged' : '') },
                    h('button', {
                        class: 'nutrition-ingredient-toggle', text: isExcluded ? '+' : '−',
                        on: {
                            click: () => {
                                if (isExcluded) excluded.delete(ing); else excluded.add(ing);
                                renderNutritionScreen();
                            },
                        },
                    }, srOnly(isExcluded ? `Include ${ing.name} in totals` : `Exclude ${ing.name} from totals`)),
                    h('span', { class: 'nutrition-ingredient-name', text: formatIngredient(scaledIng as Ingredient) }),
                    detail,
                    !isExcluded && result.status === 'uncomputable' && h('div', { class: 'nutrition-flag-reason', text: result.reason }),
                    !isExcluded && result.status === 'ok' && costResult.status !== 'ok' && h('div', {
                        class: 'nutrition-cost-flag',
                        text: costResult.status === 'missing'
                            ? '⚠ no price data'
                            : `⚠ cost can't compute - ${(costResult as { reason: string }).reason}`,
                    }),
                    !isExcluded && result.status === 'ok' && result.brand && h('div', {
                        class: 'nutrition-provenance',
                        text: `via ${result.brand}${product?.variant ? ` · ${product.variant}` : ''}`,
                    }),
                );
            }),
        );

        header.addEventListener('click', (ev) => {
            if ((ev.target as HTMLElement).closest('.nutrition-serving-controls')) return;
            if ((ev.target as HTMLElement).closest('.nutrition-eaten-btn')) return;
            const collapsed = list.classList.toggle('collapsed');
            caret.textContent = collapsed ? '▸' : '▾';
            if (collapsed) nutritionExpanded.delete(recipe.id);
            else nutritionExpanded.add(recipe.id);
        });

        root.appendChild(h('div', { class: 'panel nutrition-recipe ' + (isRecipeExcluded ? 'nutrition-recipe-excluded' : 'nutrition-recipe-eaten') },
            header,
            h('div', {
                class: 'nutrition-coverage' + (flaggedCount > 0 ? ' flagged' : ''),
                text: (flaggedCount > 0 ? '⚠ ' : '') + coverageLabel(nutrition.covered, nutrition.total, flaggedCount) + costNote,
            }),
            list,
        ));
    });

    // ── Recipe suggestions ────────────────────────────────────
    const suggestions = buildRecipeSuggestions(grand);
    if (suggestions.length > 0) {
        root.appendChild(h('div', { class: 'panel nutrition-suggestions' },
            h('div', { class: 'nutrition-suggestions-title', text: 'Suggested to fill your gap' }),
            ...suggestions.map(({ recipe, score, totals }) => suggestionRow(recipe,
                h('span', {
                    class: 'suggestion-stats',
                    text: `${Math.round(totals.calories)} cal · ${Math.round(totals.protein)}g protein · ${Math.round(score * 100)}% match`,
                }),
                `suggest-${recipe.id}`)),
        ));
    }

    // ── Add more, without leaving this screen ──────────────────
    root.append(
        h('h2', { text: 'Add more', class: 'group-heading' }),
        ...searchField('nutrition-recipe-search', 'Search recipes to add', 'Recipe name', nutritionAddRecipeQuery, (value) => {
            nutritionAddRecipeQuery = value;
            renderNutritionAddRecipeList();
        }),
        h('div', { id: 'nutrition-add-recipe-list' }),
    );
    renderNutritionAddRecipeList();

    appendAddIngredientButton(root);
    root.appendChild(createStartOverButton());
}

// A recipe with an "+ Add" button that adds a serving and re-renders Nutrition.
function suggestionRow(recipe: Recipe, stats?: HTMLElement, testid?: string): HTMLDivElement {
    return h('div', { class: 'suggestion-row' },
        h('div', { class: 'suggestion-info' }, h('span', { class: 'suggestion-name', text: recipe.name }), stats),
        h('button', {
            class: 'suggestion-add-btn', text: '+ Add', testid,
            on: {
                click: () => {
                    state.selectedRecipeIds.push(recipe.id);
                    renderNutritionScreen();
                },
            },
        }, srOnly(recipe.name)),
    );
}

function renderNutritionAddRecipeList(): void {
    const root = getElement<HTMLDivElement>('nutrition-add-recipe-list');
    clear(root);

    const matched   = getNutritionAddableRecipes(nutritionAddRecipeQuery);
    const MAX_SHOWN = 8;
    const shown     = matched.slice(0, MAX_SHOWN);

    root.append(...shown.map(recipe => suggestionRow(recipe)));
    if (matched.length > shown.length) {
        root.appendChild(h('div', { class: 'suggestion-more-hint', text: `+${matched.length - shown.length} more - refine your search` }));
    } else if (matched.length === 0) {
        root.appendChild(h('p', { class: 'empty', text: 'No matching recipes.' }));
    }
}

// ============================================================
// SCREEN: ADD INGREDIENT
// ============================================================

let adhocSearchQuery = '';
let adhocSelectedKey: string | null = null;
let adhocQuantity   = 1;
let adhocUnitName   = '';
// Which screen opened the ingredient picker (Select or Nutrition) - Back/Add to list return
// here instead of always landing on Select, so adding from Nutrition doesn't strand the user
// somewhere they didn't ask to go.
let adhocReturnScreen: Screen = 'select';

function resetAdhoc(): void {
    adhocSearchQuery = '';
    adhocSelectedKey = null;
    adhocQuantity    = 1;
    adhocUnitName    = '';
}

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
    const root = screen('Add an ingredient');
    root.append(
        h('p', { class: 'adhoc-sub', text: 'Pick an ingredient to add to your shopping list and nutrition totals.' }),
        ...searchField('ingredient-search', 'Search ingredients', 'Ingredient name', adhocSearchQuery, (value) => {
            adhocSearchQuery = value;
            renderAdhocList();
        }),
        h('div', { id: 'adhoc-list' }),
        h('div', { id: 'adhoc-detail', class: 'adhoc-detail' }),
        backButton('← Back', () => {
            resetAdhoc();
            navigateTo(adhocReturnScreen);
        }),
    );
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
        root.appendChild(h('p', { class: 'empty', text: 'No matching ingredients.' }));
        return;
    }

    root.append(...matched.map(({ key, name, sample }) => h('button', {
        class: adhocSelectedKey === key ? 'adhoc-item selected' : 'adhoc-item', text: name,
        on: {
            click: () => {
                adhocSelectedKey = key;
                adhocQuantity = 1;
                adhocUnitName = pickDefaultUnit(sample).name;
                renderAdhocList();
                renderAdhocDetail();
            },
        },
    })));
}

function renderAdhocDetail(): void {
    const root = getElement<HTMLDivElement>('adhoc-detail');
    clear(root);
    if (!adhocSelectedKey) return;

    const catalogEntry = getAdhocCatalog().find(c => c.key === adhocSelectedKey);
    if (!catalogEntry) return;

    root.append(
        h('div', { class: 'adhoc-detail-label', text: `How much ${catalogEntry.name}?` }),
        h('input', {
            type: 'number', min: '0', step: '0.25', value: String(adhocQuantity), class: 'adhoc-qty',
            on: {
                input: (ev) => {
                    const v = parseFloat((ev.target as HTMLInputElement).value);
                    adhocQuantity = isNaN(v) ? 0 : v;
                },
            },
        }),
        h('select', { class: 'adhoc-unit', on: { change: (ev) => { adhocUnitName = (ev.target as HTMLSelectElement).value; } } },
            ...Object.values(u).map(unit => h('option', { value: unit.name, text: unit.name || '(none)', selected: unit.name === adhocUnitName }))),
        h('button', {
            class: 'adhoc-confirm', text: 'Add to list',
            on: {
                click: () => {
                    const factory  = (i as any)[adhocSelectedKey!] as (q?: number, u?: Unit) => Ingredient;
                    const unit     = Object.values(u).find(uu => uu.name === adhocUnitName) ?? u.unit;
                    const recipe   = createAdhocRecipe(factory(adhocQuantity, unit));
                    registerRecipe(recipe);
                    state.selectedRecipeIds.push(recipe.id);
                    resetAdhoc();
                    navigateTo(adhocReturnScreen);
                },
            },
        }),
    );
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
    const root = screen('Cooking');

    if (state.cookingStartedAt === null) state.cookingStartedAt = Date.now();

    const selected = getSelectedRecipes().filter(r => !r.adhoc);
    state.cookingPlanSteps = buildCookingPlan(selected);

    if (selected.length > 1) {
        const totalSecs      = selected.reduce((s, r) => s + recipeCookSeconds(r), 0);
        const hardcodedTotal = selected.reduce((s, r) => s + (r.estimatedMinutes ? r.estimatedMinutes * 60 : 0), 0);
        root.appendChild(h('div', {
            class: 'cook-time-banner',
            text: hardcodedTotal > 0
                ? `Total: ${formatCookTime(hardcodedTotal)} goal (${formatCookTime(totalSecs)} calculated)`
                : `Total cook time: ${formatCookTime(totalSecs)}`,
        }));
    }

    let lastRecipeId: string | undefined;
    const badgeUpdaters: (() => void)[] = [];

    // Every step renders in its natural recipe order, whether locked or not - a locked
    // step just looks/behaves locked in place (see applyLock). Nothing ever moves once
    // it's on screen, so unlocking never shifts the layout around it.
    for (let idx = 0; idx < state.cookingPlanSteps.length; idx++) {
        const step = state.cookingPlanSteps[idx];
        if (step.recipeId && step.recipeId !== lastRecipeId) {
            lastRecipeId = step.recipeId;
            const recipe = state.recipes.get(step.recipeId);
            if (recipe) {
                const badge = h('span', { class: 'cook-time-badge' });

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
                badgeUpdaters.push(updateBadge);

                root.appendChild(h('div', { class: 'recipe-title-row' },
                    h('h2', { text: recipe.name }), badge, createSoundTestPanel(), createCopyButton(recipe.id)));
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
            root.appendChild(notesBox('info', group));
            continue;
        }

        root.appendChild(renderStep(step));
    }

    // One ticker keeps every recipe's "actual" elapsed time current until no step is left.
    if (state.cookingElapsedInterval !== null) window.clearInterval(state.cookingElapsedInterval);
    state.cookingElapsedInterval = window.setInterval(() => {
        if (!document.querySelector('#app .panel:not(.completed):not(.skipped)')) {
            window.clearInterval(state.cookingElapsedInterval!);
            state.cookingElapsedInterval = null;
            return;
        }
        badgeUpdaters.forEach(update => update());
    }, 1000);

    root.appendChild(createStartOverButton());
}

// A collapsed "Notes" box. Native <details> opens and closes it; CSS swaps the caret.
// Info notes are a panel with one line per step plus recipe links; prep notes are a
// lighter box. `inline` puts a single step's text straight into the body.
function notesBox(kind: 'info' | 'prep', steps: Step[], inline = false): HTMLDetailsElement {
    const prefix = kind === 'info' ? 'info-step' : 'prep-info';
    const body = h('div', { class: `${prefix}-body` });
    steps.forEach(step => {
        const line = inline ? body : body.appendChild(h('div', { class: kind === 'info' ? 'info-step-note' : 'prep-info-line' }));
        line.append(step.text);
        if (kind === 'info' && step.linkRecipeId) {
            line.appendChild(h('a', {
                class: 'info-step-link', href: getRecipeURL(step.linkRecipeId),
                text: `→ ${state.recipes.get(step.linkRecipeId)?.name ?? 'Open recipe'}`,
            }));
        }
    });

    return h('details', { class: kind === 'info' ? 'panel info-step' : 'prep-info-note' },
        h('summary', { class: `${prefix}-header` },
            h('span', { class: `${prefix}-caret` }),
            kind === 'info' ? h('span', { class: 'info-step-label', text: 'Notes' }) : ' Notes'),
        body,
    );
}

// ============================================================
// STEP LOCKING
// ============================================================

function applyLock(panel: HTMLElement, step: Step): void {
    const waitForIds = step.waitForIds;
    const startWhenIds = step.startWhenIds;
    if ((!waitForIds || waitForIds.length === 0) && (!startWhenIds || startWhenIds.length === 0)) return;

    const appEl = document.getElementById('app');
    if (!appEl) return;

    const stepMatches = (id: number, selector: string): boolean => {
        const el = document.getElementById(`step-${id}`);
        return !el || el.matches(selector);
    };
    const isStarted  = (id: number) => stepMatches(id, '.timer, .ringing, .completed, .skipped, .done-child');
    const isFinished = (id: number) => stepMatches(id, '.completed, .skipped, .ringing');

    const isUnlocked = () =>
        (!waitForIds || waitForIds.length === 0 || waitForIds.every(isFinished)) &&
        (!startWhenIds || startWhenIds.length === 0 || startWhenIds.every(isStarted));

    panel.classList.add('step-locked');
    const pill = panel.appendChild(h('div', { class: 'waiting-pill', text: '⏳ waiting…' }));

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
    const panel = h('div', { class: 'panel', id: `step-${step.id}` });

    if (step.children && step.children.length > 0) {
        panel.classList.add('container-step');
        const childWrap = h('div', { class: 'container-children' });
        panel.append(h('div', { class: 'container-header', text: step.text }), childWrap);

        const checkDone = () => {
            // A child is "done" when it's been tapped (done-child) or, for a timer/gate
            // child, when its countdown finished (completed/skipped/ringing) - those
            // panels stay in the DOM but must still release the container.
            const remaining = childWrap.querySelectorAll(
                '.panel:not(.done-child):not(.completed):not(.skipped):not(.ringing)'
            ).length;
            if (remaining === 0) { panel.remove(); onDone?.(); }
        };

        step.children.forEach((child) => {
            if (step.waitForIds && !child.waitForIds) child.waitForIds = step.waitForIds;
            if (step.startWhenIds && !child.startWhenIds) child.startWhenIds = step.startWhenIds;
            childWrap.appendChild(renderStep(child, checkDone));
        });

        applyLock(panel, step);
        return panel;
    }

    panel.textContent = step.text;

    if (step.type === 'timer' && step.durationSeconds) {
        const secs = step.durationSeconds;
        const hrs  = Math.floor(secs / 3600);
        const mins = Math.floor((secs % 3600) / 60);
        const rest = secs % 60;
        const parts = [];
        if (hrs) parts.push(`${hrs}h`);
        if (mins) parts.push(`${mins}m`);
        if (rest || parts.length === 0) parts.push(`${rest}s`);
        panel.appendChild(h('span', { class: 'timer-duration-badge', text: parts.join(' ') }));
    }

    if (step.type === 'timer') {
        onTimerTaps(panel, step, () => startTimer(step, panel, onDone), () => skipTimer(step, panel, onDone));
        applyLock(panel, step);
        return panel;
    }

    if (step.type === 'gate') {
        // No countdown yet means it is waiting for a Yes/No answer, so a plain tap does nothing.
        onTimerTaps(panel, step, () => {}, () => skipGateRetryTimer(step, panel, onDone));
        applyLock(panel, step);
        renderGateQuestion(step, panel, onDone);
        return panel;
    }

    if (step.type === 'info') {
        const box = notesBox('info', [step], true);
        box.id = panel.id;
        return box;
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

// `dueAt` - the timer's original deadline, if this completion followed a countdown (omitted
// for a gate's immediate "Yes", which never ran one) - lets the card show not just when it
// was acknowledged but how late that was, mirroring the overdue readout shown while ringing.
function completeTimer(step: Step, panel: HTMLElement, onDone?: () => void, dueAt?: number): void {
    panel.classList.remove('timer');
    panel.classList.add('completed');
    const completedAtMs = Date.now();
    const completedAt   = formatClockTime(completedAtMs);
    const runCount = state.gateRunCounts.get(step.id) ?? 0;
    const checkedSuffix = runCount > 0 ? ` (checked ${runCount}×)` : '';
    const overdueSuffix = dueAt !== undefined
        ? ` (up at ${formatClockTime(dueAt)} - overdue by ${formatOverdueDuration(Math.max(0, Math.round((completedAtMs - dueAt) / 1000)))})`
        : '';
    panel.textContent = `✓ ${step.text} - completed at ${completedAt}${overdueSuffix}${checkedSuffix}`;
    onDone?.();
}

// Taps on a timer or gate panel. With no countdown running a tap calls `first`; three quick
// taps during a countdown call `skip`. Locked and finished panels ignore taps, and so does a
// ringing one (the document-wide click listener in startAlarm dismisses it instead).
function onTimerTaps(panel: HTMLElement, step: Step, first: () => void, skip: () => void): void {
    let clickCount = 0;
    let clickTimer = 0;
    panel.addEventListener('click', () => {
        if (panel.matches('.step-locked, .completed, .skipped, .ringing')) return;
        if (!state.timers.has(step.id)) { first(); return; }
        clickCount++;
        window.clearTimeout(clickTimer);
        if (clickCount >= 3) { clickCount = 0; skip(); return; }
        clickTimer = window.setTimeout(() => { clickCount = 0; }, 600);
    });
}

function stopCountdown(step: Step, panel: HTMLElement): void {
    const intervalId = state.timers.get(step.id);
    if (intervalId !== undefined) { window.clearInterval(intervalId); state.timers.delete(step.id); }
    releaseWakeLockIfIdle();
    panel.classList.remove('timer');
}

function skipTimer(step: Step, panel: HTMLElement, onDone?: () => void): void {
    stopCountdown(step, panel);
    panel.classList.add('skipped');
    panel.textContent = `⏭ ${step.text} - skipped at ${formatClockTime(Date.now())}`;
    onDone?.();
}

// ============================================================
// START OVER
// ============================================================

function createStartOverButton(): HTMLButtonElement {
    return backButton('↩ Start Over', () => {
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
}

// ============================================================
// NAVIGATION
// ============================================================

const SCREEN_TITLES: Record<Screen, string> = {
    select: 'Recipes',
    shopping: 'Shopping list | Recipes',
    cooking: 'Cooking | Recipes',
    nutrition: 'Nutrition | Recipes',
    'add-ingredient': 'Add an ingredient | Recipes',
    prep: 'Prep | Recipes',
    plan: 'Day planner | Recipes',
};

function navigateTo(screen: Screen): void {
    state.screen = screen;
    if (typeof document !== 'undefined') document.title = SCREEN_TITLES[screen];
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
// user switches apps) - if a timer is still running when the page becomes visible again,
// re-acquire it rather than leaving the screen free to sleep for the rest of the cook.
if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && state.timers.size > 0) acquireWakeLock();
    });
}

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
            stopCountdown(step, panel);
            onComplete(endAt);
        }
    }, 1000);
    state.timers.set(step.id, intervalId);
}

function startTimer(step: Step, panel: HTMLElement, onDone?: () => void): void {
    if (!step.durationSeconds || state.timers.has(step.id)) return;
    runCountdown(
        step, panel, step.durationSeconds,
        (mm, ss, dueAtLabel) => `${mm}:${ss} ${step.text} - up at ${dueAtLabel} - tap 3× to skip`,
        (dueAt) => {
            if (panel.classList.contains('sound-check-btn')) {
                // Quick sound test button - beep once and reset immediately, no alarm loop.
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

    const runCount = state.gateRunCounts.get(step.id) ?? 0;
    const answer = (cls: string, text: string, onClick: () => void) => h('button', {
        class: cls, text,
        on: {
            click: (e) => {
                e.stopPropagation();
                if (!panel.classList.contains('step-locked')) onClick();
            },
        },
    });
    panel.append(
        h('div', { class: 'gate-question', text: step.text }),
        ...(runCount > 0 ? [h('div', { class: 'gate-run-count', text: `Checked ${runCount}×` })] : []),
        h('div', { class: 'gate-button-row' },
            answer('gate-yes-btn', 'Yes', () => completeTimer(step, panel, onDone)),
            answer('gate-no-btn', 'No', () => startGateRetryTimer(step, panel, onDone)),
        ),
    );
}

function startGateRetryTimer(step: Step, panel: HTMLElement, onDone?: () => void): void {
    if (!step.durationSeconds || state.timers.has(step.id)) return;
    state.gateRunCounts.set(step.id, (state.gateRunCounts.get(step.id) ?? 0) + 1);
    panel.textContent = '';
    runCountdown(
        step, panel, step.durationSeconds,
        (mm, ss, dueAtLabel) => `${mm}:${ss} cooking more - up at ${dueAtLabel} - tap 3× to skip`,
        (dueAt) => {
            startAlarm(step, panel, dueAt, () => renderGateQuestion(step, panel, onDone));
        }
    );
}

function skipGateRetryTimer(step: Step, panel: HTMLElement, onDone?: () => void): void {
    stopCountdown(step, panel);
    renderGateQuestion(step, panel, onDone);
}

// ============================================================
// AUDIO
// ============================================================

function createAlarmAudio(): HTMLAudioElement {
    if (typeof Audio === 'function') return new Audio('../src/sounds/pager-beep.mp3');
    return {
        muted: false,
        loop: false,
        currentTime: 0,
        play: () => Promise.resolve(),
        pause: () => {},
    } as HTMLAudioElement;
}

const audio = createAlarmAudio();

// audio.play() can silently reject (e.g. autoplay blocked after the page has sat idle/
// backgrounded for a while) - surface that visibly instead of only logging it, since a
// failed alarm sound is otherwise indistinguishable from a timer that's still running.
let soundBlockedBanner: HTMLElement | null = null;

function showSoundBlockedBanner(): void {
    if (soundBlockedBanner) return;
    soundBlockedBanner = document.body.appendChild(h('div', {
        class: 'sound-blocked-banner', text: '🔇 Alarm sound was blocked by the browser - tap anywhere to enable it',
    }));
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
    const errEl = panel.querySelector<HTMLElement>('.sound-error') ?? panel.appendChild(h('div', { class: 'sound-error' }));
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
// Steps currently in the continuous-loop phase - the shared `audio` element only
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

    const countdown = h('div', { class: 'ringing-countdown' });
    panel.append(
        h('div', { class: 'ringing-label', text: `⏰ ${step.text} - time's up!` }),
        countdown,
        h('button', {
            class: 'stop-alarm-btn', text: 'Stop Alarm',
            on: { click: (e) => { e.stopPropagation(); acknowledgeAlarm(step.id); } },
        }),
    );

    activeAlarms.set(step.id, { panel, onAcknowledge });

    let remaining = ALARM_WARNING_SECONDS;
    let ringingContinuously = false;

    // Overdue keeps incrementing (based on the original deadline, not this alarm's start)
    // for as long as the alarm is left ringing, so a user who steps away can see exactly
    // how late they are when they come back - not just that they're late.
    const updateDisplay = (): void => {
        const overdue = Math.max(0, Math.round((Date.now() - dueAt) / 1000));
        const overdueLabel = `up at ${dueAtLabel} - overdue by ${formatOverdueDuration(overdue)}`;
        countdown.textContent = ringingContinuously
            ? overdueLabel
            : `${overdueLabel} - next alarm in ${remaining}s`;
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
    // Dismissing an alarm means the user has already dealt with it - don't leave the
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

// Any interaction anywhere on the page - any button, any click - dismisses
// whatever alarm(s) are currently ringing.
if (typeof document !== 'undefined') {
    document.addEventListener('click', () => {
        // Capture before dismissing: retry blocked playback only when this click is actually
        // dismissing a still-active (blocked) alarm, so the user hears at least one beep for
        // it - not for every future unrelated click for the rest of the session.
        const retryBlockedSound = activeAlarms.size > 0 && soundBlockedBanner !== null;
        for (const stepId of [...activeAlarms.keys()]) acknowledgeAlarm(stepId);
        if (retryBlockedSound) playSound();
    });
}

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
    const root = screen('Prep');

    let anyFound = false;
    getSelectedRecipes().filter(r => !r.adhoc).forEach(recipe => {
        const count = getServings(recipe.id);
        const prepSteps = [...walkSteps(recipe.steps)].filter(s => s.prep);
        if (prepSteps.length === 0) return;
        anyFound = true;

        root.appendChild(h('div', { class: 'prep-recipe-title', text: recipe.name + (count > 1 ? ` ×${count}` : '') }));

        const infoSteps = [...walkSteps(recipe.steps)].filter(s => s.type === 'info');
        if (infoSteps.length > 0) root.appendChild(notesBox('prep', infoSteps));

        prepSteps.forEach(step => {
            const card = h('div', { class: 'panel prep-step', on: { click: () => card.classList.toggle('prep-done') } },
                h('span', { text: step.text }),
                step.ingredients && step.ingredients.length > 0 && h('div', {
                    class: 'prep-step-ingredients', text: step.ingredients.map(i => formatIngredient(i)).join(', '),
                }),
            );
            root.appendChild(card);
        });
    });

    if (!anyFound) root.appendChild(h('p', { text: 'No prep steps in the selected recipes.', class: 'muted-note' }));
    root.appendChild(backButton('← Back', () => navigateTo('select')));
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
    if (!isHhmm(hhmm)) return Number.NaN;
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

export function schedulePlan(cfg: PlanConfig, recipes: { recipe: Recipe; count: number }[]): { scheduled: ScheduledItem[]; unscheduled: { recipe: Recipe; count: number }[] } {
    const cutoffParsed = toMinutes(cfg.caloriesCutoff);
    const cutoffMin = Number.isFinite(cutoffParsed) ? cutoffParsed : toMinutes(DEFAULT_PLAN_CONFIG.caloriesCutoff);
    const blocks = [...(cfg.blocks ?? [])]
        .filter(b => b.type !== 'away' && Number.isFinite(toMinutes(b.start)) && Number.isFinite(toMinutes(b.end)))
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
    const root = screen('Day Planner');
    let cfg = loadPlanConfig();

    // ── Config panel ──────────────────────────────────────────
    const blockList = h('div', { class: 'plan-block-list' });

    function renderBlocks() {
        clear(blockList);
        cfg.blocks.forEach((block, idx) => {
            // A visually hidden label for a block's input.
            const hiddenLabel = (forId: string, text: string) => h('label', { htmlFor: forId, class: 'visually-hidden', text });

            // A labelled time input bound to this block's start or end.
            const timeField = (edge: 'start' | 'end'): [HTMLLabelElement, HTMLInputElement] => {
                const input = h('input', {
                    type: 'time', id: `block-${idx}-${edge}`, value: block[edge], class: 'plan-time-input', required: true,
                    on: {
                        change: () => {
                            if (!isHhmm(input.value)) { input.value = cfg.blocks[idx][edge]; return; }
                            cfg.blocks[idx][edge] = input.value; savePlanConfig(cfg); scheduleAndRender();
                        },
                    },
                });
                return [hiddenLabel(input.id, `Block ${idx + 1} ${edge}`), input];
            };

            const typeSelect = h('select', {
                class: 'plan-type-select', id: `block-${idx}-type`,
                on: { change: () => { cfg.blocks[idx].type = typeSelect.value as PlanBlock['type']; savePlanConfig(cfg); scheduleAndRender(); } },
            }, ...[['home', '🏠 Home'], ['portable', '🎒 Portable'], ['away', '🏢 Away']].map(([value, text]) =>
                h('option', { value, text, selected: value === block.type })));

            blockList.appendChild(h('div', { class: 'plan-block-row' },
                ...timeField('start'),
                h('span', { text: '→', class: 'plan-block-sep', attrs: { 'aria-hidden': 'true' } }),
                ...timeField('end'),
                hiddenLabel(typeSelect.id, `Block ${idx + 1} place`),
                typeSelect,
                h('button', {
                    text: '×', class: 'plan-block-del',
                    on: { click: () => { cfg.blocks.splice(idx, 1); savePlanConfig(cfg); renderBlocks(); scheduleAndRender(); } },
                }, srOnly(`Remove block ${idx + 1}`)),
            ));
        });

        blockList.appendChild(h('button', {
            text: '+ Add Block', class: 'plan-add-block-btn', testid: 'add-plan-block',
            on: {
                click: () => {
                    const last = cfg.blocks[cfg.blocks.length - 1];
                    const newStart = last ? last.end : '07:00';
                    const [hr, m] = newStart.split(':').map(Number);
                    const newEnd = `${String(Math.min(hr + 1, 23)).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                    cfg.blocks.push({ id: String(Date.now()), start: newStart, end: newEnd, type: 'home' });
                    savePlanConfig(cfg); renderBlocks(); scheduleAndRender();
                },
            },
        }));
    }

    const cutoffIn = h('input', {
        type: 'time', id: 'calorie-cutoff', value: cfg.caloriesCutoff, class: 'plan-time-input', testid: 'calorie-cutoff',
        on: {
            change: () => {
                if (!isHhmm(cutoffIn.value)) { cutoffIn.value = cfg.caloriesCutoff; return; }
                cfg.caloriesCutoff = cutoffIn.value; savePlanConfig(cfg); scheduleAndRender();
            },
        },
    });
    root.appendChild(h('div', { class: 'plan-config-panel' },
        h('div', { class: 'plan-section-title', text: 'Time Blocks' }),
        blockList,
        h('div', { class: 'plan-cutoff-row' },
            h('label', { htmlFor: 'calorie-cutoff', text: '🎯 Calorie cutoff (eat before):', class: 'plan-cutoff-label' }),
            cutoffIn,
        ),
    ));

    // ── Schedule output ───────────────────────────────────────
    const scheduleTitle = root.appendChild(h('div', { class: 'plan-section-title plan-section-spaced' }));
    const scheduleOut = root.appendChild(h('div'));

    function scheduleAndRender() {
        clear(scheduleOut);
        const deduped = [...countBy(state.selectedRecipeIds)].flatMap(([id, count]) => {
            const recipe = state.recipes.get(id);
            return recipe && !recipe.adhoc ? [{ recipe, count }] : [];
        });

        if (deduped.length === 0) {
            scheduleOut.appendChild(h('p', { text: 'No recipes selected.', class: 'muted-note' }));
            return;
        }

        scheduleTitle.textContent = `📋 Suggested Schedule`;

        const { scheduled, unscheduled } = schedulePlan(cfg, deduped);

        scheduled.forEach(({ recipe, count, startMin, afterCutoff }) => {
            const meta: string[] = [];
            if (recipe.planMinutes) meta.push(`${recipe.planMinutes} min`);
            if (recipe.portable) meta.push('portable');
            if (afterCutoff) meta.push('⚠ after cutoff');

            scheduleOut.appendChild(h('div', { class: 'plan-slot' + (afterCutoff ? ' plan-slot-late' : '') },
                h('span', { class: 'plan-slot-time', text: fromMinutes(startMin) }),
                h('span', { class: 'plan-slot-name', text: recipe.name + (count > 1 ? ` ×${count}` : '') }),
                h('span', { class: 'plan-slot-meta', text: meta.join(' · ') }),
            ));
        });

        if (unscheduled.length > 0) {
            scheduleOut.appendChild(h('div', { class: 'plan-unscheduled', text: '⚠ No available slot: ' + unscheduled.map(x => x.recipe.name).join(', ') }));
        }

        const noPlan = deduped.filter(x => !x.recipe.planMinutes);
        if (noPlan.length > 0) {
            scheduleOut.appendChild(h('div', { class: 'plan-no-duration', text: 'No duration set (won\'t block time): ' + noPlan.map(x => x.recipe.name).join(', ') }));
        }

        const batchPrep = deduped.filter(x => x.recipe.prepMinutes);
        if (batchPrep.length > 0) {
            scheduleOut.appendChild(h('div', { class: 'plan-section-title plan-section-spaced', text: '🥘 Batch Prep (cook ahead)' }));
            batchPrep.forEach(({ recipe }) => {
                const days = recipe.perishableDays;
                scheduleOut.appendChild(h('div', {
                    class: 'plan-batch-row',
                    text: `${recipe.name} - ${recipe.prepMinutes!} min cook time` + (days ? ` · keeps ${days} day${days > 1 ? 's' : ''} in fridge` : ''),
                }));
            });
        }
    }

    renderBlocks();
    scheduleAndRender();
    root.appendChild(backButton('← Back', () => navigateTo('select')));
}

// ============================================================
// BUILD INFO
// ============================================================

// Replaced with the real compile timestamp by scripts/stamp-build-time.js, right after
// `tsc` emits dist/file.js. Left as-is (and reported as "dev build")
// when the stamp step hasn't run.
const BUILD_TIME = '__BUILD_TIME__';

function formatBuildTime(): string {
    const date = new Date(BUILD_TIME);
    if (isNaN(date.getTime())) return 'dev build';
    return date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}

function appendBuildFooter(root: HTMLElement): void {
    root.appendChild(h('div', { class: 'build-footer', text: `Last compiled: ${formatBuildTime()}` }));
}

// ============================================================
// BOOTSTRAP
// ============================================================

function bootstrap(): void {
    document.body.innerHTML = `<div id="app"></div><div id="status-live" class="visually-hidden" role="status" aria-live="polite"></div>`;
    document.title = SCREEN_TITLES[state.screen];
    document.addEventListener('click', () => unlockAudioContext(), { once: true });

    // iOS Safari fires its own non-standard gesture events for pinch-zoom that aren't
    // fully covered by touch-action - block those directly. Feature-detected since only
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
    registerRecipeAgentTools();
}

const RECIPE_SCREENS = ['select', 'shopping', 'cooking', 'nutrition', 'add-ingredient', 'prep', 'plan'] as const;

function registerRecipeAgentTools(): void {
    if (!('modelContext' in document)) return;
    const modelContext = (document as Document & {
        modelContext?: { registerTool: (tool: object, options?: { signal: AbortSignal }) => Promise<unknown> | unknown };
    }).modelContext;
    if (!modelContext) return;
    const controller = new AbortController();
    const recipes = () => [...state.recipes.values()].filter(recipe => !recipe.hidden || state.showHidden);

    const tools = [
        {
            name: 'search-recipes',
            description: 'Find recipes by name. Use when choosing what to cook.',
            inputSchema: {
                type: 'object',
                properties: { query: { type: 'string', description: 'Words from the recipe name. An empty query lists visible recipes.' } },
            },
            execute(input: { query?: unknown }) {
                const query = typeof input?.query === 'string' ? input.query.trim().toLowerCase() : '';
                return {
                    recipes: recipes()
                        .filter(recipe => !query || recipe.name.toLowerCase().includes(query))
                        .slice(0, 20)
                        .map(recipe => ({ id: recipe.id, name: recipe.name, group: recipe.group ?? '' })),
                };
            },
            annotations: { readOnlyHint: true },
        },
        {
            name: 'list-selected-recipes',
            description: 'Read how many servings are currently selected.',
            inputSchema: { type: 'object', properties: {} },
            execute() {
                const counts = new Map<string, number>();
                for (const id of state.selectedRecipeIds) counts.set(id, (counts.get(id) ?? 0) + 1);
                return {
                    selected: [...counts].map(([id, servings]) => ({ id, name: state.recipes.get(id)?.name ?? id, servings })),
                };
            },
            annotations: { readOnlyHint: true },
        },
        {
            name: 'add-recipe-serving',
            description: 'Add one serving of a recipe to the current selection.',
            inputSchema: {
                type: 'object',
                properties: { recipeId: { type: 'string', description: 'Recipe id from search-recipes.' } },
                required: ['recipeId'],
            },
            execute(input: { recipeId?: unknown }) {
                const recipe = typeof input?.recipeId === 'string' ? state.recipes.get(input.recipeId) : undefined;
                if (!recipe) return { error: 'Unknown recipe id. Call search-recipes first.' };
                state.selectedRecipeIds.push(recipe.id);
                render();
                const servings = state.selectedRecipeIds.filter(id => id === recipe.id).length;
                return { recipeId: recipe.id, name: recipe.name, servings };
            },
            annotations: { readOnlyHint: false },
        },
        {
            name: 'remove-recipe-serving',
            description: 'Remove one serving of a selected recipe.',
            inputSchema: {
                type: 'object',
                properties: { recipeId: { type: 'string', description: 'Recipe id from list-selected-recipes.' } },
                required: ['recipeId'],
            },
            execute(input: { recipeId?: unknown }) {
                if (typeof input?.recipeId !== 'string') return { error: 'Pass a recipe id.' };
                const idx = state.selectedRecipeIds.lastIndexOf(input.recipeId);
                if (idx === -1) return { error: 'That recipe has no selected servings.' };
                state.selectedRecipeIds.splice(idx, 1);
                render();
                const servings = state.selectedRecipeIds.filter(id => id === input.recipeId).length;
                return { recipeId: input.recipeId, servings };
            },
            annotations: { readOnlyHint: false },
        },
        {
            name: 'open-recipe-screen',
            description: 'Show a recipe app screen for the current selection.',
            inputSchema: {
                type: 'object',
                properties: { screen: { type: 'string', enum: [...RECIPE_SCREENS], description: 'Which screen to show.' } },
                required: ['screen'],
            },
            execute(input: { screen?: unknown }) {
                if (typeof input?.screen !== 'string' || !(RECIPE_SCREENS as readonly string[]).includes(input.screen)) {
                    return { error: 'Unknown screen.', screens: RECIPE_SCREENS };
                }
                navigateTo(input.screen as Screen);
                return { screen: input.screen };
            },
            annotations: { readOnlyHint: false },
        },
    ];
    for (const tool of tools) {
        void Promise.resolve(modelContext.registerTool(tool, { signal: controller.signal })).catch(() => {});
    }
    window.addEventListener('pagehide', () => controller.abort(), { once: true });
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

// Every ingredient must resolve to real nutrition data - there is no "missing" path. That data
// can live in exactly one of two places, and the two overloads below are what enforce it at
// compile time:
//   1. A single `nutrition` label on the ingredient itself - for a true single product just
//      sold at multiple retailers (e.g. the same jar of jam at Amazon vs. Whole Foods).
//   2. `nutrition` on every entry in `products` - for a genuine multi-SKU category (e.g. peanut
//      butter: Organic Unsweetened / Creamy / Crunchy really do have different macros, so no
//      single generic number would be honest for whichever variant isn't selected).
// Passing neither is a compile error, not a silently-missing-data ingredient.
function ingredientFactory(
    name: string,
    defaults: IngredientDefaults & { nutrition: NutritionLabel }
): (quantity: number, unit: Unit) => Ingredient;
function ingredientFactory(
    name: string,
    defaults: IngredientDefaults & { products: (Product & { nutrition: NutritionLabel })[] }
): (quantity: number, unit: Unit) => Ingredient;
function ingredientFactory(name: string, defaults: IngredientDefaults = {}) {
    return (quantity: number, unit: Unit): Ingredient => {
        const ing: any = { name, quantity, unit, ...defaults };
        ing.rename = (newName: string) => { ing.name = newName; };
        return ing as unknown as Ingredient;
    };
}

// ============================================================
// ITEMS
// ============================================================

export const i = {
    // No nutrition available yet - a real fruit with meaningful calories/carbs, so a zero
    // placeholder would be actively misleading.
    // Generic/typical nutrition (not from this listing's own label) - a standard whole
    // grapefruit, ~236g. Real produce values, just not brand-specific.
    grapefruit: ingredientFactory('Pink Grapefruit', {
        products: [{
            brand: 'Organic', variant: 'Red Grapefruit', size: 1, sizeUnit: u.unit,
            listings: [{ price: 1.79, link: 'https://www.amazon.com/Fresh-Produce-Brands-Vary-B000P6G148/dp/B000P6G148' }],
            nutrition: {
                [u.unit.name]: { servings: 1, servingSize: 1, calories: 100, fat: 0.2, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 25, sodium: 0, sugar: 16, protein: 2, fiber: 4 },
            },
        }],
    }),

    // Nutrition zeroed at the user's request - vinegar is close enough to calorie-free at
    // typical usage to be a defensible placeholder (same reasoning as whiteVinegar above).
    champagneVinegar: ingredientFactory('Champagne Vinegar', {
        products: [{
            brand: 'O Olive Oil & Vinegar', variant: 'California Champagne Vinegar', size: 10.1, sizeUnit: u.fluidOunce,
            listings: [{ price: 7.96, link: 'https://www.amazon.com/Olive-Oil-California-Champagne-Vinegar/dp/B07CQQ35PK' }],
            nutrition: {
                [u.milliliter.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    // Generic/typical nutrition (not from this listing's own label) - salt is essentially
    // pure sodium chloride regardless of brand, so ~2300mg sodium/tsp is a standard real value.
    seaSalt: ingredientFactory('Sea Salt', {
        products: [{
            brand: 'Ancient', variant: 'Spring Salt, Organic', size: 7, sizeUnit: u.ounce, organic: true,
            listings: [{ price: 14.5, link: 'https://www.amazon.com/Spring-Salt-Organic-Natural-Microplastic/dp/B091V3KBC2' }],
            nutrition: {
                [u.tsp.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 2300, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    // Nutrition zeroed at the user's request - the label is image-only on Amazon (typical
    // for dried herbs), so this is a placeholder, not a real (scraped or measured) value.
    rosemary: ingredientFactory('Rosemary', {
        products: [{
            brand: '365', variant: 'Organic', organic: true,
            listings: [{ store: stores.wholeFoods, price: 3.99, link: 'https://www.amazon.com/365-Everyday-Value-Organic-Rosemary/dp/B074H6M37H' }],
            nutrition: {
                [u.tsp.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    // Generic/typical nutrition (not from this listing's own label) - standard mushroom
    // values, per roughly one whole king trumpet mushroom (~100g).
    kingOysterMushroom: ingredientFactory('King Trumpet Mushroom', {
        products: [{
            brand: 'Mushroom King Farm', variant: 'Organic Sliced', size: 4, sizeUnit: u.ounce, organic: true,
            listings: [{ price: 6.29, link: 'https://www.amazon.com/MUSHROOM-Organic-King-Trumpet-Mushrooms/dp/B0F9LQG2V8' }],
            nutrition: {
                [u.unit.name]: { servings: 1, servingSize: 1, calories: 22, fat: 0.3, saturatedFat: 0.1, transFat: 0, cholesterol: 0, carbs: 3, sodium: 5, sugar: 2, protein: 3, fiber: 1 },
            },
        }],
    }),

    cassavaFlour: ingredientFactory('Cassava Flour', {
        products: [{
            brand: "Otto's Naturals", variant: 'Organic', size: 1.5, sizeUnit: u.pound, organic: true,
            listings: [{ price: 19.99, link: 'https://www.amazon.com/Ottos-Naturals-Organic-Grain-Free-Gluten-Free/dp/B08QZVC7WH' }],
            nutrition: {
                [u.cup.name]: { servings: 1, servingSize: 0.25, calories: 110, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 28, sodium: 0, sugar: 0, protein: 1, fiber: 3 },
            },
        }],
    }),

    cornstarch: ingredientFactory('Corn Starch', {
        products: [{
            brand: '365', size: 16, sizeUnit: u.ounce,
            listings: [{ store: stores.wholeFoods, price: 2.18, link: 'https://www.amazon.com/365-Everyday-Value-Corn-Starch/dp/B074H67H5C' }],
            nutrition: {
                [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 30, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 7, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    // Generic/typical nutrition (not from this listing's own label) - standard fennel bulb
    // values, per one medium bulb (~234g).
    fennel: ingredientFactory('Fennel', {
        products: [{
            brand: 'Organic', size: 1, sizeUnit: u.unit,
            listings: [{ price: 2.21, link: 'https://www.amazon.com/Fresh-Produce-Brands-May-Vary/dp/B00E3J6RC4' }],
            nutrition: {
                [u.unit.name]: { servings: 1, servingSize: 1, calories: 73, fat: 0.5, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 17, sodium: 122, sugar: 9, protein: 3, fiber: 7 },
            },
        }],
    }),

    // Generic/typical nutrition (not from this listing's own label) - standard radicchio
    // values, per one head (~350g).
    radicchio: ingredientFactory('Radicchio', {
        products: [{
            brand: 'Organic', size: 1, sizeUnit: u.unit,
            listings: [{ price: 4.61, link: 'https://www.amazon.com/produce-aisle-101767-Organic-Radicchio/dp/B00E3KS6LS' }],
            nutrition: {
                [u.unit.name]: { servings: 1, servingSize: 1, calories: 81, fat: 0.9, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 16, sodium: 77, sugar: 2, protein: 5, fiber: 3 },
            },
        }],
    }),

    // Nutrition zeroed at the user's request - the label is image-only on Amazon (typical
    // for dried herbs), so this is a placeholder, not a real (scraped or measured) value.
    dillWeed: ingredientFactory('Dill Weed', {
        products: [{
            brand: '365', variant: 'Organic', size: 0.46, sizeUnit: u.ounce, organic: true,
            listings: [{ store: stores.wholeFoods, price: 3.99, link: 'https://www.amazon.com/365-Everyday-Value-Organic-Dill/dp/B074H773GP' }],
            nutrition: {
                [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    // Nutrition zeroed at the user's request - the label is image-only on Amazon; distilled
    // white vinegar is also close enough to calorie-free at typical usage to be a defensible
    // placeholder even so, but flagging same as the others since it's not from a real label.
    whiteVinegar: ingredientFactory('White Vinegar', {
        products: [{
            brand: '365', variant: 'Organic Distilled', size: 32, sizeUnit: u.fluidOunce, organic: true,
            listings: [{ store: stores.wholeFoods, price: 2.99, link: 'https://www.amazon.com/365-Everyday-Value-Organic-Distilled/dp/B074J6FD4L' }],
            nutrition: {
                [u.tsp.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    thyme: ingredientFactory('Thyme', {
        products: [{
            brand: '365', variant: 'Organic', size: 0.67, sizeUnit: u.ounce, organic: true,
            listings: [{ store: stores.wholeFoods, price: 3.99, link: 'https://www.amazon.com/365-Everyday-Value-Organic-Thyme/dp/B074HBKSCL' }],
            nutrition: {
                [u.tsp.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    // Generic/typical nutrition - recipes use this by the spray (a mister/pump dose, ~0.2g),
    // which is genuinely small enough that standard cooking-oil-spray labels round it to
    // 0 cal/0g fat per spray (the same convention as e.g. PAM) - not a placeholder zero.
    avocadoOil: ingredientFactory('Avocado Oil', {
        shimmerAt: 330,
        products: [{
            brand: 'Chosen Foods', variant: 'Organic 100% Avocado Oil', size: 16.9, sizeUnit: u.fluidOunce, organic: true,
            listings: [{ price: 14.99, link: 'https://www.amazon.com/CHOSEN-FOODS-Organic-100-Avocado/dp/B0CTCXXG2J' }],
            nutrition: {
                [u.spray.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    // Generic/typical nutrition (not from this listing's own label) - standard honey-mustard
    // dressing values, per 1 tbsp (15g).
    honeyDijonMustard: ingredientFactory('Honey Dijon Mustard', {
        products: [{
            brand: 'SideDish', variant: 'Honey Dijon Dressing', size: 8, sizeUnit: u.fluidOunce,
            listings: [{ price: 9.99, link: 'https://www.amazon.com/SideDish-Honey-Dijon-Dressing-OZ/dp/B0CSTW8YFP' }],
            nutrition: {
                [u.gram.name]: { servings: 1, servingSize: 15, calories: 50, fat: 4.5, saturatedFat: 0.5, transFat: 0, cholesterol: 0, carbs: 3, sodium: 90, sugar: 3, protein: 0, fiber: 0 },
            },
        }],
    }),

    // Generic/typical nutrition (not from this listing's own label) - a standard medium
    // orange, ~131g.
    orange: ingredientFactory('Orange', {
        products: [{
            brand: 'Organic', variant: 'Valencia', size: 1, sizeUnit: u.unit,
            listings: [{ price: 1.32, link: 'https://www.amazon.com/365-by-Whole-Foods-Market/dp/B003TQ3554' }],
            nutrition: {
                [u.unit.name]: { servings: 1, servingSize: 1, calories: 62, fat: 0.2, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 15, sodium: 0, sugar: 12, protein: 1, fiber: 3 },
            },
        }],
    }),

    // Generic/typical nutrition (not from this listing's own label) - standard arugula
    // values, per 100g.
    arugula: ingredientFactory('Arugula', {
        products: [{
            brand: '365', variant: 'Organic Baby Arugula Salad', size: 5, sizeUnit: u.ounce, organic: true,
            listings: [{ store: stores.wholeFoods, price: 3.99, link: 'https://www.amazon.com/365-Whole-Foods-Market-Organic/dp/B09ZHX8Y9V' }],
            nutrition: {
                [u.gram.name]: { servings: 1, servingSize: 100, calories: 25, fat: 0.7, saturatedFat: 0.1, transFat: 0, cholesterol: 0, carbs: 4, sodium: 27, sugar: 2, protein: 3, fiber: 2 },
            },
        }],
    }),

    // Cholesterol left at 0 - the scraped nutrition table for this listing didn't include a
    // cholesterol line at all (dairy sour cream normally has some), so that field specifically
    // is unconfirmed rather than a verified zero. Everything else here is real scraped data.
    sourCream: ingredientFactory('Sour Cream', {
        products: [{
            brand: '365', variant: 'Organic', size: 16, sizeUnit: u.ounce, organic: true,
            listings: [{ store: stores.wholeFoods, price: 3.39, link: 'https://www.amazon.com/365-Whole-Foods-Market-Organic/dp/B07BS4YGL5' }],
            nutrition: {
                [u.tbsp.name]: { servings: 8, servingSize: 2, calories: 60, fat: 5, saturatedFat: 3, transFat: 0, cholesterol: 0, carbs: 2, sodium: 20, sugar: 2, protein: 1, fiber: 0 },
            },
        }],
    }),

    paprika: ingredientFactory('Paprika', {
        products: [{
            brand: '365', variant: 'Organic', size: 1.69, sizeUnit: u.ounce, organic: true,
            listings: [{ store: stores.wholeFoods, price: 3.99, link: 'https://www.amazon.com/365-Everyday-Value-Organic-Paprika/dp/B074H81LWT' }],
            nutrition: {
                [u.tsp.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    // Nutrition zeroed at the user's request - Amazon's label for this listing is
    // image-only, so this is a placeholder, not a real (scraped or measured) value.
    garlicPowder: ingredientFactory('Garlic Powder', {
        products: [{
            brand: '365', variant: 'Organic', size: 2.33, sizeUnit: u.ounce, organic: true,
            listings: [{ store: stores.wholeFoods, price: 3.99, link: 'https://www.amazon.com/365-Everyday-Value-Organic-Garlic/dp/B00JJZ57FK' }],
            nutrition: {
                [u.tsp.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    // Nutrition zeroed at the user's request - Amazon's label for this listing is
    // image-only, so this is a placeholder, not a real (scraped or measured) value.
    onionPowder: ingredientFactory('Onion Powder', {
        products: [{
            brand: '365', variant: 'Organic', size: 2.33, sizeUnit: u.ounce, organic: true,
            listings: [{ store: stores.wholeFoods, price: 3.99, link: 'https://www.amazon.com/365-Everyday-Value-Organic-Onion/dp/B00DQMKSY4' }],
            nutrition: {
                [u.tsp.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    // Generic/typical nutrition (not from this listing's own label) - standard mayonnaise
    // values, scaled up from a typical ~94 cal/tbsp to a full cup (16 tbsp), matching how
    // this ingredient is actually consumed in the one recipe that uses it.
    mayonnaise: ingredientFactory('Mayonnaise', {
        products: [{
            brand: '365', variant: 'Organic Squeezable', size: 11.2, sizeUnit: u.fluidOunce, organic: true,
            listings: [{ store: stores.wholeFoods, price: 3.79, link: 'https://www.amazon.com/365-Everyday-Value-Mayonnaise-Squeezable/dp/B074H64C5R' }],
            nutrition: {
                [u.cup.name]: { servings: 1, servingSize: 1, calories: 1500, fat: 165, saturatedFat: 25, transFat: 0, cholesterol: 100, carbs: 0, sodium: 1400, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    babyBellaMushroom: ingredientFactory('Baby Bella Mushroom', {
        products: [{
            brand: '365', variant: 'Organic Whole', size: 8, sizeUnit: u.ounce, organic: true,
            listings: [{ store: stores.wholeFoods, price: 3.79, link: 'https://www.amazon.com/365-Everyday-Value-Organic-Mushrooms/dp/B07NQDLF47' }],
            nutrition: {
                [u.gram.name]: { servings: 2, servingSize: 84, calories: 18, fat: 0.29, saturatedFat: 0.05, transFat: 0, cholesterol: 0, carbs: 3.3, sodium: 8, sugar: 2.1, protein: 1.772, fiber: 1.1 },
            },
        }],
    }),

    // Generic/typical nutrition (not from this listing's own label) - standard plant-based
    // Italian sausage values, scaled to the whole 10oz (283g) package (recipe consumes it as
    // "1 bag").
    abbotPeaItalianSausage: ingredientFactory('Abbot\'s Plant-Based Italian Sausage', {
        products: [{
            brand: "Abbot's", size: 10, sizeUnit: u.ounce,
            listings: [{ price: 9.49, link: 'https://www.amazon.com/Abbots-Plant-Based-Italian-Gluten-Free-High-Protein/dp/B0FB447RLJ' }],
            nutrition: {
                [u.bag.name]: { servings: 1, servingSize: 1, calories: 570, fat: 34, saturatedFat: 6, transFat: 0, cholesterol: 0, carbs: 23, sodium: 1700, sugar: 3, protein: 45, fiber: 8 },
            },
        }],
    }),

    egg: ingredientFactory('Egg', {
        products: [{
            brand: '365', variant: 'Organic Large Brown Grade A (12 Count)', size: 12, sizeUnit: u.unit, organic: true,
            listings: [{ store: stores.wholeFoods, price: 5.99, link: 'https://www.amazon.com/365-Everyday-Value-Brown-Organic/dp/B07PDH5138' }],
            nutrition: {
                [u.unit.name]: { servings: 12, servingSize: 1, calories: 80, fat: 5, saturatedFat: 2, transFat: 0, cholesterol: 210, carbs: 0, sodium: 80, sugar: 0, protein: 7, fiber: 0 },
            },
        }],
    }),

    spaghettiSauce: ingredientFactory('Spaghetti Sauce', {
        products: [{
            brand: '365', variant: 'Organic 4 Cheese Pasta Sauce', size: 25, sizeUnit: u.ounce, organic: true,
            listings: [{ store: stores.wholeFoods, price: 3.49, link: 'https://www.amazon.com/365-Everyday-Value-Organic-Cheese/dp/B074H66176' }],
            nutrition: {
                // Recipe consumes this as "1 bag" (the whole 25oz jar) - label is 1/2 cup
                // (118g), 6 servings/container, so these are the per-jar totals (per-serving × 6).
                [u.bag.name]: { servings: 1, servingSize: 1, calories: 420, fat: 21, saturatedFat: 6, transFat: 0, cholesterol: 30, carbs: 48, sodium: 2460, sugar: 24, protein: 18, fiber: 12 },
            },
        }],
    }),

    // No nutrition available yet - Amazon didn't expose a text nutrition table for this
    // listing (baking soda is chemically invariant across brands, but serving-size
    // conventions differ enough between labels that a real one is still needed here).
    // Nutrition zeroed at the user's request - no text nutrition table was available for
    // this listing, so this is a placeholder, not a real (scraped or measured) value.
    bakingSoda: ingredientFactory('Baking Soda', {
        products: [{
            brand: 'Arm & Hammer', size: 16, sizeUnit: u.ounce,
            listings: [{ price: 4.50, link: 'https://www.amazon.com/Arm-Hammer-Pure-Baking-Soda/dp/B00K1JFAVE' }],
            nutrition: {
                [u.tsp.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    pankoBreadCrumbs: ingredientFactory('Panko Bread Crumbs', {
        products: [{
            brand: '365', size: 8, sizeUnit: u.ounce,
            listings: [{ store: stores.wholeFoods, price: 1.99, link: 'https://www.amazon.com/365-Everyday-Value-Panko-Crumbs/dp/B074H5LYGT' }],
            nutrition: {
                [u.cup.name]: { servings: 8, servingSize: 0.333, calories: 110, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 23, sodium: 100, sugar: 1, protein: 4, fiber: 1 },
            },
        }],
    }),

    // Nutrition zeroed at the user's request - the label is image-only on Amazon (typical
    // for dried herbs), so this is a placeholder, not a real (scraped or measured) value.
    parsleyFlakes: ingredientFactory('Parsley Flakes', {
        products: [{
            brand: '365', variant: 'Organic Parsley', size: 0.24, sizeUnit: u.ounce, organic: true,
            listings: [{ store: stores.wholeFoods, price: 3.99, link: 'https://www.amazon.com/365-Everyday-Value-Organic-Parsley/dp/B074H81M9K' }],
            nutrition: {
                [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    lentilSpaghetti: ingredientFactory('Lentil Spaghetti', {
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
        products: [{
            brand: 'Quaker', variant: 'Lower Sugar, Maple & Brown Sugar (1.19 oz, Pack of 44)', listings: [{ store: stores.amazon, price: 13.72, discount: { subscribeAndSave15: true }, link: 'https://www.amazon.com/dp/B094TG5HDJ' }], size: 44, sizeUnit: u.unit,
        }],
        nutrition: {
            [u.unit.name]: { servings: 44, servingSize: 1, calories: 120, fat: 2, saturatedFat: 0.5, transFat: 0, cholesterol: 0, carbs: 24, sodium: 240, sugar: 4, protein: 4, fiber: 3 },
        },
    }),

    // Generic/typical nutrition (not from this listing's own label) - standard onion values,
    // per 1 tbsp minced (~10g), matching how this ingredient is actually used in recipes.
    whiteOnion: ingredientFactory('White Onion', {
        products: [{
            brand: 'Organic', size: 1, sizeUnit: u.unit,
            listings: [{ price: 1.49, link: 'https://www.amazon.com/Organic-White-Onion-1-Each/dp/B0787Z3T3B' }],
            nutrition: {
                [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 4, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 1, sodium: 0, sugar: 0.4, protein: 0, fiber: 0 },
            },
        }],
    }),

    // Nutrition zeroed at the user's request - Amazon's label for these listings is
    // image-only, so this is a placeholder, not a real (scraped or measured) value.
    blackPepper: ingredientFactory('Black Pepper', {
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
        products: [{
            brand: '365', variant: 'Organic Asian Inspired (12 oz)', listings: [{ store: stores.wholeFoods, price: 5.99, link: 'https://www.amazon.com/dp/B07B67Y9MH' }], size: 1, sizeUnit: u.unit,
        }],
        nutrition: {
            // per whole bag (2 × 1-cup servings): 170 cal × 2, estimated fat/carbs from ingredients
            [u.unit.name]: { servings: 1, servingSize: 1, calories: 340, fat: 18, saturatedFat: 2, transFat: 0, cholesterol: 0, carbs: 28, sodium: 780, sugar: 12, protein: 6, fiber: 6 },
        },
    }),

    blueZonesBasilPestoVeggieBowl: ingredientFactory('Blue Zones Kitchen Basil Pesto Veggie Bowl', {
        products: [{
            brand: 'Blue Zones Kitchen', variant: 'Basil Pesto Veggie Bowl', size: 8.5, sizeUnit: u.ounce, packageUnit: u.unit,
            listings: [{ store: stores.wholeFoods, price: 7.99, link: 'https://www.wholefoodsmarket.com/grocery/product/blue-zones-blue-zones-kitchen-basil-pesto-veggie-bowl-8-5-ounce-b0f24t4vqj' }],
        }],
        nutrition: {
            // 1 bowl (8.5 oz) = 1 serving, per the product label
            [u.unit.name]: { servings: 1, servingSize: 1, calories: 320, fat: 21, saturatedFat: 2.5, transFat: 0, cholesterol: 0, carbs: 27, sodium: 550, sugar: 3, protein: 9, fiber: 7 },
        },
    }),

    carrot: ingredientFactory('Carrots', {
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
        products: [{
            brand: 'SideDish', variant: 'Creamy Sesame (8 fl oz)', listings: [{ store: stores.wholeFoods, price: 6.53, link: 'https://www.amazon.com/dp/B0CR56SHBK' }], size: 8, sizeUnit: u.fluidOunce,
        }],
        nutrition: {
            // Label: ~7 servings per container, serving size 2 tbsp (30g)
            [u.tbsp.name]: { servings: 7, servingSize: 2, calories: 100, fat: 7, saturatedFat: 1, transFat: 0, cholesterol: 0, carbs: 9, sodium: 330, sugar: 6, protein: 2, fiber: 1 },
        },
    }),

    // Generic/typical nutrition - standard USDA values for cooked quinoa, per 1 cup (~185g).
    quinoa: ingredientFactory('Cooked Quinoa', {
        nutrition: {
            [u.cup.name]: { servings: 1, servingSize: 1, calories: 222, fat: 3.6, saturatedFat: 0.4, transFat: 0, cholesterol: 0, carbs: 39, sodium: 13, sugar: 1.6, protein: 8.1, fiber: 5.2 },
        },
    }),

    // Generic/typical nutrition - standard USDA values for canned black beans, drained,
    // per 1 cup. One 15 oz (425 g) can yields ~1.5 cups drained, which is how the recipe
    // measures it.
    blackBean: ingredientFactory('Black Beans', {
        nutrition: {
            [u.cup.name]: { servings: 1, servingSize: 1, calories: 218, fat: 0.9, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 40, sodium: 460, sugar: 1, protein: 14.5, fiber: 16.6 },
        },
    }),

    chickpeas: ingredientFactory('Chickpeas (Garbanzo Beans)', {
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
            [u.gram.name]: { to: u.cup, factor: 1 / 113.4 },  // 1 cup ≈ 113g by weight
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
        products: [{
            brand: 'Navitas', variant: 'Organic Raw',
            nutrition: {
                [u.tsp.name]: { servings: 1, servingSize: 1, calories: 20, fat: 1.5, saturatedFat: 0.5, transFat: 0, cholesterol: 0, carbs: 1.5, sodium: 0, sugar: 0, protein: 0.3, fiber: 1 },
            },
        }],
    }),

    chiaSeed: ingredientFactory('Chia Seed', {
        products: [{
            brand: '365', variant: 'Organic Black', listings: [{ store: stores.wholeFoods }],
            nutrition: {
                [u.tsp.name]: { servings: 1, servingSize: 1, calories: 19, fat: 1, saturatedFat: 0.1, transFat: 0, cholesterol: 0, carbs: 1.5, sodium: 0, sugar: 0, protein: 1, fiber: 2 },
            },
        }],
    }),

    hempSeed: ingredientFactory('Hemp Seed', {
        products: [{
            brand: 'Manitoba Harvest', variant: 'Hemp Hearts', listings: [{ store: stores.wholeFoods }],
            nutrition: {
                [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 55, fat: 4, saturatedFat: 0.5, transFat: 0, cholesterol: 0, carbs: 1, sodium: 0, sugar: 0.5, protein: 3.3, fiber: 0 },
            },
        }],
    }),

    antiOxidantBerryBlend: ingredientFactory('Antioxidant Berry Blend', {
        products: [{
            brand: '365', variant: 'Organic Antioxidant Fruit Blend (frozen)', listings: [{ store: stores.wholeFoods }],
            size: 16, sizeUnit: u.ounce, organic: true,
            nutrition: {
                [u.cup.name]: { servings: 4, servingSize: 1, calories: 70, fat: 0.5, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 17, sodium: 0, sugar: 13, protein: 1, fiber: 4 },
            },
        }],
    }),

    vanillaExtract: ingredientFactory('Vanilla Extract', {
        products: [{
            brand: '365', variant: 'Organic Vanilla Extract', listings: [{ store: stores.wholeFoods, price: 8.79, link: 'https://www.amazon.com/365-Everyday-Value-Organic-Vanilla/dp/B074VBL8R9' }],
            nutrition: { [u.fluidOunce.name]: { servings: 2, servingSize: 2, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 } }, size: 2, sizeUnit: u.fluidOunce, organic: true,
        }],
    }),

    lemonJuice: ingredientFactory('Lemon Juice', {
        products: [{
            brand: '365', variant: 'Organic Lemon Juice', listings: [{ store: stores.wholeFoods, price: 3.49, link: 'https://www.amazon.com/365-Everyday-Value-Organic-Concentrate/dp/B074J5WZS8?th=1' }],
            nutrition: { [u.tsp.name]: { servings: 59, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 } }, size: 10, sizeUnit: u.fluidOunce, organic: true,
        }],
    }),

    cherry: ingredientFactory('Cherry', {
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
        conversions: {
            // 1 medium stalk chopped ≈ ½ cup (8 tbsp) - lets tbsp-measured amounts resolve nutrition.
            [u.tbsp.name]: { to: u.unit, factor: 0.125 },
        },
    }),

    spinach: ingredientFactory('Spinach', {
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

    // Frozen water - nutritionally identical to water, kept as its own ingredient so
    // recipe steps and the shopping list read as "ice cubes" rather than liquid water.
    iceCube: ingredientFactory('Ice Cube', {
        nutrition: {
            [u.unit.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
        },
    }),

    // Generic/typical nutrition (not from a specific brand's label) - standard black brewed
    // coffee per USDA data, brand-agnostic since cold brew is commonly home-brewed.
    coldBrewCoffee: ingredientFactory('Cold Brew Coffee', {
        nutrition: {
            [u.fluidOunce.name]: { servings: 1, servingSize: 8, calories: 5, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 5, sugar: 0, protein: 1, fiber: 0 },
        },
    }),

    // Generic/typical nutrition (not from a specific brand's label) - standard flavored
    // liquid coffee creamer (e.g. French Vanilla style) per tablespoon serving.
    coffeeCreamer: ingredientFactory('Coffee Creamer', {
        nutrition: {
            [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 35, fat: 1.5, saturatedFat: 1, transFat: 0, cholesterol: 0, carbs: 5, sodium: 5, sugar: 5, protein: 0, fiber: 0 },
        },
    }),

    psyllium: ingredientFactory('Psyllium Husk', {
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
        shimmerAt: 300,
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
        products: [{
            brand: 'Blueprint', variant: 'Chocolate (30 servings)', listings: [{ store: stores.amazon, price: 94, link: 'https://www.amazon.com/Blueprint-Bryan-Johnson-Longevity-Protein/dp/B0DNGJRLQF' }],
            size: 30, sizeUnit: u.unit,
            nutrition: {
                [u.unit.name]: { servings: 1, servingSize: 1, calories: 200, fat: 5, saturatedFat: 0.5, transFat: 0, cholesterol: 0, carbs: 13, sodium: 200, sugar: 0, protein: 26, fiber: 1 },
            },
        }],
    }),

    blueberryNutMix: ingredientFactory('Blueberry Nut Mix', {
        products: [{
            brand: 'Blueprint', variant: 'Macadamia + Walnut + Blueberry', listings: [{ store: stores.amazon, price: 37, discount: { subscribeAndSave10: true }, link: 'https://www.amazon.com/Blueprint-Bryan-Johnson-Blueberry-Nut/dp/B0D3FZ29RJ' }], size: 30, sizeUnit: u.unit,
            nutrition: {
                // Per 1 scoop (15g), 30 servings per container
                [u.unit.name]: { servings: 30, servingSize: 1, calories: 70, fat: 4.5, saturatedFat: 0.5, transFat: 0, cholesterol: 0, carbs: 8, sodium: 0, sugar: 5, protein: 1, fiber: 2 },
            },
        }],
    }),

    longevityMix: ingredientFactory('Longevity Mix', {
        products: [{
            brand: 'Blueprint', variant: 'Blood Orange (30 servings)', listings: [{ store: stores.amazon, price: 49, link: 'https://www.amazon.com/dp/B0D3GBRNSX', discount: { subscribeAndSave10: true } }], size: 30, sizeUnit: u.unit,
        }],
        nutrition: {
            [u.unit.name]: { servings: 30, servingSize: 1, calories: 10, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 3, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
        },
    }),

    collagenPowder: ingredientFactory('Collagen Peptides', {
        products: [{
            brand: 'Blueprint', variant: 'Hydrolyzed Type I, II & III (30 servings)', listings: [{ store: stores.amazon, price: 45, link: 'https://www.amazon.com/dp/B0DV1PQDWH', discount: { subscribeAndSave10: true } }], size: 30, sizeUnit: u.unit,
        }],
        nutrition: {
            [u.unit.name]: { servings: 30, servingSize: 1, calories: 80, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 20, fiber: 0 },
        },
    }),

    creatine: ingredientFactory('Creatine Monohydrate', {
        products: [{
            brand: 'Blueprint', variant: 'Unflavored (100 servings)', listings: [{ store: stores.amazon, price: 40, link: 'https://www.amazon.com/dp/B0DQLW13S2', discount: { subscribeAndSave10: true } }], size: 100, sizeUnit: u.unit,
        }],
        nutrition: {
            [u.unit.name]: { servings: 100, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
        },
    }),

    // Generic/typical nutrition (not from this listing's own label) - standard honey values,
    // per 1 tsp (~7g). Link is also currently dead ("Page Not Found") - needs a fresh one.
    manukaHoney: ingredientFactory('Manuka Honey', {
        products: [{
            brand: 'Blueprint', variant: 'Manuka Honey', listings: [{ store: stores.amazon, link: 'https://www.amazon.com/dp/B0DQLSXYZ' }],
            nutrition: {
                [u.tsp.name]: { servings: 1, servingSize: 1, calories: 21, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 6, sodium: 0, sugar: 6, protein: 0, fiber: 0 },
            },
        }],
    }),

    nutThins: ingredientFactory('Nut Thins', {
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

    // Generic/typical nutrition (not from this listing's own label) - standard raw boneless
    // skinless chicken thigh values, per 1 lb (453.6g).
    chickenThigh: ingredientFactory('Chicken Thighs (Boneless Skinless)', {
        isMeatProduct: true,
        products: [{
            brand: '365', variant: 'Organic Boneless Skinless (1.5 lb)', listings: [{ store: stores.wholeFoods, price: 9.99, link: 'https://www.amazon.com/dp/B07813VZHR' }], size: 1.5, sizeUnit: u.pound,
            nutrition: {
                [u.pound.name]: { servings: 1, servingSize: 1, calories: 708, fat: 37, saturatedFat: 10, transFat: 0, cholesterol: 372, carbs: 0, sodium: 345, sugar: 0, protein: 90, fiber: 0 },
            },
        }],
    }),

    // Generic/typical nutrition (not from a specific brand's label) - dried chile de árbol
    // pods are essentially never sold with a per-pod nutrition label, so this estimates a
    // single ~1g dried pod from generic dried-chile USDA values.
    chileDeArbol: ingredientFactory('Chile de Árbol (Dried)', {
        nutrition: {
            [u.unit.name]: { servings: 1, servingSize: 1, calories: 3, fat: 0.1, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0.5, sodium: 1, sugar: 0.1, protein: 0.1, fiber: 0.2 },
        },
    }),

    // Generic/typical nutrition - chile pequín and chiltepín are used interchangeably here;
    // pods are tiny (~0.3g dried), so values are near-negligible per pod.
    chilePequin: ingredientFactory('Chile Pequín / Chiltepín (Dried)', {
        nutrition: {
            [u.unit.name]: { servings: 1, servingSize: 1, calories: 1, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0.2, sodium: 0, sugar: 0, protein: 0, fiber: 0.1 },
        },
    }),

    // Generic/typical nutrition (not from a specific brand's label) - standard USDA values
    // for one medium red bell pepper (~119g).
    redBellPepper: ingredientFactory('Red Bell Pepper', {
        nutrition: {
            [u.unit.name]: { servings: 1, servingSize: 1, calories: 31, fat: 0.3, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 7.3, sodium: 3, sugar: 5, protein: 1.2, fiber: 2.5 },
        },
    }),

    // Generic/typical nutrition - standard USDA values for one raw garlic clove (~3g).
    garlicClove: ingredientFactory('Garlic Clove', {
        nutrition: {
            [u.unit.name]: { servings: 1, servingSize: 1, calories: 4, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 1, sodium: 0.5, sugar: 0, protein: 0.2, fiber: 0.1 },
        },
    }),

    // Generic/typical nutrition - standard USDA values for fresh cilantro, per 1 tbsp chopped (~1g).
    cilantro: ingredientFactory('Fresh Cilantro', {
        nutrition: {
            [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 1, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0.1, sodium: 0, sugar: 0, protein: 0, fiber: 0.1 },
        },
    }),

    // Generic/typical nutrition - standard USDA values for ground cumin, per 1 tsp (~2.1g).
    cumin: ingredientFactory('Ground Cumin', {
        nutrition: {
            [u.tsp.name]: { servings: 1, servingSize: 1, calories: 8, fat: 0.5, saturatedFat: 0.1, transFat: 0, cholesterol: 0, carbs: 0.9, sodium: 4, sugar: 0.1, protein: 0.4, fiber: 0.2 },
        },
    }),

    // Generic/typical nutrition - standard USDA values for ground coriander, per 1 tsp (~1.8g).
    coriander: ingredientFactory('Ground Coriander', {
        nutrition: {
            [u.tsp.name]: { servings: 1, servingSize: 1, calories: 5, fat: 0.3, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 1, sodium: 1, sugar: 0.1, protein: 0.2, fiber: 0.5 },
        },
    }),

    // Generic/typical nutrition - standard USDA values for chili powder, per 1 tsp (~2.7g).
    chiliPowder: ingredientFactory('Chili Powder', {
        nutrition: {
            [u.tsp.name]: { servings: 1, servingSize: 1, calories: 8, fat: 0.4, saturatedFat: 0.1, transFat: 0, cholesterol: 0, carbs: 1.4, sodium: 26, sugar: 0.2, protein: 0.4, fiber: 0.9 },
        },
    }),

    // From the product label: per 1 burger (71g); 4 burgers per 10 oz box. Sold as a
    // countable frozen patty, so the recipe measures it by the unit and the box counts as 4.
    drPraegersCrunchyCauliflowerBurger: ingredientFactory("Dr. Praeger's Crunchy Cauliflower Burger", {
        products: [{
            brand: "Dr. Praeger's", variant: 'Crunchy Cauliflower Veggie Burgers (4 Count, 10 oz)',
            size: 4, sizeUnit: u.unit,
            // Price from the user; no stable direct product link on hand, so left blank
            // (the shopping list will simply show the price without a deep link).
            listings: [{ price: 4.37 }],
            nutrition: {
                [u.unit.name]: { servings: 4, servingSize: 1, calories: 150, fat: 7, saturatedFat: 0.5, transFat: 0, cholesterol: 0, carbs: 20, sodium: 420, sugar: 1, protein: 3, fiber: 3 },
            },
        }],
    }),

    // Generic/typical nutrition - standard USDA values for yellow mustard, per 1 tsp (~5g).
    mustard: ingredientFactory('Yellow Mustard', {
        nutrition: {
            [u.tsp.name]: { servings: 1, servingSize: 1, calories: 3, fat: 0.2, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0.4, sodium: 55, sugar: 0.1, protein: 0.2, fiber: 0.1 },
        },
    }),

    // Generic/typical nutrition - a standard white hamburger bun (~50g).
    hamburgerBun: ingredientFactory('Hamburger Bun', {
        nutrition: {
            [u.unit.name]: { servings: 1, servingSize: 1, calories: 120, fat: 2, saturatedFat: 0.5, transFat: 0, cholesterol: 0, carbs: 21, sodium: 206, sugar: 3, protein: 4, fiber: 1 },
        },
    }),

    // Generic/typical nutrition - standard USDA values for dill pickles, per 1 medium spear (~35g).
    pickle: ingredientFactory('Dill Pickle', {
        nutrition: {
            [u.unit.name]: { servings: 1, servingSize: 1, calories: 5, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 1.5, sodium: 340, sugar: 0.5, protein: 0, fiber: 0.5 },
        },
    }),
    // Generic/typical nutrition - standard USDA values for rolled oats, per 1 cup (~80g).
    rolledOats: ingredientFactory('Rolled Oats', {
        products: [{
            brand: '365', variant: 'Old Fashioned Rolled Oats', listings: [{ store: stores.wholeFoods }],
            nutrition: {
                [u.cup.name]: { servings: 1, servingSize: 1, calories: 300, fat: 6, saturatedFat: 1, transFat: 0, cholesterol: 0, carbs: 54, sodium: 0, sugar: 1, protein: 10, fiber: 8 },
            },
        }],
    }),

    // Generic/typical nutrition - standard USDA values for pitted Medjool dates, per 1 date (~24g).
    medjoolDate: ingredientFactory('Medjool Dates (Pitted)', {
        conversions: {
            [u.gram.name]: { to: u.unit, factor: 1 / 24 },  // ~24g per pitted Medjool date
        },
        products: [{
            brand: '365', variant: 'Pitted Medjool Dates', listings: [{ store: stores.wholeFoods, price: 6.99, link: 'https://www.amazon.com/365-Everyday-Value-Medjool-Pitted/dp/B074H7XH3H' }],
            nutrition: {
                [u.unit.name]: { servings: 1, servingSize: 1, calories: 66, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 18, sodium: 0, sugar: 16, protein: 0.4, fiber: 1.6 },
            },
        }],
    }),

    // Generic/typical nutrition - allulose is a noncaloric sweetener, so zeroed.
    allulose: ingredientFactory('Allulose', {
        products: [{
            brand: 'Wholesome Yum', variant: 'Powdered Allulose', listings: [{ store: stores.amazon, price: 16.99, link: 'https://www.amazon.com/dp/B07RLP444V' }],
            nutrition: {
                [u.gram.name]: { servings: 1, servingSize: 15, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    // Generic/typical nutrition - standard USDA values for maple extract, negligible per tsp.
    mapleExtract: ingredientFactory('Maple Extract', {
        products: [{
            brand: 'McCormick', variant: 'Pure Maple Extract', listings: [{ store: stores.amazon, price: 5.49, link: 'https://www.amazon.com/McCormick-Pure-Maple-Flavor/dp/B00032GJCO' }],
            nutrition: {
                [u.tsp.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    // Generic/typical nutrition - standard USDA values for ground flaxseed, per 1 tbsp (~7g).
    groundFlaxseed: ingredientFactory('Ground Flaxseed', {
        products: [{
            brand: '365', variant: 'Organic Ground Flaxseed', listings: [{ store: stores.wholeFoods }],
            nutrition: {
                [u.tbsp.name]: { servings: 1, servingSize: 1, calories: 30, fat: 2, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 2, sodium: 2, sugar: 0, protein: 1, fiber: 2 },
            },
        }],
    }),

    // Generic/typical nutrition - standard USDA values for vanilla powder, negligible per ¼ tsp.
    vanillaPowder: ingredientFactory('Vanilla Powder', {
        products: [{
            brand: 'Native Vanilla', variant: 'Bean Powder', listings: [{ store: stores.amazon, price: 15.99, link: 'https://www.amazon.com/Native-Vanilla-Organic-Powder-ounce/dp/B07Z7J3KBK' }],
            nutrition: {
                [u.tsp.name]: { servings: 1, servingSize: 1, calories: 0, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0 },
            },
        }],
    }),

    // Generic/typical nutrition - standard values for mini dark chocolate chips, per 1 tbsp (~11g).
    miniDarkChocolateChip: ingredientFactory('Mini Dark Chocolate Chips', {
        products: [{
            brand: '365', variant: 'Mini Chocolate Chips (Dark)', listings: [{ store: stores.wholeFoods }],
            nutrition: {
                [u.cup.name]: { servings: 1, servingSize: 0.25, calories: 200, fat: 16, saturatedFat: 10, transFat: 0, cholesterol: 0, carbs: 24, sodium: 0, sugar: 20, protein: 2, fiber: 2 },
            },
        }],
    }),

    // From the product label: per 1 link (85g), 5 links per 12 oz package. The recipe tracks
    // the package by count (5 links) and remembers that chicken sausage needs to finish at 165°F.
    chickenSausage: ingredientFactory('Chicken Sausage', {
        isMeatProduct: true,
        products: [{
            brand: '365', variant: 'Italian-Style Chicken Sausage (5 Count, 12 oz)', size: 5, sizeUnit: u.unit, organic: true,
            listings: [{ store: stores.wholeFoods, price: 7.99, link: 'https://www.wholefoodsmarket.com/product/365-by-whole-foods-market-organic-italian-style-chicken-sausage-12-oz-b00jgzgq00' }],
            nutrition: {
                [u.unit.name]: { servings: 5, servingSize: 1, calories: 190, fat: 13, saturatedFat: 3.5, transFat: 0.5, cholesterol: 80, carbs: 1, sodium: 420, sugar: 0, protein: 17, fiber: 0 },
            },
        }],
    }),

    // Generic/typical nutrition (not from a specific brand's label) - standard USDA values
    // for a raw boneless pork shoulder/butt roast (per pound). The user usually buys a
    // pre-salted roast, so the cooking steps skip additional salt.
    porkShoulder: ingredientFactory('Pork Shoulder', {
        isMeatProduct: true,
        requiresDateLabel: true,
        products: [{
            brand: 'Generic', size: 2, sizeUnit: u.pound,
            listings: [{ store: stores.wholeFoods, price: 9.98, link: 'https://www.wholefoodsmarket.com/product/whole-foods-market-pork-butt-roast-boneless' }],
            nutrition: {
                [u.pound.name]: { servings: 1, servingSize: 1, calories: 810, fat: 54, saturatedFat: 19, transFat: 0, cholesterol: 240, carbs: 0, sodium: 160, sugar: 0, protein: 76, fiber: 0 },
            },
        }],
    }),

    // From the product label: per 1 pack (100g), 4 servings per 12 oz package. The recipe
    // cooks one 4-serving pack for 4 minutes, which is also the package's cook time.
    tinglyChiliMomofukuNoodles: ingredientFactory('Tingly Chili Momofuku Noodles', {
        products: [{
            brand: 'Momofuku', variant: 'Tingly Chili (12 oz, 4 packs)', size: 4, sizeUnit: u.unit, packageUnit: u.package,
            listings: [{
                store: stores.wholeFoods,
                price: 11.99,
                link: 'https://www.wholefoodsmarket.com/product/momofuku-tingly-chili-noodle-kit',
            }],
            nutrition: {
                [u.unit.name]: { servings: 4, servingSize: 1, calories: 320, fat: 9, saturatedFat: 3.5, transFat: 0, cholesterol: 0, carbs: 51, sodium: 760, sugar: 4, protein: 9, fiber: 3 },
            },
        }],
    }),

    // Generic/typical nutrition (not from a specific brand's label) - fresh cranberries
    // per 12 oz bag, based on standard USDA values (1 cup whole = ~100g).
    cranberry: ingredientFactory('Fresh Cranberries', {
        products: [{
            brand: 'generic', variant: 'Fresh Cranberries (12 oz bag)', size: 12, sizeUnit: u.ounce,
            listings: [{ price: 3.99 }],
            nutrition: {
                [u.ounce.name]: { servings: 1, servingSize: 1, calories: 14, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 3.6, sodium: 0, sugar: 1.4, protein: 0.1, fiber: 1.4 },
            },
        }],
    }),

    sugar: ingredientFactory('Sugar', {
        conversions: {
            [u.cup.name]: { to: u.ounce, factor: 7.1 },
        },
        nutrition: {
            [u.cup.name]: { servings: 1, servingSize: 1, calories: 773, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 200, sodium: 0, sugar: 200, protein: 0, fiber: 0 },
        },
    }),

    // Generic/typical nutrition (not from a specific brand's label) - zest of one medium
    // orange (~2 tbsp, ~6g), negligible macros but real flavor.
    orangeZest: ingredientFactory('Orange Zest', {
        nutrition: {
            [u.unit.name]: { servings: 1, servingSize: 1, calories: 1, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 0.3, sodium: 0, sugar: 0, protein: 0, fiber: 0.1 },
        },
    }),

};

// ============================================================
// RECIPES
// ============================================================

registerGroup('Breakfast', [
    withPlan(createRecipe('blueprint-smoothie', 'Blueprint Smoothie (Nutribullet, 1 serving)', (() => {
        const mixer = e.bulletMixer();
        const bag = e.siliconeBag('OXO silicone bag');
        const knife = e.knife();
        const board = e.cuttingBoard();
        const MACADAMIA_MILK = i.macadamiaNutMilk(1.25, u.cup);
        const MACADAMIA_NUT  = i.macadamiaNut(0.25, u.cup);
        const CHERRY         = i.cherry(3, u.unit);
        const BERRY_BLEND    = i.antiOxidantBerryBlend(0.5, u.cup);
        const KALE           = i.kale(0.5, u.cup);
        const SPINACH        = i.spinach(0.25, u.cup);
        const CELERY         = i.celery(1, u.unit);
        const BANANA         = i.banana(1, u.unit);
        const LEMON          = i.lemonJuice(2, u.tbsp);
        const NIBS           = i.cocoaNibs(1, u.tsp);
        const CHIA           = i.chiaSeed(1, u.tsp);
        const HEMP           = i.hempSeed(1, u.tbsp);
        const VANILLA        = i.vanillaExtract(0.25, u.tsp);
        const FROZEN_PACK    = [BANANA, CHERRY, BERRY_BLEND, KALE, SPINACH, CELERY];
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);

        s(info(`One ${bag.name} is one serving of produce only. For the week, repeat the tray-freeze and flat-bag steps once per smoothie. Keep ${formatIngredient(MACADAMIA_NUT)}, ${formatIngredient(NIBS)}, ${formatIngredient(CHIA)}, and ${formatIngredient(HEMP)} out of the freezer, pre-portioned into a small pantry jar, one serving per jar.`));
        s(prepOnly(`Slice ${formatIngredient(BANANA)}`, {
            ingredients: [BANANA], equipment: [knife.name, board.name],
        }));
        s(prepOnly(`Pat ${formatIngredient(KALE)}, ${formatIngredient(SPINACH)}, and ${formatIngredient(CELERY)} dry`, {
            ingredients: [KALE, SPINACH, CELERY],
        }));
        s(prepOnly(`Chop ${formatIngredient(CELERY)} into about ½-inch pieces`, {
            ingredients: [CELERY], equipment: [knife.name, board.name],
        }));
        s(prepOnly(`Line a sheet pan with parchment and spread ${formatIngredient(BANANA)}, ${formatIngredient(CHERRY)}, and ${formatIngredient(BERRY_BLEND)} in a single layer so the pieces do not touch`, {
            ingredients: [BANANA, CHERRY, BERRY_BLEND], equipment: ['sheet pan'],
        }));
        const freezeTray = Timer.set(1, 'h', 'Freeze the fruit on the tray until the pieces are firm and separate', {
            equipment: ['sheet pan'], ingredients: [BANANA, CHERRY, BERRY_BLEND],
        });
        freezeTray.prep = true;
        freezeTray.prepOnly = true;
        s(freezeTray);
        const bagPrep = bag.add(FROZEN_PACK);
        bagPrep.prep = true;
        bagPrep.prepOnly = true;
        s(bagPrep);
        s(prepOnly(`Press the air out of the ${bag.name}, seal it, and freeze it flat`, {
            equipment: [bag.name],
        }));

        s(mixer.add([MACADAMIA_MILK, MACADAMIA_NUT, LEMON, NIBS, CHIA, HEMP, VANILLA]));
        s(mixer.mix());
        s(instruction(`Snap the flat ${bag.name} apart by hand so the frozen pack breaks into pieces`, {
            equipment: [bag.name],
        }));
        s(bag.transfer(mixer, FROZEN_PACK));
        s(Timer.set(4, 'm', 'Let the frozen pack sit in the cup (3–5 min)', { equipment: [mixer.name] }));
        s(mixer.mix());

        return steps;
    })(), undefined, 8), { planMinutes: 8, portable: false, prepMinutes: 75 }),
    withPlan(createRecipe('blueprint-smoothie-nuwave', 'Blueprint Smoothie (Nuwave) (x2)', (() => {
        const mixer = e.bulletMixer();
        const bagA = e.siliconeBag('OXO silicone bag 1');
        const bagB = e.siliconeBag('OXO silicone bag 2');
        const knife = e.knife();
        const board = e.cuttingBoard();
        const MACADAMIA_MILK = i.macadamiaNutMilk(2.5, u.cup);
        const MACADAMIA_NUT  = i.macadamiaNut(0.5, u.cup);
        const LEMON          = i.lemonJuice(4, u.tbsp);
        const NIBS           = i.cocoaNibs(2, u.tsp);
        const CHIA           = i.chiaSeed(2, u.tsp);
        const HEMP           = i.hempSeed(2, u.tbsp);
        const VANILLA        = i.vanillaExtract(0.5, u.tsp);
        const BANANA_A = i.banana(1, u.unit);
        const BANANA_B = i.banana(1, u.unit);
        const CHERRY_A = i.cherry(3, u.unit);
        const CHERRY_B = i.cherry(3, u.unit);
        const BERRY_A  = i.antiOxidantBerryBlend(0.5, u.cup);
        const BERRY_B  = i.antiOxidantBerryBlend(0.5, u.cup);
        const KALE_A   = i.kale(0.5, u.cup);
        const KALE_B   = i.kale(0.5, u.cup);
        const SPINACH_A = i.spinach(0.25, u.cup);
        const SPINACH_B = i.spinach(0.25, u.cup);
        const CELERY_A = i.celery(1, u.unit);
        const CELERY_B = i.celery(1, u.unit);
        const PACK_A = [BANANA_A, CHERRY_A, BERRY_A, KALE_A, SPINACH_A, CELERY_A];
        const PACK_B = [BANANA_B, CHERRY_B, BERRY_B, KALE_B, SPINACH_B, CELERY_B];
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);

        s(info(`Use two ${bagA.name.replace(' 1', '')}s, one serving of produce in each, not one double bag. For the week, repeat the tray-freeze and flat-bag steps once per smoothie. Keep the macadamia nuts, cocoa nibs, chia, and hemp out of the freezer and pre-portion one serving of them into a small pantry jar.`));
        s(prepOnly(`Slice ${formatIngredient(BANANA_A)} for each bag`, {
            ingredients: [BANANA_A, BANANA_B], equipment: [knife.name, board.name],
        }));
        s(prepOnly(`Pat ${formatIngredient(KALE_A)}, ${formatIngredient(SPINACH_A)}, and ${formatIngredient(CELERY_A)} dry for each bag`, {
            ingredients: [KALE_A, KALE_B, SPINACH_A, SPINACH_B, CELERY_A, CELERY_B],
        }));
        s(prepOnly(`Chop ${formatIngredient(CELERY_A)} into about ½-inch pieces for each bag`, {
            ingredients: [CELERY_A, CELERY_B], equipment: [knife.name, board.name],
        }));
        s(prepOnly(`Line a sheet pan with parchment and spread ${formatIngredient(BANANA_A)}, ${formatIngredient(CHERRY_A)}, and ${formatIngredient(BERRY_A)} per bag in a single layer so the pieces do not touch`, {
            ingredients: [BANANA_A, BANANA_B, CHERRY_A, CHERRY_B, BERRY_A, BERRY_B], equipment: ['sheet pan'],
        }));
        const freezeTray = Timer.set(1, 'h', 'Freeze the fruit on the tray until the pieces are firm and separate', {
            equipment: ['sheet pan'],
            ingredients: [BANANA_A, BANANA_B, CHERRY_A, CHERRY_B, BERRY_A, BERRY_B],
        });
        freezeTray.prep = true;
        freezeTray.prepOnly = true;
        s(freezeTray);
        const bagPrepA = bagA.add(PACK_A);
        bagPrepA.prep = true;
        bagPrepA.prepOnly = true;
        s(bagPrepA);
        const bagPrepB = bagB.add(PACK_B);
        bagPrepB.prep = true;
        bagPrepB.prepOnly = true;
        s(bagPrepB);
        s(prepOnly(`Press the air out of ${bagA.name} and ${bagB.name}, seal them, and freeze each bag flat`, {
            equipment: [bagA.name, bagB.name],
        }));

        s(mixer.add([MACADAMIA_MILK, MACADAMIA_NUT, LEMON, NIBS, CHIA, HEMP, VANILLA]));
        s(Timer.set(90, 's', 'Use Nut Milk setting', { equipment: [mixer.name], ingredients: [MACADAMIA_MILK] }));
        s(instruction(`Snap ${bagA.name} and ${bagB.name} apart by hand so each frozen pack breaks into pieces`, {
            equipment: [bagA.name, bagB.name],
        }));
        s(bagA.transfer(mixer, PACK_A));
        s(bagB.transfer(mixer, PACK_B));
        s(Timer.set(4, 'm', 'Let the frozen packs sit in the cup (3–5 min)', { equipment: [mixer.name] }));
        s(mixer.mix());

        return steps;
    })(), undefined, 8), { planMinutes: 8, portable: false, prepMinutes: 75 }),
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
    withPlan(createRecipe('scrambled-eggs', 'Scrambled Eggs (NuWave, Stainless Steel)', (() => {
        const bowl = e.bowl();
        const pan  = e.pan();
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);

        s(bowl.add([
            i.egg(3, u.unit),
            i.seaSalt(0.125, u.tsp),
            i.blackPepper(0.125, u.tsp),
        ]));
        s(bowl.mix('whisked eggs'));
        const WHISKED = bowl.result;
        const EGG     = i.egg(3, u.unit);

        s(pan.preheat(300));
        s(instruction('Flick a wet finger at the pan to test - the droplet should bead and skitter rather than vanish instantly. If it violently sprays everywhere, the pan is too hot - lower the temperature briefly', { equipment: [pan.name] }));
        const OIL         = i.oliveOil(1.5, u.tsp);
        s(pan.addOil(OIL));
        s(pan.heatUp(OIL));

        s(pan.setTemp(250));
        s(bowl.transfer(pan, [WHISKED]));
        s(Timer.set(18, 's', "Don't touch - let the bottom begin to set", { equipment: [pan.name], ingredients: [WHISKED] }));
        s(instruction(`Gently push the cooked ${formatIngredient(WHISKED)} toward the center with a silicone spatula, tilting the pan so uncooked egg runs into the empty areas`, { equipment: [pan.name], ingredients: [WHISKED, EGG] }));
        s(Timer.set(12, 's', 'Let sit before the next fold', { equipment: [pan.name], ingredients: [WHISKED] }));
        s(instruction(`Fold ${formatIngredient(WHISKED)} again, gently - avoid aggressively stirring against the stainless steel`, { equipment: [pan.name], ingredients: [WHISKED] }));
        s(Timer.set(90, 's', 'Finish cooking, folding every 10-15s, until the eggs still look slightly wet - then turn off the NuWave', { equipment: [pan.name], ingredients: [WHISKED, EGG] }));
        s(instruction('Turn off the NuWave', { equipment: [pan.name] }));
        s(Timer.set(25, 's', 'Let residual heat finish the eggs', { equipment: [pan.name], ingredients: [WHISKED] }));

        return steps;
    })()), { planMinutes: 6, portable: false }),
    withPlan(createRecipe('iced-coffee', 'Iced Coffee', (() => {
        const glass = e.glass();
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);

        const ICE = i.iceCube(3, u.unit);
        const CREAMER = i.coffeeCreamer(3, u.tbsp);
        const COLD_BREW = i.coldBrewCoffee(8, u.fluidOunce);
        s(glass.add([ICE]));
        s(instruction(`Pour ${formatIngredient(CREAMER)} into the glass until it reaches about ¾ of the way up to the bottom ice cube`, {
            equipment: [glass.name],
            ingredients: [ICE, CREAMER],
        }));
        s(instruction(`Pour ${formatIngredient(COLD_BREW)} into the glass until full`, {
            equipment: [glass.name],
            ingredients: [COLD_BREW],
        }));

        return steps;
    })(), undefined, 2), { planMinutes: 2, portable: true }),

withPlan(createRecipe(
    'shelf-stable-vanilla-chip-chewy-granola-bars',
    'Shelf-Stable Vanilla-Chip Chewy Granola Bars (Makes 10)',
    (() => {
        const bowl         = e.bowl();
        const foodProcessor = e.bulletMixer();
        const pan          = e.pan('8×8-inch pan');
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);

        const OATS       = i.rolledOats(180, u.gram);
        const PEANUT_BUTTER = i.peanutButter(128, u.gram);
        const DATES      = i.medjoolDate(120, u.gram);
        const ALLULOSE   = i.allulose(15, u.gram);
        const WATER      = i.water(2, u.tbsp);
        const MAPLE      = i.mapleExtract(0.5, u.tsp);
        const PSYLLIUM   = i.psyllium(1, u.tbsp);
        const PSYLLIUM_WATER = i.water(4, u.tbsp);
        const HEMP       = i.hempSeed(2, u.tbsp);
        const VANILLA    = i.vanillaExtract(1, u.tsp);
        const SALT       = i.seaSalt(0.5, u.tsp);
        const VANILLA_POWDER = i.vanillaPowder(0.25, u.tsp);
        const CHOCOLATE  = i.miniDarkChocolateChip(0.25, u.cup);

        const soakStep = Timer.set(7, 'm', `Soak ${formatIngredient(DATES)} in water for 5–10 minutes, then drain`, {
            ingredients: [DATES, WATER],
        });
        s(soakStep);

        s(foodProcessor.add([PSYLLIUM, PSYLLIUM_WATER]));
        const psylliumTimer = Timer.set(2, 'm', `Let ${formatIngredient(PSYLLIUM)} and ${formatIngredient(PSYLLIUM_WATER)} thicken into a gel in the bullet mixer`, {
            equipment: [foodProcessor.name],
            ingredients: [PSYLLIUM, PSYLLIUM_WATER],
        });
        s(psylliumTimer);

        const addStickyBase = foodProcessor.add([
            PEANUT_BUTTER,
            ALLULOSE,
            MAPLE,
            VANILLA,
            SALT,
        ]).waitFor(psylliumTimer);
        s(addStickyBase);
        const addDates = foodProcessor.add([DATES]).waitFor(soakStep);
        s(addDates);
        foodProcessor.mix('sticky date-nut butter paste');
        const DATE_PASTE = foodProcessor.result;
        s(Timer.set(25, 's', 'Pulse on low for 25 seconds into a sticky date-nut butter paste', {
            equipment: [foodProcessor.name],
            ingredients: [PSYLLIUM, PSYLLIUM_WATER, PEANUT_BUTTER, ALLULOSE, MAPLE, VANILLA, SALT, DATES, DATE_PASTE],
        }));
        s(bowl.add([
            OATS,
            HEMP,
        ]));
        s(bowl.mix());
        s(instruction(`Pour ${formatIngredient(DATE_PASTE)} over the oats and mix extremely well`, {
            equipment: [bowl.name],
            ingredients: [DATE_PASTE, OATS, PSYLLIUM, HEMP],
        }));
        s(instruction(`Fold in ${formatIngredient(CHOCOLATE)}`, {
            ingredients: [CHOCOLATE],
        }));
        if (VANILLA_POWDER) {
            s(instruction(`Fold in ${formatIngredient(VANILLA_POWDER)} (optional)`, {
                ingredients: [VANILLA_POWDER],
            }));
        }
        s(instruction('Line an 8×8-inch pan with parchment paper', { equipment: [pan.name] }));
        s(instruction(`Press the mixture down very firmly in the pan so the bars don't crumble`, {
            equipment: [pan.name],
        }));
        s(Timer.set(2, 'h', 'Refrigerate for at least 2 hours', { equipment: [pan.name] }));
        s(instruction('Cut into 10 equal bars'));
        s(info('No baking needed. Since the bars use water, not milk, they stay shelf-stable. If they are soft, chill them longer before cutting.'));

        return steps;
    })(), undefined, 15), { planMinutes: 2, portable: true, prepMinutes: 15, perishableDays: 14 }),
]);

// Moved out of the Dinner array - registers itself under its own 'Cleaning' group
registerRecipe(createRecipe(
    'clean-water-bottle',
    'Clean Water Bottle',
    (() => {
        // Tap water - free and nutritionally zero either way, so an approximate fill
        // amount here doesn't affect any cost/nutrition totals; it just lets each
        // "dump out" step reference the same water that was added.
        const RINSE_1 = i.water(15, u.fluidOunce);
        const RINSE_2 = i.water(15, u.fluidOunce);
        const RINSE_3 = i.water(15, u.fluidOunce);
        const QUARTER_FILL = i.water(2, u.fluidOunce);
        const VINEGAR = i.whiteVinegar(1, u.tsp);
        const BAKING_SODA = i.bakingSoda(0.5, u.tsp);
        return [
            instruction('Make sure the straw is seated in the bottle'),
            instruction('Power wash the top to remove dust'),
            instruction('Add about 15 ounces of water to the bottle', { ingredients: [RINSE_1] }),
            instruction(`Add ${formatIngredient(VINEGAR)}`, {
                ingredients: [VINEGAR],
            }),
            Timer.set(45, 's', 'Shake'),
            instruction(`Dump out ${formatIngredient(RINSE_1)}`, { ingredients: [RINSE_1] }),
            instruction('Clean the straw with a straw pipe cleaner'),
            instruction('Add about 15 ounces of water to the bottle', { ingredients: [RINSE_2] }),
            instruction(`Add ${formatIngredient(BAKING_SODA)}`, {
                ingredients: [BAKING_SODA],
            }),
            Timer.set(45, 's', 'Shake'),
            instruction(`Dump out ${formatIngredient(RINSE_2)}`, { ingredients: [RINSE_2] }),
            instruction('Add about 15 ounces of water to the bottle', { ingredients: [RINSE_3] }),
            Timer.set(20, 's', 'Shake'),
            instruction(`Dump out ${formatIngredient(RINSE_3)}`, { ingredients: [RINSE_3] }),
            instruction('Fill the bottle about ¼ full with water', { ingredients: [QUARTER_FILL] }),
            instruction(`Dump out ${formatIngredient(QUARTER_FILL)}`, { ingredients: [QUARTER_FILL] }),
            instruction('Let the bottle air dry'),
        ];
    })(),
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

        s(instruction(`Mince ${formatIngredient(ONION)}`, { ingredients: [ONION], equipment: [cuttingBoard.name] }));
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

registerRecipe(withPlan(createRecipe(
    'taco-ames-hot-sauce',
    'Taco Ames Hot Sauce',
    (() => {
        const cuttingBoard = e.cuttingBoard();
        const pot          = e.pot();
        const mixer        = e.bulletMixer();
        const colander     = e.colander();
        const jar          = e.bowl('jar');
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);

        const CHILE_ARBOL  = i.chileDeArbol(6, u.unit);
        const CHILE_PEQUIN = i.chilePequin(3, u.unit);
        const WATER        = i.water(1, u.cup);
        const BELL_PEPPER  = i.redBellPepper(0.5, u.unit);
        const GARLIC       = i.garlicClove(1, u.unit);
        const ONION        = i.whiteOnion(0.25, u.cup);
        const CELERY       = i.celery(2, u.tbsp);
        const CARROT       = i.carrot(2, u.tbsp);

        s(instruction(`Remove stems from ${formatIngredient(CHILE_ARBOL)} and ${formatIngredient(CHILE_PEQUIN)} (keep the veins in for more heat, scrape them out for less)`, {
            equipment: [cuttingBoard.name],
            ingredients: [CHILE_ARBOL, CHILE_PEQUIN],
        }));
        s(pot.add([CHILE_ARBOL, CHILE_PEQUIN, WATER]));
        s(Timer.set(6, 'm', 'Bring to a simmer and cook until the chiles have softened and turned a deep red-brown', { equipment: [pot.name] }));
        s(instruction(`Roughly chop ${formatIngredient(BELL_PEPPER)}, ${formatIngredient(GARLIC)}, ${formatIngredient(ONION)}, ${formatIngredient(CELERY)}, and ${formatIngredient(CARROT)}`, {
            equipment: [cuttingBoard.name],
            ingredients: [BELL_PEPPER, GARLIC, ONION, CELERY, CARROT],
        }));
        s(pot.transfer(mixer, [CHILE_ARBOL, CHILE_PEQUIN, WATER]));
        s(mixer.add([
            BELL_PEPPER,
            GARLIC,
            ONION,
            CELERY,
            CARROT,
            i.cilantro(1, u.tbsp),
            i.cumin(0.5, u.tsp),
            i.chiliPowder(0.5, u.tsp),
            i.seaSalt(0.5, u.tsp),
            i.blackPepper(0.125, u.tsp),
            i.whiteVinegar(0.333, u.cup),
        ]));
        s(mixer.mix('blended hot sauce'));
        const BLENDED = mixer.result;
        s(mixer.transfer(colander, [BLENDED]));
        s(instruction(`Strain ${formatIngredient(BLENDED)} into the jar, pressing with a spoon to push liquid through and leave the pulp and skins behind`, {
            equipment: [colander.name, jar.name],
            ingredients: [BLENDED],
        }));
        s(instruction('Taste and adjust seasoning if needed, then cap and refrigerate'));
        return steps;
    })(),
    'Sauces',
), { planMinutes: 1, portable: true, prepMinutes: 20, perishableDays: 14 }));

registerGroup('Dinner', [
    withPlan(createRecipe('tingly-chili-momofuku-noodles', 'Tingly Chili Momofuku Noodles', (() => {
        const pot     = e.pot();
        const colander = e.colander();
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);

        const WATER  = i.water(26, u.ounce);
        const NOODLES = i.tinglyChiliMomofukuNoodles(1, u.unit);

        s(pot.add([WATER]));
        s(pot.setTemp(525));
        s(Timer.set(10, 'm', 'Bring water to a boil - start the 4 minute timer once it is boiling, not before', { equipment: [pot.name], ingredients: [WATER] }));
        s(Timer.gate('Is the water boiling?', 1, 'm', { equipment: [pot.name], ingredients: [WATER] }));
        s(pot.add([NOODLES], 'gently separate with tongs'));
        s(pot.cook(`Cook ${formatIngredient(NOODLES)}`, time.minutes(4), 525));
        s(instruction(`Drain ${formatIngredient(NOODLES)}`, {
            equipment: [pot.name, colander.name],
            ingredients: [NOODLES],
        }));

        return steps;
    })()), { planMinutes: 10, portable: false }),
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
        s(...pankoPan.spray(i.avocadoOil(1, u.spray)));
        s(pankoBowl.combine([batter.result], 'coat with panko'));
        pankoBowl.result.rename('Breaded King Oyster Mushroom');
        s(pankoBowl.transfer(pankoPan, [pankoBowl.result]));
        s(...pankoPan.spray(i.avocadoOil(1, u.spray)));
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
        const CARROTS        = i.carrot(1, u.pound);
        const BELLA_MUSHROOMS = i.babyBellaMushroom(8, u.ounce);
        const YELLOW_ONION    = i.yellowOnion(1, u.unit);
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);

        s(oven.preheat(450));
        s(instruction('Place sheet pan in oven while it preheats', { equipment: ['oven', 'sheet pan'] }));
        s(bowl.add([
            [CARROTS, 'peeled, cut lengthwise or into thick diagonals'],
            [BELLA_MUSHROOMS, 'halved'],
            [YELLOW_ONION, 'cut into 8 wedges'],
            i.oliveOil(1, u.tbsp),
            i.seaSalt(1, u.tsp),
            i.rosemary(2, u.tsp),
            i.thyme(2, u.tsp),
        ]));
        s(bowl.mix());
        s(instruction(`Carefully spread ${formatIngredient(CARROTS)}, ${formatIngredient(BELLA_MUSHROOMS)}, and ${formatIngredient(YELLOW_ONION)} onto the hot sheet pan in a single layer, leaving space between pieces`, {
            equipment: ['sheet pan'],
            ingredients: [CARROTS, BELLA_MUSHROOMS, YELLOW_ONION],
        }));
        s(Timer.set(20, 'm', 'Roast - do not move'));
        s(instruction(`Flip ${formatIngredient(CARROTS)}, ${formatIngredient(BELLA_MUSHROOMS)}, and ${formatIngredient(YELLOW_ONION)} on the sheet pan`, { equipment: ['sheet pan'], ingredients: [CARROTS, BELLA_MUSHROOMS, YELLOW_ONION] }));
        s(Timer.set(17, 'm', 'Roast until carrots are caramelized, mushrooms deeply browned, onions soft with crispy tips', { equipment: ['sheet pan'], ingredients: [CARROTS, BELLA_MUSHROOMS, YELLOW_ONION] }));
        s(Timer.set(5, 'm', 'Rest vegetables before serving'));

        return steps;
    })(), undefined, 45),

    createRecipe('pan-seared-chicken-sausage', 'Pan-Seared Chicken Sausage (Sear + Cover to Finish)', (() => {
        const pan = e.pan();
        const SAUSAGES = i.chickenSausage(5, u.unit);
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);

        s(pan.preheat(325));
        s(pan.add([
            i.avocadoOil(1, u.spray),
            [SAUSAGES, 'add in a single layer'],
        ]));
        s(pan.cook('Sear first side, uncovered - golden crust, no lid', time.minutes(5), 325));
        s(pan.flip());
        s(pan.cook('Sear second side, uncovered - golden crust, no lid', time.minutes(5), 325));
        s(instruction(`Cover the pan with the lid over ${formatIngredient(SAUSAGES)}`, { equipment: [pan.name], ingredients: [SAUSAGES] }));
        s(pan.cook('Cook with the lid on until the sausages reach 165°F in the center', time.minutes(6), 325));
        s(Timer.gate('Are the sausages at least 165°F in the center?', 2, 'm', { ingredients: [SAUSAGES], equipment: [pan.name] }));
        s(instruction('Remove the lid and rest the sausages 5 minutes before serving', { equipment: [pan.name], ingredients: [SAUSAGES] }));
        s(Timer.set(5, 'm', 'Rest before serving', { equipment: [pan.name], ingredients: [SAUSAGES] }));

        return steps;
    })()),

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
        s(pan.cook('Simmer sauce with sausage', time.minutes(5) * 60, 7));

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
        s(instruction(`Pat ${formatIngredient(EDAMAME)} dry, then add to bowl`, { ingredients: [EDAMAME, i.blueZonesBasilPestoVeggieBowl(0, u.unit)], equipment: [bowl.name] }));
        s(bowl.add([
            i.chickpeas(1, u.cup),
            i.cannelliniBean(1, u.cup),
        ]));
        s(instruction('Add the included flavor packet and toppings from the kit, toss to combine', { equipment: [bowl.name] }));

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
        s(instruction(`Divide into bowls and top with ${formatIngredient(ALMONDS)}`, { ingredients: [ALMONDS] }));
        s(Timer.set(30, 'm', 'Optional: chill before serving'));

        return steps;
    })()), { hidden: true }),

    createRecipe('asian-dense-bean-salad', 'Asian Dense Bean Salad', (() => {
        const saladBowl = e.bowl('salad bowl');
        const CARROTS      = i.carrot(1, u.cup);
        CARROTS.defaultBrand = 'CAL ORGANIC';  // this recipe shreds whole carrots itself, not pre-shredded
        const CABBAGE      = i.cabbage(2, u.cup);
        // Real-world prep buys 3 packages of each (1.5 cups/package) and splits them across 4
        // single-recipe batches, so this recipe's true share is 3/4 package = 1.125 cups - used
        // here for accurate nutrition/shopping totals even though the step below still says the
        // whole-can "1.5 cups" that's actually measured out per batch.
        const CHICKPEAS    = i.chickpeas(1.125, u.cup);
        const CANNELLINI   = i.cannelliniBean(1.125, u.cup);
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
            EDAMAME,
        ]);
        addProduce.prep = true;
        s(addProduce);

        s(instruction('Add 1.5 cups chickpeas to salad bowl', { ingredients: [CHICKPEAS, i.blueZonesBasilPestoVeggieBowl(0, u.unit)], equipment: [saladBowl.name] }));
        s(instruction('Add 1.5 cups cannellini beans to salad bowl', { ingredients: [CANNELLINI, i.blueZonesBasilPestoVeggieBowl(0, u.unit)], equipment: [saladBowl.name] }));

        s(saladBowl.add([i.creamySesameDressing(2, u.tbsp)], 'pour dressing over salad, toss gently to coat'));

        return steps;
    })()),

    createRecipe('asian-dense-bean-salad-4x', 'Asian Dense Bean Salad (4x)', (() => {
        const saladBowl = e.bowl('salad bowl');
        const CARROTS      = i.carrot(4, u.cup);
        CARROTS.defaultBrand = 'CAL ORGANIC';  // this recipe shreds whole carrots itself, not pre-shredded
        const CABBAGE      = i.cabbage(8, u.cup);
        const CHICKPEAS    = i.chickpeas(4, u.cup);
        const CANNELLINI   = i.cannelliniBean(4, u.cup);
        const EDAMAME      = i.edamame(4, u.cup);
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);
        const microwave = e.microwave();

        s(Timer.set(80, 's', 'If eating right away and edamame is frozen: microwave edamame', { equipment: [microwave.name], ingredients: [EDAMAME] }));
        s(prep('Peel and shred carrots', { ingredients: [CARROTS] }));
        s(prep('Shred cabbage (can be done the day before)', { ingredients: [CABBAGE] }));
        s(prep('Get out 3 packages of chickpeas and 3 packages of cannellini beans, open the tops', { ingredients: [CHICKPEAS, CANNELLINI] }));
        s(prep('Strain chickpeas, then measure ~1.5 cups into each of the 4 salad bowl tops', { ingredients: [CHICKPEAS, i.blueZonesBasilPestoVeggieBowl(0, u.unit)], equipment: [saladBowl.name] }));
        s(prep('Strain cannellini beans, then measure ~1.5 cups into each of the 4 salad bowl tops', { ingredients: [CANNELLINI, i.blueZonesBasilPestoVeggieBowl(0, u.unit)], equipment: [saladBowl.name] }));

        const addProduce = saladBowl.add([
            [CARROTS,                 'shredded'],
            [CABBAGE,                 'shredded'],
            [i.greenOnion(8, u.unit), 'chopped'],
            CHICKPEAS,
            CANNELLINI,
            EDAMAME,
        ]);
        addProduce.prep = true;
        s(addProduce);

        s(saladBowl.add([i.creamySesameDressing(8, u.tbsp)], 'pour dressing over salad, toss gently to coat'));

        return steps;
    })()),

    createRecipe('nuwave-chicken-thighs', 'Nuwave Chicken Thighs (325°F)', (() => {
        const pan = e.pan();
        const seasoningBowl = e.bowl('seasoning bowl');
        const THIGHS = i.chickenThigh(2, u.unit);
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);

        s(seasoningBowl.add([
            i.seaSalt(0.5, u.tsp),
            i.blackPepper(0.5, u.tsp),
            i.paprika(0.5, u.tsp),
            i.garlicPowder(0.5, u.tsp),
        ]));
        s(seasoningBowl.mix());
        s(instruction(`Season ${formatIngredient(THIGHS)} on both sides with seasoning mixture`, { ingredients: [THIGHS] }));
        s(pan.preheat(325));
        const OIL = i.avocadoOil(1, u.spray);
        s(...pan.spray(OIL, { heatUp: true }));
        s(pan.add([[THIGHS, 'smooth side down']]));
        s(instruction('Place lid fully on pan', { equipment: [pan.name] }));
        s(pan.cook('Cook first side, covered - do not move', time.minutes(6), 325));
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
        s(instruction('Season with ¼ teaspoon Sea Salt and ¼ teaspoon Black Pepper, garnish, and serve', {
            ingredients: [i.seaSalt(0.25, u.tsp), i.blackPepper(0.25, u.tsp)], equipment: [platter.name],
        }));

        return steps;
    })()),

    createRecipe('dr-praegers-cauliflower-burger-nuwave', "Dr. Praeger's Crunchy Cauliflower Burger - NuWave", (() => {
        const pan    = e.pan();
        const board  = e.cuttingBoard();
        const knife  = e.knife();
        const BURGER = i.drPraegersCrunchyCauliflowerBurger(2, u.unit);
        const OIL    = i.oliveOil(1, u.spray);
        const ONION  = i.whiteOnion(1, u.unit);
        const BUN    = i.hamburgerBun(2, u.unit);
        const MUSTARD = i.mustard(1, u.tbsp);
        const PICKLE = i.pickle(2, u.unit);
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);

        s(pan.preheat(320));
        s(...pan.spray(OIL, { heatUp: true }));
        s(pan.add([[BURGER, 'both frozen, straight from the freezer']]));
        const firstCook  = pan.cook('Cook first side - both burgers at once', time.minutes(5), 320);
        s(firstCook);
        s(pan.flip());
        const secondCook = pan.cook('Cook second side - both burgers at once', time.minutes(5), 320);
        s(secondCook);
        // Unlock the onion slicing the moment the second side's cook timer starts, but
        // don't wait for it to finish - the cutter can prep while the burgers cook.
        const sliceOnion = prep(`While the second side cooks, slice ${formatIngredient(ONION)}`, {
            equipment: [board.name, knife.name], ingredients: [ONION],
        });
        s(sliceOnion.startWhen(secondCook));

        // Burgers are done - toast the buns (cut side down) on the still-hot pan.
        s(instruction(`Place ${formatIngredient(BUN)} cut-side down on the pan`, {
            equipment: [pan.name], ingredients: [BUN],
        }));
        s(pan.cook('Toast buns cut-side down until golden and crisp', time.minutes(1), 320));

        s(instruction(`Assemble burger on ${formatIngredient(BUN)} with ${formatIngredient(MUSTARD)}, ${formatIngredient(ONION)}, ${formatIngredient(PICKLE)}, and ${formatIngredient(BURGER)}`, {
            ingredients: [BUN, MUSTARD, ONION, PICKLE, BURGER],
        }));

        return steps;
    })(), 'Dinner', 18),

    withPlan(createRecipe('quinoa-falafel', 'Quinoa Falafel', (() => {
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);
        const bowl      = e.bowl('mixing bowl');
        const pasteBowl = e.bowl('small bowl');
        const colander  = e.colander();
        const pot       = e.pot();
        const oven      = e.oven();

        const QUINOA = i.quinoa(1, u.cup);
        const BEANS  = i.blackBean(1.5, u.cup);
        const GARLIC = i.garlicClove(3, u.unit);

        s(info('Makes 24 patties. Keeps 3-4 days in the fridge, or 1 month in the freezer'));
        s(prep('Rinse 1 cup dry quinoa in a fine-mesh strainer under cold water', { equipment: [pot.name], ingredients: [QUINOA, i.water(1, u.cup)] }));
        s(prep('Add the rinsed quinoa and 2 cups water to a small pot, cover, and set over high heat', { equipment: [pot.name], ingredients: [QUINOA, i.water(2, u.cup)] }));
        s(timerStep('Bring quinoa and water to a boil on the induction stovetop (set to 475°)', time.minutes(3), { prep: true, equipment: [pot.name], ingredients: [QUINOA, i.water(2, u.cup)] }));
        s(timerStep('Simmer quinoa, covered, on the induction stovetop (set to 215°)', time.minutes(15), { prep: true, equipment: [pot.name], ingredients: [QUINOA, i.water(2, u.cup)] }));
        const quinoaCooled = timerStep('Fluff the quinoa and let it cool completely before using', time.minutes(15), { prep: true, equipment: [pot.name], ingredients: [QUINOA] });
        s(quinoaCooled);
        s(colander.add([BEANS]));
        s(instruction(`Strain ${formatIngredient(BEANS)} and mash them`, { ingredients: [BEANS], equipment: [colander.name] }));

        s(pasteBowl.add([
            [i.water(4.5, u.tsp), ''],
            [i.psyllium(1.5, u.tsp), ''],
        ], 'stir into a smooth paste'));
        s(bowl.add([
            [QUINOA,       'cooked and cooled'],
            [BEANS,        'mashed'],
            [GARLIC,       'minced'],
            [i.seaSalt(0.5, u.tsp), ''],
            [i.cumin(1, u.tsp), ''],
            [i.coriander(0.5, u.tsp), ''],
        ], 'stir into a textured dough').waitFor(quinoaCooled));
            s(instruction(`Fold the ${formatIngredient(i.psyllium(1.5, u.tsp))} paste into the dough until evenly combined`, {
            equipment: [bowl.name, pasteBowl.name],
            ingredients: [i.psyllium(1.5, u.tsp)],
        }));

        s(instruction('Scoop 1.5 tbsp portions and press into discs about 1.5 in across and ½ in thick', {
            equipment: [bowl.name],
        }));

        s(instruction(`Line a sheet pan with parchment, place the discs, and spray lightly with ${formatIngredient(i.oliveOil(1, u.spray))}`, {
            equipment: [oven.name, 'sheet pan'],
            ingredients: [i.oliveOil(1, u.spray)],
        }));

        s(oven.cook('Bake until golden and set', time.minutes(15), 375));
        s(instruction('Flip the patties', { equipment: [oven.name] }));
        s(oven.cook('Bake until edges are golden', time.minutes(10), 375));
        s(Timer.gate('Are the edges golden?', 2, 'm', { equipment: [oven.name] }));

        return steps;
    })()), { planMinutes: 20, portable: false, prepMinutes: 25, perishableDays: 4 }),

    withPlan(createRecipe(
        'blue-zones-basil-pesto-veggie-bowl',
        'Blue Zones Kitchen Basil Pesto Veggie Bowl',
        (() => {
            const microwave = e.microwave();
            const BOWL = i.blueZonesBasilPestoVeggieBowl(1, u.unit);
            const steps: Step[] = [];
            const s = (...newSteps: Step[]) => steps.push(...newSteps);

            s(instruction(`Peel back the film and microwave ${formatIngredient(BOWL)} without it`, {
                equipment: [microwave.name, 'bowl'],
                ingredients: [BOWL],
            }));
            s(Timer.set(3, 'm', 'Microwave on high', { equipment: [microwave.name], ingredients: [BOWL] }));
            s(instruction(`Stir ${formatIngredient(BOWL)} so it heats evenly`, { equipment: [microwave.name, 'bowl'], ingredients: [BOWL] }));
            s(Timer.set(30, 's', 'Microwave until steaming hot all the way through', { equipment: [microwave.name], ingredients: [BOWL] }));
            s(Timer.set(120, 's', 'Let rest, then enjoy straight from the bowl', { equipment: ['bowl'], ingredients: [BOWL] }));

            return steps;
        })(),
    ), { planMinutes: 7, portable: false }),

    createRecipe('nuwave-pork-shoulder', 'Pork Shoulder (NuWave, 2 lb)', (() => {
        const pan = e.pan();
        const PORK = i.porkShoulder(2, u.pound);
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);

        s(info('For a 2 lb pork shoulder. Set the NuWave to 375°F, brown the pork uncovered, then cook it covered at 225°F for 2–3 hours until it hits 195–205°F inside.'));

        s(pan.setTemp(375));
        s(pan.addOil(i.avocadoOil(1, u.spray), 'a little oil for browning'));
        s(pan.add([[PORK, 'brown uncovered, 3–5 minutes per side']]));
        s(pan.cook('Brown first side, uncovered', time.minutes(5), 375));
        s(pan.flip());
        s(pan.cook('Brown second side, uncovered', time.minutes(5), 375));

        s(pan.add([
            [i.water(1.5, u.cup), 'or broth, a third to halfway up the meat'],
            [i.blackPepper(1, u.tsp), 'only if using water'],
            [i.garlicPowder(1, u.tsp), 'only if using water'],
            [i.onionPowder(1, u.tsp), 'only if using water'],
            [i.paprika(1, u.tsp), 'optional'],
        ], 'season the liquid - no extra salt, the pork is already salted'));

        s(instruction('Bring to a gentle simmer, put the lid on', { equipment: [pan.name] }));
        s(pan.setTemp(225));
        s(instruction('If you need to keep a few slow bubbles going, go up toward 275°F', { equipment: [pan.name] }));
        s(pan.cook('Cook covered', time.minutes(90), 225));
        s(Timer.gate('Has it cooked at least 1.5 hours?', 30, 'm', { equipment: [pan.name], ingredients: [PORK] }));
        s(instruction(`Turn ${formatIngredient(PORK)} and add water if it gets low`, { equipment: [pan.name], ingredients: [PORK, i.water(1, u.cup)] }));
        s(pan.cook('Cook covered, second half', time.minutes(60), 225));
        s(Timer.gate('Can a fork twist easily in the meat?', 15, 'm', { equipment: [pan.name], ingredients: [PORK] }));
        s(instruction(`Check the center temperature - it should read 195–205°F. Add water if it gets low`, {
            equipment: [pan.name], ingredients: [PORK, i.water(1, u.cup)],
        }));
        s(Timer.gate('Is the pork at 195–205°F in the center?', 15, 'm', { equipment: [pan.name], ingredients: [PORK] }));
        s(Timer.set(10, 'm', 'Rest before serving', { equipment: [pan.name], ingredients: [PORK] }));

        return steps;
    })()),

    withPlan(createRecipe(
        'cranberry-sauce-serves-24',
        'Cranberry Sauce (Serves 24, about 9 cups)',
        (() => {
            const pot = e.pot('6-quart pot');
            const steps: Step[] = [];
            const s = (...newSteps: Step[]) => steps.push(...newSteps);

            const CRANBERRIES = i.cranberry(4, u.bag);
            const SUGAR       = i.sugar(4, u.cup);
            const ORANGE_JUICE = i.orangeJuice(2, u.cup);
            const WATER        = i.water(2, u.cup);
            const ZEST        = i.orangeZest(2, u.unit);
            const SALT        = i.seaSalt(0.125, u.tsp);

            s(info('Makes about 9 cups, enough for 24 people. It thickens as it sits, and keeps about 10 days in the fridge.'));
            s(pot.add([
                [CRANBERRIES, '4 bags (12 oz each)'],
                [SUGAR, '4 cups'],
                [ORANGE_JUICE, 'or water if you do not have juice'],
                [WATER, '2 cups'],
                [ZEST, 'zest of 2 oranges'],
                [SALT, 'a pinch'],
            ], 'simmer everything in a big pot'));
            s(instruction('Set the NuWave induction to 215°F and bring everything to a gentle simmer', { equipment: [pot.name], ingredients: [CRANBERRIES, SUGAR, ORANGE_JUICE, WATER, ZEST, SALT] }));
            s(Timer.set(2, 'm', 'Reach a gentle simmer at 215°F', { equipment: [pot.name], ingredients: [CRANBERRIES, SUGAR, ORANGE_JUICE, WATER, ZEST, SALT] }));
            s(Timer.gate('Is the mixture simmering gently (215°F on the NuWave)?', 5, 'm', { equipment: [pot.name], ingredients: [CRANBERRIES, SUGAR, ORANGE_JUICE, WATER, ZEST, SALT] }));
            s(Timer.set(15, 'm', 'Simmer at 215°F until the berries pop - start checking at 10 minutes', { equipment: [pot.name], ingredients: [CRANBERRIES, SUGAR, ORANGE_JUICE, WATER, ZEST, SALT] }));
            s(Timer.gate('Have the berries popped?', 3, 'm', { equipment: [pot.name], ingredients: [CRANBERRIES, SUGAR, ORANGE_JUICE, WATER, ZEST, SALT] }));
            s(Timer.set(30, 'm', 'Let cool until lukewarm or room temperature (about 30 minutes)', { equipment: [pot.name], ingredients: [CRANBERRIES, SUGAR, ORANGE_JUICE, WATER, ZEST, SALT] }));

            return steps;
        })(),
    ), { planMinutes: 15, portable: false, prepMinutes: 30, perishableDays: 10 }),
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
                equipment: ['glass'],
                ingredients: [i.longevityMix(1, u.unit), i.water(8, u.fluidOunce), i.orange(1, u.unit)],
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
        s(instruction(`Strain ${formatIngredient(LENTILS)} through a colander`, { equipment: [pot.name, colander.name], ingredients: [LENTILS] }));
        s(Timer.set(10, 'm', 'Let lentils cool', { ingredients: [LENTILS] }));
        s(Timer.set(10, 'm', 'Portion cooked lentils into thirds (~139g each) into three stainless steel containers', { equipment: [pot.name], ingredients: [LENTILS] }));
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
        s(instruction(`Strain ${formatIngredient(LENTILS)} through a colander`, { equipment: [pot.name, colander.name], ingredients: [LENTILS] }));
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
        s(instruction(`Strain ${formatIngredient(LENTILS)} through a colander`, { equipment: [pot.name, colander.name], ingredients: [LENTILS] }));
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
        s(instruction(`Add ${formatIngredient(WATER)} to pot`, { equipment: [pot.name], ingredients: [WATER] }));
        s(Timer.set(21, 'm', 'Cook lentils', { equipment: [pot.name], ingredients: [LENTILS, WATER] }));
        s(instruction(`Strain ${formatIngredient(LENTILS)} through a colander`, { equipment: [pot.name, colander.name], ingredients: [LENTILS] }));
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

registerRecipe(createRecipe(
    'freeze-bananas',
    'Freeze Bananas',
    (() => {
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);
        const BANANA = i.banana(4, u.unit);
        const bag    = e.siliconeBag();

        s(instruction(`Peel ${formatIngredient(BANANA)}`, { ingredients: [BANANA] }));
        s(instruction('Cut off both ends of each one'));
        s(instruction('Cut each one in half crosswise'));
        s(bag.add([BANANA]));
        s(Timer.set(60, 'm', 'Freeze'));
        s(instruction('Shuffle the pieces around in the bag so they do not stick together', { equipment: [bag.name] }));
        s(instruction('Return the bag to the freezer', { equipment: [bag.name] }));

        return steps;
    })(),
    'Ingredients',
    70,
));

// ============================================================
// TESTING
// ============================================================
// Not a real dish - exercises every step type, equipment method, and
// nutrition/cost edge case in one flow so app changes can be manually smoke
// tested end to end. Hidden from the default Select list; reachable via
// search, "Show hidden recipes", or ?recipe=test-recipe-all-features.
// Timers/gates are kept short (≤10s) - tap 3× rapidly on any of them to skip
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
        const nuwave       = e.pan();
        const cuttingBoard = e.cuttingBoard();
        const platter      = e.platter();

        // requiresDateLabel: true - exercises the auto-inserted put-away/date-label step
        const MACADAMIA_MILK = i.macadamiaNutMilk(1, u.cup);
        // ok nutrition + ok cost, via a chained density conversion (cup → pound → ounce)
        const CARROT_OK      = i.carrot(1, u.cup);
        // uncomputable nutrition: its recipe unit has no conversion to the label's keyed unit
        const CARROT_NO_UNIT = i.carrot(1, u.unit);
        // uncomputable nutrition + cost: recipe unit ("bag") has no conversion path to the label's keyed unit
        const CHICKPEAS_BAG  = i.chickpeas(1, u.bag);
        // missing nutrition + missing cost: no nutrition block, no products at all
        const OIL_SPRAY       = i.avocadoOil(1, u.spray);
        // missing nutrition, but ok cost - exercises the split ok/missing state on one ingredient
        const PEPPER_OZ        = i.blackPepper(1, u.ounce);
        const MUSHROOM         = i.kingOysterMushroom(1, u.unit);

        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);

        s(info('Test recipe - exercises every step type, equipment method, and nutrition/cost edge case. Tap 3× rapidly on any timer/gate to skip it instantly.'));
        s(info('Info steps can link to another recipe.', { linkRecipeId: 'blueprint-smoothie' }));

        s(prepOnly('Prep-only step - only visible on the Prep screen'));
        s(prep('Prep step - visible on both the Prep screen and here'));

        s(bowl.add([MACADAMIA_MILK, CARROT_OK, CARROT_NO_UNIT, CHICKPEAS_BAG, OIL_SPRAY, PEPPER_OZ], 'nutrition/cost edge cases'));
        // Auto-inserted cleanup-label step for MACADAMIA_MILK lands right here.
        s(bowl.mix('test mix result'));
        s(instruction(`Use ${formatIngredient(bowl.result)} (composite ingredient - excluded from the nutrition breakdown)`, {
            ingredients: [bowl.result, i.blueZonesBasilPestoVeggieBowl(0, u.unit)], equipment: [bowl.name],
        }));

        s(oven.preheat(400));    // fixed 15 min duration - tap 3× to skip
        s(nuwave.preheat(325));  // Pan preheat - 45 s at 325° - tap 3× to skip

        s(pan.add([i.oliveOil(1, u.tbsp)]));
        s(cuttingBoard.slice(MUSHROOM));
        s(pan.add([MUSHROOM]));
        // pot gets contents *before* being nested/broiled so the steps below actually exercise
        // place()/broil()'s auto-inheritance of a nested vessel's contents, not an empty snapshot.
        s(pot.add([i.seaSalt(0.25, u.tsp), i.water(8, u.fluidOunce)]));
        s(oven.place(pan, 'Bake test pan', time.seconds(8), 375));
        s(oven.place(pot));  // label/duration-less overload - plain instruction step
        const panTransferred = pan.transfer(mixBowl, [MUSHROOM]);
        s(panTransferred);
        s(...mixBowl.spray(i.avocadoOil(1, u.spray)));
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

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', bootstrap);
}
