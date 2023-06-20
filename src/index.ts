import { VitePhpHelper, VitePhpHelperOptions } from "./libs/VitePhpHelper";
import path from "path";

export function VitePhpLoader(options: VitePhpHelperOptions = {}): any {
  let config: any;
  let vitePhpHelper: VitePhpHelper;
  const defaultEntryPoint = "assets/js/main.js";

  return {
    name: "VitePhpOreder",

    config: (config: any) => ({
      build: {
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
          input: {
            main: path.resolve(options.entryPoint ? `${config.root}/${options.entryPoint}` : `${config.root}/${defaultEntryPoint}`),
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
