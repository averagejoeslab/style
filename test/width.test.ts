import { describe, it, expect } from 'vitest';
import {
  stripAnsi,
  stringWidth,
  maxLineWidth,
  lineCount,
  truncate,
  padLeft,
  padRight,
  center,
} from '../src/width';

describe('Width utilities', () => {
  describe('stripAnsi', () => {
    it('should return plain text unchanged', () => {
      expect(stripAnsi('hello')).toBe('hello');
    });

    it('should strip SGR sequences', () => {
      expect(stripAnsi('\x1b[1mhello\x1b[m')).toBe('hello');
      expect(stripAnsi('\x1b[31mred\x1b[0m')).toBe('red');
    });

    it('should strip complex sequences', () => {
      expect(stripAnsi('\x1b[38;2;255;0;0mhello\x1b[m')).toBe('hello');
    });

    it('should handle multiple sequences', () => {
      expect(stripAnsi('\x1b[1m\x1b[31mhello\x1b[0m')).toBe('hello');
    });
  });

  describe('stringWidth', () => {
    it('should count ASCII characters', () => {
      expect(stringWidth('hello')).toBe(5);
    });

    it('should ignore ANSI codes', () => {
      expect(stringWidth('\x1b[31mhello\x1b[m')).toBe(5);
    });

    it('should count wide characters as 2', () => {
      expect(stringWidth('你好')).toBe(4);
    });

    it('should return 0 for empty string', () => {
      expect(stringWidth('')).toBe(0);
    });
  });

  describe('maxLineWidth', () => {
    it('should return width of single line', () => {
      expect(maxLineWidth('hello')).toBe(5);
    });

    it('should return max width of multiple lines', () => {
      expect(maxLineWidth('hi\nhello\nbye')).toBe(5);
    });
  });

  describe('lineCount', () => {
    it('should count single line', () => {
      expect(lineCount('hello')).toBe(1);
    });

    it('should count multiple lines', () => {
      expect(lineCount('a\nb\nc')).toBe(3);
    });

    it('should return 0 for empty string', () => {
      expect(lineCount('')).toBe(0);
    });
  });

  describe('truncate', () => {
    it('should return unchanged if under limit', () => {
      expect(truncate('hello', 10)).toBe('hello');
    });

    it('should truncate to limit', () => {
      expect(truncate('hello world', 5)).toBe('hello');
    });

    it('should add tail', () => {
      expect(truncate('hello world', 8, '...')).toBe('hello...');
    });

    it('should return empty for zero width', () => {
      expect(truncate('hello', 0)).toBe('');
    });
  });

  describe('padLeft', () => {
    it('should pad on the left', () => {
      expect(padLeft('hi', 5)).toBe('   hi');
    });

    it('should not pad if already at width', () => {
      expect(padLeft('hello', 5)).toBe('hello');
    });

    it('should use custom padding character', () => {
      expect(padLeft('hi', 5, '-')).toBe('---hi');
    });
  });

  describe('padRight', () => {
    it('should pad on the right', () => {
      expect(padRight('hi', 5)).toBe('hi   ');
    });

    it('should not pad if already at width', () => {
      expect(padRight('hello', 5)).toBe('hello');
    });
  });

  describe('center', () => {
    it('should center string', () => {
      expect(center('hi', 6)).toBe('  hi  ');
    });

    it('should handle odd padding', () => {
      expect(center('hi', 7)).toBe('  hi   ');
    });
  });
});
