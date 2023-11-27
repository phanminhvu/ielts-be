import { Module, forwardRef, HttpException, HttpStatus } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from "@nestjs/platform-express";
import * as multer from "multer";
import * as path from "path";
import * as fs from "fs";
import * as moment from "moment";
import * as slug from 'slug';

import { QuestionGroupModule } from '../question-group/question-group.module';
import { QuestionPartModule } from '../question-part/question-part.module';
import { QuestionModule } from '../question/question.module';
import { QuestionOptionModule } from '../question-option/question-option.module';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { Exam, ExamSchema } from './exam.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Exam.name, schema: ExamSchema }]),
    forwardRef(() => QuestionPartModule),
    forwardRef(() => QuestionGroupModule),
    forwardRef(() => QuestionModule),
    forwardRef(() => QuestionOptionModule),
  ],
  controllers: [ExamController],
  providers: [ExamService],
  exports: [ExamService],
})
export class ExamModule {}
