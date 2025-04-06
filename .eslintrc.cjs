module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'prettier',
  ],
  plugins: [
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'import/extensions': ['error', 'ignorePackages'],
    'no-console': ['warn', { allow: ['error', 'warn', 'info'] }],
    'max-len': ['error', { code: 2000 }],
    'class-methods-use-this': 'off',
    'no-param-reassign': ['error', { props: false }],
    'import/prefer-default-export': 'off',
  },
};
