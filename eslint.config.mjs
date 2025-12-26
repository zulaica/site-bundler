import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node
      },
      sourceType: 'module'
    },
    rules: {
      'no-var': 'error',
      'one-var': ['error', 'never']
    }
  },
  eslintConfigPrettier,
  eslintPluginPrettierRecommended
];
