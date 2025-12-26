export enum ErrorCorrectionLevel {
  L = 'L',
  M = 'M',
  Q = 'Q',
  H = 'H'
}

export type QRVariant = 'default' | 'compact';

export interface QROptions {
  text: string;
  ecc: ErrorCorrectionLevel;
  invert: boolean; // Invert colors (useful for dark terminals)
  variant: QRVariant;
}