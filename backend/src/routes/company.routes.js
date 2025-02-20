import express from "express";
import connectDB from "../config/db.js";
import {getCompanyDetailsById} from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    const db = await connectDB();

    let query = `
      SELECT DISTINCT users.id, users.companyName
      FROM users
    `;

    let params = [];

    if (search) {
      query += ` WHERE users.companyName LIKE ?`;
      params.push(`%${search}%`);
    }

    const companies = await db.all(query, params);
    res.json(companies);
  } catch (error) {
    console.error("❌ Error fetching companies:", error);
    res.status(500).json({ message: "Server error", error });
  }
});


router.get("/company-details/:id", authMiddleware, async (req, res) => {
  try {
    const companyId = req.params.id;
    const companyDetails = await getCompanyDetailsById(companyId);

    if (!companyDetails) return res.status(404).json({ message: "Company not found" });

    res.json({
      id: companyDetails.id,
      companyName: companyDetails.companyName,
      email: companyDetails.email,
      industry: companyDetails.industry,
      founded: companyDetails.founded,
      headquarters: companyDetails.headquarters,
      size: companyDetails.size,
      specialization: companyDetails.specialization,
      perks: companyDetails.perks,
      description: companyDetails.description,
      isOwner: true // Flag for the frontend
    });
  } catch (error) {
    console.error("❌ Error fetching company details:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
