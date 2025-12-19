import express from "express";
import {
  sendRegistrationOtp,
  verifyRegistrationOtpAndCreateComplaint,
} from "../controllers/registration.controller.js";

const router = express.Router();

/* =========================================
   REGISTRATION OTP ROUTES
   Base: /api/registration
========================================= */

/**
 * STEP 1: Send OTP to email
 * POST /api/registration/send-otp
 * Body: { email }
 */
router.post("/send", sendRegistrationOtp);

/**
 * STEP 2: Verify OTP + Create Complaint
 * POST /api/registration/verify-otp
 * Body: {
 *   email,
 *   otp,
 *   complaintData: {
 *     service_type,
 *     complaint_type,
 *     complaint_text,
 *     incident_date,
 *     city,
 *     pincode,
 *     tracking_number
 *   }
 * }
 */
router.post(
  "/verify",
  verifyRegistrationOtpAndCreateComplaint
);

export default router;
