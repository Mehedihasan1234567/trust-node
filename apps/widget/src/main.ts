import Widget from "./Widget.svelte";

const CSS_RESET = `
  :host {
    all: initial;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: #1a1a2e;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  .tn-widget {
    position: fixed;
    z-index: 99999;
  }
  .tn-widget--top {
    top: 0;
    left: 0;
    right: 0;
  }
  .tn-widget--bottom {
    bottom: 0;
    left: 0;
    right: 0;
  }
  .tn-banner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 16px;
    font-size: 13px;
    background: #eff6ff;
    border-bottom: 1px solid #bfdbfe;
    color: #1e40af;
  }
  .tn-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 500;
    border-radius: 4px;
    background: #fef2f2;
    color: #991b1b;
    border: 1px solid #fecaca;
    cursor: help;
  }
  .tn-badge:hover {
    background: #fee2e2;
  }
  .tn-badge--generated {
    background: #fef2f2;
    color: #991b1b;
    border-color: #fecaca;
  }
  .tn-badge--manipulated {
    background: #fffbeb;
    color: #92400e;
    border-color: #fde68a;
  }
  .tn-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;
  }
  .tn-modal {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    max-width: 420px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  }
  .tn-modal h3 {
    font-size: 16px;
    margin-bottom: 8px;
  }
  .tn-modal p {
    font-size: 13px;
    color: #6b7280;
    margin-bottom: 16px;
  }
  .tn-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    border: none;
    cursor: pointer;
  }
  .tn-btn-primary {
    background: #2563eb;
    color: white;
  }
  .tn-btn-primary:hover {
    background: #1d4ed8;
  }
  .tn-btn-ghost {
    background: transparent;
    color: #6b7280;
  }
  .tn-btn-ghost:hover {
    background: #f3f4f6;
  }
  .tn-hidden {
    display: none !important;
  }
`;

interface WidgetOptions {
  apiKey?: string;
  apiUrl?: string;
  theme?: "light" | "dark" | "auto";
  position?: "top_banner" | "bottom_bar" | "inline_only" | "modal_only";
  autoScan?: boolean;
  language?: string;
}

(function () {
  "use strict";

  if (document.getElementById("trust-node-widget-root")) {
    return;
  }

  const script = document.currentScript as HTMLScriptElement | null;
  if (!script) return;

  const options: WidgetOptions = {
    apiKey: script.getAttribute("data-api-key") || undefined,
    apiUrl:
      script.getAttribute("data-api-url") ||
      "https://api.trust-node.ai/api/widget",
    theme: (script.getAttribute("data-theme") as WidgetOptions["theme"]) || "auto",
    position: (script.getAttribute("data-position") as WidgetOptions["position"]) || "inline_only",
    autoScan: script.getAttribute("data-auto-scan") !== "false",
    language: script.getAttribute("data-language") || "en",
  };

  if (!options.apiKey) {
    console.warn("[TrustNode] No API key provided. Widget will not load.");
    return;
  }

  const host = document.createElement("div");
  host.id = "trust-node-widget-root";
  document.body.appendChild(host);

  const shadowRoot = host.attachShadow({ mode: "closed" });

  const styleEl = document.createElement("style");
  styleEl.textContent = CSS_RESET;
  shadowRoot.appendChild(styleEl);

  const mountPoint = document.createElement("div");
  mountPoint.id = "trust-node-mount";
  shadowRoot.appendChild(mountPoint);

  new Widget({
    target: mountPoint,
    props: options,
  });
})();
