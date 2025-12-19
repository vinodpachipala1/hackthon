import express from "express";
import {
  registerComplaint,
  trackComplaint,
  getComplaints,
  changeComplaintStatus,
} from "../controllers/complaint.contoller.js";

const router = express.Router();

// Register complaint
router.post("/", registerComplaint);

// Track complaint by ID
router.get("/:id", trackComplaint);

// Officer dashboard - get all complaints
router.get("/", getComplaints);

// Update complaint status
router.patch("/:id/status", changeComplaintStatus);

export default router;
