// Fires GA4 events when an ID is configured (see BaseLayout); otherwise queues to dataLayer harmlessly.
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, params: Record<string, unknown> = {}) {
  // Tag every event with the detected device (set in BaseLayout's head script)
  const { device, input } = document.documentElement.dataset;
  params = { device_type: device, input_type: input, ...params };
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, params);
  } else {
    (window.dataLayer ||= []).push({ event, ...params });
  }
}
