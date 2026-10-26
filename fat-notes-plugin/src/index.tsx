import React from "react";
import type { Disposable, FatNotesPluginSDK } from "fat-notes-sdk";
import StudioDisplayConfig from "./StudioDisplayConfig";
import StudioPage from "./StudioPage";
import { STUDIO_ICON_URL } from "./studioIcon";
import { shellTitle } from "./shellCopy";

const PAGE_ID = "model-x-studio.main";
const BLOCK_TYPE = "model-x-studio.studio";
const disposables: Disposable[] = [];

function readActivityMenuKey(state: unknown): string | undefined {
  if (!state || typeof state !== "object") return undefined;
  const frame = (state as { frame?: unknown }).frame;
  if (!frame || typeof frame !== "object") return undefined;
  const key = (frame as { activityMenuKey?: unknown }).activityMenuKey;
  return typeof key === "string" ? key : undefined;
}

export async function activate(sdk: FatNotesPluginSDK): Promise<void> {
  let activity: Disposable | null = null;
  let activityLocale = "";
  const syncActivityTitle = (locale: string): void => {
    if (activity && locale === activityLocale) return;
    activityLocale = locale;
    const title = shellTitle(locale);
    activity?.dispose();
    activity = sdk.contributions.registerActivityBarItem({
      id: PAGE_ID,
      title,
      pluginName: title,
      icon: "[icon]CarOutlined",
    });
  };

  // 「其他」分类下的仪表盘卡片，做法同 fat-tools.toolSwitcher：
  // 不依赖宿主查询配置，卡片内容就是工作室页。
  let blockType: Disposable | null = null;
  let blockLocale = "";
  const syncBlockType = (locale: string): void => {
    if (blockType && locale === blockLocale) return;
    blockLocale = locale;
    blockType?.dispose();
    blockType = null;
    const register = sdk.contributions.registerBlockType;
    if (typeof register !== "function") return;
    try {
      blockType = register({
        type: BLOCK_TYPE,
        title: shellTitle(locale),
        iconUrl: STUDIO_ICON_URL,
        category: "other",
        index: 4,
        defaultSize: { w: 8, h: 64, minW: 4, minH: 12 },
        dataConfig: false,
        render: () => React.createElement(StudioPage, { sdk }),
      });
    } catch (error) {
      console.warn("[model-x-studio] register block failed", error);
    }
  };

  const syncLocale = (locale: string): void => {
    syncActivityTitle(locale);
    syncBlockType(locale);
  };
  syncLocale(sdk.ui?.i18n?.locale || "zh_CN");
  if (sdk.ui?.i18n) {
    disposables.push(sdk.ui.i18n.onChange(syncLocale));
  }
  disposables.push({
    dispose() {
      activity?.dispose();
      activity = null;
      blockType?.dispose();
      blockType = null;
    },
  });

  const registerDisplay = sdk.contributions.registerBlockDisplayConfig;
  if (typeof registerDisplay === "function") {
    try {
      disposables.push(
        registerDisplay({
          id: "model-x-studio.studio.config",
          blockType: BLOCK_TYPE,
          render: () => React.createElement(StudioDisplayConfig, { sdk }),
        }),
      );
    } catch (error) {
      console.warn("[model-x-studio] register block display config failed", error);
    }
  }

  disposables.push(
    sdk.contributions.registerWorkbenchPage({
      id: PAGE_ID,
      render: () => React.createElement(StudioPage, { sdk }),
    }),
  );

  const activityKey = `bespoke:${PAGE_ID}`;
  let hideSidebar: Disposable | null = null;
  let hidePanel: Disposable | null = null;
  const syncChrome = (activeKey: string | undefined): void => {
    const active = activeKey === activityKey;
    if (active && !hideSidebar) {
      hideSidebar = sdk.contributions.registerHideSecondarySidebar();
    } else if (!active && hideSidebar) {
      hideSidebar.dispose();
      hideSidebar = null;
    }
    if (active && !hidePanel) {
      hidePanel = sdk.contributions.registerHidePanel();
    } else if (!active && hidePanel) {
      hidePanel.dispose();
      hidePanel = null;
    }
  };

  syncChrome(sdk.store.select(readActivityMenuKey));
  disposables.push(
    sdk.store.subscribe(readActivityMenuKey, (nextKey) => syncChrome(nextKey)),
  );
  disposables.push({
    dispose() {
      hideSidebar?.dispose();
      hidePanel?.dispose();
      hideSidebar = null;
      hidePanel = null;
    },
  });
}

export function deactivate(): void {
  while (disposables.length) {
    try {
      disposables.pop()?.dispose();
    } catch {
      // deactivate must not throw
    }
  }
}
