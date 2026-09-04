# AGENTS.md

This is a personal recipes project. Keep all recipe and product data, plus code, in the canonical TypeScript source file.

- Canonical source: `src/file.ts`. This is the single file to read and edit for the recipe system.
- `dist/` is generated build output (`npm run build` / `tsc`). Treat it as out of scope — do not read or edit it.
- `archived/` is dead code kept for history only. Treat it as out of scope.
- `src/requirements.md` is reference/spec documentation. Use it only as a reference, do not treat it as source of truth for code.
- `node_modules/` is ignored; never inspect or rely on it.
