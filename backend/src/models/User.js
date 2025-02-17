import connectDB from "../config/db.js";

const createUserTable = async () => {
  const db = await connectDB();
  await db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    companyName TEXT,
    email TEXT UNIQUE,
    password TEXT
  )`);
  console.log("✅ Users table created or already exists");
};

const registerUser = async (companyName, email, password) => {
  try {
    const db = await connectDB();
    await createUserTable(); // Ensure the table exists
    await db.run(`INSERT INTO users (companyName, email, password) VALUES (?, ?, ?)`, [companyName, email, password]);
  } catch (error) {
    console.error("❌ Error in registerUser:", error);
    throw error; // Re-throw the error to propagate it
  }
};

const findUserByEmail = async (email) => {
  const db = await connectDB();
  return db.get(`SELECT * FROM users WHERE email = ?`, [email]);
};

const getCompanyDetailsById = async (userId) => {
  const db = await connectDB();
  return db.get(`SELECT id, companyName, email FROM users WHERE id = ?`, [userId]);
};

// New function to get company profile by ID (for public viewing)
const getPublicCompanyProfile = async (companyId) => {
  const db = await connectDB();
  return db.get(`SELECT id, companyName FROM users WHERE id = ?`, [companyId]); // No email returned
};

export { createUserTable, registerUser, findUserByEmail, getCompanyDetailsById, getPublicCompanyProfile };