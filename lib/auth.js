import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// FIX: Build er somoy MONGODB_URI na thakleo crash korbe na - dummy URI diye build hobe, live e asol URI use hobe
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/manobshebaDB";
const client = new MongoClient(MONGODB_URI);
const db = client.db("manobshebaDB");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET || "manobsheba-dev-secret-change-in-prod",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
});