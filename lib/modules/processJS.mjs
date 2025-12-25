import { transformFromAstAsync } from '@babel/core';
import { parse } from '@babel/parser';
import { readFile, writeFile } from 'fs/promises';
import { rollup } from 'rollup';
import { EMOJI, OPTIONS, logMessage } from '../helpers/index.mjs';

const processJS = async ({ inputDir, outputDir }) => {
  logMessage(`${EMOJI.barChart} Processing scripts`);
  logMessage('\n');
  const file = 'script.hash.js';
  const input = `${inputDir}/${file}`;
  const output = `${outputDir}/${file}`;

  await _bundleJS(input, output);
  const data = await readFile(output, { encoding: 'utf8' });
  const code = await _processData(data);
  await writeFile(output, code);
};

async function _bundleJS(input, output) {
  const bundle = await rollup({ input });
  await bundle.write({ file: output });
  await bundle.close();
}

async function _processData(data) {
  const ast = parse(data, { sourceType: 'module' });
  const { code } = await transformFromAstAsync(ast, data, OPTIONS.babel);

  return code;
}

export default processJS;
