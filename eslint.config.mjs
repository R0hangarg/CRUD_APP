import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];


// import globals from 'globals';
// import pluginJs from '@eslint/js';
// import pluginTypeScript from '@typescript-eslint/eslint-plugin';
// import parserTypeScript from '@typescript-eslint/parser';
// import pluginImport from 'eslint-plugin-import';
// import pluginNode from 'eslint-plugin-node';
// import pluginPromise from 'eslint-plugin-promise';

// export default [
//   {
//     files: ['**/*.{js,mjs,cjs,ts}'],
//     languageOptions: {
//       globals: {
//         ...globals.node, // Include Node.js globals
//       },
//       parser: parserTypeScript,
//       parserOptions: {
//         ecmaVersion: 2021,
//         sourceType: 'module',
//       },
//     },
//     plugins: {
//       '@typescript-eslint': pluginTypeScript,
//       'import': pluginImport,
//       'node': pluginNode,
//       'promise': pluginPromise,
//     },
//     extends: [
//       pluginJs.configs.recommended,
//       'plugin:@typescript-eslint/recommended',
//       'plugin:import/errors',
//       'plugin:import/warnings',
//       'plugin:import/typescript',
//       'plugin:node/recommended',
//       'plugin:promise/recommended',
//     ],
//     rules: {
//       'indent': ['error', 2],
//       'linebreak-style': ['error', 'unix'],
//       'quotes': ['error', 'single'],
//       'semi': ['error', 'always'],
//       '@typescript-eslint/no-explicit-any': 'off',
//       '@typescript-eslint/explicit-module-boundary-types': 'off',
//     },
//   },
// ];
