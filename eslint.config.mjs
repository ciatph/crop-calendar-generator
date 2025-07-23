// eslint.config.mjs
import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.{js,cjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node, // ✅ Use Node.js globals — includes __dirname
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
    },
    plugins: {
      js,
    },
    rules: {
      ...js.configs.recommended.rules, // same as 'eslint:recommended'
      indent: ['error', 2, { SwitchCase: 1 }],
      'linebreak-style': ['error', 'unix'],
      camelcase: 'off',
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-trailing-spaces': 'error',
      // 'no-console': ['error', { allow: ['error'] }]
    },
  },
])
