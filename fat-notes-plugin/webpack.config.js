/*
 * FatNotes Module Federation shell.
 * The studio app itself is built by Vite into dist/studio and is not part of
 * this bundle, so upstream React 19 code never shares the host's React 18.
 */
const fs = require("fs");
const path = require("path");
const {
  ModuleFederationPlugin,
} = require("@module-federation/enhanced/webpack");

const manifest = require("./plugin.json");

const MF_NAME =
  process.env.PLUGIN_MF_NAME ||
  manifest.mfName ||
  manifest.container ||
  "plugin_a91c6e24_5f70_4b38_8d12_6c4e0a9b3d57";

class CopyManifestPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap("CopyModelXStudioManifest", () => {
      const dist = path.resolve(__dirname, "dist");
      fs.mkdirSync(dist, { recursive: true });
      for (const name of ["plugin.json", "funcs.json"]) {
        fs.copyFileSync(path.resolve(__dirname, name), path.join(dist, name));
      }
    });
  }
}

module.exports = (_, argv) => {
  const isProd = argv && argv.mode === "production";
  console.log(`[Model-X-Studio] building remoteEntry as MF name: "${MF_NAME}"`);
  return {
    entry: "./src/bootstrap.ts",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProd ? "[name].[contenthash:8].js" : "[name].js",
      chunkFilename: isProd ? "[name].[contenthash:8].js" : "[name].js",
      publicPath: "auto",
      clean: {
        keep(asset) {
          const normalized = String(asset).replace(/\\/g, "/");
          return (
            normalized === "studio" ||
            normalized.startsWith("studio/") ||
            normalized.includes("/studio/")
          );
        },
      },
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: {
            loader: "ts-loader",
            options: { transpileOnly: true },
          },
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: MF_NAME,
        filename: "remoteEntry.js",
        library: { type: "global", name: MF_NAME },
        exposes: {
          "./plugin": "./src/index.tsx",
        },
        shared: {
          react: { singleton: true, requiredVersion: "18.2.0", eager: false },
          "react-dom": {
            singleton: true,
            requiredVersion: "18.2.0",
            eager: false,
          },
          "react/jsx-runtime": {
            singleton: true,
            requiredVersion: "18.2.0",
            eager: false,
          },
        },
      }),
      new CopyManifestPlugin(),
    ],
    devtool: isProd ? false : "source-map",
    optimization: { minimize: isProd },
  };
};
