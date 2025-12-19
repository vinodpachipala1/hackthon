import express from "express";
import {
  sendTrackingOtp,
  verifyTrackingOtp,
} from "../controllers/otp.tracking.controller.js";

const router = express.Router();

/* ===============================
   TRACKING OTP ROUTES
=============================== */

// Send OTP for tracking
router.post("/tracking/send", sendTrackingOtp);

// Verify OTP for tracking
router.post("/tracking/verify", verifyTrackingOtp);

export default router;
