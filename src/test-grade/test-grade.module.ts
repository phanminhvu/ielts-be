import { Module, forwardRef, HttpException, HttpStatus } from '@nestjs/common';

import { TestGradeController } from './test-grade.controller';
import { TestModule } from './../test/test.module';
import { QuestionGroupModule } from '../question-group/question-group.module';
import { QuestionModule } from '../question/question.module';
import { QuestionOptionModule } from '../question-option/question-option.module';
import { UserModule } from '../user/user.module';
import { QuestionPartModule } from '../question-part/question-part.module';
import { ExaminationExamModule } from './../examination-exam/examination-exam.module';

@Module({
  imports: [
    forwardRef(() => TestModule),
    forwardRef(() => QuestionPartModule),
    forwardRef(() => QuestionGroupModule),
    forwardRef(() => QuestionModule),
    forwardRef(() => QuestionOptionModule),
    forwardRef(() => UserModule),
    forwardRef(() => ExaminationExamModule),
  ],
  controllers: [TestGradeController],
  providers: [],
  exports: [],
})
export class TestGradeModule {}
