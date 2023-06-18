# vite-plugin-php-oreder

[vite-plugin-php-oreder](https://github.com/hilosiva/vite-plugin-php-oreder) は、俺流の Vite 用 PHP ローダーです。

[![Publish package to GitHub Packages](https://github.com/hilosiva/vite-plugin-php-oreder/actions/workflows/auto-publish.yml/badge.svg?branch=main)](https://github.com/hilosiva/vite-plugin-php-oreder/actions/workflows/auto-publish.yml)

## 特徴

- PHP ファイルを更新時にライブリロード
- ビルド時に PHP ファイル内に含まれる img 要素のファイルパスを更新
- [Orelop WP](https://github.com/hilosiva/orelop-wp)利用時、ビルド時に開発用を表す定数を「false」に変更

## インストール

> **注意**
>
> vite-plugin-php-oreder は、GitHub Package に公開しているパッケージになります。
>
> 従ってインストールには、GitHub の「[Personal access tokens (classic)](https://github.com/settings/tokens)」が必要となります。
>
> すでに、お使いのマシンのホームディレクトリに、 GitHub の「 > **read:packages** 」権限を付与した「[Personal access tokens > (classic)](https://github.com/settings/tokens)」を記述した、「.npmrc」ファイルを作成されていない場合は、以下の操作で「.npmrc」ファイルを作成し、GitHub Package をインストールできるようにしておいて下さい。
>
> 1. GitHub の「 **read:packages** 」権限を付与した「[Personal access tokens (classic)](https://github.com/settings/tokens)」を取得
> 2. お使いのマシンのホームディレクトリ（他のプロジェクトでも使える）かプロジェクトのルートディレクトリ（このプロジェクトのみ使える）に「.npmrc」ファイルを作成し、以下の内容で保存
>
> ```
> @{GitHubのユーザ名}:registry="https://npm.pkg.github.com"
> //npm.pkg.github.com/:_authToken={Personal access tokens}
> ```
>
> ※ {GitHub のユーザ名} は GitHub のユーザ名か組織名に置き換える
> ※ {Personal access tokens} は「1」で取得したトークンに置き換える
>
> 例
>
> ```
> @hilosiva:registry="https://npm.pkg.github.com"
> //npm.pkg.github.com/:_authToken=ghp_XXXXXXXXXXXXXXXXXXXXX
> ```

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
import { VitePhpOreder } from "@hilosiva/vite-plugin-php-oreder"; // 追加

export default defineConfig({
  plugins: [
    // 追加
    VitePhpOreder({
      /* オプション */
    }),
  ],
});
```

## オプション

### `viteHelperFile`

- タイプ： String
- デフォルト： `'lib/ViteHelper.php'`

[Orelop WP](https://github.com/hilosiva/orelop-wp)のヘルパー用 PHP ファイルのファイルパス
