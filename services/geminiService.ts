import { GoogleGenAI, Chat } from "@google/genai";

// Initialize the API client. 
// Note: process.env.API_KEY is assumed to be available as per instructions.
const apiKey = process.env.API_KEY || '';

// We handle the case where the key might be missing gracefully in the UI, 
// but here we just instantiate.
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are "Hani", the expert AI consultant for Home Service Kuwait. 
Your goal is to help customers plan their smart home and security installations in Kuwait.

About Home Service Kuwait:
- 7 Years of experience in the industry.
- Team of experts in technical setup.
- Focus: Smart home appliances and security systems.

Services provided:
1. CCTV & Security Camera Installation
2. Smart Locks, Keypads & Fingerprint Devices
3. Intercom Systems (Video/Audio)
4. Audio System Setup
5. Internet & WiFi Setup
6. Maintenance Subscriptions

Context about Kuwait:
- Common areas: Salmiya, Hawally, Jabriya, South Surra, Mangaf, etc.
- Housing: Apartments, Villas, Floors.
- Currency: Kuwaiti Dinar (KWD).

Guidelines:
- Be friendly, professional, and concise.
- Emphasize safety, security, and modern convenience.
- If a user asks for a quote, give a rough estimate range if possible but advise them to "Call Now" or "Request a formal quote".
- Ask clarifying questions (e.g., "Are you looking for an indoor or outdoor camera?", "Is this for a villa or apartment?").
- Keep responses short (under 100 words) unless a detailed plan is requested.
`;

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
      maxOutputTokens: 500,
    },
  });
};

export const sendMessageToGemini = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response = await chat.sendMessage({ message });
    return response.text || "I apologize, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the service right now. Please try again later.";
  }
};

// --- Content Generation Functions ---

export const generateContent = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    });
    return response.text || '';
  } catch (error) {
    console.error("Gemini Generate Content Error:", error);
    throw error;
  }
};

export const translateText = async (text: string, targetLang: 'ar' | 'en'): Promise<string> => {
  const prompt = `Translate the following text to ${targetLang === 'ar' ? 'Arabic' : 'English'}. Return ONLY the translation, no extra text or explanations.\n\nText: "${text}"`;
  return generateContent(prompt);
};

export const generateSEO = async (content: string, lang: 'en' | 'ar'): Promise<{ title: string; description: string; keywords: string }> => {
  const prompt = `
    Analyze the following content and generate SEO metadata in ${lang === 'ar' ? 'Arabic' : 'English'}.
    Return the result as a valid JSON object with keys: "title" (max 60 chars), "description" (max 160 chars), and "keywords" (comma-separated string).
    Do not wrap the JSON in markdown code blocks. Just return the raw JSON string.

    Content: "${content.substring(0, 1000)}..."
  `;

  try {
    const result = await generateContent(prompt);
    // Clean up if markdown code blocks are returned despite instructions
    const cleanResult = result.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanResult);
  } catch (error) {
    console.error("Gemini SEO Generation Error:", error);
    return { title: '', description: '', keywords: '' };
  }
};
