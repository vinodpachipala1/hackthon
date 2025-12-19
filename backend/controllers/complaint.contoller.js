import {
  createComplaint,
  getComplaintById,
  getAllComplaints,
  updateComplaintStatus,
} from "../models/complaint.model.js";

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
    const { complaintId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedComplaint = await updateComplaintStatus(
      complaintId,
      status
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    return res.status(200).json({
      message: "Complaint status updated successfully",
      complaint: updatedComplaint,
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
