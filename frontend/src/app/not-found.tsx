import type { Metadata } from "next";
import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Page Not Found | ${SITE_NAME}`,
  description: "The page you are looking for could not be found.",
  robots: { index: false, follow: false },
};

export default function NotFoundPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Page Not Found",
    description: "The requested page could not be found.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <FileQuestion className="h-16 w-16 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold text-foreground">
          404 - Page Not Found
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}
