import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StudentProfile, StudentProfileSchema } from './student-profile.schema';
import { StudentProfileService } from './student-profile.service';
import { StudentProfileController } from './student-profile.controller';
import { UserModule } from './../user/user.module';
import { ExaminationModule } from './../examination/examination.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: StudentProfile.name, schema: StudentProfileSchema }]),
    UserModule,
    forwardRef(() => ExaminationModule,),
  ],
  controllers: [StudentProfileController],
  providers: [StudentProfileService],
  exports: [StudentProfileService],
})
export class StudentProfileModule {}
