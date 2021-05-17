import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const origins = {
  Delevopent: ["http://localhost:4000", "http://localhost:5000"],
  Production: [],
  Test: []
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: origins[process.env.NODE_ENV]
  })
  await app.listen(3000);
}
bootstrap();
