import fs from "fs";
import path from "path";

export type UserModel = {
  id: string;
  username: string;
  currentChallenge?: string;
};

// Types from @simplewebauthn/server
export type Authenticator = {
  // SQL: Encode to base64url then store as `VARCHAR`
  credentialID: string;
  // SQL: Store raw bytes as `BYTEA`/`BLOB`/etc...
  credentialPublicKey: Uint8Array;
  // SQL: Consider `BIGINT` since some authenticators return elevated counts
  counter: number;
  // SQL: `VARCHAR(255)` and store string array as a CSV string
  // Types in TS are varying, we'll store as string
  transports?: string;
};

export type AuthenticatorModel = Authenticator & {
  userId: string;
};

type DbSchema = {
  users: UserModel[];
  authenticators: AuthenticatorModel[];
};

// Use a global variable to persist across hot reloads in dev, 
// and avoid EROFS read-only errors on Vercel Serverless Functions.
declare global {
  var _mockDb: DbSchema | undefined;
}

const initialData: DbSchema = { users: [], authenticators: [] };

function readDb(): DbSchema {
  if (!global._mockDb) {
    global._mockDb = initialData;
  }
  return global._mockDb;
}

function writeDb(data: DbSchema) {
  global._mockDb = data;
}

export const db = {
  getUserByUsername: (username: string) => {
    return readDb().users.find((u) => u.username === username);
  },
  getUserById: (id: string) => {
    return readDb().users.find((u) => u.id === id);
  },
  createUser: (user: UserModel) => {
    const data = readDb();
    data.users.push(user);
    writeDb(data);
  },
  updateUserChallenge: (userId: string, challenge: string) => {
    const data = readDb();
    const userIndex = data.users.findIndex((u) => u.id === userId);
    if (userIndex > -1) {
      data.users[userIndex].currentChallenge = challenge;
      writeDb(data);
    }
  },
  getUserAuthenticators: (userId: string) => {
    return readDb().authenticators.filter((a) => a.userId === userId);
  },
  getAuthenticatorById: (credentialID: string) => {
    return readDb().authenticators.find((a) => a.credentialID === credentialID);
  },
  saveAuthenticator: (authenticator: AuthenticatorModel) => {
    const data = readDb();
    data.authenticators.push(authenticator);
    writeDb(data);
  },
  updateAuthenticatorCounter: (credentialID: string, newCounter: number) => {
    const data = readDb();
    const authIndex = data.authenticators.findIndex((a) => a.credentialID === credentialID);
    if (authIndex > -1) {
      data.authenticators[authIndex].counter = newCounter;
      writeDb(data);
    }
  }
};
