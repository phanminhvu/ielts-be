import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

import { QuestionPart } from './../question-part/question-part.schema';
import { Question } from './../question/question.schema';

export type ExamDocument = Exam & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class Exam {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, unique: true })
  examCode: number;

  @Prop({ required: true })
  examName: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'QuestionPart',
    index: true,
  })
  readingIds: QuestionPart[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'QuestionPart',
    index: true,
  })
  listeningIds: QuestionPart[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'QuestionPart',
    index: true,
  })
  speakingIds: QuestionPart[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Question',
    index: true,
  })
  writingIds: Question[];
}

export const ExamSchema = SchemaFactory.createForClass(Exam);

ExamSchema.virtual('readingDetail', {
  ref: 'QuestionPart',
  localField: 'readingIds',
  foreignField: '_id',
});

ExamSchema.virtual('listeningDetail', {
  ref: 'QuestionPart',
  localField: 'listeningIds',
  foreignField: '_id',
});

ExamSchema.virtual('speakingDetail', {
  ref: 'QuestionPart',
  localField: 'speakingIds',
  foreignField: '_id',
});

ExamSchema.virtual('writingDetail', {
  ref: 'Question',
  localField: 'writingIds',
  foreignField: '_id',
});

ExamSchema.index({});
