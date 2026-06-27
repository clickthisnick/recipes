# Recipe Cooking Assistant — Requirements

## Overview
A single-file TypeScript app that lets a user select recipes, view a shopping list, review nutrition, and walk through cooking steps interactively. It runs in the browser with no frameworks.

---

## Screens
There are five screens: Select, Shopping, Nutrition, Cooking, and Add Ingredient. Navigation is handled by a simple state machine — no URLs.

### Select Screen
- Shows a searchable list of all registered recipes, with a **Bundles** section pinned above all recipe groups
- Recipes can be grouped under category headings (e.g. Breakfast, Dinner). Ad-hoc additions appear in a dedicated "Custom additions" group at the top
- Each non-adhoc recipe row shows a static ★ indicator if the recipe is in `FAVORITE_RECIPE_IDS`; otherwise a transparent spacer preserves column alignment. Favorites are pinned above non-favorites (below ad-hoc additions). **Favorites are set at build time** in the `FAVORITE_RECIPE_IDS` const — there is no runtime toggle
- Tapping a recipe row **adds one serving**. Tapping the same row again adds another serving; the same recipe can be selected any number of times. The button stays green while ≥ 1 serving is selected and shows a `×N` badge when N > 1
- A `−` button appears next to selected recipes to remove one serving at a time. It's hidden (but reserves space) when count is 0 to keep the row layout stable
- Real recipes get a 🔗 copy-link button on the right; ad-hoc rows get an `×` remove button instead (drops all servings and unregisters the synthetic recipe)
- A "+ Add an ingredient" button at the bottom opens the Add Ingredient screen for one-off shopping/nutrition entries

#### Bundles
A bundle is a named collection of recipe IDs that can be added to the selection in a single tap. Bundles appear in a "Bundles" section at the very top of the recipe list (hidden when searching). Each bundle renders as a blue card showing the bundle name and a muted sub-line listing the constituent recipe names.

Clicking a bundle pushes all its `recipeIds` into `selectedRecipeIds` exactly as if each recipe had been tapped individually — servings stack and the `−` controls on individual recipe rows handle removal. A recipe ID can appear more than once in a bundle's `recipeIds` list to add multiple servings at once.

To register a bundle:
```ts
registerBundle({ id: 'my-bundle', name: 'My Bundle', recipeIds: ['recipe-a', 'recipe-b', 'recipe-b'] });
```

Bundles are build-time configuration — there is no runtime UI to create or edit them.
- A fixed bottom bar appears when any serving is selected, with up to three buttons: "Go Shopping", "Nutrition", and "Start Cooking". "Start Cooking" is hidden when only ad-hoc items are selected (nothing to cook)
- Tapping "Start Cooking" navigates directly to the cooking screen with no intermediate panel

#### Serving counts vs. cooking flow
Selecting the same recipe N times means **N servings**, not N parallel cooks. The model differs by screen:
- **Cooking** deduplicates to unique recipes — you cook one batch (potentially scaled up by you in real life). This avoids duplicate `step-N` DOM IDs and conflicting equipment claims. Ad-hoc recipes are also filtered out
- **Shopping** multiplies each ingredient quantity by the serving count so the list reflects what to actually buy
- **Nutrition** multiplies each ingredient's nutrition by the serving count — the screen shows what you'll actually consume

### Shopping Screen
- Shows a consolidated ingredient list across all selected recipes, summing quantities of ingredients that share the same name and unit
- For each recipe: ingredient quantities are first deduped by **object reference** (so the same ingredient object referenced across steps, children, and mix contents is counted once), then scaled by that recipe's serving count, then summed across recipes by name+unit
- Composites produced by `mix()` / `combine()` are excluded — their constituents are already counted individually
- Each ingredient row can be tapped to mark it as completed (strikethrough/green)
- If an ingredient has `products`, each is shown as a tappable URL. Products are **sorted ascending by price per volume** (products with no price data sort last). Format: `Brand Variant · Store — $price / size unit ($X.XX/unit) · S&S $price ($X.XX/unit)`. The S&S price and its per-volume rate are shown when `discount.subscribeAndSave` is set. The selected default (the one whose label drives nutrition) is rendered in green with a `✓` suffix
- A "Start Over" button returns to the Select screen and resets all state

### Nutrition Screen
A reference screen — separate from cooking, since nutrition data is something you study before shopping, not mid-cook. It presents three levels of drill-down in a single scrollable accordion:

```
┌─────────────────────────────────────────┐
│  Grand total (pinned)                   │
│  $X.XX · All selected recipes · X cal · …
│  partial-cost note (amber, if applicable)
│  coverage line (amber if anything flagged)
├─────────────────────────────────────────┤
│  ▸ Recipe A      $X.XX · recipe subtotal│   ← tap header to expand
│  ▾ Recipe B      $X.XX · recipe subtotal│
│      • Ingredient — X cal … · $X.XX    │
│      • Ingredient — ⚠ no nutrition data │
│           ⚠ no price data               │
│      • Ingredient — ⚠ can't compute     │
│           reason text…                  │
└─────────────────────────────────────────┘
```

- **Grand total** — a card at the top sums every selected recipe, scaled by each recipe's serving count. Title varies by selection shape:
  - 1 recipe × 1 serving → the recipe's name
  - 1 recipe × N servings (N > 1) → `Recipe Name ×N`
  - Multiple recipes → `All selected recipes (N servings)` where N is the total servings across all recipes
- **Per recipe** — each recipe is a collapsible section showing its subtotal (scaled by serving count) in the header; the header name shows `×N` when N > 1. Tapping the header toggles its ingredient breakdown (collapsed by default; a `▸`/`▾` caret reflects state). Inside the breakdown, the ingredient name's displayed quantity and the per-ingredient values are also scaled by N. Each recipe header also has inline `−` / `+` serving controls so servings can be adjusted without leaving the nutrition screen
- **Per ingredient** — each ingredient row inside an expanded section shows its computed nutrition contribution with cost appended, or appropriate flags (see below)
- Totals shown are calories, fat (g), saturated fat (g), trans fat (g), cholesterol (mg), carbs (g), sodium (mg), sugar (g), fiber (g), and protein (g), rounded to whole numbers. Cost is shown as `$X.XX` to two decimal places
- If a recipe (or the grand total) has **no** computable ingredients, the value line shows `— no computable data` instead of a row of zeros
- A "Start Over" button at the bottom resets everything. If no recipes are selected, the screen shows an empty message and the Start Over button

#### 30-day cost projection
The grand total card shows a `$X.XX / 30 days` line beneath the cost total, computed as `grandTotal.cost × 30`. Useful for evaluating whether a daily eating pattern is sustainable month-to-month. Only shown when at least one ingredient has cost data.

#### Recipe suggestions
Below the grand total, a **Recipe Suggestions** panel scores every registered recipe against the remaining macro budget and shows the top 3 closest matches with a `+ Add` button to select them without leaving the Nutrition screen.

Scoring algorithm (per recipe):
- Compute fill ratio for each of calories (weight 0.4), protein (0.3), fat (0.15), carbs (0.15), where `fillRatio = min(recipeValue / remaining, 1)`
- Weighted sum of fill ratios → raw score
- Penalty multipliers: `×0.7` if recipe sodium exceeds remaining sodium budget; `×0.8` if recipe sat fat exceeds remaining sat fat cap
- Top 3 non-zero scores are shown with their name, calories, and protein

#### Cost display
Cost is shown inline with nutrition wherever data is available, using the format:

```
$X.XX · N cal · N mg sodium · N g sugar · N g protein
```

- **Grand total** — shows cost prepended when at least one ingredient has price data. If some ingredients lack price data a partial-cost note appears below the value line: `⚠ cost is partial — N ingredient(s) missing price data`
- **Per recipe header** — same format: cost prepended when available
- **Per ingredient row** — cost appended to the nutrition line as ` · $X.XX` when both nutrition and cost are computable. If nutrition is ok but cost is not, a small flag appears on a sub-line: `⚠ no price data` or `⚠ cost can't compute — reason`
- Cost is **never** shown when zero ingredients have price data (no misleading $0.00)

#### Flagging missing / uncomputable nutrition
Every ingredient falls into exactly one of three buckets so a subtotal is never silently built from partial data:

- **ok** — the ingredient has a `nutrition` block **and** the recipe's unit can be matched to a keyed unit (either directly or via unit conversion). Shows the computed `X cal · Y mg sodium · …` contribution.
- **missing** — the ingredient has no `nutrition` block at all. Flagged inline with an amber pill: `⚠ no nutrition data`.
- **uncomputable** — the ingredient **has** a `nutrition` block, but it can't be applied here. Flagged with `⚠ can't compute` plus an italic reason line beneath it. Reasons:
  - The recipe uses a unit the data isn't keyed by **and no conversion path exists** — e.g. `recipe uses "handful" but data is keyed by "cup" (no conversion path)`
  - The ingredient has no unit at all
  - The serving size is missing or zero

Flagged ingredients are **excluded** from the recipe and grand totals — they contribute nothing rather than a misleading zero.

#### Coverage line
Both the grand total and each recipe section carry a coverage line summarising data completeness, and it turns amber whenever anything is flagged:
- All good: `All N ingredients have data`
- Some flagged: `⚠ C of N ingredients have data · F flagged`
- No ingredients: `No ingredients`

#### Composite ingredients
Ingredients produced by `mix(resultName)` / `combine()` carry a `_constituents` array and are roll-ups of real ingredients that are already counted individually. They are **excluded** from the nutrition breakdown to avoid double counting and to prevent noisy false "missing" flags on synthetic items like `"batter"`.

#### Ingredient identity for nutrition
Unlike the shopping list (which dedupes by name+unit string), the nutrition breakdown dedupes by **object reference**, consistent with the rest of the app's object-identity model. The same ingredient object referenced across multiple steps is counted exactly once.

### Add Ingredient Screen
A picker that lets the user add a one-off ingredient to the active session without going through a recipe — useful for adding things to the shopping list ("I also need a banana this week") or for tracking nutrition of items eaten on their own.

Opened by the "+ Add an ingredient" button at the bottom of the Select screen.

Flow:
1. Search field filters the registered ingredient catalog (every entry in `i`) by name substring
2. Tap an ingredient to select it; the row turns green
3. Quantity input (number, defaults to 1, supports decimals) and unit dropdown (all units in `u`) appear below
4. Default unit is inferred from the selected ingredient's nutrition keys — if it has nutrition data keyed by `'cup'`, the picker preselects `cup`. Falls back to `unit` when there's no hint
5. "Add to list" creates a synthetic recipe via `createAdhocRecipe()`, registers it, selects one serving, and returns to the Select screen
6. "← Back" cancels and clears any picker state

The picker only offers ingredients already declared in `i`. There's no "create new" path — adding a completely unknown ingredient isn't supported (would require ad-hoc name input, no nutrition, etc.).

#### Ad-hoc recipes
A one-off ingredient is wrapped into a synthetic `Recipe` with:
- `id`: `adhoc:<name>:<timestamp>-<random>` — unique per call, so adding the same ingredient twice produces two recipes you can adjust independently
- `name`: the formatted ingredient string (e.g. `1 cup Macadamia Nut Milk`)
- `group`: `'Custom additions'` — surfaces them in a dedicated section on the recipe list
- `steps`: one `instruction("Have {ingredient} on hand")` carrying the ingredient — the fiction is intentional, so the existing step-walking pipelines in `buildShoppingList` and `recipeNutrition` find the ingredient without parallel codepaths
- `adhoc: true` — flag used to skip the cook flow and customize the UI

Recipe-list behavior for ad-hoc rows:
- Float to the top, above favorites and regular recipes
- No star indicator (favoriting one-offs is noise) and no copy-link (the synthetic ID won't survive a page reload, so a shareable URL is meaningless) — a spacer preserves column alignment
- Show an `×` remove button in place of the copy button — drops all servings AND unregisters the recipe so it disappears from the list
- Same `×N` badge and `−` controls as real recipes for serving counts

How ad-hoc recipes interact with each screen:
- **Shopping** — quantities flow through `buildShoppingList` and merge with any matching recipe ingredients by name+unit
- **Nutrition** — appears as its own collapsible section (one ingredient row), scales by serving count, contributes to the grand total
- **Cooking** — filtered out via `r.adhoc` check in `renderCookingScreen`; the "Start Cooking" button is hidden entirely when only ad-hoc items are selected (nothing to cook)

#### Lifecycle
Ad-hoc recipes are session-only:
- Cleared when the user taps "× Remove" on the row, or "Start Over" anywhere
- Not persisted across page reloads (the rest of the app has no persistence either)
- Don't survive a hard refresh — including any deep-link `?recipe=adhoc:...` URL, which won't resolve and falls back to the Select screen

### Cooking Screen
- Shows all steps from all selected recipes split into two zones: **Ready** (top) and **Waiting** (bottom)
- Steps the user can act on immediately — those with no `waitForIds`, or whose waited-on steps are already done — appear in the **Ready** zone at the top
- Steps that are still locked appear in the **Waiting** zone below, separated by a muted "⏳ Waiting on timers" label and a divider line
- When a locked step unlocks, it flashes green and is physically moved from the Waiting zone into the Ready zone at its correct authored position
- Promoted panels are inserted in authored order using `data-step-index`; completed/skipped panels are treated as pinned (index −1) and never jumped over
- Container child panels are never independently promoted — only the parent container moves
- The Waiting zone is hidden entirely if there are no locked steps
- Recipe title headings always appear in the Ready zone, above the first step of their recipe
- Each recipe title heading shows a live badge, updating every second:
  - If a hardcoded `estimatedMinutes` is set: `estimated 20 min (14m 32s calculated) · actual 4m 32s`
    - Shows the user's hardcoded target, followed by the calculated critical path in parentheses
  - If no hardcoded estimate: `estimated 14m 32s · actual 4m 32s`
    - Shows only the calculated critical path time
  - "actual" is wall-clock time elapsed since the cooking screen was first entered
  - The actual timer stops ticking when all step cards have been completed or skipped
  - The elapsed time resets on Start Over
- If multiple recipes are selected, a muted banner at the top shows total time:
  - If any recipes have hardcoded estimates: `Total: 45 min goal (52m 14s calculated)`
  - If no hardcoded estimates: `Total cook time: 52m 14s`
- Steps are rendered as tappable cards
- A "Start Over" button at the bottom resets everything

---

## URL Routing

You can link directly to a recipe using a query parameter: `?recipe=recipe-id`

**Example:** `https://yourapp.com/cooking?recipe=blueprint-smoothie`

When a recipe ID is provided in the URL:
1. The recipe is automatically selected
2. The audio context is unlocked silently (same as when manually selecting a recipe)
3. The app navigates directly to the Cooking screen and begins immediately
4. If the recipe ID doesn't match any registered recipe, the app displays the Select screen normally

### Copy to Clipboard

Both the Select and Cooking screens display a link icon (🔗) next to each recipe that allows you to copy the recipe's shareable URL:

- **Select Screen** — Click the 🔗 button on any recipe row to copy its link
- **Cooking Screen** — Click the 🔗 button next to the recipe title to copy its link
- The button briefly changes to ✓ after copying to confirm the action
- The copied link is ready to paste and share with others

---

## Step Types

- **Instruction** — tap to dismiss (card disappears). Used for all active hands-on steps: prep, cleanup, notes, transfers, flips, sprays, slices, combines.
- **Cleanup** — same as instruction, tap to dismiss
- **Timer** — tap once to start countdown, tap 3× rapidly to skip. Shows MM:SS countdown while running. On completion plays a sound and marks the card green with a timestamp. On skip marks it grey with strikethrough and timestamp. **Before being tapped**, a small amber duration badge is shown on the right of the card (e.g. `15m`, `1h 30m`, `45s`) so the user can see how long the timer will run before starting it. The badge is hidden once the countdown begins.
- **Container** — a step with child ingredient steps nested inside it. The header shows the action (e.g. "Add to batter bowl"). Each child is its own tappable row. When all children are dismissed the container disappears.

---

## Locking System

A step "claims" its equipment and ingredients when it is a timer **or** when it has `waitForIds` set. Any subsequent step that references the same equipment (by name) or the same ingredient (by object reference) is locked — rendered dimmed with a red left border and a "⏳ waiting…" pill — and cannot be tapped until all blocking steps are done.

### Claim keys
- Equipment claims are keyed by `"recipeId::eq::equipmentName"` — equipment is identified by name, so a named vessel like `"panko pan"` is distinct from `"pan"`
- Ingredient claims are keyed by **object reference**, not by name — two calls to `i.avocadoOil()` produce separate objects and are treated as independent instances with no shared claim

### Propagation
- Claims propagate transitively: if step B is locked (has `waitForIds`), it also creates claims on its equipment and ingredients. Any step C that shares equipment or ingredients with B will automatically wait for B without needing an explicit `waitFor()` declaration.
- This means a single `waitFor()` at the head of a dependency chain locks all downstream steps that share the same resources.

### Manual dependencies
- `step.waitFor(...steps)` is a fluent method on `Step` that appends to `waitForIds` and returns `this`
- Used for culinary constraints that can't be derived from code logic — e.g. "don't dip mushrooms until panko is in the bowl"
- `buildCookingPlan` preserves manual `waitForIds` set via `waitFor()` before clearing derived ones, then merges both into the final `waitForIds`

### Unlock behaviour
- A locked step watches the DOM via `MutationObserver` (observing `childList`, `subtree`, and `class` attribute changes)
- It unlocks when every waited-on step element is either absent from the DOM or has the `.completed` or `.skipped` class — covering both timer completion and instruction dismissal
- On unlock: flashes green for 800 ms, then `promotePanelToReady()` moves it to the Ready zone at its authored position

### Recipe scoping
- Two recipes using the same equipment name are treated as separate lanes because equipment claims are scoped by `recipeId`

---

## Cooking Layout — Actionable Steps First

```
┌─────────────────────────────────────────┐
│  #ready-section                         │
│  Recipe title headings + all steps      │
│  that are currently actionable          │
├─────────────────────────────────────────┤
│  #waiting-section  (hidden if empty)    │
│  ⏳ Waiting on timers  ← muted label    │
│  Steps that are still locked            │
└─────────────────────────────────────────┘
```

- Each step panel is rendered once, assigned a `data-step-index` (its position in `cookingPlanSteps`), and placed in the appropriate zone
- Panels are never re-rendered — they are physically moved via DOM insertion
- `promotePanelToReady(panel)` inserts at the correct authored position by finding the first non-completed/skipped panel with a higher `data-step-index`
- Child panels inside `.container-children` are never independently promoted

---

## Cook Time Estimation
- The app always calculates the critical-path time automatically from timer steps
- Optionally, you can provide a hardcoded `estimatedMinutes` when defining a recipe (your personal estimate of how long it will take)
- Both times are shown together in the UI so you can compare your goal vs. the calculated estimate:
  - Hardcoded estimate appears as the primary "estimated" time
  - Calculated time appears in parentheses as a reference: `estimated 20 min (14m 32s calculated)`
  - If no hardcoded estimate is provided, only the calculated time shows: `estimated 14m 32s`
- Critical-path calculation: Walk steps in authored order. Maintain a map of claim key → wall-clock time the resource is free. Each timer starts at the max release time of its claimed keys (paths converge), then pushes those keys' release times forward by its duration (paths diverge). Total time is the maximum end time.
- Format: `X hr Y min` if ≥ 3600 s (omit minutes if zero); `X min` (rounded up) if < 3600 s

---

## Unit Conversion

A two-cluster conversion graph allows nutrition and cost calculations to match recipe units against label or package units automatically. No conversion is performed across clusters (volume↔weight requires density, which is substance-dependent).

**Volume cluster:** `tsp ↔ tbsp ↔ cup ↔ fl oz`
**Weight cluster:** `oz ↔ lb`

`convertUnits(quantity, from, to)` returns the converted quantity, or `null` if no path exists (different clusters, or an unmapped unit like `unit` / `handful`). Both nutrition and cost resolution call this before declaring an ingredient `uncomputable`.

---

## Nutrition Calculation

The app computes nutrition for the currently selected recipes at three levels: per ingredient, per recipe, and a grand total across all selected recipes.

### Reading a nutrition block
An ingredient's `nutrition` is keyed by **unit name**, with each entry read as a standard nutrition label:
```ts
nutrition: {
    'fl oz': { servings: 8, servingSize: 7, calories: 110, fat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, carbs: 26, sodium: 0, sugar: 22, protein: 2, fiber: 0 },
}
```
- `servingSize` — number of (keyed) units in one serving
- All macro fields (`calories`, `fat`, `saturatedFat`, `transFat`, `cholesterol`, `carbs`, `sodium`, `sugar`, `protein`, `fiber`) are **required** — no `?` optional. The `NutritionLabel` type enforces this at compile time. A label entry is either absent (ingredient has no `nutrition`) or fully filled out
- `servings` — servings per container (metadata; not used in the per-recipe computation)

#### Daily Targets panel
Below the grand total on the Nutrition screen, a **Daily Targets** panel shows a row for each tracked macro. Each row has a user-editable target input, an "Eaten" column (computed from the current selection), and a "Remaining" column that updates live when the target is changed.

Tracked macros and their default targets:
| Macro | Default | Unit | Direction |
|---|---|---|---|
| Calories | 2550 | kcal | reach target |
| Protein | 147 | g (~23%) | reach target |
| Fat (total) | 114 | g (~40%) | reach target |
| ↳ Sat Fat | 20 | g | stay under (cap) |
| ↳ Trans Fat | 0 | g | stay under (cap) |
| Carbs | 234 | g (~37%) | reach target |
| Sodium | 2300 | mg | stay under (cap) |

"Cap" macros (sat fat, trans fat, sodium) use reversed colour coding: remaining shows neutral until the cap is exceeded, at which point it turns red and shows "X over". "Reach" macros turn green when the target is met or exceeded.

The Eaten column for Protein, Fat, and Carbs shows two percentages:
- Calorie % — what share of total calories eaten comes from that macro (e.g. `(protein_g × 4 / total_cal) × 100`)
- Gram distribution % — that macro's share of the combined protein+fat+carbs gram total (e.g. 1g each → 33% each)

Format: `Xg (Y% cal) / Z%`

### Brand-aware nutrition resolution
Nutrition is brand-specific (a Milkadamia label is not a Califia label), so the value used for each ingredient comes from the **selected product's** label when one exists. Resolution order:
1. The ingredient's `selectedProduct` (the entry in `products[]` matching `defaultBrand`, falling back to the first product). If it has `nutrition` → use that label.
2. Else the ingredient's own `nutrition` block (used for brand-independent items like produce — celery, banana).
3. Else flagged as `missing`.

Nutrition is never blended across brands — a dish contains one carton of one product, and the calculation mirrors that.

When the numbers come from a product, the Nutrition screen renders a muted **"via {brand} · {variant}"** provenance line under that ingredient row.

### Per-ingredient computation
Given a recipe ingredient with `quantity` and `unit`:
1. Resolve the nutrition label (per the order above).
2. Look up `label[unit.name]`. If absent, attempt unit conversion into each keyed unit via `convertUnits()`. First match wins.
3. If no match after conversion attempts → **uncomputable** (no conversion path).
4. `servingsUsed = convertedQty / servingSize` (if `servingSize` ≤ 0 → **uncomputable**).
5. Each nutrient = its per-serving value × `servingsUsed`.

So 14 fl oz of the orange juice above = 2 servings = 220 cal, 44 g sugar, etc. And 1 tbsp of hemp seed resolves against a `tbsp`-keyed label directly; 0.25 cup of macadamia nuts could resolve against a `cup`-keyed label directly or via conversion from `tbsp` if the label were keyed differently.

### Aggregation rules
- Walk all steps (and children) of a recipe, collecting distinct ingredient **objects** (reference dedup).
- Exclude composite ingredients (those carrying `_constituents` from `mix()`/`combine()`).
- Sum only **ok** ingredients into totals; **missing** and **uncomputable** ingredients contribute nothing and are counted toward the flagged total.
- The grand total sums the per-recipe totals and coverage counts.

### Three result states
| State | Condition | UI |
|---|---|---|
| `ok` | has data + unit matches or converts | shows computed contribution; brand provenance shown when from a product |
| `missing` | no `nutrition` block (neither on selected product nor ingredient) | `⚠ no nutrition data` pill |
| `uncomputable` | has data but can't apply (no conversion path / no unit / bad serving size) | `⚠ can't compute` pill + reason text |

> **Note:** The entire **Blueprint Smoothie** carries nutrition data and reports full coverage (~568 cal · 145 mg sodium · 28 g sugar · 12 g protein). Seven of its ingredients are packaged goods whose nutrition comes from a selected brand (Milkadamia macadamia milk, 365 macadamia nuts / chia / berry blend / vanilla, Navitas cacao nibs, Manitoba Harvest hemp hearts); the other six are produce (lemon, cherry, celery, spinach, kale, banana) with nutrition on the ingredient itself. The Dinner recipes don't yet carry nutrition data and flag as `missing` until labels are added.

---

## Cost Calculation

Cost is computed alongside nutrition in `recipeNutrition()` and displayed inline with nutrition on the Nutrition screen.

### Per-ingredient cost
Given a recipe ingredient with `quantity` and `unit`, and a selected product with `price`, `size`, and `sizeUnit`:
1. `pricePerUnit = product.price / product.size`
2. Convert recipe quantity into package units via `convertUnits(qty, recipeUnit, packageUnit)`. If recipe unit already matches package unit, no conversion needed.
3. `cost = pricePerUnit × convertedQty`

Falls into the same three-state model as nutrition:
- **ok** — product has price/size/sizeUnit and unit converts successfully
- **missing** — no selected product, or product lacks `price`, `size`, or `sizeUnit`
- **uncomputable** — product has price data but recipe unit can't be converted to package unit (no conversion path)

### Coverage
`costMissing` counts ingredients whose cost is not `ok` (missing or uncomputable). When `costMissing > 0` but some ingredients do have price data, a partial-cost note is shown on the grand total and recipe headers.

---

## Favorites

Favorites are **build-time configuration**, not a runtime toggle. There is no persistent storage, so a runtime favorite toggle would reset on every page load.

To mark recipes as favorites, edit the `FAVORITE_RECIPE_IDS` const near the top of the file:

```ts
const FAVORITE_RECIPE_IDS: string[] = [
    'blueprint-smoothie',
];
```

Favorited recipes are sorted above non-favorites (but below ad-hoc additions) in the Select screen. Non-favorite non-adhoc recipes show an invisible spacer in the star column to keep row alignment. Favorite recipes show a static gold ★.

---

## Step Factories

- `instruction(text, opts?)` → creates an instruction step
- `timerStep(label, durationSeconds, opts?)` → creates a timer step
- `Timer.set(amount, unit, label)` → creates an inline timer step (unit: `'s'`, `'m'`, `'h'`)
- `cleanup(equipmentName)` → creates a cleanup step `"Clean and put away {equipmentName}"`
- `generateCleanupLabels(ingredients, customTexts?)` → creates instruction steps for ingredients that need date labels
  - Filters `ingredients[]` for those with `requiresDateLabel: true`
  - Default text: `"Write today's date on the {ingredient name} bottle with a Sharpie"`
  - Optional `customTexts` object to override text per ingredient: `{ 'Macadamia Nut Milk': 'Label with today\'s date' }`
  - Returns an array of `Step[]`
  - **Note:** This function is called automatically when a recipe is created — you typically don't need to call it manually. See [Automatic Cleanup Labels](#automatic-cleanup-labels) below.

### Automatic Cleanup Labels

When a recipe is created via `createRecipe()`, the system automatically:
1. Scans all steps and collects every ingredient with `requiresDateLabel: true`
2. For each ingredient, finds the **last step that uses it**
3. Generates a cleanup/put-away instruction step with default text
4. Inserts it **immediately after** the last step that references that ingredient

This way, the put-away reminder appears right when you no longer need the ingredient—at the moment you're done using it and should label and store it.

Example: If Macadamia Nut Milk (with `requiresDateLabel: true`) is first used in an `add()` step:
```
Step 1: Add Macadamia Nut Milk to mixer
Step 2: [Put away step auto-inserted] "Write today's date on the Macadamia Nut Milk bottle with a Sharpie"
Step 3: Mix
...
```

No manual work needed—just use ingredients with `requiresDateLabel: true` and the put-away steps are automatically positioned after their last use.

---

## Equipment

Equipment instances are created via factory functions. All factories accept an optional `label` string to distinguish multiple instances of the same type:

```ts
const pankoPan = e.pan('panko pan');   // claim key: "recipeId::eq::panko pan"
const saucePan = e.pan('sauce pan');   // claim key: "recipeId::eq::sauce pan"
const plainPan = e.pan();              // claim key: "recipeId::eq::pan"
```

Available factories: `e.bowl()`, `e.pan()`, `e.pot()`, `e.oven()`, `e.toasterOven()`, `e.instantPot()`, `e.bulletMixer()`, `e.knife()`, `e.cuttingBoard()`.

### Contents tracking
Each `Equipment` instance tracks its current `contents: Ingredient[]`, updated by `add()`, `transfer()`, `mix()`, and `combine()`. `cook()` and `broil()` automatically inherit the contents of nested vessels (registered via `place()`) so downstream steps are locked correctly without manual ingredient listing.

### `result` getter
`mix()` and `combine()` produce a new `Ingredient` representing the combined state of the vessel. Access it via `vessel.result` immediately after the call. Throws if accessed before any `mix()` or `combine()` call. Note these produced ingredients carry a `_constituents` array and are treated as composites — excluded from the nutrition breakdown (their constituents are counted individually).

### Methods

- `.preheat(temp)` → timer step `"Preheat {name} to {temp}°"`, 15 minutes
- `.cook(label, duration, temperature?, extraEquipment?)` → timer step. Automatically claims this vessel, all nested vessels (placed via `.place()`), and all their contents. `extraEquipment` adds additional vessels not yet nested.
- `.broil(label, duration)` → timer step `"Broil — {label}"`. Same auto-inheritance as `.cook()`.
- `.place(vessel, label?, duration?, temperature?)` → registers `vessel` as nested inside this one. Without `label`/`duration` produces an instruction step `"Place {vessel} in {this}"`. With both, produces a timer step combining placement and cooking into one card.
- `.add(ingredients[], note?)` → container step with one child per ingredient. Appends ingredients to this vessel's contents.
- `.transfer(target, ingredients[])` → instruction step `"Transfer {ingredients} from {this} to {target}"`. Validates at recipe-definition time that all ingredients are present in this vessel (throws a descriptive error if not). Removes them from this vessel's contents and adds them to the target.
- `.combine(ingredients[], note?)` → instruction step. Applies this vessel's contents to the given ingredients, producing a new combined ingredient. Vessel contents are replaced with the combined result. Access via `.result`.
- `.mix(resultName?)` → instruction step `"Mix {name}"`. If `resultName` is provided, replaces vessel contents with a single named ingredient. Access via `.result`.
- `.slice(ingredient)` → instruction step `"Slice {ingredient.name}"`, claims equipment and ingredient
- `.spray(ingredient)` → instruction step `"Spray {ingredient.name} on {name}"`, claims equipment and ingredient
- `.flip()` → instruction step `"Flip contents of {name}"`, claims equipment and current contents
- `.stir()` → instruction step

### `transfer()` validation
`transfer()` runs at recipe-definition time (when the IIFE executes on module load). If the ingredient is not in the source vessel it throws immediately with a message like:
```
transfer() from 'panko pan' to 'panko bowl': 'Panko Bread Crumbs' is not in panko pan. Contents: [empty]
```
This is caught by `validate-recipes.ts` before serving.

---

## Recipe Authoring Pattern

All recipes use an **imperative IIFE** pattern. This is required (not optional) — it ensures consistent style and allows side-effect calls like `rename()` between steps without TypeScript errors:

```ts
createRecipe(
    'my-recipe',
    'My Recipe',
    (() => {
        const pan  = e.pan();
        const bowl = e.bowl();
        const steps: Step[] = [];
        const s = (...newSteps: Step[]) => steps.push(...newSteps);

        s(bowl.add([i.egg(3, u.unit)]));
        s(bowl.mix());
        s(pan.cook('Cook eggs', time.minutes(5)));

        return steps;
    })(),
    undefined,  // group (optional)
    12          // estimatedMinutes (optional)
),
```

- Named equipment (`const pan = e.pan('panko pan')`) is declared as local `const` inside the IIFE so it can be reused across multiple steps
- Ingredient constants (e.g. `const PANKO = i.pankoBreadCrumbs(3, u.cup)`) are declared as local `const` when the same object reference must be shared across steps — this prevents shopping list double-counting and enables object-identity locking
- `rename()` on an ingredient is called between `s()` calls (not inside the array) since it returns `void`
- The lane with the most total timer time should be authored first to minimise the impact of tap latency
- The optional `estimatedMinutes` parameter allows you to specify a hardcoded time estimate. If not provided, the critical-path algorithm is used instead.

---

## Ingredients

Ingredient factory functions `(quantity, unit) => Ingredient`. Each call produces a new object — two calls to `i.avocadoOil()` are independent instances.

The display name (`name`) is generic — "Macadamia Nut Milk", not "Milkadamia" — so the steps and shopping list stay brand-neutral. Brand identity, purchase info, and nutrition labels all live on `Product` entries attached to the ingredient.

Optional metadata:
- `products` — an array of `Product` entries; each is a specific SKU with brand, optional store/link/price/size, and an optional `nutrition` label
- `defaultBrand` — the brand string of the selected product. Its label drives nutrition; it's marked as the pick (`✓`) on the shopping list. If unset, the first product is used
- `nutrition` — an ingredient-level label, used for brand-independent items like produce (celery, banana). Ignored when a selected product carries its own `nutrition`
- `perishableDays`, `isMeatProduct`
- `requiresDateLabel` — if `true`, automatically adds an instruction child step to any `.add()` call using this ingredient, asking the user to write today's date on the bottle with a Sharpie (useful for tracking expiration)

### `Product`
```ts
{ brand: string;       // e.g. 'Milkadamia', '365'
  variant?: string;    // 'Unsweetened', 'Organic Raw'
  store?: string;
  link?: string;
  price?: number;
  size?: number;       // package size
  sizeUnit?: Unit;     // package unit
  organic?: boolean;
  discount?: Record<string, number>;
  nutrition?: NutritionLabel; }   // keyed by unit name
```

This single type replaces the older split between `purchaseLinks` and ingredient-level `nutrition`. Brand identity lives in one place; the Shopping screen reads from `products[]` and the Nutrition screen reads from the selected product's label.

### Brand selection model
- The default brand is set on the ingredient factory (`defaultBrand: 'Milkadamia'`), so every call to `i.macadamiaNutMilk()` is pre-pointed at that brand
- A recipe can override per use by setting `products`/`defaultBrand` on the returned ingredient instance — defaults are per ingredient, swappable per recipe
- Resolution for nutrition: selected product's `nutrition` → ingredient's own `nutrition` → flagged `missing`/`uncomputable` as before
- Nutrition is **never** blended across brands — one brand is in the dish, so one label is used

### `rename(newName)`
A method on `Ingredient` that silently mutates the display name — no step card is produced. Used when an ingredient changes state mid-recipe (e.g. raw mushrooms → breaded mushrooms). All subsequent steps that reference the same object will use the new name.

### Ingredient-specific density conversions
When a recipe uses a unit (e.g. `cup`) but the product is packaged in a different unit (e.g. `oz`), a `conversions` map on the ingredient bridges the gap for cost calculation:

```ts
conversions: {
    [u.cup.name]: { to: u.ounce, factor: 8.93 },  // 1 cup → 8.93 oz
}
```

This is distinct from the global unit-conversion graph (which only handles within-cluster conversions like tsp↔cup or oz↔lb). Ingredient-specific conversions handle density / packaging mismatches that are substance-dependent — e.g. cherry (unit→cup, ~15 cherries/cup), cannellini beans (cup→oz, 8.93 oz/cup), edamame (cup→oz, 5.3 oz/cup), carrot (cup→lb, 0.24 lb/cup).

### `simpleIngredients()` helper
Bulk-declares ingredients with no metadata. Auto-derives display names from camelCase keys — e.g. `kingOysterMushroom` → `"King Oyster Mushroom"`. An explicit string is only needed when the auto-derived form is wrong.

---

## Units
Supported: none, cup, tbsp, tsp, ounce, pound, fl oz, unit, handful, spray, bag.

Quantities are formatted with unicode fractions (¼, ½, ¾, etc.) where applicable.

---

## Time Helpers
`time.seconds(n)`, `time.minutes(n)`, `time.hours(n)` — all return a number of seconds.

`Timer.set(amount, unit, label)` creates an inline timer step without equipment context. Units: `'s'`, `'m'`, `'h'`.

---

## Stores
Named constants for Amazon, Amazon Fresh, Whole Foods — used as the `store` field on `Product` entries.

---

## Styling
Dark theme (`#111` background, `#f0f0f0` text). Large touch-friendly cards (font-size 22px, padding 20px). All styles injected as a `<style>` tag at bootstrap time — no external CSS file.

Key visual states:
- Selected recipe: green background
- Favorite recipe: static gold ★ (non-interactive)
- Active timer: amber/yellow card
- Completed timer: green card with ✓ and timestamp
- Skipped timer: grey card with strikethrough and timestamp
- Locked step: 45% opacity, red left border, "⏳ waiting…" pill
- Unlock flash: green border/background animation (800 ms), then panel moves to Ready zone at authored position
- Recipe title: name + `estimated X min · actual Xm XXs` badge (muted colour, updates every second, freezes when all steps done)
- Ready zone (`#ready-section`): no decoration, appears at top
- Waiting zone (`#waiting-section`): top border + muted label; hidden when empty; completed/skipped panels are pinned and never jumped over by promoted panels
- Action bar: three buttons — Go Shopping (blue), Nutrition (purple), Start Cooking (green)
- Nutrition grand-total card: dark inset card, muted uppercase title; cost prepended when available
- Nutrition recipe section: collapsible, `▸`/`▾` caret, cost + subtotal on the right of the header
- Nutrition ingredient row: `X cal · … · $X.XX` when both nutrition and cost are ok; cost flag sub-line (`⚠ no price data`) when nutrition ok but cost missing
- Nutrition flag pill: amber pill (`⚠ no nutrition data` / `⚠ can't compute`); coverage line turns amber whenever anything is flagged; uncomputable rows show an italic amber reason line beneath
- Nutrition provenance: muted italic "via {brand} · {variant}" under any ingredient row whose numbers came from a selected product
- Nutrition partial-cost note: amber italic note below grand-total value when some but not all ingredients have price data
- Shopping purchase link: regular links are blue; the selected-default product is bold green with a `✓` suffix so the user can see at a glance which one is the pick (and matches what's driving nutrition)

---

## Audio
A beep sound plays when a timer completes. The audio context is unlocked silently on first recipe selection (when clicking a recipe button to select it), bypassing browser autoplay restrictions without producing any audible sound. This also happens when a recipe is accessed directly via URL parameter. This ensures timer sounds will play reliably during the cooking session.

---

## Validation Script (`validate-recipes.ts`)
A separate script that imports the recipe module and catches any `transfer()` validation errors thrown at definition time. Run with `npx ts-node validate-recipes.ts` before deploying. Returns exit code 0 on success, 1 on failure. Suitable for use as a `pre-push` git hook or CI check.

---

## Registered Ingredients (notable)

### Blueprint supplements
| Key | Name | Serving | Nutrition (per serving) | Product |
|---|---|---|---|---|
| `longevityMix` | Longevity Mix | 1 scoop (14.8g) | 10 cal, 3g carbs | Blueprint Blood Orange, 30 srv, $49 / $44.10 S&S |
| `blueprintCollagen` | Collagen Peptides | 1 scoop (22.3g) | 80 cal, 20g protein | Blueprint Type I/II/III, 30 srv, $45 / $40.50 S&S |
| `blueprintCreatine` | Creatine Monohydrate | 1 scoop (5.7g) | 0 cal | Blueprint Unflavored, 100 srv, $40 / $36 S&S |

All three are combined in the **Blueprint Longevity Drink** recipe (`blueprint-longevity-drink`): mix all three powders in 8–12 oz water. This recipe is included in the Daily Blueprint bundle.

### Asian Dense Bean Salad ingredients
All produce and condiment ingredients used in the Asian Dense Bean Salad are registered as full `ingredientFactory` entries with USDA nutrition data:

| Key | Unit | Cal | Protein | Carbs | Fat | Sodium |
|---|---|---|---|---|---|---|
| `chickpeas` | cup | 220 | 12g | 36g | 4g | 20mg |
| `cannelliniBean` | cup | 180 | 12g | 32g | 0g | 10mg |
| `edamame` | cup | 190 | 17g | 14g | 8g | 9mg |
| `cabbage` | cup | 22 | 1g | 5g | 0g | 16mg |
| `carrot` | cup | 52 | 1g | 12g | 0g | 88mg |
| `greenOnion` | unit | 5 | 0g | 1g | 0g | 5mg |
| `almond` | handful | 164 | 6g | 6g | 14g | 0mg |
| `whiteMiso` | tbsp | 35 | 2g | 5g | 1g | 600mg |
| `tamari` | tbsp | 11 | 2g | 1g | 0g | 700mg |
| `riceVinegar` | tbsp | 3 | 0g | 1g | 0g | 0mg |
| `sesameSeed` | tbsp | 52 | 2g | 2g | 4g | 1mg |
| `limeJuice` | tbsp | 4 | 0g | 1g | 0g | 1mg |

Chickpeas and cannellini beans both include a `cup → oz` conversion (≈8.93 oz/cup) so cost can be computed against their 13.4 oz packages. Edamame uses `cup → oz` at 5.3 oz/cup.

### Asian Dense Bean Salad — Kit Version
Recipe `asian-dense-bean-salad-kit` is a shortcut version of the full from-scratch salad. It uses the **365 Organic Asian Inspired Salad Kit** (12 oz, $5.99 — pre-shredded cabbage, carrots, green onion, almonds, and sesame dressing) as the base, then adds 1 cup each of chickpeas, cannellini beans, and edamame. The result is nutritionally similar to the scratch version with far less prep. This recipe is included in the Daily Blueprint bundle.

---

## Bootstrap
The app mounts on `DOMContentLoaded`, injects styles, renders `<div id="app">`, and calls `render()`. All state lives in a single `state` object. No persistence between page loads.

When the app boots, it checks for a `?recipe=recipe-id` URL parameter. If found and the recipe exists, it auto-selects that recipe, unlocks the audio context, and jumps directly to the Cooking screen.