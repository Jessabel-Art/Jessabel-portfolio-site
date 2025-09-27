// src/lib/icons.js
// Eagerly bundle every *-icon.svg/png and give back their final URLs
export const ICONS = import.meta.glob('@/assets/icons/*-icon.{svg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
});

// slug: "phone" -> "/assets/phone-icon.3df8a1.svg"
export function icon(slug) {
  return (
    ICONS[`/src/assets/icons/${slug}-icon.svg`] ||
    ICONS[`/src/assets/icons/${slug}-icon.png`] ||
    null
  );
}
