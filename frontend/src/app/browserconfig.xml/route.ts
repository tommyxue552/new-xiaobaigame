import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square70x70logo src="/icon-70.png"/>
      <square150x150logo src="/icon-150.png"/>
      <wide310x150logo src="/icon-310x150.png"/>
      <square310x310logo src="/icon-310.png"/>
      <TileColor>#0f172a</TileColor>
    </tile>
  </msapplication>
</browserconfig>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
