import express from "express";
import {
  registerComplaint,
  trackComplaint,
  getComplaints,
  changeComplaintStatus,
  resolveComplaint,   // 👈 ADD THIS
} from "../controllers/complaint.contoller.js";

const router = express.Router();

// Register complaint
router.post("/", registerComplaint);

// Track complaint by ID (public / OTP verified)
router.get("/:id", trackComplaint);

// Officer dashboard - get all complaints
router.get("/", getComplaints);

// Update complaint status (ACTIVE → IN_PROGRESS)
router.patch("/:id/status", changeComplaintStatus);

// ✅ FINAL APPROVAL: send mail + resolve complaint
router.post("/:id/resolve", resolveComplaint);

export default router;
