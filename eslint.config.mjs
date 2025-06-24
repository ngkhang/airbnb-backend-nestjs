// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import * as importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  importPlugin.flatConfigs?.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts'],
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: true,
      },
    }
  },
  {
    rules: {
      // ==============================
      // typescript-eslint rules
      // ==============================
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase', 'PascalCase', 'snake_case', 'UPPER_CASE'],
          filter: {
            regex: '^_.*$',
            match: false,
          },
        },
        { selector: 'property', format: null },
        {
          selector: 'variable',
          format: ['strictCamelCase', 'UPPER_CASE', 'StrictPascalCase'],
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'memberLike',
          modifiers: ['private'],
          format: ['camelCase'],
          leadingUnderscore: 'forbid',
        },
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
        },
        { selector: 'enumMember', format: ['UPPER_CASE'] },
      ],
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
      '@typescript-eslint/consistent-indexed-object-style': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-use-before-define': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'angle-bracket' }],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      '@typescript-eslint/unified-signatures': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/array-type': [
        'error',
        {
          default: 'array-simple',
        },
      ],
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-unused-expressions': ['error'],
      '@typescript-eslint/no-confusing-non-null-assertion': 'warn',
      '@typescript-eslint/adjacent-overload-signatures': 'error',
      // ==============================
      // eslint rules
      // ==============================
      'arrow-body-style': [
        'error',
        'as-needed',
        {
          requireReturnForObjectLiteral: true,
        },
      ],
      'semi': 'error',
      'no-console': 'error',
      'no-nested-ternary': 'error',
      'no-lonely-if': 'warn',
      'no-undefined': 'warn',
      'no-unexpected-multiline': 'warn',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'warn',
      'no-unused-vars': 'off',
      'max-params': ['error', 7],
      // ==============================
      // import rules
      // ==============================
      'import/named': 'off',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: '@nestjs/**',
              group: 'external',
              position: 'before',
            },
          ],
        },
      ],
    },
  },
);
