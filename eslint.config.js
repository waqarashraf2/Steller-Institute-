import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    files: ['api/**/*.js', 'server.js', 'seed_courses.js', 'fix_date.js', 'split_testimonials.js'],
    languageOptions: { globals: globals.node },
  },
  {
    // Providers intentionally export their hooks alongside the component.
    files: ['src/components/CoursesProvider.jsx', 'src/components/WebsiteImagesProvider.jsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
])
