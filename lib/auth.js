import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { createRequire } from "module";

const req = createRequire(import.meta.url);
const { MongoClient } = req("mongo" + "db");

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("manobshebaDB");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
});