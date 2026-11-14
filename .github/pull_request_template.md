<!-- GitHub pre-fills this when a pull request is opened. Delete any section that does not apply. Keep personal recipe wording in the recipe files, not only in this description. -->

## Summary

<!-- One or two sentences: what a cook, or an agent using the site, can do after this change. -->

## Type of change

<!-- Check every box that applies. -->

- [ ] New recipe
- [ ] Recipe edit
- [ ] Ingredient or nutrition data
- [ ] App or WebMCP feature
- [ ] Fix
- [ ] Chore

## Recipes affected

<!-- Recipe ids and display names. Write "None" for tooling-only changes. -->

## What changed

<!-- Short bullets. Name screens, steps, and tools. Do not paste the whole recipe. -->

## How it was tested

<!-- Note what you actually ran. Delete lines you did not run. -->

- [ ] `npm run build` (typecheck, `dist/file.js`, recipe validation)
- [ ] `npm test`
- [ ] `npm run lint`
- [ ] Manual check on the prep screen
- [ ] Manual check on the cook screen
- [ ] Browser check of other pages touched

## Screenshots

<!-- Prep and cook screens for recipe edits. Skip if nothing visible changed. -->

## Nutrition and cost impact

<!-- Say whether calories, macros, or cost changed, and why. "None" if quantities and prices are untouched. -->

## WebMCP and agent tools impact

<!-- New or changed tools, or "None". Browsers without `document.modelContext` should stay the same. -->

## Checklist

- [ ] `dist/file.js` is rebuilt if this repo commits it and `src/file.ts` changed
- [ ] `llms.txt` and `README.MD` are updated if pages, commands, or agent tools changed
- [ ] Recipe ids used by bundles and `?recipe=` links still resolve
