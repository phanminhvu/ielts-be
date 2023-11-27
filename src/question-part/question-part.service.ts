import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PagingDto } from '../dtos/paging.dto';
import { CreateQuestionPartDto } from './dto/create-question-part.dto';
import { QuestionPartFilterDto } from './dto/question-part-filter.dto';
import { QuestionPartSortDto } from './dto/question-part-sort.dto';
import { UpdateQuestionPartDto } from './dto/update-question-part.dto';
import { QuestionPart, QuestionPartDocument } from './question-part.schema';

@Injectable()
export class QuestionPartService {
  constructor(
    @InjectModel(QuestionPart.name)
    private readonly questionPartModel: Model<QuestionPartDocument>,
  ) {}

  filterTransform(filter: QuestionPartFilterDto) {
    let _filter = {};

    if (filter && Object.keys(filter).length > 0) {
      for (let key in filter) {
        _filter[key] = filter[key];
      }
    }

    return _filter;
  }

  async create(
    createQuestionPartDto: CreateQuestionPartDto,
  ): Promise<QuestionPart> {
    const createdDoc = await this.questionPartModel.create(
      createQuestionPartDto,
    );
    return (createdDoc && createdDoc.toObject()) || null;
  }

  async update(
    id: string,
    updateQuestionPartDto: UpdateQuestionPartDto,
  ): Promise<QuestionPart> {
    const updatedDoc = await this.questionPartModel.findByIdAndUpdate(
      id,
      {
        $set: updateQuestionPartDto,
      },
      { new: true },
    );
    return (updatedDoc && updatedDoc.toObject()) || null;
  }

  async findAll(
    sort?: QuestionPartSortDto,
    filter?: QuestionPartFilterDto,
  ): Promise<QuestionPart[]> {
    return this.questionPartModel
      .find({
        ...this.filterTransform(filter),
        deleted: { $ne: true },
      })
      .sort({ ...(sort || { partNumber: 1 }) });
  }

  async countDocuments(filter?: QuestionPartFilterDto): Promise<number> {
    return this.questionPartModel.countDocuments({
      ...this.filterTransform(filter),
      deleted: { $ne: true },
    });
  }

  async query(
    paging: PagingDto = { page: 1, pageSize: 10 },
    sort?: QuestionPartSortDto,
    filter?: QuestionPartFilterDto,
  ): Promise<QuestionPart[]> {
    const { page = 1, pageSize = 10 } = paging;

    return this.questionPartModel
      .find({
        ...this.filterTransform(filter),
        deleted: { $ne: true },
      })
      .sort({ ...(sort || { partNumber: 1 }) })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
  }

  async findById(id: string): Promise<QuestionPart> {
    const docFound = await this.questionPartModel.findById(id);
    return (docFound && docFound.toObject()) || null;
  }

  async findOne(filter: QuestionPartFilterDto): Promise<QuestionPart> {
    const docFound = await this.questionPartModel.findOne({
      ...this.filterTransform(filter),
      deleted: { $ne: true },
    });
    return (docFound && docFound.toObject()) || null;
  }

  remove(id: string) {
    return this.questionPartModel.findByIdAndUpdate(id, {
      deleted: true,
    });
  }

  async aggregation(
    aggregation: any[],
  ): Promise<any[]> {
    return this.questionPartModel.aggregate(aggregation || []);
  }
}
