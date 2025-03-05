/* eslint-disable @typescript-eslint/naming-convention */
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "variableLike",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "function",
          format: ["camelCase"], // 默认函数必须 camelCase
        },
        {
          selector: "function",
          format: ["PascalCase"], // 允许 React 组件 PascalCase
          filter: {
            regex: "^[A-Z][a-zA-Z0-9]*$",
            match: true,
          },
        },
        {
          selector: "class",
          format: ["PascalCase"],
        },
        {
          selector: "interface",
          format: ["PascalCase"],
        },
        {
          selector: "typeAlias",
          format: ["PascalCase"],
        },
        {
          selector: "enum",
          format: ["PascalCase"],
        },
        {
          selector: "enumMember",
          format: ["PascalCase"],
        },
        {
          selector: "objectLiteralProperty",
          format: ["camelCase", "UPPER_CASE"],
        },
        {
          selector: "parameter",
          format: ["camelCase"],
        },
        {
          selector: "property",
          modifiers: ["readonly"],
          format: ["UPPER_CASE"],
        },
        {
          selector: "typeParameter",
          format: ["PascalCase"],
          prefix: ["T"],
        },
      ],
    },
  },
];
