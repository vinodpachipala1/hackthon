import crypto from "crypto";
import {
  createOtp,
  findValidOtp,
  markOtpVerified,
  deleteOtpByComplaint,
} from "../models/otp.tracker.model.js";
import {
  activateComplaint,
  saveAiAnalysis,
  getComplaintById,
} from "../models/complaint.model.js";
import { sendEmail } from "../config/mailer.js";
import aiService from "../services/ai.service.js";

/* ===============================
   SEND OTP
   POST /api/otp/send
=============================== */
export const sendOtp = async (req, res) => {
  try {
    const { complaintId } = req.body;
    if (!complaintId) {
      return res.status(400).json({ message: "complaintId required" });
    }

    // 🔒 Fetch email from DB (DO NOT TRUST CLIENT)
    const complaint = await getComplaintById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await createOtp(complaintId, otp, expiresAt);

    await sendEmail(
      complaint.email,
      "India Post Complaint OTP Verification",
      `
        <p>Your OTP is <b>${otp}</b></p>
        <p>This OTP is valid for 5 minutes.</p>
      `
    );

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

/* ===============================
   VERIFY OTP
   POST /api/otp/verify
=============================== */
export const verifyOtp = async (req, res) => {
  try {
    const { complaintId, otp } = req.body;
    if (!complaintId || !otp) {
      return res
        .status(400)
        .json({ message: "complaintId and otp required" });
    }

    // 1️⃣ Validate OTP
    const otpRecord = await findValidOtp(complaintId, otp);
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // 2️⃣ Activate complaint
    await markOtpVerified(otpRecord.id);
    await activateComplaint(complaintId);

    // 3️⃣ Fetch complaint
    const complaint = await getComplaintById(complaintId);

    // 4️⃣ AI ANALYSIS (FAIL SAFE)
    let aiResult;
    try {
      aiResult = await aiService.analyzeComplaintWithAI({
        serviceType: complaint.service_type,
        complaintType: complaint.complaint_type,
        complaintText: complaint.complaint_text || "",
      });

      await saveAiAnalysis({
        complaint_id: complaintId,
        ai_category: aiResult.ai_category,
        department: aiResult.department,
        sentiment_score: aiResult.sentiment_score,
        priority_level: aiResult.priority_level,
        auto_response: aiResult.auto_response,
      });
    } catch (err) {
      console.error("AI Analysis Failed:", err.message);
      aiResult = {
        priority_level: "MEDIUM",
        auto_response:
          "Thank you for contacting India Post. Your complaint has been registered and will be reviewed by the concerned department.",
      };
    }

    // 5️⃣ SEND AUTOMATED RESPONSE EMAIL ✅
    await sendEmail(
      complaint.email,
      "India Post Complaint Registered Successfully",
      `
        <p>Dear Citizen,</p>

        <p>Your complaint has been successfully registered with <b>India Post</b>.</p>

        <p><b>Complaint ID:</b> ${complaintId}</p>
        <p><b>Priority:</b> ${aiResult.priority_level}</p>

        <p><b>Automated Response:</b></p>
        <p>${aiResult.auto_response}</p>

        <p>Our team will review your complaint and take appropriate action.</p>

        <p>Regards,<br/>
        India Post Grievance Redressal System</p>
      `
    );

    // 6️⃣ Cleanup OTP
    await deleteOtpByComplaint(complaintId);

    return res.json({
      message: "OTP verified successfully. Complaint activated.",
      complaintId,
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ message: "OTP verification failed" });
  }
};

/* ===============================
   RESEND OTP
   POST /api/otp/resend
=============================== */
export const resendOtp = async (req, res) => {
  try {
    const { complaintId } = req.body;

    if (!complaintId) {
      return res.status(400).json({ message: "complaintId required" });
    }

    // 1️⃣ Fetch complaint (email from DB)
    const complaint = await getComplaintById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // 2️⃣ Delete old OTPs (cleanup)
    await deleteOtpByComplaint(complaintId);

    // 3️⃣ Generate new OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await createOtp(complaintId, otp, expiresAt);

    // 4️⃣ Send email
    await sendEmail(
      complaint.email,
      "India Post Complaint OTP (Resent)",
      `
        <p>Your new OTP is <b>${otp}</b></p>
        <p>This OTP is valid for 5 minutes.</p>
      `
    );

    return res.json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    return res.status(500).json({ message: "Failed to resend OTP" });
  }
};