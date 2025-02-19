import connectDB from "../config/db.js";

const createUserTable = async () => {
  const db = await connectDB();
  await db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    companyName TEXT,
    email TEXT UNIQUE,
    password TEXT
    industry TEXT,
    founded INT,
    headquarters TEXT,
    size INT,
    specialization TEXT,
    perks TEXT,
    description TEXT,
  )`);
  console.log("✅ Users table created or already exists");
};

const TABLE_COLUMNS = ["companyName", "email", "password", "industry", "founded", "headquarters", "size", "specialization", "perks", "description"]

const registerUser = async ({companyName, email, password, industry, founded, headquarters, size, specialization, perks, description}) => {
  try {
    const db = await connectDB();
    await createUserTable(); // Ensure the table exists
    await db.run(`INSERT INTO users (${TABLE_COLUMNS.join(",")}) VALUES (${TABLE_COLUMNS.map(v => "?").join(",")})`, [companyName, email, password, industry, founded, headquarters, size, specialization, perks, description]);
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
  return db.get(`SELECT id, companyName, email, industry, founded, headquarters, size, specialization, perks, description FROM users WHERE id = ?`, [userId]);
};

// New function to get company profile by ID (for public viewing)
const getPublicCompanyProfile = async (companyId) => {
  const db = await connectDB();
  return db.get(`SELECT id, companyName FROM users WHERE id = ?`, [companyId]); // No email returned
};

const updateCompanyProfile = async (userId, {companyName, email, industry, founded, headquarters, size, specialization, perks, description}) => {
  const db = await connectDB();
  try {
    await db.run(
      `UPDATE users SET companyName = ?, email = ?, industry = ?, founded = ?, headquarters = ?, size = ?, specialization = ?, perks = ?, description = ? WHERE id = ?`,
      [companyName, email, industry, founded, headquarters, size, specialization, perks, description, userId]
    );
    console.log("✅ Profile updated successfully");
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    throw error; // Re-throw the error to propagate it
  }
};

export { createUserTable, registerUser, findUserByEmail, getCompanyDetailsById, getPublicCompanyProfile, updateCompanyProfile, TABLE_COLUMNS };