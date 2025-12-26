import assert from 'node:assert/strict';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { EMOJI } from '../helpers/constants.mjs';
import { outputDir, setUpTestHooks } from '../helpers/tests.mjs';
import preflight from './preflight.mjs';

describe(`${EMOJI.fileFolder} preflight()`, () => {
  setUpTestHooks();

  it('should create output directory if it does not exist', async () => {
    const nonExistentDir = join(outputDir, 'non-existent');
    await assert.doesNotReject(() => preflight(nonExistentDir));

    const files = await readdir(nonExistentDir);

    assert.ok(files !== undefined);
    assert.deepEqual(files, []);
  });

  it('should remove all files and recreate output directory', async () => {
    await mkdir(join(outputDir, 'subdir'), { recursive: true });
    await writeFile(join(outputDir, 'file1.txt'), '');
    await writeFile(join(outputDir, 'file2.txt'), '');
    await writeFile(join(outputDir, 'subdir', 'file3.txt'), '');

    const initialFiles = await readdir(outputDir, { withFileTypes: true });

    assert.ok(initialFiles.length > 0);
    await assert.doesNotReject(() => preflight(outputDir));

    const finalFiles = await readdir(outputDir);

    assert.deepEqual(finalFiles, []);
  });
});
