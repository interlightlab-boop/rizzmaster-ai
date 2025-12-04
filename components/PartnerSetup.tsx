
import React, { useState, useEffect } from 'react';
import { PartnerProfile, Gender, MBTI, Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';
import { Button } from './Button';
import { Input, Select } from './Input';
import { ArrowLeft, UserPlus, Settings, BrainCircuit, HelpCircle, Lock } from 'lucide-react';

interface PartnerSetupProps {
  onBack: () => void;
  onNext: (partner: PartnerProfile) => void;
  language: Language;
  onOpenSettings: () => void;
  isPro: boolean;
  onShowPaywall: () => void;
}

const STORAGE_KEY_PARTNERS = 'rizz_saved_partners';

const mbtiGroups = [
    { name: 'Analysts', color: 'bg-purple-500', border: 'border-purple-500', types: [MBTI.INTJ, MBTI.INTP, MBTI.ENTJ, MBTI.ENTP] },
    { name: 'Diplomats', color: 'bg-green-500', border: 'border-green-500', types: [MBTI.INFJ, MBTI.INFP, MBTI.ENFJ, MBTI.ENFP] },
    { name: 'Sentinels', color: 'bg-blue-500', border: 'border-blue-500', types: [MBTI.ISTJ, MBTI.ISFJ, MBTI.ESTJ, MBTI.ESFJ] },
    { name: 'Explorers', color: 'bg-yellow-500', border: 'border-yellow-500', types: [MBTI.ISTP, MBTI.ISFP, MBTI.ESTP, MBTI.ESFP] },
];

const languageOptions: { label: string; value: Language }[] = [
    { label: 'English', value: 'en' },
    { label: '日本語 (Japanese)', value: 'ja' },
    { label: 'Español (Spanish)', value: 'es' },
    { label: '한국어 (Korean)', value: 'ko' },
    { label: 'Français (French)', value: 'fr' },
    { label: 'Português (Portuguese)', value: 'pt' },
    { label: '中文 (Chinese)', value: 'zh' },
    { label: 'Русский (Russian)', value: 'ru' },
];

const politenessOptions = (t: any) => [
    { label: t.politeness_casual, value: 'Casual' },
    { label: t.politeness_polite, value: 'Polite' },
    { label: t.politeness_mixed, value: 'Mixed' },
];

export const PartnerSetup: React.FC<PartnerSetupProps> = ({ onBack, onNext, language, onOpenSettings, isPro, onShowPaywall }) => {
  const t = TRANSLATIONS[language];
  const [savedPartners, setSavedPartners] = useState<PartnerProfile[]>([]);
  const [formData, setFormData] = useState<PartnerProfile>({
    id: '',
    name: '',
    gender: Gender.Female,
    age: 25,
    relation: 'Stranger', 
    mbti: MBTI.Unknown,
    goal: 'Casual', // Default to non-locked
    vibe: 'Witty',  // Default to non-locked
    context: '',
    language: language,
    politeness: 'Casual'
  });

  // Load partners on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_PARTNERS);
    if (stored) {
        try {
            setSavedPartners(JSON.parse(stored));
        } catch (e) {
            console.error("Failed to parse partners", e);
        }
    }
  }, []);

  const savePartnerToStorage = (partner: PartnerProfile) => {
      const existingIndex = savedPartners.findIndex(p => p.id === partner.id);
      let newPartners;
      
      if (existingIndex >= 0) {
          newPartners = [...savedPartners];
          newPartners[existingIndex] = partner;
      } else {
          newPartners = [...savedPartners, partner];
      }

      setSavedPartners(newPartners);
      localStorage.setItem(STORAGE_KEY_PARTNERS, JSON.stringify(newPartners));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
        ...formData,
        id: formData.id || Date.now().toString()
    };
    savePartnerToStorage(finalData);
    onNext(finalData);
  };

  const handleSelectPartner = (partner: PartnerProfile) => {
      setFormData({
          ...partner,
          language: partner.language || language,
          politeness: partner.politeness || 'Casual',
          age: partner.age !== undefined ? partner.age : 25
      });
  };

  const handleNewPartner = () => {
      setFormData({
        id: '',
        name: '',
        gender: Gender.Female,
        age: 25,
        relation: 'Stranger', 
        mbti: MBTI.Unknown,
        goal: 'Casual',
        vibe: 'Witty',
        context: '',
        language: language,
        politeness: 'Casual'
      });
  };

  // --- Locked Feature Logic ---
  const lockedGoals = ['Date', 'Intimacy'];
  const lockedVibes = ['Bold', 'Intellectual'];

  const handleOptionSelect = (type: 'goal' | 'vibe', value: string) => {
      const isLocked = type === 'goal' ? lockedGoals.includes(value) : lockedVibes.includes(value);
      
      if (isLocked && !isPro) {
          onShowPaywall();
      } else {
          setFormData({ ...formData, [type]: value });
      }
  };

  const genderOptions = [
    { label: t.gender_male, value: Gender.Male },
    { label: t.gender_female, value: Gender.Female },
    { label: t.gender_nb, value: Gender.NonBinary },
    { label: t.gender_other, value: Gender.Other },
  ];
  
  const relationOptions = [
    { label: t.rel_stranger, value: 'Stranger' },
    { label: t.rel_friend, value: 'Friend' },
    { label: t.rel_colleague, value: 'Colleague' },
    { label: t.rel_ex, value: 'Ex' },
    { label: t.rel_crush, value: 'Crush' },
  ];

  const goalOptions = [
    { label: t.goal_casual, value: 'Casual' },
    { label: t.goal_humor, value: 'Humor' },
    { label: t.goal_reconnect, value: 'Reconnect' },
    { label: t.goal_date, value: 'Date' },
    { label: t.goal_intimacy, value: 'Intimacy' },
  ];

  const vibeOptions = [
    { label: t.vibe_witty, value: 'Witty' },
    { label: t.vibe_sweet, value: 'Sweet' },
    { label: t.vibe_chill, value: 'Chill' },
    { label: t.vibe_bold, value: 'Bold' },
    { label: t.vibe_smart, value: 'Intellectual' },
  ];

  return (
    <div className="min-h-screen flex flex-col p-4 max-w-md mx-auto animate-in slide-in-from-right duration-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
            <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white">
            <ArrowLeft />
            </button>
            <h2 className="text-xl font-bold ml-2">{t.who_texting}</h2>
        </div>
        <button 
            onClick={onOpenSettings}
            className="p-2 -mr-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
        >
            <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">{t.saved_partners}</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button 
                onClick={handleNewPartner}
                className={`flex flex-col items-center gap-2 min-w-[70px] p-2 rounded-xl border border-dashed border-slate-600 hover:bg-slate-800 transition-colors
                    ${!formData.id ? 'bg-purple-500/10 border-purple-500' : ''}
                `}
            >
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-slate-300 truncate w-full text-center">{t.new_partner}</span>
            </button>

            {savedPartners.map(p => (
                <button 
                    key={p.id}
                    onClick={() => handleSelectPartner(p)}
                    className={`flex flex-col items-center gap-2 min-w-[70px] p-2 rounded-xl border transition-all
                        ${formData.id === p.id 
                            ? 'bg-purple-600/20 border-purple-500' 
                            : 'bg-slate-800 border-slate-700 hover:border-slate-500'}
                    `}
                >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                        {p.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-slate-300 truncate w-full text-center max-w-[60px]">
                        {p.name}
                    </span>
                </button>
            ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-y-auto pb-6">
        <div className="bg-slate-800/50 p-5 rounded-3xl border border-slate-700/50 space-y-4 backdrop-blur-sm">
           <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg">
                <BrainCircuit className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-semibold text-slate-200">{t.partner_details}</h3>
           </div>
           
           <Input
              label={t.partner_name}
              placeholder="e.g. Jessica, Tom"
              value={formData.name}
              required
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Select
              label={t.partner_lang_label}
              options={languageOptions}
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value as Language })}
            />

           <div className="grid grid-cols-2 gap-4">
             <Select
              label={t.their_gender}
              options={genderOptions}
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
            />
            
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-400 ml-1">{t.their_age}</label>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, age: formData.age === null ? 25 : null })}
                        className={`text-[10px] px-2 py-0.5 rounded transition-colors font-bold ${formData.age === null ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-400 hover:text-slate-300'}`}
                    >
                        ?
                    </button>
                </div>
                {formData.age !== null ? (
                     <input
                        className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-slate-500 w-full"
                        type="number"
                        min={18}
                        max={100}
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                    />
                ) : (
                    <div className="bg-slate-800/50 border border-slate-700 text-slate-500 rounded-xl px-4 py-3 text-sm italic flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" /> {t.age_unknown}
                    </div>
                )}
            </div>
           </div>

           <Select
              label={t.politeness_label}
              options={politenessOptions(t)}
              value={formData.politeness}
              onChange={(e) => setFormData({ ...formData, politeness: e.target.value })}
            />

           <Select
              label={t.relation}
              options={relationOptions}
              value={formData.relation}
              onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
            />

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1 flex justify-between">
                    <span>{t.their_mbti}</span>
                    <span className={`text-xs font-bold ${formData.mbti === MBTI.Unknown ? 'text-slate-400' : 'text-cyan-400'}`}>
                        {formData.mbti === MBTI.Unknown ? 'Unknown' : formData.mbti}
                    </span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                    {mbtiGroups.map(group => (
                        <React.Fragment key={group.name}>
                            {group.types.map(type => (
                                <button
                                    type="button"
                                    key={type}
                                    onClick={() => setFormData({ ...formData, mbti: type })}
                                    className={`
                                        h-9 rounded-md text-[10px] font-bold transition-all border
                                        ${formData.mbti === type 
                                            ? `${group.color} text-white ${group.border} scale-105 shadow-md z-10` 
                                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}
                                    `}
                                >
                                    {type}
                                </button>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mbti: MBTI.Unknown })}
                    className={`
                        w-full h-9 rounded-md text-xs font-bold transition-all border flex items-center justify-center gap-2
                        ${formData.mbti === MBTI.Unknown
                            ? 'bg-slate-600 text-white border-slate-500 scale-105 shadow-md' 
                            : 'bg-slate-800 text-slate-500 border-slate-700 hover:bg-slate-700'}
                    `}
                >
                    <HelpCircle className="w-3.5 h-3.5" />
                    {t.mbti_unknown}
                </button>
            </div>

            {/* Custom Select for Goal with Locking */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-400 ml-1">{t.goal}</label>
                <div className="grid grid-cols-1 gap-2">
                    {goalOptions.map(opt => {
                        const isLocked = lockedGoals.includes(opt.value) && !isPro;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleOptionSelect('goal', opt.value)}
                                className={`text-left px-4 py-3 rounded-xl border flex items-center justify-between transition-all ${
                                    formData.goal === opt.value
                                    ? 'bg-slate-700 border-purple-500 text-white'
                                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                                }`}
                            >
                                <span className="text-sm">{opt.label}</span>
                                {isLocked && <Lock className="w-4 h-4 text-slate-500" />}
                            </button>
                        )
                    })}
                </div>
            </div>
            
            <div className="h-px bg-slate-700/50 my-2" />
            
            {/* Custom Select for Vibe with Locking */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-400 ml-1">{t.vibe_label}</label>
                <div className="grid grid-cols-1 gap-2">
                    {vibeOptions.map(opt => {
                        const isLocked = lockedVibes.includes(opt.value) && !isPro;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleOptionSelect('vibe', opt.value)}
                                className={`text-left px-4 py-3 rounded-xl border flex items-center justify-between transition-all ${
                                    formData.vibe === opt.value
                                    ? 'bg-slate-700 border-purple-500 text-white'
                                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                                }`}
                            >
                                <span className="text-sm">{opt.label}</span>
                                {isLocked && <Lock className="w-4 h-4 text-slate-500" />}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-400 ml-1">{t.context_label}</label>
                <textarea
                  className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-slate-500 min-h-[80px] resize-none text-sm"
                  placeholder={t.context_placeholder}
                  value={formData.context}
                  onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                />
            </div>
        </div>

        <Button type="submit" fullWidth>
          {t.next_upload}
        </Button>
      </form>
    </div>
  );
};
