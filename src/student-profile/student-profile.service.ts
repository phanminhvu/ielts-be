import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { StudentProfile, StudentProfileDocument } from './student-profile.schema';
import { StudentProfileFilterDto } from './dtos/student-profile.filter';
import { UpdateStudentProfileDto } from './dtos/update-student-profile.input';
import { CreateStudentProfileDto } from './dtos/create-student-profile.input';
import { PagingDto } from 'src/dtos/paging.dto';
import { StudentProfileSortDto } from './dtos/student-profile-sort.dto';

@Injectable()
export class StudentProfileService {
  constructor(
    @InjectModel(StudentProfile.name) private readonly studentProfileModel: Model<StudentProfileDocument>,
  ) {}

  filterTransform(filter: StudentProfileFilterDto) {
    let _filter = {};

    if (filter && Object.keys(filter).length > 0) {
      for (let key in filter) {
        if (key === 'fullname' && filter[key]) {
          _filter[key] = { $regex: filter[key], $option: 'i' };
        } else {
          _filter[key] = filter[key];
        }
      }
    }

    return _filter;
  }

  async create(createStudentProfileDto: CreateStudentProfileDto): Promise<StudentProfile> {
    const createdDoc = await this.studentProfileModel.create({
      ...createStudentProfileDto,
    });
    return (createdDoc && createdDoc.toObject()) || null;
  }

  async update(id: string, updateStudentProfileDto: UpdateStudentProfileDto): Promise<StudentProfile> {
    const updatedDoc = await this.studentProfileModel.findByIdAndUpdate(
      id,
      {
        $set: updateStudentProfileDto,
      },
      { new: true },
    );
    return (updatedDoc && updatedDoc.toObject()) || null;
  }

  async findAll(filter?: StudentProfileFilterDto): Promise<StudentProfile[]> {
    return this.studentProfileModel.find({
      ...this.filterTransform(filter),
    });
  }

  async countDocuments(filter?: StudentProfileFilterDto): Promise<number> {
    return this.studentProfileModel.countDocuments({
      ...this.filterTransform(filter),
    });
  }

  async aggregation(aggregation: any[]): Promise<StudentProfile[]> {
    return this.studentProfileModel.aggregate(aggregation || []);
  }

  async query(
    paging: PagingDto = { page: 1, pageSize: 10 },
    sort?: StudentProfileSortDto,
    filter?: StudentProfileFilterDto,
  ): Promise<StudentProfile[]> {
    const { page = 1, pageSize = 10 } = paging;

    return this.studentProfileModel
      .find(
        {
          ...this.filterTransform(filter),
        },
      )
      .sort({ ...(sort || { createdAt: -1 }) })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
  }

  async findOne(filter: StudentProfileFilterDto): Promise<StudentProfile> {
    const docFound = await this.studentProfileModel.findOne(this.filterTransform(filter));
    return (docFound && docFound.toObject()) || null;
  }

  async findById(id: string): Promise<StudentProfile> {
    const docFound = await this.studentProfileModel.findById(id);
    return (docFound && docFound.toObject()) || null;
  }

  async remove(id: string) {
    return this.studentProfileModel.findByIdAndDelete(id);
  }
}
