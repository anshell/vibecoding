import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL || "mysql://root:password@127.0.0.1:3306/vibecoding";

// Create connection pool
export const connection = mysql.createPool(connectionString);

// Create Drizzle DB client instance
export const db = drizzle(connection, { schema, mode: "default" });
