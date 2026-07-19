import js from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([
  {
    extends: ["js/recommended"],
    files: ["**/*.{js,mjs}"],
    languageOptions: { globals: globals.node },
    plugins: { js, eslintPluginPrettierRecommended },
  },
]);
