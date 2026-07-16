import { NextResponse } from "next/server";
import { SITE_URL, API_BASE_URL } from "@/lib/constants";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface SitemapUrl {
  loc: string;
  lastmod?: string | null;
  changefreq?: string;
  priority?: string;
}

async function fetchSitemapData(endpoint: string): Promise<SitemapUrl[]> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

function buildSitemapXml(urls: SitemapUrl[]): string {
  const entries = urls
    .map((u) => {
      const lastmod = u.lastmod
        ? `    <lastmod>${new Date(u.lastmod).toISOString()}</lastmod>\n`
        : "";
      const changefreq = u.changefreq
        ? `    <changefreq>${escapeXml(u.changefreq)}</changefreq>\n`
        : "";
      const priority = u.priority
        ? `    <priority>${escapeXml(u.priority)}</priority>\n`
        : "";
      return `  <url>\n    <loc>${escapeXml(`${SITE_URL}${u.loc}`)}</loc>\n${lastmod}${changefreq}${priority}  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

/** Tags sitemap. */
export async function GET(): Promise<NextResponse> {
  const urls = await fetchSitemapData("/seo/sitemap-tags");
  const xml = buildSitemapXml(urls);
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
