import { Client, PrismaClient } from "@prisma/client";
const db = new PrismaClient();

const clients = [
  {
    name: "Coil Technologies",
    logo: "https://coil.com/logo.svg",
    url: "https://coil.com",
    email: "help@coil.com",
    passwordHash: "$2a$10$GtZ1NheMfpuw5nlFk41pCOwZyFoCuChLgl/.ZupjjuaHArmgPu7.e",
    keys: {
      create : [
        {
          keyType: "OKP",
          keyUse: "sig",
          keyAlgorithm: "EdDSA",
          curve: "Ed25519",
          publicKey: "AAAAC3NzaC1lZDI1NTE5AAAAILfZogVj6z1v7zoWz_swc0ht7JQC-8dH3ERd-t1zdg7h"
        },
        {
          keyType: "OKP",
          keyUse: "sig",
          keyAlgorithm: "EdDSA",
          curve: "Ed25519",
          publicKey: "AAAAC3NzaC1lZDI1NTE5AAAAILfZogVj6z1v7zoWz_swc0ht7JQC-8dH3ERd-t1zdg7h",
          notBefore: "2022-03-07T00:00:00Z",
          expiry: "2023-03-07T00:00:00Z"
        }
      ]
    }
  },
  {
    name: "Fynbos Technologies",
    logo: "https://fynbos.dev/logo.svg",
    url: "https://fynbos.dev",
    email: "hello@fynbos.com",
    passwordHash: "$2a$10$GtZ1NheMfpuw5nlFk41pCOwZyFoCuChLgl/.ZupjjuaHArmgPu7.e",
    keys: {
      create : [
        {
          keyType: "OKP",
          keyUse: "sig",
          keyAlgorithm: "EdDSA",
          curve: "Ed25519",
          publicKey: "AAAAC3NzaC1lZDI1NTE5AAAAILfZogVj6z1v7zoWz_swc0ht7JQC-8dH3ERd-t1zdg7h"
        },
        {
          keyType: "OKP",
          keyUse: "sig",
          keyAlgorithm: "EdDSA",
          curve: "Ed25519",
          publicKey: "AAAAC3NzaC1lZDI1NTE5AAAAILfZogVj6z1v7zoWz_swc0ht7JQC-8dH3ERd-t1zdg7h",
          notBefore: "2022-03-07T00:00:00Z",
          expiry: "2023-03-07T00:00:00Z"
        }
      ]
    }
  }
];

async function seed() {

  await db.clientKey.deleteMany({})
  await db.client.deleteMany({})

  await Promise.all(
    clients.map((client) => {
      return db.client.create({ data: client });
    })
  );
}

seed();