import { readFile, writeFile } from 'fs/promises';
import htmlnano from 'htmlnano';
import posthtml from 'posthtml';
import { hash } from 'posthtml-hash';
import { EMOJI, OPTIONS, logMessage } from '../helpers/index.mjs';

const processHTML = async ({ inputDir, outputDir }) => {
  logMessage(`${EMOJI.fileCabinet} Processing HTML`);
  const file = 'index.html';
  const input = `${inputDir}/${file}`;
  const output = `${outputDir}/${file}`;

  const data = await readFile(input, { encoding: 'utf8' });
  const code = await _processData(outputDir, data);

  await writeFile(output, code);

  logMessage('\n');
};

async function _processData(outputDir, data) {
  let posthtmlInstance = posthtml().use(
    htmlnano(OPTIONS.posthtml.htmlnano, htmlnano.presets.safe)
  );

  /* node:coverage disable */
  // Skip hash replacement during tests
  if (process.env.NODE_ENV !== 'test') {
    posthtmlInstance = posthtmlInstance.use(
      hash({ path: outputDir, pattern: new RegExp(/hash/) })
    );
  }
  /* node:coverage enable */

  const { html } = await posthtmlInstance.process(data);

  return html;
}

export default processHTML;
