import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getCompaniesByPCDId, getTalentsByCompanyId, registerTalent, deleteTalent } from "../models/Talent.js";
import dotenv from "dotenv";
import authMiddleware from "../middleware/authMiddleware.js";

dotenv.config();

const router = express.Router();

// ! COMPANY
router.get("/applicants/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.pcd) {
      console.log(`Forbidden access attempt by PCD user ${req.user.id}`);
      return res.status(403).json({ message: "Forbidden" });
    }

    const companyId = req.params.id;
    console.log(`Fetching talents for company ID: ${companyId}`);
    
    const talents = await getTalentsByCompanyId(companyId);
    console.log('Found talents:', talents);
    
    return res.json(talents);
  } catch (error) {
    console.error("❌ Error fetching company talents:", error);
    return res.status(500).json({ 
      message: "Server error",
      error: error.message 
    });
  }
});

// ! PCD
router.post("/pcd/apply/:companyId", authMiddleware, async (req, res) => {
    console.log("Received PCD application request:", req.body);
    try {
      if (!req.user.pcd) return res.status(403).json({ message: "A company cannot apply!" });
      await registerTalent(req.user.userId, req.params.companyId);
      res.status(201).json({ message: "Application registered successfully" });
    } catch (error) {
      console.error("❌ Error in /pcd/apply route:", error);
      res.status(500).json({ message: "Server error", error });
    }
});

router.get("/pcd/companies-applied/:id", authMiddleware, async (req, res) => {
    try {
      if (!req.user.pcd) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const pcdId = req.params.id;
      const companies = await getCompaniesByPCDId(pcdId)
      return res.json(companies);
    } catch (error) {
      console.error("❌ Error fetching pcd companies:", error);
      return res.status(500).json({ message: "Server error" });
    }
});

router.delete("/pcd/remove-application/:companyId", authMiddleware, async (req, res) => {
    console.log("Received PCD remove application request:", req.body);
    try {
      if (!req.user.pcd) return res.status(403).json({ message: "A company cannot remove applications!" });
      await deleteTalent(req.user.userId, req.params.companyId);
      res.status(201).json({ message: "Application removed successfully" });
    } catch (error) {
      console.error("❌ Error in /pcd/remove-application route:", error);
      res.status(500).json({ message: "Server error", error });
    }
});

export default router