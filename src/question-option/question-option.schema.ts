import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

import { Question } from './../question/question.schema';

export type QuestionOptionDocument = QuestionOption & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class QuestionOption {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ })
  key: string;

  @Prop({ required: true })
  text: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    index: true,
  })
  questionId: Question;

  @Prop({ default: false })
  deleted?: boolean;
}

export const QuestionOptionSchema =
  SchemaFactory.createForClass(QuestionOption);

QuestionOptionSchema.index({});
