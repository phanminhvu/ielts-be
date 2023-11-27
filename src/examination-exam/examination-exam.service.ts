import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PagingDto } from '../dtos/paging.dto';
import { CreateExaminationExamDto } from './dto/create-examination-exam.dto';
import { ExaminationExamFilterDto } from './dto/examination-exam-filter.dto';
import { UpdateExaminationExamDto } from './dto/update-examination-exam.dto';
import {
  ExaminationExam,
  ExaminationExamDocument,
} from './examination-exam.schema';

@Injectable()
export class ExaminationExamService {
  constructor(
    @InjectModel(ExaminationExam.name)
    private readonly examinationExamModel: Model<ExaminationExamDocument>,
  ) {}

  filterTransform(filter: ExaminationExamFilterDto) {
    let _filter = {};

    if (filter && Object.keys(filter).length > 0) {
      for (let key in filter) {
        _filter[key] = filter[key];
      }
    }

    return _filter;
  }

  async create(
    createExaminationExamDto: CreateExaminationExamDto,
  ): Promise<ExaminationExam> {
    const createdDoc = await this.examinationExamModel.create(
      createExaminationExamDto,
    );
    return (createdDoc && createdDoc.toObject()) || null;
  }

  async createBulk(
    createExaminationExamDtos: CreateExaminationExamDto[],
  ): Promise<ExaminationExam[]> {
    const createdDocs = await this.examinationExamModel.create(
      createExaminationExamDtos,
    );
    return (
      (createdDocs &&
        createdDocs.map((createdDoc) => createdDoc.toObject())) || [null]
    );
  }

  async update(
    id: string,
    updateExaminationExamDto: UpdateExaminationExamDto,
  ): Promise<ExaminationExam> {
    const updatedDoc = await this.examinationExamModel.findByIdAndUpdate(
      id,
      {
        $set: updateExaminationExamDto,
      },
      { new: true },
    );
    return (updatedDoc && updatedDoc.toObject()) || null;
  }

  async findAll(filter?: ExaminationExamFilterDto): Promise<ExaminationExam[]> {
    return (
      await this.examinationExamModel
        .find({
          ...this.filterTransform(filter),
        })
        .sort({ createdAt: -1 })
    ).map((docFound) => docFound.toObject());
  }

  async countDocuments(filter?: ExaminationExamFilterDto): Promise<number> {
    return this.examinationExamModel.countDocuments({
      ...this.filterTransform(filter),
    });
  }

  async query(
    paging: PagingDto = { page: 1, pageSize: 10 },
    filter?: ExaminationExamFilterDto,
  ): Promise<ExaminationExam[]> {
    const { page = 1, pageSize = 10 } = paging;

    return (
      await this.examinationExamModel
        .find({
          ...this.filterTransform(filter),
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
    ).map((docFound) => docFound.toObject());
  }

  async findById(id: string): Promise<ExaminationExam> {
    const docFound = await this.examinationExamModel.findById(id);
    return (docFound && docFound.toObject()) || null;
  }

  async findOne(filter: ExaminationExamFilterDto): Promise<ExaminationExam> {
    const docFound = await this.examinationExamModel.findOne({
      ...this.filterTransform(filter),
    });
    return (docFound && docFound.toObject()) || null;
  }

  remove(id: string) {
    return this.examinationExamModel.findByIdAndDelete(id);
  }
}
