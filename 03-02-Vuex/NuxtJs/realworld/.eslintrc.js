module.exports = {
  root: true,
  env: {
    browser: true
  },
  extends: ['plugin:vue/recommended', 'standard'],
  parserOptions: {
    ecmaVersion: 2021,
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  plugins: ['vue'],
  globals: {},
  rules: {
    'arrow-body-style': 'off',
    'arrow-parens': [
      'error',
      'always'
    ],
    'comma-dangle': 'error',
    'global-require': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    indent: 'error',
    'template-curly-spacing': [
      'error',
      'never'
    ],
    'no-continue': 'off',
    'no-debugger': 'warn',
    'no-loop-func': 'off',
    'no-mixed-operators': 'off',
    'no-plusplus': 'off',
    'no-restricted-syntax': 'off',
    'no-underscore-dangle': 'off',
    'no-shadow': 'off',
    'no-bitwise': 'off',
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true
      }
    ],
    'no-use-before-define': [
      'error',
      {
        functions: false
      }
    ],
    'no-restricted-globals': [
      'error',
      {
        name: 'event',
        message: 'Use local parameter instead.'
      }
    ],
    'max-len': [
      'error',
      120,
      {
        ignoreComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreUrls: true,
        ignoreTrailingComments: true
      }
    ],
    'max-lines': [
      'error',
      {
        max: 800
      }
    ],
    'no-param-reassign': [
      'error',
      {
        props: false
      }
    ],
    'no-template-curly-in-string': 'off',
    'object-curly-newline': [
      'error',
      {
        consistent: true,
        multiline: true
      }
    ],
    'prefer-destructuring': [
      'warn',
      {
        AssignmentExpression: {
          array: false,
          object: false
        },
        VariableDeclarator: {
          array: false,
          object: true
        }
      }
    ],
    'quote-props': 'error',
    semi: 'error',
    'space-before-function-paren': 'error',
    'spaced-comment': [
      'error',
      'always',
      {
        block: {
          exceptions: [
            '*'
          ]
        }
      }
    ],
    'vue/attributes-order': 'error',
    'vue/html-self-closing': 'error',
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 4
      }
    ],
    'vue/no-v-html': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/no-mutating-props': 'off'
  }
}
