/**
 * Layout utilities for composing terminal elements
 */

import { stringWidth, maxLineWidth, padRight } from './width';

/**
 * Join multiple strings horizontally
 */
export function joinHorizontal(position: number, ...strs: string[]): string {
  if (strs.length === 0) return '';
  if (strs.length === 1) return strs[0];

  // Split each string into lines
  const allLines = strs.map(s => s.split('\n'));

  // Find the maximum height
  const maxHeight = Math.max(...allLines.map(lines => lines.length));

  // Find the width of each block
  const widths = allLines.map(lines => maxLineWidth(lines.join('\n')));

  // Align each block vertically based on position
  const alignedLines = allLines.map((lines, i) => {
    const height = lines.length;
    const width = widths[i];

    if (height === maxHeight) return lines;

    const diff = maxHeight - height;
    const emptyLine = ' '.repeat(width);

    if (position <= 0) {
      // Top aligned
      return [...lines, ...new Array(diff).fill(emptyLine)];
    } else if (position >= 1) {
      // Bottom aligned
      return [...new Array(diff).fill(emptyLine), ...lines];
    } else {
      // Center aligned
      const top = Math.floor(diff / 2);
      const bottom = diff - top;
      return [
        ...new Array(top).fill(emptyLine),
        ...lines,
        ...new Array(bottom).fill(emptyLine),
      ];
    }
  });

  // Pad each line to its block width
  const paddedLines = alignedLines.map((lines, i) => {
    return lines.map(line => padRight(line, widths[i]));
  });

  // Join horizontally
  const result: string[] = [];
  for (let row = 0; row < maxHeight; row++) {
    result.push(paddedLines.map(lines => lines[row]).join(''));
  }

  return result.join('\n');
}

/**
 * Join multiple strings vertically
 */
export function joinVertical(position: number, ...strs: string[]): string {
  if (strs.length === 0) return '';
  if (strs.length === 1) return strs[0];

  // Find the maximum width
  const maxWidth = Math.max(...strs.map(s => maxLineWidth(s)));

  // Align each string horizontally based on position
  const aligned = strs.map(s => {
    const lines = s.split('\n');
    return lines.map(line => {
      const width = stringWidth(line);
      if (width === maxWidth) return line;
      const diff = maxWidth - width;

      if (position <= 0) {
        // Left aligned
        return padRight(line, maxWidth);
      } else if (position >= 1) {
        // Right aligned
        return ' '.repeat(diff) + line;
      } else {
        // Center aligned
        const left = Math.floor(diff / 2);
        const right = diff - left;
        return ' '.repeat(left) + line + ' '.repeat(right);
      }
    }).join('\n');
  });

  return aligned.join('\n');
}

/**
 * Place one string on top of another at specified position
 */
export function place(
  width: number,
  height: number,
  hPos: number,
  vPos: number,
  content: string,
  background = ' '
): string {
  const contentLines = content.split('\n');
  const contentWidth = maxLineWidth(content);
  const contentHeight = contentLines.length;

  // Calculate starting position
  let startX = 0;
  if (hPos <= 0) startX = 0;
  else if (hPos >= 1) startX = width - contentWidth;
  else startX = Math.floor((width - contentWidth) * hPos);

  let startY = 0;
  if (vPos <= 0) startY = 0;
  else if (vPos >= 1) startY = height - contentHeight;
  else startY = Math.floor((height - contentHeight) * vPos);

  // Build result
  const result: string[] = [];
  for (let y = 0; y < height; y++) {
    if (y >= startY && y < startY + contentHeight) {
      const contentLine = contentLines[y - startY] || '';
      const padded = padRight(contentLine, contentWidth);
      const left = background.repeat(startX);
      const right = background.repeat(Math.max(0, width - startX - contentWidth));
      result.push(left + padded + right);
    } else {
      result.push(background.repeat(width));
    }
  }

  return result.join('\n');
}

/**
 * Get the width and height of a string
 */
export function getSize(s: string): { width: number; height: number } {
  const lines = s.split('\n');
  return {
    width: maxLineWidth(s),
    height: lines.length,
  };
}

/**
 * Get only the width of a string
 */
export function getWidth(s: string): number {
  return maxLineWidth(s);
}

/**
 * Get only the height of a string
 */
export function getHeight(s: string): number {
  return s.split('\n').length;
}
