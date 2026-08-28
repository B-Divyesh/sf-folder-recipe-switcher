import { spawnSync } from 'node:child_process';

const grepIndex = process.argv.indexOf('--grep');
const pattern = grepIndex >= 0 ? process.argv[grepIndex + 1] : '@claim:';
if (!pattern) {
  console.error('Usage: npm run test:claims -- --grep @claim:<id>');
  process.exit(2);
}

for (const [command, args] of [
  ['npm', ['run', 'build']],
  ['node', ['--test', `--test-name-pattern=${pattern}`, 'site/tests/claims.test.mjs']],
]) {
  const result = spawnSync(command, args, { cwd: process.cwd(), stdio: 'inherit', env: process.env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
