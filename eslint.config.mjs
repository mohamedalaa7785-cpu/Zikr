import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const ignores = [
  ".next/**",
  "node_modules/**",
  "dist/**",
  "out/**",
  "coverage/**",
  "public/sw.js",
  "supabase/migrations/**",
  "supabase/migrations_archive/**",
];

const config = [
  { ignores },
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/immutability": "warn",
      "react/no-unescaped-entities": "warn",
      "react-hooks/error-boundaries": "warn",
    },
  },
];

export default config;
