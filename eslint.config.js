import angularEslintPlugin from '@angular-eslint/eslint-plugin';
import angularEslintTemplatePlugin from '@angular-eslint/eslint-plugin-template';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts'],
    plugins: {
      '@angular-eslint': angularEslintPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        createDefaultProgram: true,
      },
    },
    rules: {
      ...angularEslintPlugin.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.html'],
    ignores: ['src/**/*.html'], // Ignora todos los HTML de componentes
    plugins: {
      '@angular-eslint/template': angularEslintTemplatePlugin,
    },
    processor: '@angular-eslint/template/extract-inline-html',
    rules: {
      ...angularEslintTemplatePlugin.configs.recommended.rules,
    },
  },
];
