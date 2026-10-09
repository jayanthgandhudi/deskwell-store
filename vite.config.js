import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// base "./" lets the build work on Netlify, Vercel and GitHub Pages sub-paths.
// In development, requests to /api are forwarded to the Express server.
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: { proxy: { "/api": "http://localhost:3001" } },
  test: { environment: "node", include: ["src/**/*.test.{js,jsx}"] },
});
