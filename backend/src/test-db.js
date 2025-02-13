import connectDB from "./config/db.js";
import { createUserTable, registerUser, findUserByEmail } from "./models/User.js";

const testDB = async () => {
  try {
    const db = await connectDB();
    console.log("✅ Database connected successfully");

    await createUserTable();
    console.log("✅ Users table created or already exists");

    // Test inserting a user
    await registerUser("Test Corp", "test@example.com", "testpass");
    console.log("✅ User inserted successfully");

    // Test querying the user
    const user = await findUserByEmail("test@example.com");
    console.log("✅ Queried user:", user);
  } catch (error) {
    console.error("❌ Error testing database:", error);
  }
};

testDB();