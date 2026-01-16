module.exports = {
  plugins: {
    'postcss-prefix-selector': {
      prefix: '.snow-table-container ',
      transform: (prefix, selector, prefixedSelector) => {
        // Ne pas préfixer :root (variables CSS globales)
        if (selector.startsWith(':root')) {
          return selector;
        }
        // Préfixer le sélecteur universel pour éviter conflits
        if (selector === '*' || selector.startsWith('*, ') || selector.startsWith('*,')) {
          return selector.replace(/\*/g, '.snow-table-container *');
        }
        return prefixedSelector;
      },
    },
    tailwindcss: {},
    autoprefixer: {},
    cssnano: {},
  },
};
