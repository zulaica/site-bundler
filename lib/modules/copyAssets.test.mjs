import { mkdir, readdir, writeFile } from 'fs/promises';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { join } from 'path';
import { EMOJI, TESTS } from '../helpers/index.mjs';
import copyAssets from './copyAssets.mjs';

const { inputCSS, inputDir, inputHTML, inputJS, outputDir } = TESTS;

describe(`${EMOJI.cardIndexDividers}  copyAssets()`, () => {
  TESTS.setup();

  it('should copy all non-excluded assets', async () => {
    await writeFile(join(inputDir, 'image.png'), '');
    await writeFile(join(inputDir, 'document.pdf'), '');
    await writeFile(join(inputDir, 'script.js'), inputJS);
    await copyAssets({ inputDir, outputDir });

    const copiedFiles = await readdir(outputDir);

    assert.deepEqual(copiedFiles.sort(), [
      'document.pdf',
      'image.png',
      'script.js'
    ]);
  });

  it('should exclude files listed in EXCLUSIONS', async () => {
    await mkdir(join(inputDir, 'scripts'), { recursive: true });
    await mkdir(join(inputDir, 'styles'), { recursive: true });
    await writeFile(join(inputDir, 'image.png'), '');
    await writeFile(join(inputDir, 'index.html'), inputHTML);
    await writeFile(join(inputDir, 'script.hash.js'), inputJS);
    await writeFile(join(inputDir, 'style.hash.css'), inputCSS);
    await writeFile(join(inputDir, 'scripts', 'app.js'), inputJS);
    await writeFile(join(inputDir, 'styles', 'main.css'), inputCSS);
    await copyAssets({ inputDir, outputDir });

    const copiedFiles = await readdir(outputDir);

    assert.deepStrictEqual(copiedFiles, ['image.png']);
  });

  it('should handle empty input directory', async () => {
    await copyAssets({ inputDir, outputDir });

    const copiedFiles = await readdir(outputDir);

    assert.deepStrictEqual(copiedFiles, []);
  });

  it('should copy directories recursively', async () => {
    await mkdir(join(inputDir, 'assets'), { recursive: true });
    await mkdir(join(inputDir, 'assets', 'images'), { recursive: true });
    await writeFile(join(inputDir, 'assets', 'file.txt'), '');
    await writeFile(join(inputDir, 'assets', 'images', 'logo.png'), '');
    await copyAssets({ inputDir, outputDir });

    const copiedFiles = await readdir(outputDir, { withFileTypes: true });
    const assetsDir = copiedFiles.find((f) => f.name === 'assets');
    const subFiles = await readdir(join(outputDir, 'assets'));

    assert.ok(assetsDir.isDirectory());
    assert.deepStrictEqual(subFiles.sort(), ['file.txt', 'images']);
  });

  it('should handle only excluded files', async () => {
    await writeFile(join(inputDir, 'index.html'), inputHTML);
    await writeFile(join(inputDir, 'script.hash.js'), inputCSS);
    await copyAssets({ inputDir, outputDir });

    const copiedFiles = await readdir(outputDir);

    assert.deepStrictEqual(copiedFiles, []);
  });
});
