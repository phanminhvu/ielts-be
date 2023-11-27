import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PagingDto } from '../dtos/paging.dto';
import { CreateExamDto } from './dto/create-exam.dto';
import { ExamFilterDto } from './dto/exam-filter.dto';
import { ExamSortDto } from './dto/exam-sort.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam, ExamDocument } from './exam.schema';

@Injectable()
export class ExamService {
  constructor(
    @InjectModel(Exam.name)
    private readonly examModel: Model<ExamDocument>,
  ) {}

  filterTransform(filter: ExamFilterDto) {
    let _filter = {};

    if (filter && Object.keys(filter).length > 0) {
      for (let key in filter) {
        _filter[key] = filter[key];
      }
    }

    return _filter;
  }

  async create(createExamDto: CreateExamDto): Promise<Exam> {
    const createdDoc = await this.examModel.create(createExamDto);
    return (createdDoc && createdDoc.toObject()) || null;
  }

  async update(id: string, updateExamDto: UpdateExamDto): Promise<Exam> {
    const updatedDoc = await this.examModel.findByIdAndUpdate(
      id,
      {
        $set: updateExamDto,
      },
      { new: true },
    );
    return (updatedDoc && updatedDoc.toObject()) || null;
  }

  async findAll(
    sort?: ExamSortDto,
    filter?: ExamFilterDto,
  ): Promise<Exam[]> {
    return (
      await this.examModel
        .find({
          ...this.filterTransform(filter),
        })
        .sort({ ...(sort || { createdAt: -1 }) })
    ).map((docFound) => docFound.toObject());
  }

  async countDocuments(filter?: ExamFilterDto): Promise<number> {
    return this.examModel.countDocuments({
      ...this.filterTransform(filter),
    });
  }

  async query(
    paging: PagingDto = { page: 1, pageSize: 10 },
    sort?: ExamSortDto,
    filter?: ExamFilterDto,
  ): Promise<Exam[]> {
    const { page = 1, pageSize = 10 } = paging;

    return (
      await this.examModel
        .find({
          ...this.filterTransform(filter),
        })
        .sort({ ...(sort || { createdAt: -1 }) })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
    ).map((docFound) => docFound.toObject());
  }

  async findOneWithFullDetail(filter: ExamFilterDto): Promise<Exam> {
    const docFound = await this.examModel
      .findOne({
        ...this.filterTransform(filter),
      })
      .populate({
        path: 'readingDetail',
      })
      .populate({
        path: 'listeningDetail',
      })
      .populate({
        path: 'speakingDetail',
      })
      .populate('writingDetail');
    return (docFound && docFound.toObject()) || null;
  }

  async findById(id: string): Promise<Exam> {
    const docFound = await this.examModel.findById(id);
    return (docFound && docFound.toObject()) || null;
  }

  async findOne(filter: ExamFilterDto): Promise<Exam> {
    const docFound = await this.examModel.findOne({
      ...this.filterTransform(filter),
    });
    return (docFound && docFound.toObject()) || null;
  }

  remove(id: string) {
    return this.examModel.findByIdAndDelete(id);
  }

  async getNewExamCode() {
    const docFound = await this.examModel.findOne({}).sort({ examCode: -1 });
    return (
      (((docFound && docFound.toObject()) || { examCode: 0 }).examCode || 0) + 1
    );
  }
}
