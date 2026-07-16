"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GameScreenshot } from "@/types/game";

interface GameGalleryProps {
  screenshots: GameScreenshot[];
  className?: string;
}

/** Screenshot gallery with lightbox preview. */
export function GameGallery({ screenshots, className }: GameGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!screenshots || screenshots.length === 0) return null;

  const sorted = [...screenshots].sort((a, b) => a.sort_order - b.sort_order);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      lightboxIndex === 0 ? sorted.length - 1 : lightboxIndex - 1
    );
  };

  const goNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      lightboxIndex === sorted.length - 1 ? 0 : lightboxIndex + 1
    );
  };

  // Keyboard nav
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
  };

  return (
    <div className={cn("", className)}>
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Screenshots
      </h2>

      {/* Thumbnail grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {sorted.map((screenshot, index) => (
          <button
            key={screenshot.id}
            onClick={() => openLightbox(index)}
            className="group relative aspect-video overflow-hidden rounded-lg bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Image
              src={screenshot.image_url}
              alt={screenshot.title || `Screenshot ${index + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
              <ImageIcon className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Prev */}
          {sorted.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative mx-16 max-h-[85vh] max-w-[85vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={sorted[lightboxIndex].image_url}
              alt={
                sorted[lightboxIndex].title ||
                `Screenshot ${lightboxIndex + 1}`
              }
              width={1920}
              height={1080}
              className="max-h-[85vh] w-auto rounded-lg object-contain"
              priority
            />
            {sorted[lightboxIndex].title && (
              <p className="mt-2 text-center text-sm text-white/80">
                {sorted[lightboxIndex].title}
              </p>
            )}
          </div>

          {/* Next */}
          {sorted.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Counter */}
          {sorted.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
              {lightboxIndex + 1} / {sorted.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
