import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { verifyEmail } from 'src/helpers/utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import configuration from '../common/configuration';
import { UserType } from '../user/enums/user-type.enum';
import { ExaminationService } from './../examination/examination.service';
import { UserService } from './../user/user.service';
import { CreateStudentProfileDto } from './dtos/create-student-profile.input';
import { StudentProfileListDto } from './dtos/student-profile-list.query';
import { StudentProfileSortDto } from './dtos/student-profile-sort.dto';
import { UpdateStudentProfileDto } from './dtos/update-student-profile.input';
import { StudentProfileService } from './student-profile.service';

@ApiTags('Student')
@Controller('students')
export class StudentProfileController {
  constructor(
    private readonly studentProfileService: StudentProfileService,
    private readonly examinationService: ExaminationService,
    private readonly userService: UserService,
  ) {}

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.MANAGETESTTAKERS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() createStudentProfileDto: CreateStudentProfileDto) {
    const requireFields = ['studentCode'];
    for (let i = 0; i < requireFields.length; i++) {
      const field = requireFields[i];
      if (
        !createStudentProfileDto[field] ||
        !createStudentProfileDto[field].trim()
      ) {
        throw new HttpException(
          `Field ${field} is required!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const newStudent: CreateStudentProfileDto = {
      ...createStudentProfileDto,
    };
    const studentEmail =
      newStudent.email ||
      `${newStudent.studentCode}${configuration().defaultEmailDomain}`;

    if (studentEmail && !verifyEmail(studentEmail)) {
      throw new HttpException(
        `Email is not in correct format!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    let userFound = await this.userService.findOne({
      username: newStudent.studentCode,
    });

    if (!userFound || !userFound._id) {
      userFound = await this.userService.findOne({
        email: studentEmail,
      });
    }

    if (!userFound || !userFound._id) {
      userFound = await this.userService.create({
        username: newStudent.studentCode,
        email: studentEmail,
        fullname: newStudent.fullname || null,
        dob: newStudent.dob || null,
        avatar: newStudent.image || null,
        verified: true,
      });
    }

    if (!userFound || !userFound._id) {
      throw new HttpException(
        `Internal server error!`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.studentProfileService.create({
      ...newStudent,
      candidateCode: userFound._id.toString(),
      user: userFound._id.toString(),
    });
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.MANAGETESTTAKERS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async query(@Query() query: StudentProfileListDto) {
    const page =
      query &&
      query.page &&
      Number.isSafeInteger(Number(query.page)) &&
      Number(query.page) > 0
        ? Number(query.page)
        : 1;
    const pageSize =
      query &&
      query.pageSize &&
      Number.isSafeInteger(Number(query.pageSize)) &&
      Number(query.pageSize) > 0
        ? Number(query.pageSize)
        : 10;
    const sortBy =
      query &&
      query.sort &&
      query.sort.trim() &&
      query.sort.trim().split(':').length == 2
        ? query.sort.trim().split(':')
        : null;

    const sortableFields = ['createdAt', 'updatedAt'];
    let studentProfileSort: StudentProfileSortDto = null;
    if (
      sortBy &&
      sortBy.length == 2 &&
      sortableFields.includes(sortBy[0].trim()) &&
      ['ASC', 'DESC'].includes(sortBy[1].trim().toUpperCase())
    ) {
      studentProfileSort = {
        [sortBy[0]]: sortBy[1].trim().toUpperCase() === 'ASC' ? 1 : -1,
      };
    }

    const totalStudentProfiles =
      await this.studentProfileService.countDocuments();
    const totalPage = Math.ceil(totalStudentProfiles / pageSize);

    const studentProfileList =
      page > 0 && page <= totalPage
        ? await this.studentProfileService.query(
            { page, pageSize },
            studentProfileSort,
          )
        : [];

    return {
      data: studentProfileList,
      paging: {
        page,
        pageSize,
        totalPage,
        nextPage: page + 1 <= totalPage ? page + 1 : null,
        prevPage: page - 1 >= 1 ? page - 1 : null,
        total: totalStudentProfiles,
      },
    };
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.MANAGETESTTAKERS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const studentProfileFound = await this.studentProfileService.findById(id);

    if (!studentProfileFound || !studentProfileFound._id) {
      throw new HttpException(`Student not exists!`, HttpStatus.NOT_FOUND);
    }

    return studentProfileFound;
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.MANAGETESTTAKERS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('student-code/:studentCode')
  async findByStudentCode(@Param('studentCode') studentCode: string) {
    const studentProfileFound = await this.studentProfileService.findOne({
      studentCode: studentCode,
    });

    if (!studentProfileFound || !studentProfileFound._id) {
      throw new HttpException(`Student not exists!`, HttpStatus.NOT_FOUND);
    }

    const userFound = await this.userService.findOne({
      _id: (
        (studentProfileFound.user && studentProfileFound.user._id) ||
        studentProfileFound.user
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
      studentIds: { $in: [studentProfileFound._id.toString()] },
    });

    if (examinationFound && examinationFound._id) {
      examinationFound['studentIdList'] = (
        examinationFound.studentIds || []
      ).map((studentId, index) => ({
        studentId: studentId.toString(),
        orderNumber: index + 1,
      }));
    }

    const examinationStudentProfile = (
      (examinationFound && examinationFound['studentIdList']) ||
      []
    ).find(
      (studentId) => studentId.studentId == studentProfileFound._id.toString(),
    );
    if (examinationFound) delete examinationFound['studentIdList'];

    return {
      student: studentProfileFound,
      examination: examinationFound,
      orderNumber:
        (examinationStudentProfile &&
          examinationStudentProfile['orderNumber']) ||
        null,
      user: userFound,
    };
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.MANAGETESTTAKERS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStudentProfileDto: UpdateStudentProfileDto,
  ) {
    const studentProfileFound = await this.studentProfileService.findById(id);

    if (!studentProfileFound || !studentProfileFound._id) {
      throw new HttpException(`Student not exists!`, HttpStatus.NOT_FOUND);
    }

    const updateData: UpdateStudentProfileDto = {
      fullname:
        updateStudentProfileDto.fullname &&
        updateStudentProfileDto.fullname.trim().toLocaleLowerCase(),
      gender: updateStudentProfileDto.gender,
      idCardNumber: updateStudentProfileDto.idCardNumber,
      phone: updateStudentProfileDto.phone,
      email: updateStudentProfileDto.email,
      majors: updateStudentProfileDto.majors,
      classroom: updateStudentProfileDto.classroom,
      dob: updateStudentProfileDto.dob,
      image: updateStudentProfileDto.image,
    };

    for (const key in updateData) {
      if (updateData[key] == undefined) {
        delete updateData[key];
      }
    }

    if (updateData.email && !verifyEmail(updateData.email)) {
      throw new HttpException(
        `Email is not in correct format!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.studentProfileService.update(id, updateData);
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.MANAGETESTTAKERS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const studentProfileFound = await this.studentProfileService.findById(id);

    if (!studentProfileFound || !studentProfileFound._id) {
      throw new HttpException(`Student not exists!`, HttpStatus.NOT_FOUND);
    }

    return this.studentProfileService.remove(id);
  }
}
