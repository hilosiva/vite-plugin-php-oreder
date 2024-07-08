# vite-plugin-php-oreder

[vite-plugin-php-oreder](https://github.com/hilosiva/vite-plugin-php-oreder) は、俺流の Vite 用 PHP ローダーです。

[![Publish package to GitHub Packages](https://github.com/hilosiva/vite-plugin-php-oreder/actions/workflows/auto-publish.yml/badge.svg?branch=main)](https://github.com/hilosiva/vite-plugin-php-oreder/actions/workflows/auto-publish.yml)

## 特徴

- PHP ファイルを更新時にライブリロード
- ビルド時に PHP ファイル内に含まれる img 要素のファイルパスを更新
- [Orelop WP](https://github.com/hilosiva/orelop-wp)利用時、ビルド時に開発用を表す定数を「false」に変更

## インストール

■ npm の場合

```console
  npm i @hilosiva/vite-plugin-php-oreder -D
```

■ yarn の場合

```console
  yarn add @hilosiva/vite-plugin-php-oreder -D
```

■ pnpm の場合

```console
  pnpm i @hilosiva/vite-plugin-php-oreder -D
```

> **警告**
>
> vite-plugin-php-oreder は内部で「glob」を利用しています。自動でインストールはされませんので、予めご自身で開発依存関係として追加して下さい。
>
> ```console
> npm i glob -D
> ```

## 使用方法

「vite.config.js」でインポートし、プラグインに追加してください。

```javascript
import { defineConfig } from "vite";
import { vitePhpOreder } from "@hilosiva/vite-plugin-php-oreder"; // 追加

export default defineConfig({
  plugins: [
    // 追加
    vitePhpOreder({
      /* オプション */
    }),
  ],
});
```

## オプション

### `entryPoint`

- タイプ： String
- デフォルト： `'assets/js/main.js'`

PHP ファイルに読み込ませるエントリーポイントとなる JS ファイルのパス

### `proxy`

- タイプ： String
- デフォルト： `'http://localhost:80'`

PHP が実行しているサーバー URL

### `viteHelperFile`

- タイプ： String
- デフォルト： `'lib/ViteHelper.php'`

[Orelop WP](https://github.com/hilosiva/orelop-wp)のヘルパー用 PHP ファイルのファイルパス

### `reloadOnChange`

- タイプ： Boolean
- デフォルト： true

PHP ファイルの更新時にライブリロードを行うかどうか
