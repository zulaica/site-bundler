import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { EMOJI, TESTS } from '../helpers/index.mjs';
import processHTML from './processHTML.mjs';

const { inputDir, inputHTML, outputDir, processedHTML } = TESTS;

describe(`${EMOJI.fileCabinet} processHTML()`, () => {
  TESTS.setup();

  it('should process HTML file and write output', async (sub) => {
    await writeFile(join(inputDir, 'index.html'), inputHTML);
    await processHTML({ inputDir, outputDir });

    const output = await readFile(join(outputDir, 'index.html'), 'utf8');

    sub.test('minimized as a single line', () => {
      assert.equal(output, processedHTML);
    });
    sub.test('with whitespace trimmed', () => {
      assert.ok(output.trim().length < inputHTML.trim().length);
      assert.ok(output.includes('Test Site'));
      assert.ok(output.includes('Article Title'));
    });
    sub.test('with comments removed', () => {
      assert.doesNotMatch(output, /<!--/);
    });
    sub.test('with boolean attributes handled correctly', () => {
      assert.ok(output.includes('disabled'));
      assert.doesNotMatch(output, /disabled="disabled"/);
    });
  });

  it('should handle empty HTML file', async () => {
    await writeFile(join(inputDir, 'index.html'), '');
    await processHTML({ inputDir, outputDir });

    const output = await readFile(join(outputDir, 'index.html'), 'utf8');

    assert.equal(output, '');
  });
});
