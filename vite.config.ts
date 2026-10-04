import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

export default defineConfig(({ command }) => ({
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
    }),
    react(),
    ...(command === "build" ? [nitro({ defaultPreset: process.env["VERCEL"] ? "vercel" : "cloudflare-module" })] : []),
  ],
  server: {
    watch: {
      ignored: ["**/.output/**", "**/.wrangler/**"],
    },
  },
}));
