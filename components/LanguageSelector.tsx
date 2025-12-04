import React from 'react';
import { Language } from '../types';
import { Globe, Zap, BrainCircuit, MessageCircle, Sparkles } from 'lucide-react';

interface LanguageSelectorProps {
  onSelect: (lang: Language) => void;
}

// Order based on Ad Revenue (CPM) & User Base Size
const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-slate-900 relative overflow-hidden">
        
        {/* Background Effects (Tech/Science Vibe) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        <div className="w-full max-w-md flex flex-col items-center z-10 space-y-8 pt-12">
            
            {/* Logo & Hero */}
            <div className="flex flex-col items-center text-center space-y-6 animate-in fade-in slide-in-from-top-10 duration-700">
                <div className="relative group cursor-pointer hover:scale-105 transition-transform duration-500">
                    
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-cyan-400 blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                    
                    {/* Main Logo Container */}
                    <div className="relative w-32 h-32 bg-slate-900 rounded-[2rem] border border-slate-700 shadow-2xl flex items-center justify-center overflow-hidden">
                        
                        {/* MBTI 4-Color Background Hints */}
                        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-purple-500/10"></div> {/* Analysts */}
                        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-green-500/10"></div> {/* Diplomats */}
                        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-500/10"></div>  {/* Sentinels */}
                        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-yellow-500/10"></div> {/* Explorers */}

                        {/* Icon Composition */}
                        <div className="relative z-10">
                             {/* Chat Bubble Base */}
                             <MessageCircle className="w-20 h-20 text-slate-800 fill-slate-800 stroke-slate-600" strokeWidth={1.5} />
                             
                             {/* MBTI Text Overlay */}
                             <div className="absolute inset-0 flex items-center justify-center -mt-2 -ml-0.5">
                                <span className="font-black text-xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-cyan-400 drop-shadow-sm">
                                    MBTI
                                </span>
                             </div>

                             {/* Magic Sparkle Accent */}
                             <div className="absolute -top-1 -right-1 bg-slate-900 rounded-full p-1 border border-slate-700 shadow-lg">
                                <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                             </div>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        RizzMaster
                        <span className="text-cyan-400">.</span>
                        <span className="text-purple-500">AI</span>
                    </h1>
                    <div className="flex flex-col gap-1">
                        <p className="text-lg font-medium text-slate-300">
                           Scientific Seduction Engine
                        </p>
                         <div className="flex items-center justify-center gap-2">
                             <span className="h-px w-4 bg-purple-500/50"></span>
                             <p className="text-[10px] font-bold tracking-[0.2em] text-purple-400 uppercase">
                                MBTI® NEURAL NET
                            </p>
                            <span className="h-px w-4 bg-purple-500/50"></span>
                         </div>
                    </div>
                </div>
            </div>

            {/* Feature Pills (Scientific) */}
            <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
                <div className="flex items-center gap-2 bg-slate-800/40 border border-slate-700/50 rounded-full px-4 py-2 backdrop-blur-sm shadow-lg shadow-purple-900/10">
                    <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs font-semibold text-slate-300">Psychology</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/40 border border-slate-700/50 rounded-full px-4 py-2 backdrop-blur-sm shadow-lg shadow-cyan-900/10">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-semibold text-slate-300">Compatibility</span>
                </div>
            </div>

            {/* Language Grid */}
            <div className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                <div className="flex items-center gap-3 justify-center text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                    <span className="h-px w-8 bg-slate-800"></span>
                    <Globe className="w-3 h-3" /> Initialize System
                    <span className="h-px w-8 bg-slate-800"></span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 px-2">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => onSelect(lang.code)}
                            className="flex items-center gap-3 p-4 bg-slate-800/60 border border-slate-700/50 rounded-xl hover:bg-slate-700/80 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all group active:scale-95"
                        >
                            <span className="text-2xl filter drop-shadow-md group-hover:scale-110 transition-transform">{lang.flag}</span>
                            <span className="text-sm font-bold text-slate-200 group-hover:text-white">{lang.label}</span>
                        </button>
                    ))}
                </div>
            </div>
            
            <p className="text-[10px] text-slate-600 animate-in fade-in duration-700 delay-500 pb-6 opacity-60">
                v1.2.0 • Neural Core Active • Secure Connection
            </p>
        </div>
    </div>
  );
};