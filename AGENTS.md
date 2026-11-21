# AGENTS.md

Personal recipe app. The source of truth is `src/file.js` (plain JavaScript, JSDoc types). `main.html` loads it with `src/app.css`. Do not read or print all of `src/file.js`; search with `rg`, then read a narrow range.

## Before you finish

Run `npm run check`. It is the only required command. It runs, in order:

1. Prettier (`src/file.js` is excluded so `s(name.add(` stays on one line for the recipe validator)
2. ESLint (flat config)
3. `tsc --noEmit`
4. html-validate
5. stylelint
6. codespell
7. actionlint
8. recipe validation
9. tests with the coverage floor in `guardrails.json`
10. the shipped-asset size budget in `guardrails.json`

`npm test` is the same tests without the coverage floor. It still typechecks and validates first.

## Rules

- Plain JavaScript with JSDoc. No build step and no generated `dist/` bundle. `dist/main.html` is only a redirect to `../main.html` that keeps the query string and hash. Do not delete it.
- Keep `archived/` untouched.
- Recipes stay as code in `src/file.js`, not JSON.
- Do not add a dependency without a stated reason. Current tool dependencies: Prettier, ESLint, TypeScript, html-validate, stylelint, actionlint, and lefthook are the checks; linkedom renders the app in Node so coverage can reach the screens without a browser.
- Every bug fix gets a test.
- Never lower the coverage floor or the size budget in `guardrails.json`.
- Do not make visible UI changes unless asked.
- Keep existing URLs working, including the `dist/main.html` redirect.
- `src/requirements.md` is notes, not the source of truth. Other notes are in `docs/notes/`. The product prompt is `docs/prompts/ingest-product-prompt`.
- Before editing HTML, CSS, or client-side JavaScript, read `.agents/skills/modern-web-guidance/SKILL.md` and follow it.
- New ingredients go at the end of `export const i`. Reuse an existing `i.*` ingredient instead of adding a near-duplicate. In step text, wrap ingredients with `formatIngredient(...)`.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on push and pull request with `contents: read`. The job installs dependencies and runs `npm run check` only. Dependabot updates npm and GitHub Actions weekly, in one group each. Lefthook (`lefthook.yml`) runs Prettier, ESLint, stylelint, html-validate, and codespell on commit. Those hooks are not a substitute for `npm run check`.
