import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

import { QuestionGroup } from './../question-group/question-group.schema';
import { QuestionAnalysisType } from './enums/question-analysis-type.enum';
import { QuestionSkill } from './../question-part/enums/question-skill.enum';
import { QuestionLevel } from './../question-part/enums/question-level.enum';
import { QuestionType } from './../question-group/enums/question-type.enum';

export type QuestionDocument = Question & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class Question {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, })
  skill: QuestionSkill;

  @Prop({ required: true })
  level: QuestionLevel;

  @Prop({})
  blankNumber: number;

  @Prop({})
  questionPartNumber: number;

  @Prop({})
  questionText: string;

  @Prop({})
  title: string;

  @Prop({})
  image: string;

  @Prop({})
  analysisType: QuestionAnalysisType;

  @Prop({})
  questionType: QuestionType;

  @Prop({})
  answer: string;

  @Prop({})
  explanationText: string;

  @Prop({})
  tips: string;

  @Prop({})
  usefulGrammarNVocab: string;

  @Prop({})
  ideaSuggestion: string;

  @Prop({})
  questionAudio: string;

  @Prop({})
  modelAnswer: string;

  @Prop({})
  modelAnswerAudio: string;

  @Prop({})
  organization: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuestionGroup',
    index: true,
  })
  groupId?: QuestionGroup;

  @Prop({ default: false })
  deleted?: boolean;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

QuestionSchema.index({});
