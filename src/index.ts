/**
 * @puppuccino/style
 *
 * Terminal styling library with padding, margins, borders, and alignment
 */

// Style builder
export { Style, style, Position } from './style';
export type { StyleColor } from './style';

// Borders
export {
  NoBorder,
  NormalBorder,
  RoundedBorder,
  ThickBorder,
  DoubleBorder,
  HiddenBorder,
  AsciiBorder,
  StarBorder,
  customBorder,
} from './border';
export type { BorderChars } from './border';

// Width utilities
export {
  stripAnsi,
  stringWidth,
  maxLineWidth,
  lineCount,
  truncate,
  padLeft,
  padRight,
  center,
} from './width';

// Layout utilities
export {
  joinHorizontal,
  joinVertical,
  place,
  getSize,
  getWidth,
  getHeight,
} from './layout';
