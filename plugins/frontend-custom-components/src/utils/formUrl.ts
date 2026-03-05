export function buildFormUrl(
  regelrettBaseUrl: string,
  contextId: string,
): string {
  return `${regelrettBaseUrl}/context/${contextId}?redirectBackUrl=${encodeURIComponent(window.location.href)}`;
}
