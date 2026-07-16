import { Gamepad2 } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

/** Hero banner with gradient background, site name, and tagline. */
export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.15),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="flex flex-col items-center text-center">
          <Gamepad2 className="h-16 w-16 text-blue-400 mb-6" />
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {SITE_NAME}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Discover and share game resources — mods, saves, tools, and more
          </p>

          {/* Placeholder CTA */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="inline-flex h-10 items-center rounded-md bg-blue-600 px-6 text-sm font-medium text-white shadow transition-colors hover:bg-blue-500 cursor-pointer">
              Browse Games
            </span>
            <span className="inline-flex h-10 items-center rounded-md border border-slate-600 bg-slate-800/50 px-6 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800 cursor-pointer">
              Latest Updates
            </span>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
