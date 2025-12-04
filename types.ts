
export enum Gender {
  Male = 'Male',
  Female = 'Female',
  NonBinary = 'Non-Binary',
  Other = 'Other'
}

export enum MBTI {
  ISTJ = 'ISTJ', ISFJ = 'ISFJ', INFJ = 'INFJ', INTJ = 'INTJ',
  ISTP = 'ISTP', ISFP = 'ISFP', INFP = 'INFP', INTP = 'INTP',
  ESTP = 'ESTP', ESFP = 'ESFP', ENFP = 'ENFP', ENTP = 'ENTP',
  ESTJ = 'ESTJ', ESFJ = 'ESFJ', ENFJ = 'ENFJ', ENTJ = 'ENTJ',
  Unknown = 'Unknown'
}

export type Language = 'en' | 'ko' | 'ja' | 'fr' | 'es' | 'pt' | 'zh' | 'ru';

export interface UserProfile {
  gender: Gender;
  age: number;
  mbti: MBTI;
}

export interface PartnerProfile {
  id: string; // Unique ID for local storage
  name: string; // Name/Nickname
  gender: Gender;
  age: number | null; // Nullable for unknown age
  relation: string; // e.g., Friend, Colleague, Stranger
  mbti: MBTI;
  goal: string; // e.g., Intimacy, Date, Casual, Networking
  vibe: string; // e.g., Witty, Sweet, Chill
  context: string; // User provided hints e.g. "Mention her dog"
  language: Language; // The language the partner speaks (replies will be in this language)
  politeness: string; // e.g. 'Casual', 'Polite', 'Mixed'
}

export interface RizzResponse {
  tone: string;
  text: string;
  translation?: string; // Translated text if partner language differs from UI language
  explanation: string;
}

export interface RizzGenerationResult {
  replies: RizzResponse[];
}