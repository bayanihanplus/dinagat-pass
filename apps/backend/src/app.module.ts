import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthContextMiddleware, AuthModule } from "./auth";
import { AppConfigModule } from "./config";
import { GovernanceModule } from "./governance";
import { HealthController } from "./health";
import { PrismaModule } from "./prisma";

@Module({
  imports: [AppConfigModule, PrismaModule, AuthModule, GovernanceModule],
  controllers: [HealthController],
  providers: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthContextMiddleware).forRoutes("*");
  }
}
