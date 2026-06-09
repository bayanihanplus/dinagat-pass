export type AppEnvironment = "local" | "development" | "staging" | "production" | "test";

export interface AppConfig {
  appName: string;
  appEnv: AppEnvironment;
  appUrl: string;
  databaseUrl: string;
  authSecretConfigured: boolean;
  qrSigningSecretConfigured: boolean;
  databaseProvider: "postgresql";
  runtimeDatabaseConnectionChecked: false;
}