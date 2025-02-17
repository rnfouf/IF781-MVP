import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUserTable, registerUser, findUserByEmail, getCompanyDetailsById, getPublicCompanyProfile } from "../models/User.js";
import dotenv from "dotenv";
import authMiddleware from "../middleware/authMiddleware.js";


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

router.get("/company-details", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const companyDetails = await getCompanyDetailsById(userId);

    if (!companyDetails) return res.status(404).json({ message: "Company not found" });

    // The logged-in company is viewing its own profile
    res.json({
      id: companyDetails.id,
      companyName: companyDetails.companyName,
      email: companyDetails.email, // Only visible to the owner
      isOwner: true // Flag for the frontend
    });
  } catch (error) {
    console.error("❌ Error fetching company details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// New route: Get a company's public profile by ID
router.get("/company-profile/:id", async (req, res) => {
  try {
    const companyId = req.params.id;
    const companyProfile = await getPublicCompanyProfile(companyId);

    if (!companyProfile) return res.status(404).json({ message: "Company not found" });

    // Public profile response (limited details)
    res.json(companyProfile);
  } catch (error) {
    console.error("❌ Error fetching public company profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;