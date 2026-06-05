import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import globals from 'globals'

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'webpack.config.js', 'jest.config.js'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Project specific configuration
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      react: reactPlugin
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json' // Required for type-aware linting
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        __APP_VERSION__: 'readonly'
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      'padded-blocks': 'off',
      'multiline-ternary': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ]
    }
  }
)
