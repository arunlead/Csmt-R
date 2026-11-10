export const brand = {
  name: "CSMT",
  full: "Cybersecurity and Media Tech",
  tagline: "Play with systems. Control it, design it.",
  intro:
    "CSMT creates highly secured and feasible websites, software, IT systems and ethical hacking and cybersecurity practices. We run workshops and courses on ethical hacking, cybersecurity, computer science, and technical and non-technical subjects for multiple institutions.",
  email: "5zaanu@gmail.com",
};

export const security = [
  "Web Security",
  "Database Security",
  "Cloud Security",
  "Cybersecurity Solutions",
];

export const media = [
  "Create Website",
  "Billing Software",
  "ERP Systems",
  "Software Solutions",
  "Distributed Cloud",
];

export const team = {
  total: 39,
  openSlots: 4,
  note: "1 slot reserved for international applicants",
  status: "Registration LIVE",
  updated: "20-09-2026",
};

export const members = [
  "Mohamed Faizaan",
  "Arun",
  "Haroon Rasheed",
  "Laurence Agbessi",
  "Robert",
  "Ritika Nagrale",
  "Hasheer",
  "Siddiq",
  "Abdul Salam",
  "Raiyan",
  "Benny",
  "Vignesh",
  "Mohamed Fahim",
  "Manoj",
  "Hameeth",
  "Jagar",
  "Sandhiya",
  "Arfath Khan",
  "Irfan Basha",
  "Jamalludeen",
  "Akash",
  "MohamedAslam",
  "Najeebullah",
  "Malavika",
  "Ayub",
  "Mohammed Farook",
  "Kamaleshwaran",
  "Abbas",
  "Hemanth",
  "Afra Thasneem",
  "Mohammed Ibrahim",
  "Abdul Malik",
  "Mohamed Hussain",
  "Jothimani",
  "Harmaen Zama",
  "Ashraf",
  "Mohammed Ashim",
  "Alniyaz",
  "Najeebullah",
];

export type Achievement = { title: string; soon?: boolean };

export const achievements: Achievement[] = [
  { title: "Automated Text and Media Encryption software" },
  { title: "Group Internal Challenge Program (GCIP 2024)" },
  { title: "AI Manipulation Safety event" },
  { title: "Cyber Forensic Workshop" },
  { title: "Ethical Hacking Workshop" },
  { title: "Study on Bug Bounty Programs" },
  { title: "Filmorago" },
];

export const comingSoon = [
  "Our full achievements",
  "Past and future events",
  "Collaboration details",
];

export const legal = {
  disclaimer:
    "Our activities focus only on teaching cybersecurity and media technology skills so members can learn to recognise and protect against threats. We do not endorse, promote or assist in any illegal activity.",
  copyright: "© 2025 - 2030 Cybersecurity and Media tec (CSMT). All rights reserved.",
};
export const pillars = [
  {
    id: "threat-intelligence",
    file: "threat-intel.sys",
    title: "Threat Intelligence",
    text: "We study how attacks work, so your websites, databases and cloud stay a step ahead.",
    items: security,
  },
  {
    id: "encrypted-media",
    file: "media-pipeline.sys",
    title: "Encrypted Media Pipelines",
    text: "We build the software your team runs on, from websites to ERP, and protect text and media with our own encryption tool.",
    items: [...media, "Automated Text and Media Encryption"],
  },
  {
    id: "autonomous-defense",
    file: "defense.sys",
    title: "Autonomous Defense",
    text: "Workshops, studies and challenges where members learn to spot AI manipulation, trace incidents and report bugs responsibly.",
    items: [
      "AI Manipulation Safety",
      "Cyber Forensic Workshop",
      "Ethical Hacking Workshop",
      "Bug Bounty study",
    ],
  },
];
export const nav = [
  { label: "Home", href: "#home" },
  { label: "Member list", href: "#members" },
  { label: "About us", href: "#about" },
  { label: "Join our group", href: "#join" },
  { label: "Mascot page", href: "#mascot" },
  { label: "Disclaimer and copyright notice", href: "#legal" },
] as const;

export const about = {
  who: "CSMT, short for Cyber Security and Media Technology (formerly BSC Hacking and Media Tec), creates secure websites, software and IT systems, and runs workshops and courses on ethical hacking, cybersecurity and computer science for multiple institutions.",
  mission:
    "Our mission is to drive technological innovation, improve digital literacy and advance secure computing practices, with a strong focus on studying AI systems and integrating them safely into professional and personal life.",
  chips: [
    "Ethical hacking",
    "Cybersecurity",
    "Computer science",
    "Workshops and courses",
    "Secure software and IT systems",
    "AI safety",
  ],
};