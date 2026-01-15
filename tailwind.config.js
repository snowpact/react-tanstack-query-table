/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--snow-background)',
        foreground: 'var(--snow-foreground)',
        muted: {
          DEFAULT: 'var(--snow-secondary)',
          foreground: 'var(--snow-secondary-foreground)',
        },
        border: 'var(--snow-border)',
        input: 'var(--snow-border)',
        ring: 'var(--snow-ring)',
        accent: {
          DEFAULT: 'var(--snow-secondary)',
          foreground: 'var(--snow-foreground)',
        },
        popover: {
          DEFAULT: 'var(--snow-background)',
          foreground: 'var(--snow-foreground)',
        },
      },
      borderRadius: {
        sm: 'calc(var(--snow-radius) * 0.75)',
        DEFAULT: 'var(--snow-radius)',
        md: 'var(--snow-radius)',
        lg: 'calc(var(--snow-radius) * 1.5)',
      },
    },
  },
  plugins: [],
};
