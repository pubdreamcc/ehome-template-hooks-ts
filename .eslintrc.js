module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: [
    'eslint-config-ali/react',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
      impliedStrict: true
    }
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  plugins: ['import', 'react', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
};
