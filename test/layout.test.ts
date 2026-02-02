import { describe, it, expect } from 'vitest';
import {
  joinHorizontal,
  joinVertical,
  place,
  getSize,
  getWidth,
  getHeight,
} from '../src/layout';

describe('Layout utilities', () => {
  describe('joinHorizontal', () => {
    it('should return empty for no input', () => {
      expect(joinHorizontal(0)).toBe('');
    });

    it('should return input for single string', () => {
      expect(joinHorizontal(0, 'hello')).toBe('hello');
    });

    it('should join two strings horizontally', () => {
      const result = joinHorizontal(0, 'A', 'B');
      expect(result).toBe('AB');
    });

    it('should handle multi-line strings', () => {
      const a = 'A1\nA2';
      const b = 'B1\nB2';
      const result = joinHorizontal(0, a, b);
      expect(result).toBe('A1B1\nA2B2');
    });

    it('should align vertically at top', () => {
      const a = 'A';
      const b = 'B1\nB2';
      const result = joinHorizontal(0, a, b);
      const lines = result.split('\n');
      expect(lines[0]).toBe('AB1');
      expect(lines[1]).toContain('B2');
    });

    it('should align vertically at bottom', () => {
      const a = 'A';
      const b = 'B1\nB2';
      const result = joinHorizontal(1, a, b);
      const lines = result.split('\n');
      expect(lines[1]).toBe('AB2');
    });

    it('should align vertically at center', () => {
      const a = 'A';
      const b = 'B1\nB2\nB3';
      const result = joinHorizontal(0.5, a, b);
      const lines = result.split('\n');
      expect(lines[1]).toBe('AB2');
    });
  });

  describe('joinVertical', () => {
    it('should return empty for no input', () => {
      expect(joinVertical(0)).toBe('');
    });

    it('should return input for single string', () => {
      expect(joinVertical(0, 'hello')).toBe('hello');
    });

    it('should join two strings vertically', () => {
      const result = joinVertical(0, 'A', 'B');
      expect(result).toBe('A\nB');
    });

    it('should align horizontally at left', () => {
      const result = joinVertical(0, 'hi', 'hello');
      const lines = result.split('\n');
      expect(lines[0]).toBe('hi   ');
      expect(lines[1]).toBe('hello');
    });

    it('should align horizontally at right', () => {
      const result = joinVertical(1, 'hi', 'hello');
      const lines = result.split('\n');
      expect(lines[0]).toBe('   hi');
      expect(lines[1]).toBe('hello');
    });

    it('should align horizontally at center', () => {
      const result = joinVertical(0.5, 'hi', 'hello');
      const lines = result.split('\n');
      expect(lines[0].trim()).toBe('hi');
      expect(lines[1]).toBe('hello');
    });
  });

  describe('place', () => {
    it('should place content at top-left', () => {
      const result = place(5, 3, 0, 0, 'X');
      const lines = result.split('\n');
      expect(lines[0]).toBe('X    ');
      expect(lines.length).toBe(3);
    });

    it('should place content at bottom-right', () => {
      const result = place(5, 3, 1, 1, 'X');
      const lines = result.split('\n');
      expect(lines[2]).toBe('    X');
    });

    it('should place content at center', () => {
      const result = place(5, 3, 0.5, 0.5, 'X');
      const lines = result.split('\n');
      expect(lines[1][2]).toBe('X');
    });

    it('should handle multi-line content', () => {
      const result = place(5, 5, 0, 0, 'AB\nCD');
      const lines = result.split('\n');
      expect(lines[0]).toBe('AB   ');
      expect(lines[1]).toBe('CD   ');
    });
  });

  describe('getSize', () => {
    it('should return width and height', () => {
      const size = getSize('hello\nworld');
      expect(size.width).toBe(5);
      expect(size.height).toBe(2);
    });

    it('should handle single line', () => {
      const size = getSize('hello');
      expect(size.width).toBe(5);
      expect(size.height).toBe(1);
    });
  });

  describe('getWidth', () => {
    it('should return max line width', () => {
      expect(getWidth('hi\nhello')).toBe(5);
    });
  });

  describe('getHeight', () => {
    it('should return line count', () => {
      expect(getHeight('a\nb\nc')).toBe(3);
    });
  });
});
