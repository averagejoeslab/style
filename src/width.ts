/**
 * String width utilities for terminal rendering
 */

const ESC = '\x1b';

// Parser states
const enum State {
  Ground = 0,
  Escape = 1,
  CsiEntry = 2,
  CsiParam = 3,
  CsiIntermediate = 4,
  OscString = 5,
}

function isCsiParam(b: number): boolean {
  return b >= 0x30 && b <= 0x3f;
}

function isCsiIntermediate(b: number): boolean {
  return b >= 0x20 && b <= 0x2f;
}

function isCsiFinal(b: number): boolean {
  return b >= 0x40 && b <= 0x7e;
}

/**
 * Get the display width of a Unicode code point
 */
function codePointWidth(cp: number): number {
  if (cp < 0x20 || (cp >= 0x7f && cp < 0xa0)) {
    return 0;
  }

  if (cp >= 0x20 && cp <= 0x7e) {
    return 1;
  }

  // Wide characters
  if (
    (cp >= 0x1100 && cp <= 0x115f) ||
    (cp >= 0x2e80 && cp <= 0x9fff) ||
    (cp >= 0xac00 && cp <= 0xd7a3) ||
    (cp >= 0xf900 && cp <= 0xfaff) ||
    (cp >= 0xfe10 && cp <= 0xfe1f) ||
    (cp >= 0xfe30 && cp <= 0xfe6f) ||
    (cp >= 0xff00 && cp <= 0xff60) ||
    (cp >= 0xffe0 && cp <= 0xffe6) ||
    (cp >= 0x20000 && cp <= 0x2fffd) ||
    (cp >= 0x30000 && cp <= 0x3fffd)
  ) {
    return 2;
  }

  // Zero-width
  if (
    cp === 0x200d ||
    (cp >= 0xfe00 && cp <= 0xfe0f) ||
    (cp >= 0x1f3fb && cp <= 0x1f3ff)
  ) {
    return 0;
  }

  // Emoji
  if (
    (cp >= 0x1f300 && cp <= 0x1f9ff) ||
    (cp >= 0x1fa00 && cp <= 0x1faff) ||
    (cp >= 0x2600 && cp <= 0x26ff) ||
    (cp >= 0x2700 && cp <= 0x27bf)
  ) {
    return 2;
  }

  return 1;
}

/**
 * Strip ANSI escape codes from a string
 */
export function stripAnsi(s: string): string {
  if (!s.includes(ESC) && !s.includes('\x9b')) {
    return s;
  }

  let result = '';
  let state = State.Ground;
  let i = 0;

  while (i < s.length) {
    const c = s.charCodeAt(i);

    switch (state) {
      case State.Ground:
        if (c === 0x1b) {
          state = State.Escape;
        } else if (c === 0x9b) {
          state = State.CsiEntry;
        } else if (c === 0x9d) {
          state = State.OscString;
        } else {
          result += s[i];
        }
        break;

      case State.Escape:
        if (c === 0x5b) {
          state = State.CsiEntry;
        } else if (c === 0x5d) {
          state = State.OscString;
        } else if (c >= 0x40 && c <= 0x5f) {
          state = State.Ground;
        } else if (c >= 0x60 && c <= 0x7e) {
          state = State.Ground;
        } else {
          result += ESC + s[i];
          state = State.Ground;
        }
        break;

      case State.CsiEntry:
        if (isCsiParam(c)) {
          state = State.CsiParam;
        } else if (isCsiIntermediate(c)) {
          state = State.CsiIntermediate;
        } else if (isCsiFinal(c)) {
          state = State.Ground;
        }
        break;

      case State.CsiParam:
        if (isCsiIntermediate(c)) {
          state = State.CsiIntermediate;
        } else if (isCsiFinal(c)) {
          state = State.Ground;
        }
        break;

      case State.CsiIntermediate:
        if (isCsiFinal(c)) {
          state = State.Ground;
        }
        break;

      case State.OscString:
        if (c === 0x07 || c === 0x9c) {
          state = State.Ground;
        } else if (c === 0x1b && i + 1 < s.length && s.charCodeAt(i + 1) === 0x5c) {
          i++;
          state = State.Ground;
        }
        break;
    }

    i++;
  }

  return result;
}

/**
 * Calculate the display width of a string, ignoring ANSI escape codes
 */
export function stringWidth(s: string): number {
  if (s === '') return 0;

  const stripped = stripAnsi(s);
  let width = 0;

  for (const char of stripped) {
    const cp = char.codePointAt(0);
    if (cp !== undefined) {
      width += codePointWidth(cp);
    }
  }

  return width;
}

/**
 * Get the maximum width of lines in a string
 */
export function maxLineWidth(s: string): number {
  const lines = s.split('\n');
  let max = 0;
  for (const line of lines) {
    const w = stringWidth(line);
    if (w > max) max = w;
  }
  return max;
}

/**
 * Get the height (number of lines) of a string
 */
export function lineCount(s: string): number {
  if (s === '') return 0;
  return s.split('\n').length;
}

/**
 * Truncate a string to a maximum display width
 */
export function truncate(s: string, maxWidth: number, tail = ''): string {
  if (maxWidth <= 0) return '';
  if (stringWidth(s) <= maxWidth) return s;

  const tailWidth = stringWidth(tail);
  const targetWidth = maxWidth - tailWidth;
  if (targetWidth <= 0) return tail.slice(0, maxWidth);

  let result = '';
  let currentWidth = 0;
  let state = State.Ground;
  let escapeBuffer = '';

  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);

    if (state !== State.Ground) {
      escapeBuffer += s[i];
      if (state === State.Escape) {
        if (c === 0x5b) state = State.CsiEntry;
        else if (c === 0x5d) state = State.OscString;
        else { result += escapeBuffer; escapeBuffer = ''; state = State.Ground; }
      } else if (state === State.CsiEntry || state === State.CsiParam) {
        if (isCsiFinal(c)) { result += escapeBuffer; escapeBuffer = ''; state = State.Ground; }
        else if (isCsiParam(c)) state = State.CsiParam;
        else if (isCsiIntermediate(c)) state = State.CsiIntermediate;
      } else if (state === State.CsiIntermediate) {
        if (isCsiFinal(c)) { result += escapeBuffer; escapeBuffer = ''; state = State.Ground; }
      } else if (state === State.OscString) {
        if (c === 0x07) { result += escapeBuffer; escapeBuffer = ''; state = State.Ground; }
        else if (c === 0x1b && i + 1 < s.length && s.charCodeAt(i + 1) === 0x5c) {
          escapeBuffer += s[++i];
          result += escapeBuffer;
          escapeBuffer = '';
          state = State.Ground;
        }
      }
      continue;
    }

    if (c === 0x1b) { escapeBuffer = s[i]; state = State.Escape; continue; }
    if (c === 0x9b) { escapeBuffer = s[i]; state = State.CsiEntry; continue; }

    const char = s[i];
    const cp = char.codePointAt(0);
    if (cp !== undefined) {
      const w = codePointWidth(cp);
      if (currentWidth + w > targetWidth) break;
      result += char;
      currentWidth += w;
    }
  }

  return result + tail;
}

/**
 * Pad a string on the left to a minimum width
 */
export function padLeft(s: string, width: number, char = ' '): string {
  const currentWidth = stringWidth(s);
  if (currentWidth >= width) return s;
  return char.repeat(width - currentWidth) + s;
}

/**
 * Pad a string on the right to a minimum width
 */
export function padRight(s: string, width: number, char = ' '): string {
  const currentWidth = stringWidth(s);
  if (currentWidth >= width) return s;
  return s + char.repeat(width - currentWidth);
}

/**
 * Center a string within a given width
 */
export function center(s: string, width: number, char = ' '): string {
  const currentWidth = stringWidth(s);
  if (currentWidth >= width) return s;
  const total = width - currentWidth;
  const left = Math.floor(total / 2);
  const right = total - left;
  return char.repeat(left) + s + char.repeat(right);
}
