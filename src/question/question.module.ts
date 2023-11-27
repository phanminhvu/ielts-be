import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { QuestionController } from './question.controller';
import { Question, QuestionSchema } from './question.schema';
import { QuestionService } from './question.service';
import { QuestionGroupModule } from '../question-group/question-group.module';
import { QuestionOptionModule } from './../question-option/question-option.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }]),
    forwardRef(() => QuestionGroupModule),
    forwardRef(() => QuestionOptionModule),
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
