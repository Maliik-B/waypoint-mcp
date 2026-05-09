/**
 * Input sanitization for IEP and lesson data.
 *
 * IEP data contains legally protected PII (student names, disability
 * categories, behavioral descriptions). When this data flows into
 * Markdown output -- especially table cells -- special characters
 * can break formatting or produce unintended rendering.
 *
 * These utilities ensure dynamic strings are safe for Markdown output
 * without altering the content's meaning.
 */

/**
 * Escapes characters that break Markdown table cells.
 * Pipe characters split cells, and unmatched formatting chars
 * can corrupt table rendering.
 */
export function escapeTableCell(value: string): string {
  return value
    .replace(/\|/g, "\\|")
    .replace(/\n/g, " ");
}

/**
 * Strips control characters that could appear in pasted or
 * OCR'd IEP data. Preserves printable ASCII and common Unicode.
 */
export function stripControlChars(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}

/**
 * Sanitizes a dynamic string for safe inclusion in Markdown output.
 * Applies control character stripping and table cell escaping.
 */
export function sanitize(value: string): string {
  return escapeTableCell(stripControlChars(value));
}
