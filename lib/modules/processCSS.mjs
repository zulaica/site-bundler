import cssnanoPlugin from 'cssnano';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import postcss from 'postcss';
import atImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';
import url from 'postcss-url';
import { EMOJI, OPTIONS } from '../helpers/constants.mjs';
import Logger from '../helpers/logger.mjs';

const { cssnano, url: cssUrl } = OPTIONS.postcss;

const postcssProcessor = postcss()
  .use(atImport())
  .use(postcssPresetEnv())
  .use(url(cssUrl))
  .use(cssnanoPlugin(cssnano));

const processCSS = async ({ inputDir, outputDir }) => {
  Logger.message(`${EMOJI.artistPalette} Processing styles…`);

  const file = 'style.hash.css';
  const input = join(inputDir, file);
  const output = join(outputDir, file);

  const data = await readFile(input, { encoding: 'utf8' });
  const code = await _processData(input, data);

  await writeFile(output, code);

  Logger.message(`${EMOJI.artistPalette} Processed styles\n`, true);
};

async function _processData(input, data) {
  const { css } = await postcssProcessor.process(data, { from: input });

  return css;
}

export default processCSS;
