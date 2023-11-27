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
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserType } from '../user/enums/user-type.enum';
import { NotificationService } from './notification.service';
import { NotificationListDto } from './dto/notification-list.query';
import { CreateNotificationDto } from './dto/create-notification.input';
import { NotificationSortDto } from './dto/notification-sort.dto';

@ApiTags('Notification')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(
    @Request() req,
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    const requireFields = ['title', 'content', 'receiver'];
    for (let i = 0; i < requireFields.length; i++) {
      const field = requireFields[i];
      if (
        !createNotificationDto[field] ||
        ((typeof createNotificationDto[field]).toLocaleLowerCase() ===
          'string' &&
          !createNotificationDto[field].trim())
      ) {
        throw new HttpException(
          `Field ${field} is required!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (
      Array.isArray(createNotificationDto.receiver) &&
      createNotificationDto.receiver.length == 0
    ) {
      throw new HttpException(
        `Should have at least one receiver!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (Array.isArray(createNotificationDto.receiver)) {
      const notifications = await this.notificationService.createBulk(
        createNotificationDto.receiver.map((receiver) => ({
          ...createNotificationDto,
          receiver: receiver,
          title: createNotificationDto.title.trim(),
          content: createNotificationDto.content.trim(),
        })),
      );

      return notifications;
    } else {
      return this.notificationService.create({
        ...createNotificationDto,
        title: createNotificationDto.title.trim(),
        content: createNotificationDto.content.trim(),
      });
    }
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async query(@Query() query: NotificationListDto) {
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
    let notificationSort: NotificationSortDto = null;
    if (
      sortBy &&
      sortBy.length == 2 &&
      sortableFields.includes(sortBy[0].trim()) &&
      ['ASC', 'DESC'].includes(sortBy[1].trim().toUpperCase())
    ) {
      notificationSort = {
        [sortBy[0]]: sortBy[1].trim().toUpperCase() === 'ASC' ? 1 : -1,
      };
    }

    const filter = {};

    const totalNotifications = await this.notificationService.countDocuments(
      filter,
    );
    const totalPage = Math.ceil(totalNotifications / pageSize);

    const notificationList =
      page > 0 && page <= totalPage
        ? await this.notificationService.query(
            { page, pageSize },
            notificationSort,
            filter,
          )
        : [];

    return {
      data: notificationList,
      paging: {
        page,
        pageSize,
        totalPage,
        nextPage: page + 1 <= totalPage ? page + 1 : null,
        prevPage: page - 1 >= 1 ? page - 1 : null,
        total: totalNotifications,
      },
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'FOR USER' })
  @Get('/list')
  async all(@Request() req, @Query() query: NotificationListDto) {
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
    let notificationSort: NotificationSortDto = null;
    if (
      sortBy &&
      sortBy.length == 2 &&
      sortableFields.includes(sortBy[0].trim()) &&
      ['ASC', 'DESC'].includes(sortBy[1].trim().toUpperCase())
    ) {
      notificationSort = {
        [sortBy[0]]: sortBy[1].trim().toUpperCase() === 'ASC' ? 1 : -1,
      };
    }

    const filter = {
      receiver: req.user._id,
    };

    const totalNotifications = await this.notificationService.countDocuments(
      filter,
    );
    const totalUnReadNotifications =
      await this.notificationService.countDocuments({
        ...filter,
        isRead: false,
      });
    const totalUnSeenNotifications =
      await this.notificationService.countDocuments({
        ...filter,
        isSeen: false,
      });
    const totalPage = Math.ceil(totalNotifications / pageSize);

    const notificationList =
      page > 0 && page <= totalPage
        ? await this.notificationService.query(
            { page, pageSize },
            notificationSort,
            filter,
          )
        : [];

    await Promise.all(
      notificationList
        .filter((notification) => !notification.isSeen)
        .map((notification) =>
          this.notificationService.update(notification._id.toString(), {
            isSeen: true,
          }),
        ),
    );

    return {
      data: notificationList,
      paging: {
        page,
        pageSize,
        totalPage,
        nextPage: page + 1 <= totalPage ? page + 1 : null,
        prevPage: page - 1 >= 1 ? page - 1 : null,
        total: totalNotifications,
        totalUnRead: totalUnReadNotifications,
        totalUnSeen: totalUnSeenNotifications,
      },
    };
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const notificationFound = await this.notificationService.findById(id);

    if (
      !notificationFound ||
      !notificationFound._id ||
      notificationFound.deleted
    ) {
      throw new HttpException(`Notification not exists!`, HttpStatus.NOT_FOUND);
    }

    return notificationFound;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  async update(@Request() req, @Param('id') id: string) {
    const notificationFound = await this.notificationService.findById(id);

    if (
      !notificationFound ||
      !notificationFound._id ||
      notificationFound.deleted
    ) {
      throw new HttpException(`Notification not exists!`, HttpStatus.NOT_FOUND);
    }

    if (notificationFound.receiver != req.user._id) {
      throw new HttpException(
        `You are not allow to access this!`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.notificationService.update(id, {
      isRead: true,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const notificationFound = await this.notificationService.findById(id);

    if (
      !notificationFound ||
      !notificationFound._id ||
      notificationFound.deleted
    ) {
      throw new HttpException(`Notification not exists!`, HttpStatus.NOT_FOUND);
    }

    if (notificationFound.receiver != req.user._id) {
      throw new HttpException(
        `You are not allow to access this!`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.notificationService.remove(id);
  }
}
