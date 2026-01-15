import { PrismaClient } from '../../generated/prisma/client'
import { PrismaPostgresAdapter } from '@prisma/adapter-ppg'


const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not defined");
}

export const db = new PrismaClient({
    adapter: new PrismaPostgresAdapter({
        connectionString,
    }),
    log: ['query', 'info', 'warn', 'error'],
});
