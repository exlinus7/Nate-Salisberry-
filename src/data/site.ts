// Every business detail the owner must supply lives here. Bracketed values are placeholders —
// see PLACEHOLDERS.md. Links stay usable while placeholders are in place.

export const site = {
  name: 'WiseMove Senior Advisors', // [Business name (final)]
  shortName: 'WiseMove',
  tagline: 'Free senior living placement for families in [Region].',
  region: '[YOUR REGION]',
  regionShort: '[Region]',

  phoneDisplay: '[(555) 000-0000]',
  phoneE164: '[PHONE_E164]', // e.g. +15550000000 — used in tel: and sms: links
  hours: '[Mon–Sat, 8am–7pm]',
  email: 'hello@wisemoveadvisors.com',
  address: { street: '[Street address]', cityStateZip: '[City, State ZIP]', short: '[Street, City, State]' },
  responseTime: '[one business day]',

  // [FORM_ENDPOINT] — Formspree / Netlify Forms / HubSpot URL. While it is a placeholder,
  // forms validate and show their success state but nothing is sent.
  formEndpoint: '[FORM_ENDPOINT]',
  // [BOOKING_URL] — Calendly / Cal.com link. Falls back to the contact form until supplied.
  bookingUrl: '[BOOKING_URL]',
  // [GA4_ID] — e.g. G-XXXXXXXXXX. Analytics loads only once this is a real ID.
  ga4Id: '[GA4_ID]',
  // [INTRO_VIDEO_URL] — embeddable video URL (e.g. YouTube embed link) for "Meet us in 90 seconds".
  introVideoUrl: '[INTRO_VIDEO_URL]',
  // [OG_IMAGE] — 1200×630 social sharing image placed in /public
  ogImage: '/og-image.png',
};

export const isPlaceholder = (value: string) => value.startsWith('[');

export const telHref = `tel:${site.phoneE164}`;
export const smsHref = `sms:${site.phoneE164}`;
export const bookingHref = isPlaceholder(site.bookingUrl) ? '/contact#consultation' : site.bookingUrl;

export const nav = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/care-options', label: 'Care Options' },
  { href: '/areas', label: 'Areas We Serve' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About Us' },
];
