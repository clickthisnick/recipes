const js = require('@eslint/js');

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
            globals: {
                console: 'readonly',
                process: 'readonly',
                module: 'readonly',
                require: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                Buffer: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                URL: 'readonly',
                URLSearchParams: 'readonly',
                document: 'readonly',
                window: 'readonly',
                navigator: 'readonly',
                history: 'readonly',
                HTMLElement: 'readonly',
                WeakSet: 'readonly',
            },
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
