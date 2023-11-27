import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PagingDto } from '../dtos/paging.dto';
import { CreateExaminationDto } from './dto/create-examination.input';
import { ExaminationSortDto } from './dto/examination-sort.dto';
import { ExaminationFilterDto } from './dto/examination.filter';
import { UpdateExaminationDto } from './dto/update-examination.input';
import { Examination, ExaminationDocument } from './examination.schema';

@Injectable()
export class ExaminationService {
  constructor(
    @InjectModel(Examination.name)
    private readonly examinationModel: Model<ExaminationDocument>,
  ) {}

  async create(
    createExaminationDto: CreateExaminationDto,
  ): Promise<Examination> {
    const createdDoc = await this.examinationModel.create(createExaminationDto);

    return (createdDoc && createdDoc.toObject()) || null;
  }

  async createBulk(
    createExaminationDtos: CreateExaminationDto[],
  ): Promise<Examination[]> {
    const createdDocs = await this.examinationModel.create(
      createExaminationDtos,
    );
    return (
      (createdDocs &&
        createdDocs.map((createdDoc) => createdDoc.toObject())) || [null]
    );
  }

  async update(
    id: string,
    updateExaminationDto: UpdateExaminationDto,
  ): Promise<Examination> {
    const updatedDoc = await this.examinationModel.findByIdAndUpdate(
      id,
      {
        $set: updateExaminationDto,
      },
      {
        new: true,
      },
    );
    return (updatedDoc && updatedDoc.toObject()) || null;
  }

  async findAll(
    filter,
    field?: any | null,
    option?: any | null,
    populate?: any | null,
  ): Promise<Examination[]> {
    return await this.examinationModel
      .find(filter, field, option)
      .populate(populate);
  }

  async countDocuments(filter?: ExaminationFilterDto): Promise<number> {
    return this.examinationModel.countDocuments({
      ...filter,
    });
  }

  async query(
    paging: PagingDto = { page: 1, pageSize: 10 },
    sort?: ExaminationSortDto,
    filter?: ExaminationFilterDto,
  ): Promise<Examination[]> {
    const { page = 1, pageSize = 10 } = paging;

    return (
      await this.examinationModel
        .find({
          ...filter,
        })
        .populate('studentDetails')
        .sort({ ...(sort || { createdAt: -1 }) })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
    ).map((item) => item.toObject());
  }

  async findById(id: string): Promise<Examination> {
    const docFound = await this.examinationModel.findById(id);
    return (docFound && docFound.toObject()) || null;
  }

  async findByIdWithFullDetail(id: string): Promise<Examination> {
    const docFound = await this.examinationModel
      .findById(id)
      .populate('studentDetails');
    return (docFound && docFound.toObject()) || null;
  }

  async findOne(filter: ExaminationFilterDto): Promise<Examination> {
    const docFound = await this.examinationModel
      .findOne(filter)
      .sort({ createdAt: -1 });
    return (docFound && docFound.toObject()) || null;
  }

  remove(id: string) {
    return this.examinationModel.findByIdAndDelete(id);
  }
}
