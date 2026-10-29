const INTERNAL_ORIGIN = "https://cubix.local";

export function getSafeRedirect(value: string | null): string {
  if (!value) return "/";

  try {
    const target = new URL(value, INTERNAL_ORIGIN);
    if (target.origin !== INTERNAL_ORIGIN) return "/";
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return "/";
  }
}