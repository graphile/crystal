module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    //project: 'tsconfig.json',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    //'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
  plugins: ['jest'],
  env: {
    jest: true,
    node: true,
    es6: true,
  },
  globals: {
    jasmine: false,
  },
  rules: {
    'prettier/prettier': 'error',

    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        args: 'after-used',
        ignoreRestSiblings: true,
      },
    ],

    'no-confusing-arrow': 0,
    'no-else-return': 0,
    'no-underscore-dangle': 0,
    'no-restricted-syntax': 0,
    'no-await-in-loop': 0,
    'jest/no-focused-tests': 2,
    'jest/no-identical-title': 2,

    // Rules that we should enable:
    '@typescript-eslint/no-use-before-define': 'warn',
    '@typescript-eslint/no-inferrable-types': 'warn',
    'no-inner-declarations': 'warn',
  },
  overrides: [
    // Rules for tests only
    {
      files: ['**/__tests__/**/*.{js,ts}'],
      rules: {
        // Disable these to enable faster test writing
        'prefer-const': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',

        // We don't normally care about race conditions in tests
        'require-atomic-updates': 'warn',
      },
    },
  ],
};
