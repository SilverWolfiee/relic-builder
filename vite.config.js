import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/neon": {
        target: "https://cdn.neonteam.dev",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/neon/, ""),
      },
    },
  },
});