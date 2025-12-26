import { ErrorCorrectionLevel } from './types';

export const DEFAULT_QR_TEXT = 'https://example.com/';

export const ECC_LABELS: Record<ErrorCorrectionLevel, string> = {
  [ErrorCorrectionLevel.L]: 'Very Low (7%)',
  [ErrorCorrectionLevel.M]: 'Low (15%)',
  [ErrorCorrectionLevel.Q]: 'Medium (25%)',
  [ErrorCorrectionLevel.H]: 'High (30%)',
};