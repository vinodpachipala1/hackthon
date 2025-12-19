import { db } from "../config/db.js";

export const findOfficerByEmail = async (email) => {
  const { rows } = await db.query(
    "SELECT * FROM officers WHERE email = $1",
    [email]
  );
  return rows[0];
};

export const createOfficer = async (email, passwordHash, role = "OFFICER") => {
  const { rows } = await db.query(
    `INSERT INTO officers (email, password_hash, role)
     VALUES ($1, $2, $3)
     RETURNING id, email, role`,
    [email, passwordHash, role]
  );
  return rows[0];
};
