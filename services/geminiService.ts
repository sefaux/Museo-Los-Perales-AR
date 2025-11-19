import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_SYSTEM_INSTRUCTION, MUSEUM_ARTIFACTS } from '../constants';
import { ScanResult } from '../types';

// Initialize Gemini API
// CRITICAL: API Key must be in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const identifyArtifact = async (base64Image: string): Promise<ScanResult> => {
  try {
    // Clean the base64 string if it has the header
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|webp);base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: `Analiza esta imagen. ¿Contiene alguno de estos objetos: ${MUSEUM_ARTIFACTS.map(a => `${a.name} (${a.description})`).join(', ')}?`
          }
        ]
      },
      config: {
        systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            found: { type: Type.BOOLEAN },
            artifactId: { type: Type.STRING, description: "El ID del objeto encontrado si found es true, o null si found es false." },
            confidence: { type: Type.NUMBER, description: "Nivel de confianza de 0 a 1" }
          },
          required: ['found', 'confidence']
        }
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response from Gemini");
    }

    const result = JSON.parse(text) as ScanResult;
    
    // Validate if the ID actually exists in our DB
    if (result.found && result.artifactId) {
        const exists = MUSEUM_ARTIFACTS.some(a => a.id === result.artifactId);
        if (!exists) {
            return { found: false, confidence: 0 };
        }
    }

    return result;

  } catch (error) {
    console.error("Error identifying artifact:", error);
    return { found: false, confidence: 0 };
  }
};