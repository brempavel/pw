import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@ui': path.resolve('src'),
      '@ui/*': path.resolve('src/*'),
      '@components': path.resolve('src/components/'),
      '@components/*': path.resolve('src/components/*'),
      '@utils': path.resolve('src/utils/'),
      '@utils/*': path.resolve('src/utils/*'),
      '@types': path.resolve('src/types/'),
      '@types/*': path.resolve('src/types/*'),
      '@constants': path.resolve('src/constants/'),
      '@constants/*': path.resolve('src/constants/*'),
    },
  },
})
