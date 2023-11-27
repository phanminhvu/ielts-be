import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

import { User } from '../user/user.schema';
import { NotificationType } from './enums/notification-type.enum';

export type NotificationDocument = Notification & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class Notification {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({})
  content: string;

  @Prop({ type: {}, default: {} })
  data: any;

  @Prop({ required: true, default: NotificationType.NOTIFY })
  type: NotificationType;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  })
  receiver?: User;

  @Prop({ default: false })
  isSeen?: boolean;

  @Prop({ default: false })
  isRead?: boolean;

  @Prop({ default: false })
  deleted?: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.index({});

NotificationSchema.virtual('receiverDetail', {
  ref: 'User',
  localField: 'receiver',
  foreignField: '_id',
  justOne: true,
});
