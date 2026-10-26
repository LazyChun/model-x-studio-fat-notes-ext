import React, { useEffect, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import type { FatNotesPluginSDK } from "fat-notes-sdk";
import { shellStyleTitle } from "./shellCopy";

interface CollapseProps {
  title: string;
  children?: ReactNode;
}

function readCommon(sdk: FatNotesPluginSDK) {
  const common = sdk.remoteComponents?.BlockConfigCommon;
  return {
    BlockName: common?.BlockName as ComponentType | undefined,
    DisplayCollapse: common?.DisplayCollapse as ComponentType<CollapseProps> | undefined,
    PanelDisplay: common?.PanelDisplay as ComponentType | undefined,
  };
}

export default function StudioDisplayConfig({ sdk }: { sdk: FatNotesPluginSDK }) {
  const [locale, setLocale] = useState(sdk.ui?.i18n?.locale || "zh_CN");

  useEffect(() => {
    const api = sdk.ui?.i18n;
    if (!api) return undefined;
    const sub = api.onChange(setLocale);
    return () => sub.dispose();
  }, [sdk]);

  const { BlockName, DisplayCollapse, PanelDisplay } = readCommon(sdk);
  if (!BlockName) return null;

  const titleField = (
    <div style={{ marginTop: 16 }}>
      <BlockName />
    </div>
  );

  return (
    <div>
      {DisplayCollapse ? (
        <DisplayCollapse title={shellStyleTitle(locale)}>{titleField}</DisplayCollapse>
      ) : (
        titleField
      )}
      {PanelDisplay ? <PanelDisplay /> : null}
    </div>
  );
}
