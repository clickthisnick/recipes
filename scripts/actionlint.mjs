import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createLinter } from 'actionlint';

// actionlint is the workflow linter. The npm package runs the official wasm
// build, so `npm run check` does not need a separate Go install.
const lint = await createLinter();
const dir = '.github/workflows';
const names = (await readdir(dir)).filter((name) => name.endsWith('.yml') || name.endsWith('.yaml'));
let failed = false;
for (const name of names) {
    const path = join(dir, name);
    const source = await readFile(path, 'utf8');
    for (const problem of lint(source, path)) {
        failed = true;
        console.error(`${problem.file}:${problem.line}:${problem.column}: ${problem.message}`);
    }
}
if (failed) process.exit(1);
