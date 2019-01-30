module.exports = {
  extends: ['eslint:recommended', 'react-app'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'es5',
      },
    ],
  },
};
