import { GoogleGenAI } from "@google/genai";
import { VestDimensions, Gauge } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeVestSketch(imageBuffer: ArrayBuffer, mimeType: string): Promise<{ dimensions: VestDimensions, gauge: Gauge } | null> {
  try {
    const prompt = `
      Analyze this hand-drawn knitting pattern for a vest (gilet). 
      Extract technical dimensions and gauge information.
      
      Look for:
      - "Ferri" (Needles size)
      - "10cm = X punti" (Stitches per 10cm)
      - "10cm = Y giri" (Rows per 10cm)
      - Height measurements (Total, hem, body, armhole)
      - Width measurements (Bottom, bust, shoulders, neck)
      
      Return results ONLY as a JSON object with this exact structure:
      {
        "dimensions": {
          "totalHeight": number,
          "bottomWidth": number,
          "bustWidth": number,
          "armholeHeight": number,
          "bodyHeight": number,
          "hemHeight": number,
          "shoulderWidth": number,
          "neckWidth": number,
          "placketWidth": number
        },
        "gauge": {
          "stitchesPer10cm": number,
          "rowsPer10cm": number
        }
      }
      If a value is not found, use logical defaults.
    `;

    const base64Data = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(",")[1];
        resolve(base64);
      };
      reader.readAsDataURL(new Blob([imageBuffer]));
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { data: base64Data, mimeType } }
        ]
      }
    });

    const text = response.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error("Analysis failed:", error);
    return null;
  }
}
