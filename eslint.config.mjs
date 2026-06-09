import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
      "coverage/**"
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    rules: {
      "no-unused-vars": "off",
      "no-undef": "off"
    }
  }
];
