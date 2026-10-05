export function optimizeImage(url: string, width: number, quality = 75) {
  if (!url) return "";

  // Only transform Supabase Storage public URLs
  if (!url.includes("/storage/v1/object/public/")) {
    return url;
  }

  const baseUrl = url.split("?")[0];

  const transformedUrl = baseUrl.replace(
    "/storage/v1/object/public/",
    "/storage/v1/render/image/public/"
  );

  return `${transformedUrl}?width=${width}&quality=${quality}`;
}