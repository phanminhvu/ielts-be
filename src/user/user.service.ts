import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { PagingDto } from '../dtos/paging.dto';
import { bcryptSalt } from '../helpers/constants';
import { CreateUserDto } from './dtos/create-user.input';
import { UpdateUserDto } from './dtos/update-user.input';
import { UserSortDto } from './dtos/user-sort.dto';
import { UserFilterDto } from './dtos/user.filter';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  filterTransform(filter: UserFilterDto) {
    const _filter = {};

    if (filter && Object.keys(filter).length > 0) {
      for (const key in filter) {
        if (key == 'dateRange' && filter[key].length == 2) {
          _filter['createdAt'] = {
            $gte: filter[key][0],
            $lt: filter[key][1],
          };
        } else if (key === 'fullname' && filter[key]) {
          _filter[key] = { $regex: filter[key], $option: 'i' };
        } else {
          _filter[key] = filter[key];
        }
      }
    }

    return _filter;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password) {
      const hashPassword = await bcrypt.hashSync(
        createUserDto.password,
        bcryptSalt,
      );

      createUserDto = {
        ...createUserDto,
        password: hashPassword,
      };
    }

    const createdDoc = await this.userModel.create({
      ...createUserDto,
    });
    return (createdDoc && createdDoc.toObject()) || null;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedDoc = await this.userModel.findByIdAndUpdate(
      id,
      {
        $set: updateUserDto,
      },
      { new: true },
    );
    return (updatedDoc && updatedDoc.toObject()) || null;
  }

  async findAllUserIds(filter?: UserFilterDto): Promise<User[]> {
    return this.userModel.find(
      {
        ...this.filterTransform(filter),
        deleted: { $ne: true },
      },
      { _id: 1 },
    );
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find({});
  }

  async countDocuments(filter?: UserFilterDto): Promise<number> {
    const query = {
      ...this.filterTransform(filter),
      deleted: { $ne: true },
    } as any;
    if (filter.email) {
      query.email = { $regex: filter.email, $options: 'i' };
    }
    if (filter.username) {
      query.username = { $regex: filter.username, $options: 'i' };
    }
    return this.userModel.countDocuments(query);
  }

  async aggregation(aggregation: any[]): Promise<User[]> {
    return this.userModel.aggregate(aggregation || []);
  }

  async query(
    paging: PagingDto = { page: 1, pageSize: 10 },
    sort?: UserSortDto,
    filter?: UserFilterDto,
  ): Promise<User[]> {
    const { page = 1, pageSize = 10 } = paging;
    const query = {
      ...this.filterTransform(filter),
      deleted: { $ne: true },
    } as any;
    if (filter.email) {
      query.email = { $regex: filter.email, $options: 'i' };
    }
    if (filter.username) {
      query.username = { $regex: filter.username, $options: 'i' };
    }
    return this.userModel
      .find(query, {
        password: 0,
        verifyCode: 0,
        verifyCodeExpirationTime: 0,
        resetPasswordCode: 0,
        resetPasswordToken: 0,
        resetPasswordCodeExpirationTime: 0,
      })
      .sort({ ...(sort || { createdAt: -1 }) })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
  }

  async findOne(filter: UserFilterDto): Promise<User> {
    const docFound = await this.userModel.findOne(this.filterTransform(filter));
    return (docFound && docFound.toObject()) || null;
  }

  async getUserTypeById(id: string): Promise<User> {
    const docFound = await this.userModel.findById(id, {
      userType: 1,
      deleted: 1,
    });
    return (docFound && docFound.toObject()) || null;
  }

  async findById(id: string): Promise<User> {
    const docFound = await this.userModel.findById(id, {
      password: 0,
      verifyCode: 0,
      verifyCodeExpirationTime: 0,
      resetPasswordCode: 0,
      resetPasswordToken: 0,
      resetPasswordCodeExpirationTime: 0,
    });
    return (docFound && docFound.toObject()) || null;
  }

  async remove(id: string) {
    return this.userModel.findByIdAndUpdate(id, {
      deleted: true,
    });
  }
}
