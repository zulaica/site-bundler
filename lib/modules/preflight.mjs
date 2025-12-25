import { mkdir, readdir, rm } from 'fs/promises';
import { EMOJI, logError, logMessage } from '../helpers/index.mjs';

const preflight = async (outputDir) => {
  try {
    const files = await readdir(outputDir);

    if (files.length) {
      logMessage(`${EMOJI.wastebasket} Removing old ${outputDir} files`);
      await rm(outputDir, { recursive: true, force: true });
      await mkdir(outputDir);
      logMessage('\n');
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      logMessage(`${EMOJI.fileFolder} Creating ${outputDir} directory\n`);
      await mkdir(outputDir);
    } else {
      logError(`${error} \n`);
    }
  }
};

export default preflight;
