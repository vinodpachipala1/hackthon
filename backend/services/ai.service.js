import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;

    console.log("AIService initialized");
    console.log("GEMINI_API_KEY present:", !!this.apiKey);

    if (this.apiKey) {
      this.ai = new GoogleGenAI(this.apiKey);
    } else {
      this.ai = null;
    }
  }

  async analyzeComplaintWithAI({
    serviceType,
    complaintType,
    complaintText,
  }) {
    try {
      console.log("AI analyzeComplaintWithAI called");
      console.log("this.ai =", this.ai);

      if (!this.ai) {
        throw new Error("Gemini API key not configured");
      }

      const prompt = `
You are an AI system assisting India Post in analyzing citizen complaints.

SERVICE TYPE:
${serviceType}

COMPLAINT TYPE:
${complaintType}

COMPLAINT DESCRIPTION:
"${complaintText || "No description provided"}"

Respond ONLY with a valid JSON object in this exact format.
Do not add explanations, markdown, or extra text.

{
  "ai_category": "",
  "department": "",
  "sentiment_score": 0,
  "priority_level": "LOW | MEDIUM | HIGH | CRITICAL",
  "auto_response": ""
}
`;

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 500,
          responseMimeType: "application/json",
        },
      });

      const rawText = response.text;
      if (!rawText) {
        throw new Error("Empty response from Gemini");
      }

      // Clean & parse JSON
      let cleanText = rawText.trim();
      if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/```json|```/g, "").trim();
      }

      const parsed = JSON.parse(cleanText);

      return {
        ai_category: parsed.ai_category || "General Complaint",
        department: parsed.department || serviceType || "India Post",
        sentiment_score: Number(parsed.sentiment_score) || 0,
        priority_level: parsed.priority_level || "MEDIUM",
        auto_response:
          parsed.auto_response ||
          "Thank you for contacting India Post. Your complaint has been registered and will be reviewed by the concerned department.",
      };
    } catch (error) {
      console.error("AI Analysis Error:", error.message);

      // 🔒 HARD FAIL-SAFE (DO NOT BREAK OTP FLOW)
      return {
        ai_category: "General Complaint",
        department: serviceType || "India Post",
        sentiment_score: 0,
        priority_level: "MEDIUM",
        auto_response:
          "Thank you for contacting India Post. Your complaint has been registered and will be reviewed by the concerned department.",
      };
    }
  }
}

// ✅ EXPORT SINGLETON (THIS FIXES YOUR CRASH)
export default new AIService();
