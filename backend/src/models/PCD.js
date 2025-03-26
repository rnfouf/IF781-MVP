import connectDB from "../config/db.js";

const createPCDTable = async () => {
  const db = await connectDB();
  await db.exec(`CREATE TABLE IF NOT EXISTS pcds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT,
    phone TEXT,
    address TEXT,
    currentCompany TEXT,
    previousExperience TEXT,
    disabilities TEXT,
    accessibilityNeeds TEXT,
    skills TEXT,
    biography TEXT
  )`);
};

const TABLE_COLUMNS = ["fullName", "email", "password", "role", "phone", "address", "currentCompany", "previousExperience", "disabilities", "accessibilityNeeds", "skills", "biography"]

const registerPCD = async ({fullName, email, password, role, phone, address, currentCompany, previousExperience, disabilities, accessibilityNeeds, skills, biography}) => {
  try {
    const db = await connectDB();
    await createPCDTable(); // Ensure the table exists
    await db.run(`INSERT INTO pcds (${TABLE_COLUMNS.join(",")}) VALUES (${TABLE_COLUMNS.map(v => "?").join(",")})`, [fullName, email, password, role, phone, address, currentCompany, previousExperience, disabilities, accessibilityNeeds, skills, biography]);
  } catch (error) {
    console.error("❌ Error in registerPCD:", error);
    throw error; // Re-throw the error to propagate it
  }
};

const getAll = async () => {
  const db = await connectDB();
  return db.all(`SELECT * FROM pcds`);
};

const findPCDByEmail = async (email) => {
  const db = await connectDB();
  return db.get(`SELECT * FROM pcds WHERE email = ?`, [email]);
};

const getPCDDetailsById = async (userId) => {
  const db = await connectDB();
  return db.get(
    `SELECT id, fullName, email, role, phone, address, currentCompany, previousExperience, disabilities, accessibilityNeeds, skills, biography 
    FROM pcds WHERE id = ?`, [userId]
);
};

const getPCDDetailsByRole = async (userRole) => {
    const db = await connectDB();
    return db.get(
        `SELECT id, fullName, email, role, phone, address, currentCompany, previousExperience, disabilities, accessibilityNeeds, skills, biography 
        FROM pcds WHERE role = ?`, [userRole]
    );
  };


const updatePCDProfile = async (userId, {fullName, phone, email, address, role, currentCompany, biography, previousExperience, skills, disabilities, accessibilityNeeds}) => {
  const db = await connectDB();
  try {
    await db.run(
      `UPDATE pcds SET fullName = ?, phone = ?, email = ?, address = ?, role = ?, currentCompany = ?, biography = ?, previousExperience = ?, skills = ?, disabilities = ?, accessibilityNeeds = ? WHERE id = ?`,
      [fullName, phone, email, address, role, currentCompany, biography, previousExperience, skills, disabilities, accessibilityNeeds, userId]
    );
    console.log("✅ Profile updated successfully");
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    throw error; // Re-throw the error to propagate it
  }
};

export { createPCDTable, registerPCD, findPCDByEmail, getPCDDetailsByRole, getPCDDetailsById, TABLE_COLUMNS, getAll, updatePCDProfile};