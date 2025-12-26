#!/usr/bin/env node

import { program } from 'commander';
import { readFile } from 'node:fs/promises';
import { EMOJI, logError, logMessage } from './helpers/index.mjs';
import {
  copyAssets,
  preflight,
  processCSS,
  processHTML,
  processJS
} from './modules/index.mjs';

(async () => {
  const { version } = JSON.parse(
    await readFile(new URL('../package.json', import.meta.url))
  );
  program
    .version(version)
    .requiredOption('-i, --input-dir <input>', 'The input directory')
    .requiredOption('-o, --output-dir <output>', 'The output directory')
    .parse();
  const opts = program.opts();

  try {
    logMessage(`${EMOJI.constructionWorker} Site Bundler v${version}\n\n`);
    await preflight(opts.outputDir);
    await copyAssets(opts);
    await Promise.all([processCSS(opts), processJS(opts)]);
    await processHTML(opts);
    logMessage(`${EMOJI.package} Finished!`);
  } catch (error) {
    logError(error);
  } finally {
    logMessage('\n\n');
  }
})();
