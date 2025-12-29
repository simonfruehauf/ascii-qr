import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Copy, Check, Terminal, AlertCircle, Minus, Plus } from 'lucide-react';

interface DisplayProps {
  ascii: string;
}

export const Display: React.FC<DisplayProps> = ({ ascii }) => {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(11);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCopied(false);
  }, [ascii]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(ascii);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, [ascii]);

  // Keyboard shortcut: Ctrl+C when focused on container
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        const selection = window.getSelection();
        // Only intercept if no text is selected (let normal copy work if text selected)
        if (!selection || selection.toString().length === 0) {
          if (containerRef.current?.contains(document.activeElement) ||
            containerRef.current === document.activeElement) {
            e.preventDefault();
            handleCopy();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleCopy]);

  // Memoize the rendered grid to avoid re-rendering on each frame
  const renderedGrid = useMemo(() => {
    if (!ascii) return null;
    return ascii.split('\n').map((line, lineIndex) => (
      <div key={lineIndex} style={{ display: 'flex' }}>
        {[...line].map((char, charIndex) => (
          <span
            key={charIndex}
            style={{
              display: 'inline-block',
              width: '1ch',
              textAlign: 'center'
            }}
          >
            {char}
          </span>
        ))}
      </div>
    ));
  }, [ascii]);

  if (!ascii) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-900 rounded-xl border border-slate-700 text-slate-500 p-8 text-center transition-colors duration-300">
        <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
        <p>Unable to generate QR code with current settings.</p>
        <p className="text-sm mt-2">Try reducing text length or changing error correction level.</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="relative flex flex-col h-full min-h-[500px] bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-blue-500"
      title="Press Ctrl+C to copy"
    >

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 gap-3 sm:gap-0">
        <div className="flex items-center gap-2 text-slate-400">
          <Terminal size={16} />
          <span className="text-xs font-mono uppercase tracking-wider">Preview</span>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-slate-600 font-mono hidden md:inline">
            {ascii.length} chars
          </span>
          <div className="flex items-center gap-2 bg-slate-900 rounded-md p-1 border border-slate-800">
            <button
              onClick={() => setFontSize(Math.max(6, fontSize - 1))}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
              aria-label="Decrease font size"
            >
              <Minus size={14} />
            </button>
            <span className="text-xs w-8 text-center font-mono text-slate-400 select-none">
              {fontSize}px
            </span>
            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 1))}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
              aria-label="Increase font size"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 relative overflow-auto custom-scrollbar p-8 flex items-center justify-center bg-slate-900">
        <pre
          className="select-all text-white inline-block"
          style={{
            fontFamily: '"Roboto Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            lineHeight: '1',
            fontSize: `${fontSize}px`
          }}
        >
          {renderedGrid}
        </pre>
      </div>

      <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
        <button
          onClick={handleCopy}
          className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${copied
            ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(22,163,74,0.4)]'
            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]'
            }`}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
        </button>
      </div>

    </div>
  );
};