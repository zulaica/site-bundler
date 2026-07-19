import { cp, readdir } from "node:fs/promises";
import { join } from "node:path";
import { EMOJI, EXCLUSIONS } from "../helpers/constants.mjs";
import Logger from "../helpers/logger.mjs";

const copyAssets = async ({ inputDir, outputDir }) => {
  const assets = await readdir(inputDir);
  const filteredAssets = assets.filter((asset) => !EXCLUSIONS.includes(asset));

  if (!filteredAssets.length) {
    return;
  }

  Logger.message(
    `${EMOJI.cardIndexDividers}  Copying ${filteredAssets.length} assets…`,
  );

  await Promise.all(
    filteredAssets.map(async (asset) => {
      await cp(join(inputDir, asset), join(outputDir, asset), {
        recursive: true,
      });
    }),
  );

  Logger.message(
    `${EMOJI.cardIndexDividers}  Copied ${filteredAssets.length} assets`,
    true,
  );
};

export default copyAssets;
