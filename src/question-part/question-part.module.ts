import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { QuestionPartService } from './question-part.service';
import { QuestionPart, QuestionPartSchema } from './question-part.schema';
import { QuestionGroupModule } from './../question-group/question-group.module';
import { QuestionPartController } from './question-part.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: QuestionPart.name, schema: QuestionPartSchema }]),
    forwardRef(() => QuestionGroupModule),
  ],
  controllers: [QuestionPartController],
  providers: [QuestionPartService],
  exports: [QuestionPartService],
})
export class QuestionPartModule {}
