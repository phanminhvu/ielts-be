import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

import { StudentProfile } from '../student-profile/student-profile.schema';
import { Exam } from './../exam/exam.schema';

export type ExaminationDocument = Examination & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class Examination {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: false })
  active: boolean;

  @Prop({ required: true, default: false })
  canStart: boolean;

  @Prop({ required: false })
  isSubmit: boolean;

  @Prop({
    required: true,
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Exam',
    default: [],
  })
  examIds?: Exam[];

  @Prop({
    required: true,
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'StudentProfile',
    default: [],
  })
  studentIds?: StudentProfile[];

  studentDetails?: StudentProfile[];
}

export const ExaminationSchema = SchemaFactory.createForClass(Examination);

ExaminationSchema.virtual('studentDetails', {
  ref: 'StudentProfile',
  localField: 'studentIds',
  foreignField: '_id',
});

ExaminationSchema.index({});
