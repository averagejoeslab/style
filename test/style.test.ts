import { describe, it, expect } from 'vitest';
import { Style, style, Position } from '../src/style';
import { RoundedBorder } from '../src/border';

describe('Style', () => {
  describe('text styling', () => {
    it('should apply bold', () => {
      const s = style().bold();
      const result = s.render('hello');
      expect(result).toContain('\x1b[1m');
      expect(result).toContain('hello');
      expect(result).toContain('\x1b[m');
    });

    it('should apply italic', () => {
      const s = style().italic();
      const result = s.render('hello');
      expect(result).toContain('\x1b[3m');
    });

    it('should apply underline', () => {
      const s = style().underline();
      const result = s.render('hello');
      expect(result).toContain('\x1b[4m');
    });

    it('should combine multiple styles', () => {
      const s = style().bold().italic();
      const result = s.render('hello');
      expect(result).toContain('1');
      expect(result).toContain('3');
    });
  });

  describe('colors', () => {
    it('should apply foreground color from hex', () => {
      const s = style().foreground('#ff0000');
      const result = s.render('red');
      expect(result).toContain('\x1b[38;2;255;0;0m');
    });

    it('should apply background color from hex', () => {
      const s = style().background('#00ff00');
      const result = s.render('green');
      expect(result).toContain('\x1b[48;2;0;255;0m');
    });

    it('should apply ANSI color code', () => {
      const s = style().foreground(1); // red
      const result = s.render('red');
      expect(result).toContain('\x1b[31m');
    });

    it('should apply RGB color', () => {
      const s = style().foreground({ r: 0, g: 0, b: 255 });
      const result = s.render('blue');
      expect(result).toContain('\x1b[38;2;0;0;255m');
    });
  });

  describe('padding', () => {
    it('should apply uniform padding', () => {
      const s = style().padding(1);
      const result = s.render('x');
      const lines = result.split('\n');
      expect(lines.length).toBeGreaterThan(1);
    });

    it('should apply vertical/horizontal padding', () => {
      const s = style().padding(1, 2);
      const result = s.render('x');
      expect(result).toContain('  x  ');
    });

    it('should apply individual padding', () => {
      const s = style().paddingLeft(2).paddingRight(3);
      const result = s.render('x');
      expect(result).toContain('  x   ');
    });
  });

  describe('dimensions', () => {
    it('should set width', () => {
      const s = style().width(10);
      const result = s.render('hi');
      // Result should be padded to 10 characters
      expect(result.length).toBeGreaterThanOrEqual(10);
    });

    it('should set height', () => {
      const s = style().height(3);
      const result = s.render('hi');
      const lines = result.split('\n');
      expect(lines.length).toBe(3);
    });
  });

  describe('alignment', () => {
    it('should align left (default)', () => {
      const s = style().width(10).align(Position.Left);
      const result = s.render('hi');
      expect(result.startsWith('hi')).toBe(true);
    });

    it('should align right', () => {
      const s = style().width(10).align(Position.Right);
      const result = s.render('hi');
      expect(result.trimEnd().endsWith('hi')).toBe(true);
    });

    it('should align center', () => {
      const s = style().width(10).align(Position.Center);
      const result = s.render('hi');
      // Center should have spaces on both sides
      expect(result.startsWith('hi')).toBe(false);
      // The content should be in the middle
      expect(result.includes('hi')).toBe(true);
      expect(result.indexOf('hi')).toBeGreaterThan(0);
    });
  });

  describe('borders', () => {
    it('should apply border', () => {
      const s = style().border(RoundedBorder);
      const result = s.render('hi');
      expect(result).toContain('╭');
      expect(result).toContain('╮');
      expect(result).toContain('╰');
      expect(result).toContain('╯');
      expect(result).toContain('│');
    });

    it('should apply border color', () => {
      const s = style().border(RoundedBorder).borderForeground('#ff0000');
      const result = s.render('hi');
      expect(result).toContain('\x1b[38;2;255;0;0m');
    });
  });

  describe('margin', () => {
    it('should apply margin', () => {
      const s = style().margin(1);
      const result = s.render('x');
      const lines = result.split('\n');
      expect(lines.length).toBeGreaterThan(1);
    });

    it('should apply margin background', () => {
      const s = style().margin(1).marginBackground('#333333');
      const result = s.render('x');
      expect(result).toContain('\x1b[48;2;51;51;51m');
    });
  });

  describe('transform', () => {
    it('should apply transform function', () => {
      const s = style().transform(str => str.toUpperCase());
      const result = s.render('hello');
      expect(result).toContain('HELLO');
    });
  });

  describe('immutability', () => {
    it('should not modify original style', () => {
      const base = style().foreground('#ff0000');
      const derived = base.bold();

      const baseResult = base.render('test');
      const derivedResult = derived.render('test');

      expect(baseResult).not.toContain('\x1b[1m');
      expect(derivedResult).toContain('\x1b[1m');
    });
  });

  describe('multiple strings', () => {
    it('should join multiple strings with space', () => {
      const s = style();
      const result = s.render('hello', 'world');
      expect(result).toContain('hello world');
    });
  });
});
