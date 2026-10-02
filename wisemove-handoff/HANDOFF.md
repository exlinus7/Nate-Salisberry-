# WiseMove Senior Advisors: Website Build Handoff for Claude Code

> **How to use this:** put this folder in an empty project directory, open Claude Code there, and paste the **Kickoff prompt** below (also at the end of this file).

## Kickoff prompt (paste into Claude Code)

```
Read HANDOFF.md and everything in /design-reference first. Build the WiseMove Senior
Advisors marketing website exactly as specified: Astro + Tailwind, static output,
all 8 pages, shared layout, the interactive Care Match quiz and text-size control,
and the accessible forms. Use design-tokens.css as the single source of colors/fonts.
Keep every [BRACKETED] placeholder as-is and list them in PLACEHOLDERS.md.
Work page by page, run the dev server and fix any build errors as you go, then run
an accessibility check (axe or Lighthouse) and fix issues before finishing.
```

---

## 1. Project summary

| | |
|---|---|
| **Business** | WiseMove Senior Advisors (placeholder name): a local senior living placement firm |
| **Services** | Free, personalized placement help for Assisted Living, Memory Care and Long-Term Care |
| **Business model** | Free for families; partner communities pay a referral fee on move-in |
| **Primary audience** | Adult children (40–65) searching for a parent, often on phones, often stressed |
| **Secondary audience** | Seniors themselves (65+), hospital discharge planners, social workers |
| **Primary goal** | Generate calls and consultation requests (leads) |
| **Secondary goals** | Build trust; rank in local search for "assisted living in [City]" |
| **Inspiration site** | viavera.com (structure only; the design must not copy it) |

## 2. Recommended stack

- **Astro** (static, very fast, great SEO) + **Tailwind CSS** using the tokens in `design-tokens.css`
- Small interactive parts (quiz, text-size control, form states) as **vanilla JS or Preact islands**
- Forms: post to a form backend (Formspree / Netlify Forms / HubSpot) — **leave endpoints as `[FORM_ENDPOINT]`**
- Deploy target: Netlify or Vercel (static)
- No CMS needed for v1; keep content in `.md`/`.astro` files so it's easy to edit later

Alternatives if preferred: WordPress (theme from these designs) or Webflow. Ask the owner before switching.

## 3. Design system

All values are in `design-tokens.css`. Summary:

**Theme: "Warm Lavender & Coral"** — warm, caring, modern; not clinical.

| Token | Hex | Use |
|---|---|---|
| `--plum-900` (ink) | `#2A1E3B` | Body text, top bar, dark sections, footer |
| `--plum-950` | `#1E1530` | Deepest footer |
| `--violet-600` (primary) | `#5B3F8C` | Primary buttons, accents, eyebrows, icons |
| `--violet-700` | `#4A3275` | Links, text on tints |
| `--lavender-50` | `#F5F0FA` | Soft section backgrounds |
| `--lavender-100` | `#E3D6F0` | Image placeholders, tags |
| `--line` | `#E6DCF0` | Borders, dividers |
| `--muted` | `#5A4D6B` | Secondary text (passes 4.5:1 on white) |
| `--coral-400` (CTA) | `#FF9E7A` | Main call-to-action buttons (dark text on it), focus rings |
| `--peach-50` | `#FFF1EA` | Warm section backgrounds (cost, milestones, reviews) |
| `--rust-700` | `#9A3F1F` | Text/icons on peach backgrounds |
| `--card-dark` | `#3A2B52` | Cards on dark sections |
| `--input-border` | `#9C88B8` | Form field borders (≥3:1) |
| `--page` | `#FDFBFF` | Page background |

**Type**
- Display / headings: **Bricolage Grotesque** 500/600/700 (Google Fonts)
- Body: **Manrope** 400/500/600/700
- Base body size **18px**, line-height 1.55–1.6. Never below 15px for any visible text.
- H1 50–56px · H2 36–44px · H3 22–28px (scale down ~25% on mobile)

**Shape & spacing**
- Radii: buttons pill (999px); cards 20–24px; large images 24–28px; inputs 12px
- Section padding: 72–96px vertical desktop, ~56px mobile; content max-width 1200px; 24px side gutter
- Buttons: min-height 52–56px (CTAs), 44px (secondary)

**Icons:** simple inline stroke SVG (2px), as in the reference files. No emoji.

## 4. Global UX & accessibility requirements (must-have)

Based on research into older-adult usability (NN/g) and **WCAG 2.2 AA**:

1. **Text-size control** (A / A+ / A++) in the top utility bar on every page; persist choice in `localStorage` (wrapped in try/catch). Scale via root `font-size` (preferred) — use `rem` units throughout.
2. **Touch targets** ≥ 44×44px everywhere (WCAG minimum is 24px; we exceed it).
3. **Visible focus**: `outline: 3px solid var(--coral-400); outline-offset: 3px` on all interactive elements.
4. **Skip to main content** link as first focusable element.
5. **Consistent help** (WCAG 3.2.6): "Call [(555) 000-0000]" + "Text us" in the top bar on every page, same position.
6. **Sticky header** on desktop; **sticky bottom bar on mobile (<760px)** with Call / Text / Care Match.
7. **Forms**: real `<label>`s, `autocomplete` attributes, accept any phone format, helper text, clear inline error messages that say how to fix, success state with `role="status"`.
8. **Contrast**: text ≥ 4.5:1 (≥3:1 for 24px+). Already met by the palette; don't introduce lighter greys.
9. Semantic HTML: one `<h1>` per page, landmarks (`header`, `nav`, `main`, `footer`), `aria-current="page"` on active nav item, `<table>` with `scope` for comparison tables, `<details>/<summary>` for FAQs.
10. Respect `prefers-reduced-motion`. No auto-playing video or carousels.
11. Mobile-first responsive; test at 360px, 768px, 1280px, 1440px. No horizontal scroll.
12. Performance: Lighthouse ≥ 90 on all categories; images as AVIF/WebP with width/height set; fonts `display=swap`.

## 5. Site map & routes

| Route | Reference file | Notes |
|---|---|---|
| `/` | `design-reference/Main.dc.html` | Homepage |
| `/how-it-works` | `HowItWorks.dc.html` | |
| `/care-options` | `CareOptions.dc.html` | Anchors `#assisted`, `#memory`, `#ltc` |
| `/areas/[city]` | `AreaPage.dc.html` | **Template** — generate from a `cities` data file |
| `/areas` | — | Simple index listing all city pages (build from same data) |
| `/resources` | `Resources.dc.html` | Article index; make topic filters work |
| `/about` | `About.dc.html` | About Us |
| `/contact` | `Contact.dc.html` | |
| `/care-match` | `CareQuiz.dc.html` | Quiz; full page on desktop, phone layout as shown |
| `/privacy`, `/accessibility` | — | Simple text pages with placeholder copy |
| `/404` | — | Friendly page with Call + Home buttons |

### Shared layout (every page)
- **Top utility bar** (plum): "Our help is 100% free for families · Serving [YOUR REGION]" · text-size control · Call · Text us
- **Header** (white, sticky): logo mark (house + heart icon in violet rounded square) + "WiseMove Senior Advisors" · nav: How It Works, Care Options, Areas We Serve, Resources, About Us · "Get Free Guidance" button → `/contact`
- **Footer**: brand + one-line description; Care links; Company links (About, Resources, For Communities); Contact (phone, `hello@wisemoveadvisors.com`, address); © line with Privacy · Accessibility
- **Mobile sticky bar** (see §4)

## 6. Page specifications

The `.dc.html` files in `/design-reference` are the visual source of truth (open them in a browser — they're plain HTML with inline styles; ignore the `<x-dc>`, `<sc-if>`, `<sc-for>` and `DCLogic` wrappers, which are the design tool's runtime). Section order:

**Home `/`**
1. Hero (lavender bg): tag pill → H1 "Find the right senior living community, with a local expert by your side." → subcopy → CTAs [Start the 2-minute Care Match] (coral) [Call] (outline) → 3 trust ticks → photo/video block with "Meet us in 90 seconds" play button → floating "Why is it free?" card
2. "Where are you in your journey?" — 3 path cards: Just starting (→ /resources) · Need care in a few months (→ /care-match) · Urgent/hospital discharge (→ tel:, peach highlighted)
3. How it works — 4 numbered step cards
4. Care types (plum section) — 3 image cards + quiz link
5. Our promise — "Free for families. Honest about how we're paid." 3 reassurance rows
6. Cost snapshot (peach) — 3 price cards + dark "$0 our service" card + calculator CTA + source line
7. Areas we serve — map placeholder + 4 city links
8. Meet your advisors — 2 advisor cards
9. Testimonials (peach) — Google rating placeholder + 3 quote cards
10. Resources — 4 cards
11. Contact (violet) — copy + Call + book-a-call link | **short form**: first name*, phone*, best-time pills (Morning/Afternoon/Evening/Anytime), optional `<details>` (email, care type, notes) → success panel
12. Footer

**How It Works** — hero · 5 detailed steps · "Why is WiseMove free?" (plum) · FAQ (`<details>`) · CTA band
**Care Options** — hero + quiz card · 3 alternating image/text sections (who it's a fit for, typical cost) · side-by-side comparison table · CTA
**Area page template** — breadcrumb · H1 "Senior Living in [City], [State]" · 4 stat cards (costs, communities, families) · local insight + local resources · local advisor card · local reviews · CTA. Generate one page per entry in `src/data/cities.json` (`name, state, slug, neighborhoods, avgAssisted, avgMemory, communities, advisorId, resources[]`). Add `LocalBusiness`/`Service` schema.
**Resources** — hero + **working** topic filter pills · featured Tour Checklist download (email capture) · Cost Calculator card · article grid (6 placeholder articles as Markdown in `src/content/articles/`)
**About Us** — hero + photo collage · stats band · founder story letter · mission & promise (plum) · 4 values · WiseMove vs. national call center table · team grid (3) · milestones timeline · big testimonial · credentials logos · community partner band · CTA
**Contact** — 4 contact methods (call, text, book, email) | full consultation form · office + map + service area
**Care Match `/care-match`** — intro → 4 single-choice questions with progress bar and Back → result card + name/phone/ZIP form. Result logic:
  - memory answer is "Diagnosed dementia" or "Wandering/safety" → **Memory Care**
  - else help answer is "24-hour nursing" → **Long-Term Care**
  - else help "Little or none" and memory "No concerns" → **Independent or Assisted Living**
  - else → **Assisted Living**
  Pass the result + answers with the lead submission (hidden fields).

## 7. SEO & tracking

- Unique `<title>` and meta description per page; Open Graph image placeholder
- JSON-LD: `LocalBusiness` (site-wide), `FAQPage` (How It Works FAQ), `BreadcrumbList` (area pages)
- `sitemap.xml` and `robots.txt` (Astro sitemap integration)
- Click-to-call/text links use `tel:` / `sms:` with `[PHONE_E164]`
- Leave an analytics slot (`[GA4_ID]`) and fire events on: call click, text click, form submit, quiz complete

## 8. Content rules

- **Do not invent facts, stats, reviews, names or prices.** Keep every `[BRACKETED]` placeholder and collect them in `PLACEHOLDERS.md` with page + location.
- Plain, warm language; short paragraphs; no jargon without explanation.
- Photos: placeholders only; note recommended subject (real people, warm, not stock-looking).

## 9. Acceptance checklist

- [ ] All routes in §5 build and link correctly; no dead nav links
- [ ] Matches reference designs at 1440px and adapts cleanly at 360px
- [ ] Text-size control works and persists; site usable at A++
- [ ] Keyboard-only: every control reachable, visible focus, skip link works
- [ ] axe: 0 serious/critical issues; Lighthouse ≥ 90 (Perf, A11y, Best Practices, SEO)
- [ ] Forms validate kindly, show success state, post to `[FORM_ENDPOINT]`
- [ ] Care Match produces correct result for each branch
- [ ] Resources filters work
- [ ] City pages generated from data file (include 2 sample cities with placeholders)
- [ ] `PLACEHOLDERS.md` lists everything the owner must supply

## 10. Owner to supply later

Business name (final), logo, phone/SMS number, email, address, service cities, real prices + source, advisor names/bios/headshots, credentials, testimonials (with permission), founder story, intro video, booking link (Calendly/Cal.com), form backend, analytics ID, domain.

## 11. Files in this handoff

```
HANDOFF.md              ← this file
design-tokens.css       ← colors, fonts, radii, spacing as CSS variables
design-reference/       ← the 8 approved page designs (open in a browser)
  Main.dc.html  HowItWorks.dc.html  CareOptions.dc.html  AreaPage.dc.html
  Resources.dc.html  About.dc.html  Contact.dc.html  CareQuiz.dc.html
```
