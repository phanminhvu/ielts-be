import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PagingDto } from '../dtos/paging.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionSortDto } from './dto/question-sort.dto';
import { QuestionFilterDto } from './dto/question.filter';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question, QuestionDocument } from './question.schema';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
  ) {}

  filterTransform(filter: QuestionFilterDto) {
    let _filter = {};

    if (filter && Object.keys(filter).length > 0) {
      for (let key in filter) {
        _filter[key] = filter[key];
      }
    }

    return _filter;
  }

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const createdDoc = await this.questionModel.create(createQuestionDto);
    return (createdDoc && createdDoc.toObject()) || null;
  }

  async createBulk(
    createQuestionDto: CreateQuestionDto[],
  ): Promise<Question[]> {
    const createdDocs = await this.questionModel.create(createQuestionDto);
    return (
      createdDocs &&
      createdDocs.map((createdDoc) => createdDoc.toObject() || null)
    );
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    const updatedDoc = await this.questionModel.findByIdAndUpdate(
      id,
      {
        $set: updateQuestionDto,
      },
      { new: true },
    );
    return (updatedDoc && updatedDoc.toObject()) || null;
  }

  async findAll(
    sort?: QuestionSortDto,
    filter?: QuestionFilterDto,
  ): Promise<Question[]> {
    return (
      await this.questionModel
        .find({
          ...this.filterTransform(filter),
          deleted: { $ne: true },
        })
        .sort({ ...(sort || { questionPartNumber: 1, blankNumber: 1 }) })
    ).map((item) => item.toObject());
  }

  async countDocuments(filter?: QuestionFilterDto): Promise<number> {
    return this.questionModel.countDocuments({
      ...this.filterTransform(filter),
      deleted: { $ne: true },
    });
  }

  async query(
    paging: PagingDto = { page: 1, pageSize: 10 },
    sort?: QuestionSortDto,
    filter?: QuestionFilterDto,
  ): Promise<Question[]> {
    const { page = 1, pageSize = 10 } = paging;

    return this.questionModel
      .find({
        ...this.filterTransform(filter),
        deleted: { $ne: true },
      })
      .sort({ ...(sort || { questionPartNumber: 1, blankNumber: 1 }) })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
  }

  async findById(id: string): Promise<Question> {
    const docFound = await this.questionModel.findById(id);
    return (docFound && docFound.toObject()) || null;
  }

  async findOne(filter: QuestionFilterDto): Promise<Question> {
    const docFound = await this.questionModel.findOne({
      ...this.filterTransform(filter),
      deleted: { $ne: true },
    });
    return (docFound && docFound.toObject()) || null;
  }

  remove(id: string) {
    return this.questionModel.findByIdAndUpdate(id, {
      deleted: true,
    });
  }

  removeMany(ids: string[]) {
    return this.questionModel.updateMany(
      {
        _id: { $in: ids },
      },
      {
        deleted: true,
      },
    );
  }

  async aggregation(aggregation: any[]): Promise<any[]> {
    return this.questionModel.aggregate(aggregation || []);
  }
}
