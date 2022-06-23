import type { ClientKey as PrismaClientKey } from "@prisma/client";
import { exportJWK, generateKeyPair, importJWK } from "jose"
import { Client } from "./client";

// Extend model from Prisma to keep loose coupling to Prisma
export type ClientKeyRecord = PrismaClientKey

export type ClientKey = Omit<ClientKeyRecord, 'createdAt'| 'updatedAt' >

export type ClientKeyWithPartialClient = ClientKey & { client: Partial<Client> }

export type Ed25519JWK = {
  kid?: string,
  kty: "OKP",
  alg: "EdDSA",
  crv: "Ed25519",
  x?: string
  d?: string
}

export type Ed25519PublicKey = Omit<ClientKey, 'id' | 'clientId' | 'expiry' | 'notBefore' | 'revoked' >

export function convertClientKeyToJwk(key: ClientKey): Ed25519JWK {
  return {
    kid: key.id,
    kty: "OKP",
    alg: "EdDSA",
    crv: "Ed25519",
    x: key.publicKey
  }
}

export function convertJwkToKey(key: Ed25519JWK): Ed25519PublicKey {
  if(!key.x) throw new Error ('No public key on JWK')
  return {
    keyType: "OKP",
    keyAlgorithm: "EdDSA",
    curve: "Ed25519",
    publicKey: key.x,
  }
}

export async function generateEd25519KeyPair(kid?: string): Promise<Ed25519JWK> {
  const { publicKey, privateKey } = await generateKeyPair("EdDSA", { crv: "Ed25519" })

  const {x} = await exportJWK(publicKey) as Ed25519JWK
  const {d} = await exportJWK(privateKey) as Ed25519JWK

  return {
      kid,
      kty: "OKP",
      alg: "EdDSA",
      crv: "Ed25519",
      x,
      d
  }
}

function isValidEd25519Jwk(jwk: any): jwk is Ed25519JWK {
  return ( 
    jwk.kty && jwk.kty === "OKP" &&
    jwk.alg && jwk.alg === "EdDSA" &&
    jwk.crv && jwk.crv === "Ed25519"
  )
}

export function isValidEd25519JwkPublicKey(jwk: any): jwk is Ed25519JWK {
  return ( 
    jwk.x && typeof jwk.x === 'string' &&
    isValidEd25519Jwk(jwk)
  )
}