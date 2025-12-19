import { db } from "../config/db.js";

/* ===============================
   CREATE OTP (one per complaint)
=============================== */
export const createOtp = async (complaintId, otp, expiresAt) => {
  const query = `
    INSERT INTO otp_verifications (
      complaint_id,
      otp,
      expires_at
    )
    VALUES ($1, $2, $3)
    RETURNING id;
  `;

  const { rows } = await db.query(query, [complaintId, otp, expiresAt]);
  return rows[0];
};

/* ===============================
   FIND VALID OTP
=============================== */
export const findValidOtp = async (complaintId, otp) => {
  const query = `
    SELECT *
    FROM otp_verifications
    WHERE complaint_id = $1
      AND otp = $2
      AND verified = FALSE
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1;
  `;

  const { rows } = await db.query(query, [complaintId, otp]);
  return rows[0];
};

/* ===============================
   MARK OTP VERIFIED
=============================== */
export const markOtpVerified = async (otpId) => {
  await db.query(
    `UPDATE otp_verifications SET verified = TRUE WHERE id = $1`,
    [otpId]
  );
};

/* ===============================
   CLEANUP OTP
=============================== */
export const deleteOtpByComplaint = async (complaintId) => {
  await db.query(
    `DELETE FROM otp_verifications WHERE complaint_id = $1`,
    [complaintId]
  );
};
