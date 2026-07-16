"use client";

import Link from "next/link";
import { ArrowLeft, Key } from "lucide-react";
import type { DownloadDetailResponse } from "@/types/download";

interface DownloadJumpViewProps {
  data: DownloadDetailResponse;
  qrDataUrl: string;
}

/** PC-side download jump view: QR code + game info + extract code. */
export function DownloadJumpView({ data, qrDataUrl }: DownloadJumpViewProps) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-12 text-center">
      {/* Game title */}
      <h1 className="text-xl font-semibold text-foreground">
        {data.game_title}
      </h1>

      {/* Provider badge */}
      <span className="mt-2 inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
        {data.provider.name}
      </span>

      {/* QR Code */}
      <div className="mt-8 rounded-xl border border-border bg-white p-4 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrDataUrl}
          alt={`Scan QR code to download ${data.game_title} via ${data.provider.name}`}
          className="h-auto w-full max-w-[300px]"
          width={300}
          height={300}
        />
      </div>

      {/* Hint text */}
      <p className="mt-6 text-sm text-muted-foreground">
        "Please scan the QR code with your phone to download"
      </p>

      {/* Extract code */}
      {data.extract_code && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-secondary/50 px-4 py-2.5 text-sm">
          <Key className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="text-muted-foreground">Extract code:</span>
          <code className="rounded bg-background px-2 py-0.5 font-mono font-semibold text-foreground">
            {data.extract_code}
          </code>
        </div>
      )}

      {/* Back button */}
      <Link
        href={`/game/${data.game_slug}`}
        className="mt-8 inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Game
      </Link>
    </div>
  );
}
