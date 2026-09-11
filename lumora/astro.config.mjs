// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://lumora-one.vercel.app",
  trailingSlash: "never",
  build: { format: "file" },
  vite: { plugins: [tailwindcss()] },
});
