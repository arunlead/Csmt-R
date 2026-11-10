import Link from "next/link";

export default function Mascot() {
  return (
    <section
      id="mascot"
      aria-labelledby="mascot-title"
      className="relative isolate overflow-hidden border-t border-[#F2C27A]/15 bg-[#09080b] px-5 py-20 sm:px-8 md:px-12 md:py-28"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#F2C27A]">
            CSMT // Digital identity
          </p>
          <h2
            id="mascot-title"
            className="mt-4 font-[family-name:var(--font-unbounded)] text-4xl font-black leading-tight text-white sm:text-5xl"
          >
            Meet our
            <span className="block bg-gradient-to-r from-[#FFE6B0] to-[#E59A6B] bg-clip-text text-transparent">
              mascot.
            </span>
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">
            A symbol of curiosity, privacy and responsible exploration—the values
            that guide our community.
          </p>
          <Link
            href="/#join"
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#F2C27A]/35 bg-[#F2C27A]/[0.06] px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-[#FFE0A3] transition hover:border-[#F2C27A]/70 hover:bg-[#F2C27A]/[0.12]"
          >
            Join the community
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="group relative overflow-hidden rounded-3xl border border-[#F2C27A]/20 bg-[#120f0c] shadow-[0_24px_100px_-45px_rgba(242,194,122,0.38)]">
          <div
            role="img"
            aria-label="CSMT mascot displayed in a futuristic cybersecurity chamber"
            className="aspect-[16/10] bg-cover bg-center transition duration-700 group-hover:scale-[1.025]"
            style={{ backgroundImage: "url('/assets/images/mascot-environment.png')" }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09080b]/85 via-transparent to-[#09080b]/10" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#F2C27A]/80">
                Guardian // 001
              </p>
              <p className="mt-2 font-[family-name:var(--font-unbounded)] text-lg font-bold text-white sm:text-xl">
                Curious by design.
              </p>
            </div>
            <span className="mb-1 h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#F2C27A] shadow-[0_0_16px_4px_rgba(242,194,122,0.45)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
