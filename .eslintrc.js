module.exports = {
    env: {
        node: true,
        es6: true,
        mocha: true
    },
    root: false,
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'script'
    },
    extends: 'eslint:recommended',
    rules:{
        'no-constant-condition': ["error", { "checkLoops": false }]
    }
};