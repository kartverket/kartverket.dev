export const toLowerUnderscore = (role: string): string =>
  role.normalize('NFC').trim().toLowerCase().replace(/\s+/g, '_');
