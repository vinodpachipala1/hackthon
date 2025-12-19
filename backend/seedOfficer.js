import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { db } from "./config/db.js";

dotenv.config();

const seedOfficer = async () => {
  try {
    const email = "demo@post.gov";
    const plainPassword = "demo123";
    const role = "OFFICER";

    // Hash password
    const password_hash = await bcrypt.hash(plainPassword, 10);

    // Insert officer
    await db.query(
      `
      INSERT INTO officers (email, password_hash, role)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO NOTHING
      `,
      [email, password_hash, role]
    );

    console.log("✅ Officer seeded successfully");
    console.log("📧 Email:", email);
    console.log("🔑 Password:", plainPassword);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding officer:", err);
    process.exit(1);
  }
};

seedOfficer();
