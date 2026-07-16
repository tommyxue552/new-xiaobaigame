import Link from "next/link";
import { Download, Key, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DownloadResource } from "@/types/download";

interface DownloadSectionProps {
  downloads: DownloadResource[];
  className?: string;
}

/** Download resources section showing all available download options. */
export function DownloadSection({ downloads, className }: DownloadSectionProps) {
  return (
    <div className={cn("", className)}>
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Download
      </h2>

      {downloads.length === 0 ? (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>No download resources available for this game.</span>
        </div>
      ) : (
        <div className="space-y-3">
          {downloads.map((resource) => (
            <div
              key={resource.id}
              className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {resource.provider.name}
                  </span>
                  {resource.notes && (
                    <span className="text-xs text-muted-foreground">
                      ({resource.notes})
                    </span>
                  )}
                </div>

                {resource.extract_code && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Key className="h-3 w-3" />
                    <span>
                      Extract code: 
                      <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-foreground">
                        {resource.extract_code}
                      </code>
                    </span>
                  </div>
                )}
              </div>

              {/* Download button - links to download jump page */}
              <Link
                href={`/download/${resource.id}`}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Download className="h-4 w-4" />
                Download
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
