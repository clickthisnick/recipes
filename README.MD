# Recipes

Personal kitchen tools. The live site is [clickthisnick.com/recipes](https://www.clickthisnick.com/recipes).

## Run locally

```bash
npm ci
npm start        # http://localhost:3000/  (PORT overrides the port)
npm test         # typecheck src/file.js, validate recipes, run the tests
npm run lint
```

The recipe app is [main.html](http://localhost:3000/main.html). Open a single recipe with `?recipe=`, for example `main.html?recipe=blueprint-smoothie`. Old `dist/main.html` links redirect there and keep the query string.

There is no build step. Browsers run `src/file.js` as written; its types live in JSDoc comments and `npm run typecheck` checks them with `tsc --noEmit`.

`npm run audit-amazon` checks Amazon prices. It needs Chrome already listening on the debugging port described in `scripts/audit-products.js`. It does not run in CI.

## Tools

- [Recipes](https://www.clickthisnick.com/recipes/main.html)
- [Nutrition tracker](https://www.clickthisnick.com/recipes/tracker.html)
- [Meat temperature](https://www.clickthisnick.com/recipes/meatTemp.html)
- [Water intake](https://www.clickthisnick.com/recipes/waterIntake.html)
- [Grocery list](https://www.clickthisnick.com/recipes/groceryList.html)
- [Expiration calculator](https://www.clickthisnick.com/recipes/expirationCalculator.html)
- [Pull cord slicer amount](https://www.clickthisnick.com/recipes/cordSlicer.html)
- [Frozen food portions](https://www.clickthisnick.com/recipes/frozenFood.html)
- [Eat this instead](https://www.clickthisnick.com/recipes/eatThis.html)

Recipes are edited in `src/file.js`. The app is the one page above. The other tools are the HTML files at the repo root. The expiration page fills its dates in the browser. `archived/` is old recipe notes and is not part of the site. `llms.txt` describes the controls for a browser agent.
