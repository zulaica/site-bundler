export const OPTIONS = Object.freeze({
  babel: {
    presets: [
      [
        '@babel/env',
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
      collapseWhitespace: 'aggressive',
      minifyJs: false,
      removeComments: 'all',
      removeEmptyAttributes: false
    }
  }
});

export const EMOJI = Object.freeze({
  artistPalette: '\uD83C\uDFA8',
  barChart: '\uD83D\uDCCA',
  cardIndexDividers: '\uD83D\uDDC2',
  construction: '\uD83D\uDEA7',
  fileCabinet: '\uD83D\uDDC4 ',
  fileFolder: '\uD83D\uDCC1',
  noEntry: '\u26D4\uFE0F',
  package: '\uD83D\uDCE6',
  wastebasket: '\ud83d\uddd1\ufe0f '
});
