# Recipe app rules

`src/file.js` is the source of truth. This file only records the rules that are easy to break and hard to see from one function: how steps lock, how a day is scheduled, why the alarm is unlocked the way it is, and how to author a recipe the validator will accept.

There is no build step. Browsers run `src/file.js`. `dist/main.html` only redirects to `../main.html` and keeps the query string and hash.

## What is saved

Three `localStorage` keys survive a reload:

- `recipe-plan-config` — the Plan screen's time blocks and calorie cutoff
- `recipe-show-hidden` — the Select screen's "Show hidden" toggle
- `recipe-inventory` — shopping "have" quantities

The current selection, cooking progress, and the Tried/Purchased checkboxes on the static pages are not saved. There is no favorites list.

## Step locking

Every step claims its equipment (by name) and ingredients (by object identity) when the cooking plan is built. A later step that uses the same claim is locked until the earlier step is completed, skipped, or ringing. Equipment claims are `recipeId::eq::name`, so two recipes do not block each other. Two calls to `i.avocadoOil()` are different objects and do not share a claim.

`step.waitFor(...steps)` adds a manual dependency the claim keys cannot see, such as "don't dip until the panko is in the bowl". A locked step unlocks when every step it waits on is gone from the DOM or has `.completed`, `.skipped`, or `.ringing`. `.ringing` counts because the cook time has already elapsed.

## Plan scheduling

`withPlan(createRecipe(...), { planMinutes, portable, prepMinutes, perishableDays })` tags a recipe for the Plan screen. Blocks are `home`, `portable`, or `away`. A home recipe fits `home` and `portable` blocks; a portable recipe fits any block that is not `away`. Placement is greedy in recipe-list order: a block's cursor advances by `planMinutes` when the recipe fits. If it does not fit, the recipe is unscheduled. Recipes with no `planMinutes` are listed and do not advance the cursor. Prep time and perishable days are shown as batch-prep notes, not as schedule blocks.

## Alarm and unlock

`unlockAudioContext()` must play and pause the shared alarm `Audio` element during a user gesture (or immediately for a `?recipe=` link). Safari grants autoplay per element. A throwaway `new Audio()` does not unlock the element that later rings from `setInterval`.

Countdowns store one end timestamp (`Date.now() + durationSeconds * 1000`). A late tick fires immediately instead of catching up one second at a time. While a countdown runs, the page holds a screen wake lock so the phone does not sleep and suspend the timer. The lock is released when nothing is counting and requested again if the page becomes visible mid-timer.

A ringing card shows how overdue the deadline is and keeps updating until Stop Alarm. The alarm repeats every 30 seconds. If `play()` is rejected, a banner asks for a tap and the error is written on the ringing card.

## Authoring

```js
withPlan(createRecipe('my-recipe', 'My Recipe', (() => {
    const pan = e.pan();
    const steps = [];
    const s = (...newSteps) => steps.push(...newSteps);
    const EGG = i.egg(3, u.unit);

    s(pan.add([EGG]));
    s(pan.cook('Cook eggs', time.minutes(5)));
    return steps;
})(), undefined, 12), { planMinutes: 5 });
```

- Reuse one ingredient object when later steps must lock or transfer that same item. A second `i.egg(...)` is a different item.
- `e.pan()` is the NuWave pan: preheat is 45 seconds at 350° or below and 2 minutes above 350°. Other equipment preheats for 15 minutes.
- `transfer()` throws at definition time if the ingredient is not in the source vessel.
- `prep(text)` shows on Prep and Cooking. `prepOnly(text)` shows on Prep only.
- `requiresDateLabel: true` inserts a "write today's date" step after the ingredient's last use.
- `defaultBrand` is only for when the chosen product is not the first one. Nutrition comes from that product's label, otherwise the ingredient's own label. Do not blend brands.
- A `Product` is the SKU (brand, variant, size, nutrition). A `Listing` is one place to buy it (`store`, `link`, `price`, `discount`). Several stores are several listings on one product.
- Subscribe & Save is `subscribeAndSave5`, `subscribeAndSave10`, or `subscribeAndSave15` set to `true`. The dollar price is `price × (1 − percent/100)` and is shown only for `stores.amazon`.
- A density conversion lives on the ingredient, not the global unit table: `conversions: { [u.cup.name]: { to: u.ounce, factor: 8.93 } }`.

## Validator

`npm test` runs `tsc --noEmit` and then `scripts/validate-recipes.js`. Failures:

1. `unlockAudioContext()` must call `play()` on the shared alarm element and must not construct a second `Audio`.
2. Two `.add()` calls on the same equipment variable with no step between them.
3. A nutrition label that repeats both sides of a `conversions` pair, or two identical entries.
4. An `instruction()` that lists ingredients but does not state an amount. Use `` `${formatIngredient(ITEM)}` `` or write the amount in the text. `Equipment.add()` is exempt.
5. Step text that repeats a temperature already carried by `.cook()`, `.place()`, `.preheat()`, or `.setTemp()`.
6. A pan step that heats an oil above that oil's smoke point. Boiling in water is not flagged.

Warnings, which do not fail the run:

- Nutrition that is all zeros, except ingredients on the known-zero list (water and the like).
- Step text that names an equipment type or ingredient the step does not declare. `info()` steps and steps built by equipment methods are not scanned.

`transfer()` throws while the recipe module is loading. `npm test` imports that module, so an impossible transfer fails the run even though this script only reads the source text.
