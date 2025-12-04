
import React, { useState, useRef } from 'react';
import { PartnerProfile, UserProfile, RizzResponse, Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';
import { generateRizzSuggestions } from '../services/geminiService';
import { Button } from './Button';
import { ArrowLeft, Upload, Image as ImageIcon, Copy, CheckCircle2, Loader2, Settings, Users, Camera, MessageSquare, Globe, Sparkles } from 'lucide-react';
import { InterstitialAd } from './InterstitialAd';

interface AnalyzerProps {
  user: UserProfile;
  partner: PartnerProfile;
  isPro: boolean;
  onBack: () => void;
  onShowPaywall: () => void;
  language: Language;
  onOpenSettings: () => void;
}

export const Analyzer: React.FC<AnalyzerProps> = ({ 
  user, partner, isPro, onBack, language, onOpenSettings
}) => {
  const t = TRANSLATIONS[language];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [results, setResults] = useState<RizzResponse[] | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 1024; 

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
             ctx.drawImage(img, 0, 0, width, height);
             const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
             const cleanBase64 = compressedDataUrl.split(',')[1];
             
             setSelectedImage(cleanBase64);
             setMimeType('image/jpeg');
             setResults(null);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    // Start background process
    setIsAnalyzing(true);
    setResults(null); 
    
    // Logic: If Pro -> No Ad. Else -> Show Ad.
    if (!isPro) {
        setShowInterstitial(true); 
    }

    try {
      const result = await generateRizzSuggestions(user, partner, selectedImage, mimeType, language);
      setResults(result.replies);
    } catch (error) {
      console.error(error);
      alert("Analysis failed (Network Error). Please try a smaller image.");
      setShowInterstitial(false); 
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-md mx-auto animate-in slide-in-from-right duration-500 relative">
      
      {showInterstitial && (
          <InterstitialAd 
            onClose={() => setShowInterstitial(false)} 
            language={language}
            isResultReady={results !== null} 
          />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white">
          <ArrowLeft />
        </button>
        
        <div className="flex items-center gap-2">
            {isPro && (
                 <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full text-xs font-bold text-white shadow-lg shadow-orange-500/20">
                    <Sparkles className="w-3 h-3 text-white" />
                    <span>PRO</span>
                 </div>
            )}
            <button 
                onClick={onOpenSettings}
                className="p-2 -mr-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            >
                <Settings className="w-5 h-5" />
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
         
         <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-xl mb-6 border border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-900/20">
                    {partner.name.charAt(0).toUpperCase()}
                 </div>
                 <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{t.talking_to}</div>
                    <div className="font-bold text-slate-100">{partner.name}</div>
                 </div>
            </div>
            <button 
                onClick={onBack}
                className="text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
            >
                <Users className="w-3 h-3" />
                {t.change_partner}
            </button>
         </div>

        {!results && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">{t.upload_title}</h2>
                <p className="text-slate-400 text-sm">{t.upload_desc}</p>
            </div>

            {!selectedImage && (
              <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/50">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">{t.how_to_use}</h3>
                  <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col items-center text-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                              <Camera className="w-5 h-5 text-pink-400" />
                          </div>
                          <span className="text-[10px] text-slate-300 font-medium">{t.step_1}</span>
                      </div>
                      <div className="flex flex-col items-center text-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                              <Upload className="w-5 h-5 text-purple-400" />
                          </div>
                          <span className="text-[10px] text-slate-300 font-medium">{t.step_2}</span>
                      </div>
                      <div className="flex flex-col items-center text-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                              <MessageSquare className="w-5 h-5 text-indigo-400" />
                          </div>
                          <span className="text-[10px] text-slate-300 font-medium">{t.step_3}</span>
                      </div>
                  </div>
              </div>
            )}

            <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group
                    ${selectedImage ? 'border-purple-500 bg-purple-500/10' : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'}
                `}
            >
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                />
                
                {selectedImage ? (
                    <>
                        <img 
                            src={`data:${mimeType};base64,${selectedImage}`} 
                            alt="Preview" 
                            className="max-h-64 rounded-lg shadow-lg object-contain" 
                        />
                        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded">
                            {t.change_img}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ImageIcon className="w-8 h-8 text-slate-400" />
                        </div>
                        <span className="text-slate-300 font-medium">{t.tap_upload}</span>
                    </>
                )}
            </div>

            <Button 
                onClick={handleAnalyze} 
                disabled={!selectedImage || isAnalyzing} 
                fullWidth
                variant="primary"
            >
                {isAnalyzing ? (
                    <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin w-5 h-5" /> {t.analyzing_btn}
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        <Upload className="w-5 h-5" /> {t.analyze_btn}
                    </span>
                )}
            </Button>
            
            {/* Status Text about Wait */}
            <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                {isPro ? (
                    <span className="text-green-400 flex items-center gap-1">
                         <Sparkles className="w-3 h-3" /> Pro Mode Active
                    </span>
                ) : (
                    <span>⏳ {t.no_ticket}</span>
                )}
            </p>
          </div>
        )}

        {/* Results Section */}
        {results && !showInterstitial && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-500">
                <div className="text-center">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                        {t.results_title}
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">{t.results_desc}</p>
                </div>

                <div className="space-y-4">
                    {results.map((res, idx) => (
                        <div 
                            key={idx}
                            onClick={() => handleCopy(res.text, idx)}
                            className="bg-slate-800/80 backdrop-blur border border-slate-700 p-5 rounded-2xl relative cursor-pointer hover:border-purple-500/50 hover:bg-slate-800 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold uppercase rounded tracking-wider">
                                    {res.tone}
                                </span>
                                {copiedIndex === idx ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                                ) : (
                                    <Copy className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                                )}
                            </div>
                            
                            <p className="text-lg font-medium text-white mb-2">"{res.text}"</p>
                            
                            {res.translation && (
                                <div className="mb-3 px-3 py-2 bg-slate-700/30 rounded-lg flex gap-2 items-start">
                                    <Globe className="w-3 h-3 text-slate-400 mt-1 shrink-0" />
                                    <p className="text-sm text-slate-300 italic">"{res.translation}"</p>
                                </div>
                            )}

                            <p className="text-xs text-slate-400 border-t border-slate-700/50 pt-2 flex gap-1">
                                💡 {res.explanation}
                            </p>
                        </div>
                    ))}
                </div>

                <Button variant="secondary" fullWidth onClick={() => setResults(null)}>
                    {t.try_another}
                </Button>
            </div>
        )}
      </div>

      {copiedIndex !== null && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-max max-w-[90%] bg-emerald-500 text-white px-4 py-3 rounded-full shadow-2xl shadow-emerald-500/30 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5 duration-300 z-50">
             <CheckCircle2 className="w-5 h-5" />
             <span className="text-sm font-bold">{t.copy_success}</span>
          </div>
      )}

    </div>
  );
};
