const PX = /\d+(\.\d+)?px/;
const LENGTH = /\d+(\.\d+)?(rem|em|px)\b/;
// Any number except 0 and 1 (also rejects 0.5, 01, 1.5, ...).
const OPACITY_LITERAL = /^(?!(0|1)$)[+-]?\d*\.?\d+%?$/;
const TRACKING_LITERAL = /^[+-]?\d*\.?\d+(em|rem|px)$/;

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
      'letter-spacing': [TRACKING_LITERAL],
      opacity: [OPACITY_LITERAL],
      'max-inline-size': [LENGTH],
      'max-width': [LENGTH],
    },
  },
  // Breakpoints: only 48em and 64em are allowed in @media.
  overrides: [{ files: ['src/styles/tokens.css'], rules: { 'color-no-hex': null, 'color-named': null, 'function-disallowed-list': null, 'declaration-property-value-disallowed-list': null } }],
};
