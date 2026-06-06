import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

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
    federation({
      name: "mfe_authors",
      filename: "remoteEntry.js",
      exposes: {
        "./AuthorsPage": "./src/features/authors/AuthorsPage",
      },
      remotes: {
        mfe_shared: "http://localhost:3003/assets/remoteEntry.js",
      },
      shared: sharedDeps,
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  server: { port: 3002, strictPort: true },
  preview: { port: 3002, strictPort: true },
});
