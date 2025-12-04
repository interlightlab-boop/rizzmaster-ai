import React from 'react';
import { X, Globe, Shield, FileText, Trash2, Mail, Download } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onResetData: () => void;
  installPrompt?: any;
  onInstallApp?: () => void;
  onOpenLegal: (type: 'privacy' | 'terms') => void;
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

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onLanguageChange,
  onResetData,
  installPrompt,
  onInstallApp,
  onOpenLegal
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[currentLanguage];

  const handleReset = () => {
    if (confirm(t.reset_confirm)) {
      onResetData();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">{t.settings_title}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* PWA Install Button (Only if available) */}
          {installPrompt && onInstallApp && (
             <div className="mb-4">
                <button 
                  onClick={onInstallApp}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white p-3 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/30 transition-all active:scale-95"
                >
                    <Download className="w-5 h-5" />
                    <div className="flex flex-col items-start leading-none">
                        <span className="font-bold">{t.install_app}</span>
                        <span className="text-[10px] opacity-80 mt-1 font-normal">{t.install_desc}</span>
                    </div>
                </button>
             </div>
          )}

          {/* Language Section */}
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" /> {t.language_label}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left
                    ${currentLanguage === lang.code 
                      ? 'bg-purple-500/20 border-purple-500 text-white' 
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-800" />

          {/* Legal & Info Section */}
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" /> {t.legal_label}
            </h3>
            <div className="space-y-2">
              <button onClick={() => onOpenLegal('privacy')} className="w-full flex items-center justify-between p-3 bg-slate-800 rounded-xl hover:bg-slate-750 text-slate-300 hover:text-white transition-colors">
                <span className="flex items-center gap-2 text-sm"><FileText className="w-4 h-4" /> {t.privacy_policy}</span>
              </button>
              <button onClick={() => onOpenLegal('terms')} className="w-full flex items-center justify-between p-3 bg-slate-800 rounded-xl hover:bg-slate-750 text-slate-300 hover:text-white transition-colors">
                 <span className="flex items-center gap-2 text-sm"><FileText className="w-4 h-4" /> {t.terms_of_service}</span>
              </button>
              <a href="mailto:support@rizzmaster.ai" className="flex items-center justify-between p-3 bg-slate-800 rounded-xl hover:bg-slate-750 text-slate-300 hover:text-white transition-colors">
                 <span className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4" /> {t.contact_support}</span>
              </a>
            </div>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed px-1">
                {t.ai_disclaimer}
            </p>
          </div>

          <hr className="border-slate-800" />

          {/* Danger Zone */}
          <button 
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 p-3 text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-colors text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" /> {t.reset_data}
          </button>

          <div className="text-center text-xs text-slate-600">
            {t.version}
          </div>
        </div>

      </div>
    </div>
  );
};