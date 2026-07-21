import js from "@eslint/js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import tsParser from "@typescript-eslint/parser";
import nextPlugin from "@next/eslint-plugin-next";
import prettierConfig from "eslint-config-prettier";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
});
 
const eslintConfig = [
    {
        ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", "prisma/client/**"],
    },
    js.configs.recommended,
    ...compat.extends("plugin:@typescript-eslint/recommended"),
    prettierConfig,
    {
        languageOptions: { parser: tsParser },
        plugins: {
            "@typescript-eslint": typescriptEslint,
            "@next/next": nextPlugin,
        },
        rules: {
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs["core-web-vitals"].rules,
            "@typescript-eslint/no-unused-vars": ["error", { "varsIgnorePattern": "^_", "argsIgnorePattern": "^_", "caughtErrorsIgnorePattern": "^_" }],
        },
    },
];
 
export default eslintConfig;