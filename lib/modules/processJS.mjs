import { transformFromAstAsync } from '@babel/core';
import { parse } from '@babel/parser';
import { readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { rollup } from 'rollup';
import { EMOJI, OPTIONS } from '../helpers/constants.mjs';
import Logger from '../helpers/logger.mjs';

const { babel: babelOptions, rollup: rollupOptions } = OPTIONS;

const processJS = async ({ inputDir, outputDir }) => {
  const assets = await readdir(inputDir);
  const file = 'script.hash.js';

  if (!assets.includes(file)) {
    return;
  }

  Logger.message(`${EMOJI.barChart} Processing scripts…`);

  const input = join(inputDir, file);
  const output = join(outputDir, file);
  const bundledCode = await _bundleJS(input);
  const code = await _processData(bundledCode);

  await writeFile(output, code);

  Logger.message(`${EMOJI.barChart} Processed scripts\n`, true);
};

async function _bundleJS(input) {
  const bundle = await rollup({
    input,
    ...rollupOptions
  });
  const { output } = await bundle.generate({ format: 'es' });

  await bundle.close();

  return output[0].code;
}

async function _processData(data) {
  const ast = parse(data, { sourceType: 'module' });
  const { code } = await transformFromAstAsync(ast, data, babelOptions);

  return code;
}

export default processJS;
