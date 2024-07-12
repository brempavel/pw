import { defineConfig } from 'vite'
import { resolve } from 'path'

import { compilerOptions } from './tsconfig.json'

export default defineConfig({
  resolve: {
    alias: Object.fromEntries(
      Object.entries(compilerOptions.paths).map(([alias, [path]]) => [
        alias,
        resolve(path),
      ]),
    ),
  },
})
