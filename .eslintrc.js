module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  rules: {
    // No semicolons
    semi: ['error', 'never'],
    // Line length is handled by Prettier
    'max-len': 'off',
    // Prefer arrow functions
    'prefer-arrow-callback': 'error',
    'func-style': ['error', 'expression', { allowArrowFunctions: true }],
    // Other common rules
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error', 'info', 'debug'],
      },
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    quotes: ['error', 'single'],
    'object-curly-spacing': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    '@typescript-eslint/no-explicit-any': 'off',
  },
  overrides: [
    {
      // Disable func-style rule for theme/index.tsx
      files: ['packages/ui/src/theme/index.tsx'],
      rules: {
        'func-style': 'off',
      },
    },
    {
      // Allow require() imports in metro.config.js as Metro doesn't support ESM imports yet
      files: ['apps/mobile/metro.config.js'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
      },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '.turbo/',
    '.next/',
    'coverage/',
  ],
  settings: {
    next: {
      rootDir: ['apps/*/'],
    },
  },
}
