import type { ComponentType, ReactNode } from "react";

export interface Disposable {
  dispose(): void;
}

export interface BlockTypeDef {
  type: string;
  title: string;
  icon?: string;
  iconUrl?: string;
  category?: string;
  index?: number;
  render: (props: { config: unknown; inConfig?: boolean }) => ReactNode;
  defaultSize?: {
    w?: number;
    h?: number;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
  };
  dataConfig?: false | { render: () => ReactNode };
}

export interface BlockDisplayConfigDef {
  id: string;
  blockType: string;
  render: () => ReactNode;
}

export interface BlockConfigCommonApi {
  BlockName?: ComponentType;
  DisplayCollapse?: ComponentType<{
    title: string;
    defaultExpand?: boolean;
    children?: ReactNode;
  }>;
  PanelDisplay?: ComponentType;
}

export interface FatNotesPluginSDK {
  host: { version: string; mode: "dev" | "prod" };
  pluginId: string;
  contributions: {
    registerActivityBarItem(def: {
      id: string;
      title: string;
      icon: string;
      pluginName?: string;
    }): Disposable;
    registerWorkbenchPage(def: {
      id: string;
      render: () => ReactNode;
    }): Disposable;
    registerHideSecondarySidebar(): Disposable;
    registerHidePanel(): Disposable;
    registerBlockType(def: BlockTypeDef): Disposable;
    registerBlockDisplayConfig(def: BlockDisplayConfigDef): Disposable;
  };
  remoteComponents?: {
    BlockConfigCommon?: BlockConfigCommonApi;
  };
  store: {
    select<T>(selector: (state: unknown) => T): T;
    subscribe<T>(
      selector: (state: unknown) => T,
      cb: (value: T) => void,
    ): Disposable;
  };
  ui: {
    i18n: {
      locale: string;
      onChange(cb: (locale: string) => void): Disposable;
    };
  };
}
