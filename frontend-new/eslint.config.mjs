import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs,jsx}"], 
    plugins: { js }, 
    extends: ["js/recommended"],
    rules: {
      'no-shadow': 'error',
      'no-redeclare': 'error',
      'no-use-before-define': 'error'
    }
  },
  { 
    files: ["**/*.{js,mjs,cjs,jsx}"], 
    languageOptions: { globals: globals.browser } 
  },
  pluginReact.configs.flat.recommended,
]);


// To test the ESLint configuration, run the following command in the terminal:
// npm run lint