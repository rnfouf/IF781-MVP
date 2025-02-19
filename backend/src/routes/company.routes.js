import express from "express";
import connectDB from "../config/db.js";

const router = express.Router();

// Get companies that have job postings
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    const db = await connectDB();

    let query = `
      SELECT DISTINCT users.id, users.companyName
      FROM users
      JOIN jobs ON users.id = jobs.companyId
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

export default router;
