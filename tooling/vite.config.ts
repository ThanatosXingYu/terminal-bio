/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import { defineConfig, type HtmlTagDescriptor, type Plugin } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import terminalConfig from "../terminal.config.mjs";
import type { TerminalBioConfig } from "../src/config/types";

type AnalyticsConfig = TerminalBioConfig["analytics"];

const serializeInlineValue = (value: string) =>
  JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

export const createAnalyticsTags = (
  analytics: AnalyticsConfig
): HtmlTagDescriptor[] => {
  if (!analytics.enabled) return [];

  const { id, ck, autoTrack, hashMode } = analytics.init;
  const initScript = `LA.init({id:${serializeInlineValue(
    id
  )},ck:${serializeInlineValue(
    ck
  )},autoTrack:${autoTrack},hashMode:${hashMode}})`;

  return [
    {
      tag: "script",
      attrs: analytics.script,
      injectTo: "head",
    },
    {
      tag: "script",
      children: initScript,
      injectTo: "head",
    },
  ];
};

export const analyticsPlugin = (
  analytics: AnalyticsConfig = terminalConfig.analytics
): Plugin => ({
  name: "terminal-bio-analytics",
  transformIndexHtml: {
    order: "post",
    handler() {
      return createAnalyticsTags(analytics);
    },
  },
});

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
            src: "terminal-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
    }),
    analyticsPlugin(),
  ],
  server: {
    port: 9487,
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "tooling/**/*.{test,spec}.{ts,tsx}",
    ],
    setupFiles: "./src/test/setup.ts",
  },
});
