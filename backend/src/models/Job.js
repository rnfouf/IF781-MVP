import connectDB from "../config/db.js";

const createJobTable = async () => {
  const db = await connectDB();
  await db.exec(`CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    companyId INTEGER,
    title TEXT,
    description TEXT,
    location TEXT,
    salary TEXT,
    FOREIGN KEY(companyId) REFERENCES users(id)
  )`);
};

const createJob = async (companyId, title, description, location, salary) => {
  const db = await connectDB();
  await db.run(`INSERT INTO jobs (companyId, title, description, location, salary) VALUES (?, ?, ?, ?, ?)`, [companyId, title, description, location, salary]);
};

const getJobsByCompany = async (companyId) => {
  const db = await connectDB();
  return db.all(`SELECT * FROM jobs WHERE companyId = ?`, [companyId]);
};

const getJobById = async (jobId) => {
  const db = await connectDB();
  return db.get(`SELECT * FROM jobs WHERE id = ?`, [jobId]);
};

const updateJob = async (jobId, title, description, location, salary) => {
  const db = await connectDB();
  await db.run(`UPDATE jobs SET title = ?, description = ?, location = ?, salary = ? WHERE id = ?`, [title, description, location, salary, jobId]);
};

const deleteJob = async (jobId) => {
  const db = await connectDB();
  await db.run(`DELETE FROM jobs WHERE id = ?`, [jobId]);
};

// Export all functions
export { createJobTable, createJob, getJobsByCompany, getJobById, updateJob, deleteJob };