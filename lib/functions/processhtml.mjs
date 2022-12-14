import { readFile, writeFile } from 'fs/promises';
import htmlnano from 'htmlnano';
import posthtml from 'posthtml';
import { hash } from 'posthtml-hash';
import { EMOJI, logError, logMessage, OPTIONS } from '../helpers/index.mjs';

const processhtml = async (input, output, file) => {
  logMessage(`${EMOJI.fileCabinet} Processing HTML`);
  try {
    const data = await readFile(`${input}/${file}`, { encoding: 'utf8' });
    await posthtml()
      .use(htmlnano(OPTIONS.posthtml.htmlnano, htmlnano.presets.safe))
      .use(hash({ path: output, pattern: new RegExp(/hash/) }))
      .process(data)
      .then(({ html }) => {
        writeFile(`${output}/${file}`, html, { encoding: 'utf8' });
      });
  } catch (error) {
    logError(error);
  } finally {
    logMessage('\n');
  }
};

export default processhtml;
