import { defineConfig } from "eslint/config"
import { includeIgnoreFile } from "@eslint/compat"
import typescriptEslint from "@typescript-eslint/eslint-plugin"
import globals from "globals"
import tsParser from "@typescript-eslint/parser"
import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, ".gitignore")

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default defineConfig([
  includeIgnoreFile(gitignorePath),
  {
    extends: compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended"),

    plugins: {
      "@typescript-eslint": typescriptEslint
    },

    languageOptions: {
      globals: {
        ...globals.browser
      },

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module"
    },

    rules: {
      indent: ["error", 2],
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "double"],
      semi: ["error", "never"],
      "arrow-parens": ["error", "as-needed"],
      "arrow-spacing": "error",
      "comma-dangle": ["error", "never"],
      "space-in-parens": ["error", "never"],
      "array-bracket-spacing": ["error", "never"],
      "no-trailing-spaces": "error",

      "space-before-function-paren": ["error", {
        anonymous: "always",
        named: "never",
        asyncArrow: "always"
      }],

      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_"
      }]
    }
  }, {
    files: ["**/eleventy.config.js", "eleventy/*.js"],

    languageOptions: {
      globals: {
        ...globals.node
      }
    },

    rules: {
      "@typescript-eslint/no-var-requires": "off"
    }
  }
])
