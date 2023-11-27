import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from "./jwt.strategy";
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import configuration from '../common/configuration';
import { RolesGuard } from './roles.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { StudentProfileModule } from './../student-profile/student-profile.module';
import { ExaminationModule } from './../examination/examination.module';

@Module({
  imports: [
    UserModule,
    StudentProfileModule,
    PassportModule,
    ExaminationModule,
    JwtModule.register({
      secret: configuration().jwt.secret,
      signOptions: { expiresIn: "30d" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, RolesGuard, JwtAuthGuard, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
