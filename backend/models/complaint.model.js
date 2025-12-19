import { db } from "../config/db.js";

/* ===============================
   CREATE COMPLAINT
   (Before OTP verification)
=============================== */
export const createComplaint = async (data) => {
  const query = `
    INSERT INTO complaints (
      complaint_id,
      service_type,
      complaint_type,
      complaint_text,
      email,
      tracking_number,
      incident_date,
      city,
      pincode,
      status
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,'PENDING_EMAIL_VERIFICATION'
    )
    RETURNING *;
  `;

  const values = [
    data.complaint_id,
    data.service_type,
    data.complaint_type,
    data.complaint_text || null, // complaint text may be empty
    data.email,
    data.tracking_number || null,
    data.incident_date || null,
    data.city || null,
    data.pincode || null
  ];

  const { rows } = await db.query(query, values);
  return rows[0];
};

/* ===============================
   ACTIVATE COMPLAINT (AFTER OTP)
=============================== */
export const activateComplaint = async (complaintId) => {
  const query = `
    UPDATE complaints
    SET
      email_verified = TRUE,
      status = 'ACTIVE',
      verified_at = NOW()
    WHERE complaint_id = $1
    RETURNING *;
  `;

  const { rows } = await db.query(query, [complaintId]);
  return rows[0];
};

/* ===============================
   SAVE AI ANALYSIS (Gemini)
=============================== */
export const saveAiAnalysis = async ({
  complaint_id,
  ai_category,
  department,
  sentiment_score,
  priority_level,
  auto_response
}) => {
  const query = `
    UPDATE complaints
    SET
      ai_category = $1,
      department = $2,
      sentiment_score = $3,
      priority_level = $4,
      auto_response = $5
    WHERE complaint_id = $6
    RETURNING *;
  `;

  const values = [
    ai_category || null,
    department || null,
    sentiment_score || null,
    priority_level || 'MEDIUM',
    auto_response || null,
    complaint_id
  ];

  const { rows } = await db.query(query, values);
  return rows[0];
};

/* ===============================
   FETCH ALL COMPLAINTS (OFFICER)
=============================== */
export const getAllComplaints = async () => {
  const query = `
    SELECT *
    FROM complaints
    WHERE status != 'PENDING_EMAIL_VERIFICATION'
    ORDER BY
      CASE priority_level
        WHEN 'CRITICAL' THEN 1
        WHEN 'HIGH' THEN 2
        WHEN 'MEDIUM' THEN 3
        ELSE 4
      END,
      created_at DESC;
  `;
  const { rows } = await db.query(query);
  return rows;
};

/* ===============================
   FETCH SINGLE COMPLAINT
=============================== */
export const getComplaintById = async (complaintId) => {
  const query = `
    SELECT *
    FROM complaints
    WHERE complaint_id = $1;
  `;
  const { rows } = await db.query(query, [complaintId]);
  return rows[0];
};

/* ===============================
   UPDATE STATUS (OFFICER)
=============================== */
export const updateComplaintStatusById = async (complaintId, status) => {
  console.log(complaintId, status);

  const query = `
    UPDATE complaints
    SET
      status = $1::VARCHAR,
      resolved_at = CASE
        WHEN $1::VARCHAR = 'RESOLVED' THEN NOW()
        ELSE NULL
      END
    WHERE complaint_id = $2
    RETURNING *;
  `;

  const { rows } = await db.query(query, [status, complaintId]);
  return rows[0];
};
