import { useState, useRef, useEffect } from "react";
import Base_url from "../components/Base_url";
import { translate } from "../utils/translate";
import axios from "axios";

const CHAT_STATE = {
  LANGUAGE: "LANGUAGE",
  MENU: "MENU",
  CREATE_SERVICE: "CREATE_SERVICE",
  CREATE_TYPE: "CREATE_TYPE",
  CREATE_TEXT: "CREATE_TEXT",
  CREATE_DATE: "CREATE_DATE",
  CREATE_CITY: "CREATE_CITY",
  CREATE_PINCODE: "CREATE_PINCODE",
  CREATE_TRACKING: "CREATE_TRACKING",
  CREATE_EMAIL: "CREATE_EMAIL",
  CREATE_CONFIRM: "CREATE_CONFIRM",
  TRACK: "TRACK",
  TRACK_ID: "TRACK_ID",
  TRACK_EMAIL: "TRACK_EMAIL",
  TRACK_OTP: "TRACK_OTP",
  CREATE_SEND_OTP: "CREATE_SEND_OTP",
  CREATE_OTP: "CREATE_OTP",
  CREATE_SUCCESS: "CREATE_SUCCESS",
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatState, setChatState] = useState(CHAT_STATE.LANGUAGE);
  const [language, setLanguage] = useState("en");
  const [input, setInput] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const [complaintData, setComplaintData] = useState({
    service_type: "",
    complaint_type: "",
    complaint_text: "",
    incident_date: "",
    city: "",
    pincode: "",
    tracking_number: "",
    email: "",
  });

  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Welcome to India Post Support", key: 1 },
    {
      from: "bot",
      text: "Please select your language:",
      options: [
        { label: "English", value: "en" },
        { label: "हिन्दी", value: "hi" },
        { label: "తెలుగు", value: "te" },
        { label: "தமிழ்", value: "ta" },
        { label: "മലയാളം", value: "ml" },
        { label: "ಕನ್ನಡ", value: "kn" },
      ],
      key: 2,
    },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Enhanced translation function
  const translateMessage = async (text) => {
    if (language === "en" || !text.trim()) return text;
    
    setIsTranslating(true);
    try {
      const result = await translate(text, language);
      return result;
    } catch (error) {
      console.error("Translation error in component:", error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  };

  const addBotMessage = async (text, options = null) => {
    const messageKey = Date.now();
    
    // Add English message first for immediate display
    setMessages((prev) => [
      ...prev,
      { 
        from: "bot", 
        text: text, // Show English first
        options: options ? [...options] : null,
        key: messageKey,
        translated: false
      },
    ]);

    // Translate if needed (async)
    if (language !== "en") {
      try {
        const translatedText = await translateMessage(text);
        
        // Update the message with translation
        setMessages((prev) =>
          prev.map((msg) =>
            msg.key === messageKey
              ? { ...msg, text: translatedText, translated: true }
              : msg
          )
        );
      } catch (error) {
        console.error("Failed to translate bot message:", error);
      }
    }
  };

  const addUserMessage = async (text) => {
    const userText = language === "en" ? text : await translateMessage(text);
    setMessages((prev) => [...prev, { from: "user", text: userText, key: Date.now() }]);
  };

  const handleOptionClick = async (option) => {
    await addUserMessage(option.label);

    switch (chatState) {
      case CHAT_STATE.LANGUAGE:
        setLanguage(option.value);
        setChatState(CHAT_STATE.MENU);
        await addBotMessage("What would you like to do?", [
          { label: "📄 Create Complaint", value: "CREATE" },
          { label: "🔍 Track Complaint", value: "TRACK" },
        ]);
        break;

      case CHAT_STATE.MENU:
        if (option.value === "CREATE") {
          startCreateFlow();
        } else if (option.value === "TRACK") {
          setChatState(CHAT_STATE.TRACK_ID);
          await addBotMessage("🔍 Please enter your Complaint ID:");
        }
        break;

      case CHAT_STATE.CREATE_SERVICE:
        setComplaintData((p) => ({ ...p, service_type: option.value }));
        setChatState(CHAT_STATE.CREATE_TYPE);
        await addBotMessage("Select issue type:", [
          { label: "Delay in delivery", value: "Delay in delivery" },
          { label: "Lost / Non-delivery", value: "Lost / Non-delivery" },
          { label: "Wrong delivery", value: "Wrong delivery" },
          { label: "Staff behavior", value: "Staff behavior" },
          { label: "Refund / Payment issue", value: "Refund / Payment issue" },
          { label: "Other", value: "Other" },
        ]);
        break;

      case CHAT_STATE.CREATE_TYPE:
        setComplaintData((p) => ({ ...p, complaint_type: option.value }));
        setChatState(CHAT_STATE.CREATE_TEXT);
        await addBotMessage("📝 Please describe your complaint in detail:");
        break;

      case CHAT_STATE.CREATE_CONFIRM:
        if (option.value === "CONFIRM") {
          sendCreateOtp();
        } else {
          resetChat();
        }
        break;

      case CHAT_STATE.TRACK:
      case CHAT_STATE.TRACK_OTP:
        if (option.value === "MENU") {
          setChatState(CHAT_STATE.MENU);
          await addBotMessage("What would you like to do?", [
            { label: "📄 Create Complaint", value: "CREATE" },
            { label: "🔍 Track Complaint", value: "TRACK" },
          ]);
        }
        break;

      default:
        console.warn("Unhandled option click in state:", chatState);
        break;
    }
  };

  const handleUserInput = async () => {
    if (!input.trim()) return;
    
    const userInput = input;
    setInput("");
    await addUserMessage(userInput);

    switch (chatState) {
      case CHAT_STATE.CREATE_TEXT:
        const englishText = language === "en" ? userInput : await translate(userInput, "en");
        setComplaintData((p) => ({
          ...p,
          complaint_text: englishText,
        }));
        setChatState(CHAT_STATE.CREATE_DATE);
        await addBotMessage("📅 Incident date (YYYY-MM-DD):");
        break;

      case CHAT_STATE.CREATE_DATE:
        saveAndAsk(
          "incident_date",
          CHAT_STATE.CREATE_CITY,
          "🏙️ Enter your city:"
        );
        break;

      case CHAT_STATE.CREATE_CITY:
        saveAndAsk("city", CHAT_STATE.CREATE_PINCODE, "📮 Enter pincode:");
        break;

      case CHAT_STATE.CREATE_PINCODE:
        saveAndAsk(
          "pincode",
          CHAT_STATE.CREATE_TRACKING,
          "📦 Tracking number (or NA):"
        );
        break;

      case CHAT_STATE.TRACK_ID:
        setComplaintData((p) => ({
          ...p,
          complaint_id: userInput,
        }));
        setChatState(CHAT_STATE.TRACK_EMAIL);
        await addBotMessage("📧 Enter your registered email:");
        break;

      case CHAT_STATE.CREATE_OTP:
        verifyCreateOtp(userInput);
        break;

      case CHAT_STATE.TRACK_EMAIL:
        setComplaintData((p) => ({ ...p, email: userInput }));
        sendTrackingOtp(userInput, complaintData.complaint_id);
        setChatState(CHAT_STATE.TRACK_OTP);
        await addBotMessage("🔐 OTP sent to your email. Please enter the OTP:");
        break;

      case CHAT_STATE.TRACK_OTP:
        verifyTrackingOtp(userInput);
        break;

      case CHAT_STATE.CREATE_TRACKING:
        saveAndAsk(
          "tracking_number",
          CHAT_STATE.CREATE_EMAIL,
          "📧 Enter your email:"
        );
        break;

      case CHAT_STATE.CREATE_EMAIL:
        setComplaintData((p) => ({ ...p, email: userInput }));
        setChatState(CHAT_STATE.CREATE_CONFIRM);
        await showConfirmation();
        break;

      default:
        console.warn("Unhandled input in state:", chatState);
        break;
    }
  };

  const saveAndAsk = async (key, nextState, question) => {
    setComplaintData((p) => ({ ...p, [key]: input }));
    setChatState(nextState);
    await addBotMessage(question);
  };

  const startCreateFlow = async () => {
    setComplaintData({
      service_type: "",
      complaint_type: "",
      complaint_text: "",
      incident_date: "",
      city: "",
      pincode: "",
      tracking_number: "",
      email: "",
    });

    setChatState(CHAT_STATE.CREATE_SERVICE);
    await addBotMessage("Select service type:", [
      { label: "Speed Post", value: "Speed Post" },
      { label: "Registered Post", value: "Registered Post" },
      { label: "Parcel", value: "Parcel" },
      { label: "Money Order", value: "Money Order" },
      { label: "Other", value: "Other" },
    ]);
  };

  const showConfirmation = async () => {
    const confirmationText = `✅ Please confirm your complaint:\n\n` +
      `Service: ${complaintData.service_type}\n` +
      `Issue: ${complaintData.complaint_type}\n` +
      `City: ${complaintData.city}\n` +
      `Email: ${complaintData.email}\n\n` +
      `Is this correct?`;
    
    await addBotMessage(confirmationText, [
      { label: "✅ Confirm & Send OTP", value: "CONFIRM" },
      { label: "❌ Cancel", value: "CANCEL" },
    ]);
  };

  const resetChat = async () => {
    setMessages(messages.slice(0, 2));
    setChatState(CHAT_STATE.MENU);
    await addBotMessage("What would you like to do?", [
      { label: "📄 Create Complaint", value: "CREATE" },
      { label: "🔍 Track Complaint", value: "TRACK" },
    ]);
  };

  const sendCreateOtp = async () => {
    try {
      await addBotMessage("📨 Sending OTP to your email...");

      const response = await fetch(`${Base_url}/registration/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: complaintData.email,
        }),
      });

      if (!response.ok) throw new Error("Failed to send OTP");

      setChatState(CHAT_STATE.CREATE_OTP);
      await addBotMessage("🔐 Please enter the 6-digit OTP sent to your email:");
    } catch (err) {
      await addBotMessage("❌ Failed to send OTP. Please try again.");
      setChatState(CHAT_STATE.MENU);
    }
  };

  const sendTrackingOtp = async (email, complaintId) => {
    try {
      const response = await fetch(`${Base_url}/otp/tracking/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, complaintId }),
      });

      if (!response.ok) {
        throw new Error("Failed to send tracking OTP");
      }
    } catch (err) {
      console.error("Send tracking OTP error:", err);
      await addBotMessage("❌ Failed to send OTP. Please try again.");
    }
  };

  const verifyTrackingOtp = async (otp) => {
    try {
      const verifyRes = await fetch(`${Base_url}/otp/tracking/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: complaintData.email,
          complaintId: complaintData.complaint_id,
          otp,
        }),
      });

      if (!verifyRes.ok) throw new Error("OTP verification failed");

      const complaintRes = await fetch(
        `${Base_url}/complaints/${complaintData.complaint_id}`
      );

      if (!complaintRes.ok) throw new Error("Complaint not found");

      const complaint = await complaintRes.json();
      await showTrackingResult(complaint);
    } catch (err) {
      await addBotMessage("❌ Invalid OTP or complaint not found.");
    }
  };

  const verifyCreateOtp = async (otp) => {
    try {
      await addBotMessage("⏳ Verifying OTP and registering complaint...");

      const res = await fetch(`${Base_url}/registration/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: complaintData.email,
          otp,
          complaintData: {
            service_type: complaintData.service_type,
            complaint_type: complaintData.complaint_type,
            complaint_text: complaintData.complaint_text,
            tracking_number: complaintData.tracking_number,
            incident_date: complaintData.incident_date,
            city: complaintData.city,
            pincode: complaintData.pincode,
          },
        }),
      });

      if (!res.ok) throw new Error("OTP verification failed");

      const data = await res.json();
      await showCreateSuccess(data.complaintId);
    } catch (err) {
      await addBotMessage("❌ Invalid OTP. Please try again.");
    }
  };

  const showTrackingResult = async (complaint) => {
    const trackingText = `📄 Complaint Details\n\n` +
      `🆔 ID: ${complaint.complaint_id}\n` +
      `📌 Status: ${complaint.status}\n` +
      `📦 Service: ${complaint.service_type}\n` +
      `🗂️ Category: ${complaint.complaint_type}\n` +
      `⚠️ Priority: ${complaint.priority_level}\n\n` +
      `📬 Latest Update:\n` +
      `${complaint.auto_response || "Under processing"}`;
    
    await addBotMessage(trackingText, [
      { label: "🏠 Back to Menu", value: "MENU" }
    ]);

    setChatState(CHAT_STATE.MENU);
  };

  const showCreateSuccess = async (complaintId) => {
    const successText = `🎉 Complaint Registered Successfully!\n\n` +
      `🆔 Complaint ID: ${complaintId}\n\n` +
      `📧 A confirmation email has been sent.\n` +
      `You can track your complaint anytime using this ID.`;
    
    await addBotMessage(successText, [
      { label: "🔍 Track Complaint", value: "TRACK" },
      { label: "🏠 Main Menu", value: "MENU" },
    ]);

    setChatState(CHAT_STATE.MENU);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-red-600 text-white text-xl shadow-xl hover:bg-red-700 transition-colors z-50 flex items-center justify-center"
        aria-label="Open chat"
      >
        💬
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[400px] max-w-[90vw] bg-white rounded-xl shadow-2xl flex flex-col border border-red-200 z-50">
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 flex justify-between items-center rounded-t-xl">
            <div className="flex items-center gap-2">
              <span className="font-bold">India Post Assistant</span>
              {language !== "en" && (
                <span className="text-xs bg-white text-red-600 px-2 py-1 rounded-full">
                  {language.toUpperCase()}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center hover:bg-red-800 rounded-full transition-colors"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-red-50 to-white space-y-4 max-h-[500px] min-h-[300px]">
            {messages.map((m) => (
              <div key={m.key} className="animate-fadeIn">
                <div
                  className={`flex ${m.from === "bot" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl max-w-[85%] ${m.from === "bot"
                        ? "bg-white border border-red-100 shadow-sm text-gray-800"
                        : "bg-gradient-to-r from-red-500 to-red-600 text-white"
                      }`}
                  >
                    <div className="whitespace-pre-line">{m.text}</div>
                    {m.from === "bot" && isTranslating && !m.translated && (
                      <div className="text-xs text-gray-500 mt-1">
                        Translating...
                      </div>
                    )}
                  </div>
                </div>

                {m.options && (
                  <div className="flex flex-wrap gap-2 mt-3 ml-1">
                    {m.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleOptionClick(opt)}
                        className="px-4 py-2 bg-white border border-red-200 text-red-700 rounded-full text-sm hover:bg-red-50 hover:border-red-300 transition-all duration-200 font-medium shadow-sm"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-red-100 p-4 bg-white rounded-b-xl">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUserInput()}
                placeholder={language === "en" 
                  ? "Type your message..." 
                  : "अपना संदेश टाइप करें..."}
                className="flex-1 border border-red-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={isTranslating}
              />
              <button
                onClick={handleUserInput}
                disabled={!input.trim() || isTranslating}
                className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                →
              </button>
            </div>
            {isTranslating && (
              <div className="text-xs text-gray-500 text-center mt-2">
                Translating messages...
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;