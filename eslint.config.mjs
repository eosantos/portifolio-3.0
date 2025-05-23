import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = [
  // regras Next.js e TypeScript
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Prettier: ativa prettier/prettier e desativa regras conflitantes
  ...compat.extends('plugin:prettier/recommended')
];

export default eslintConfig;
