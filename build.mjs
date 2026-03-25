import { build } from 'esbuild';

await build({
  entryPoints: ['src/cli.tsx'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node20',
  outfile: 'dist/cli.mjs',
  banner: {
    js: [
      '#!/usr/bin/env node',
      'import { createRequire } from "module";',
      'const require = createRequire(import.meta.url);',
    ].join('\n'),
  },
  alias: {
    'react-devtools-core': './src/shims/empty.mjs',
  },
});
