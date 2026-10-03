import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// base "./" lets the build work on Netlify, Vercel and GitHub Pages sub-paths
export default defineConfig({
  plugins: [react()],
  base: "./",
  test: { environment: "node" },
});
