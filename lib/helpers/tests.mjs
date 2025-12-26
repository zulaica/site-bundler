import { mkdir, rm } from 'node:fs/promises';
import { afterEach, beforeEach } from 'node:test';
import { tmpdir } from 'os';
import { join } from 'path';

const baseDir = join(tmpdir(), `site-bundler-test-${Date.now()}`);
const inputDir = join(baseDir, 'input');
const outputDir = join(baseDir, 'output');

const inputCSS = `
/**
 * This is a comment
 */

body {
  margin: 0;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
}
`;

const processedCSS =
  'body{font-family:Arial,sans-serif;margin:0;padding:20px}h1{color:#333}';

const inputHTML = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- This is a comment -->
    <meta charset="utf-8" />
    <link rel="stylesheet" href="style.hash.css" />
    <script src="script.hash.js"></script>
  </head>
  <body>
    <header>
      <h1>   Test   Site   </h1>
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
        </ul>
      </nav>
    </header>
    <main>
      <section>
        <article>
          <h2>Article                Title</h2>
          <p>Article content goes here.</p>
          <p aria-hidden="true">This is hidden.</p>
        </article>
      </section>
      <aside>
        <input type="text" disabled="disabled" placeholder="Enter text" />
      </aside>
    </main>
    <footer>
      <p>&copy; Year</p>
    </footer>
  </body>
</html>
`;

const processedHTML =
  '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><link rel="stylesheet" href="style.hash.css"><script src="script.hash.js"></script></head><body><header><h1>Test Site</h1><nav><ul><li><a href="#home">Home</a></li><li><a href="#about">About</a></li></ul></nav></header><main><section><article><h2>Article Title</h2><p>Article content goes here.</p><p aria-hidden="true">This is hidden.</p></article></section><aside><input type="text" disabled placeholder="Enter text"></aside></main><footer><p>&copy; Year</p></footer></body></html>';

const inputJS = `
// This is a comment

/**
 * This is a comment
 */

const sum = (a, b) => {
  return a + b;
};

console.log('Site loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');
});

export default sum;
`;

const processedJS =
  'const sum=(a,b)=>{return a+b};console.log("Site loaded");document.addEventListener("DOMContentLoaded",()=>{console.log("DOM loaded")});export{sum as default};';

const setup = async () => {
  beforeEach(async () => {
    await mkdir(inputDir, { recursive: true });
    await mkdir(outputDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(baseDir, { recursive: true, force: true });
  });
};

export const TESTS = Object.freeze({
  inputCSS,
  inputDir,
  inputHTML,
  inputJS,
  outputDir,
  processedCSS,
  processedHTML,
  processedJS,
  setup
});
