import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { AllExceptionsFilter } from './helpers/exception.filter';
import { TransformInterceptor } from './helpers/transform.interceptor';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { UserDeviceModule } from './user-device/user-device.module';
import { QuestionPartModule } from './question-part/question-part.module';
import { QuestionModule } from './question/question.module';
import { QuestionOptionModule } from './question-option/question-option.module';
import { QuestionGroupModule } from './question-group/question-group.module';
import { CommonModule } from './config/common.module';
import { TestGradeModule } from './test-grade/test-grade.module';
import { TestModule } from './test/test.module';
import { ExaminationModule } from './examination/examination.module';

import { StudentProfileModule } from './student-profile/student-profile.module';
import { ExamModule } from './exam/exam.module';

@Module({
  imports: [
    CoreModule,
    AuthModule,
    CommonModule,
    NotificationModule,
    QuestionGroupModule,
    QuestionModule,
    QuestionPartModule,
    QuestionOptionModule,
    TestModule,
    TestGradeModule,
    StudentProfileModule,
    UserDeviceModule,
    UserModule,
    ExaminationModule,
    ExamModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
  }
}

