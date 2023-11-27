import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

import { UserType } from './enums/user-type.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({})
  password: string;

  @Prop({})
  facebookId: string;

  @Prop({})
  googleId: string;

  @Prop({})
  appleId: string;

  @Prop()
  fullname?: string;

  @Prop({})
  dob?: Date;

  @Prop({})
  avatar?: string;

  @Prop({ required: true, default: false })
  verified?: boolean;

  @Prop({})
  verifyCode?: string;

  @Prop({})
  verifyCodeExpirationTime?: Date;

  @Prop({})
  resetPasswordToken?: string;

  @Prop({})
  resetPasswordCode?: string;

  @Prop({})
  resetPasswordCodeExpirationTime?: Date;

  @Prop({ required: true, default: UserType.USER })
  userType?: UserType;

  @Prop({ default: false })
  active?: boolean;

  @Prop({ default: false })
  deleted?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({
  username: 'text',
  email: 'text',
  fullname: 'text',
});
