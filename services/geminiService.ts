
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, PartnerProfile, RizzGenerationResult, Language } from "../types";

// Fix for TypeScript error: Cannot find name 'process'
declare var process: any;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    replies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          tone: { type: Type.STRING, description: "The psychological tactic used (e.g., 'Mirroring', 'Push-Pull', 'Future Pacing')" },
          text: { type: Type.STRING, description: "The actual suggested reply text in the TARGET LANGUAGE" },
          translation: { type: Type.STRING, description: "Translation of the reply in the EXPLANATION LANGUAGE (if different from target)" },
          explanation: { type: Type.STRING, description: "Why this works for this specific MBTI type's cognitive stack (in EXPLANATION LANGUAGE)" }
        },
        required: ["tone", "text", "explanation"]
      }
    }
  },
  required: ["replies"]
};

const getLanguageName = (code: Language): string => {
    const map: Record<Language, string> = {
        en: 'English',
        ko: 'Korean',
        ja: 'Japanese',
        zh: 'Simplified Chinese',
        es: 'Spanish',
        fr: 'French',
        pt: 'Portuguese',
        ru: 'Russian'
    };
    return map[code] || 'English';
};

export const generateRizzSuggestions = async (
  user: UserProfile,
  partner: PartnerProfile,
  imageBase64: string,
  imageMimeType: string,
  userInterfaceLanguage: Language
): Promise<RizzGenerationResult> => {
  
  // Initialize client here to ensure fresh API key usage
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // The replies should be in the Partner's language (e.g., chatting with an American -> English)
  // The explanation should be in the User's language (e.g., user is Korean -> Korean)
  const targetLanguageName = getLanguageName(partner.language || userInterfaceLanguage);
  const explanationLanguageName = getLanguageName(userInterfaceLanguage);
  
  const userContext = partner.context ? `USER'S TACTICAL INTENT: "${partner.context}".` : "";
  const partnerName = partner.name ? partner.name : "Unknown Target";
  const partnerAge = partner.age ? partner.age : "Unknown"; // Handle null age

  // STRICT GRAMMAR RULES FOR ALL LANGUAGES
  let grammarInstruction = "";
  const politeness = partner.politeness || 'Casual';
  const targetLangCode = partner.language || userInterfaceLanguage;

  switch (targetLangCode) {
    case 'ko': // Korean
      if (politeness === 'Casual') {
        grammarInstruction = `
          CRITICAL KOREAN GRAMMAR RULE: 
          - You MUST use "Banmal" (반말). 
          - End sentences with '야', '어', '지', '네', '까?', '게'. 
          - NEVER use '요' or '니다'. 
          - Tone: Intimate, like a close friend or lover.
        `;
      } else if (politeness === 'Polite') {
        grammarInstruction = `
          CRITICAL KOREAN GRAMMAR RULE: 
          - You MUST use "Jondaetmal" (존댓말). 
          - End sentences with '요' or '니다'. 
          - Tone: Respectful and polite.
        `;
      }
      break;

    case 'ja': // Japanese
      if (politeness === 'Casual') {
        grammarInstruction = `
          CRITICAL JAPANESE GRAMMAR RULE: 
          - You MUST use "Tameguchi" (タメ口). 
          - Do NOT use 'Desu' (です) or 'Masu' (ます). 
          - Use dictionary forms or short forms.
          - Tone: Casual and intimate.
        `;
      } else if (politeness === 'Polite') {
        grammarInstruction = `
           CRITICAL JAPANESE GRAMMAR RULE: 
           - You MUST use "Keigo/Teineigo" (敬語/丁寧語). 
           - End sentences with 'Desu' (です) or 'Masu' (ます).
        `;
      }
      break;

    case 'fr': // French
      if (politeness === 'Casual') {
        grammarInstruction = `
          CRITICAL FRENCH GRAMMAR RULE: 
          - You MUST use "Tu". 
          - Omit 'ne' in negations (e.g., use "J'sais pas" instead of "Je ne sais pas").
          - Use colloquial vocabulary if appropriate.
        `;
      } else if (politeness === 'Polite') {
        grammarInstruction = `
           CRITICAL FRENCH GRAMMAR RULE: 
           - You MUST use "Vous". 
           - Use standard grammar and full negation.
        `;
      }
      break;

    case 'es': // Spanish
      if (politeness === 'Casual') {
        grammarInstruction = `
          CRITICAL SPANISH GRAMMAR RULE: 
          - You MUST use "Tú". 
          - Use informal verb conjugations (2nd person singular).
        `;
      } else if (politeness === 'Polite') {
        grammarInstruction = `
           CRITICAL SPANISH GRAMMAR RULE: 
           - You MUST use "Usted". 
           - Use formal verb conjugations (3rd person singular).
        `;
      }
      break;

    case 'pt': // Portuguese
      if (politeness === 'Casual') {
        grammarInstruction = `
          CRITICAL PORTUGUESE GRAMMAR RULE: 
          - Use informal register (Tu/Você depending on context, but prefer colloquial).
          - Slang allowed.
        `;
      } else if (politeness === 'Polite') {
        grammarInstruction = `
           CRITICAL PORTUGUESE GRAMMAR RULE: 
           - Use formal register (O Senhor/A Senhora or formal Você).
           - Avoid slang.
        `;
      }
      break;

    case 'ru': // Russian
      if (politeness === 'Casual') {
        grammarInstruction = `
          CRITICAL RUSSIAN GRAMMAR RULE: 
          - You MUST use "Ты" (Ty). 
          - Use informal verb conjugations.
        `;
      } else if (politeness === 'Polite') {
        grammarInstruction = `
           CRITICAL RUSSIAN GRAMMAR RULE: 
           - You MUST use "Вы" (Vy). 
           - Use formal verb conjugations.
        `;
      }
      break;

    case 'zh': // Chinese
      if (politeness === 'Casual') {
        grammarInstruction = `
          CRITICAL CHINESE GRAMMAR RULE: 
          - Use "你" (Ni). 
          - Use internet slang or casual particles (啊, 嘛, 呢).
        `;
      } else if (politeness === 'Polite') {
        grammarInstruction = `
           CRITICAL CHINESE GRAMMAR RULE: 
           - Use "您" (Nin). 
           - Keep tone respectful and structured.
        `;
      }
      break;
  }

  const prompt = `
    IDENTITY: You are the "RizzMaster Neural Engine", a specialized AI trained in Behavioral Psychology, MBTI Cognitive Functions, and Social Dynamics.
    
    MISSION: Analyze the screenshot and generate 3 optimal replies to achieve the user's goal with the target.
    
    DATA STREAMS:
    1. TARGET LANGUAGE (For Replies): ${targetLanguageName}
    2. EXPLANATION LANGUAGE (For Explanations): ${explanationLanguageName}
    3. POLITENESS LEVEL: ${politeness}.
    4. USER PROFILE: Gender: ${user.gender}, Age: ${user.age}, MBTI: ${user.mbti}.
    5. TARGET PROFILE: Name: ${partnerName}, Gender: ${partner.gender}, Age: ${partnerAge}, Relation: ${partner.relation}, MBTI: ${partner.mbti}.
    6. STRATEGY (VIBE): ${partner.vibe}.
    7. GOAL: ${partner.goal}.
    ${userContext}
    
    ${grammarInstruction}

    PSYCHOLOGICAL PROTOCOL:
    - PARTNER MBTI: ${partner.mbti}.
    - IF MBTI is 'Unknown': Analyze the conversation style (emoji usage, length, speed) to determine the best approach. Focus on general Charisma and Social Calibration techniques rather than specific cognitive functions.
    - IF Target is NT (Analyst): Use logic, wit, and competence. Avoid emotional fluff.
    - IF Target is NF (Diplomat): Use authenticity, metaphors, and emotional connection.
    - IF Target is SJ (Sentinel): Use reliability, tradition, and clarity. Be direct.
    - IF Target is SP (Explorer): Use excitement, spontaneity, and sensory details.
    
    EXECUTION:
    1. READ visual context from screenshot (mood, emoji usage, time gaps).
    2. GENERATE 3 distinct options matching the '${partner.vibe}' strategy in ${targetLanguageName}.
    3. EXPLAIN the psychological reasoning based on the Target's MBTI (or observed vibe if Unknown) in ${explanationLanguageName}.
    4. IF ${targetLanguageName} != ${explanationLanguageName}, provide a translation in ${explanationLanguageName}.
    
    OUTPUT FORMAT: JSON only.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: imageMimeType,
                data: imageBase64
              }
            },
            { text: prompt }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.85, 
      }
    });

    const jsonText = response.text || "{}";
    return JSON.parse(jsonText) as RizzGenerationResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Neural Engine Malfunction. Please retry.");
  }
};
