interface ScanItem {
  contentHash: string;
  contentType: string;
  contentPreview?: string;
  contentData?: string;
}

interface ScanResult {
  id: string;
  contentHash: string;
  verdict: string;
  confidence: number | null;
  disclosureMsg: string;
  scanStatus: string;
}

const CACHE_KEY = "trustnode_scan_cache";
const CACHE_TTL = 24 * 60 * 60 * 1000;

interface CacheEntry {
  url: string;
  results: ScanResult[];
  timestamp: number;
}

function getCache(): CacheEntry[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setCache(entry: CacheEntry) {
  const cache = getCache().filter((e) => e.url !== entry.url);
  cache.push(entry);
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache.slice(-50)));
}

function hashContent(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

function extractTextItems(): ScanItem[] {
  const items: ScanItem[] = [];
  const textElements = document.querySelectorAll(
    'p, h1, h2, h3, h4, h5, h6, blockquote, article, section, li, td, th'
  );

  textElements.forEach((el) => {
    const text = (el as HTMLElement).innerText?.trim();
    if (text && text.length > 100) {
      items.push({
        contentHash: hashContent(text),
        contentType: "TEXT",
        contentPreview: text.slice(0, 200),
        contentData: text,
      });
    }
  });

  return items;
}

function extractImageItems(): ScanItem[] {
  const items: ScanItem[] = [];
  const images = document.querySelectorAll("img[src]");

  images.forEach((img) => {
    const src = (img as HTMLImageElement).src;
    if (src && !src.startsWith("data:")) {
      items.push({
        contentHash: hashContent(src),
        contentType: "IMAGE",
        contentPreview: src,
        contentData: src,
      });
    }
  });

  return items;
}

export async function scanPage(
  apiUrl: string,
  apiKey: string
): Promise<ScanResult[]> {
  const currentUrl = window.location.href;

  // Check cache first
  const cache = getCache();
  const cached = cache.find((e) => e.url === currentUrl);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.results;
  }

  // Extract page content
  const textItems = extractTextItems();
  const imageItems = extractImageItems();
  const allItems = [...textItems, ...imageItems].slice(0, 20);

  if (allItems.length === 0) return [];

  try {
    const response = await fetch(`${apiUrl}/scan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        pageUrl: currentUrl,
        items: allItems,
      }),
    });

    if (!response.ok) return [];

    const data = await response.json();
    const results: ScanResult[] = data.results || [];

    // Cache results
    setCache({
      url: currentUrl,
      results,
      timestamp: Date.now(),
    });

    return results.filter(
      (r) => r.verdict === "AI_GENERATED" || r.verdict === "AI_MANIPULATED"
    );
  } catch {
    return [];
  }
}

export function subscribeToResults(
  apiUrl: string,
  scanIds: string[],
  callback: (results: ScanResult[]) => void
): () => void {
  const pollInterval = setInterval(async () => {
    try {
      const response = await fetch(
        `${apiUrl}/scan/results?ids=${scanIds.join(",")}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) return;

      const data = await response.json();
      const completed = (data.results || []).filter(
        (r: ScanResult) => r.scanStatus === "COMPLETED" || r.scanStatus === "FAILED"
      );

      if (completed.length === scanIds.length) {
        clearInterval(pollInterval);
        callback(data.results);
      }
    } catch {}
  }, 2000);

  return () => clearInterval(pollInterval);
}
