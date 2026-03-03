export function isValidImdbId(id: string | null | undefined): boolean {
  if (!id) return false;
  return /^tt\d{7,8}$/.test(id);
}
