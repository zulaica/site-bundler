import { transformFromAstAsync } from '@babel/core';
import { parse } from '@babel/parser';
import { writeFile } from 'fs/promises';
import { rollup } from 'rollup';
import { EMOJI, OPTIONS, logMessage } from '../helpers/index.mjs';

const processJS = async ({ inputDir, outputDir }) => {
  logMessage(`${EMOJI.barChart} Processing scripts`);
  logMessage('\n');
  const file = 'script.hash.js';
  const input = `${inputDir}/${file}`;
  const output = `${outputDir}/${file}`;

  const bundledCode = await _bundleJS(input);
  const code = await _processData(bundledCode);
  await writeFile(output, code);
};

async function _bundleJS(input) {
  const bundle = await rollup({ input });
  const { output } = await bundle.generate({ format: 'es' });
  await bundle.close();
  return output[0].code;
}

async function _processData(data) {
  const ast = parse(data, { sourceType: 'module' });
  const { code } = await transformFromAstAsync(ast, data, OPTIONS.babel);

  return code;
}

export default processJS;
