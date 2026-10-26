export function isEnglishLocale(locale: string | undefined): boolean {
  return String(locale || "").toLowerCase().replace(/-/g, "_").startsWith("en");
}

export function shellTitle(locale: string | undefined): string {
  return isEnglishLocale(locale) ? "Model X Studio" : "Model X 工作室";
}

export function shellStyleTitle(locale: string | undefined): string {
  return isEnglishLocale(locale) ? "Style" : "样式";
}

export function shellMissingCopy(locale: string | undefined): { title: string; body: string } {
  if (isEnglishLocale(locale)) {
    return {
      title: "Model X Studio is not built yet",
      body: "Install the upstream dependencies in model-x-studio-fat-notes-ext, then build the plugin:",
    };
  }
  return {
    title: "Model X 工作室还没有构建",
    body: "在 model-x-studio-fat-notes-ext 里先安装上游依赖，再构建插件：",
  };
}
