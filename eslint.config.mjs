import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // ignore 'any' type
      "@typescript-eslint/no-empty-interface": "off", // ignore empty interfaces
      "@typescript-eslint/no-empty-object-type": "off", // ignore empty object types (if using this rule)
      "@typescript-eslint/no-empty-function": "off", // ignore empty functions (optional, for empty objects)
      "@typescript-eslint/no-unused-vars": "off", // ignore unused variables
    },
  },
];

export default eslintConfig;
