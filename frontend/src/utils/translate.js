import axios from "axios";

// Cache translations to reduce API calls
const translationCache = {};

export const translate = async (text, targetLang) => {
  // Return original text if target is English or no text
  if (!text || targetLang === "en") {
    return text;
  }

  // Check cache first
  const cacheKey = `${text}-${targetLang}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    console.log(`Translating: "${text.substring(0, 50)}..." to ${targetLang}`);

    // Use your backend API
    const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/translate`, {
      text,
      to: targetLang,
      from: "en"
    }, {
      timeout: 5000, // 5 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      const translatedText = response.data.translatedText;
      
      // Cache the result
      translationCache[cacheKey] = translatedText;
      
      return translatedText;
    } else {
      console.warn("Translation API returned error:", response.data);
      return text;
    }
  } catch (error) {
    console.error("Translation error:", error);

    // Fallback to a free translation service if your API fails
    if (error.response?.status === 404 || error.code === 'ECONNREFUSED') {
      try {
        console.log("Trying fallback translation service...");
        
        // Using LibreTranslate (free public instance)
        const fallbackResponse = await axios.post(
          "https://libretranslate.de/translate",
          {
            q: text,
            source: "en",
            target: targetLang,
            format: "text"
          },
          {
            timeout: 3000,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        const translatedText = fallbackResponse.data.translatedText;
        translationCache[cacheKey] = translatedText;
        return translatedText;
      } catch (fallbackError) {
        console.error("Fallback translation also failed:", fallbackError);
      }
    }

    // Return original text as last resort
    return text;
  }
};

// Clear cache function (optional)
export const clearTranslationCache = () => {
  Object.keys(translationCache).forEach(key => {
    delete translationCache[key];
  });
};