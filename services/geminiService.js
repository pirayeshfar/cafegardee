import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";

let aiInstance = null;

const getAiInstance = () => {
    // CRITICAL FIX: Explicitly check for the API key's existence.
    // This provides a clear, actionable error message if the environment variable is not set on the host,
    // which is the most likely cause of the production failure.
    if (!process.env.API_KEY) {
        console.error("Fatal Error: API_KEY environment variable not set.");
        throw new Error("کلید API برای سرویس هوش مصنوعی تنظیم نشده است. لطفاً تنظیمات محیط هاست خود را بررسی کنید.");
    }

    if (!aiInstance) {
        try {
            aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
        } catch (error) {
            console.error("Failed to initialize GoogleGenAI:", error);
            const message = (error instanceof Error) ? error.message : 'خطای ناشناخته';
            throw new Error(`امکان برقراری ارتباط با سرویس هوش مصنوعی وجود ندارد: ${message}`);
        }
    }
    return aiInstance;
};

// Priming conversation to set the chatbot's personality robustly.
// This method is more stable than using the systemInstruction parameter.
const systemPrompt = 'شما یک متخصص نوشیدنی‌های کافه، هوشمند و دوست‌داشتنی به نام "کافی" هستید. شما در تمام امور مربوط به قهوه، دمنوش‌ها و سایر نوشیدنی‌های محبوب کافه‌ها تخصص دارید. به سوالات به زبان فارسی، به صورت دوستانه، مفید و تا حد امکان خلاصه پاسخ دهید.';
const primingHistory = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: 'باشه، فهمیدم! من "کافی" هستم، باریستای هوشمند و دوست شما. آماده‌ام به سوالاتتون جواب بدم.' }] }
];


export const sendChatMessageStream = async (history) => {
    try {
        const ai = getAiInstance();
        
        // Combine the hidden priming history with the user's visible chat history.
        const fullHistory = [...primingHistory, ...history];
        
        const result = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: fullHistory,
            // FIX: `safetySettings` must be nested inside a `config` object.
            config: {
                safetySettings: [
                    {
                        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                    },
                ],
            },
        });
        return result;
    } catch (error) {
        console.error("Error sending chat message:", error);
        // Self-healing mechanism: Reset the AI instance in case of connection/auth issues.
        aiInstance = null;
        throw error;
    }
};

const getRecipeSchema = () => ({
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: 'نام رسپی قهوه' },
      origin: { type: Type.STRING, description: 'کشور یا منطقه مبدأ رسپی' },
      description: { type: Type.STRING, description: 'توضیح کوتاه و جذاب در مورد رسپی' },
      ingredients: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'لیست مواد لازم' },
      instructions: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'مراحل تهیه' },
    },
    required: ['name', 'origin', 'description', 'ingredients', 'instructions'],
  },
});

const getCountryListSchema = () => ({
    type: Type.ARRAY,
    items: { type: Type.STRING },
    description: "لیستی از نام کشورها"
});

export const fetchCoffeeRecipes = async (prompt) => {
  try {
    const ai = getAiInstance();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: getRecipeSchema(),
      },
    });
    const jsonText = response.text;
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error fetching recipes from Gemini API:", error);
    throw error;
  }
};

export const fetchCountryList = async (prompt) => {
    try {
        const ai = getAiInstance();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: getCountryListSchema(),
            },
        });
        const jsonText = response.text;
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error fetching country list from Gemini API:", error);
        throw error;
    }
};