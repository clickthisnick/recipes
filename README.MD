# Recipes

Personal kitchen tools. The live site is [clickthisnick.com/recipes](https://www.clickthisnick.com/recipes).

## Run locally

```bash
npm ci
npm run build    # typecheck src/file.ts, write dist/file.js, validate recipes
npm start        # http://localhost:3000/  (PORT overrides the port)
npm test
npm run lint
```

`npm run dev` starts Vite for work on `src/file.ts`. The recipe app is [dist/main.html](http://localhost:3000/dist/main.html). Open a single recipe with `?recipe=`, for example `dist/main.html?recipe=blueprint-smoothie`.

`npm run audit-amazon` checks Amazon prices. It needs Chrome already listening on the debugging port described in `scripts/audit-products.js`. It does not run in CI.

## Tools

- [Recipes](https://www.clickthisnick.com/recipes/dist/main.html)
- [Nutrition tracker](https://www.clickthisnick.com/recipes/tracker.html)
- [Meat temperature](https://www.clickthisnick.com/recipes/meatTemp.html)
- [Water intake](https://www.clickthisnick.com/recipes/waterIntake.html)
- [Grocery list](https://www.clickthisnick.com/recipes/groceryList.html)
- [Expiration calculator](https://www.clickthisnick.com/recipes/expirationCalculator.html)
- [Pull cord slicer amount](https://www.clickthisnick.com/recipes/cordSlicer.html)
- [Frozen food portions](https://www.clickthisnick.com/recipes/frozenFood.html)
- [Eat this instead](https://www.clickthisnick.com/recipes/eatThis.html)

Recipes are edited in `src/file.ts`. `npm run build` writes `dist/file.js`, and GitHub Pages serves that file plus `dist/main.html`. The other tools are the HTML files at the repo root. The expiration page fills its dates in the browser. `archived/` is old recipe notes and is not part of the site. `llms.txt` describes the controls for a browser agent.
