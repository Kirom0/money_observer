import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

console.log(
  `mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASSWORD}@cluster0.4fp4r.azure.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
);
const s1 =
  'mongodb+srv://kirom:1234qwer@cluster0.4fp4r.azure.mongodb.net/m_observer?retryWrites=true&w=majority';
const s2 = `mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASSWORD}@cluster0.4fp4r.azure.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

console.log(s1 === s2);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(5000);
}
bootstrap();
