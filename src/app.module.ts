import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VkService } from './vk/vk.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/schemas/user.schema';
import { Record, RecordSchema } from './records/schemas/record.schema';
import { MONGODB_CONNECT_URI } from './config';

@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_CONNECT_URI),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Record.name, schema: RecordSchema },
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client', 'dist'),
      renderPath: 'api',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, VkService],
})
export class AppModule {}
