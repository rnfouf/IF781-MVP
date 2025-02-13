import express from "express";
import { createJob, getJobsByCompany, getJobById, updateJob, deleteJob } from "../models/Job.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { companyId, title, description, location, salary } = req.body;
  try {
    await createJob(companyId, title, description, location, salary);
    res.status(201).json({ message: "Job created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/:companyId", async (req, res) => {
  try {
    const jobs = await getJobsByCompany(req.params.companyId);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/job/:jobId", async (req, res) => {
  try {
    const job = await getJobById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.put("/job/:jobId", async (req, res) => {
  const { title, description, location, salary } = req.body;
  try {
    await updateJob(req.params.jobId, title, description, location, salary);
    res.json({ message: "Job updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.delete("/job/:jobId", async (req, res) => {
  try {
    await deleteJob(req.params.jobId);
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;