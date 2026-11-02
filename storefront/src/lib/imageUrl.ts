
export function optimizeImage(
  url: string,
  width: number,
  quality = 75
) {
  if (!url) return "";

  // Use original Supabase Storage images.
  // Image transformations are currently returning 403.
  return url.split("?")[0];
}
