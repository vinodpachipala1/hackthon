import crypto from "crypto";
import {
  createOtp,
  findValidOtp,
  markOtpVerified,
  deleteOtpByComplaint,
} from "../models/otp.tracker.model.js";
import { getComplaintById } from "../models/complaint.model.js";
import { sendEmail } from "../config/mailer.js";

/* ===============================
   SEND OTP (TRACKING)
   POST /api/otp/tracking/send
=============================== */
export const sendTrackingOtp = async (req, res) => {
  try {
    const { complaintId, email } = req.body;

    if (!complaintId || !email) {
      return res.status(400).json({
        message: "complaintId and email required",
      });
    }

    const complaint = await getComplaintById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // 🔐 Email must match registered email
    if (complaint.email !== email) {
      return res.status(403).json({
        message: "Email does not match complaint",
      });
    }

    // 🧹 Cleanup old OTPs
    await deleteOtpByComplaint(complaintId);

    // 🔐 Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await createOtp(complaintId, otp, expiresAt);

    await sendEmail(
      complaint.email,
      "India Post Complaint Tracking OTP",
      `
        <p>Your OTP to track your complaint is <b>${otp}</b></p>
        <p>This OTP is valid for 5 minutes.</p>
      `
    );

    return res.json({ message: "Tracking OTP sent successfully" });
  } catch (error) {
    console.error("Send Tracking OTP Error:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

/* ===============================
   VERIFY OTP (TRACKING) 
   POST /api/otp/tracking/verify
=============================== */
export const verifyTrackingOtp = async (req, res) => {
  console.log("VERIFY TRACKING OTP");
  console.log("complaintId from request:", req.body.complaintId);

  try {
    const { complaintId, otp } = req.body;

    if (!complaintId || !otp) {
      return res.status(400).json({ message: "complaintId and otp required" });
    }

    const otpRecord = await findValidOtp(complaintId, otp);
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // ✅ Mark OTP as verified (for audit)
    await markOtpVerified(otpRecord.id);

    // 🧹 Cleanup OTP
    await deleteOtpByComplaint(complaintId);

    // ❌ DO NOT activate complaint
    // ❌ DO NOT run AI
    // ❌ DO NOT send registration email

    return res.json({
      message: "OTP verified successfully. Access granted.",
      complaintId,
    });
  } catch (error) {
    console.error("Verify Tracking OTP Error:", error);
    return res.status(500).json({ message: "OTP verification failed" });
  }
};