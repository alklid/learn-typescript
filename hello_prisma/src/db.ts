import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import "dotenv/config";
import type { PoolConfig } from "mariadb";
import { PrismaClient } from "../lib/prisma/client";

const pConfig: PoolConfig = {
  host: process.env.DATABASE_HOST as string,
  user: process.env.DATABASE_USER as string,
  password: process.env.DATABASE_PASSWORD as string,
  database: process.env.DATABASE_NAME as string,
  connectionLimit: 5,
};

const adapter = new PrismaMariaDb(pConfig);
export const prismaClient = new PrismaClient({
  adapter,
  log: ["query", "info", "warn", "error"],
});
