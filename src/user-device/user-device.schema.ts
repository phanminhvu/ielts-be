import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

import { User } from '../user/user.schema';

export type UserDeviceDocument = UserDevice & Document;

@Schema({ timestamps: true })
export class UserDevice {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({})
  deviceID: string;

  @Prop({})
  pushToken: string;

  @Prop({})
  os: string;

  @Prop({})
  accessToken: string;

  @Prop({
    required: true,
    unique: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  })
  user: User;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserDeviceSchema = SchemaFactory.createForClass(UserDevice);

UserDeviceSchema.index({
  user: 'text',
});
