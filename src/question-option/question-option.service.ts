import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PagingDto } from '../dtos/paging.dto';
import { CreateQuestionOptionDto } from './dto/create-question-option.dto';
import { QuestionOptionFilterDto } from './dto/question-option.filter';
import { UpdateQuestionOptionDto } from './dto/update-question-option.dto';
import {
  QuestionOption,
  QuestionOptionDocument,
} from './question-option.schema';

@Injectable()
export class QuestionOptionService {
  constructor(
    @InjectModel(QuestionOption.name)
    private readonly questionOptionModel: Model<QuestionOptionDocument>,
  ) {}

  filterTransform(filter: QuestionOptionFilterDto) {
    let _filter = {};

    if (filter && Object.keys(filter).length > 0) {
      for (let key in filter) {
        _filter[key] = filter[key];
      }
    }

    return _filter;
  }

  async create(
    createQuestionOptionDto: CreateQuestionOptionDto,
  ): Promise<QuestionOption> {
    const createdDoc = await this.questionOptionModel.create(
      createQuestionOptionDto,
    );
    return (createdDoc && createdDoc.toObject()) || null;
  }

  async createBulk(
    createQuestionDto: CreateQuestionOptionDto[],
  ): Promise<QuestionOption[]> {
    const createdDocs = await this.questionOptionModel.create(
      createQuestionDto,
    );
    return (
      createdDocs &&
      createdDocs.map((createdDoc) => createdDoc.toObject() || null)
    );
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionOptionDto,
  ): Promise<QuestionOption> {
    const updatedDoc = await this.questionOptionModel.findByIdAndUpdate(
      id,
      {
        $set: updateQuestionDto,
      },
      { new: true },
    );
    return (updatedDoc && updatedDoc.toObject()) || null;
  }

  async findAll(filter?: QuestionOptionFilterDto): Promise<QuestionOption[]> {
    return (
      await this.questionOptionModel
        .find({
          ...this.filterTransform(filter),
          deleted: { $ne: true },
        })
        .sort({ key: 1 })
    ).map((item) => item.toObject());
  }

  async countDocuments(filter?: QuestionOptionFilterDto): Promise<number> {
    return this.questionOptionModel.countDocuments({
      ...this.filterTransform(filter),
      deleted: { $ne: true },
    });
  }

  async query(
    paging: PagingDto = { page: 1, pageSize: 10 },
    filter?: QuestionOptionFilterDto,
  ): Promise<QuestionOption[]> {
    const { page = 1, pageSize = 10 } = paging;

    return this.questionOptionModel
      .find({
        ...this.filterTransform(filter),
        deleted: { $ne: true },
      })
      .sort({ key: 1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
  }

  async findById(id: string): Promise<QuestionOption> {
    const docFound = await this.questionOptionModel.findById(id);
    return (docFound && docFound.toObject()) || null;
  }

  async findOne(filter: QuestionOptionFilterDto): Promise<QuestionOption> {
    const docFound = await this.questionOptionModel.findOne({
      ...this.filterTransform(filter),
      deleted: { $ne: true },
    });
    return (docFound && docFound.toObject()) || null;
  }

  remove(id: string) {
    return this.questionOptionModel.findByIdAndUpdate(id, {
      deleted: true,
    });
  }

  removeMany(ids: string[]) {
    return this.questionOptionModel.updateMany(
      {
        _id: { $in: ids },
      },
      {
        deleted: true,
      },
    );
  }
}
