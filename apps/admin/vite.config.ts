import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("@mui") || id.includes("@emotion")) return "mui";
          if (
            id.includes("react-router") ||
            id.includes("react-dom") ||
            /[/\\]react[/\\]/.test(id)
          ) {
            return "react-vendor";
          }
          if (id.includes("@tanstack")) return "query";
          if (id.includes("@dnd-kit")) return "dnd";
        },
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
