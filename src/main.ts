import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Estas 2 lineas trasnforman todos los valores en los dto con los tipos de datos correctos, pero consume mucha memoria si tenemos muchos dtos
      transformOptions: { // por ejemplo si tenemos un tipo de dato validado como number, lo que llega desde el request siempre es un request y con esto lo estaria convirtiendo
        enableImplicitConversion: true
      }
    })
  )

  await app.listen(process.env.PORT);
  console.log(`App runing on port ${process.env.PORT}`)
}
bootstrap();
