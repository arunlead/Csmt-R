"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/* Change the hrefs to match your real routes */
const links = [
  { href: "/#home", label: "Home" },
  { href: "/#members", label: "Member list" },
  { href: "/#about", label: "About us" },
  { href: "/#join", label: "Join our group" },
  { href: "/#mascot", label: "Mascot page" },
  { href: "/#legal", label: "Disclaimer" },
];

function Mark() {
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 2 28 9v14L16 30 4 23V9L16 2Z" stroke="url(#g)" strokeWidth="1.6" />
      <path d="M16 9v14M10 12.5l6 3.5 6-3.5" stroke="url(#g)" strokeWidth="1.4" strokeLinecap="round" />
      <defs>
        <linearGradient id="g" x1="4" y1="2" x2="28" y2="30">
          <stop stopColor="#FFE6B0" />
          <stop offset="1" stopColor="#E59A6B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState({ pathname, open: false });
  const open = menu.pathname === pathname && menu.open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:px-6 md:pt-4">
      <nav
        aria-label="Main"
        className={`pointer-events-auto relative flex h-14 w-full max-w-6xl items-center justify-between rounded-full border pl-5 pr-2 backdrop-blur-xl transition-all duration-500 ${
          scrolled
            ? "border-white/15 bg-[#100D12]/85 shadow-[0_10px_50px_-10px_rgba(0,0,0,0.9)]"
            : "border-white/10 bg-[#100D12]/45 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.8)]"
        }`}
      >
        {/* top highlight */}
        <span className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#FFE0A3]/60 to-transparent" />

        {/* logo */}
        <Link href="/" className="group flex items-center gap-2.5" aria-label="CSMT home">
          <Mark />
          <span className="flex flex-col leading-none">
            <span className="font-[family-name:var(--font-unbounded)] text-[15px] font-black tracking-wide text-white">
              CSMT
            </span>
            <span className="mt-1 hidden font-mono text-[8px] uppercase tracking-[0.28em] text-white/45 sm:block">
              Cyber · Media · Tech
            </span>
          </span>
        </Link>

        {/* desktop links */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {links.map((l) => {
            const active = pathname === "/" && l.href === "/#home";
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenu({ pathname, open: false })}
                  className={`relative block rounded-full px-4 py-2 text-[13px] font-medium tracking-wide transition-colors duration-300 ${
                    active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {l.label}
                  {active && (
                    <span className="absolute -bottom-0.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[#F2C27A] shadow-[0_0_10px_2px_rgba(242,194,122,0.8)]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/#join"
            onClick={() => setMenu({ pathname, open: false })}
            className="group relative hidden overflow-hidden rounded-full bg-gradient-to-r from-[#FFE0A3] via-[#FFC46B] to-[#FF9F6B] px-5 py-2.5 text-[13px] font-bold tracking-wide text-[#1b1024] transition-transform duration-300 hover:scale-[1.04] sm:inline-block"
          >
            <span className="relative z-10">Join CSMT</span>
            <span className="absolute inset-0 -translate-x-full bg-white/40 skew-x-[-20deg] transition-transform duration-700 group-hover:translate-x-full" />
          </Link>

          {/* mobile toggle */}
          <button
            type="button"
            onClick={() => setMenu({ pathname, open: !open })}
            aria-expanded={open}
            aria-label="Toggle menu"
            className="relative h-10 w-10 rounded-full border border-white/15 bg-white/5 lg:hidden"
          >
            <span className={`absolute left-1/2 top-[15px] h-px w-4 -translate-x-1/2 bg-white transition-transform duration-300 ${open ? "translate-y-[4px] rotate-45" : ""}`} />
            <span className={`absolute left-1/2 top-[24px] h-px w-4 -translate-x-1/2 bg-white transition-transform duration-300 ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
          </button>
        </div>

        {/* mobile panel */}
        <div
          className={`absolute inset-x-0 top-full mt-2 origin-top rounded-3xl border border-white/10 bg-[#100D12]/95 p-3 backdrop-blur-xl transition-all duration-300 lg:hidden ${
            open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
          }`}
        >
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenu({ pathname, open: false })}
              style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
              className={`flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] transition-all duration-300 ${
                open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              } ${pathname === l.href ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"}`}
            >
              {l.label}
              <span className="font-mono text-[10px] text-white/30">{String(i + 1).padStart(2, "0")}</span>
            </Link>
          ))}
          <Link href="/#join" onClick={() => setMenu({ pathname, open: false })} className="mt-2 block rounded-2xl bg-gradient-to-r from-[#FFE0A3] via-[#FFC46B] to-[#FF9F6B] px-4 py-3 text-center text-[15px] font-bold text-[#1b1024]">
            Join CSMT
          </Link>
        </div>
      </nav>
    </header>
  );
}