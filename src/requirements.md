# Recipe Cooking Assistant — Requirements

## Overview
A single-file TypeScript app that lets a user select recipes, view a shopping list, review nutrition, and walk through cooking steps interactively. It runs in the browser with no frameworks.

---

## Screens
There are seven screens: Select, Shopping, Nutrition, Cooking, Add Ingredient, Prep, and Plan. Navigation is handled by a simple state machine — no URLs.

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
- A fixed bottom bar appears when any serving is selected, with up to five buttons: "Go Shopping", "Nutrition", "📅 Plan", "🔪 Prep" (conditional), and "Start Cooking". "Start Cooking" is hidden when only ad-hoc items are selected (nothing to cook). "🔪 Prep" is only shown when at least one selected recipe has prep steps
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
│  ▸ Recipe A  −/+ ✓  $X.XX · subtotal   │   ← tap header to expand; ✓ = counted (default)
│  ▾ Recipe B  −/+ ○  $X.XX · subtotal   │   ← ○ = deselected (dimmed, excluded from totals)
│    − Ingredient — X cal … · $X.XX      │   ← − = exclude from totals
│    + Ingredient — excluded              │   ← + = re-include (row dimmed)
│    − Ingredient — ⚠ no nutrition data  │
│           ⚠ no price data              │
│    − Ingredient — ⚠ can't compute      │
│           reason text…                 │
└─────────────────────────────────────────┘
```

- **Grand total** — a card at the top sums every selected recipe that hasn't been deselected, scaled by each recipe's serving count, accounting for any excluded ingredients within it. Title varies by selection shape:
  - 1 recipe × 1 serving → the recipe's name
  - 1 recipe × N servings (N > 1) → `Recipe Name ×N`
  - Multiple recipes → `All selected recipes (N servings)` where N is the total servings across all selected recipes (this count is not affected by deselection)
- **Per recipe** — each recipe is a collapsible section showing its own subtotal (scaled by serving count, minus excluded ingredients) in the header; the header name shows `×N` when N > 1. Tapping the header toggles its ingredient breakdown (collapsed by default; a `▸`/`▾` caret reflects state). Expanded/collapsed state persists across re-renders (e.g. when toggling ingredient exclusions) so the section doesn't snap shut. Each recipe header also has:
  - Inline `−` / `+` serving controls so servings can be adjusted without leaving the screen
  - A **selection toggle** button (`○` / `✓`) — every recipe is selected (`✓`, counted) by default. Tapping it deselects the recipe (`○`): the section dims to 50% opacity and its nutrition/cost is subtracted from the grand total and Daily Targets "Eaten" column. The recipe stays visible and its own subtotal keeps showing what it would contribute — only the grand total changes. Deselecting a recipe does not touch its per-ingredient exclusions underneath. Selections persist across re-renders but clear (back to all-selected) on Start Over
- **Per ingredient** — each ingredient row inside an expanded section shows a `−` / `+` toggle button, the ingredient name, and its computed nutrition contribution with cost appended, or appropriate flags (see below). Tapping `−` **excludes** the ingredient: its contribution is zeroed from the section subtotal and grand total, the row dims to 40% opacity, and the value becomes `— excluded`. Tapping `+` re-includes it. The ingredient always remains in the list (never disappears). This works whether or not the parent recipe is selected — think of it as two independent layers: recipe-level selection gates the whole recipe's contribution, ingredient-level exclusion further trims what counts within a selected recipe. Exclusions persist across re-renders but clear on Start Over.
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

#### Add more
Below the suggestions panel, an **"Add more"** section lets you add to the current selection without leaving the Nutrition screen:
- A search box (`getNutritionAddableRecipes()`) filters the full recipe catalog by name — independent of the Select screen's own search box, so typing in one doesn't affect the other. Ad-hoc recipes are excluded (they're one-off synthetic entries, not reusable catalog recipes). With no query, non-hidden recipes are listed alphabetically, capped at 8 with a `+N more — refine your search` hint if there are more matches; hidden recipes only surface once searched by name (or once "Show hidden" is toggled), matching Select screen behavior
- Each matched row has a `+ Add` button that adds one serving and re-renders the screen in place
- An "+ Add an ingredient" button opens the same ingredient picker as the Select screen (see [Add Ingredient Screen](#add-ingredient-screen)) — see that section for how it returns you back here afterward

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

Opened by the "+ Add an ingredient" button at the bottom of either the Select screen or the Nutrition screen's ["Add more"](#add-more) section.

Flow:
1. Search field filters the registered ingredient catalog (every entry in `i`) by name substring
2. Tap an ingredient to select it; the row turns green
3. Quantity input (number, defaults to 1, supports decimals) and unit dropdown (all units in `u`) appear below
4. Default unit is inferred from the selected ingredient's nutrition keys — if it has nutrition data keyed by `'cup'`, the picker preselects `cup`. Falls back to `unit` when there's no hint
5. "Add to list" creates a synthetic recipe via `createAdhocRecipe()`, registers it, selects one serving, and returns to **whichever screen opened the picker** (Select or Nutrition)
6. "← Back" cancels, clears any picker state, and returns to the same origin screen

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
- Shows every step from every selected recipe in **one continuous flow**, in natural authored order — there is no separate "ready" vs "waiting" zone. A locked step renders exactly where it belongs in the sequence; it just looks and behaves locked (dimmed, red left border, "⏳ waiting…" pill, unclickable) until its dependencies clear. Nothing is ever physically relocated in the DOM, so unlocking a step never shifts the surrounding layout or scroll position — see [Locking System](#locking-system)
- Recipe title headings appear once, above the first step of their recipe, regardless of that step's locked state
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
- **Timer** — tap once to start countdown, tap 3× rapidly to skip. Shows `MM:SS {label} — up at {clock time} — tap 3× to skip` while running, e.g. `04:32 Simmer sauce — up at 6:45 PM — tap 3× to skip` — the clock time is the wall-clock moment the timer is due to finish, computed once up front from the fixed end timestamp (see [Countdown reliability](#countdown-reliability)) so it doesn't drift as the countdown ticks. Once ringing, the card shows how overdue the timer is — see [Audio](#audio). On completion (whether acknowledged from the alarm or via the instant sound-test path) the card turns green and reads `✓ {label} — completed at {clock time} (up at {due clock time} — overdue by {MM:SS})`; the overdue parenthetical is a frozen snapshot of how late the timer was stopped, and is omitted for completions that never ran a countdown (e.g. a gate's immediate "Yes" — see below). On skip marks it grey with strikethrough and timestamp (no overdue detail). **Before being tapped**, a small amber duration badge is shown on the right of the card (e.g. `15m`, `1h 30m`, `45s`) so the user can see how long the timer will run before starting it. The badge is hidden once the countdown begins.
- **Container** — a step with child ingredient steps nested inside it. The header shows the action (e.g. "Add to batter bowl"). Each child is its own tappable row. When all children are dismissed the container disappears.
- **Info** — a non-interactive, collapsible notes panel. Rendered as a dark card with a `▸ Notes` header; collapsed by default. Tapping the header expands/collapses the content. Not part of the cooking flow — no tap-to-complete, no locking, no dependency claims. Use for static contextual notes (e.g. yield ratios like "65g dry → 165g cooked"). Also shown in the Prep screen above the recipe's prep steps.
- **Gate** — a check-then-loop step for things like "cook until it hits temperature X" where a fixed cook time can't be predicted up front. Created with `Timer.gate(question, retryAmount, retryUnit, opts)`. Immediately shows the question with Yes/No buttons (no countdown). "Yes" completes the step like a timer (green, timestamped). "No" starts a `retryAmount retryUnit` countdown (tap 3× to skip, same as Timer, and showing the same `up at {clock time}` label); on completion it plays the alarm sound and re-asks the same question — looping until answered "Yes". Claims its equipment/ingredients like a Timer step for locking purposes. Each time a retry countdown starts, a per-step run counter increments; once it's ≥ 1, the re-asked question shows a muted `Checked N×` line beneath it so the user can see how many times the check has looped. The final "Yes"-completed card also carries the count, e.g. `✓ {question} — completed at 4:32 PM (checked 2×)`, omitted if it was answered "Yes" on the first ask. Unlike a Timer step, this card never shows an "overdue by" detail — answering "Yes" is a direct decision, not an alarm being acknowledged after a deadline, even after one or more retry countdowns. The counter resets on Start Over.

---

## Locking System

**Every** step "claims" its equipment and ingredients the moment it's processed into the cooking plan — this isn't limited to timers or already-locked steps. Any subsequent step that references the same equipment (by name) or the same ingredient (by object reference) is locked — rendered dimmed with a red left border and a "⏳ waiting…" pill — and cannot be tapped until all blocking steps are done. In effect, every step in a chain that touches the same resource hands off to the next one automatically, without needing an explicit `waitFor()` at each link.

### Claim keys
- Equipment claims are keyed by `"recipeId::eq::equipmentName"` — equipment is identified by name, so a named vessel like `"panko pan"` is distinct from `"pan"`
- Ingredient claims are keyed by **object reference**, not by name — two calls to `i.avocadoOil()` produce separate objects and are treated as independent instances with no shared claim

### Propagation
- Claims propagate transitively: any step that touches a given equipment/ingredient claims it, so any later step C that shares equipment or ingredients with an earlier step B will automatically wait for B without needing an explicit `waitFor()` declaration
- This means a single `waitFor()` at the head of a dependency chain locks all downstream steps that share the same resources, and a plain sequence of instruction steps reusing the same vessel (e.g. `pot.add()` → "place lid" → "set stovetop" → cook timer → "strain") naturally chains in authored order with no manual wiring at all

### Manual dependencies
- `step.waitFor(...steps)` is a fluent method on `Step` that appends to `waitForIds` and returns `this`
- Used for culinary constraints that can't be derived from code logic — e.g. "don't dip mushrooms until panko is in the bowl"
- `buildCookingPlan` preserves manual `waitForIds` set via `waitFor()` before clearing derived ones, then merges both into the final `waitForIds`

### Unlock behaviour
- A locked step watches the DOM via `MutationObserver` (observing `childList`, `subtree`, and `class` attribute changes)
- It unlocks when every waited-on step element is either absent from the DOM, or has the `.completed`, `.skipped`, or **`.ringing`** class. `.ringing` counts as unlocked because it means the timer's cook time has already elapsed and its alarm is sounding — the dependent step becomes usable during that 30-second warning window rather than waiting for the alarm to be dismissed
- On unlock: the panel briefly flashes green (`.step-unlocked`, 800 ms) in place, then returns to normal. It never moves — see [Cooking Layout](#cooking-layout)

### Recipe scoping
- Two recipes using the same equipment name are treated as separate lanes because equipment claims are scoped by `recipeId`

---

## Cooking Layout

All steps for all selected recipes render once, in a single continuous flow, in authored order — interleaved with each recipe's title heading. There is no separate "ready" vs "waiting" section and no DOM relocation of any kind: a step's locked/unlocked state is purely a class toggle (see [Unlock behaviour](#unlock-behaviour)) applied to the panel sitting exactly where it was originally rendered. This keeps the whole recipe readable top-to-bottom regardless of lock state, and means unlocking a step never shifts scroll position or reflows anything else on the page.

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
**Weight cluster:** `oz ↔ lb ↔ g`

`convertUnits(quantity, from, to)` returns the converted quantity, or `null` if no path exists (different clusters, or an unmapped unit like `unit` / `handful`). Both nutrition and cost resolution call this before declaring an ingredient `uncomputable`.

`convertWithDensity(quantity, from, to, conversions?)` extends `convertUnits` by recursively chaining ingredient-specific density conversions. For example, cherries use `unit → cup` (15 cherries/cup) and `cup → ounce` (5 oz/cup), so `convertWithDensity(qty, 'unit', 'ounce', conversions)` resolves the two-hop chain automatically. The function recurses until a physical conversion closes the final gap, or returns `null` if no path exists.

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
| Fiber | 38 | g | reach target |
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
- `Timer.set(amount, unit, label)` → creates an inline timer step (unit: `'s'`, `'m'`, `'h'`). Prefer this over `timerStep` when no extra opts are needed; use `timerStep` when attaching `ingredients`, `equipment`, `prep: true`, etc.
- `cleanup(equipmentName)` → creates a cleanup step `"Clean and put away {equipmentName}"`
- `info(text, opts?)` → creates a non-interactive collapsible notes panel (type `'info'`). Collapsed by default with a `▸ Notes` header. Not part of the cooking flow — no locking or completion behaviour. Shown in both cooking and prep screens.
- `prep(text, opts?)` → instruction step with `prep: true`. Appears in both the Prep screen and the Cooking screen.
- `prepOnly(text, opts?)` → instruction step with `prep: true` **and** `prepOnly: true`. Appears in the Prep screen only — filtered out of `buildCookingPlan` so it never shows in the Cooking screen. Use when a prep step (e.g. portioning into a container) has no place in the cook flow.
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

Available factories: `e.bowl()`, `e.pan()`, `e.pot()`, `e.oven()`, `e.toasterOven()`, `e.instantPot()`, `e.bulletMixer()`, `e.knife()`, `e.cuttingBoard()`, `e.colander()`, `e.platter()`, `e.kettle()`, `e.nuwavePan()`, `e.microwave()`.

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
- `products` — an array of `Product` entries; each is a specific SKU (brand + variant), with its own size/nutrition and one or more `listings` (where it can be bought)
- `defaultBrand` — the brand string of the selected product. Its label drives nutrition; it's marked as the pick (`✓`) on the shopping list. If unset, the first product is used
- `nutrition` — an ingredient-level label, used for brand-independent items like produce (celery, banana). Ignored when a selected product carries its own `nutrition`
- `perishableDays`, `isMeatProduct`
- `requiresDateLabel` — if `true`, automatically adds an instruction child step to any `.add()` call using this ingredient, asking the user to write today's date on the bottle with a Sharpie (useful for tracking expiration)

### `Product` and `Listing`
```ts
{ brand: string;       // e.g. 'Milkadamia', '365'
  variant?: string;    // 'Unsweetened', 'Organic Raw'
  size?: number;       // package size
  sizeUnit?: Unit;     // package unit
  organic?: boolean;
  nutrition?: NutritionLabel;   // keyed by unit name
  listings?: Listing[]; }

// Where/how a Product can be bought — retailer-specific and non-exclusive.
{ store?: string;
  link?: string;
  price?: number;
  discount?: Discount; }
```

`Product` describes what the item physically *is* (brand, variant, size, nutrition); `Listing` describes where/how to buy it (store, link, price, discount). The split exists because the same physical product is often sold in more than one place at different prices — e.g. a Blueprint bar sold both on Amazon and on Blueprint's own site — and those listings share one nutrition label, not two duplicated ones. A genuine multi-SKU category (peanut butter: Organic Unsweetened vs. Creamy vs. Crunchy) is modeled as separate `Product` entries instead, each with its own real nutrition, since those genuinely differ.

For display/cost purposes, the shopping screen renders one row per `(product, listing)` pair, sorted ascending by price-per-unit; `cheapestListing(product)` picks which listing drives cost calculations and the `✓` default marker.

### `Discount` and Subscribe & Save
```ts
{ subscribeAndSave5?: boolean;
  subscribeAndSave10?: boolean;
  subscribeAndSave15?: boolean;
  subscribe5Products?: number; }  // Amazon's separate "5+ subscriptions" bonus, unrelated to the tiers above
```

Subscribe & Save eligibility is recorded as a boolean per tier (5/10/15%) rather than a hardcoded dollar price — `subscribeAndSavePercent()` picks the highest eligible tier, and the S&S price is always computed live as `listing.price × (1 − percent/100)`, so it can never go stale independently of the base price. The Shopping screen only shows an S&S price when `listing.store === stores.amazon` — Whole Foods and other retailers don't offer Subscribe & Save even for an identical item.

### Nutrition is required
Every ingredient must resolve to real nutrition data — there's no "missing" path. `ingredientFactory`'s TypeScript signature enforces this via two overloads: either the ingredient itself carries a `nutrition` label (for a true single product, regardless of how many retailers/listings sell it), or every entry in its `products` array does (for genuine multi-SKU categories, where one generic number would misrepresent whichever variant isn't picked). Passing neither is a compile error. `simpleIngredients()`'s bulk-declare helper is subject to the same rule — each entry must supply its own `nutrition`.

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

This is distinct from the global unit-conversion graph (which only handles within-cluster conversions like tsp↔cup or oz↔lb). Ingredient-specific conversions handle density / packaging mismatches that are substance-dependent.

Conversions can be **chained**: `convertWithDensity` recursively follows density hops until a physical conversion closes the final gap. For example, cherries declare two hops:
```ts
conversions: {
    [u.unit.name]: { to: u.cup,   factor: 1/15 },  // 1 cherry → 1/15 cup
    [u.cup.name]:  { to: u.ounce, factor: 5    },  // 1 cup → 5 oz
}
```
A recipe using `unit` and a package in `ounce` resolves as `unit →(×1/15)→ cup →(×5)→ ounce` automatically.

Other examples: cannellini beans (cup→oz, 8.93 oz/cup), edamame (cup→oz, 5.3 oz/cup), carrot (cup→lb, 0.24 lb/cup).

### `simpleIngredients()` helper
Bulk-declares ingredients with no metadata. Auto-derives display names from camelCase keys — e.g. `kingOysterMushroom` → `"King Oyster Mushroom"`. An explicit string is only needed when the auto-derived form is wrong.

---

## Units
Supported: none, cup, tbsp, tsp, ounce, pound, fl oz, unit, handful, spray, bag, bunch, gram, shot.

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
- Unlock flash: green border/background animation (800 ms) in place — the panel never moves
- Recipe title: name + `estimated X min · actual Xm XXs` badge (muted colour, updates every second, freezes when all steps done)
- Action bar: three buttons — Go Shopping (blue), Nutrition (purple), Start Cooking (green)
- Nutrition grand-total card: dark inset card, muted uppercase title; cost prepended when available
- Nutrition recipe section: collapsible, `▸`/`▾` caret, cost + subtotal on the right of the header; selection toggle (`○`/`✓`) between serving controls and subtotal
- Nutrition selected state (default): green border + green recipe name; `✓` button filled green
- Nutrition deselected recipe: whole section dimmed to 50% opacity; `○` button; excluded from the grand total
- Nutrition ingredient row: `−`/`+` toggle button on the left, then ingredient name, then `X cal · … · $X.XX` when both nutrition and cost are ok; cost flag sub-line (`⚠ no price data`) when nutrition ok but cost missing
- Nutrition excluded ingredient: row dimmed to 40% opacity; value shows `— excluded`; toggle shows `+`
- Nutrition flag pill: amber pill (`⚠ no nutrition data` / `⚠ can't compute`); coverage line turns amber whenever anything is flagged; uncomputable rows show an italic amber reason line beneath
- Nutrition provenance: muted italic "via {brand} · {variant}" under any ingredient row whose numbers came from a selected product
- Nutrition partial-cost note: amber italic note below grand-total value when some but not all ingredients have price data
- Shopping purchase link: regular links are blue; the selected-default product is bold green with a `✓` suffix so the user can see at a glance which one is the pick (and matches what's driving nutrition)

---

## Audio
A beep sound plays when a timer's countdown reaches zero, and repeats every 30 seconds (see [Step Types](#step-types) — "time's up" warning window) until acknowledged.

### Ringing display
While a timer or gate step is ringing, the card shows `⏰ {label} — time's up!` plus a status line beneath it: `up at {clock time} — overdue by {MM:SS}` (or `H:MM:SS` once overdue passes an hour), with `— next alarm in {N}s` appended during the initial 30-second warning window before the sound loops continuously. The overdue duration is computed from the timer's original deadline (not from when the alarm started ringing) and keeps incrementing once per second — through both the warning window and the continuous-ring phase — for as long as the alarm is left unacknowledged, so a user who steps away can see exactly how late they are when they come back. It stops updating the moment "Stop Alarm" is tapped (or any click on the page dismisses it).

### Unlocking playback
`unlockAudioContext()` runs on the first click anywhere on the page (or immediately if a recipe is opened via `?recipe=` URL). It mutes and directly plays/pauses the **actual shared alarm `Audio` element** (not a separate throwaway clip) so that specific element is granted "allowed to autoplay" status by the browser — some browsers (notably Safari) scope that permission per media element based on it having been played directly during a user gesture, rather than unlocking playback page-wide. Without this, the alarm's `play()` call — which always fires later from a `setInterval` callback, never a gesture — can be rejected outright the first time a real (non-instant) timer tries to ring.

### Failure handling
`playSound()` no longer just logs a failed `audio.play()` to the console:
- It shows a fixed, pulsing red banner across the top of the page ("🔇 Alarm sound was blocked by the browser — tap anywhere to enable it"). Any click anywhere retries playback and clears the banner once it succeeds.
- It also writes the specific error (e.g. `NotAllowedError: …`) directly onto the ringing step's own panel, so the failure is visible in context without opening devtools.

### Wake Lock
While any timer or gate countdown is running, the app requests a Screen Wake Lock (feature-detected; a no-op on unsupported browsers) to stop the device from auto-locking its screen. This matters because a locked/backgrounded screen typically suspends the page's JavaScript entirely — killing the countdown and preventing the alarm from ever firing. The lock releases once no timers are active (on completion, skip, or Start Over), and is re-acquired if the page becomes visible again mid-timer (the browser auto-releases it whenever the document is hidden, per spec).

### Countdown reliability
Timer/gate countdowns compute a fixed target end timestamp (`Date.now() + durationSeconds * 1000`) once, up front, rather than decrementing a counter once per tick. If the page gets suspended for a stretch (background throttling despite the Wake Lock, an unsupported browser, etc.) and resumes late, the next tick immediately detects the countdown is overdue and fires right away — instead of needing to keep ticking for however many seconds were left when it was suspended.

---

## Validation Script (`scripts/validate-recipes.js`)
Runs automatically as the `postbuild` step after `tsc` (`npm run build`). Checks:
1. **`unlockAudioContext()` primes the real alarm element** — regression guard for a real production bug (see [Audio](#audio)): fails the build if `unlockAudioContext()`'s body creates a separate `new Audio(...)` instead of calling `audio.play()` directly on the shared alarm element, or if that call is removed entirely. Fails the build.
2. **Consecutive `.add()` calls** on the same equipment variable with no step between them — should be consolidated into one `.add()`. Fails the build.
3. **Redundant nutrition entries** — flags an ingredient whose `nutrition` label has entries for both units of a declared `conversions` pair (or two entries with identical values, implying an unstated `factor: 1`), since the conversion system already derives one from the other. Fails the build.
4. **Equipment/ingredient mention scan** (warning-only, never fails the build) — a heuristic, non-exhaustive scan of the literal text passed to `instruction()`/`prep()`/`Timer.set()`/`Timer.gate()`/`timerStep()` calls, checking whether words matching a known equipment type or ingredient name are actually declared in that step's `equipment:`/`ingredients:` arrays. Steps built via `Equipment` methods (`.add()`, `.mix()`, etc.) already populate those arrays automatically and aren't scanned; `info()` steps are excluded too (narrative notes, not action steps). Expect some false positives — printed as non-blocking warnings for a human to judge (e.g. "text mentions X but doesn't declare it").

The script also stamps the real compile timestamp into the freshly-built `dist/file.js`, replacing the `__BUILD_TIME__` placeholder `src/file.ts` declares — see [Build Info](#build-info).

`transfer()` validation errors are caught separately, at recipe-definition time (the IIFE throws immediately if an ingredient being transferred isn't actually in the source vessel) — this happens naturally whenever the module loads/compiles, not as a separate check in this script.

---

## Build Info
The Select screen shows a small "Last compiled: {date}" footer at the bottom of the recipe list (part of the normal scrollable content, not the fixed action bar). `src/file.ts` declares a `BUILD_TIME` placeholder constant (`'__BUILD_TIME__'`); the `validate-recipes.js` postbuild step rewrites it in `dist/file.js` with the real compile timestamp (see [Validation Script](#validation-script-scriptsvalidate-recipesjs)). Running straight from source (e.g. under `vite`, without a `tsc` build) leaves the placeholder in place, which renders as `"dev build"` instead of a date.

---

## Touch & Zoom Behavior
Since this is a kitchen app typically used one-handed or with messy hands, pinch/double-tap zoom is suppressed:
- The viewport meta tag (`dist/main.html`) sets `maximum-scale=1.0, user-scalable=no`
- `html, body { touch-action: pan-x pan-y; }` blocks pinch-zoom gestures at the CSS level while still allowing normal scrolling
- A `gesturestart` listener (feature-detected, WebKit-only) calls `preventDefault()` to cover iOS Safari's non-standard pinch gesture events, which aren't fully covered by `touch-action` alone

None of this is guaranteed absolute — iOS accessibility zoom settings can still override page-level zoom blocking on some versions.

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

### Asian Dense Bean Salad — variants
Three registered recipes cover this dish:
- `asian-dense-bean-salad-original` ("Original Blueprint Version") — the full from-scratch recipe: soak chickpeas/cannellini overnight, peel and shred carrots, shred cabbage, and mix a homemade miso-sesame dressing.
- `asian-dense-bean-salad` ("Asian Dense Bean Salad") — the simplified default: pre-shredded carrots + Coleslaw Mix (store-bought cabbage/carrot blend) + chopped scallions + canned beans, dressed with 2 tbsp of a store-bought Creamy Sesame Dressing instead of a homemade one. **This is the recipe included in the Daily Blueprint bundle.**
- `asian-dense-bean-salad-kit` ("Asian Dense Bean Salad (Kit Version)") — uses the **365 Organic Asian Inspired Salad Kit** (12 oz, $5.99 — pre-shredded cabbage, carrots, green onion, almonds, and sesame dressing) as the base, then adds 1 cup each of chickpeas, cannellini beans, and edamame.

---

## Prep Mode

A dedicated screen for advance prep steps — anything that can (or must) be done before the cooking session itself. Opened from the **🔪 Prep** button on the action bar; the button only appears when at least one selected recipe has at least one `prep: true` step.

### `prep()` and `prepOnly()` factories
```ts
prep(text, opts?)      // instruction with prep: true — shows in Prep screen AND Cooking screen
prepOnly(text, opts?)  // instruction with prep: true + prepOnly: true — Prep screen only
```

The `prep: true` flag on a `Step` marks it as a prep step. Behaviour differs by variant:

| Factory | Prep screen | Cooking screen |
|---|---|---|
| `prep()` | ✓ shown | ✓ shown (tap again if not done yet) |
| `prepOnly()` | ✓ shown | ✗ filtered out by `buildCookingPlan` |

Use `prepOnly` for steps that make no sense mid-cook — e.g. "Portion 65g cooked lentils into stainless steel container" — where the user does the action ahead of time and it's irrelevant during the cook session.

Prep-done state does **not** sync between modes; tapping a step in Prep mode does not mark it complete in Cook mode.

### Prep screen layout
- `info` steps for a recipe are shown first as a collapsed `▸ Notes` panel (same collapsible behaviour as in the cooking screen)
- Prep steps are collected from all selected non-adhoc recipes, walking the step tree for any step with `prep: true` (including `prepOnly` steps)
- Grouped by recipe title (muted uppercase heading per recipe)
- Each step is a tappable card — tapping toggles `.prep-done` class (strikethrough + 40% opacity)
- No locking, no timers — just a simple checklist
- "← Back" returns to Select screen

### Prep-flagged steps in existing recipes
- **Black Lentils** (`ing-black-lentils`): `timerStep('Bring water to boil…', time.minutes(21), { prep: true })` (cooking timer) + `prepOnly('Portion 65g cooked lentils into stainless steel container')` (prep-only)
- **Asian Dense Bean Salad** (scratch version): soak chickpeas/cannellini overnight, peel/shred carrots, shred cabbage

---

## Planning Mode

A day-planner screen that schedules the selected recipes into time blocks based on a user-configured daily schedule. Opened from the **📅 Plan** button on the action bar (always visible when any recipe is selected).

### Time block config
The user's schedule is represented as a list of `PlanBlock` entries. Each block has:
- `start` / `end` — 24h time strings (`"HH:MM"`)
- `type` — `'home'` (can cook), `'portable'` (portable foods only), or `'away'` (unavailable)

Config is persisted in `localStorage` under the key `recipe-plan-config` and survives page reloads. Default config mirrors a typical weekday:

| Block | Type |
|---|---|
| 07:00 – 08:00 | 🏠 Home |
| 08:00 – 12:00 | 🏢 Away |
| 12:00 – 12:30 | 🎒 Portable |
| 12:30 – 17:00 | 🏢 Away |
| 17:00 – 22:00 | 🏠 Home |

The user can add, remove, and edit blocks directly on the Plan screen. Changes save immediately to localStorage.

### Calorie cutoff
A separate time field (`caloriesCutoff`, default `14:00`) marks the user's goal of eating all calories before that time. Recipes placed after the cutoff are shown at 55% opacity with an `⚠ after cutoff` meta tag.

### Recipe planning fields
Added to the `Recipe` interface:

| Field | Type | Description |
|---|---|---|
| `portable` | `boolean?` | Can be eaten away from home (no kitchen needed) |
| `planMinutes` | `number?` | Total time to consume on the day (eating time, assuming any advance prep is already done) |
| `prepMinutes` | `number?` | Advance cook/prep time (can be done ahead of the eating day) |
| `perishableDays` | `number?` | How many days the prepped item keeps in the fridge |

Use `withPlan(createRecipe(...), { planMinutes, portable, prepMinutes, perishableDays })` to tag recipes.

Current tags:

| Recipe | planMinutes | portable | prepMinutes | perishableDays |
|---|---|---|---|---|
| Blueprint Smoothie | 8 | no | — | — |
| Blueprint Longevity Drink | 3 | no | — | — |
| Black Lentils | 3 | yes | 21 | 2 days |
| Blueprint Macadamia Bar | 2 | yes | — | — |
| Psyllium Husk | 3 | no | — | — |
| Protein / Nut Mix / Olive Oil | 5 | no | — | — |
| Asian Dense Bean Salad (Kit) | 10 | no | — | — |

### Scheduling algorithm
Greedy in recipe-list order:
1. Filter blocks to those compatible with the recipe (`home` + `portable` blocks for home recipes; all non-`away` blocks for portable recipes)
2. For each compatible block, maintain a cursor (current time within that block)
3. Place the recipe at the cursor if `cursor + planMinutes ≤ block.end`; advance cursor
4. If no block fits → recipe is listed as **Unscheduled** with a warning

### Plan screen layout
```
📅 Day Planner

[ Time Blocks editor — list of editable rows ]
[ Calorie cutoff row ]

📋 Suggested Schedule
  7:00 AM  Blueprint Smoothie         8 min
  7:08 AM  Blueprint Longevity Drink  3 min
  7:11 AM  Black Lentils              3 min · portable
  7:14 AM  Psyllium Husk              3 min
  7:17 AM  Protein / Nut Mix          5 min
  7:22 AM  Macadamia Bar ×2           2 min · portable
 12:00 PM  Macadamia Bar (2nd)        2 min · portable
 17:00 PM  Asian Dense Bean Salad Kit 10 min
             (⚠ after cutoff)

🥘 Batch Prep (cook ahead)
  Black Lentils — 21 min cook time · keeps 2 days in fridge

⚠ No available slot: [recipe name]
```

Recipes without `planMinutes` are listed under "No duration set (won't block time)" and are placed in the schedule conceptually but don't advance the time cursor.

---

## Bootstrap
The app mounts on `DOMContentLoaded`, injects styles, renders `<div id="app">`, and calls `render()`. All state lives in a single `state` object. Plan config is persisted in `localStorage` (`recipe-plan-config`); all other state resets on page load.

When the app boots, it checks for a `?recipe=recipe-id` URL parameter. If found and the recipe exists, it auto-selects that recipe, unlocks the audio context, and jumps directly to the Cooking screen.