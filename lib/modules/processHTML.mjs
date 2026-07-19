import htmlnano from "htmlnano";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import posthtml from "posthtml";
import { hash } from "posthtml-hash";
import { EMOJI, OPTIONS } from "../helpers/constants.mjs";
import Logger from "../helpers/logger.mjs";
import { processJSData } from "./processJS.mjs";

const { htmlnano: htmlnanoOptions } = OPTIONS.posthtml;

const processHTML = async ({ inputDir, outputDir }) => {
  Logger.message(`${EMOJI.fileCabinet} Processing HTML…`);
  const file = "index.html";
  const input = join(inputDir, file);
  const output = join(outputDir, file);

  const data = await readFile(input, { encoding: "utf8" });
  const code = await processHTMLData(outputDir, data);

  await writeFile(output, code);

  Logger.message(`${EMOJI.fileCabinet} Processed HTML`, true);
};

async function processHTMLData(path, data) {
  let posthtmlInstance = posthtml()
    .use(processInlineScripts())
    .use(htmlnano(htmlnanoOptions, htmlnano.presets.safe));

  /* node:coverage disable */
  // Do not perform hash replacement when running tests
  if (process.env.NODE_ENV !== "test") {
    posthtmlInstance = posthtmlInstance.use(
      hash({ path, pattern: new RegExp(/hash/) }),
    );
  }
  /* node:coverage enable */

  const { html } = await posthtmlInstance.process(data);

  return html;
}

function processInlineScripts() {
  return async function (tree) {
    const scriptsToProcess = [];

    tree.walk((node) => {
      if (node.tag === "script" && node.content && !node.attrs?.src) {
        const scriptContent = Array.isArray(node.content)
          ? node.content.join("")
          : node.content;

        scriptsToProcess.push({ node, content: scriptContent });
      }

      return node;
    });

    await Promise.all(
      scriptsToProcess.map(async ({ node, content }) => {
        node.content = await processJSData(content);
      }),
    );
  };
}

export default processHTML;
