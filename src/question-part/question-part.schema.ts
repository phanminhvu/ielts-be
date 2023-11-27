import { QuestionLevel } from './enums/question-level.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

import { QuestionSkill } from './enums/question-skill.enum';

export type QuestionPartDocument = QuestionPart & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class QuestionPart {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, })
  skill: QuestionSkill;

  @Prop({ required: true })
  level: QuestionLevel;

  @Prop({ required: true })
  partNumber: number;

  @Prop({})
  passageTitle: string;

  @Prop({})
  passageText: string;

  @Prop({})
  directionAudio: string;

  @Prop({})
  partTitle: string;

  @Prop({})
  partAudio: string;

  @Prop({ default: false })
  deleted?: boolean;
}

export const QuestionPartSchema =
  SchemaFactory.createForClass(QuestionPart);

QuestionPartSchema.index({
});