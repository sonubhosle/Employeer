import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini AI client
// Note: In a real production app, this key should be proxied through a backend.
// For this demo, we assume it's available in the environment.
const apiKey = process.env.API_KEY || ''; 
let ai: GoogleGenAI | null = null;

try {
    if (apiKey) {
        ai = new GoogleGenAI({ apiKey });
    }
} catch (error) {
    console.error("Failed to initialize Gemini Client", error);
}

export const generateTaskDescription = async (taskTitle: string): Promise<string> => {
  if (!ai) return "AI service unavailable. Please check API Key.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a concise, professional task description for a software engineering task titled: "${taskTitle}". Include acceptance criteria.`,
    });
    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate description.";
  }
};

export const chatWithAI = async (message: string): Promise<string> => {
    if (!ai) return "I'm offline right now (Check API Key).";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a helpful project management assistant named NexusAI. 
            User says: "${message}". 
            Keep it brief and helpful related to project management, coding, or team productivity.`,
        });
        return response.text || "I didn't catch that.";
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        return "Sorry, I'm having trouble connecting to the server.";
    }
}
