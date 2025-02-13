import sqlite3 from "sqlite3";
import { open } from "sqlite";

const connectDB = async () => {
  return open({
    filename: process.env.DB_FILE || "./database.sqlite", // Use DB_FILE from .env
    driver: sqlite3.Database,
  });
};

export default connectDB;