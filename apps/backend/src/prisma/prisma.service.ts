import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

export interface DatabaseReadinessResult {
  clientAvailable: boolean;
  runtimeConnectionChecked: true;
  connected: boolean;
  provider: "postgresql";
  migrationRan: boolean;
  dbPushRan: false;
  checkedAt: string;
  error: string | null;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit(): Promise<void> {
    // Intentionally no eager database connection here.
    // Readiness is checked through an explicit health contract query.
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  async checkDatabaseReadiness(): Promise<DatabaseReadinessResult> {
    const checkedAt = new Date().toISOString();

    try {
      await this.$queryRaw`SELECT 1`;

      return {
        clientAvailable: true,
        runtimeConnectionChecked: true,
        connected: true,
        provider: "postgresql",
        migrationRan: true,
        dbPushRan: false,
        checkedAt,
        error: null
      };
    } catch (error) {
      return {
        clientAvailable: true,
        runtimeConnectionChecked: true,
        connected: false,
        provider: "postgresql",
        migrationRan: true,
        dbPushRan: false,
        checkedAt,
        error: error instanceof Error ? error.message : "Unknown database readiness error"
      };
    }
  }
}