import qrcode from 'qrcode-generator';
import { ErrorCorrectionLevel, QROptions } from '../types';

export const generateQRMatrix = (text: string, ecc: ErrorCorrectionLevel): boolean[][] => {
  try {
    const qr = qrcode(0, ecc);
    qr.addData(text);
    qr.make();
    
    const count = qr.getModuleCount();
    const matrix: boolean[][] = [];
    
    for (let r = 0; r < count; r++) {
      const row: boolean[] = [];
      for (let c = 0; c < count; c++) {
        row.push(qr.isDark(r, c));
      }
      matrix.push(row);
    }
    
    return matrix;
  } catch (e) {
    console.error("QR Generation failed", e);
    return [];
  }
};

export const renderMatrixToString = (
  matrix: boolean[][], 
  options: QROptions
): string => {
  if (!matrix || matrix.length === 0) return '';
  
  const { invert, variant } = options;
  const quietZone = 2;
  const size = matrix.length;
  const paddedSize = size + (quietZone * 2);
  
  const isDark = (r: number, c: number): boolean => {
    const originalR = r - quietZone;
    const originalC = c - quietZone;
    if (originalR < 0 || originalR >= size || originalC < 0 || originalC >= size) {
      return false;
    }
    return matrix[originalR][originalC];
  };

  let output = '';

  if (variant === 'compact') {
    for (let r = 0; r < paddedSize; r += 2) {
      for (let c = 0; c < paddedSize; c++) {
        const topDark = isDark(r, c);
        const bottomDark = r + 1 < paddedSize ? isDark(r + 1, c) : false;

        let char = '';
        
        if (!invert) {
            if (topDark && bottomDark) char = '█';
            else if (topDark && !bottomDark) char = '▀';
            else if (!topDark && bottomDark) char = '▄';
            else char = ' ';
        } else {
            if (topDark && bottomDark) char = ' ';
            else if (topDark && !bottomDark) char = '▄';
            else if (!topDark && bottomDark) char = '▀';
            else char = '█';
        }
        output += char;
      }
      output += '\n';
    }
  } else {
    const BLOCK = '██';
    const SPACE = '  ';

    for (let r = 0; r < paddedSize; r++) {
      for (let c = 0; c < paddedSize; c++) {
        const dark = isDark(r, c);

        if (!invert) {
          if (dark) output += BLOCK;
          else output += SPACE;
        } else {
          if (dark) output += SPACE;
          else output += BLOCK;
        }
      }
      output += '\n';
    }
  }

  return output;
};