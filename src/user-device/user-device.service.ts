import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PagingDto } from '../dtos/paging.dto';
import { CreateUserDeviceDto } from './dto/create-user-device.input';
import { UpdateUserDeviceDto } from './dto/update-user-device.input';
import { UserDeviceSortDto } from './dto/user-device-sort.dto';
import { UserDeviceFilterDto } from './dto/user-device.filter';
import { UserDevice, UserDeviceDocument } from './user-device.schema';

@Injectable()
export class UserDeviceService {
  constructor(
    @InjectModel(UserDevice.name)
    private readonly userDeviceModel: Model<UserDeviceDocument>,
  ) {}

  filterTransform(filter: UserDeviceFilterDto) {
    let _filter = {};

    if (filter && Object.keys(filter).length > 0) {
      for(let key in filter) {
        _filter[key] = filter[key];
      }
    }
    
    return _filter;
  }

  async create(
    createUserDeviceDto: CreateUserDeviceDto,
  ): Promise<UserDevice> {
    const createdDoc = await this.userDeviceModel.create(
      createUserDeviceDto,
    );
    return createdDoc && createdDoc.toObject() || null;
  }

  async update(
    id: string,
    updateUserDeviceDto: UpdateUserDeviceDto,
  ): Promise<UserDevice> {
    const updatedDoc = await this.userDeviceModel.findByIdAndUpdate(
      id,
      {
        $set: updateUserDeviceDto,
      },
      { new: true },
    );
    return updatedDoc && updatedDoc.toObject() || null;
  }

  async findAll(sort?: UserDeviceSortDto, filter?: UserDeviceFilterDto): Promise<UserDevice[]> {
    return this.userDeviceModel
      .find({
        ...this.filterTransform(filter),
      })
      .sort({ ...(sort || { createdAt: -1 }) })
  }

  async countDocuments(filter?: UserDeviceFilterDto): Promise<number> {
    return this.userDeviceModel.countDocuments({
      ...this.filterTransform(filter),
    });
  }

  async query(
    paging: PagingDto = { page: 1, pageSize: 10 },
    sort?: UserDeviceSortDto,
    filter?: UserDeviceFilterDto,
  ): Promise<UserDevice[]> {
    const { page = 1, pageSize = 10 } = paging;

    return this.userDeviceModel
      .find({
        ...this.filterTransform(filter),
      })
      .sort({ ...(sort || { createdAt: -1 }) })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
  }

  async findById(id: string): Promise<UserDevice> {
    const docFound = await this.userDeviceModel.findById(id);
    return docFound && docFound.toObject() || null;
  }

  async findOne(filter: UserDeviceFilterDto): Promise<UserDevice> {
    const docFound = await this.userDeviceModel.findOne(this.filterTransform(filter));
    return (docFound && docFound.toObject()) || null;
  }

  remove(id: string) {
    return this.userDeviceModel.findByIdAndDelete(id);
  }
}
