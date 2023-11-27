import { Module, forwardRef, HttpException, HttpStatus } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as moment from 'moment';
import * as slug from 'slug';

import { ExaminationController } from './examination.controller';
import { Examination, ExaminationSchema } from './examination.schema';
import { ExaminationService } from './examination.service';
import { UserModule } from './../user/user.module';
import { ExamModule } from './../exam/exam.module';
import { QuestionOptionModule } from './../question-option/question-option.module';
import { QuestionModule } from './../question/question.module';
import { QuestionGroupModule } from './../question-group/question-group.module';
import { QuestionPartModule } from './../question-part/question-part.module';
import { ExaminationExamModule } from './../examination-exam/examination-exam.module';
import { StudentProfileModule } from 'src/student-profile/student-profile.module';
import { TestModule } from './../test/test.module';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          const fileExtname = path.extname(file.originalname);
          if (fileExtname == '.xlsx') {
            cb(null, path.join(__dirname, '..', '..', '.tmp'));
          } else {
            cb(
              new HttpException(
                `Only support file with ext '.xlsx'`,
                HttpStatus.BAD_REQUEST,
              ),
              null,
            );
          }
        },
        filename: function (req, file, cb) {
          const fileExtname = path.extname(file.originalname);
          const fileName = file.originalname.replace(fileExtname, '');
          const uniqueSuffix = `${moment().format(
            'HHmmssDDMMYYYY',
          )}${Math.round(Math.random() * 1e6)}`;
          cb(null, `${slug(fileName)}-${uniqueSuffix}${fileExtname}`);
        },
      }),
      fileFilter: (req: any, file: any, cb: any) => {
        const fileExtname = path.extname(file.originalname);
        if (fileExtname == '.xlsx') {
          cb(null, true);
        } else {
          cb(
            new HttpException(
              `Only support file with ext '.xlsx'`,
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
      preservePath: true,
    }),
    MongooseModule.forFeature([
      { name: Examination.name, schema: ExaminationSchema },
    ]),
    UserModule,
    ExamModule,
    QuestionPartModule,
    QuestionGroupModule,
    QuestionModule,
    QuestionOptionModule,
    ExaminationExamModule,
    forwardRef(() => StudentProfileModule),
    forwardRef(() => TestModule),
  ],
  controllers: [ExaminationController],
  providers: [ExaminationService],
  exports: [ExaminationService],
})
export class ExaminationModule {}
