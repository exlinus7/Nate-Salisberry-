export const topics = [
  { slug: 'is-it-time', label: 'Is it time?' },
  { slug: 'paying-for-care', label: 'Paying for care' },
  { slug: 'touring', label: 'Touring & choosing' },
  { slug: 'memory-care', label: 'Memory care' },
  { slug: 'moving-day', label: 'Moving day' },
] as const;

export type TopicSlug = (typeof topics)[number]['slug'];
export const topicLabel = (slug: string) => topics.find((t) => t.slug === slug)?.label ?? slug;
