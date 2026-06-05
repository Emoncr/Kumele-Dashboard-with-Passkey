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

const DB_FILE = path.join(process.cwd(), "db.json");

function readDb(): DbSchema {
  if (!fs.existsSync(DB_FILE)) {
    return { users: [], authenticators: [] };
  }
  const data = fs.readFileSync(DB_FILE, "utf-8");
  const parsed = JSON.parse(data);
  
  // Convert credentialPublicKey back to Uint8Array
  parsed.authenticators = parsed.authenticators.map((auth: any) => ({
    ...auth,
    credentialPublicKey: new Uint8Array(Object.values(auth.credentialPublicKey))
  }));
  
  return parsed;
}

function writeDb(data: DbSchema) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
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
