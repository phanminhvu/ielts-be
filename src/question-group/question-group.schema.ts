import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

import { QuestionPart } from './../question-part/question-part.schema';
import { QuestionType } from './enums/question-type.enum';
import { QuestionLevel } from './../question-part/enums/question-level.enum';
import { QuestionSkill } from './../question-part/enums/question-skill.enum';

export type QuestionGroupDocument = QuestionGroup & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class QuestionGroup {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, })
  skill: QuestionSkill;

  @Prop({ required: true })
  level: QuestionLevel;

  @Prop({ })
  questionType: QuestionType;

  @Prop({ })
  groupPartNumber: number;

  @Prop({ })
  title: string;

  @Prop({ })
  directionText: string;

  @Prop({ })
  answerList: string;

  @Prop({ })
  script: string;

  @Prop({ })
  image: string;

  @Prop({ })
  questionBox: string;

  @Prop({ })
  questionTypeTips: string;

  @Prop({})
  explanationText: string;

  @Prop({})
  usefulGrammarNVocab: string;

  @Prop({})
  ideaSuggestion: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuestionPart',
    index: true,
  })
  partId?: QuestionPart;

  @Prop({ default: false })
  deleted?: boolean;
}

export const QuestionGroupSchema = SchemaFactory.createForClass(QuestionGroup);

QuestionGroupSchema.index({});