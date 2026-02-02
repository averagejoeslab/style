/**
 * Terminal styling with fluent builder API
 */

import { BorderChars, NoBorder, NormalBorder } from './border';
import { stringWidth, maxLineWidth, padLeft, padRight, center as centerText } from './width';

const CSI = '\x1b[';
const RESET = '\x1b[m';

/**
 * Position for alignment
 */
export enum Position {
  Top = 0,
  Bottom = 1,
  Left = 0,
  Right = 1,
  Center = 0.5,
}

/**
 * Color type - hex string, ANSI code, or RGB
 */
export type StyleColor = string | number | { r: number; g: number; b: number };

/**
 * Style options
 */
interface StyleOptions {
  // Text styling
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  blink: boolean;
  faint: boolean;
  reverse: boolean;

  // Colors
  foreground: StyleColor | null;
  background: StyleColor | null;

  // Dimensions
  width: number;
  height: number;
  maxWidth: number;
  maxHeight: number;

  // Alignment
  alignHorizontal: Position;
  alignVertical: Position;

  // Padding
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;

  // Margin
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  marginBackground: StyleColor | null;

  // Border
  border: BorderChars;
  borderTop: boolean;
  borderRight: boolean;
  borderBottom: boolean;
  borderLeft: boolean;
  borderForeground: StyleColor | null;
  borderBackground: StyleColor | null;

  // Other
  inline: boolean;
  colorWhitespace: boolean;
  tabWidth: number;
  transform: ((s: string) => string) | null;
}

/**
 * Convert a color to an ANSI escape sequence
 */
function colorToSequence(color: StyleColor, isForeground: boolean): string {
  const base = isForeground ? 38 : 48;

  if (typeof color === 'number') {
    if (color < 16) {
      // Basic ANSI colors
      return `${CSI}${(isForeground ? 30 : 40) + (color % 8)}m`;
    }
    return `${CSI}${base};5;${color}m`;
  }

  if (typeof color === 'object') {
    const { r, g, b } = color;
    return `${CSI}${base};2;${r};${g};${b}m`;
  }

  // Hex string
  let hex = color.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const num = parseInt(hex, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return `${CSI}${base};2;${r};${g};${b}m`;
}

/**
 * Style class for building styled terminal output
 */
export class Style {
  private options: StyleOptions;

  constructor(options?: Partial<StyleOptions>) {
    this.options = {
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
      blink: false,
      faint: false,
      reverse: false,
      foreground: null,
      background: null,
      width: 0,
      height: 0,
      maxWidth: 0,
      maxHeight: 0,
      alignHorizontal: Position.Left,
      alignVertical: Position.Top,
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginBackground: null,
      border: NoBorder,
      borderTop: false,
      borderRight: false,
      borderBottom: false,
      borderLeft: false,
      borderForeground: null,
      borderBackground: null,
      inline: false,
      colorWhitespace: true,
      tabWidth: 4,
      transform: null,
      ...options,
    };
  }

  private clone(changes: Partial<StyleOptions>): Style {
    return new Style({ ...this.options, ...changes });
  }

  // Text styling methods

  bold(enable = true): Style {
    return this.clone({ bold: enable });
  }

  italic(enable = true): Style {
    return this.clone({ italic: enable });
  }

  underline(enable = true): Style {
    return this.clone({ underline: enable });
  }

  strikethrough(enable = true): Style {
    return this.clone({ strikethrough: enable });
  }

  blink(enable = true): Style {
    return this.clone({ blink: enable });
  }

  faint(enable = true): Style {
    return this.clone({ faint: enable });
  }

  reverse(enable = true): Style {
    return this.clone({ reverse: enable });
  }

  // Color methods

  foreground(color: StyleColor): Style {
    return this.clone({ foreground: color });
  }

  fg(color: StyleColor): Style {
    return this.foreground(color);
  }

  background(color: StyleColor): Style {
    return this.clone({ background: color });
  }

  bg(color: StyleColor): Style {
    return this.background(color);
  }

  // Dimension methods

  width(w: number): Style {
    return this.clone({ width: Math.max(0, w) });
  }

  height(h: number): Style {
    return this.clone({ height: Math.max(0, h) });
  }

  maxWidth(w: number): Style {
    return this.clone({ maxWidth: Math.max(0, w) });
  }

  maxHeight(h: number): Style {
    return this.clone({ maxHeight: Math.max(0, h) });
  }

  // Alignment methods

  align(horizontal: Position, vertical?: Position): Style {
    return this.clone({
      alignHorizontal: horizontal,
      alignVertical: vertical ?? this.options.alignVertical,
    });
  }

  alignHorizontal(pos: Position): Style {
    return this.clone({ alignHorizontal: pos });
  }

  alignVertical(pos: Position): Style {
    return this.clone({ alignVertical: pos });
  }

  // Padding methods

  padding(top: number, right?: number, bottom?: number, left?: number): Style {
    if (right === undefined) {
      // All sides
      return this.clone({
        paddingTop: top,
        paddingRight: top,
        paddingBottom: top,
        paddingLeft: top,
      });
    }
    if (bottom === undefined) {
      // Vertical / Horizontal
      return this.clone({
        paddingTop: top,
        paddingBottom: top,
        paddingRight: right,
        paddingLeft: right,
      });
    }
    return this.clone({
      paddingTop: top,
      paddingRight: right,
      paddingBottom: bottom ?? top,
      paddingLeft: left ?? right,
    });
  }

  paddingTop(n: number): Style {
    return this.clone({ paddingTop: n });
  }

  paddingRight(n: number): Style {
    return this.clone({ paddingRight: n });
  }

  paddingBottom(n: number): Style {
    return this.clone({ paddingBottom: n });
  }

  paddingLeft(n: number): Style {
    return this.clone({ paddingLeft: n });
  }

  // Margin methods

  margin(top: number, right?: number, bottom?: number, left?: number): Style {
    if (right === undefined) {
      return this.clone({
        marginTop: top,
        marginRight: top,
        marginBottom: top,
        marginLeft: top,
      });
    }
    if (bottom === undefined) {
      return this.clone({
        marginTop: top,
        marginBottom: top,
        marginRight: right,
        marginLeft: right,
      });
    }
    return this.clone({
      marginTop: top,
      marginRight: right,
      marginBottom: bottom ?? top,
      marginLeft: left ?? right,
    });
  }

  marginTop(n: number): Style {
    return this.clone({ marginTop: n });
  }

  marginRight(n: number): Style {
    return this.clone({ marginRight: n });
  }

  marginBottom(n: number): Style {
    return this.clone({ marginBottom: n });
  }

  marginLeft(n: number): Style {
    return this.clone({ marginLeft: n });
  }

  marginBackground(color: StyleColor): Style {
    return this.clone({ marginBackground: color });
  }

  // Border methods

  border(chars: BorderChars, all = true): Style {
    return this.clone({
      border: chars,
      borderTop: all,
      borderRight: all,
      borderBottom: all,
      borderLeft: all,
    });
  }

  borderStyle(chars: BorderChars): Style {
    return this.clone({ border: chars });
  }

  borderTop(enable = true): Style {
    return this.clone({ borderTop: enable });
  }

  borderRight(enable = true): Style {
    return this.clone({ borderRight: enable });
  }

  borderBottom(enable = true): Style {
    return this.clone({ borderBottom: enable });
  }

  borderLeft(enable = true): Style {
    return this.clone({ borderLeft: enable });
  }

  borderForeground(color: StyleColor): Style {
    return this.clone({ borderForeground: color });
  }

  borderBackground(color: StyleColor): Style {
    return this.clone({ borderBackground: color });
  }

  // Other methods

  inline(enable = true): Style {
    return this.clone({ inline: enable });
  }

  colorWhitespace(enable = true): Style {
    return this.clone({ colorWhitespace: enable });
  }

  tabWidth(n: number): Style {
    return this.clone({ tabWidth: n });
  }

  transform(fn: (s: string) => string): Style {
    return this.clone({ transform: fn });
  }

  // Render method

  render(...strs: string[]): string {
    let str = strs.join(' ');
    const opts = this.options;

    // Apply transform
    if (opts.transform) {
      str = opts.transform(str);
    }

    // Convert tabs
    if (opts.tabWidth >= 0) {
      str = str.replace(/\t/g, opts.tabWidth === 0 ? '' : ' '.repeat(opts.tabWidth));
    }

    // Remove carriage returns
    str = str.replace(/\r\n/g, '\n');

    // Strip newlines in inline mode
    if (opts.inline) {
      str = str.replace(/\n/g, '');
    }

    // Build style sequence
    const styleSeq = this.buildStyleSequence();
    const whitespaceSeq = opts.colorWhitespace ? this.buildWhitespaceSequence() : '';

    // Apply styling to text
    if (styleSeq) {
      const lines = str.split('\n');
      str = lines.map(line => `${styleSeq}${line}${RESET}`).join('\n');
    }

    // Apply padding
    if (!opts.inline) {
      if (opts.paddingLeft > 0) {
        const pad = whitespaceSeq
          ? `${whitespaceSeq}${' '.repeat(opts.paddingLeft)}${RESET}`
          : ' '.repeat(opts.paddingLeft);
        str = str.split('\n').map(line => pad + line).join('\n');
      }
      if (opts.paddingRight > 0) {
        const pad = whitespaceSeq
          ? `${whitespaceSeq}${' '.repeat(opts.paddingRight)}${RESET}`
          : ' '.repeat(opts.paddingRight);
        str = str.split('\n').map(line => line + pad).join('\n');
      }
      if (opts.paddingTop > 0) {
        str = '\n'.repeat(opts.paddingTop) + str;
      }
      if (opts.paddingBottom > 0) {
        str = str + '\n'.repeat(opts.paddingBottom);
      }
    }

    // Apply width alignment
    if (opts.width > 0) {
      str = this.applyWidth(str, opts.width, opts.alignHorizontal, whitespaceSeq);
    }

    // Apply height alignment
    if (opts.height > 0) {
      str = this.applyHeight(str, opts.height, opts.alignVertical, whitespaceSeq);
    }

    // Apply border
    if (!opts.inline && this.hasBorder()) {
      str = this.applyBorder(str);
    }

    // Apply margin
    if (!opts.inline) {
      str = this.applyMargin(str);
    }

    // Apply max constraints
    if (opts.maxWidth > 0) {
      const lines = str.split('\n');
      str = lines.map(line => {
        if (stringWidth(line) > opts.maxWidth) {
          // Simple truncation
          let result = '';
          let w = 0;
          for (const char of line) {
            const cw = stringWidth(char);
            if (w + cw > opts.maxWidth) break;
            result += char;
            w += cw;
          }
          return result;
        }
        return line;
      }).join('\n');
    }

    if (opts.maxHeight > 0) {
      const lines = str.split('\n');
      if (lines.length > opts.maxHeight) {
        str = lines.slice(0, opts.maxHeight).join('\n');
      }
    }

    return str;
  }

  private buildStyleSequence(): string {
    const parts: string[] = [];
    const opts = this.options;

    if (opts.bold) parts.push('1');
    if (opts.faint) parts.push('2');
    if (opts.italic) parts.push('3');
    if (opts.underline) parts.push('4');
    if (opts.blink) parts.push('5');
    if (opts.reverse) parts.push('7');
    if (opts.strikethrough) parts.push('9');

    let result = parts.length > 0 ? `${CSI}${parts.join(';')}m` : '';

    if (opts.foreground !== null) {
      result += colorToSequence(opts.foreground, true);
    }
    if (opts.background !== null) {
      result += colorToSequence(opts.background, false);
    }

    return result;
  }

  private buildWhitespaceSequence(): string {
    const opts = this.options;
    let result = '';

    if (opts.reverse) {
      result += `${CSI}7m`;
    }
    if (opts.background !== null && opts.colorWhitespace) {
      result += colorToSequence(opts.background, false);
    }

    return result;
  }

  private hasBorder(): boolean {
    const opts = this.options;
    return opts.borderTop || opts.borderRight || opts.borderBottom || opts.borderLeft;
  }

  private applyWidth(str: string, width: number, align: Position, whitespaceSeq: string): string {
    const lines = str.split('\n');
    const pad = whitespaceSeq ? (s: string) => `${whitespaceSeq}${s}${RESET}` : (s: string) => s;

    return lines.map(line => {
      const lineWidth = stringWidth(line);
      if (lineWidth >= width) return line;
      const diff = width - lineWidth;

      if (align === Position.Left) {
        return line + pad(' '.repeat(diff));
      } else if (align === Position.Right) {
        return pad(' '.repeat(diff)) + line;
      } else {
        const left = Math.floor(diff / 2);
        const right = diff - left;
        return pad(' '.repeat(left)) + line + pad(' '.repeat(right));
      }
    }).join('\n');
  }

  private applyHeight(str: string, height: number, align: Position, whitespaceSeq: string): string {
    const lines = str.split('\n');
    if (lines.length >= height) return str;

    const width = maxLineWidth(str);
    const emptyLine = whitespaceSeq
      ? `${whitespaceSeq}${' '.repeat(width)}${RESET}`
      : ' '.repeat(width);
    const diff = height - lines.length;

    if (align === Position.Top) {
      return str + '\n' + new Array(diff).fill(emptyLine).join('\n');
    } else if (align === Position.Bottom) {
      return new Array(diff).fill(emptyLine).join('\n') + '\n' + str;
    } else {
      const top = Math.floor(diff / 2);
      const bottom = diff - top;
      return new Array(top).fill(emptyLine).join('\n') +
        (top > 0 ? '\n' : '') + str + (bottom > 0 ? '\n' : '') +
        new Array(bottom).fill(emptyLine).join('\n');
    }
  }

  private applyBorder(str: string): string {
    const opts = this.options;
    const border = opts.border;
    const lines = str.split('\n');
    const width = maxLineWidth(str);

    const borderFg = opts.borderForeground !== null
      ? colorToSequence(opts.borderForeground, true)
      : '';
    const borderBg = opts.borderBackground !== null
      ? colorToSequence(opts.borderBackground, false)
      : '';
    const borderStyle = borderFg + borderBg;
    const borderReset = borderStyle ? RESET : '';

    const result: string[] = [];

    // Top border
    if (opts.borderTop) {
      let top = '';
      if (opts.borderLeft) top += border.topLeft;
      top += border.top.repeat(width);
      if (opts.borderRight) top += border.topRight;
      result.push(borderStyle + top + borderReset);
    }

    // Content with side borders
    for (const line of lines) {
      let row = '';
      if (opts.borderLeft) row += borderStyle + border.left + borderReset;
      row += padRight(line, width);
      if (opts.borderRight) row += borderStyle + border.right + borderReset;
      result.push(row);
    }

    // Bottom border
    if (opts.borderBottom) {
      let bottom = '';
      if (opts.borderLeft) bottom += border.bottomLeft;
      bottom += border.bottom.repeat(width);
      if (opts.borderRight) bottom += border.bottomRight;
      result.push(borderStyle + bottom + borderReset);
    }

    return result.join('\n');
  }

  private applyMargin(str: string): string {
    const opts = this.options;
    const lines = str.split('\n');
    const width = maxLineWidth(str);

    const marginBg = opts.marginBackground !== null
      ? colorToSequence(opts.marginBackground, false)
      : '';
    const marginReset = marginBg ? RESET : '';

    let result = lines;

    // Left/right margin
    if (opts.marginLeft > 0 || opts.marginRight > 0) {
      const left = marginBg + ' '.repeat(opts.marginLeft) + marginReset;
      const right = marginBg + ' '.repeat(opts.marginRight) + marginReset;
      result = result.map(line => left + line + right);
    }

    // Top margin
    if (opts.marginTop > 0) {
      const totalWidth = width + opts.marginLeft + opts.marginRight;
      const emptyLine = marginBg + ' '.repeat(totalWidth) + marginReset;
      result = [...new Array(opts.marginTop).fill(emptyLine), ...result];
    }

    // Bottom margin
    if (opts.marginBottom > 0) {
      const totalWidth = width + opts.marginLeft + opts.marginRight;
      const emptyLine = marginBg + ' '.repeat(totalWidth) + marginReset;
      result = [...result, ...new Array(opts.marginBottom).fill(emptyLine)];
    }

    return result.join('\n');
  }
}

/**
 * Create a new style
 */
export function style(): Style {
  return new Style();
}
