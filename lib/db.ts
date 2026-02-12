import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalPrisma = global as unknown as {
    prisma: PrismaClient | undefined
}


const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const db = globalPrisma.prisma || new PrismaClient({
    log: ["query", "info", "error", "warn"],
    adapter,
});

if (process.env.NODE_ENV !== "production") globalPrisma.prisma = db;

export default db;