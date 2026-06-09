import { Global, Module } from "@nestjs/common";
import { buildAppConfig } from "./app-config";

export const APP_CONFIG = "APP_CONFIG";

@Global()
@Module({
  providers: [
    {
      provide: APP_CONFIG,
      useFactory: buildAppConfig
    }
  ],
  exports: [APP_CONFIG]
})
export class AppConfigModule {}