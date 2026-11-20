const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
    {
        ignores: [
            'dist/**',
            'archived/**',
            'node_modules/**',
            '.agents/**',
            '**/*.ts',
        ],
    },
    {
        files: ['scripts/**/*.js', 'src/**/*.js', 'tests/**/*.mjs'],
        ...js.configs.recommended,
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: { ...globals.browser, ...globals.node },
        },
        rules: {
            ...js.configs.recommended.rules,
            'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
        },
    },
    {
        files: ['scripts/**/*.js'],
        languageOptions: {
            sourceType: 'commonjs',
        },
    },
];
