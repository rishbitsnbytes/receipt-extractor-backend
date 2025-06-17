import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule);
  const port = Number(process.env.PORT) || 3000;
  const staticAssetsPath = join(__dirname, '..', 'public', 'uploads');

  // Serve static assets from the 'public/uploads' directory
  app.useStaticAssets(staticAssetsPath, {
    prefix: '/public/uploads/',
  });

  await app.listen(port);
  console.log(`Server running on port: ${port}`);
}
bootstrap().catch((err) => {
  console.error('Error starting NestJS application:', err);
  process.exit(1);
});
