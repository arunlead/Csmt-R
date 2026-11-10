export default function HackerFigure() {
  return (
    <svg
      viewBox="0 0 600 700"
      className="h-auto w-full max-w-[520px]"
      role="img"
      aria-label="Hooded hacker working at a laptop"
    >
      <defs>
        <radialGradient id="glow" cx="50%" cy="62%" r="55%">
          <stop offset="0" stopColor="#7fd8ff" stopOpacity="0.35" />
          <stop offset="0.6" stopColor="#ff2e93" stopOpacity="0.1" />
          <stop offset="1" stopColor="#05070d" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hood" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#101a2e" />
          <stop offset="1" stopColor="#05070d" />
        </linearGradient>
        <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7fd8ff" />
          <stop offset="1" stopColor="#ff2e93" />
        </linearGradient>
        <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <rect width="600" height="700" fill="url(#glow)" />

      {/* shoulders */}
      <path
        d="M40 700 C55 520 150 430 300 418 C450 430 545 520 560 700 Z"
        fill="url(#hood)"
        stroke="url(#rim)"
        strokeWidth="2"
        opacity="0.95"
      />
      {/* hood */}
      <path
        d="M300 50 C185 50 135 160 145 262 C150 335 188 395 232 424 L368 424 C412 395 450 335 455 262 C465 160 415 50 300 50 Z"
        fill="url(#hood)"
        stroke="url(#rim)"
        strokeWidth="2.5"
      />
      {/* face void */}
      <path
        d="M300 145 C238 145 212 208 222 272 C230 324 265 356 300 358 C335 356 370 324 378 272 C388 208 362 145 300 145 Z"
        fill="#02030a"
      />
      {/* eyes */}
      <g className="eye-flicker">
        <ellipse cx="268" cy="262" rx="17" ry="4.5" fill="#7fd8ff" filter="url(#blur)" />
        <ellipse cx="332" cy="262" rx="17" ry="4.5" fill="#7fd8ff" filter="url(#blur)" />
        <ellipse cx="268" cy="262" rx="13" ry="2.6" fill="#e9f0ff" transform="rotate(-6 268 262)" />
        <ellipse cx="332" cy="262" rx="13" ry="2.6" fill="#e9f0ff" transform="rotate(6 332 262)" />
      </g>

      {/* laptop glow */}
      <ellipse cx="300" cy="590" rx="190" ry="40" fill="#7fd8ff" opacity="0.35" filter="url(#blur)" />
      {/* laptop lid (back view) */}
      <path
        d="M165 540 L435 540 L470 640 L130 640 Z"
        fill="#090e1b"
        stroke="url(#rim)"
        strokeWidth="2"
      />
      <circle cx="300" cy="590" r="16" fill="none" stroke="#7fd8ff" strokeWidth="2" />
      <path d="M292 590 h16 M300 582 v16" stroke="#ff2e93" strokeWidth="2" />
      {/* base */}
      <rect x="110" y="640" width="380" height="14" rx="7" fill="#0c1424" stroke="#7fd8ff" strokeOpacity="0.5" />
    </svg>
  );
}