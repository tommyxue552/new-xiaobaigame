"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

interface GameDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GameDetailError({ error, reset }: GameDetailErrorProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 text-center">
      <AlertTriangle className="mx-auto h-16 w-16 text-destructive" />
      <h1 className="mt-4 text-2xl font-bold text-foreground">
        Failed to Load Game
      </h1>
      <p className="mt-2 max-w-md mx-auto text-sm text-muted-foreground">
        {error.message || "An unexpected error occurred while loading the game details."}
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-md border border-border px-6 text-sm font-medium text-foreground hover:bg-accent"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
