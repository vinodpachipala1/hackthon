import crypto from "crypto";
import {
  findValidRegistrationOtp,
  markRegistrationOtpVerified,
  deleteRegistrationOtpsByEmail,
  createRegistrationOtp,
} from "../models/otp.registration.model.js";
import { saveAiAnalysis } from "../models/complaint.model.js";

import {
  createComplaint,
  activateComplaint,
} from "../models/complaint.model.js";

import aiService from "../services/ai.service.js";
import { sendEmail } from "../config/mailer.js";

const generateComplaintId = () => {
  return `IP-CMP-${Date.now().toString().slice(-6)}`;
};

export const sendRegistrationOtp = async (req, res) => {
  console.log(req.body);
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "email required" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await createRegistrationOtp(email, otp, expiresAt);

    await sendEmail(
      email,
      "India Post Complaint Registration OTP",
      `
        <p>Your OTP is <b>${otp}</b></p>
        <p>This OTP is valid for 5 minutes.</p>
      `
    );

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

/* =================================================
   VERIFY REGISTRATION OTP + CREATE COMPLAINT
   POST /api/registration/verify-otp
================================================= */
export const verifyRegistrationOtpAndCreateComplaint = async (req, res) => {
  try {
    const { email, otp, complaintData } = req.body;

    const otpRecord = await findValidRegistrationOtp(email, otp);
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await markRegistrationOtpVerified(otpRecord.id);

    const complaintId = generateComplaintId();

    const complaint = await createComplaint({
      complaint_id: complaintId,
      service_type: complaintData.service_type,
      complaint_type: complaintData.complaint_type,
      complaint_text: complaintData.complaint_text || null,
      email,
      tracking_number: complaintData.tracking_number || null,
      incident_date: complaintData.incident_date || null,
      city: complaintData.city || null,
      pincode: complaintData.pincode || null,
    });

    await activateComplaint(complaintId);

    const ai = await aiService.analyzeComplaintWithAI({
      serviceType: complaint.service_type,
      complaintType: complaint.complaint_type,
      complaintText: complaint.complaint_text || "",
    });

    // ✅ STORE AI DATA (YOU MISSED THIS)
    await saveAiAnalysis({
      complaint_id: complaintId,
      ai_category: ai.ai_category,
      department: ai.department,
      sentiment_score: ai.sentiment_score,
      priority_level: ai.priority_level,
      auto_response: ai.auto_response,
    });

    await sendEmail(
      email,
      `Complaint Acknowledgement - Ticket #${complaintId}`, // Formal Subject Line
      `
  <div style="font-family: Arial, sans-serif; max-width: 600px; color: #333;">
    <h2 style="color: #d32f2f; border-bottom: 2px solid #d32f2f; padding-bottom: 10px;">
      India Post Grievance Redressal
    </h2>
    
    <p>Dear Customer,</p>
    
    <p>This is to acknowledge that your complaint has been officially registered with the Department of Posts.</p>
    
    <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #d32f2f; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Complaint ID:</strong> ${complaintId}</p>
      <p style="margin: 5px 0;"><strong>Assigned Department:</strong> ${ai.department}</p>
    </div>

    <p><strong>Preliminary Assessment:</strong></p>
    <p style="font-style: italic; color: #555;">
      "${ai.auto_response}"
    </p>

    <p>Your issue has been forwarded to the concerned department for immediate action. You will receive further updates shortly.</p>
    
    <br>
    <p>Regards,</p>
    <p><strong>Customer Care Division</strong><br>India Post</p>
    
    <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;">
    <p style="font-size: 12px; color: #888;">
      This is an automated message. Please do not reply to this email.<br>
      Department of Posts, Ministry of Communications, Government of India.
    </p>
  </div>
  `
    );

    await deleteRegistrationOtpsByEmail(email);

    return res.json({
      message: "Complaint registered successfully",
      complaintId,
    });
  } catch (err) {
    console.error("Registration OTP Verify Error:", err);
    return res.status(500).json({ message: "Registration failed" });
  }
};
