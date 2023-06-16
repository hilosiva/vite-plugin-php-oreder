import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";
import dts from "vite-plugin-dts";
import { VitePhpLoader } from "./src/index";
import path from "path";

export default defineConfig({
  plugins: [
    Inspect({
      build: true,
      outputDir: ".vite-inspect",
    }),
    dts({ insertTypesEntry: true }),
    VitePhpLoader(),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "VitePhpLoader",
      fileName: "index",
    },
    rollupOptions: {
      external: ["vite", "path", "chokidar"], // バンドルしたくない依存関係を指定
      output: {
        globals: {
          path: "path",
          chokidar: "chokidar",
          fs: "fs",
          glob: "glob",
        },
      },
    },

    minify: false,
  },
});
