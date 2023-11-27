import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from '@nestjs/mongoose';

const dbConfig = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      uri: configService.get<string>('MONGODB_URI'),
    };
  },
});

@Module({
  imports: [dbConfig],
  exports: [dbConfig],
})

export class DatabaseModule {}
