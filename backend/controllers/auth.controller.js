import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findOfficerByEmail } from "../models/officer.model.js";

export const officerLogin = async (req, res) => {
    console.log(req.body)
  try {
    const { email, password } = req.body;

    const officer = await findOfficerByEmail(email);
    if (!officer) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, officer.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    } 

    const token = jwt.sign(
      { id: officer.id, role: officer.role }, 
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      officer: {
        email: officer.email,
        role: officer.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};
