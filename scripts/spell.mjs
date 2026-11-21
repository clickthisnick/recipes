import { spawnSync } from 'node:child_process';
import { delimiter } from 'node:path';
import { homedir } from 'node:os';

// codespell has no maintained npm package. Install the same pin CI can run
// without a separate workflow step, then spell-check the repo.
const skip = './package-lock.json,./node_modules/*,./.agents/*,./archived/*';
const args = ['-L', 'bu,steams', '--skip', skip];
const env = { ...process.env, PATH: `${homedir()}/.local/bin${delimiter}${process.env.PATH}` };

if (spawnSync('codespell', ['--version'], { env, stdio: 'ignore' }).status !== 0) {
    const pip = spawnSync('python3', ['-m', 'pip', 'install', '--user', 'codespell==2.4.1'], { stdio: 'inherit' });
    if (pip.status !== 0) process.exit(pip.status ?? 1);
}

const result = spawnSync('codespell', args, { env, stdio: 'inherit' });
process.exit(result.status ?? 1);
