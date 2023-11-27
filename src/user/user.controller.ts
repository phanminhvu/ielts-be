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

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { verifyEmail } from '../helpers/utils';
import { CreateUserDto } from './dtos/create-user.input';
import { UpdateUserDto } from './dtos/update-user.input';
import { UserListDto } from './dtos/user-list.query';
import { UserSortDto } from './dtos/user-sort.dto';
import { UserType } from './enums/user-type.enum';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiOperation({
    description: `userType: ${UserType.TEACHER} | ${UserType.ADMIN} | ${UserType.SUPER_ADMIN}`,
  })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const userTypes: string[] = Object.values(UserType);
    const requireFields = ['email', 'password'];
    for (let i = 0; i < requireFields.length; i++) {
      const field = requireFields[i];
      if (!createUserDto[field] || !createUserDto[field].trim()) {
        throw new HttpException(
          `Field ${field} is required!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const newUser: CreateUserDto = {
      ...createUserDto,
      email: createUserDto.email.trim().toLocaleLowerCase(),
      password: createUserDto.password.trim(),
      verified: true,
    };

    if (
      newUser.userType &&
      (!userTypes.includes(newUser.userType) ||
        newUser.userType == UserType.USER)
    ) {
      throw new HttpException(
        `'userType' value not correct!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!verifyEmail(newUser.email)) {
      throw new HttpException(
        `Email is not in correct format!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const userFound = await this.userService.findOne({
      email: newUser.email,
    });

    if (userFound && userFound._id) {
      throw new HttpException('Email already in use!', HttpStatus.BAD_REQUEST);
    }

    return this.userService.create(newUser);
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async query(@Query() query: UserListDto) {
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
    const userQuery = {
      userType: {
        $ne: UserType.USER,
      },
    } as any;

    if (query.username) {
      userQuery.username = query.username;
    }

    if (query.email) {
      userQuery.email = query.email;
    }

    const sortableFields = ['email', 'fullname', 'createdAt', 'updatedAt'];
    let userSort: UserSortDto = null;
    if (
      sortBy &&
      sortBy.length == 2 &&
      sortableFields.includes(sortBy[0].trim()) &&
      ['ASC', 'DESC'].includes(sortBy[1].trim().toUpperCase())
    ) {
      userSort = {
        [sortBy[0]]: sortBy[1].trim().toUpperCase() === 'ASC' ? 1 : -1,
      };
    }
    const totalUsers = await this.userService.countDocuments(userQuery as any);
    const totalPage = Math.ceil(totalUsers / pageSize);

    const userList =
      page > 0 && page <= totalPage
        ? await this.userService.query(
            { page, pageSize },
            userSort,
            userQuery as any,
          )
        : [];

    return {
      data: userList,
      paging: {
        page,
        pageSize,
        totalPage,
        nextPage: page + 1 <= totalPage ? page + 1 : null,
        prevPage: page - 1 >= 1 ? page - 1 : null,
        total: totalUsers,
      },
    };
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const userFound = await this.userService.findById(id);

    if (!userFound || !userFound._id || userFound.deleted) {
      throw new HttpException(`Account not exists!`, HttpStatus.NOT_FOUND);
    }

    return userFound;
  }

  @ApiBearerAuth()
  @ApiOperation({
    description: `userType: ${UserType.TEACHER} | ${UserType.ADMIN} | ${UserType.SUPER_ADMIN}`,
  })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const userTypes: string[] = Object.values(UserType);

    const userFound = await this.userService.findOne({
      _id: id,
    });

    if (!userFound || !userFound._id) {
      throw new HttpException('Account not exists!', HttpStatus.NOT_FOUND);
    }

    const updateData: UpdateUserDto = {
      fullname:
        updateUserDto.fullname &&
        updateUserDto.fullname.trim().toLocaleLowerCase(),
      dob: updateUserDto.dob,
      avatar: updateUserDto.avatar,
      verified:
        updateUserDto.verified != null && updateUserDto.verified != undefined
          ? updateUserDto.verified
          : userFound.verified,
      userType:
        updateUserDto.userType != null && updateUserDto.userType != undefined
          ? updateUserDto.userType
          : userFound.userType,
    };

    for (const key in updateData) {
      if (updateData[key] == undefined) {
        delete updateData[key];
      }
    }

    if (
      updateData.userType &&
      (!userTypes.includes(updateData.userType) ||
        updateData.userType == UserType.USER)
    ) {
      throw new HttpException(
        `'userType' value not correct!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.userService.update(id, updateData);
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const userFound = await this.userService.findById(id);

    if (!userFound || !userFound._id || userFound.deleted) {
      throw new HttpException(`Account not exists!`, HttpStatus.NOT_FOUND);
    }

    return this.userService.remove(id);
  }
}
