import { VitePhpHelper, VitePhpHelperOptions } from "./libs/VitePhpHelper";
import path from "path";

export function vitePhpOreder(options: VitePhpHelperOptions = {}): any {
  let config: any;
  let vitePhpHelper: VitePhpHelper;
  const settings = {
    entryPoint: options.entryPoint ? options.entryPoint : "assets/js/main.js",
    proxy: {
      target: options.proxy ? options.proxy : "http://localhost:80",
      changeOrigin: true,
      ws: true,
    },
  };

  return {
    name: "vitePhpOreder",

    config: (_config: any) => ({
      build: {
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
          input: {
            main: path.resolve(`${_config.root}/${settings.entryPoint}`),
          },
        },
      },
      server: {
        cors: true,
        proxy: {
          "^(?!/(assets|@vite|@fs)/|/[^/]+\\.(gif|jpeg|jpg|png|svg|webp|txt|pdf|mp4|webm|mov|htaccess)$)": {
            ...settings.proxy,
          },
        },
      },

      preview: {
        proxy: {
          "/": {
            ...settings.proxy,
          },
        },
      },
    }),
    configResolved(_config: any) {
      config = _config;

      vitePhpHelper = new VitePhpHelper(options, config);

      vitePhpHelper.init();
    },
    configureServer({ ws }: any) {
      vitePhpHelper.liveReload(ws);
    },
    async writeBundle() {
      await vitePhpHelper.build();
    },
  };
}
