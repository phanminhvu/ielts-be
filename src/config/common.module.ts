import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CommonController } from './common.controller';

@Module({
  imports: [],
  controllers: [CommonController],
  providers: [],
  exports: [],
})
export class CommonModule {}
