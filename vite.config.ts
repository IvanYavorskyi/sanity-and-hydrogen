import { defineConfig } from 'vite'
import { hydrogen } from '@shopify/hydrogen/vite'
import { oxygen }    from '@shopify/mini-oxygen/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import reactRouter  from '@remix-run/vite'
import tailwindcss  from 'tailwindcss'

export default defineConfig({
  plugins: [
    tailwindcss(),
    hydrogen(),
    oxygen(),
    reactRouter({
      future: {
        v3_routeConfig:        true,
        v3_lazyRouteDiscovery: true,
        v3_singleFetch:        true,
      },
    }),
    tsconfigPaths(),
  ],
})
