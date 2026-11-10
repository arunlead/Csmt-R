import { pillars } from "@/data/content";

const blips = [
  ["22%", "62%"],
  ["58%", "30%"],
  ["70%", "68%"],
  ["38%", "44%"],
];

function Radar() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm">
      {[100, 72, 44, 16].map((s) => (
        <span
          key={s}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neon/25"
          style={{ width: `${s}%`, height: `${s}%` }}
        />
      ))}
      <span className="absolute left-0 top-1/2 h-px w-full bg-neon/15" />
      <span className="absolute left-1/2 top-0 h-full w-px bg-neon/15" />
      <span className="sweep absolute inset-0 rounded-full" />
      {blips.map(([t, l], i) => (
        <span
          key={i}
          className="absolute h-2.5 w-2.5"
          style={{ top: t, left: l }}
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-neon/70" />
          <span className="absolute inset-0 rounded-full bg-neon" />
        </span>
      ))}
    </div>
  );
}

function Pipeline() {
  const nodes = ["INPUT", "ENCRYPT", "DELIVER"];
  return (
    <div className="flex h-full flex-col justify-center gap-8 py-6">
      {nodes.map((n, i) => (
        <div key={n}>
          <div className="flex items-center justify-between rounded-lg border border-neon/30 bg-black/60 px-5 py-4 font-mono text-sm text-neon">
            <span>{n}</span>
            <span className="text-white/40">
              {i === 1 ? "AES-256" : i === 0 ? "text + media" : "secure"}
            </span>
          </div>
          {i < nodes.length - 1 && <div className="flow mx-auto mt-4 h-8 w-px" />}
        </div>
      ))}
    </div>
  );
}

const logs = [
  "scan web-app ... 0 critical",
  "db audit ... ok",
  "cloud policy check ... ok",
  "anomaly flagged: login burst",
  "isolating session 4f2a",
  "bug report filed",
  "forensic trace complete",
  "patch verified",
];

function Log() {
  return (
    <div className="h-72 overflow-hidden font-mono text-sm text-neon/90 [mask-image:linear-gradient(transparent,#000_20%,#000_80%,transparent)]">
      <div className="logscroll space-y-3">
        {[...logs, ...logs].map((l, i) => (
          <p key={i}>
            <span className="text-white/30">&gt; </span>
            {l}
          </p>
        ))}
      </div>
    </div>
  );
}

const visuals: Record<string, React.ReactNode> = {
  "threat-intelligence": <Radar />,
  "encrypted-media": <Pipeline />,
  "autonomous-defense": <Log />,
};

export default function Services() {
  return (
    <div className="relative">
      {pillars.map((p, i) => (
        <section
          key={p.id}
          id={i === 0 ? "what-we-do" : p.id}
          className="sticky top-0 flex min-h-screen items-center border-t border-neon/15 bg-black px-6 py-20 md:px-24"
        >
          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-2">
            <div>
              <p className="font-mono text-sm text-neon/70">{p.file}</p>
              <h2 className="mt-4 font-[family-name:var(--font-unbounded)] text-4xl font-black leading-tight text-white md:text-6xl">
                {p.title}
              </h2>
              <p className="mt-6 max-w-md text-lg text-white/65">{p.text}</p>
              <ul className="mt-8 flex flex-wrap gap-3">
                {p.items.map((it) => (
                  <li
                    key={it}
                    className="rounded-md border border-neon/30 bg-neon/5 px-3 py-1.5 font-mono text-sm text-neon"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-neon/20 bg-white/[0.04] p-6 shadow-[0_0_60px_-20px_rgba(34,240,255,.4)] backdrop-blur-xl md:p-8">
              {visuals[p.id]}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}