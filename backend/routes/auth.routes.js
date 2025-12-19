import express from "express";
import { officerLogin } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", officerLogin);

export default router;
