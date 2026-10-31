const PX = /\d+(\.\d+)?px/;

module.exports = {
  rules: {
    'color-no-hex': true,
    'color-named': 'never',
    'function-disallowed-list': ['rgb', 'rgba', 'hsl', 'hsla', 'hwb'],
    'declaration-no-important': true,
    'declaration-property-value-disallowed-list': {
      'font-size': [PX],
      '/^margin/': [PX],
      '/^padding/': [PX],
      gap: [PX],
      'row-gap': [PX],
      'column-gap': [PX],
      'border-radius': [PX],
    },
  },
  // Breakpoints: only 48em and 64em are allowed in @media.
  overrides: [{ files: ['src/styles/tokens.css'], rules: { 'color-no-hex': null, 'color-named': null, 'function-disallowed-list': null, 'declaration-property-value-disallowed-list': null } }],
};
