import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const budget = JSON.parse(readFileSync(new URL('../guardrails.json', import.meta.url), 'utf8'));
const { lines, branches, functions } = budget.coverage;
const result = spawnSync(
    process.execPath,
    [
        '--disable-warning=MODULE_TYPELESS_PACKAGE_JSON',
        '--experimental-test-coverage',
        `--test-coverage-lines=${lines}`,
        `--test-coverage-branches=${branches}`,
        `--test-coverage-functions=${functions}`,
        '--experimental-test-isolation=process',
        '--test',
        'tests/*.test.mjs',
    ],
    { stdio: 'inherit' },
);
process.exit(result.status ?? 1);
