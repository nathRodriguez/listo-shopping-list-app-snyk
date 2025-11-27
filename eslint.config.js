const tseslint = require("typescript-eslint");

module.exports = [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "coverage/**",
      "*.min.js",
      "*.bundle.js",
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
        global: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "prefer-const": "warn",
      "no-var": "error",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];
