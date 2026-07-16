import Link from "next/link";
import { SearchX } from "lucide-react";

export default function GameNotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 text-center">
      <SearchX className="mx-auto h-16 w-16 text-muted-foreground/40" />
      <h1 className="mt-4 text-2xl font-bold text-foreground">
        Game Not Found
      </h1>
      <p className="mt-2 max-w-md mx-auto text-sm text-muted-foreground">
        The game you are looking for does not exist or has been removed.
      </p>
      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
