import React, { useState } from 'react';
import { ErrorCorrectionLevel, QROptions } from '../types';
import { ECC_LABELS, QR_LIMITS } from '../constants';
import { Grid3X3, Contrast, Scissors, Type, Link as LinkIcon, Share2, AlertTriangle, Check } from 'lucide-react';

interface ControlsProps {
  options: QROptions;
  setOptions: React.Dispatch<React.SetStateAction<QROptions>>;
}

export const Controls: React.FC<ControlsProps> = ({ options, setOptions }) => {
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const handleChange = <K extends keyof QROptions>(key: K, value: QROptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const cleanUrl = () => {
    try {
      const url = new URL(options.text);

      const paramsToRemove = [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
        'fbclid', 'gclid', 'ref', 'source', 'si'
      ];

      let count = 0;
      paramsToRemove.forEach(param => {
        if (url.searchParams.has(param)) {
          url.searchParams.delete(param);
          count++;
        }
      });

      if (count > 0 || options.text !== url.toString()) {
        handleChange('text', url.toString());
      }
    } catch {
      // Not a valid URL - silently ignore
    }
  };

  const shareUrl = async () => {
    try {
      const url = new URL(window.location.origin + window.location.pathname);
      url.searchParams.set('text', options.text);
      if (options.ecc !== ErrorCorrectionLevel.L) url.searchParams.set('ecc', options.ecc);
      if (options.invert) url.searchParams.set('invert', '1');
      if (options.variant !== 'compact') url.searchParams.set('variant', options.variant);

      await navigator.clipboard.writeText(url.toString());
      setShareStatus('copied');
      setTimeout(() => setShareStatus('idle'), 2000);
    } catch {
      setShareStatus('error');
      setTimeout(() => setShareStatus('idle'), 2000);
    }
  };

  const getMaxLength = () => {
    switch (options.ecc) {
      case ErrorCorrectionLevel.L: return QR_LIMITS.LOW;
      case ErrorCorrectionLevel.M: return QR_LIMITS.MEDIUM;
      case ErrorCorrectionLevel.Q: return QR_LIMITS.QUARTILE;
      case ErrorCorrectionLevel.H: return QR_LIMITS.HIGH;
    }
  };

  const charCount = options.text.length;
  const maxLength = getMaxLength();
  const isWarning = charCount > QR_LIMITS.WARNING;
  const isError = charCount > maxLength;

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6 transition-colors duration-300">

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <LinkIcon size={16} className="text-slate-400" />
            Content
          </label>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono ${isError ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-slate-400'}`}>
              {charCount.toLocaleString()}{isWarning && ` / ${maxLength.toLocaleString()}`}
            </span>
            <button
              onClick={shareUrl}
              className={`text-[10px] sm:text-xs flex items-center gap-1 px-2 py-1 rounded-md border transition-all ${shareStatus === 'copied'
                  ? 'text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30'
                  : 'text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 border-transparent hover:border-slate-200 dark:hover:border-slate-700 bg-white/50 dark:bg-slate-800/50'
                }`}
              title="Copy shareable link"
            >
              {shareStatus === 'copied' ? <Check size={10} /> : <Share2 size={10} />}
              <span>{shareStatus === 'copied' ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
        <div className="relative">
          <textarea
            value={options.text}
            onChange={(e) => handleChange('text', e.target.value)}
            className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none text-slate-800 dark:text-slate-100 placeholder-slate-400 font-mono text-sm min-h-[100px] ${isError ? 'border-red-400 dark:border-red-600' : 'border-slate-200 dark:border-slate-700'
              }`}
            placeholder="Enter text or URL here..."
            aria-label="QR code content input"
          />
          {isWarning && (
            <div className={`absolute top-2 right-2 flex items-center gap-1 text-[10px] px-2 py-1 rounded ${isError ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400' : 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400'
              }`}>
              <AlertTriangle size={10} />
              <span>{isError ? 'Too long for QR' : 'Large QR code'}</span>
            </div>
          )}
          <div className="absolute bottom-2 right-2">
            <button
              onClick={cleanUrl}
              className="text-[10px] sm:text-xs flex items-center gap-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 bg-white/50 dark:bg-slate-800/50 backdrop-blur px-2 py-1 rounded-md border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
              title="Removes utm_, fbclid, etc."
            >
              <Scissors size={10} />
              <span>Clean URL</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <Type size={16} className="text-slate-400" />
            <span>Style</span>
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => handleChange('variant', 'default')}
              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${options.variant === 'default'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
            >
              Full (██)
            </button>
            <button
              onClick={() => handleChange('variant', 'compact')}
              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${options.variant === 'compact'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
            >
              Compact (▀▄)
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <Grid3X3 size={16} className="text-slate-400" />
            <span>Complexity</span>
          </div>
          <select
            value={options.ecc}
            onChange={(e) => handleChange('ecc', e.target.value as ErrorCorrectionLevel)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-800 dark:text-slate-100 transition-colors"
          >
            {(Object.keys(ECC_LABELS) as ErrorCorrectionLevel[]).map((key) => (
              <option key={key} value={key}>
                {ECC_LABELS[key]}
              </option>
            ))}
          </select>
        </div>

      </div>

      <div className="border-t border-slate-100 dark:border-slate-700 pt-5">
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              <Contrast size={16} />
              <span>Inverted Output</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-6">
              Use this if your background is dark.
            </p>
          </div>

          <div className="relative inline-flex items-center">
            <input
              type="checkbox"
              checked={options.invert}
              onChange={(e) => handleChange('invert', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </div>
        </label>
      </div>

    </div>
  );
};