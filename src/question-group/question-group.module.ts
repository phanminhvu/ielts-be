import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { QuestionGroupController } from './question-group.controller';
import { QuestionGroup, QuestionGroupSchema } from './question-group.schema';
import { QuestionGroupService } from './question-group.service';
import { QuestionPartModule } from './../question-part/question-part.module';
import { QuestionModule } from '../question/question.module';
import { QuestionOptionModule } from '../question-option/question-option.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: QuestionGroup.name, schema: QuestionGroupSchema }]),
    forwardRef(() => QuestionModule),
    forwardRef(() => QuestionPartModule),
    forwardRef(() => QuestionOptionModule),
  ],
  controllers: [QuestionGroupController],
  providers: [QuestionGroupService],
  exports: [QuestionGroupService],
})
export class QuestionGroupModule {}
