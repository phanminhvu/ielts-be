import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { QuestionOptionController } from './question-option.controller';
import { QuestionOption, QuestionOptionSchema } from './question-option.schema';
import { QuestionOptionService } from './question-option.service';
import { QuestionModule } from './../question/question.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: QuestionOption.name, schema: QuestionOptionSchema }]),
    forwardRef(() => QuestionModule),
  ],
  controllers: [QuestionOptionController],
  providers: [QuestionOptionService],
  exports: [QuestionOptionService],
})
export class QuestionOptionModule {}
