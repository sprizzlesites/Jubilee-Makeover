# Garfield Jubilee Association — website

The live site is a **static page** in [`docs/`](docs/). It has no build step, no
package manager, no server, and no CI workflow: the files in that folder are
exactly what the browser receives.

```
docs/
├── index.html            the whole page
├── 404.html              styled not-found page (inlined CSS, works at any depth)
├── favicon.svg  robots.txt  sitemap.xml  .nojekyll
└── assets/
    ├── css/site.css      hand-written CSS — design tokens from the original theme
    ├── css/fonts.css     @font-face declarations
    ├── js/site.js        ~600 lines of vanilla ES2020, no dependencies
    ├── fonts/            self-hosted woff2 (OFL 1.1, see assets/fonts/OFL.txt)
    └── img/              WebP with JPEG fallbacks
```

## Publishing to GitHub Pages

No Actions workflow is needed. In **Settings → Pages**:

- **Source:** Deploy from a branch
- **Branch:** `main` (or whichever branch holds this) and folder **`/docs`**

Save, and the site publishes at `https://<user>.github.io/<repo>/`.

`.nojekyll` is present so Pages serves the files verbatim instead of running
them through Jekyll.

### If you move the site or add a custom domain

Three places carry the absolute URL and should be updated together:

- `docs/index.html` — `<link rel="canonical">`, `og:url`, `og:image`, `twitter:image`
- `docs/robots.txt` — the `Sitemap:` line
- `docs/sitemap.xml` — the `<loc>` element

Everything else uses relative paths, so the site works from a repository
subpath or a domain root without changes. The 404 page figures out the site
root on its own.

## Working on it

Open `docs/index.html` in a browser, or serve the folder to test with realistic
paths:

```sh
cd docs && python3 -m http.server 8000
```

Edit, save, reload. There is nothing to compile.

## The contact form

GitHub Pages cannot run server code, so the form hands the message to the
visitor's email client. It works with JavaScript disabled too, via the form's
own `action="mailto:…"`.

To collect submissions properly instead, sign up for a form relay (Formspree,
Basin, Web3Forms — all have free tiers) and put the endpoint on the form in
`docs/index.html`:

```html
<form id="contactForm" ... data-endpoint="https://formspree.io/f/xxxxxxx">
```

The sending / success / error states are already wired for both paths. A
honeypot field filters out basic spam bots.

## What this replaced

The original was generated on Replit as a pnpm monorepo: a Vite + React + TypeScript
app, an Express API server, Drizzle/PostgreSQL, an OpenAPI spec with Orval codegen,
and ~60 Radix UI component files — for one landing page with no server-side data.

Every interaction was rebuilt against the platform instead of a library:

| Original | Now |
| --- | --- |
| framer-motion `whileInView` | one `IntersectionObserver` helper |
| framer-motion springs (cursor, magnetic buttons) | ~15-line spring integrator, same stiffness/damping values |
| framer-motion `useScroll` parallax | one rAF-throttled scroll handler |
| framer-motion `AnimatePresence` carousel | CSS transitions + class toggles |
| Tailwind + PostCSS build | plain CSS, same design tokens |
| `lucide-react` (9 icons used) | inline SVG `<symbol>` sprite |
| wouter + TanStack Query | not needed — one page, no data fetching |
| Google Fonts CDN | self-hosted woff2 |

The rebuild also fixes several defects in the original: the tilt cards' spotlight
was unreachable (`pointer-events: none` on a `:hover` target, so it never
appeared), the custom cursor hid the real cursor on tablet-width screens without
drawing a replacement, `prefers-reduced-motion` was ignored entirely, and the
impact stats wrapped out of alignment. Hero images were 1.9 MB PNGs; they are now
WebP, about 89% smaller.

First load is roughly 360 KB uncompressed including fonts and the hero image.

## The old Replit app

`artifacts/`, `lib/`, and the pnpm workspace files are the previous
implementation, kept for reference. Nothing in `docs/` depends on them, and they
can be deleted whenever you're satisfied with the static site.
