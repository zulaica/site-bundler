export const EMOJI = Object.freeze({
  artistPalette: '\uD83C\uDFA8',
  barChart: '\uD83D\uDCCA',
  cardIndexDividers: '\uD83D\uDDC2',
  constructionWorker: '\uD83D\uDC77',
  fileCabinet: '\uD83D\uDDC4 ',
  fileFolder: '\uD83D\uDCC1',
  noEntry: '\u26D4\uFE0F',
  package: '\uD83D\uDCE6',
  wastebasket: '\ud83d\uddd1\ufe0f '
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
