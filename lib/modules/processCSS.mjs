import cssnanoPlugin from 'cssnano';
import { readFile, writeFile } from 'fs/promises';
import postcss from 'postcss';
import atImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';
import url from 'postcss-url';
import { EMOJI, OPTIONS, logMessage } from '../helpers/index.mjs';

const processCSS = async ({ inputDir, outputDir }) => {
  logMessage(`${EMOJI.artistPalette} Processing styles`);
  logMessage('\n');

  const file = 'style.hash.css';
  const input = `${inputDir}/${file}`;
  const output = `${outputDir}/${file}`;

  const data = await readFile(input, { encoding: 'utf8' });
  const code = await _processData(input, data);

  await writeFile(output, code);
};

async function _processData(input, data) {
  const { css } = await postcss()
    .use(atImport())
    .use(postcssPresetEnv())
    .use(url(OPTIONS.postcss.url))
    .use(cssnanoPlugin(OPTIONS.postcss.cssnano))
    .process(data, { from: input });

  return css;
}

export default processCSS;
