import type {
  FooterConfig,
  LinkConfig,
  ProfileConfig,
  PublicationConfig,
  SiteConfig,
} from "@/types"

export const SITE: SiteConfig = {
  title: "Nan Li",
  description:
    "Applied mathematician at the University of Minnesota working on dynamical systems, nonlinear waves, pattern formation, and PDE models in mathematical biology.",
  href: "https://nanli.co",
  author: "Nan Li",
  dir: "ltr",
  defaultPageImage: "/img/social-preview.png",
  defaultPostImage: "/img/social-preview.png",

  locale: {
    lang: "en-US",
    options: {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    },
  },

  blog: {
    featuredPostCount: 3,
    postsPerPage: 8,
    tocMaxDepth: 3,
    shareActions: ["x"],
  },

  home: {
    careerHighlightCount: 0,
    updateCount: 3,
    publicationCount: 3,
  },

  favicon: "/favicon.ico",
  prerender: true,
  npmCDN: "https://cdn.jsdelivr.net/npm",

  license: {
    label: "CC-BY-4.0",
    href: "https://creativecommons.org/licenses/by/4.0/",
  },
}

export const PROFILE: ProfileConfig = {
  name: SITE.title,
  tagline: "University of Minnesota",
  researchInterests:
    "Dynamics of ordinary and partial differential equations, nonlinear waves, pattern formation",
  email: "li002843@umn.edu",
  links: {
    github: "https://github.com/eigenan",
    linkedin: "https://www.linkedin.com/in/eigenan/",
    cv: "/doc/short_cv.pdf",
    googleScholar: "https://scholar.google.com/citations?user=9E-qGccAAAAJ",
  },
  // where the links above show up. true = that section's default set, false or
  // [] = none, or list keys in the order you want them. The header renders its
  // set as bare icons, so it defaults to a handful rather than everything.
  linksPlacement: {
    header: ["email", "github", "linkedin", "cv", "googleScholar"],
    about: false,
    footer: true,
  },
}

export const NAV_LINKS: LinkConfig[] = [
  // { href: "/projects", label: "Projects" },
  { href: "/research", label: "Research" },
  { href: "/blog", label: "Blog" },
  // { href: "/uses", label: "Tech" },
  // { href: "/now", label: "Now" },
]

export const NAVIGATION: LinkConfig[] = NAV_LINKS.map(({ href, label }) => ({
  href,
  label,
}))

export const PUB_CONFIG: PublicationConfig = {
  maxFirstAuthors: 6,
  maxLastAuthors: 1,
  highlightAuthor: {
    firstName: "Nan",
    lastName: "Li",
  },
  equalSymbols: {
    first: "*",
    second: "†",
    third: "‡",
    last: "§",
  },
}

export const FOOTER: FooterConfig = {
  credits: false,
  // sourceCode: "https://github.com/mychiffonn/astro-scholar",
  // sourceContent:
  //   "https://github.com/mychiffonn/astro-scholar/tree/main/src/content",
  footerLinks: [],
}

if (import.meta.env.DEV && typeof window === "undefined") {
  const {
    FooterConfigSchema,
    ProfileConfigSchema,
    PublicationConfigSchema,
    SiteConfigSchema,
  } = await import("@/schemas")
  SiteConfigSchema.parse(SITE)
  ProfileConfigSchema.parse(PROFILE)
  FooterConfigSchema.parse(FOOTER)
  PublicationConfigSchema.parse(PUB_CONFIG)
}
