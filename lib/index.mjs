#!/usr/bin/env node

import { program } from 'commander';
import { access, readFile } from 'node:fs/promises';
import { EMOJI } from './helpers/constants.mjs';
import Logger from './helpers/logger.mjs';
import {
  copyAssets,
  preflight,
  processCSS,
  processHTML,
  processJS
} from './modules/index.mjs';

const { version } = JSON.parse(
  await readFile(new URL('../package.json', import.meta.url))
);
program
  .version(version)
  .requiredOption('-i, --input-dir <input>', 'The input directory')
  .requiredOption('-o, --output-dir <output>', 'The output directory')
  .parse();
const opts = program.opts();

async function validateInput() {
  try {
    await access(opts.inputDir);
  } catch {
    Logger.error(`Input directory does not exist: ${opts.inputDir}`);
  }
}

try {
  Logger.message(`${EMOJI.constructionWorker} Site Bundler v${version}\n\n`);

  await validateInput();
  await preflight(opts.outputDir);
  await copyAssets(opts);
  await processCSS(opts);
  await processJS(opts);
  await processHTML(opts);

  Logger.message(`${EMOJI.package} Finished!`);
} catch (error) {
  Logger.error(error);
} finally {
  Logger.message('\n\n');
}
