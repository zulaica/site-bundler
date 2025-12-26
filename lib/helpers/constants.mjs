/* node:coverage disable */
export const EMOJI = Object.freeze({
  artistPalette: '\u{1f3a8}',
  barChart: '\u{1f4ca}',
  cardIndexDividers: '\u{1f5c2}',
  constructionWorker: '\u{1f477}',
  fileCabinet: '\u{1f5c4} ',
  fileFolder: '\u{1f4c1}',
  noEntry: '\u{26D4}',
  package: '\u{1f4e6}',
  wastebasket: '\u{1f5d1} '
});

export const EXCLUSIONS = Object.freeze([
  'index.html',
  'script.hash.js',
  'scripts',
  'style.hash.css',
  'styles'
]);

export const OPTIONS = Object.freeze({
  babel: {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: 'defaults',
          modules: false
        }
      ]
    ],
    babelrc: false,
    comments: false,
    configFile: false,
    minified: true
  },
  rollup: {
    onwarn(warning, warn) {
      if (warning.code === 'EMPTY_BUNDLE') return;
      warn(warning);
    }
  },
  postcss: {
    cssnano: {
      preset: [
        'advanced',
        {
          minifyFontValues: false,
          normalizeUrl: false,
          normalizeString: {
            preferredQuote: 'single'
          }
        }
      ]
    },
    url: [
      {
        filter: '**/*.woff2',
        url: 'rebase'
      },
      {
        filter: '**/*.woff',
        url: 'rebase'
      },
      {
        filter: '**/*.ttf',
        url: 'rebase'
      },
      {
        filter: '**/*.webp',
        url: (asset) => asset.relativePath
      },
      {
        filter: '**/*.jpg',
        url: (asset) => asset.relativePath
      }
    ]
  },
  posthtml: {
    htmlnano: {
      collapseBooleanAttributes: {
        amphtml: false
      },
      collapseWhitespace: 'aggressive',
      minifyJs: false,
      removeComments: 'all',
      removeEmptyAttributes: false
    }
  }
});
/* node:coverage enable */
