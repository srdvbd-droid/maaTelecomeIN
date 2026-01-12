
import { GoogleGenAI } from "@google/genai";

export const getDiagnosticSuggestion = async (issue: string, model: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `As a mobile repair expert for a shop called Maa Telecom, provide a concise diagnostic checklist and possible solution for the following mobile device issue.
      Device Model: ${model}
      Issue Description: ${issue}
      
      Keep it professional, bullet-pointed, and focused on hardware/software troubleshooting steps.`,
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI Diagnostic unavailable at the moment. Please proceed with manual inspection.";
  }
};
