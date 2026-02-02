/**
 * Border styles for terminal boxes
 */

/**
 * Border character set
 */
export interface BorderChars {
  top: string;
  bottom: string;
  left: string;
  right: string;
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
}

/**
 * No border
 */
export const NoBorder: BorderChars = {
  top: '',
  bottom: '',
  left: '',
  right: '',
  topLeft: '',
  topRight: '',
  bottomLeft: '',
  bottomRight: '',
};

/**
 * Single line border
 */
export const NormalBorder: BorderChars = {
  top: '─',
  bottom: '─',
  left: '│',
  right: '│',
  topLeft: '┌',
  topRight: '┐',
  bottomLeft: '└',
  bottomRight: '┘',
};

/**
 * Rounded corner border
 */
export const RoundedBorder: BorderChars = {
  top: '─',
  bottom: '─',
  left: '│',
  right: '│',
  topLeft: '╭',
  topRight: '╮',
  bottomLeft: '╰',
  bottomRight: '╯',
};

/**
 * Bold/thick border
 */
export const ThickBorder: BorderChars = {
  top: '━',
  bottom: '━',
  left: '┃',
  right: '┃',
  topLeft: '┏',
  topRight: '┓',
  bottomLeft: '┗',
  bottomRight: '┛',
};

/**
 * Double line border
 */
export const DoubleBorder: BorderChars = {
  top: '═',
  bottom: '═',
  left: '║',
  right: '║',
  topLeft: '╔',
  topRight: '╗',
  bottomLeft: '╚',
  bottomRight: '╝',
};

/**
 * Hidden border (takes up space but invisible)
 */
export const HiddenBorder: BorderChars = {
  top: ' ',
  bottom: ' ',
  left: ' ',
  right: ' ',
  topLeft: ' ',
  topRight: ' ',
  bottomLeft: ' ',
  bottomRight: ' ',
};

/**
 * ASCII border (fallback for limited terminals)
 */
export const AsciiBorder: BorderChars = {
  top: '-',
  bottom: '-',
  left: '|',
  right: '|',
  topLeft: '+',
  topRight: '+',
  bottomLeft: '+',
  bottomRight: '+',
};

/**
 * Star border
 */
export const StarBorder: BorderChars = {
  top: '*',
  bottom: '*',
  left: '*',
  right: '*',
  topLeft: '*',
  topRight: '*',
  bottomLeft: '*',
  bottomRight: '*',
};

/**
 * Create a custom border
 */
export function customBorder(chars: Partial<BorderChars>): BorderChars {
  return {
    ...NormalBorder,
    ...chars,
  };
}
