/**
 * Script to add 'snow-' prefix to all Tailwind CSS class selectors.
 * This allows us to use normal class names in source code while having
 * prefixed classes in the generated CSS to avoid conflicts.
 */

const fs = require('fs');
const path = require('path');

const CSS_FILE = path.join(__dirname, '../dist/styles.css');
const PREFIX = 'snow-';

// Classes that should NOT be prefixed (already have snow- prefix)
const SKIP_PATTERN = /^snow-/;

function prefixCSS(css) {
  // Match class selectors - exclude comma to handle selector lists properly
  // This handles: .class, .\[...\], .class\:modifier, etc.
  return css.replace(
    /\.(-?[a-zA-Z_\\\[][\w\-\\\[\]():.\/!>*#@%&=+"'`~^$|]*)/g,
    (match, className) => {
      // Decode escaped characters for checking
      const decodedClass = className.replace(/\\/g, '');

      // Skip if already prefixed with snow-
      if (SKIP_PATTERN.test(decodedClass)) {
        return match;
      }

      return `.${PREFIX}${className}`;
    }
  );
}

// Read, transform, and write
try {
  const css = fs.readFileSync(CSS_FILE, 'utf8');
  const prefixedCSS = prefixCSS(css);
  fs.writeFileSync(CSS_FILE, prefixedCSS);
  console.log('✓ CSS prefixed successfully');
} catch (error) {
  console.error('Error prefixing CSS:', error.message);
  process.exit(1);
}
