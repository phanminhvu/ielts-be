import { Module, forwardRef, HttpException, HttpStatus } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from "@nestjs/platform-express";
import * as multer from "multer";
import * as path from "path";
import * as fs from "fs";
import * as moment from "moment";
import * as slug from 'slug';

import { ExaminationExam, ExaminationExamSchema } from './examination-exam.schema';
import { ExaminationExamController } from './examination-exam.controller';
import { ExaminationExamService } from './examination-exam.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ExaminationExam.name, schema: ExaminationExamSchema }]),
  ],
  controllers: [ExaminationExamController],
  providers: [ExaminationExamService],
  exports: [ExaminationExamService],
})
export class ExaminationExamModule {}
