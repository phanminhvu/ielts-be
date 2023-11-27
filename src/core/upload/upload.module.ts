import { HttpException, HttpStatus, Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import * as multer from "multer";
import * as path from "path";
import * as fs from "fs";
import * as moment from "moment";
import * as slug from 'slug';

import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";

@Module({
  imports: [
    MulterModule.register({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          if (
            file.mimetype.match(
              /image\/png|image\/jpeg|image\/jpg|imagesvg\+xml|image\/gif|image\/svg\+xml|audio\/mpeg|audio\/wav|audio\/webm/
            )
          ) {
            const pathYear = path.join(
              __dirname,
              "..",
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
            /image\/png|image\/jpeg|image\/jpg|imagesvg\+xml|image\/gif|image\/svg\+xml|audio\/mpeg|audio\/wav|audio\/webm/
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
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
