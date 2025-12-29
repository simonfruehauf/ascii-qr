import { ErrorCorrectionLevel } from './types';

export const DEFAULT_QR_TEXT = 'https://example.com/';

// Max characters for QR codes varies by content type and ECC level
// These are conservative limits for binary/UTF-8 content
export const QR_LIMITS = {
  LOW: 2953,    // ECC L - can hold more but becomes hard to scan
  MEDIUM: 2331, // ECC M
  QUARTILE: 1663, // ECC Q
  HIGH: 1273,     // ECC H
  WARNING: 500,   // Show warning above this length
} as const;

export const ECC_LABELS: Record<ErrorCorrectionLevel, string> = {
  [ErrorCorrectionLevel.L]: 'Very Low (7%)',
  [ErrorCorrectionLevel.M]: 'Low (15%)',
  [ErrorCorrectionLevel.Q]: 'Medium (25%)',
  [ErrorCorrectionLevel.H]: 'High (30%)',
};