import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

import { User } from '../user/user.schema';

export type StudentProfileDocument = StudentProfile & Document;

@Schema({ timestamps: true })
export class StudentProfile {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, unique: true })
  studentCode: String;

  @Prop({ required: true })
  candidateCode: string;

  @Prop()
  gender?: string;

  @Prop()
  fullname?: string;

  @Prop({})
  dob?: Date;

  @Prop()
  idCardNumber?: string;

  @Prop()
  phone?: string;

  @Prop()
  email?: string;

  @Prop()
  majors?: string;

  @Prop()
  classroom?: string;

  @Prop({})
  image?: string;

  @Prop({})
  examroom?: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  })
  user: User;
}

export const StudentProfileSchema =
  SchemaFactory.createForClass(StudentProfile);

StudentProfileSchema.index({
  studentCode: 'text',
  candidateCode: 'text',
  user: 'text',
});
