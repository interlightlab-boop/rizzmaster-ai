import React, { useState } from 'react';
import { UserProfile, Gender, MBTI, Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';
import { Button } from './Button';
import { Input, Select } from './Input';
import { Sparkles, Settings } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  language: Language;
  onOpenSettings: () => void;
}

const mbtiGroups = [
  { name: 'Analysts', color: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-400', types: [MBTI.INTJ, MBTI.INTP, MBTI.ENTJ, MBTI.ENTP] },
  { name: 'Diplomats', color: 'bg-green-500', border: 'border-green-500', text: 'text-green-400', types: [MBTI.INFJ, MBTI.INFP, MBTI.ENFJ, MBTI.ENFP] },
  { name: 'Sentinels', color: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-400', types: [MBTI.ISTJ, MBTI.ISFJ, MBTI.ESTJ, MBTI.ESFJ] },
  { name: 'Explorers', color: 'bg-yellow-500', border: 'border-yellow-500', text: 'text-yellow-400', types: [MBTI.ISTP, MBTI.ISFP, MBTI.ESTP, MBTI.ESFP] },
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, language, onOpenSettings }) => {
  const [formData, setFormData] = useState<UserProfile>({
    gender: Gender.Male,
    age: 25,
    mbti: MBTI.ENFP,
  });

  const t = TRANSLATIONS[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const genderOptions = [
    { label: t.gender_male, value: Gender.Male },
    { label: t.gender_female, value: Gender.Female },
    { label: t.gender_nb, value: Gender.NonBinary },
    { label: t.gender_other, value: Gender.Other },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900 animate-in fade-in duration-700 relative">
      <button 
        onClick={onOpenSettings}
        className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
      >
        <Settings className="w-6 h-6" />
      </button>

      <div className="w-full max-w-md space-y-6 my-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 mb-2 shadow-xl shadow-purple-500/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {t.welcome}
          </h1>
          <p className="text-slate-400 text-sm">
            {t.welcome_desc}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-slate-800/30 p-5 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
          <div className="grid grid-cols-2 gap-4">
            <Select
                label={t.i_am}
                options={genderOptions}
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
            />
            <Input
                label={t.my_age}
                type="number"
                min={18}
                max={100}
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-400 ml-1 flex justify-between">
                <span>{t.my_mbti}</span>
                <span className="text-xs text-purple-400">{formData.mbti}</span>
            </label>
            
            <div className="grid grid-cols-4 gap-2">
                {mbtiGroups.map(group => (
                    <React.Fragment key={group.name}>
                        {group.types.map(type => (
                            <button
                                type="button"
                                key={type}
                                onClick={() => setFormData({ ...formData, mbti: type })}
                                className={`
                                    h-10 rounded-lg text-xs font-bold transition-all border
                                    ${formData.mbti === type 
                                        ? `${group.color} text-white ${group.border} scale-105 shadow-lg shadow-${group.color}/30` 
                                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}
                                `}
                            >
                                {type}
                            </button>
                        ))}
                    </React.Fragment>
                ))}
            </div>
            
            {/* Legend */}
            <div className="flex justify-between px-1 gap-1">
                 {mbtiGroups.map(group => (
                     <div key={group.name} className="flex items-center gap-1">
                         <div className={`w-2 h-2 rounded-full ${group.color}`}></div>
                         <span className="text-[10px] text-slate-500">{group.name}</span>
                     </div>
                 ))}
            </div>
          </div>

          <Button type="submit" fullWidth className="mt-4">
            {t.start_btn}
          </Button>
        </form>
      </div>
    </div>
  );
};