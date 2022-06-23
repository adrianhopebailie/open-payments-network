import type { Client as PrismaClient } from "@prisma/client";
import { ClientKey } from "./key";

// Extend model from Prisma to keep loose coupling to Prisma
export type ClientRecord = PrismaClient

export type Client = Omit<ClientRecord, 'createdAt'| 'updatedAt'| 'passwordHash' >
export type ClientWithKeyIds = Client & { keys: Array<{id: string, publicKey: string}> }
export type ClientWithKeys = Client & { keys: Array<ClientKey> }