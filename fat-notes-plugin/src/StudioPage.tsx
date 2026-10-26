import React, { useEffect, useRef, useState } from "react";
import type { FatNotesPluginSDK } from "fat-notes-sdk";
import { shellMissingCopy, shellTitle } from "./shellCopy";

declare let __webpack_public_path__: string;

const HOST_LOCALE = "fat-notes-host";

function resolveDistBase(pluginId: string): string {
  const scripts = document.getElementsByTagName("script");
  for (let i = scripts.length - 1; i >= 0; i -= 1) {
    const src = scripts[i]?.src || "";
    if (!src.includes(pluginId) || !src.includes("remoteEntry.js")) continue;
    const clean = src.split("?")[0]?.split("#")[0] || "";
    const slash = clean.lastIndexOf("/");
    if (slash >= 0) return clean.slice(0, slash + 1);
  }
  const pub = typeof __webpack_public_path__ === "string" ? __webpack_public_path__ : "";
  if (pub && pub !== "auto") return pub.endsWith("/") ? pub : `${pub}/`;
  return "";
}

function readLocale(sdk: FatNotesPluginSDK): string {
  return sdk.ui?.i18n?.locale || "zh_CN";
}

function StudioFrame({ sdk }: { sdk: FatNotesPluginSDK }) {
  const base = resolveDistBase(sdk.pluginId);
  const initialLocale = useRef(readLocale(sdk));
  const page = base ? `${base}studio/index.html` : "";
  const src = page ? `${page}?locale=${encodeURIComponent(initialLocale.current)}` : "";
  const [missing, setMissing] = useState(false);
  const [locale, setLocale] = useState(initialLocale.current);
  const localeRef = useRef(locale);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  localeRef.current = locale;

  const postLocale = (next: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      { source: HOST_LOCALE, type: "locale", locale: next },
      "*",
    );
  };

  useEffect(() => {
    const api = sdk.ui?.i18n;
    if (!api) return undefined;
    const sub = api.onChange((next) => {
      setLocale(next);
      postLocale(next);
    });
    return () => sub.dispose();
  }, [sdk]);

  useEffect(() => {
    if (!src) {
      setMissing(true);
      return undefined;
    }
    let cancelled = false;
    setMissing(false);
    fetch(page)
      .then((response) => {
        if (!cancelled) setMissing(!response.ok);
      })
      .catch(() => {
        if (!cancelled) setMissing(true);
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      const data = event.data;
      if (!data || data.source !== "model-x-studio" || data.type !== "ready") return;
      postLocale(localeRef.current);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!src || missing) {
    const copy = shellMissingCopy(locale);
    return (
      <div style={messageStyle}>
        <strong>{copy.title}</strong>
        <p>{copy.body}</p>
        <pre>{`npm ci
cd fat-notes-plugin
npm install
npm run build`}</pre>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      title={shellTitle(locale)}
      src={src}
      onLoad={() => postLocale(localeRef.current)}
      style={{
        width: "100%",
        height: "100%",
        border: 0,
        display: "block",
        background: "#050607",
      }}
    />
  );
}

const messageStyle: React.CSSProperties = {
  height: "100%",
  boxSizing: "border-box",
  padding: 24,
  color: "#24313c",
  font: "14px/1.6 sans-serif",
};

export default function StudioPage({ sdk }: { sdk: FatNotesPluginSDK }) {
  return (
    <div style={{ width: "100%", height: "100%", minHeight: 0 }}>
      <StudioFrame sdk={sdk} />
    </div>
  );
}
