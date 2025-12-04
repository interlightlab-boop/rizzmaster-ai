
import React from 'react';
import { X, Zap, Check, Lock, Share2 } from 'lucide-react';
import { TRANSLATIONS } from '../constants/translations';
import { Language } from '../types';

interface PaywallProps {
  onClose: () => void;
  onShare: () => void;
  onSubscribe: () => void;
  language: Language;
}

const PAYMENT_LINK = "https://lemon.squeezy.com/checkout/buy/your-product-id";

export const Paywall: React.FC<PaywallProps> = ({ onClose, onShare, onSubscribe, language }) => {
  const t = TRANSLATIONS[language];

  // Smart Price Display Logic
  // Detects if user is in a specific region different from the language default
  const getSmartPrice = () => {
      const locale = (navigator.language || "").toUpperCase(); // e.g., "PT-BR", "PT-PT", "ES-MX"

      // 1. Portuguese: Default is Brazil (R$). Check for Portugal (Euro).
      if (language === 'pt') {
          if (locale.includes('-PT') || locale === 'PT') {
              return "€4.99/mês";
          }
          return "R$ 19,90/mês";
      }

      // 2. Spanish: Default is Spain (Euro). Check for Latin America (USD).
      if (language === 'es') {
          // If explicit Spain -> Euro. Else (Mexico, US, Argentina) -> USD
          if (locale.includes('-ES') || locale === 'ES') {
              return "4,99 €/mes";
          }
          return "$4.99/mes";
      }
      
      // 3. French: Default is France (Euro). Check for Canada (CAD).
      if (language === 'fr') {
          if (locale.includes('-CA')) {
              return "$6.99/mois"; // CAD approximation
          }
          return "4,99 €/mois";
      }

      return t.per_month;
  };

  const handleSubscribeClick = () => {
      // Append locale to URL to help payment provider pre-select language/currency
      const checkoutUrl = `${PAYMENT_LINK}?locale=${navigator.language}`;
      window.open(checkoutUrl, '_blank');
      
      // Simulation for prototype
      if(confirm("Did you complete the payment? (Simulation)")) {
          onSubscribe();
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-10 duration-500">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white z-10">
            <X className="w-4 h-4" />
        </button>

        <div className="p-6 text-center">
            
            <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Lock className="w-8 h-8 text-white fill-white" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">{t.locked_feature}</h2>
            <p className="text-slate-400 text-sm mb-6">
                {t.share_desc}
            </p>

            <div className="space-y-3">
                {/* Share Button (Primary Action) */}
                <button 
                    onClick={onShare}
                    className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white p-4 rounded-xl flex items-center justify-between transition-colors group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                            <Share2 className="w-5 h-5 fill-current" />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-blue-100">{t.share_to_unlock}</div>
                            <div className="text-xs text-slate-400">Unlock Secret Vibes (24h)</div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-bold bg-blue-500/20 text-blue-300 px-2 py-1 rounded mb-1">FREE</span>
                    </div>
                </button>

                {/* Subscription Button */}
                <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl opacity-75 blur opacity-20"></div>
                    <button 
                        onClick={handleSubscribeClick}
                        className="relative w-full bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-500 hover:to-purple-600 text-white p-4 rounded-xl flex items-center justify-between shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                                <Zap className="w-5 h-5 fill-current" />
                            </div>
                            <div className="text-left">
                                <div className="font-bold">{t.subscribe}</div>
                                <div className="text-xs text-white/80">{t.unlimited}</div>
                            </div>
                        </div>
                        <span className="text-sm font-bold">{getSmartPrice()}</span>
                    </button>
                </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> Secret Vibes</span>
                    <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> Dating Goals</span>
                    <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> No Ads</span>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};