import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { createUserTable } from "./models/User.js"; // Import createUserTable
import { createJobTable } from "./models/Job.js"; // Import createJobTable
import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import companyRoutes from "./routes/company.routes.js"; // Import company routes

dotenv.config();

const app = express();

// Initialize the database (create tables if they don't exist)
const initializeDB = async () => {
  try {
    await createUserTable();
    console.log("✅ Database initialized: Users table created or already exists");

    await createJobTable();
    console.log("✅ Jobs table created or already exists");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1); // Exit if database initialization fails
  }
};

// Connect to the database and initialize it
const startServer = async () => {
  try {
    await connectDB();
    await initializeDB(); // Ensure the tables exist
    console.log("✅ Database connected successfully");

    app.use(express.json());
    app.use(cors());

    console.log("Registering routes...");
    app.use("/api/auth", authRoutes);
    console.log("Auth routes registered at /api/auth");

    try {
      app.use("/api/jobs", jobRoutes);
      console.log("Job routes registered at /api/jobs");
    } catch (error) {
      console.warn("Warning: jobRoutes not found or failed to load.");
    }

    app.use("/api/companies", companyRoutes); // Register company routes
    console.log("Company routes registered at /api/companies");

    const PORT = 8080;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();