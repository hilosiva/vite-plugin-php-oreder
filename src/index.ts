import { VitePhpHelper, VitePhpHelperOptions } from "./libs/VitePhpHelper";

export function VitePhpLoader(options: VitePhpHelperOptions = {}): any {
  let config: any;
  let vitePhpHelper: VitePhpHelper;

  return {
    name: "VitePhpOreder",

    configResolved(_config: any) {
      config = _config;
      vitePhpHelper = new VitePhpHelper(options, config);

      vitePhpHelper.init();
    },
    configureServer({ ws }) {
      vitePhpHelper.liveReload(ws);
    },
    async writeBundle() {
      await vitePhpHelper.build();
    },
  };
}
