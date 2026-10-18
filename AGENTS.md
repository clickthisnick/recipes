# AGENTS.md

This is a personal recipes project. Keep all recipe and product data, plus code, in the canonical TypeScript source file.

## Scope

- Canonical source: `src/file.ts`. Read and edit here.
- `dist/` is generated build output. Out of scope: do not read or edit it.
- `archived/` is dead code. Out of scope.
- `src/requirements.md` is reference/spec documentation, not source of truth.
- `node_modules/` and `dist/` are never inspected.

## Working with src/file.ts (cost-sensitive)

`src/file.ts` is very large, so do not read or print the whole file. Prefer targeted commands:

- Start with `rg -n` to locate symbols, then `sed -n 'A,Bp' src/file.ts` for narrow ranges.
- Locate ingredients with `rg -n "ingredientFactory|export const i"`.
- Locate recipes with `rg -n "registerGroup|registerRecipe|withPlan\\(createRecipe"`.
- Add new ingredient entries near the end of `export const i`, not in the middle of unrelated blocks.
- Reuse existing `i.*` ingredients instead of adding near-duplicates.

## Adding a Recipe

1. Add missing ingredient entries with nutrition/conversions in `src/file.ts`.
2. Add the recipe to the matching existing group array (Breakfast, Dinner, etc.) unless standalone registration is required.
3. Use `formatIngredient(...)` in instruction text whenever an ingredient is listed in a step.
4. Run `npm run build`. Fix any validation failure; non-blocking warnings are acceptable unless they are new for your recipe.
5. When the build passes, report that; do not paste the full build output.
