import {
  createComplaint,
  getComplaintById,
  getAllComplaints,
  updateComplaintStatusById,
  resolveComplaintById,
} from "../models/complaint.model.js";
import { sendEmail } from "../config/mailer.js";

/* ===============================
   GENERATE COMPLAINT ID
=============================== */
const generateComplaintId = () => {
  return `IP-CMP-${Date.now().toString().slice(-6)}`;
};

/* =================================================
   REGISTER COMPLAINT
   POST /api/complaints
   Citizen → creates complaint ONLY
   OTP handled separately
================================================= */
export const registerComplaint = async (req, res) => {
  try {
    const {
      serviceType,
      complaintType,
      complaintText,
      email,
      trackingNumber,
      incidentDate,
      city,
      pincode,
    } = req.body;

    if (!serviceType || !complaintType || !email) {
      return res.status(400).json({
        message: "serviceType, complaintType and email are required",
      });
    }

    const complaintId = generateComplaintId();

    await createComplaint({
      complaint_id: complaintId,
      service_type: serviceType,
      complaint_type: complaintType,
      complaint_text: complaintText || null, // may be empty
      email,
      tracking_number: trackingNumber || null,
      incident_date: incidentDate || null,
      city: city || null,
      pincode: pincode || null,
    });

    return res.status(201).json({
      message: "Complaint registered. Please verify OTP sent to your email.",
      complaintId,
    });
  } catch (error) {
    console.error("Register Complaint Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* =================================================
   TRACK COMPLAINT
   GET /api/complaints/:complaintId
   Officer only
================================================= */
export const trackComplaint = async (req, res) => {
  try {
    const complaintId = req.params.id;
    console.log(complaintId);

    const complaint = await getComplaintById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    return res.status(200).json(complaint);
  } catch (error) {
    console.error("Track Complaint Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* =================================================
   GET ALL COMPLAINTS
   GET /api/complaints
   Officer dashboard
================================================= */
export const getComplaints = async (req, res) => {
  try {
    const complaints = await getAllComplaints();
    return res.status(200).json(complaints);
  } catch (error) {
    console.error("Get Complaints Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* =================================================
   UPDATE COMPLAINT STATUS
   PUT /api/complaints/:complaintId/status
   Officer only
================================================= */

export const changeComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const complaint = await updateComplaintStatusById(id, status);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    /* ===============================
       SEND EMAIL BASED ON STATUS
    =============================== */

    if (status === "IN_PROGRESS") {
      await sendEmail(
        complaint.email,
        "India Post: Complaint Under Investigation",
        `
        <p>Dear Citizen,</p>

        <p>Your complaint <b>${complaint.complaint_id}</b> is now under investigation.</p>

        <p>Our officer has started reviewing the issue and you will receive further updates.</p>

        <p>Status: <b>In Progress</b></p>

        <p>Regards,<br/>
        India Post Grievance Redressal Team</p>
        `
      );
    }

    if (status === "RESOLVED") {
      await sendEmail(
        complaint.email,
        "India Post: Complaint Resolved",
        `
        <p>Dear Citizen,</p>

        <p>Your complaint <b>${complaint.complaint_id}</b> has been resolved.</p>

        <p><b>Resolution:</b></p>
        <p>${complaint.auto_response || "Thank you for contacting India Post."}</p>

        <p>If you need further assistance, feel free to contact us.</p>

        <p>Regards,<br/>
        India Post Grievance Redressal Team</p>
        `
      );
    }

    return res.json(complaint);
  } catch (err) {
    console.error("Update Status Error:", err);
    return res.status(500).json({ message: "Failed to update status" });
  }
};


export const resolveComplaint = async (req, res) => {
  console.log(req.params)
  try {
    const { id } = req.params;
    const { final_response } = req.body;

    if (!final_response || final_response.trim().length < 10) {
      return res.status(400).json({
        message: "Final response is required before approval",
      });
    }

    // 1️⃣ Update DB FIRST (single source of truth)
    const complaint = await resolveComplaintById(
      id,
      final_response
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // 2️⃣ Send email AFTER approval (async, non-blocking)
    sendEmail(
      complaint.email,
      complaint.complaint_id,
      final_response
    ).catch(err => console.error("Email error:", err));

    // 3️⃣ Respond to frontend
    res.json(complaint);
  } catch (err) {
    console.error("Resolve complaint failed:", err);
    res.status(500).json({ message: "Failed to resolve complaint" });
  }
};
