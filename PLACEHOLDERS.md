# Placeholders the owner must supply

Every `[BRACKETED]` value on the site is a placeholder. No facts, stats, reviews, names or prices have been invented.
Most business details live in **one file**, `src/data/site.ts`, so changing a value there updates every page.

Find any remaining placeholder with: `grep -rn "\[" src --include=*.astro --include=*.json --include=*.md --include=*.ts`

---

## 1. Business details: `src/data/site.ts` (site-wide)

| Placeholder | Where it appears | Notes |
|---|---|---|
| `[Business name (final)]` | `site.name`, used everywhere | Currently "WiseMove Senior Advisors" (placeholder name) |
| `[YOUR REGION]` / `[Region]` | Top bar, footer, homepage cost & area sections, care options, calculator, articles | `site.region` / `site.regionShort` |
| `[(555) 000-0000]` | Top bar, header CTAs, footer, contact page, success messages, 404 | `site.phoneDisplay` (how it's shown) |
| `[PHONE_E164]` | Every `tel:` and `sms:` link, LocalBusiness schema | `site.phoneE164`, e.g. `+15551234567` |
| `[Mon–Sat, 8am–7pm]` | Contact page → Call us | `site.hours` |
| `[Street address]`, `[City, State ZIP]`, `[Street, City, State]` | Contact page office block, footer, schema | `site.address` |
| `[one business day]` | Homepage contact section, contact page, form success messages | `site.responseTime` |
| `[FORM_ENDPOINT]` | All 4 forms (callback, consultation, Care Match, checklist) | Formspree / Netlify Forms / HubSpot URL. **Until set, forms validate and show success but send nothing.** |
| `[BOOKING_URL]` | "Book a call time" links (homepage, contact) | Calendly / Cal.com. Falls back to the contact form until set. |
| `[GA4_ID]` | Analytics | e.g. `G-XXXXXXXXXX`. GA loads only once set. Events already wired: `call_click`, `text_click`, `form_submit`, `quiz_complete`. |
| `[INTRO_VIDEO_URL]` | Homepage hero "Meet us in 90 seconds" | Embeddable URL (e.g. `https://www.youtube-nocookie.com/embed/…`). Shows "coming soon" until set. |
| `[OG_IMAGE]` | Social sharing image | Add a 1200×630 `public/og-image.png` |
| `[DOMAIN]` | `astro.config.mjs` → `site` | Currently `https://www.wisemoveadvisors.com`. Drives canonical URLs, sitemap and robots.txt. |
| `hello@wisemoveadvisors.com` | Footer, contact page | Confirm this is the real address |

## 2. People: `src/data/advisors.json`

| Placeholder | Where |
|---|---|
| `[Founder Name]`, `[Advisor Name]`, `[Team Member]`, `[First Name]` | Homepage "Meet your advisors", About team grid, area page advisor card |
| `[Title · credentials, e.g. CSA]`, `[Title · credentials]`, `[Area]`, `[Role]` | Same |
| `[Background, credentials…]`, `[Background and what they love…]`, `[Role and background.]` | About team bios |
| `[A short personal note from the advisor about helping families in City.]` | Area page advisor card |
| `[ADVISOR_VIDEO_URL]` | "Watch 60-sec intro" / "Watch intro video" buttons (leave `""` to hide the button) |
| `[HEADSHOT]` | Homepage, About, area pages: square headshots, real and warm |

## 3. Cities: `src/data/cities.json`

Two sample cities (`/areas/sample-city-1`, `/areas/sample-city-2`). **Add, rename or remove entries and the pages, the /areas index, the homepage and the contact "Serving" list all update automatically.** Change `slug` to the real city name (e.g. `springfield`).

Per city: `[City 1]`/`[City 2]`, `[State]`, `[Neighborhoods / Towns]`, `avgAssisted`/`avgMemory` `[$X,XXX]`, `communities` & `familiesHelped` `[XX]`, `[Credentials · years in City]`, the local insight paragraphs, four local resources (`[Area Agency on Aging]`, `[Local Alzheimer's support group]`, `[State licensing & inspection lookup]`, `[Elder law attorney / Medicaid planner]`) each with a `[URL]` (shown as plain text until a real URL is set), and two `[Real review from a City family.]` with `[Name · City]`.

Area pages also show `[MAP or recognizable local photo of City]` and `Source: [your data source and year]` (in `src/pages/areas/[city].astro`).

## 4. Page-by-page content

### Homepage: `src/pages/index.astro`
- **Photos (temporary):** the hero (`src/assets/photos/senior-couple.jpg`) and the advisor section (`consultation.jpg`) use photos from the Figma Make export. The spec asks for *real, warm, not stock* photos: **confirm you have the rights to these, or swap in your own** (same file names, any size; Astro generates the responsive versions). Then update the `alt` text in `index.astro`.
- Hero trust ticks: `[XX]+ years combined experience`, `[XXX]+ families helped`, `[X.X]★ on Google`
- Cost snapshot: three `[$X,XXX]` monthly prices, `Typical range: [$X,XXX–$X,XXX]` ×2, `Source: [your data source, year]`
- Advisor cards: small `[HEADSHOT]` circles (from `advisors.json`)
- Testimonial band: `[Google reviews widget: ★ rating + count]`, `[Paste a real family review here, with permission.]`, `[Init.]`, `[First name, relationship]`, `[City]`

### How It Works: `src/pages/how-it-works.astro`
- Step 2: `Within [2–3 days]`
- FAQ: Medicaid/VA answer ends with `[Confirm what you offer.]`

### Care Options: `src/pages/care-options.astro`
- Photos: `[PHOTO: residents in a bright dining room]`, `[PHOTO: enclosed garden walking path]`, `[PHOTO: nurse caring for a resident]`
- `Typical cost in [Region]: [$X,XXX–$X,XXX / month]` (assisted, memory)
- Comparison table: `[$X,XXX / mo]` ×3

### Resources: `src/pages/resources/index.astro`, `src/content/articles/*.md`
- Checklist: `[40+] questions`; the actual checklist PDF and how it's delivered (`[Confirm delivery method once the form backend is set up.]`)
- Six articles: each is an outline with `[Write this section.]` and `[IMAGE]`. Write and review before publishing. The "How much does assisted living cost in [Region]?" title includes `[Region]`.
- Topic "Touring & choosing" has no articles yet (the filter shows a friendly empty message).

### Cost calculator: `src/pages/resources/cost-calculator.astro`
- `Typical in [Region]: [$X,XXX–$X,XXX]` (assisted living fee), `[$XX/hour]` (in-home care rate). No values are pre-filled; families enter their own.

### About: `src/pages/about.astro`
- Photos: `[PHOTO: founder with a family on a community tour]`, `[PHOTO: team together]`, `[PHOTO: founder, warm portrait]`
- Stats band: `[XX]+` years, `[XXX]+` families, `[XX]` communities, `[X.X]★` rating
- Founder story: opening line + paragraphs 2–4, `[Founder Name]`, `[Year]` founded
- Milestones: `[Year]` ×3, `[City]`, `[First 100 families helped]`, `[Expanded to Region 2]`, `[A growing team serving Region]`
- Big testimonial: `[A real family testimonial…]`, `[First name, relationship · City]`
- Credentials: `[Certification logo]`, `[Industry association]`, `[Chamber of Commerce]`, `[Community partner]`

### Contact: `src/pages/contact.astro`
- `[MAP: office location / service area]`

### Care Match: `src/pages/care-match.astro`
- `[PHOTO: adult child and parent at a kitchen table]`

### Privacy & Accessibility: `src/pages/privacy.astro`, `src/pages/accessibility.astro`
- Privacy policy is an outline only: **have it written or reviewed by a qualified professional.**
- `Last updated: [Date]` (both), accessibility review date

### Footer: `src/components/Footer.astro`
- `© [Year]`

## 5. Assets checklist
Logo (currently an icon + text mark), favicon (`public/favicon.svg`), OG image, all photos above (AVIF/WebP with width/height), headshots, intro video, advisor videos, credential logos, the Tour Checklist PDF.
