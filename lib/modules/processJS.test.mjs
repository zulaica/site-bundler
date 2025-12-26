import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { EMOJI } from '../helpers/constants.mjs';
import {
  inputDir,
  inputJS,
  outputDir,
  processedJS,
  setUpTestHooks
} from '../helpers/tests.mjs';
import processJS from './processJS.mjs';

describe(`${EMOJI.barChart} processJS()`, () => {
  setUpTestHooks();

  it('should process JavaScript file and write output', async (sub) => {
    await writeFile(join(inputDir, 'script.hash.js'), inputJS);

    await assert.doesNotReject(() => processJS({ inputDir, outputDir }));

    const output = await readFile(join(outputDir, 'script.hash.js'), 'utf8');

    sub.test('minimized as a single line', () => {
      assert.equal(output, processedJS);
    });
    sub.test('with whitespace trimmed', () => {
      assert.ok(output.trim().length < inputJS.trim().length);
    });
    sub.test('with comments removed', () => {
      assert.doesNotMatch(output, /\/\/ This is a comment/);
      assert.doesNotMatch(output, /\/\*\*/);
    });
  });

  it('should bundle ES modules', async () => {
    await writeFile(
      join(inputDir, 'script.hash.js'),
      `
      import sum from './input.js';
      console.log(sum(2, 3));
    `
    );
    await writeFile(join(inputDir, 'input.js'), inputJS);

    await assert.doesNotReject(() => processJS({ inputDir, outputDir }));

    const output = await readFile(join(outputDir, 'script.hash.js'), 'utf8');

    assert.ok(output.includes('const sum=(a,b)=>{return a+b}'));
  });

  it('should handle empty JavaScript file', async () => {
    await writeFile(join(inputDir, 'script.hash.js'), '');

    await assert.doesNotReject(() => processJS({ inputDir, outputDir }));

    const output = await readFile(join(outputDir, 'script.hash.js'), 'utf8');

    assert.equal(output, '');
  });
});
