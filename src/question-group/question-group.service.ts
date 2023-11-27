import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PagingDto } from '../dtos/paging.dto';
import { CreateQuestionGroupDto } from './dto/create-question-group.dto';
import { QuestionGroupSortDto } from './dto/question-group-sort.dto';
import { QuestionGroupFilterDto } from './dto/question-group.filter';
import { UpdateQuestionGroupDto } from './dto/update-question-group.dto';
import { QuestionGroup, QuestionGroupDocument } from './question-group.schema';

@Injectable()
export class QuestionGroupService {
  constructor(
    @InjectModel(QuestionGroup.name)
    private readonly questionGroupModel: Model<QuestionGroupDocument>,
  ) {}

  filterTransform(filter: QuestionGroupFilterDto) {
    let _filter = {};

    if (filter && Object.keys(filter).length > 0) {
      for(let key in filter) {
        _filter[key] = filter[key];
      }
    }
    
    return _filter;
  }

  async create(
    createQuestionGroupDto: CreateQuestionGroupDto,
  ): Promise<QuestionGroup> {
    const createdDoc = await this.questionGroupModel.create(
      createQuestionGroupDto,
    );
    return createdDoc && createdDoc.toObject() || null;
  }

  async update(
    id: string,
    updateQuestionGroupDto: UpdateQuestionGroupDto,
  ): Promise<QuestionGroup> {
    const updatedDoc = await this.questionGroupModel.findByIdAndUpdate(
      id,
      {
        $set: updateQuestionGroupDto,
      },
      { new: true },
    );
    return updatedDoc && updatedDoc.toObject() || null;
  }

  async findAll(sort?: QuestionGroupSortDto, filter?: QuestionGroupFilterDto): Promise<QuestionGroup[]> {
    return this.questionGroupModel
      .find({
        ...this.filterTransform(filter),
        deleted: { $ne: true },
      })
      .sort({ ...(sort || { groupPartNumber: 1 }) });
  }

  async countDocuments(filter?: QuestionGroupFilterDto): Promise<number> {
    return this.questionGroupModel.countDocuments({
      ...this.filterTransform(filter),
      deleted: { $ne: true },
    });
  }

  async query(
    paging: PagingDto = { page: 1, pageSize: 10 },
    sort?: QuestionGroupSortDto,
    filter?: QuestionGroupFilterDto,
  ): Promise<QuestionGroup[]> {
    const { page = 1, pageSize = 10 } = paging;

    return this.questionGroupModel
      .find({
        ...this.filterTransform(filter),
        deleted: { $ne: true },
      })
      .sort({ ...(sort || { groupPartNumber: 1 }) })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
  }

  async findById(id: string): Promise<QuestionGroup> {
    const docFound = await this.questionGroupModel.findById(id);
    return (docFound && docFound.toObject()) || null;
  }

  async findOne(filter: QuestionGroupFilterDto): Promise<QuestionGroup> {
    const docFound = await this.questionGroupModel.findOne({
      ...this.filterTransform(filter),
      deleted: { $ne: true },
    });
    return (docFound && docFound.toObject()) || null;
  }

  remove(id: string) {
    return this.questionGroupModel.findByIdAndUpdate(id, {
      deleted: true,
    });
  }
}
