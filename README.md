# WiseMove Senior Advisors: website

Marketing site built from the approved designs in `wisemove-handoff/`. Stack: **Astro** (static output) + **Tailwind CSS v4**, with small vanilla-JS islands. Deploys to Vercel on every push to `main`.

## Quick start

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # static site → dist/
npm run preview    # serve the build
npm run check      # type-check
npx playwright test   # a11y (axe), links, forms, quiz, filters (needs a build first; uses installed Chrome)
```

## Where things live

| What | File |
|---|---|
| Phone, email, address, form endpoint, booking link, GA4 ID | `src/data/site.ts` |
| Advisors / team | `src/data/advisors.json` |
| City pages (`/areas/[slug]`) | `src/data/cities.json` (one entry = one page) |
| Articles (`/resources/[slug]`) | `src/content/articles/*.md` |
| Colors, fonts, sizes | `src/styles/tokens.css` (copy of `wisemove-handoff/design-tokens.css`) |
| Shared UI (buttons, cards, forms) | `src/styles/global.css` |
| Header / top bar / footer / mobile bar | `src/components/` |
| Form validation + submission | `src/scripts/forms.ts` |

**Before launch, work through [`PLACEHOLDERS.md`](./PLACEHOLDERS.md).** Forms do not send anything until `formEndpoint` is set.

## Routes
`/`, `/how-it-works`, `/care-options`, `/areas`, `/areas/[city]`, `/resources`, `/resources/[article]`, `/resources/cost-calculator`, `/about`, `/contact`, `/care-match`, `/privacy`, `/accessibility`, `/404`, plus `sitemap-index.xml` and `robots.txt`.

## Accessibility
Built to WCAG 2.2 AA: text-size control (A/A+/A++, remembered), skip link, coral focus rings, 44px+ touch targets, consistent help in the top bar, sticky mobile help bar (<760px), labelled forms with inline errors, `aria-current` nav, semantic tables and `<details>` FAQs, reduced-motion support.
