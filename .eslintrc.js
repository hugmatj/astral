module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'vue/component-tags-order': [
      'error',
      {
        order: ['script', 'template', 'style'],
      },
    ],
    'vue/no-reserved-component-names': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/component-api-style': ['error', ['script-setup', 'composition']],
    'vue/component-name-in-template-casing': 'error',
    'vue/block-lang': [
      'error',
      {
        script: { lang: 'ts' },
      },
    ],
    'vue/define-macros-order': [
      'warn',
      {
        order: ['defineProps', 'defineEmits'],
      },
    ],
    'vue/define-emits-declaration': ['error', 'type-based'],
    'vue/define-props-declaration': ['error', 'type-based'],
    'vue/match-component-import-name': 'error',
    'vue/no-ref-object-destructure': 'error',
    'vue/no-unused-refs': 'error',
    'vue/no-useless-v-bind': 'error',
    'vue/padding-line-between-tags': 'warn',
    'vue/padding-line-between-blocks': 'error',
    'vue/prefer-separate-static-class': 'error',
    'vue/prefer-true-attribute-shorthand': 'error',
    'vue/no-v-html': 'off',

    'no-undef': 'off',
    'no-unused-vars': 'off',
    'no-console': ['warn'],
    'no-debugger': ['warn'],
  },
  ignorePatterns: ['*.d.ts'],
}
