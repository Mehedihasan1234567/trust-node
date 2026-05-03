<script lang="ts">
  import { onMount } from "svelte";
  import { scanPage, subscribeToResults } from "./lib/api";

  export let apiKey: string = "";
  export let apiUrl: string = "https://api.trust-node.ai/api/widget";
  // svelte-ignore unused-export-let
  export let theme: "light" | "dark" | "auto" = "auto";
  export let position: "top_banner" | "bottom_bar" | "inline_only" | "modal_only" = "inline_only";
  export let autoScan: boolean = true;
  export let language: string = "en";

  let isLoading = false;
  let results: any[] = [];
  let showModal = false;
  let selectedResult: any = null;

  interface Labels {
    detected: string;
    generated: string;
    manipulated: string;
    learnMore: string;
    close: string;
    scanning: string;
  }
  const labels: Record<string, Labels> = {
    en: { detected: "AI Content Detected", generated: "Generated with AI", manipulated: "Manipulated with AI", learnMore: "Learn more", close: "Close", scanning: "Scanning for AI content..." },
  };
  const t = labels[language] || labels["en"]!;

  onMount(async () => {
    if (autoScan) {
      isLoading = true;
      results = await scanPage(apiUrl, apiKey);
      isLoading = false;

      if (results.length > 0) {
        if (position === "inline_only") {
          attachInlineBadges(results);
        }
      }
    }
  });

  function attachInlineBadges(results: any[]) {
    const aiResults = results.filter(
      (r: any) => r.verdict === "AI_GENERATED" || r.verdict === "AI_MANIPULATED"
    );

    aiResults.forEach((result: any) => {
      const badge = document.createElement("span");
      badge.className = "tn-badge tn-badge--generated";
      badge.innerHTML = `&#x2753; ${result.disclosureMsg || t.generated}`;
      badge.title = "Click for more info";
      badge.addEventListener("click", () => {
        selectedResult = result;
        showModal = true;
      });

      // Find matching content in the page
      const shadowHost = document
        .getElementById("trust-node-widget-root")
        ?.shadowRoot;
      if (!shadowHost) return;

      const pageElement = findMatchingElement(
        result.contentPreview || ""
      );
      if (pageElement) {
        pageElement.insertAdjacentElement("afterend", badge);
      }
    });
  }

  function findMatchingElement(preview: string): Element | null {
    const allTextNodes = document.querySelectorAll("p, span, div, article, section");
    for (const el of allTextNodes) {
      if (el.textContent?.includes(preview.slice(0, 50))) {
        return el;
      }
    }
    return null;
  }

  function handleClose() {
    showModal = false;
    selectedResult = null;
  }
</script>

{#if isLoading}
  <div class="tn-widget tn-widget--{position === 'top_banner' ? 'top' : 'bottom'}">
    <div class="tn-banner">
      <span>{t.scanning}</span>
    </div>
  </div>
{/if}

{#if results.length > 0 && (position === "top_banner" || position === "bottom_bar")}
  <div class="tn-widget tn-widget--{position === 'top_banner' ? 'top' : 'bottom'}">
    <div class="tn-banner">
      <span>&#x26A0;&#xFE0F; {t.detected}</span>
      <button class="tn-btn tn-btn-primary" on:click={() => (showModal = true)}>
        {t.learnMore}
      </button>
    </div>
  </div>
{/if}

{#if showModal}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions a11y-no-noninteractive-element-interactions -->
  <div class="tn-modal-overlay" on:click|self={handleClose} role="dialog" aria-modal="true">
    <div class="tn-modal">
      <h3>{t.detected}</h3>
      <p>
        This content was identified as potentially AI-generated.
        Disclosure provided by the website operator in compliance
        with the EU AI Act.
      </p>
      <div style="display: flex; gap: 8px; justify-content: flex-end;">
        <button class="tn-btn tn-btn-ghost" on:click={handleClose}>{t.close}</button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Styles are injected in main.ts via Shadow DOM reset */
  /* Component-specific styles below */
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
</style>
