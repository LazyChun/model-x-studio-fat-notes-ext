/**
 * Vite build for the studio viewer that FatNotes iframes.
 *
 * The repository root vite.config.ts is the Vinext / Cloudflare server. The
 * static browser app lives in vite.vercel.config.ts, so this file imports that
 * config and only overrides the output location and the HTML entry. Upstream
 * plugins, aliases, and PostCSS stay in the upstream file.
 */
import { fileURLToPath } from "node:url";
import { defineConfig, mergeConfig } from "vite";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const viewerRoot = fileURLToPath(new URL("./viewer", import.meta.url));
const studioOutDir = fileURLToPath(new URL("./dist/studio", import.meta.url));
const publicDir = fileURLToPath(new URL("../public", import.meta.url));

function tailwindRepoSource() {
  return {
    name: "model-x-studio-tailwind-source",
    enforce: "pre" as const,
    transform(code: string, id: string) {
      const file = id.split("?")[0]?.replace(/\\/g, "/") ?? "";
      if (!file.endsWith("/app/globals.css")) return null;
      if (code.includes("@source")) return null;
      // Scan the repository, not only the Vite root, so utility classes in
      // upstream components survive this build. The directive is injected
      // here instead of editing app/globals.css.
      return { code: `${code}\n@source "..";\n`, map: null };
    },
  };
}

export default defineConfig(async (env) => {
  // Tailwind content detection follows the process cwd. Match `npm run build`
  // at the repository root so class scanning does not shrink to this folder.
  process.chdir(repoRoot);
  const imported = await import("../vite.vercel.config.ts");
  const base = imported.default;
  const loaded = typeof base === "function" ? await base(env) : base;
  return mergeConfig(loaded, {
    // HTML entry must live at the Vite root. Upstream root stays `vercel-app/`
    // for `npm run build:vercel`; this override is only used by the plugin build.
    root: viewerRoot,
    base: "./",
    publicDir,
    server: {
      fs: {
        allow: [repoRoot],
      },
    },
    plugins: [tailwindRepoSource()],
    build: {
      outDir: studioOutDir,
      emptyOutDir: true,
    },
  });
});
