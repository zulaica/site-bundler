import { cp, readdir } from 'fs/promises';
import { EMOJI, EXCLUSIONS, logMessage } from '../helpers/index.mjs';

const copyAssets = async ({ inputDir, outputDir }) => {
  const assets = await readdir(inputDir);
  const filteredAssets = assets.filter((asset) => !EXCLUSIONS.includes(asset));

  if (filteredAssets.length) {
    logMessage(
      `${EMOJI.cardIndexDividers}  Copying assets (0/${filteredAssets.length})`
    );
    for (const [index, asset] of filteredAssets.entries()) {
      logMessage(
        `${EMOJI.cardIndexDividers}  Copying assets (${index + 1}/${
          filteredAssets.length
        })`,
        true
      );
      await cp(`${inputDir}/${asset}`, `${outputDir}/${asset}`, {
        recursive: true
      });
    }
    logMessage('\n');
  }
};

export default copyAssets;
