import { Module, forwardRef, HttpException, HttpStatus } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from "@nestjs/platform-express";
import * as multer from "multer";
import * as path from "path";
import * as fs from "fs";
import * as moment from "moment";
import * as slug from 'slug';

import { TestController } from './test.controller';
import { Test, TestSchema } from './test.schema';
import { TestService } from './test.service';
import { QuestionGroupModule } from '../question-group/question-group.module';
import { QuestionPartModule } from '../question-part/question-part.module';
import { QuestionModule } from '../question/question.module';
import { QuestionOptionModule } from '../question-option/question-option.module';
import { UserModule } from './../user/user.module';
import { ExaminationModule } from './../examination/examination.module';
import { StudentProfileModule } from './../student-profile/student-profile.module';
import { ExaminationExamModule } from './../examination-exam/examination-exam.module';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          if (
            file.mimetype.match(
              /audio\/mpeg|audio\/wav|audio\/webm/
            )
          ) {
            const pathYear = path.join(
              __dirname,
              "..",
              "..",
              "public",
              "uploads",
              moment().get("year").toString()
            );
            const pathMonth = path.join(
              pathYear,
              (moment().get("month") + 1).toString()
            );
            const pathDay = path.join(
              pathMonth,
              moment().get("day").toString()
            );
            if (!fs.existsSync(pathYear)) {
              fs.mkdirSync(pathYear);
            }
            if (!fs.existsSync(pathMonth)) {
              fs.mkdirSync(pathMonth);
            }
            if (!fs.existsSync(pathDay)) {
              fs.mkdirSync(pathDay);
            }
            cb(null, pathDay);
          } else {
            cb(
              new HttpException(
                `Unsupported file type ${path.extname(file.originalname)}`,
                HttpStatus.BAD_REQUEST
              ),
              null
            );
          }
        },
        filename: function (req, file, cb) {
          const fileExtname = path.extname(file.originalname);
          const fileName = file.originalname.replace(fileExtname, "");
          const uniqueSuffix = `${moment().format(
            "HHmmssDDMMYYYY"
          )}${Math.round(Math.random() * 1e6)}`;
          cb(null, `${slug(fileName)}-${uniqueSuffix}${fileExtname}`);
        },
      }),
      fileFilter: (req: any, file: any, cb: any) => {
        if (
          file.mimetype.match(
            /audio\/mpeg|audio\/wav|audio\/webm/
          )
        ) {
          cb(null, true);
        } else {
          cb(
            new HttpException(
              `Unsupported file type ${path.extname(file.originalname)}`,
              HttpStatus.BAD_REQUEST
            ),
            false
          );
        }
      },
      preservePath: true,
    }),
    MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }]),
    forwardRef(() => QuestionPartModule),
    forwardRef(() => QuestionGroupModule),
    forwardRef(() => QuestionModule),
    forwardRef(() => QuestionOptionModule),
    forwardRef(() => UserModule),
    forwardRef(() => ExaminationModule),
    forwardRef(() => StudentProfileModule),
    forwardRef(() => ExaminationExamModule),
  ],
  controllers: [TestController],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule {}
