import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import svgr from "vite-plugin-svgr";
import { exposedComponents, exposedIcons } from "./federation.config";

const sharedDeps = {
  react: {
    singleton: true,
    eager: true,
    requiredVersion: false as const,
  },
  "react-dom": {
    singleton: true,
    eager: true,
    requiredVersion: false as const,
  },
};

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    federation({
      name: "mfe_shared",
      filename: "remoteEntry.js",
      exposes: {
        ...exposedComponents,
        ...exposedIcons,
      },
      shared: sharedDeps,
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  server: { port: 3003, strictPort: true },
  preview: { port: 3003, strictPort: true },
});
