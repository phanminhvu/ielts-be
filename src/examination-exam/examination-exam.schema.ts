import { ListeningQuestionPart } from './../dtos/listening-question.dto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

import { QuestionPart } from './../question-part/question-part.schema';
import { Question } from './../question/question.schema';
import { Examination } from '../examination/examination.schema';
import { ReadingQuestionPart } from '../dtos/reading-question.dto';

export type ExaminationExamDocument = ExaminationExam & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class ExaminationExam {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: [],
  })
  reading: ReadingQuestionPart[];

  @Prop({
    required: true,
    type: [],
  })
  listening: ListeningQuestionPart[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  })
  speaking: QuestionPart[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  })
  writing: Question[];

  @Prop({
    required: true,
    default: false,
  })
  isUsed: boolean;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Examination',
    index: true,
  })
  examination: Examination;
}

export const ExaminationExamSchema = SchemaFactory.createForClass(ExaminationExam);

ExaminationExamSchema.index({
  examination: 'text',
});
