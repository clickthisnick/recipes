# Recipe Cooking Assistant — Requirements

## Overview
A single-file TypeScript app that lets a user select recipes, view a shopping list, and walk through cooking steps interactively. It runs in the browser with no frameworks.

---

## Screens
There are three screens: Select, Shopping, and Cooking. Navigation is handled by a simple state machine — no URLs.

### Select Screen
- Shows a searchable list of all registered recipes
- Recipes can be grouped under category headings (e.g. Breakfast, Dinner)
- Each recipe row has a star/favorite toggle that floats favorited recipes to the top
- Multiple recipes can be selected at once (toggled on/off)
- A fixed bottom bar appears when any recipe is selected, with two buttons: "Go Shopping" and "Start Cooking"
- Tapping "Start Cooking" navigates directly to the cooking screen with no intermediate panel

### Shopping Screen
- Shows a consolidated ingredient list across all selected recipes, summing quantities of ingredients that share the same name and unit
- Ingredient identity for shopping list deduplication is name+unit string — the same ingredient object referenced multiple times in a recipe counts only once
- Each ingredient row can be tapped to mark it as completed (strikethrough/green)
- If an ingredient has purchase links, they are shown as tappable URLs with store name, variant, price, and quantity
- A "Start Over" button returns to the Select screen and resets all state

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

This makes it easy to create and share recipe links without manually typing the URL.

---

## Step Types

- **Instruction** — tap to dismiss (card disappears). Used for all active hands-on steps: prep, cleanup, notes, transfers, flips, sprays, slices, combines.
- **Cleanup** — same as instruction, tap to dismiss
- **Timer** — tap once to start countdown, tap 3× rapidly to skip. Shows MM:SS countdown while running. On completion plays a sound and marks the card green with a timestamp. On skip marks it grey with strikethrough and timestamp.
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
`mix()` and `combine()` produce a new `Ingredient` representing the combined state of the vessel. Access it via `vessel.result` immediately after the call. Throws if accessed before any `mix()` or `combine()` call.

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

Optional metadata:
- `purchaseLinks` — nested by store → variant → array of `{ price, quantity, quantityUnit, link, organic?, discount? }`
- `nutrition` — keyed by unit name, with fields for servings, calories, sodium, sugar, protein
- `perishableDays`, `isMeatProduct`
- `requiresDateLabel` — if `true`, automatically adds an instruction child step to any `.add()` call using this ingredient, asking the user to write today's date on the bottle with a Sharpie (useful for tracking expiration)

### `rename(newName)`
A method on `Ingredient` that silently mutates the display name — no step card is produced. Used when an ingredient changes state mid-recipe (e.g. raw mushrooms → breaded mushrooms). All subsequent steps that reference the same object will use the new name.

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
Named constants for Amazon, Amazon Fresh, Whole Foods — used as keys in purchase link objects.

---

## Styling
Dark theme (`#111` background, `#f0f0f0` text). Large touch-friendly cards (font-size 22px, padding 20px). All styles injected as a `<style>` tag at bootstrap time — no external CSS file.

Key visual states:
- Selected recipe: green background
- Starred recipe: gold star
- Active timer: amber/yellow card
- Completed timer: green card with ✓ and timestamp
- Skipped timer: grey card with strikethrough and timestamp
- Locked step: 45% opacity, red left border, "⏳ waiting…" pill
- Unlock flash: green border/background animation (800 ms), then panel moves to Ready zone at authored position
- Recipe title: name + `estimated X min · actual Xm XXs` badge (muted colour, updates every second, freezes when all steps done)
- Ready zone (`#ready-section`): no decoration, appears at top
- Waiting zone (`#waiting-section`): top border + muted label; hidden when empty; completed/skipped panels are pinned and never jumped over by promoted panels

---

## Audio
A beep sound plays when a timer completes. The audio context is unlocked silently on first recipe selection (when clicking a recipe button to select it), bypassing browser autoplay restrictions without producing any audible sound. This also happens when a recipe is accessed directly via URL parameter. This ensures timer sounds will play reliably during the cooking session.

---

## Validation Script (`validate-recipes.ts`)
A separate script that imports the recipe module and catches any `transfer()` validation errors thrown at definition time. Run with `npx ts-node validate-recipes.ts` before deploying. Returns exit code 0 on success, 1 on failure. Suitable for use as a `pre-push` git hook or CI check.

---

## Bootstrap
The app mounts on `DOMContentLoaded`, injects styles, renders `<div id="app">`, and calls `render()`. All state lives in a single `state` object. No persistence between page loads.

When the app boots, it checks for a `?recipe=recipe-id` URL parameter. If found and the recipe exists, it auto-selects that recipe, unlocks the audio context, and jumps directly to the Cooking screen.
