
export function optimizeImage(
  url: string,
  _width?: number,
  _quality = 75
) {
  if (!url) return "";

  // Return original image URL without Supabase transformations.
  return url.split("?")[0];
}
