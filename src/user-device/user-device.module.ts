import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from '../user/user.module';
import { UserDeviceController } from './user-device.controller';
import { UserDevice, UserDeviceSchema } from './user-device.schema';
import { UserDeviceService } from './user-device.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserDevice.name, schema: UserDeviceSchema }]),
    UserModule,
  ],
  controllers: [UserDeviceController],
  providers: [UserDeviceService],
  exports: [UserDeviceService],
})
export class UserDeviceModule {}
