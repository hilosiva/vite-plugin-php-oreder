import fs from "fs";
import { glob } from "glob";
import path from "path";
import chokidar from "chokidar";

interface Replace {
  search: RegExp;
  new: string;
}

interface Manifest {
  [key: string]: {
    file: string;
    src: string;
  };
}

export interface VitePhpHelperOptions {
  viteHelperFile?: string;
}

export class VitePhpHelper {
  private files: string[];
  private path: {
    root: string;
    relativeDist: string;
    absoluteDist: string;
  };
  private localServer: URL;
  private entryPoint: URL;
  private logger: any; // ロガーの型を適宜設定する
  private defaultOptions = {
    viteHelperFile: `lib/ViteHelper.php`,
  };
  private options: any; // オプションの型を適宜設定する
  private ws: any;

  constructor(options: any = {}, config: any) {
    this.files = glob.sync(`${config.root}/**/*.php`);

    this.path = {
      root: config.root,
      relativeDist: config.build.outDir,
      absoluteDist: path.resolve(config.root, config.build.outDir),
    };

    this.localServer = new URL(`${config.server.https ? "https" : "http"}://${config.server.hmr.host}:${config.server.port}`);

    this.entryPoint = new URL(config.build.rollupOptions.input.main.replace(config.root, ""), this.localServer);

    this.logger = config.logger;

    this.defaultOptions = {
      viteHelperFile: `lib/ViteHelper.php`,
    };

    this.options = { ...this.defaultOptions, ...options };
  }

  private async modifiedFile(file: string, replaceFunc: (content: string, replaces: Replace[]) => string, replaces: Replace[], output: string) {
    try {
      const content = fs.readFileSync(file, "utf-8");

      const modifiedContent = replaceFunc(content, replaces);

      const distFileDirectory = output.split("/").slice(0, -1).join("/");
      fs.mkdirSync(distFileDirectory, { recursive: true });
      fs.writeFileSync(output, modifiedContent);
    } catch (error) {
      console.error(`Failed to read file: ${output}`);
      console.error(error);
    }
  }

  private replaceStrings(content: string, replaces: Replace[]): string {
    let modifiedContent = content;

    replaces.forEach((replace) => {
      modifiedContent = modifiedContent.replace(replace.search, replace.new);
    });

    return modifiedContent;
  }

  private replaceImagePaths(content: string, manifest: Manifest): string {
    let modifiedContent = content;

    Object.keys(manifest).forEach((key) => {
      const { file, src } = manifest[key];
      modifiedContent = modifiedContent.replaceAll(new RegExp(src, "g"), file);
    });

    return modifiedContent;
  }

  public async init(): Promise<void> {
    const file = `${this.path.root}/${this.options.viteHelperFile}`;

    const replaces: Replace[] = [
      {
        search: /const VITE_SERVER = '';/,
        new: `const VITE_SERVER = '${this.localServer.origin}';`,
      },
      {
        search: /const ENTRY_POINT = '';/,
        new: `const ENTRY_POINT = '${this.entryPoint.pathname.slice(1)}';`,
      },
    ];

    await this.modifiedFile(file, this.replaceStrings, replaces, file);
  }

  public async build(): Promise<void> {
    await this.changeManifestAssets();
    await this.changeDevelpmentMode();
  }

  private async changeManifestAssets(): Promise<void> {
    const manifestPath = `${this.path.absoluteDist}/manifest.json`;
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    this.files.forEach(async (file) => {
      const output = file.replace(this.path.root, this.path.absoluteDist);
      await this.modifiedFile(file, this.replaceImagePaths, manifest, output);
    });
  }

  private async changeDevelpmentMode(): Promise<void> {
    const replaces = [
      {
        search: /const IS_DEVELOPMENT = true;/,
        new: "const IS_DEVELOPMENT = false;",
      },
      {
        search: /const VITE_SERVER = 'http:\/\/localhost:3000';/,
        new: "const VITE_SERVER = '';",
      },
    ];

    const distFilePath = `${this.path.absoluteDist}/${this.options.viteHelperFile}`;
    await this.modifiedFile(`${this.path.root}/${this.options.viteHelperFile}`, this.replaceStrings, replaces, distFilePath);
  }

  public liveReload(ws: any): void {
    this.ws = ws;

    chokidar.watch(`${this.path.root}/**/*.php`, { cwd: this.path.root, ignoreInitial: true }).on("add", this.reload.bind(this)).on("change", this.reload.bind(this));
  }

  private reload(path2: string): void {
    this.ws.send({ type: "full-reload", path: path2 });

    this.logger.info(`page reload ${path2}`, {
      clear: true,
      timestamp: true,
    });
  }
}
