import axios from "axios";

export const translateText = async (req, res) => {
  try {
    const { text, from = "en", to = "hi" } = req.body;
    
    console.log("Translation request:", { text, from, to });
    
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    if (to === "en") {
      return res.json({ translatedText: text });
    }

    // Google Translate API
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: "Translation API key not configured",
        translatedText: text 
      });
    }

    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2`,
      {
        q: text,
        source: from,
        target: to,
        format: "text"
      },
      {
        params: { key: apiKey },
        headers: { "Content-Type": "application/json" }
      }
    );

    const translatedText = response.data.data.translations[0].translatedText;
    
    console.log("Translation successful:", { original: text, translated: translatedText });
    
    res.json({ 
      success: true,
      translatedText,
      original: text,
      from,
      to 
    });
    
  } catch (error) {
    console.error("Translation error:", error.response?.data || error.message);
    
    // Fallback translation using a free service if Google fails
    try {
      const fallbackRes = await axios.post("https://libretranslate.de/translate", {
        q: req.body.text,
        source: req.body.from || "en",
        target: req.body.to || "hi",
        format: "text"
      });
      
      res.json({
        success: true,
        translatedText: fallbackRes.data.translatedText || req.body.text,
        fallback: true
      });
    } catch (fallbackError) {
      res.status(500).json({ 
        error: "Translation failed",
        translatedText: req.body.text,
        message: error.message 
      });
    }
  }
};