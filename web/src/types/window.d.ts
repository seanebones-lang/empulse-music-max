/**
 * Window type extensions for browser APIs
 */

interface Window {
  /**
   * Color contrast checker utility
   * Available in development mode for accessibility testing
   */
  checkContrast?: (color1: string, color2: string) => {
    ratio: number;
    passesAA: boolean;
    passesAAA: boolean;
    level: 'AA' | 'AAA' | 'FAIL';
  };

  /**
   * Run contrast checks on all elements
   */
  runContrastChecks?: () => void;
}
