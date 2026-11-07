import "server-only";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Neon's free plan pauses the database when idle; waking it takes a few seconds.
 * A longer connect timeout (and pool timeout) lets the first request after a pause succeed instead of erroring.
 */
function datasourceUrl() {
  const url = process.env.DATABASE_URL;
  if (!url || !url.startsWith("postgres")) return undefined;
  const u = new URL(url);
  if (!u.searchParams.has("connect_timeout")) u.searchParams.set("connect_timeout", "20");
  if (!u.searchParams.has("pool_timeout")) u.searchParams.set("pool_timeout", "20");
  return u.toString();
}

export const db = globalForPrisma.prisma ?? new PrismaClient({ datasourceUrl: datasourceUrl() });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
