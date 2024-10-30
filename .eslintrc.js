/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "prettier",
    "eslint:recommended",
    "plugin:storybook/recommended",
    "plugin:import/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/typescript",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: [
    "@typescript-eslint/eslint-plugin",
    "react",
    "only-warn",
    "simple-import-sort",
  ],
  globals: {
    React: true,
    JSX: true,
    console: true,
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    commonjs: true,
    jest: true,
  },
  rules: {
    "no-unused-vars": "error",
    eqeqeq: [
      "error",
      "always",
      {
        null: "ignore",
      },
    ],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    "react/function-component-definition": [
      "error",
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "react/jsx-curly-brace-presence": [
      "error",
      {
        props: "never",
        children: "never",
      },
    ],
    "react/jsx-sort-props": [
      "error",
      {
        callbacksLast: true,
        multiline: "last",
        shorthandFirst: true,
      },
    ],
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        format: ["camelCase", "UPPER_CASE", "PascalCase"],
        selector: "variable",
        leadingUnderscore: "allow",
      },
      {
        format: ["camelCase", "PascalCase"],
        selector: "function",
      },
      {
        format: ["PascalCase"],
        selector: "interface",
      },
      {
        format: ["PascalCase"],
        selector: "typeAlias",
      },
    ],
    "@typescript-eslint/no-empty-function": "warn",
    "import/no-duplicates": "error",
    "import/namespace": [
      "error",
      {
        allowComputed: true,
      },
    ],
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "turbo/no-undeclared-env-vars": "off",
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
    },
  },
  ignorePatterns: [".*.js", "node_modules/"],
};
