import { db } from "../config/db.js";

/* ===============================
   CREATE REGISTRATION OTP
=============================== */
export const createRegistrationOtp = async (email, otp, expiresAt) => {
  const query = `
    INSERT INTO registration_otp_verifications (email, otp, expires_at)
    VALUES ($1, $2, $3)
    RETURNING id;
  `;
  const { rows } = await db.query(query, [email, otp, expiresAt]);
  return rows[0];
};

/* ===============================
   FIND VALID REGISTRATION OTP
=============================== */
export const findValidRegistrationOtp = async (email, otp) => {
  const query = `
    SELECT *
    FROM registration_otp_verifications
    WHERE email = $1
      AND otp = $2
      AND verified = FALSE
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1;
  `;
  const { rows } = await db.query(query, [email, otp]);
  return rows[0];
};

/* ===============================
   MARK REGISTRATION OTP VERIFIED
=============================== */
export const markRegistrationOtpVerified = async (id) => {
  await db.query(
    `UPDATE registration_otp_verifications SET verified = TRUE WHERE id = $1`,
    [id]
  );
};

/* ===============================
   CLEANUP OTPs BY EMAIL
=============================== */
export const deleteRegistrationOtpsByEmail = async (email) => {
  await db.query(
    `DELETE FROM registration_otp_verifications WHERE email = $1`,
    [email]
  );
};
