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
      external: [
        "vite",
        "glob",
        "path",
        "chokidar",
        "fs",
        "fs/promises",
        "events",
        "url",
        "stream",
        "string_decoder",
        "vite-plugin-inspect", // 追加
        // vite-plugin-dts の正しいモジュール名を指定する
      ],
      output: {
        globals: {
          path: "path",
          chokidar: "chokidar",
          fs: "fs",
          "fs/promises": "fs.promises",
          glob: "glob",
          events: "events",
          url: "url",
          stream: "stream",
          string_decoder: "string_decoder",
          "vite-plugin-inspect": "vitePluginInspect", // 追加
          // vite-plugin-dts のグローバル名を指定する
        },
      },
    },

    minify: false,
  },
});
