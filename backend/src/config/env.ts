import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

// A schema for environment variables using Zod.
const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  FRONTEND_URL: z.string().min(1, { message: "FRONTEND_URL is required" }),
  AIRTABLE_CLIENT_ID: z
    .string()
    .min(1, { message: "AIRTABLE_CLIENT_ID is required" }),
  AIRTABLE_CLIENT_SECRET: z
    .string()
    .min(1, { message: "AIRTABLE_CLIENT_SECRET is required" }),
  AIRTABLE_REDIRECT_URI: z
    .string()
    .min(1, { message: "AIRTABLE_REDIRECT_URI is required" }),
  MONGO_URI: z.string().min(1, { message: "MONGO_URI is required" }),
  JWT_SECRET: z.string().min(1, { message: "JWT_SECRET is required" }),
});

// Parse and validate the environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const errorDetails = parsedEnv.error.issues.reduce((acc, issue) => {
    const path = issue.path.join(".");
    acc[path] = issue.message;
    return acc;
  }, {} as Record<string, string>);

  console.error(
    "Invalid environment variables:",
    JSON.stringify(errorDetails, null, 2)
  );
  throw new Error("Invalid environment variables.");
}

export const env = parsedEnv.data;
