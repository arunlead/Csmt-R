import type { CSSProperties } from "react";
import { brand } from "@/data/content";
import HackerFigure from "./HackerFigure";

const lines = [
  { text: "> initializing csmt.network ...", d: "0.4s" },
  { text: "> scanning web, database, cloud ... OK", d: "1.7s" },
  { text: "> access granted: play with systems", d: "3.3s" },
];

export default function Hero() {
  return (
    <section className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-6 pt-24 md:grid-cols-2">
      <div>
        <h1
          data-text={brand.name}
          className="glitch font-[family-name:var(--font-unbounded)] text-6xl font-black leading-none text-fg md:text-8xl"
        >
          {brand.name}
        </h1>
        <p className="mt-3 font-[family-name:var(--font-unbounded)] text-sm text-ice md:text-base">
          {brand.full}
        </p>
        <p className="mt-6 max-w-md text-lg text-muted">{brand.tagline}</p>

        <div
          className="mt-8 max-w-md rounded-md border border-ice/30 bg-black/50 p-4 font-mono text-sm text-ice backdrop-blur"
          aria-hidden="true"
        >
          {lines.map((l) => (
            <span
              key={l.text}
              className="type"
              style={{ "--n": l.text.length, "--d": l.d } as CSSProperties}
            >
              {l.text}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href={`mailto:${brand.email}`}
            className="rounded-md bg-magenta px-6 py-3 font-semibold text-white transition hover:brightness-110"
          >
            Join CSMT
          </a>
          <a
            href="#what-we-do"
            className="rounded-md border border-ice/50 px-6 py-3 font-semibold text-ice transition hover:bg-ice/10"
          >
            See what we do
          </a>
        </div>
      </div>

      <div className="grid place-items-center">
        <HackerFigure />
      </div>
    </section>
  );
}