import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/", // ✅ عدلنا دي
  resolve: {
    alias: {
      dashboard: path.resolve(__dirname, "src/dashboard"),
      components: path.resolve(__dirname, "src/components"),
      examples: path.resolve(__dirname, "src/dashboard/examples"),
      layouts: path.resolve(__dirname, "src/dashboard/layouts"),
      assets: path.resolve(__dirname, "src/dashboard/assets"),
      context: path.resolve(__dirname, "src/dashboard/context"),
    },
  },
});