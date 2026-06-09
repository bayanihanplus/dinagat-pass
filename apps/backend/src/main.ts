import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true
    }
  );

  app.enableCors({
    origin: true,
    credentials: true
  });

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port, "0.0.0.0");

  console.log("Dinagat Pass backend health: http://localhost:" + port + "/health");
}

void bootstrap();