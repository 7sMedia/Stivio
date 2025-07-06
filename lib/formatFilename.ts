// lib/formatFilename.ts
export function formatFilename(originalName: string): string {
  const timestamp = Date.now();
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
  const extension = originalName.split(".").pop();

  return `${nameWithoutExt}-${timestamp}.${extension}`;
}
