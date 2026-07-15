/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "terminal-bio by Thanatos",
        short_name: "terminal-bio",
        description: "Thanatos 的 macOS 风格交互式终端个人主页。",
        theme_color: "#1d2a35",
        background_color: "#1d2a35",
        display: "standalone",
        lang: "en",
        icons: [
          {
            src: "/terminal-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  server: {
    port: 9487,
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    setupFiles: "./src/test/setup.ts",
  },
});
