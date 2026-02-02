# @puppuccino/style

CSS-like terminal styling with a fluent builder API.

## Installation

```bash
npm install @puppuccino/style
```

Or install from GitHub:

```bash
npm install github:averagejoeslab/style
```

## Features

- **Fluent Builder API** - Chain methods for readable style definitions
- **Box Model** - Padding, margin, and borders
- **Text Styling** - Colors, bold, italic, underline, and more
- **Layout** - Width, height, alignment, and text wrapping
- **Borders** - Multiple border styles with custom characters
- **Inheritance** - Copy and extend existing styles

## Usage

### Basic Styling

```typescript
import { style } from '@puppuccino/style';

// Create a styled string
const greeting = style()
  .bold()
  .foreground('#FF5500')
  .render('Hello, World!');

console.log(greeting);

// Chain multiple styles
const warning = style()
  .bold()
  .foreground('yellow')
  .background('red')
  .padding(1)
  .render('WARNING');

console.log(warning);
```

### Text Styles

```typescript
import { style } from '@puppuccino/style';

const s = style()
  .bold()              // Bold text
  .italic()            // Italic text
  .underline()         // Underlined text
  .strikethrough()     // Strikethrough text
  .dim()               // Dimmed text
  .blink()             // Blinking text
  .inverse()           // Inverted colors
  .render('Styled text');
```

### Colors

```typescript
import { style } from '@puppuccino/style';

// Named colors
const red = style().foreground('red').render('Red text');

// Hex colors
const orange = style().foreground('#FF5500').render('Orange text');

// RGB colors
const custom = style().foreground([100, 150, 200]).render('Custom color');

// 256-color palette
const palette = style().foreground(196).render('Color 196');

// Background colors
const highlight = style()
  .foreground('white')
  .background('blue')
  .render('Highlighted');
```

### Box Model

```typescript
import { style } from '@puppuccino/style';

// Padding (inside the box)
const padded = style()
  .padding(1)           // All sides
  .paddingLeft(2)       // Override left
  .render('Padded content');

// Margin (outside the box)
const spaced = style()
  .margin(1)            // All sides
  .marginTop(2)         // Override top
  .render('Spaced content');

// Fixed dimensions
const box = style()
  .width(20)
  .height(5)
  .render('Fixed size box');
```

### Borders

```typescript
import { style, BorderStyle } from '@puppuccino/style';

// Simple border
const bordered = style()
  .border(BorderStyle.Rounded)
  .render('Bordered content');

// Border with color
const colorBorder = style()
  .border(BorderStyle.Double)
  .borderForeground('cyan')
  .render('Cyan border');

// Individual border sides
const partial = style()
  .borderTop()
  .borderBottom()
  .render('Top and bottom only');

// Available border styles:
// - BorderStyle.Normal    ┌─┐
// - BorderStyle.Rounded   ╭─╮
// - BorderStyle.Double    ╔═╗
// - BorderStyle.Thick     ┏━┓
// - BorderStyle.Hidden    (no visible border)
```

### Alignment

```typescript
import { style, Position } from '@puppuccino/style';

// Horizontal alignment
const centered = style()
  .width(40)
  .align(Position.Center)
  .render('Centered text');

const right = style()
  .width(40)
  .align(Position.Right)
  .render('Right aligned');

// Vertical alignment (with fixed height)
const middle = style()
  .width(20)
  .height(5)
  .alignVertical(Position.Center)
  .render('Vertically centered');
```

### Text Wrapping

```typescript
import { style } from '@puppuccino/style';

const wrapped = style()
  .width(40)
  .render('This is a long text that will be wrapped to fit within 40 columns.');

// Word wrap (default)
const wordWrap = style()
  .width(30)
  .wordWrap()
  .render('Long text with word wrapping enabled');

// Character wrap (break anywhere)
const charWrap = style()
  .width(30)
  .charWrap()
  .render('Long text that breaks at character boundaries');
```

### Style Inheritance

```typescript
import { style } from '@puppuccino/style';

// Create a base style
const baseStyle = style()
  .foreground('white')
  .background('blue')
  .padding(1);

// Extend it
const headerStyle = baseStyle
  .copy()
  .bold()
  .align(Position.Center);

// Use both
console.log(baseStyle.render('Base'));
console.log(headerStyle.render('Header'));
```

### Inline Styling

```typescript
import { style } from '@puppuccino/style';

// Apply inline styles within text
const mixed = style()
  .render('Normal ' + style().bold().render('bold') + ' normal');

// Using template literals
const message = `
  ${style().bold().render('Title')}
  ${style().dim().render('Subtitle')}
`;
```

### Complete Example

```typescript
import { style, BorderStyle, Position } from '@puppuccino/style';

const card = style()
  .width(40)
  .padding(1)
  .border(BorderStyle.Rounded)
  .borderForeground('cyan')
  .render(`
${style().bold().foreground('white').render('Card Title')}
${style().dim().render('─'.repeat(36))}
This is the card content with some
descriptive text that explains things.
${style().foreground('cyan').render('Learn more →')}
`);

console.log(card);
```

## API Reference

### Style Builder Methods

#### Text Styles
- `bold()` / `unbold()`
- `italic()` / `unitalic()`
- `underline()` / `ununderline()`
- `strikethrough()`
- `dim()` / `undim()`
- `blink()` / `unblink()`
- `inverse()` / `uninverse()`

#### Colors
- `foreground(color)` - Text color
- `background(color)` - Background color

#### Box Model
- `padding(n)` / `paddingLeft(n)` / `paddingRight(n)` / `paddingTop(n)` / `paddingBottom(n)`
- `margin(n)` / `marginLeft(n)` / `marginRight(n)` / `marginTop(n)` / `marginBottom(n)`
- `width(n)` / `maxWidth(n)`
- `height(n)` / `maxHeight(n)`

#### Borders
- `border(style)` - Set border style
- `borderTop()` / `borderBottom()` / `borderLeft()` / `borderRight()`
- `borderForeground(color)` - Border color
- `borderBackground(color)` - Border background

#### Alignment
- `align(position)` - Horizontal alignment
- `alignVertical(position)` - Vertical alignment

#### Text
- `wordWrap()` - Enable word wrapping
- `charWrap()` - Enable character wrapping

#### Utilities
- `copy()` - Create a copy of the style
- `render(text)` - Apply style to text

### Constants

- `BorderStyle` - Border style presets
- `Position` - Alignment positions (Left, Center, Right, Top, Bottom)

## License

MIT
