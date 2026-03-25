export function getImageUri(source: any): string {
  if (typeof source === "string") return source;
  if (source?.uri) return source.uri;
  if (source?.default) return source.default;
  return source;
}
