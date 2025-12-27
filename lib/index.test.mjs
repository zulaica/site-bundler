import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { promisify } from 'node:util';
import { EMOJI } from './helpers/constants.mjs';
import {
  inputCSS,
  inputDir,
  inputHTML,
  inputJS,
  outputDir,
  setUpTestHooks
} from './helpers/tests.mjs';

const execFileAsync = promisify(execFile);
const { version } = JSON.parse(
  await readFile(new URL('../package.json', import.meta.url), 'utf8')
);

describe(`${EMOJI.package} CLI Integration`, () => {
  setUpTestHooks();

  it('should display version', async () => {
    const { stdout } = await execFileAsync('node', [
      join(process.cwd(), 'lib', 'index.mjs'),
      '--version'
    ]);

    assert.ok(stdout.includes(version));
  });

  it('should process complete site', async () => {
    await writeFile(join(inputDir, 'index.html'), inputHTML);
    await writeFile(join(inputDir, 'style.hash.css'), inputCSS);
    await writeFile(join(inputDir, 'script.hash.js'), inputJS);
    await writeFile(join(inputDir, 'favicon.ico'), '');

    await assert.doesNotReject(
      () =>
        execFileAsync('node', [
          join(process.cwd(), 'lib', 'index.mjs'),
          '-i',
          inputDir,
          '-o',
          outputDir
        ]),
      /Finished!/
    );

    const outputFiles = await readdir(outputDir);

    assert.deepEqual(outputFiles.sort(), [
      'favicon.ico',
      'index.html',
      'script.hash.js',
      'style.hash.css'
    ]);
  });

  it('should handle non-existent input directory', async () => {
    const nonExistentDir = join(inputDir, 'non-existent');

    await assert.rejects(
      () =>
        execFileAsync('node', [
          join(process.cwd(), 'lib', 'index.mjs'),
          '-i',
          nonExistentDir,
          '-o',
          outputDir
        ]),
      /Input directory does not exist/
    );
  });

  it('should handle empty input directory', async () => {
    await assert.rejects(
      () =>
        execFileAsync('node', [
          join(process.cwd(), 'lib', 'index.mjs'),
          '-i',
          inputDir,
          '-o',
          outputDir
        ]),
      /An error has occurred/
    );
  });
});
