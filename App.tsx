import React, { useState, useMemo } from 'react';
import { Controls } from './components/Controls';
import { Display } from './components/Display';
import { QROptions, ErrorCorrectionLevel } from './types';
import { DEFAULT_QR_TEXT } from './constants';
import { generateQRMatrix, renderMatrixToString } from './utils/qrGenerator';
import { QrCode, Github } from 'lucide-react';

const App: React.FC = () => {
  const [options, setOptions] = useState<QROptions>({
    text: DEFAULT_QR_TEXT,
    ecc: ErrorCorrectionLevel.L,
    invert: false,
    variant: 'compact',
  });

  const asciiOutput = useMemo(() => {
    if (!options.text) return '';
    const matrix = generateQRMatrix(options.text, options.ecc);
    return renderMatrixToString(matrix, options);
  }, [options]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-600/20">
              <QrCode className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              ASCII QR
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
             <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
               <Github size={20} />
             </a>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start h-full">
          
          <div className="lg:col-span-5 space-y-6">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
                Generate text-based QR codes suitable for terminals, source code comments, or text files. 
              </p>
            </div>
            
            <Controls options={options} setOptions={setOptions} />
          </div>

          <div className="lg:col-span-7 h-full min-h-[500px] lg:sticky lg:top-24">
            <Display ascii={asciiOutput} />
          </div>

        </div>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 mt-auto py-8 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>Generated purely client-side. No data is sent to any server.</p>
        </div>
      </footer>

    </div>
  );
};

export default App;