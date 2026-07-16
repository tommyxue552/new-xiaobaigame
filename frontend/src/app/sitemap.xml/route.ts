import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/constants";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Generate sitemap index XML referencing sub-sitemaps. */
export async function GET(): Promise<NextResponse> {
  const now = new Date().toISOString();

  const subSitemaps = [
    { loc: `${SITE_URL}/sitemap-games.xml` },
    { loc: `${SITE_URL}/sitemap-categories.xml` },
    { loc: `${SITE_URL}/sitemap-tags.xml` },
  ];

  const entries = subSitemaps
    .map(
      (s) =>
        `  <sitemap>\n    <loc>${escapeXml(s.loc)}</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
