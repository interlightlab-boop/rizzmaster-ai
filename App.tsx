import React, { useState, useEffect } from 'react';
import { UserProfile, PartnerProfile, Language } from './types';
import { Onboarding } from './components/Onboarding';
import { PartnerSetup } from './components/PartnerSetup';
import { Analyzer } from './components/Analyzer';
import { Paywall } from './components/Paywall';
import { LanguageSelector } from './components/LanguageSelector';
import { SettingsModal } from './components/SettingsModal';
import { AdBanner } from './components/AdBanner';
import { LegalDocs } from './components/LegalDocs';

// Helpers for localStorage
const STORAGE_KEY_USER = 'rizz_user_profile';
const STORAGE_KEY_PRO_EXPIRY = 'rizz_pro_expiry';
const STORAGE_KEY_PREMIUM = 'rizz_is_premium';
const STORAGE_KEY_LANG = 'rizz_language';

const App: React.FC = () => {
  // --- State ---
  const [screen, setScreen] = useState<'language' | 'onboarding' | 'partner' | 'analyzer'>('language');
  const [language, setLanguage] = useState<Language>('en');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null);
  
  const [proExpiry, setProExpiry] = useState<number>(0); // Timestamp
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false); // Paid subscription
  
  const [showPaywall, setShowPaywall] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  // Legal Docs State
  const [showLegal, setShowLegal] = useState<boolean>(false);
  const [legalDocType, setLegalDocType] = useState<'privacy' | 'terms'>('privacy');

  // Derived State
  const isPro = isSubscribed || (proExpiry > Date.now());

  // PWA Install Prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // --- Initialization & Storage ---
  useEffect(() => {
    // Capture PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); 
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Load Language
    const savedLang = localStorage.getItem(STORAGE_KEY_LANG) as Language;
    if (savedLang) {
        setLanguage(savedLang);
        
        const savedUser = localStorage.getItem(STORAGE_KEY_USER);
        if (savedUser) {
          setUserProfile(JSON.parse(savedUser));
          setScreen('partner'); 
        } else {
            setScreen('onboarding');
        }
    } else {
        setScreen('language');
    }

    // Load Premium Status
    const savedPremium = localStorage.getItem(STORAGE_KEY_PREMIUM);
    if (savedPremium === 'true') setIsSubscribed(true);

    // Load Pro Expiry (Share Reward)
    const savedExpiry = localStorage.getItem(STORAGE_KEY_PRO_EXPIRY);
    if (savedExpiry) setProExpiry(parseInt(savedExpiry));

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem(STORAGE_KEY_LANG, lang);
    if (screen === 'language') {
        setScreen('onboarding');
    }
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
    setScreen('partner');
  };

  const handlePartnerNext = (partner: PartnerProfile) => {
    setPartnerProfile(partner);
    setScreen('analyzer');
  };

  // REWARD SYSTEM: Share to get benefits
  const handleShareReward = async () => {
    const shareData = {
        title: 'RizzMaster AI',
        text: 'Check out this AI Wingman! It writes the perfect replies.',
        url: window.location.href
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
            // Grant Reward: 24h Pro Mode
            const newExpiry = Date.now() + (24 * 60 * 60 * 1000);
            setProExpiry(newExpiry);
            localStorage.setItem(STORAGE_KEY_PRO_EXPIRY, newExpiry.toString());
            setShowPaywall(false);
            alert("Reward Unlocked: All Secret Modes Unlocked for 24h!");
        } else {
            // Fallback for desktop
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied! Share it to unlock rewards.");
             // Grant Reward for simulation
             const newExpiry = Date.now() + (24 * 60 * 60 * 1000);
             setProExpiry(newExpiry);
             localStorage.setItem(STORAGE_KEY_PRO_EXPIRY, newExpiry.toString());
             setShowPaywall(false);
        }
    } catch (err) {
        console.log('Share canceled');
    }
  };

  const handleSubscribe = () => {
    setIsSubscribed(true);
    localStorage.setItem(STORAGE_KEY_PREMIUM, 'true');
    setShowPaywall(false);
  };

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleResetData = () => {
    localStorage.clear();
    window.location.reload();
  };
  
  const handleOpenLegal = (type: 'privacy' | 'terms') => {
      setLegalDocType(type);
      setShowSettings(false);
      setShowLegal(true);
  };

  // --- Render ---
  return (
    <div className="font-sans antialiased text-slate-100 bg-slate-900 min-h-screen selection:bg-purple-500/30 flex flex-col">
      
      <div className="flex-1 pb-16">
        {screen === 'language' && (
            <LanguageSelector onSelect={handleLanguageSelect} />
        )}

        {screen === 'onboarding' && (
            <Onboarding 
            onComplete={handleOnboardingComplete} 
            language={language}
            onOpenSettings={() => setShowSettings(true)}
            />
        )}

        {screen === 'partner' && (
            <PartnerSetup 
            onBack={() => setScreen('onboarding')}
            onNext={handlePartnerNext} 
            language={language}
            onOpenSettings={() => setShowSettings(true)}
            isPro={isPro}
            onShowPaywall={() => setShowPaywall(true)}
            />
        )}

        {screen === 'analyzer' && userProfile && partnerProfile && (
            <Analyzer 
            user={userProfile}
            partner={partnerProfile}
            isPro={isPro}
            onBack={() => setScreen('partner')}
            onShowPaywall={() => setShowPaywall(true)}
            language={language}
            onOpenSettings={() => setShowSettings(true)}
            />
        )}
      </div>

      {/* Persistent Ad Banner at Bottom */}
      {!isPro && screen !== 'language' && !showLegal && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800">
             <AdBanner />
        </div>
      )}

      {/* Overlays */}
      {showPaywall && (
        <Paywall 
          onClose={() => setShowPaywall(false)}
          onShare={handleShareReward}
          onSubscribe={handleSubscribe}
          language={language}
        />
      )}
      
      {showLegal && (
        <LegalDocs 
            docType={legalDocType}
            onBack={() => setShowLegal(false)}
        />
      )}

      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        currentLanguage={language}
        onLanguageChange={handleLanguageSelect}
        onResetData={handleResetData}
        installPrompt={deferredPrompt}
        onInstallApp={handleInstallApp}
        onOpenLegal={handleOpenLegal}
      />
    </div>
  );
};

export default App;