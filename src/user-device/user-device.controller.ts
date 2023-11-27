import { MailerService } from '@nestjs-modules/mailer';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { randomCodeByLength } from '../helpers/utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { UserDeviceService } from './user-device.service';
import { CreateUserDeviceDto } from './dto/create-user-device.input';

@ApiTags('User Device')
@Controller('user-devices')
export class UserDeviceController {
  constructor(
    private readonly userDeviceService: UserDeviceService,
    private readonly userService: UserService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async upsert(
    @Request() req,
    @Body() createUserDeviceDto: CreateUserDeviceDto,
  ) {
    const userFound = await this.userService.findOne({
      _id: req.user._id,
    });

    if (!userFound || !userFound._id || userFound.deleted) {
      throw new HttpException(`Account not exists!`, HttpStatus.NOT_FOUND);
    }

    const userDeviceFound = await this.userDeviceService.findOne({
      user: req.user._id,
    });

    if (userDeviceFound && userDeviceFound._id) {
      return this.userDeviceService.update(userDeviceFound._id.toString(), {
        ...createUserDeviceDto,
      });
    }

    return this.userDeviceService.create({
      ...createUserDeviceDto,
      user: req.user._id,
    });
  }
}
