# AGENTS.md

This is a personal recipes project. Keep all recipe and product data, plus code, in the canonical source file.

## Scope

- Canonical source: `src/file.js`. Read and edit here. It is plain JavaScript that browsers run directly; types are JSDoc comments checked by `npm run typecheck` (`tsc --noEmit`). There is no build step and no `dist/`.
- `main.html` is the small app shell that loads `src/file.js` and `src/app.css` (the app's styles).
- `archived/` is dead code. Out of scope.
- `src/requirements.md` is reference/spec documentation, not source of truth.
- `node_modules/` is never inspected.

## Modern Web Guidance

- Before writing or editing web UI, CSS, or client-side JS (including HTML pages, dialogs, forms, animations, accessibility, and performance), consult `modern-web-guidance` first: `npx -y modern-web-guidance@latest search "<focused query>"`, then `retrieve "<id>"` for relevant guides.
- Follow the skill instructions in `.agents/skills/modern-web-guidance/SKILL.md`, including retrieving broader discipline guides (e.g., `html`, `css`, `forms`, `accessibility`, `performance`, `security`) when they apply.
- Keep browser-support fallbacks as the guides require unless the user specifies a custom support policy.

## Working with src/file.js (cost-sensitive)

`src/file.js` is very large, so do not read or print the whole file. Prefer targeted commands:

- Start with `rg -n` to locate symbols, then `sed -n 'A,Bp' src/file.js` for narrow ranges.
- Locate ingredients with `rg -n "ingredientFactory|export const i"`.
- Locate recipes with `rg -n "registerGroup|registerRecipe|withPlan\\(createRecipe"`.
- Add new ingredient entries near the end of `export const i`, not in the middle of unrelated blocks.
- Reuse existing `i.*` ingredients instead of adding near-duplicates.

## Adding a Recipe

1. Add missing ingredient entries with nutrition/conversions in `src/file.js`.
2. Add the recipe to the matching existing group array (Breakfast, Dinner, etc.) unless standalone registration is required.
3. Use `formatIngredient(...)` in instruction text whenever an ingredient is listed in a step.
4. Run `npm test` (it typechecks, validates recipes, then runs the tests). Fix any type error or validation failure; non-blocking warnings are acceptable unless they are new for your recipe.
5. When it passes, report that; do not paste the full output.
