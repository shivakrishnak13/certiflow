import { ENV } from "@/types/enums/enums";
import { z } from "zod";

// Zod schema for environment variables
const envSchema = z.object({
  // Database Configuration
  DB_PATH: z.url(),

  // Server Configuration
  PORT: z.string().regex(/^\d+$/).default("8000"),
  JWT_SECRET: z.string().min(8),
  NODE_ENV: z.enum(ENV).default(ENV.DEVELOPMENT),

  ALLOWED_ORIGINS: z.string().nonempty(),

  COOKIE_DOMAIN_NAME: z.string(),
});

// Parse and validate environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:");
  console.error(z.treeifyError(parsedEnv.error));
  console.error(parsedEnv.error);
  throw new Error("Environment validation failed");
}

// Export validated config
const envConfig = parsedEnv.data;

// Export type for use in other files
export type EnvConfig = z.infer<typeof envSchema>;

export default envConfig;
