import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerUser, findUserByEmail } from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/register", async (req, res) => {
  const { companyName, email, password } = req.body;

  console.log("Received registration request:", { companyName, email, password });

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await registerUser(companyName, email, hashedPassword);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Error in /register route:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user.id, companyName: user.companyName }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;