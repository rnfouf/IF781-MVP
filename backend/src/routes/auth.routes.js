import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerUser, findUserByEmail, getCompanyDetailsById, getPublicCompanyProfile, updateCompanyProfile, getAll } from "../models/User.js";
import { registerPCD, findPCDByEmail, getPCDDetailsById, getPCDDetailsByRole, updatePCDProfile, getAll as getAllPCD } from "../models/PCD.js"
import dotenv from "dotenv";
import authMiddleware from "../middleware/authMiddleware.js";


dotenv.config();

const router = express.Router();

router.post("/register", async (req, res) => {
  console.log("Received registration request:", req.body);

  try {
    const existingUser = await findUserByEmail(req.body.email);
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    const data = {...req.body}
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    data["password"] = hashedPassword

    await registerUser(data);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Error in /register route:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ! PCD
router.post("/pcd/register", async (req, res) => {
  console.log("Received PCD registration request:", req.body);

  try {
    const existingUser = await findPCDByEmail(req.body.email);
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    const data = {...req.body}
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    data["password"] = hashedPassword

    await registerPCD(data);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Error in /register route:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// TODO remove
router.post("/registerBatch/:type", async (req, res) => {
  console.log("registering " + req.params.type)

  if (req.params.type == "pcd") {
    req.body.forEach(async (p) => {
      const existingUser = await findPCDByEmail(p.email);
      if (existingUser) return res.status(400).json({ message: "Email already in use" });
  
      const data = {...p}
      const hashedPassword = await bcrypt.hash(p.password, 10);
      data["password"] = hashedPassword

      await registerPCD(data);
    })
  } else {
    req.body.forEach(async (p) => {
      const existingUser = await findUserByEmail(p.email);
      if (existingUser) return res.status(400).json({ message: "Email already in use" });
  
      const data = {...p}
      const hashedPassword = await bcrypt.hash(p.password, 10);
      data["password"] = hashedPassword

      await registerUser(data);
    })
  }

  res.status(201)
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user.id, companyName: user.companyName, pcd: false }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ! PCD
router.post("/pcd/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findPCDByEmail(email);
    if (!user) return res.status(400).json({ message: "A user with this email does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ userId: user.id, fullName: user.fullName, pcd: true }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// TODO - remove, debug only
router.get("/all", async (req, res) => {
  try {
    const all = await getAll();
    res.json(all)
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// TODO - remove, debug only
router.get("/pcd/all", async (req, res) => {
  try {
    const all = await getAllPCD();
    res.json(all)
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


router.get("/worker-details", authMiddleware, async (req, res) => {
  try {
    const workerId = req.user.userId;
    const workerDetails = await getPCDDetailsById(workerId);

    if (!workerDetails) return res.status(404).json({ message: "Worker not found" });

    res.json({
      id: workerDetails.id,
      fullName: workerDetails.fullName,
      email: workerDetails.email,
      role: workerDetails.role,
      phone: workerDetails.phone,
      address: workerDetails.address,
      currentCompany: workerDetails.currentCompany,
      previousExperience: workerDetails.previousExperience,
      disabilities: workerDetails.disabilities,
      accessibilityNeeds: workerDetails.accessibilityNeeds,
      skills: workerDetails.skills,
      biography: workerDetails.biography,
      isOwner: true // Flag for the frontend
    });
  } catch (error) {
    console.error("❌ Error fetching worker details:", error);
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

// ! PCD profile
router.get("/pcd/profile/:id", async (req, res) => {
  try {
    const companyId = req.params.id;
    const companyProfile = await getPCDDetailsById(companyId);

    if (!companyProfile) return res.status(404).json({ message: "Worker not found" });

    // Public profile response (limited details)
    res.json(companyProfile);
  } catch (error) {
    console.error("❌ Error fetching public pcd profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ! Fetch PCDs by role
router.get("/pcd/:role", async (req, res) => {
  try {
    const role = req.params.role;
    const pcd = await getPCDDetailsByRole(role);

    res.json(pcd);
  } catch (error) {
    console.error("❌ Error fetching public company profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/update-profile", authMiddleware, async (req, res) => {
  const { companyName, email } = req.body;
  const userId = req.user.userId;

  console.log("Received update request:", { userId, companyName, email }); // Log the request data

  try {
    await updateCompanyProfile(userId, req.body);
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({ message: "Server error", error: error.message }); // Include the error message in the response
  }
});

// ! Update PCD
router.put("/pcd/update-profile", authMiddleware, async (req, res) => {
  const { fullName, phone, email, address, role, currentCompany, biography, previousExperience, skills, disabilities, accessibilityNeeds} = req.body;
  const userId = req.user.userId;

  console.log("Received update request:", { userId, fullName, phone, email, address, role, currentCompany, biography, previousExperience, skills, disabilities, accessibilityNeeds}); // Log the request data

  try {
    await updatePCDProfile(userId, req.body);
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({ message: "Server error", error: error.message }); // Include the error message in the response
  }
});


export default router;