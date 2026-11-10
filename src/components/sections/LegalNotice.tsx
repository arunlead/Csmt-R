"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { brand, legal } from "@/data/content";

const notices = [
  {
    label: "01 / Responsible use",
    text: "Joining the group should be based on genuine interest. By providing your details, you confirm that you are the person applying. If you encounter an issue related to the group, please report your concern so we can make reasonable efforts to assist.",
  },
  {
    label: "02 / Privacy",
    text: "We collect basic contact information from applicants, such as name, phone number and country. We handle personal information confidentially and do not share it with external parties, except where needed within the group or where names are displayed on this website.",
  },
  {
    label: "03 / Educational use",
    text: "CSMT is an educational group focused on ethical cybersecurity simulations and media technology training. Activities use our own resources or authorised materials. Any third-party materials remain credited to their respective owners. We do not endorse, promote or assist illegal activity.",
  },
];

export default function LegalNotice() {
  const section = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = section.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={section}
      id="legal"
      aria-labelledby="legal-title"
      className="relative isolate overflow-hidden border-t border-[#F2C27A]/15 bg-[#08070a] px-5 py-20 sm:px-8 md:px-12 md:py-28"
    >
      <div className="legal-ambient pointer-events-none absolute inset-0 -z-10" />
      <div
        className={`mx-auto max-w-7xl transition duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#F2C27A]">
              CSMT // Transparency
            </p>
            <h2
              id="legal-title"
              className="mt-4 font-[family-name:var(--font-unbounded)] text-3xl font-black text-white sm:text-4xl md:text-5xl"
            >
              Disclaimer
              <span className="text-[#E59A6B]"> &amp; terms</span>
            </h2>
          </div>
          <span className="rounded-full border border-[#F2C27A]/20 bg-[#F2C27A]/[0.06] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#F2C27A]/80">
            Read before participating
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {notices.map((notice, index) => (
            <article
              key={notice.label}
              className={`rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition duration-700 hover:border-[#F2C27A]/25 hover:bg-white/[0.04] sm:p-7 ${
                visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{ transitionDelay: visible ? `${index * 100}ms` : "0ms" }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F2C27A]/70">
                {notice.label}
              </p>
              <p className="mt-5 text-sm leading-7 text-white/65 sm:text-base">
                {index === 0 ? `${notice.text} ${legal.disclaimer}` : notice.text}
              </p>
            </article>
          ))}
        </div>

        <div
          className={`mt-4 grid gap-8 rounded-2xl border border-[#F2C27A]/15 bg-gradient-to-br from-[#F2C27A]/[0.07] to-transparent p-6 transition duration-700 sm:p-8 md:grid-cols-[1fr_auto] md:items-center ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: visible ? "300ms" : "0ms" }}
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F2C27A]/70">
              Copyright notice
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65 sm:text-base">
              Website designs, content and elements are original creations by CSMT
              member Faizaan and are protected by copyright law. The registration
              form is powered by Jotform.
            </p>
            <p className="mt-4 text-xs leading-6 text-white/40">
              For questions about these notices, contact the CSMT team at{" "}
              <a
                href={`mailto:${brand.email}`}
                className="text-[#F2C27A] underline decoration-[#F2C27A]/40 underline-offset-4 transition hover:text-[#FFE6B0]"
              >
                {brand.email}
              </a>
              .
            </p>
          </div>
          <div className="border-t border-white/10 pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
              CSMT / Legal
            </p>
            <p className="mt-2 max-w-xs text-sm leading-6 text-white/45">
              Use all learning materials responsibly and only with proper
              authorisation.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>{legal.copyright}</p>
          <Link
            href="/"
            className="w-fit font-mono uppercase tracking-[0.16em] text-[#F2C27A]/70 transition hover:text-[#FFE6B0]"
          >
            Back to top ↑
          </Link>
        </div>
      </div>
    </section>
  );
}
