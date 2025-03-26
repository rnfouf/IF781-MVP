import connectDB from "../config/db.js";
import { TABLE_COLUMNS as PCDColumns } from "./PCD.js"
import { TABLE_COLUMNS as CompanyColumns } from "./User.js"

const createTalentTable = async () => {
    const db = await connectDB();
    await db.exec(`CREATE TABLE IF NOT EXISTS talents (
        pcdId INTEGER,
        companyId INTEGER,
        FOREIGN KEY(pcdId) REFERENCES pcds(id),
        FOREIGN KEY(companyId) REFERENCES users(id)
    )`);
};

const TABLE_COLUMNS = ["pcdId", "companyId"]
const EXCLUDE = ["password"]

const registerTalent = async (pcdId, companyId) => {
    try {
      const db = await connectDB();
      await db.run(`INSERT INTO talents (${TABLE_COLUMNS.join(",")}) VALUES (${TABLE_COLUMNS.map(v => "?").join(",")})`, [pcdId, companyId]);
    } catch (error) {
      console.error("❌ Error in registerTalent:", error);
      throw error; // Re-throw the error to propagate it
    }
};

const getTalentsByCompanyId = async (companyId) => {
  const db = await connectDB();
  return db.get(
    `SELECT ${PCDColumns.filter(col => !EXCLUDE.includes(col)).join(', ')}, companyId 
    FROM talents t INNER JOIN pcds p
    ON p.id = t.pcdId
    WHERE t.companyId = ?`, 
    [companyId]);
};

const getCompaniesByPCDId = async (pcdId) => {
  const db = await connectDB();
  return db.get(
    `SELECT ${CompanyColumns.filter(col => !EXCLUDE.includes(col)).join(', ')}, pcdId 
    FROM talents t INNER JOIN users u
    ON u.id = t.companyId
    WHERE t.pcdId = ?`, 
    [pcdId]);
};

const deleteTalent = async (pcdId, companyId) => {
    try {
      const db = await connectDB();
      await db.run(`DELETE FROM talents WHERE pcdId = ? AND companyId = ?`, [pcdId, companyId]);
    } catch (error) {
      console.error("❌ Error in deleteTalent:", error);
      throw error; // Re-throw the error to propagate it
    }
};

export { createTalentTable, registerTalent, deleteTalent, getTalentsByCompanyId, getCompaniesByPCDId }