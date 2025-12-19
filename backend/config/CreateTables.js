import { db } from "./db.js";

export const CreateTables = async () => {
  try {
    await db.query(`
    /* =========================
       COMPLAINTS TABLE
       ========================= */
    CREATE TABLE IF NOT EXISTS complaints (
      id SERIAL PRIMARY KEY,
      complaint_id VARCHAR(30) UNIQUE NOT NULL,

      service_type VARCHAR(50) NOT NULL,
      complaint_type VARCHAR(100) NOT NULL,
      complaint_text TEXT,

      email VARCHAR(255) NOT NULL,
      email_verified BOOLEAN DEFAULT FALSE,

      tracking_number VARCHAR(50),
      incident_date DATE,
      city VARCHAR(100),
      pincode VARCHAR(10),

      /* ---- AI GENERATED FIELDS ---- */
      ai_category VARCHAR(100),
      department VARCHAR(100),
      sentiment_score NUMERIC(4,2),
      priority_level VARCHAR(20)
        CHECK (priority_level IN ('LOW','MEDIUM','HIGH','CRITICAL')),
      auto_response TEXT,

      status VARCHAR(30)
        CHECK (status IN (
          'PENDING_EMAIL_VERIFICATION',
          'ACTIVE',
          'IN_PROGRESS',
          'RESOLVED'
        ))
        DEFAULT 'PENDING_EMAIL_VERIFICATION',

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      verified_at TIMESTAMP,
      resolved_at TIMESTAMP
    );

    /* Indexes for fast dashboard & tracking */
    CREATE INDEX IF NOT EXISTS idx_complaints_status
      ON complaints(status);

    CREATE INDEX IF NOT EXISTS idx_complaints_priority
      ON complaints(priority_level);

    CREATE INDEX IF NOT EXISTS idx_complaints_created
      ON complaints(created_at);

    /* =========================
       OTP VERIFICATIONS
       ========================= */
    CREATE TABLE IF NOT EXISTS otp_verifications (
      id SERIAL PRIMARY KEY,
      complaint_id VARCHAR(30) NOT NULL,
      otp VARCHAR(6) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_otp_complaint
        FOREIGN KEY (complaint_id)
        REFERENCES complaints(complaint_id)
        ON DELETE CASCADE
    );

    /* =========================
       OFFICERS TABLE
       ========================= */
    CREATE TABLE IF NOT EXISTS officers (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(50) DEFAULT 'OFFICER',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    /* =========================
       OFFICER RESPONSES
       ========================= */
    CREATE TABLE IF NOT EXISTS responses (
      id SERIAL PRIMARY KEY,
      complaint_id VARCHAR(30) NOT NULL,
      ai_response TEXT,
      final_response TEXT,
      approved_by INT,
      approved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_response_complaint
        FOREIGN KEY (complaint_id)
        REFERENCES complaints(complaint_id)
        ON DELETE CASCADE,

      CONSTRAINT fk_response_officer
        FOREIGN KEY (approved_by)
        REFERENCES officers(id)
        ON DELETE SET NULL
    );

    /* =========================
       AI FEEDBACK
       ========================= */
    CREATE TABLE IF NOT EXISTS ai_feedback (
      id SERIAL PRIMARY KEY,
      complaint_id VARCHAR(30) NOT NULL,
      officer_id INT NOT NULL,
      ai_helpful BOOLEAN,
      feedback_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_feedback_complaint
        FOREIGN KEY (complaint_id)
        REFERENCES complaints(complaint_id)
        ON DELETE CASCADE,

      CONSTRAINT fk_feedback_officer
        FOREIGN KEY (officer_id)
        REFERENCES officers(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS registration_otp_verifications (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


    `);

    console.log("✅ All tables created successfully");
  } catch (err) {
    console.error("❌ Error creating tables:", err);
  }
}; 

export default CreateTables;
