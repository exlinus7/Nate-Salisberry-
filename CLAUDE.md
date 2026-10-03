# CLAUDE.md

Marketing site for **WiseMove Senior Advisors** (placeholder name), a local senior living placement firm. Free for families; audience is stressed adult children (40–65) on phones, plus seniors themselves. Primary goal: calls and consultation requests.

The spec and approved designs are in `wisemove-handoff/` (`HANDOFF.md` + `design-reference/*.dc.html`). Those `.dc.html` files are the visual source of truth; ignore their `<x-dc>`, `<sc-if>`, `<sc-for>` and `DCLogic` wrappers.

## Commands

Node 24 (`engines` in package.json; Astro 7 needs ≥22.12). On this Windows machine Node may not be on the bash PATH: prefix with `export PATH="/c/Program Files/nodejs:$PATH" &&`.

```sh
npm run dev        # localhost:4321
npm run build      # → dist/ (static)
npm run check      # astro check — must stay 0 errors / 0 warnings
npm run test       # Playwright + axe; run `npm run build` first; uses installed Chrome (channel: 'chrome')
```

If a test run fails to start with "Another astro preview server is already running", run `npx astro preview stop`.

## Deploy

GitHub `exlinus7/Nate-Salisberry-` → Vercel (Astro preset, static, no adapter). Every push to `main` deploys.

## Architecture

- **Astro 7 static + Tailwind v4** (`@tailwindcss/vite`). No UI framework; interactivity is small vanilla TS in `<script>` tags.
- `src/styles/tokens.css`: copy of `wisemove-handoff/design-tokens.css`, the **single source** of colors, fonts and sizes. `global.css` maps the tokens into Tailwind via `@theme inline` (`bg-plum-900`, `text-muted`, `font-heading`, …) and defines component classes (`.btn-*`, `.card`, `.field`, `.input`, `.pill`, `.media-ph`, `.eyebrow`, `.section`, `.container-site`). Use these before adding new one-off styles.
- **Page headers:** every inner page starts with `<section class="page-hero …">` (violet band, the homepage's Figma look). It recolors eyebrow, muted text, breadcrumb, `.btn-outline` and `.media-ph` inside it; white panels (`bg-white`) inside keep normal colors. Dark testimonial bands use `bg-plum-900` with a coral quote mark.
- Custom breakpoint `ph:` = 760px (below it the mobile help bar shows). The header switches to a menu button below `lg`.
- **Keep pages short on phones:** card rows use `.swipe-row` (horizontal scroll-snap below `ph:`, add `ph:grid ph:grid-cols-*` for the grid above). Put it on a `<ul>` only when the cards contain links; otherwise use a `<div role="region" aria-labelledby=… tabindex="0">` so keyboards can scroll it. Small stat/price cards go 2-up (`grid-cols-2`). Section spacing comes from `--section-y` (`.section` or `py-[var(--section-y)]`), not fixed padding. `--section-y` was deliberately tightened from the handoff value.
- **Device adaptation is capability-based, never user-agent sniffing.** An inline head script in BaseLayout sets `html[data-device=phone|tablet|desktop]`, `[data-input=touch|pointer]` and `[data-orientation]` before first paint (updated on resize). `track()` adds them to every GA event. CSS handles safe-area insets (notches, home bar), hover effects only on `(hover: hover)`, slim landscape-phone layout, `prefers-contrast: more` and print. Photos go in `src/assets/photos/` and render through `astro:assets` `<Image>` with `widths` + `sizes` (responsive WebP).
- `src/layouts/BaseLayout.astro`: head/SEO/JSON-LD (LocalBusiness site-wide; pages pass extra via `schema` prop), skip link, utility bar, header, footer, mobile bar, video dialog.
- **Data:** `src/data/site.ts` (phone, email, address, `formEndpoint`, `bookingUrl`, `ga4Id`, video URL, nav), `advisors.json`, `cities.json` (each entry generates `/areas/[slug]`), `topics.ts`. Articles: `src/content/articles/*.md` (collection in `src/content.config.ts`, routes at `/resources/[slug]`).
- **Forms:** any `<form data-lead-form="name" data-success="panel-id" action={site.formEndpoint} novalidate>` is handled by `src/scripts/forms.ts`: inline validation (`required`, `data-validate="phone|email|zip"`), errors in `#<field-id>-error`, pill groups via `data-pill-group` + hidden input, success panel with `[data-success-focus]` and `[data-form-reset]`. While `formEndpoint` is a placeholder, forms show success but send nothing.
- **Analytics:** `track()` in `src/scripts/analytics.ts`. Add `data-track="call_click"` / `"text_click"` to tel:/sms: links. GA loads only when `ga4Id` is real.
- **Care Match** (`src/pages/care-match.astro`): result logic must match HANDOFF §6. Results are passed to the lead form as hidden fields.

## Rules

- **Never invent facts, stats, reviews, names or prices.** Keep every `[BRACKETED]` placeholder and add any new one to `PLACEHOLDERS.md`.
- **Accessibility is a requirement (WCAG 2.2 AA):** touch targets ≥44px, coral focus ring, one `<h1>` per page, real `<label>`s with `autocomplete`, `aria-current` on the active nav item, `rem` units (the text-size control scales the root font size), no text below 15px, no lighter greys than `--muted`. Inline links stay underlined. Check new pages at A++ and 360px with no horizontal scroll.
- Links must never be `#` or dead. If a destination isn't ready, point at a real page (e.g. `/contact#consultation`). The link test enforces this.
- Plain, warm language; short paragraphs. Icons are inline 2px-stroke SVGs (`Icon.astro`), no emoji.
- New pages: add them to the `pages` list in `tests/site.spec.ts` so they get axe, overflow and link checks.
- Before committing: `npm run check`, `npm run build`, `npm run test` all green.
