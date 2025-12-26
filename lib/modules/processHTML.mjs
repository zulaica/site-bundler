import htmlnano from 'htmlnano';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import posthtml from 'posthtml';
import { hash } from 'posthtml-hash';
import { EMOJI, OPTIONS } from '../helpers/constants.mjs';
import Logger from '../helpers/logger.mjs';

const { htmlnano: htmlnanoOptions } = OPTIONS.posthtml;

const processHTML = async ({ inputDir, outputDir }) => {
  Logger.message(`${EMOJI.fileCabinet} Processing HTML…`);
  const file = 'index.html';
  const input = join(inputDir, file);
  const output = join(outputDir, file);

  const data = await readFile(input, { encoding: 'utf8' });
  const code = await _processData(outputDir, data);

  await writeFile(output, code);

  Logger.message(`${EMOJI.fileCabinet} Processed HTML\n`, true);
};

async function _processData(path, data) {
  let posthtmlInstance = posthtml().use(
    htmlnano(htmlnanoOptions, htmlnano.presets.safe)
  );

  /* node:coverage disable */
  // Skip hash replacement during tests
  if (process.env.NODE_ENV !== 'test') {
    posthtmlInstance = posthtmlInstance.use(
      hash({ path, pattern: new RegExp(/hash/) })
    );
  }
  /* node:coverage enable */

  const { html } = await posthtmlInstance.process(data);

  return html;
}

export default processHTML;
