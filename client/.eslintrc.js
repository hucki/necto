module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['react'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'keyword-spacing': 'error',
    'linebreak-style': ['error', 'unix'],
    'no-undef': 0,
    'no-unsued-vars': 0,
    'no-console': 0,
    quotes: ['error', 'single'],
    'react/prop-types': 0,
    'react/display-name': 0,
    semi: ['error', 'always'],
    'space-before-blocks': 'error',
    // 'space-before-function-paren': 'error',
    'no-unused-vars': 'warn',
  },
};
