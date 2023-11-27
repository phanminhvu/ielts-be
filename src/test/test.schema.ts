import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

import { User } from './../user/user.schema';
import { TestStatus } from './enums/test-status.enum';
import { QuestionSkill } from './../question-part/enums/question-skill.enum';
import { QuestionPart } from './../question-part/question-part.schema';
import { Question } from './../question/question.schema';
import { Examination } from '../examination/examination.schema';
import { ExaminationExam } from './../examination-exam/examination-exam.schema';
import { QuestionGroup } from './../question-group/question-group.schema';

export type TestDocument = Test & Document;

@Schema({
  _id: false,
  timestamps: false,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class TestAnswer {
  @Prop({ default: 0 })
  score: number;

  @Prop({ isRequired: true, default: false })
  isCorrect: boolean;

  @Prop({ default: null })
  studentAnswer: string;

  @Prop({ default: null })
  studentAnswerAudio: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    index: true,
  })
  questionId: Question;
}
const TestAnswerSchema = SchemaFactory.createForClass(TestAnswer);

@Schema({
  _id: false,
  timestamps: false,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class TestScore {
  @Prop({ default: null })
  total: number;

  @Prop({ default: null })
  reading: number;

  @Prop({ default: null })
  writing: number;

  @Prop({ default: null })
  speaking: number;

  @Prop({ default: null })
  listening: number;

  @Prop({ default: null })
  speaking_training_score: number;
}
const TestScoreSchema = SchemaFactory.createForClass(TestScore);

@Schema({
  _id: false,
  timestamps: false,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class TestSkillProgress {
  @Prop({ default: null })
  timeRemain: number;

  @Prop({ default: null })
  currentPart: number;

  @Prop({ default: null })
  currentGroup: number;
  
  @Prop({ default: null })
  currentQuestion: number;

  @Prop({ default: null })
  audioPlayedTime: number;
}
const TestSkillProgressSchema = SchemaFactory.createForClass(TestSkillProgress);

@Schema({
  _id: false,
  timestamps: false,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class TestProgress {
  @Prop({
    type: TestSkillProgressSchema,
  })
  reading: TestSkillProgress;

  @Prop({
    type: TestSkillProgressSchema,
  })
  listening: TestSkillProgress;
}
const TestProgressSchema = SchemaFactory.createForClass(TestProgress);

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class Test {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, unique: true })
  testCode: number;

  @Prop({ required: true, default: TestStatus.INITIALIZED })
  status: TestStatus;

  @Prop({ type: TestProgressSchema })
  progress: TestProgress;

  @Prop({ type: TestScoreSchema })
  score: TestScore;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Examination',
    index: true,
  })
  examination: Examination;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExaminationExam',
    index: true,
  })
  exam: ExaminationExam;

  @Prop({ type: [TestAnswerSchema] })
  answers: TestAnswer[];

  @Prop({ default: false })
  isGrading: boolean;

  @Prop({})
  readingStartDate: Date;

  @Prop({})
  listeningStartDate: Date;

  @Prop({})
  speakingStartDate: Date;

  @Prop({})
  writingStartDate: Date;

  @Prop({})
  readingFinishedDate: Date;

  @Prop({})
  listeningFinishedDate: Date;

  @Prop({})
  speakingFinishedDate: Date;

  @Prop({})
  writingFinishedDate: Date;

  @Prop({})
  finishedDate: Date;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  })
  userId: User;
}

export const TestSchema = SchemaFactory.createForClass(Test);

TestSchema.virtual('userDetail', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

TestSchema.virtual('examinationDetail', {
  ref: 'Examination',
  localField: 'examination',
  foreignField: '_id',
  justOne: true,
});

TestSchema.virtual('examDetail', {
  ref: 'ExaminationExam',
  localField: 'exam',
  foreignField: '_id',
  justOne: true,
});

TestSchema.index({});
