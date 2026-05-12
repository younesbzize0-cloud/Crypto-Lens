/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          recharts: ["recharts"],
          query: ["@tanstack/react-query"],
          zustand: ["zustand"],
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
});