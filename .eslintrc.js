'use strict';

module.exports = {
  env: {
    node: true,
    es6: true,
    mocha: true,
  },
  root: true,
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'script',
  },
  extends: 'eslint:recommended',
  rules: {
    'no-constant-condition': ["error", { "checkLoops": false }]
  }
};
