// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
import path from "path";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  adapter: node({
    mode: "standalone"
  }),
  security: {
    checkOrigin: true
  },
  server: {
    host: true,
  },
  devToolbar: {
    enabled: false,
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve("./src"),
      },
    },
  }
});
