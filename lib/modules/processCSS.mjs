import cssnanoPlugin from "cssnano";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import postcss from "postcss";
import atImport from "postcss-import";
import postcssPresetEnv from "postcss-preset-env";
import url from "postcss-url";
import { EMOJI, OPTIONS } from "../helpers/constants.mjs";
import Logger from "../helpers/logger.mjs";

const { cssnano, url: cssUrl } = OPTIONS.postcss;

const postcssProcessor = postcss()
  .use(atImport())
  .use(postcssPresetEnv())
  .use(url(cssUrl))
  .use(cssnanoPlugin(cssnano));

const processCSS = async ({ inputDir, outputDir }) => {
  const assets = await readdir(inputDir);
  const file = "style.hash.css";

  if (!assets.includes(file)) {
    return;
  }

  Logger.message(`${EMOJI.artistPalette} Processing styles…`);

  const input = join(inputDir, file);
  const output = join(outputDir, file);
  const data = await readFile(input, { encoding: "utf8" });
  const code = await processCSSData(input, data);

  await writeFile(output, code);

  Logger.message(`${EMOJI.artistPalette} Processed styles`, true);
};

export async function processCSSData(input, data) {
  const { css } = await postcssProcessor.process(data, { from: input });

  return css;
}

export default processCSS;
