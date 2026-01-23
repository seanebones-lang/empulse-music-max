/**
 * Color contrast checker utility
 * Helps verify WCAG AA/AAA compliance for text on backgrounds
 * 
 * Usage:
 * - Run this in browser console or Node.js
 * - Check contrast ratios for color combinations
 * - Ensure WCAG AA (4.5:1) or AAA (7:1) compliance
 */

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance
 * Based on WCAG 2.1 formula
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * @param color1 - First color (hex format: #RRGGBB)
 * @param color2 - Second color (hex format: #RRGGBB)
 * @returns Contrast ratio (1:1 to 21:1)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    throw new Error('Invalid hex color format');
  }

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG AA standard
 * @param ratio - Contrast ratio
 * @param isLargeText - Whether text is large (18pt+ or 14pt+ bold)
 * @returns true if meets AA standard
 */
export function meetsWCAGAA(ratio: number, isLargeText: boolean = false): boolean {
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Check if contrast meets WCAG AAA standard
 * @param ratio - Contrast ratio
 * @param isLargeText - Whether text is large (18pt+ or 14pt+ bold)
 * @returns true if meets AAA standard
 */
export function meetsWCAGAAA(ratio: number, isLargeText: boolean = false): boolean {
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}

/**
 * Check contrast for a color pair and return detailed results
 */
export function checkContrast(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): {
  ratio: number;
  meetsAA: boolean;
  meetsAAA: boolean;
  status: 'pass' | 'fail-aa' | 'fail-aaa';
  recommendation: string;
} {
  const ratio = getContrastRatio(foreground, background);
  const meetsAA = meetsWCAGAA(ratio, isLargeText);
  const meetsAAA = meetsWCAGAAA(ratio, isLargeText);

  let status: 'pass' | 'fail-aa' | 'fail-aaa';
  let recommendation: string;

  if (meetsAAA) {
    status = 'pass';
    recommendation = 'Excellent contrast! Meets WCAG AAA standards.';
  } else if (meetsAA) {
    status = 'fail-aaa';
    recommendation = 'Good contrast. Meets WCAG AA but not AAA. Consider improving for better accessibility.';
  } else {
    status = 'fail-aa';
    recommendation = 'Poor contrast. Does not meet WCAG AA standards. Please adjust colors.';
  }

  return {
    ratio,
    meetsAA,
    meetsAAA,
    status,
    recommendation,
  };
}

/**
 * Common color combinations to check in the app
 */
export const COLOR_COMBINATIONS = [
  { name: 'White text on purple-900', foreground: '#FFFFFF', background: '#581C87', isLargeText: false },
  { name: 'White text on black', foreground: '#FFFFFF', background: '#000000', isLargeText: false },
  { name: 'Gray-300 text on purple-950', foreground: '#D1D5DB', background: '#3B0764', isLargeText: false },
  { name: 'White text on purple-600', foreground: '#FFFFFF', background: '#9333EA', isLargeText: false },
  { name: 'Purple-400 text on black', foreground: '#A78BFA', background: '#000000', isLargeText: false },
];

/**
 * Run contrast checks for all common combinations
 */
export function runContrastChecks(): void {
  console.log('🔍 Running Color Contrast Checks...\n');
  console.log('WCAG Standards:');
  console.log('- AA: 4.5:1 (normal text), 3:1 (large text)');
  console.log('- AAA: 7:1 (normal text), 4.5:1 (large text)\n');

  COLOR_COMBINATIONS.forEach((combo) => {
    const result = checkContrast(combo.foreground, combo.background, combo.isLargeText);
    console.log(`${combo.name}:`);
    console.log(`  Ratio: ${result.ratio.toFixed(2)}:1`);
    console.log(`  WCAG AA: ${result.meetsAA ? '✅' : '❌'}`);
    console.log(`  WCAG AAA: ${result.meetsAAA ? '✅' : '❌'}`);
    console.log(`  Status: ${result.status}`);
    console.log(`  ${result.recommendation}\n`);
  });
}

// Export for use in browser console or Node.js
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).checkContrast = checkContrast;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).runContrastChecks = runContrastChecks;
}
