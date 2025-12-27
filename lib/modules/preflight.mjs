import { mkdir, readdir, rm } from 'node:fs/promises';
import { EMOJI } from '../helpers/constants.mjs';
import Logger from '../helpers/logger.mjs';

const preflight = async (outputDir) => {
  try {
    const files = await readdir(outputDir);

    if (files.length) {
      Logger.message(`${EMOJI.wastebasket} Removing old ${outputDir} files…`);

      await rm(outputDir, { recursive: true, force: true });
      await mkdir(outputDir);

      Logger.message(
        `${EMOJI.wastebasket} Removed old ${outputDir} files\n`,
        true
      );
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      Logger.message(`${EMOJI.fileFolder} Creating ${outputDir} directory…`);

      await mkdir(outputDir);

      Logger.message(
        `${EMOJI.fileFolder} Created ${outputDir} directory\n`,
        true
      );
    } else {
      Logger.error(`${error} \n`);
    }
  }
};

export default preflight;
