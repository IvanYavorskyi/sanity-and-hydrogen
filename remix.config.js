import { defineConfig } from '@remix-run/dev';
import { hydrogenBuild } from '@shopify/hydrogen/plugin';
import { VercelAdapter } from '@shopify/hydrogen/adapter-vercel';

export default defineConfig({
  plugins: [hydrogenBuild()],

  server: {
    platform: VercelAdapter(),
  },

  ignoredRouteFiles: ["**/.*"],
});
