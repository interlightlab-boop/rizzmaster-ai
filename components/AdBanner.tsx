
import React, { useEffect, useRef } from 'react';
import { Gamepad2, Star, Download } from 'lucide-react';

interface AdBannerProps {
  slotId?: string; // You get this from AdSense dashboard
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  style?: React.CSSProperties;
}

export const AdBanner: React.FC<AdBannerProps> = ({ 
  slotId = "1234567890", // Replace with real Slot ID
  format = "auto",
  className = "",
  style = {}
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  useEffect(() => {
    if (!isDev && adRef.current) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, []);

  // Mock Ad Component for Dev/Testing (Looks like a real App Install Ad)
  if (isDev) {
    return (
      <div 
        className={`relative overflow-hidden bg-slate-900 flex flex-col items-center justify-between text-white p-4 border border-slate-700 shadow-inner ${className}`}
        style={{ ...style, minHeight: format === 'rectangle' ? '250px' : '60px' }}
      >
        {/* Ad Badge */}
        <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[9px] font-bold px-1.5 py-0.5 z-10">
          Ad
        </div>

        {/* Mock Content */}
        {format === 'rectangle' ? (
          // MREC (Rectangle) Mock Ad - High Revenue Format
          <div className="flex flex-col items-center justify-center w-full h-full gap-3">
             <div className="w-full h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <Gamepad2 className="w-12 h-12 text-white drop-shadow-lg" />
             </div>
             <div className="text-center">
                <h3 className="font-bold text-lg leading-tight">Galaxy Raiders</h3>
                <div className="flex items-center justify-center gap-1 text-yellow-400 my-1">
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs text-slate-400 ml-1">(4.9)</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 px-2">
                    Join 5 million players in the ultimate space battle!
                </p>
             </div>
             <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-full text-sm flex items-center justify-center gap-2 transition-colors">
                <Download className="w-4 h-4" /> Install Now
             </button>
          </div>
        ) : (
          // Banner Mock Ad
          <div className="flex items-center gap-3 w-full h-full">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center shrink-0">
               <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
               <h3 className="font-bold text-sm truncate">Super RPG</h3>
               <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-[10px] text-slate-400">FREE</span>
               </div>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shrink-0">
               Open
            </button>
          </div>
        )}
      </div>
    );
  }

  // Real AdSense Code
  return (
    <div className={`overflow-hidden flex justify-center bg-slate-900/50 ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your Publisher ID
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={format === 'auto' ? "true" : "false"}
      />
    </div>
  );
};
