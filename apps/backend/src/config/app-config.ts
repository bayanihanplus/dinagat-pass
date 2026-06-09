import { AppConfig, AppEnvironment } from "./config.types";
import { loadEnvironmentFiles } from "./env-loader";

const allowedEnvironments = new Set<AppEnvironment>([
  "local",
  "development",
  "staging",
  "production",
  "test"
]);

function readRequiredEnv(key: string): string {
  const value = process.env[key];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

function readAppEnvironment(): AppEnvironment {
  const rawValue = process.env.APP_ENV ?? "local";

  if (!allowedEnvironments.has(rawValue as AppEnvironment)) {
    throw new Error(`Invalid APP_ENV: ${rawValue}`);
  }

  return rawValue as AppEnvironment;
}

export function buildAppConfig(): AppConfig {
  loadEnvironmentFiles();

  return {
    appName: process.env.APP_NAME ?? "Dinagat Pass",
    appEnv: readAppEnvironment(),
    appUrl: process.env.APP_URL ?? "http://localhost:3000",
    databaseUrl: readRequiredEnv("DATABASE_URL"),
    authSecretConfigured: Boolean(process.env.AUTH_SECRET),
    qrSigningSecretConfigured: Boolean(process.env.QR_SIGNING_SECRET),
    databaseProvider: "postgresql",
    runtimeDatabaseConnectionChecked: false
  };
}