
import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { AdBanner } from './AdBanner';
import { TRANSLATIONS } from '../constants/translations';
import { Language } from '../types';

interface InterstitialAdProps {
  onClose: () => void;
  language: Language;
  isResultReady: boolean; // Check if AI finished
}

export const InterstitialAd: React.FC<InterstitialAdProps> = ({ onClose, language, isResultReady }) => {
  const [countdown, setCountdown] = useState(5);
  const [canClose, setCanClose] = useState(false);
  const t = TRANSLATIONS[language];

  // Timer Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanClose(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Smart Auto-Pass Logic
  useEffect(() => {
    // If 5 seconds passed AND result is ready, close automatically (Seamless UX)
    if (canClose && isResultReady) {
      onClose();
    }
  }, [canClose, isResultReady, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Top Right Close Button - Force High Z-Index */}
      <div 
          onClick={canClose ? onClose : undefined}
          className={`
            absolute top-6 right-6 z-[999] p-3 rounded-full border transition-all duration-300
            ${canClose 
                ? 'opacity-100 cursor-pointer bg-white/20 text-white border-white/30 hover:bg-white/30 hover:scale-110' 
                : 'opacity-0 pointer-events-none scale-90'}
          `}
      >
          <X className="w-6 h-6 drop-shadow-md" />
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center gap-6 p-6 w-full max-w-sm relative z-[105]">
        
        {/* Status Text */}
        <div className="text-center space-y-4 animate-in slide-in-from-bottom-5 duration-700">
            <h2 className="text-2xl font-bold text-white flex flex-col items-center gap-3">
                 <div className="relative">
                    <div className="absolute inset-0 bg-purple-500 blur-xl opacity-40 animate-pulse"></div>
                    <div className="relative bg-slate-900 rounded-2xl p-3 border border-slate-700 shadow-xl">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                    </div>
                 </div>
                 <span className="bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent">
                    {t.analyzing_btn}
                 </span>
            </h2>
             {!canClose && (
                <div className="flex items-center gap-2 justify-center text-sm text-slate-400 font-medium bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
                    <span>Ad helps keep RizzMaster free</span>
                    <span className="text-purple-400 font-bold border-l border-slate-700 pl-2">{countdown}s</span>
                </div>
            )}
            {canClose && !isResultReady && (
                <p className="text-sm text-slate-400 animate-pulse">
                    Finalizing results...
                </p>
            )}
        </div>

        {/* Ad Card - The Money Maker */}
        <div className="relative bg-slate-800 p-1 rounded-3xl shadow-2xl border border-slate-700 w-full flex flex-col items-center overflow-hidden">
             
             {/* Timer Progress Bar (Top of card) */}
             {!canClose && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-slate-700 z-10">
                    <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-linear" 
                        style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                    />
                </div>
             )}

             {/* The Ad Container (Fixed MREC Size for High CPM) */}
             <div className="bg-black w-full h-[250px] rounded-[1.2rem] overflow-hidden flex items-center justify-center">
                <AdBanner 
                    format="rectangle" 
                    slotId="INTERSTITIAL_SLOT_ID"
                    style={{ width: '300px', height: '250px' }}
                />
             </div>
        </div>
        
        <div className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
            Sponsored Content
        </div>

      </div>
    </div>
  );
};