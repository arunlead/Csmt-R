"use client";

import { useMemo, useState } from "react";
import { members, team } from "@/data/content";

export default function Members() {
  const [query, setQuery] = useState("");
  const filteredMembers = useMemo(() => {
    const value = query.trim().toLocaleLowerCase();
    return members
      .map((name, index) => ({ name, index }))
      .filter(({ name }) => name.toLocaleLowerCase().includes(value));
  }, [query]);

  return (
    <section
      id="members"
      aria-labelledby="members-title"
      className="relative isolate overflow-hidden border-t border-[#F2C27A]/15 bg-[#09080b] px-5 py-24 sm:px-8 md:px-12 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(242,194,122,0.12),transparent_55%)]" />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-[#F2C27A]">
              CSMT // The people behind the work
            </p>
            <h2
              id="members-title"
              className="mt-4 font-[family-name:var(--font-unbounded)] text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl"
            >
              Our team
              <span className="block bg-gradient-to-r from-[#FFE6B0] to-[#E59A6B] bg-clip-text text-transparent">
                members.
              </span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
              A curious, collaborative community building skills across cybersecurity,
              software and media technology.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:min-w-36 sm:p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                Members
              </p>
              <p className="mt-2 text-3xl font-semibold text-white">{team.total}</p>
            </div>
            <div className="rounded-2xl border border-[#F2C27A]/25 bg-[#F2C27A]/[0.06] p-4 sm:min-w-44 sm:p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F2C27A]/70">
                Open places
              </p>
              <p className="mt-2 text-3xl font-semibold text-[#FFE0A3]">{team.openSlots}</p>
              <p className="mt-1 text-xs text-white/45">{team.note}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-y border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-white/55">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/50" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            {team.status}
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Search team members</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
            >
              <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.6" />
              <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find a member"
              className="w-full rounded-full border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#F2C27A]/50 focus:bg-white/[0.07]"
            />
          </label>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map(({ name, index }) => (
            <div
              key={`${name}-${index}`}
              className="group flex min-h-16 items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 transition duration-300 hover:-translate-y-0.5 hover:border-[#F2C27A]/30 hover:bg-[#F2C27A]/[0.045]"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[#F2C27A]/20 bg-[#F2C27A]/[0.07] font-mono text-xs text-[#F2C27A] transition group-hover:border-[#F2C27A]/45">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-medium text-white/85">{name}</span>
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#F2C27A]/40 transition group-hover:bg-[#F2C27A]" />
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <p className="py-16 text-center text-sm text-white/50" role="status">
            No members match “{query}”.
          </p>
        )}

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {filteredMembers.length} of {members.length} team members
          </p>
          <p className="font-mono text-xs">Roster updated {team.updated}</p>
        </div>
      </div>
    </section>
  );
}
