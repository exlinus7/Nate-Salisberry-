// Fires GA4 events when an ID is configured (see BaseLayout); otherwise queues to dataLayer harmlessly.
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, params);
  } else {
    (window.dataLayer ||= []).push({ event, ...params });
  }
}
