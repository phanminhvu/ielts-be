import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as path from 'path';
import * as fs from 'fs';
const FileDownloader = require('nodejs-file-downloader');

import { AuthService } from './auth.service';
import { SigninDto } from './dtos/signin.input';
import { SignupDto } from './dtos/signup.input';
import { UpdatePasswordDto } from './dtos/update-password.input';
import { UpdateProfileDto } from './dtos/update-profile.input';
import { VerifyEmailDto } from './dtos/vefiry-email.input';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserService } from '../user/user.service';
import configuration from '../common/configuration';
import { verifyEmail, randomCodeByLength } from '../helpers/utils';
import { bcryptSalt } from '../helpers/constants';
import { ForgotPasswordDto } from './dtos/forgot-password.input';
import { ResetPasswordDto } from './dtos/reset-password.input';
import { ForgotPasswordVerifyCodeDto } from './dtos/forgot-password-verify-code.input';
import { SigninSocialDto } from './dtos/signin-social.input';
import { UserSocialConnectionType } from './../user/enums/user-social-connection-type.enum';
import { SignupSocialDto } from './dtos/signup-social.input';
import { StudentSigninDto } from './dtos/student-signin.input';
import { StudentProfileService } from '../student-profile/student-profile.service';
import { ExaminationService } from './../examination/examination.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private studentProfileService: StudentProfileService,
    private examinationService: ExaminationService,
  ) {}

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const requireFields = ['email'];
    for (let i = 0; i < requireFields.length; i++) {
      const field = requireFields[i];
      if (!forgotPasswordDto[field] || !forgotPasswordDto[field].trim()) {
        throw new HttpException(
          `Field ${field} is required!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const forgotPasswordData = {
      email: forgotPasswordDto.email.trim().toLocaleLowerCase(),
    };

    if (!verifyEmail(forgotPasswordData.email)) {
      throw new HttpException(
        `Email is not in correct format!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const userFound = await this.userService.findOne({
      email: forgotPasswordData.email,
    });

    if (!userFound || !userFound._id || userFound.deleted) {
      throw new HttpException('Account not exists!', HttpStatus.NOT_FOUND);
    }

    if (!userFound.password) {
      throw new HttpException(
        'You cannot reset password for this account!',
        HttpStatus.BAD_REQUEST,
      );
    }

    let verifyCode = randomCodeByLength(6);
    let userFoundByCode = await this.userService.findOne({
      resetPasswordCode: verifyCode,
    });

    while (userFoundByCode && userFoundByCode._id) {
      verifyCode = randomCodeByLength(6);
      userFoundByCode = await this.userService.findOne({
        resetPasswordCode: verifyCode,
      });
    }

    await this.userService.update(userFound._id.toString(), {
      resetPasswordCode: verifyCode,
      resetPasswordCodeExpirationTime: moment()
        .add(30, 'minutes')
        .toISOString(),
    });

    try {
      const emailResult = await this.mailerService.sendMail({
        to: userFound.email,
        subject: 'Your verification code for Ielts application',
        template: 'verifyEmail',
        context: {
          verifyCode: verifyCode,
        },
      });

      console.log(`Send email success: ${JSON.stringify(emailResult)}`);
    } catch (error) {
      console.log(`Failed to send email: ${error}`);
    }

    return true;
  }

  @Post('forgot-password/verify-code')
  async verifyForgotPasswordCode(
    @Request() req,
    @Body() forgotPasswordVerifyCodeDto: ForgotPasswordVerifyCodeDto,
  ) {
    const requireFields = ['email', 'verifyCode'];
    for (let i = 0; i < requireFields.length; i++) {
      const field = requireFields[i];
      if (
        !forgotPasswordVerifyCodeDto ||
        !forgotPasswordVerifyCodeDto[field] ||
        !forgotPasswordVerifyCodeDto[field].toString().trim()
      ) {
        throw new HttpException(
          `Field ${field} is required!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const verifyForgotPasswordCodeData = {
      verifyCode: forgotPasswordVerifyCodeDto.verifyCode.toString().trim(),
      email: forgotPasswordVerifyCodeDto.email.trim(),
    };

    if (!verifyEmail(verifyForgotPasswordCodeData.email)) {
      throw new HttpException(
        `Email is not in correct format!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const userFound = await this.userService.findOne({
      email: verifyForgotPasswordCodeData.email,
    });

    if (!userFound || !userFound._id || userFound.deleted) {
      throw new HttpException('Account not exists!', HttpStatus.NOT_FOUND);
    }

    if (
      moment(userFound.resetPasswordCodeExpirationTime).diff(
        moment(),
        'minutes',
      ) <= 0
    ) {
      throw new HttpException(
        'Your verification code is expired!',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      userFound.resetPasswordCode != verifyForgotPasswordCodeData.verifyCode
    ) {
      throw new HttpException(
        'Your verification code is not correct!',
        HttpStatus.BAD_REQUEST,
      );
    }

    let resetPasswordToken = randomCodeByLength(12);
    let userFoundByToken = await this.userService.findOne({
      resetPasswordToken: resetPasswordToken,
    });

    while (userFoundByToken && userFoundByToken._id) {
      resetPasswordToken = randomCodeByLength(12);
      userFoundByToken = await this.userService.findOne({
        resetPasswordToken: resetPasswordToken,
      });
    }

    await this.userService.update(userFound._id.toString(), {
      resetPasswordToken: resetPasswordToken,
    });

    return {
      resetToken: resetPasswordToken,
    };
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const requireFields = ['resetToken', 'password'];
    for (let i = 0; i < requireFields.length; i++) {
      const field = requireFields[i];
      if (!resetPasswordDto[field] || !resetPasswordDto[field].trim()) {
        throw new HttpException(
          `Field ${field} is required!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const resetPasswordData = {
      resetToken: resetPasswordDto.resetToken.trim(),
      password: resetPasswordDto.password.trim(),
    };

    let userFound = await this.userService.findOne({
      resetPasswordToken: resetPasswordData.resetToken,
    });

    if (
      !userFound ||
      !userFound._id ||
      userFound.resetPasswordToken != resetPasswordData.resetToken
    ) {
      throw new HttpException(
        'Your reset token is not correct!',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.userService.update(userFound._id.toString(), {
      password: bcrypt.hashSync(resetPasswordData.password, bcryptSalt),
      resetPasswordToken: null,
      resetPasswordCode: null,
      resetPasswordCodeExpirationTime: null,
    });

    return true;
  }

  // @Post('signup')
  // async signup(@Body() signupDto: SignupDto) {
  //   const requireFields = ['email', 'password'];
  //   for (let i = 0; i < requireFields.length; i++) {
  //     const field = requireFields[i];
  //     if (!signupDto[field] || !signupDto[field].trim()) {
  //       throw new HttpException(
  //         `Field ${field} is required!`,
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //   }

  //   const newUser = {
  //     email: signupDto.email.trim().toLocaleLowerCase(),
  //     password: signupDto.password.trim(),
  //   };

  //   if (!verifyEmail(newUser.email)) {
  //     throw new HttpException(
  //       `Email is not in correct format!`,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   let userFound = await this.userService.findOne({
  //     email: newUser.email,
  //   });

  //   if (userFound && userFound._id) {
  //     throw new HttpException('Email already in use!', HttpStatus.BAD_REQUEST);
  //   }

  //   const verifyCode = randomCodeByLength(6);

  //   const userCreated = await this.userService.create({
  //     email: newUser.email,
  //     password: newUser.password,
  //     verifyCode: verifyCode,
  //     verifyCodeExpirationTime: moment().add(30, 'minutes').toISOString(),
  //   });

  //   if (userCreated && userCreated._id) {
  //     try {
  //       const emailResult = await this.mailerService.sendMail({
  //         to: userCreated.email,
  //         subject: 'Your verification code for Ielts application',
  //         template: 'verifyEmail',
  //         context: {
  //           verifyCode: verifyCode,
  //         },
  //       });

  //       console.log(`Send email success: ${JSON.stringify(emailResult)}`);
  //     } catch (error) {
  //       console.log(`Failed to send email: ${error}`);
  //     }

  //     const payload = this.authService.getUserPayload(userCreated);

  //     return {
  //       access_token: this.jwtService.sign(payload, {
  //         secret: configuration().jwt.secret,
  //       }),
  //       user: this.authService.getUserResponseBody(userCreated),
  //     };
  //   }

  //   throw new HttpException('Signup failed!', HttpStatus.BAD_GATEWAY);
  // }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Post('signup/verify-email')
  // async verifyEmail(@Request() req, @Body() verifyEmailDto: VerifyEmailDto) {
  //   const user = req.user;
  //   if (user && user._id) {
  //     const requireFields = ['verifyCode'];
  //     for (let i = 0; i < requireFields.length; i++) {
  //       const field = requireFields[i];
  //       if (
  //         !verifyEmailDto[field] ||
  //         !verifyEmailDto[field].toString().trim()
  //       ) {
  //         throw new HttpException(
  //           `Field ${field} is required!`,
  //           HttpStatus.BAD_REQUEST,
  //         );
  //       }
  //     }

  //     const verifyEmailData = {
  //       verifyCode: verifyEmailDto.verifyCode.toString().trim(),
  //     };

  //     let userFound = await this.userService.findOne({
  //       _id: user._id,
  //     });

  //     if (!userFound || !userFound._id || userFound.deleted) {
  //       throw new HttpException('Account is not exists!', HttpStatus.NOT_FOUND);
  //     }

  //     if (userFound.verified) {
  //       throw new HttpException(
  //         'Your account already vefified!',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }

  //     if (!userFound.verifyCode || !userFound.verifyCodeExpirationTime) {
  //       throw new HttpException(
  //         'Your account not requested for verify yet!',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }

  //     if (
  //       moment(userFound.verifyCodeExpirationTime).diff(moment(), 'minutes') <=
  //       0
  //     ) {
  //       throw new HttpException(
  //         'Your verification code is expired!',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }

  //     if (userFound.verifyCode != verifyEmailData.verifyCode) {
  //       throw new HttpException(
  //         'Your verification code is not correct!',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }

  //     await this.userService.update(userFound._id.toString(), {
  //       verified: true,
  //       verifyCode: null,
  //       verifyCodeExpirationTime: null,
  //     });

  //     return true;
  //   }

  //   throw new HttpException('Unauthenticated!', HttpStatus.UNAUTHORIZED);
  // }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Post('signup/resend-code')
  // async resendVefificationCode(@Request() req) {
  //   const user = req.user;
  //   if (user && user._id) {
  //     let userFound = await this.userService.findOne({
  //       _id: user._id,
  //     });

  //     if (!userFound || !userFound._id || userFound.deleted) {
  //       throw new HttpException('Account is not exists!', HttpStatus.NOT_FOUND);
  //     }

  //     if (userFound.verified) {
  //       throw new HttpException(
  //         'Your account already vefified!',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }

  //     const verifyCode = randomCodeByLength(6);

  //     await this.userService.update(userFound._id.toString(), {
  //       verifyCode: verifyCode,
  //       verifyCodeExpirationTime: moment().add(30, 'minutes').toISOString(),
  //     });

  //     try {
  //       const emailResult = await this.mailerService.sendMail({
  //         to: userFound.email,
  //         subject: 'Your verification code for Ielts application',
  //         template: 'verifyEmail',
  //         context: {
  //           verifyCode: verifyCode,
  //         },
  //       });

  //       console.log(`Send email success: ${JSON.stringify(emailResult)}`);
  //     } catch (error) {
  //       console.log(`Failed to send email: ${error}`);
  //       throw new HttpException(
  //         'Failed to send email!',
  //         HttpStatus.INTERNAL_SERVER_ERROR,
  //       );
  //     }

  //     return true;
  //   }

  //   throw new HttpException('Unauthenticated!', HttpStatus.UNAUTHORIZED);
  // }

  // @Post('signin/social')
  // async signinSocial(@Body() signinDto: SigninSocialDto): Promise<any> {
  //   const requireFields = ['token', 'provider'];
  //   for (let i = 0; i < requireFields.length; i++) {
  //     const field = requireFields[i];
  //     if (!signinDto[field] || !signinDto[field].trim()) {
  //       throw new HttpException(
  //         `Field ${field} is required!`,
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //   }

  //   const providerList: String[] = [
  //     UserSocialConnectionType.APPLE,
  //     UserSocialConnectionType.FACEBOOK,
  //     UserSocialConnectionType.GOOGLE,
  //   ];
  //   if (!providerList.includes(signinDto.provider)) {
  //     throw new HttpException(`Invalid provider!`, HttpStatus.BAD_REQUEST);
  //   }

  //   let userSocialId = null;
  //   let userSocialEmail = null;
  //   let userSocialFullname = null;
  //   let userSocialAvatarUrl = null;
  //   const userQuery = {};

  //   try {
  //     switch (signinDto.provider) {
  //       case UserSocialConnectionType.FACEBOOK: {
  //         const facebookUserData = await this.authService.verifyFacebookToken(
  //           signinDto.token,
  //         );
  //         if (facebookUserData && facebookUserData.id) {
  //           userSocialId = facebookUserData.id;
  //           userSocialEmail = facebookUserData.email;
  //           userSocialFullname = facebookUserData.name;
  //           userSocialAvatarUrl =
  //             (facebookUserData.picture &&
  //               facebookUserData.picture.data &&
  //               facebookUserData.picture.data.url) ||
  //             null;
  //           userQuery['facebookId'] = userSocialId;
  //         }
  //         break;
  //       }
  //       case UserSocialConnectionType.GOOGLE: {
  //         const googleUserData = await this.authService.verifyGoogleToken(
  //           signinDto.token,
  //         );
  //         if (googleUserData && googleUserData.sub) {
  //           userSocialId = googleUserData.sub;
  //           userSocialEmail = googleUserData.email;
  //           userSocialFullname = googleUserData.name;
  //           userSocialAvatarUrl = googleUserData.picture;
  //           userQuery['googleId'] = userSocialId;
  //         }
  //         break;
  //       }
  //       case UserSocialConnectionType.APPLE:
  //       default:
  //         break;
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   if (!userSocialId) {
  //     throw new HttpException(
  //       `Failed to verify token!`,
  //       HttpStatus.UNAUTHORIZED,
  //     );
  //   }

  //   let userFound = await this.userService.findOne(userQuery);

  //   if (!userFound || !userFound._id) {
  //     if (!userSocialEmail) {
  //       throw new HttpException(`Cannot get email!`, HttpStatus.UNAUTHORIZED);
  //     }

  //     userFound = await this.userService.findOne({
  //       email: userSocialEmail,
  //     });

  //     if (userFound && userFound._id) {
  //       throw new HttpException(
  //         'This social account did not link to any account yet!',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }

  //     let avatar = null;
  //     if (userSocialAvatarUrl) {
  //       const pathYear = path.join(
  //         __dirname,
  //         '..',
  //         '..',
  //         'public',
  //         'uploads',
  //         moment().get('year').toString(),
  //       );
  //       const pathMonth = path.join(
  //         pathYear,
  //         (moment().get('month') + 1).toString(),
  //       );
  //       const pathDay = path.join(pathMonth, moment().get('day').toString());
  //       if (!fs.existsSync(pathYear)) {
  //         fs.mkdirSync(pathYear);
  //       }
  //       if (!fs.existsSync(pathMonth)) {
  //         fs.mkdirSync(pathMonth);
  //       }
  //       if (!fs.existsSync(pathDay)) {
  //         fs.mkdirSync(pathDay);
  //       }

  //       const downloader = new FileDownloader({
  //         url: userSocialAvatarUrl,
  //         directory: pathDay, //This folder will be created, if it doesn't exist.
  //       });

  //       const { filePath, downloadStatus } = await downloader.download();
  //       if (
  //         downloadStatus == 'COMPLETE' &&
  //         filePath &&
  //         fs.existsSync(filePath)
  //       ) {
  //         const uniqueSuffix = `${moment().format(
  //           'HHmmssDDMMYYYY',
  //         )}${Math.round(Math.random() * 1e6)}`;
  //         const fileName = `${
  //           path.basename(filePath).split('.')[0]
  //         }-${uniqueSuffix}.${path.basename(filePath).split('.')[1]}`;
  //         const newFilePath = path.join(pathDay, fileName);
  //         fs.copyFileSync(filePath, newFilePath);
  //         fs.unlinkSync(filePath);
  //         if (fs.existsSync(newFilePath)) {
  //           avatar = newFilePath.split('/public/')[1];
  //         }
  //       }
  //     }

  //     const userCreated = await this.userService.create({
  //       email: userSocialEmail,
  //       fullname: userSocialFullname,
  //       facebookId:
  //         signinDto.provider == UserSocialConnectionType.FACEBOOK
  //           ? userSocialId
  //           : null,
  //       appleId:
  //         signinDto.provider == UserSocialConnectionType.APPLE
  //           ? userSocialId
  //           : null,
  //       googleId:
  //         signinDto.provider == UserSocialConnectionType.GOOGLE
  //           ? userSocialId
  //           : null,
  //       verified: true,
  //       avatar: avatar,
  //     });

  //     if (userCreated && userCreated._id) {
  //       const payload = this.authService.getUserPayload(userCreated);

  //       return {
  //         access_token: this.jwtService.sign(payload, {
  //           secret: configuration().jwt.secret,
  //         }),
  //         user: this.authService.getUserResponseBody(userCreated),
  //       };
  //     }

  //     throw new HttpException('Signup failed!', HttpStatus.BAD_GATEWAY);
  //   }

  //   const payload = {
  //     email: userFound.email,
  //     userType: userFound.userType,
  //     _id: userFound._id,
  //   };

  //   const loginData = {
  //     access_token: this.jwtService.sign(payload, {
  //       secret: configuration().jwt.secret,
  //     }),
  //     user: this.authService.getUserResponseBody(userFound),
  //   };

  //   return {
  //     data: loginData,
  //   };
  // }

  @Post('student/signin')
  async studentSignin(@Body() studentSigninDto: StudentSigninDto) {
    const requireFields = ['studentCode', 'orderNumber'];
    for (let i = 0; i < requireFields.length; i++) {
      const field = requireFields[i];
      if (
        !studentSigninDto[field] ||
        !studentSigninDto[field].toString().trim()
      ) {
        throw new HttpException(
          `Field ${field} is required!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const studentProfile = await this.studentProfileService.findOne({
      studentCode: studentSigninDto.studentCode.trim(),
    });

    if (!studentProfile || !studentProfile._id) {
      throw new HttpException('Student not exists!', HttpStatus.NOT_FOUND);
    }

    console.log(studentProfile.user);

    const userFound = await this.userService.findOne({
      _id: (
        (studentProfile.user && studentProfile.user._id) ||
        studentProfile.user
      ).toString(),
    });

    if (!userFound || !userFound._id || userFound.deleted) {
      throw new HttpException(
        'Student account not exists!',
        HttpStatus.NOT_FOUND,
      );
    }

    const examinationFound = await this.examinationService.findOne({
      active: true,
      studentIds: { $in: [studentProfile._id.toString()] },
    });
    
    const studentOrderNumber = (examinationFound && examinationFound.studentIds || [])
    .map((studentId) =>
      ((studentId && studentId._id) || studentId).toString(),
    )
    .indexOf(studentProfile._id.toString()) + 1;

    if (!examinationFound || !examinationFound._id || studentOrderNumber != studentSigninDto.orderNumber) {
      throw new HttpException(
        'You do not have any examination!',
        HttpStatus.NOT_FOUND,
      );
    }

    const payload = {
      username: userFound.username,
      email: userFound.email,
      userType: userFound.userType,
      studentCode: studentProfile.studentCode,
      _id: userFound._id,
    };

    const loginData = {
      access_token: this.jwtService.sign(payload, {
        secret: configuration().jwt.secret,
      }),
      user: this.authService.getUserResponseBody(userFound),
      examination: examinationFound,
      student: studentProfile,
    };

    return {
      data: loginData,
    };
  }

  @Post('signin')
  @ApiOperation({
    description: `Only need 'username' or 'email'`,
  })
  async signin(@Body() signinDto: SigninDto) {
    const requireFields = ['password'];
    for (let i = 0; i < requireFields.length; i++) {
      const field = requireFields[i];
      if (!signinDto[field] || !signinDto[field].trim()) {
        throw new HttpException(
          `Field ${field} is required!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const signinData = {
      email: (signinDto.email || '').trim().toLowerCase(),
      username: (signinDto.username || '').trim().toLowerCase(),
      password: signinDto.password,
    };

    if (!signinData.email && !signinData.username) {
      throw new HttpException(
        `You need to provide email or username!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (signinData.email && !verifyEmail(signinData.email)) {
      throw new HttpException(
        `Email is not in correct format!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    let userFound;

    if (signinData.email) {
      userFound = await this.userService.findOne({
        email: signinData.email,
      });
    } else if (signinData.username) {
      userFound = await this.userService.findOne({
        username: signinData.username,
      });
    }

    if (!userFound || !userFound._id || userFound.deleted) {
      throw new HttpException('Account not exists!', HttpStatus.NOT_FOUND);
    }

    if (!userFound.password) {
      throw new HttpException(
        'This account cannot login with password!',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      !signinData.password ||
      !bcrypt.compareSync(signinData.password, userFound.password)
    ) {
      throw new HttpException('Wrong password!', HttpStatus.BAD_REQUEST);
    }

    const payload = {
      username: userFound.username,
      email: userFound.email,
      userType: userFound.userType,
      _id: userFound._id,
    };

    const loginData = {
      access_token: this.jwtService.sign(payload, {
        secret: configuration().jwt.secret,
      }),
      user: this.authService.getUserResponseBody(userFound),
    };

    return {
      data: loginData,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req) {
    const user = req.user;
    if (user && user._id) {
      const userFound = await this.userService.findOne({ _id: user._id });

      if (userFound && userFound._id) {
        let studentProfileFound;
  
        if (user.studentCode) {
          studentProfileFound = await this.studentProfileService.findOne({
            studentCode: user.studentCode,
            user: userFound._id.toString(),
          });
        }

        return {
          ...this.authService.getUserResponseBody(userFound),
          student: studentProfileFound,
        };
      }
    }
    throw new HttpException('Unauthenticated!', HttpStatus.UNAUTHORIZED);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Request() req,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const user = req.user;
    if (user && user._id) {
      const userFound = await this.userService.findOne({
        _id: user._id,
      });
      if (userFound && userFound._id) {
        if (!userFound.password) {
          throw new HttpException(
            'You cannot update password for this account!',
            HttpStatus.BAD_REQUEST,
          );
        }

        if (
          !updatePasswordDto.currentPassword ||
          !updatePasswordDto.newPassword
        ) {
          throw new HttpException(
            'Current password or new password missing!',
            HttpStatus.BAD_REQUEST,
          );
        }
        if (
          !bcrypt.compareSync(
            updatePasswordDto.currentPassword,
            userFound.password,
          )
        ) {
          throw new HttpException(
            'Current password not correct!',
            HttpStatus.BAD_REQUEST,
          );
        }
        await this.userService.update(userFound._id.toString(), {
          password: bcrypt.hashSync(updatePasswordDto.newPassword, bcryptSalt),
        });
        return true;
      }
    }
    throw new HttpException('Unauthenticated!', HttpStatus.UNAUTHORIZED);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('update-profile')
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const user = req.user;
    if (user && user._id) {
      const userFound = await this.userService.findOne({ _id: user._id });
      if (userFound && userFound._id) {
        const userUpdated = await this.userService.update(user._id, {
          dob: updateProfileDto.dob || moment(userFound.dob).toISOString(),
          fullname: updateProfileDto.fullname || userFound.fullname,
        });
        return this.authService.getUserResponseBody(userUpdated);
      }
    }
    throw new HttpException('Unauthenticated!', HttpStatus.UNAUTHORIZED);
  }
}
