import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PagingDto } from '../dtos/paging.dto';
import { CreateNotificationDto } from './dto/create-notification.input';
import { NotificationSortDto } from './dto/notification-sort.dto';
import { NotificationFilterDto } from './dto/notification.filter';
import { UpdateNotificationDto } from './dto/update-notification.input';
import { Notification, NotificationDocument } from './notification.schema';
import { FirebaseService } from '../core/firebase/firebase.service';
import { UserDeviceService } from '../user-device/user-device.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    private readonly userDeviceService: UserDeviceService,
    private readonly firebaseService: FirebaseService,
  ) {}

  filterTransform(filter: NotificationFilterDto) {
    let _filter = {};

    if (filter && Object.keys(filter).length > 0) {
      for (let key in filter) {
        _filter[key] = filter[key];
      }
    }

    return _filter;
  }

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const createdDoc = await this.notificationModel.create(
      createNotificationDto,
    );

    const receiverDevice = await this.userDeviceService.findOne({
      user: createdDoc.receiver.toString(),
    });
    if (receiverDevice && receiverDevice.pushToken) {
      this.firebaseService.sendNotification({
        notification: {
          title: createNotificationDto.title.trim(),
          body: createNotificationDto.content.trim(),
        },
        data: { data: JSON.stringify(createNotificationDto.data || {}).toString() },
        tokens: [receiverDevice.pushToken],
      });
    }

    return (createdDoc && createdDoc.toObject()) || null;
  }

  async createBulk(
    createNotificationDtos: CreateNotificationDto[],
  ): Promise<Notification[]> {
    const createdDocs = await this.notificationModel.create(
      createNotificationDtos,
    );

    const receiverDevices = await this.userDeviceService.findAll(
      {},
      {
        user: createdDocs.map((createdDoc) => createdDoc.receiver.toString()),
        pushToken: { $nin: [null, undefined, ''] },
      },
    );
    if (receiverDevices && receiverDevices.length > 0) {
      this.firebaseService.sendNotification({
        notification: {
          title: createdDocs[0].title.trim(),
          body: createdDocs[0].content.trim(),
        },
        data: { data: JSON.stringify(createdDocs[0].data || {}).toString() },
        tokens: receiverDevices.map(
          (receiverDevice) => receiverDevice.pushToken,
        ),
      });
    }

    return (
      (createdDocs &&
        createdDocs.map((createdDoc) => createdDoc.toObject())) || [null]
    );
  }

  async update(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    const updatedDoc = await this.notificationModel.findByIdAndUpdate(
      id,
      {
        $set: updateNotificationDto,
      },
      { new: true },
    );
    return (updatedDoc && updatedDoc.toObject()) || null;
  }

  async findAll(
    sort?: NotificationSortDto,
    filter?: NotificationFilterDto,
  ): Promise<Notification[]> {
    return this.notificationModel
      .find({
        ...this.filterTransform(filter),
        deleted: { $ne: true },
      })
      .sort({ ...(sort || { createdAt: -1 }) })
  }

  async countDocuments(filter?: NotificationFilterDto): Promise<number> {
    return this.notificationModel.countDocuments({
      ...this.filterTransform(filter),
      deleted: { $ne: true },
    });
  }

  async query(
    paging: PagingDto = { page: 1, pageSize: 10 },
    sort?: NotificationSortDto,
    filter?: NotificationFilterDto,
  ): Promise<Notification[]> {
    const { page = 1, pageSize = 10 } = paging;

    return this.notificationModel
      .find({
        ...this.filterTransform(filter),
        deleted: { $ne: true },
      })
      .sort({ ...(sort || { createdAt: -1 }) })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
  }

  async findById(id: string): Promise<Notification> {
    const docFound = await this.notificationModel.findById(id);
    return (docFound && docFound.toObject()) || null;
  }

  async findOne(filter: NotificationFilterDto): Promise<Notification> {
    const docFound = await this.notificationModel.findOne(
      this.filterTransform(filter),
    );
    return (docFound && docFound.toObject()) || null;
  }

  remove(id: string) {
    return this.notificationModel.findByIdAndUpdate(id, {
      deleted: true,
    });
  }
}
