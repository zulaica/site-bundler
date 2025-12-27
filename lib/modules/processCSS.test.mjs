import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { EMOJI } from '../helpers/constants.mjs';
import {
  inputCSS,
  inputDir,
  outputDir,
  processedCSS,
  setUpTestHooks
} from '../helpers/tests.mjs';
import processCSS from './processCSS.mjs';

describe(`${EMOJI.artistPalette} processCSS()`, () => {
  setUpTestHooks();

  it('should process CSS file and write output', async (sub) => {
    await writeFile(join(inputDir, 'style.hash.css'), inputCSS);

    await assert.doesNotReject(() => processCSS({ inputDir, outputDir }));

    const output = await readFile(join(outputDir, 'style.hash.css'), 'utf8');

    sub.test('minimized as a single line', () => {
      assert.equal(output, processedCSS);
    });
    sub.test('with whitespace trimmed', () => {
      assert.ok(output.trim().length < inputCSS.trim().length);
    });
    sub.test('with comments removed', () => {
      assert.doesNotMatch(output, /\/\*\*/);
    });
  });

  it('should handle CSS imports', async () => {
    await writeFile(join(inputDir, 'style.hash.css'), '@import "base.css";');
    await writeFile(join(inputDir, 'base.css'), inputCSS);

    await assert.doesNotReject(() => processCSS({ inputDir, outputDir }));

    const output = await readFile(join(outputDir, 'style.hash.css'), 'utf8');

    assert.ok(output.includes(processedCSS));
  });

  it('should handle empty CSS file', async () => {
    await writeFile(join(inputDir, 'style.hash.css'), '');

    await assert.doesNotReject(() => processCSS({ inputDir, outputDir }));

    const output = await readFile(join(outputDir, 'style.hash.css'), 'utf8');

    assert.equal(output, '');
  });

  it('should skip processing if CSS file does not exist', async () => {
    await assert.doesNotReject(() => processCSS({ inputDir, outputDir }));
  });
});
