# Model X 工作室 · FatNotes 插件

这个目录是 FatNotes 子插件的适配层。上游 Model X Studio 的页面、组件和 `vite.vercel.config.ts` 不放在这里，后面把 fork 更新合并进来时，冲突应只可能出现在仓库根目录的 `tsconfig.json`（多了一条 `exclude`）。

插件壳用宿主的 React 18，通过 iframe 打开 Vite 打出来的工作室页面。工作室仍使用自己的 React 19，两边不共享组件树。页面里对 `/models/...` 的请求（含 GLTFLoader 的 XMLHttpRequest）会在 `viewer/index.html` 里改写到插件目录，所以上游源码不用改路径。

仓库根目录的 `vite.config.ts` 是 Vinext / Cloudflare 服务，静态页面走 `vite.vercel.config.ts` 和 `vercel-app/`。插件构建只覆盖输出目录和 HTML 入口。

## 构建

工作室构建和上游一样，需要 Node.js 22.13 或更高。Node 20.12 跑不了当前的 Vite。

在仓库根目录安装上游依赖（工作室本体需要它）：

```sh
npm ci
```

然后构建插件：

```sh
cd fat-notes-plugin
npm install
npm run build
```

产物在 `fat-notes-plugin/dist/`：`remoteEntry.js` 是插件入口，`studio/` 是工作室页面和模型。

只改了插件壳时，可以 `npm run dev` 监听壳。上游页面有变动时，再执行 `npm run build:studio`。

## 在 FatNotes 里使用

开发模式把插件的 `devPath` 指到 `fat-notes-plugin/dist`，`devMode` 打开。活动栏会出现「Model X 工作室」。`plugin.json` 里的 `id` 与 `mfName` 需要和宿主注册的一致；当前固定为：

- id: `a91c6e24-5f70-4b38-8d12-6c4e0a9b3d57`
- mfName: `plugin_a91c6e24_5f70_4b38_8d12_6c4e0a9b3d57`

如果在宿主里新建插件时生成了另一个 id，把新的 `mfName`（`plugin_` 加上把 `-` 换成 `_` 的 id）写回 `plugin.json` 后重新 `npm run build:shell`。

工作室页面会读取地址栏里的 `locale`，并监听宿主发来的 `fat-notes-host` 语言消息，跟活动栏和仪表盘卡片一起切换中英文。单独打开页面时仍是英文。

## 合并上游

拉取 fork 更新后，在仓库根目录 `npm ci`，再在本目录执行 `npm run build:studio`。不要把插件文件挪进 `app/`、`components/` 或 `vercel-app/`。
