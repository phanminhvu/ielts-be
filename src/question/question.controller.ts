import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserType } from '../user/enums/user-type.enum';
import { QuestionService } from './question.service';
import { QuestionGroupService } from 'src/question-group/question-group.service';
import {
  CreateReadingQuestionInput,
  UpdateReadingQuestionInput,
} from './dto/create-update-reading-question.input';
import { QuestionSkill } from './../question-part/enums/question-skill.enum';
import { QuestionListDto } from './dto/question-list.query';
import { QuestionSortDto } from './dto/question-sort.dto';
import { QuestionOptionService } from './../question-option/question-option.service';
import { QuestionLevel } from './../question-part/enums/question-level.enum';
import {
  CreateWritingQuestionInput,
  UpdateWritingQuestionInput,
} from './dto/create-update-writing-question.input';
import { QuestionAnalysisType } from './enums/question-analysis-type.enum';
import { CreateSpeakingQuestionInput, UpdateSpeakingQuestionInput } from './dto/create-update-speaking-question.input';
import { CreateListeningQuestionInput, UpdateListeningQuestionInput } from './dto/create-update-listening-question.input';

@ApiTags('Question')
@Controller('questions')
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly questionGroupService: QuestionGroupService,
    private readonly questionOptionService: QuestionOptionService,
  ) {}

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('reading')
  async createReading(
    @Request() req,
    @Body()
    createReadingQuestionInput: CreateReadingQuestionInput,
  ) {
    const requireFields = ['groupId'];
    for (let i = 0; i < requireFields.length; i++) {
      const field = requireFields[i];
      if (
        !createReadingQuestionInput[field] ||
        ((typeof createReadingQuestionInput[field]).toLocaleLowerCase() ===
          'string' &&
          !createReadingQuestionInput[field].trim())
      ) {
        throw new HttpException(
          `Field ${field} is required!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const questionGroupFound = await this.questionGroupService.findOne({
      _id: createReadingQuestionInput.groupId,
    });
    if (
      !questionGroupFound ||
      !questionGroupFound._id ||
      questionGroupFound.deleted
    ) {
      throw new HttpException(
        `Question group not exists!`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.questionService.create({
      ...createReadingQuestionInput,
      skill: QuestionSkill.READING,
      level: QuestionLevel.A1,
    });
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('reading/:id')
  async updateReading(
    @Param('id') id: string,
    @Body() updateReadingQuestionInput: UpdateReadingQuestionInput,
  ) {
    const questionFound = await this.questionService.findOne({
      _id: id,
      skill: QuestionSkill.READING,
    });

    if (!questionFound || !questionFound._id || questionFound.deleted) {
      throw new HttpException(`Question not exists!`, HttpStatus.NOT_FOUND);
    }

    for (let key in updateReadingQuestionInput) {
      if (updateReadingQuestionInput[key] == undefined) {
        delete updateReadingQuestionInput[key];
      }
    }

    return this.questionService.update(id, updateReadingQuestionInput);
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('listening')
  async createListening(
    @Request() req,
    @Body()
    createListeningQuestionInput: CreateListeningQuestionInput,
  ) {
    const requireFields = ['groupId'];
    for (let i = 0; i < requireFields.length; i++) {
      const field = requireFields[i];
      if (
        !createListeningQuestionInput[field] ||
        ((typeof createListeningQuestionInput[field]).toLocaleLowerCase() ===
          'string' &&
          !createListeningQuestionInput[field].trim())
      ) {
        throw new HttpException(
          `Field ${field} is required!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const questionGroupFound = await this.questionGroupService.findOne({
      _id: createListeningQuestionInput.groupId,
    });
    if (
      !questionGroupFound ||
      !questionGroupFound._id ||
      questionGroupFound.deleted
    ) {
      throw new HttpException(
        `Question group not exists!`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.questionService.create({
      ...createListeningQuestionInput,
      skill: QuestionSkill.LISTENING,
      level: QuestionLevel.A1,
    });
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('listening/:id')
  async updateListening(
    @Param('id') id: string,
    @Body() updateListeningQuestionInput: UpdateListeningQuestionInput,
  ) {
    const questionFound = await this.questionService.findOne({
      _id: id,
      skill: QuestionSkill.LISTENING,
    });

    if (!questionFound || !questionFound._id || questionFound.deleted) {
      throw new HttpException(`Question not exists!`, HttpStatus.NOT_FOUND);
    }

    for (let key in updateListeningQuestionInput) {
      if (updateListeningQuestionInput[key] == undefined) {
        delete updateListeningQuestionInput[key];
      }
    }

    return this.questionService.update(id, updateListeningQuestionInput);
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    description: `analysisType: ${QuestionAnalysisType.COMPARISON} | ${QuestionAnalysisType.NONE}`,
  })
  @Post('writing')
  async createWriting(
    @Request() req,
    @Body()
    createWritingQuestionInput: CreateWritingQuestionInput,
  ) {
    const requireFields = ['questionText', 'title', 'questionPartNumber'];
    for (let i = 0; i < requireFields.length; i++) {
      const field = requireFields[i];
      if (
        !createWritingQuestionInput[field] ||
        ((typeof createWritingQuestionInput[field]).toLocaleLowerCase() ===
          'string' &&
          !createWritingQuestionInput[field].trim())
      ) {
        throw new HttpException(
          `Field ${field} is required!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const questionAnalysisTypes: string[] = Object.values(QuestionAnalysisType);
    if (
      createWritingQuestionInput.analysisType &&
      !questionAnalysisTypes.includes(createWritingQuestionInput.analysisType)
    ) {
      throw new HttpException(
        `'analysisType' value not correct!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!createWritingQuestionInput.questionPartNumber || createWritingQuestionInput.questionPartNumber <= 0) {
      throw new HttpException(
        `Invalid 'questionPartNumber' value!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.questionService.create({
      ...createWritingQuestionInput,
      skill: QuestionSkill.WRITING,
      level: QuestionLevel.A1,
    });
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    description: `analysisType: ${QuestionAnalysisType.COMPARISON} | ${QuestionAnalysisType.NONE}`,
  })
  @Patch('writing/:id')
  async updateWriting(
    @Param('id') id: string,
    @Body() updateWritingQuestionInput: UpdateWritingQuestionInput,
  ) {
    const questionFound = await this.questionService.findOne({
      _id: id,
      skill: QuestionSkill.WRITING,
    });

    if (!questionFound || !questionFound._id || questionFound.deleted) {
      throw new HttpException(`Question not exists!`, HttpStatus.NOT_FOUND);
    }

    for (let key in updateWritingQuestionInput) {
      if (updateWritingQuestionInput[key] == undefined) {
        delete updateWritingQuestionInput[key];
      }
    }

    const questionAnalysisTypes: string[] = Object.values(QuestionAnalysisType);
    if (
      updateWritingQuestionInput.analysisType &&
      !questionAnalysisTypes.includes(updateWritingQuestionInput.analysisType)
    ) {
      throw new HttpException(
        `'analysisType' value not correct!`,
        HttpStatus.BAD_REQUEST,
      );
    }


    if (updateWritingQuestionInput.questionPartNumber != undefined && updateWritingQuestionInput.questionPartNumber <= 0) {
      throw new HttpException(
        `Invalid 'questionPartNumber' value!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.questionService.update(id, updateWritingQuestionInput);
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('speaking')
  async createSpeaking(
    @Request() req,
    @Body()
    createSpeakingQuestionInput: CreateSpeakingQuestionInput,
  ) {
    const requireFields = ['questionText', 'questionAudio', 'groupId'];
    for (let i = 0; i < requireFields.length; i++) {
      const field = requireFields[i];
      if (
        !createSpeakingQuestionInput[field] ||
        ((typeof createSpeakingQuestionInput[field]).toLocaleLowerCase() ===
          'string' &&
          !createSpeakingQuestionInput[field].trim())
      ) {
        throw new HttpException(
          `Field ${field} is required!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const questionGroupFound = await this.questionGroupService.findOne({
      _id: createSpeakingQuestionInput.groupId,
    });
    if (
      !questionGroupFound ||
      !questionGroupFound._id ||
      questionGroupFound.deleted
    ) {
      throw new HttpException(
        `Question group not exists!`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.questionService.create({
      ...createSpeakingQuestionInput,
      skill: QuestionSkill.SPEAKING,
      level: QuestionLevel.A1,
    });
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('speaking/:id')
  async updateSpeaking(
    @Param('id') id: string,
    @Body() updateSpeakingQuestionInput: UpdateSpeakingQuestionInput,
  ) {
    const questionFound = await this.questionService.findOne({
      _id: id,
      skill: QuestionSkill.SPEAKING,
    });

    if (!questionFound || !questionFound._id || questionFound.deleted) {
      throw new HttpException(`Question not exists!`, HttpStatus.NOT_FOUND);
    }

    for (let key in updateSpeakingQuestionInput) {
      if (updateSpeakingQuestionInput[key] == undefined) {
        delete updateSpeakingQuestionInput[key];
      }
    }

    return this.questionService.update(id, updateSpeakingQuestionInput);
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @ApiOperation({
    description: `skill: ${QuestionSkill.LISTENING} | ${QuestionSkill.READING} | ${QuestionSkill.SPEAKING} | ${QuestionSkill.WRITING}`,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async query(@Query() query: QuestionListDto) {
    const page =
      query &&
      query.page &&
      Number.isSafeInteger(Number(query.page)) &&
      Number(query.page) > 0
        ? Number(query.page)
        : 1;
    const pageSize =
      query &&
      query.pageSize &&
      Number.isSafeInteger(Number(query.pageSize)) &&
      Number(query.pageSize) > 0
        ? Number(query.pageSize)
        : 10;
    const sortBy =
      query &&
      query.sort &&
      query.sort.trim() &&
      query.sort.trim().split(':').length == 2
        ? query.sort.trim().split(':')
        : null;

    const sortableFields = ['createdAt', 'updatedAt'];
    let questionSortDto: QuestionSortDto = null;
    if (
      sortBy &&
      sortBy.length == 2 &&
      sortableFields.includes(sortBy[0].trim()) &&
      ['ASC', 'DESC'].includes(sortBy[1].trim().toUpperCase())
    ) {
      questionSortDto = {
        [sortBy[0]]: sortBy[1].trim().toUpperCase() === 'ASC' ? 1 : -1,
      };
    }

    const questionQuery = {};

    if (
      query.skill &&
      query.skill.split(',') &&
      query.skill.split(',').length > 0
    ) {
      questionQuery['skill'] = query.skill.split(',');
    }

    const totalQuestions = await this.questionService.countDocuments(
      questionQuery,
    );
    const totalPage = Math.ceil(totalQuestions / pageSize);

    const questionList =
      page > 0 && page <= totalPage
        ? await this.questionService.query(
            { page, pageSize },
            questionSortDto,
            questionQuery,
          )
        : [];

    return {
      data: questionList,
      paging: {
        page,
        pageSize,
        totalPage,
        nextPage: page + 1 <= totalPage ? page + 1 : null,
        prevPage: page - 1 >= 1 ? page - 1 : null,
        total: totalQuestions,
      },
    };
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const questionFound = await this.questionService.findOne({
      _id: id,
    });

    if (!questionFound || !questionFound._id || questionFound.deleted) {
      throw new HttpException(`Question not exists!`, HttpStatus.NOT_FOUND);
    }

    return questionFound;
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id/options')
  async getQuestionOptions(@Param('id') id: string) {
    const questionFound = await this.questionService.findOne({
      _id: id,
      skill: QuestionSkill.READING,
    });

    if (!questionFound || !questionFound._id || questionFound.deleted) {
      throw new HttpException(`Question not exists!`, HttpStatus.NOT_FOUND);
    }

    const questionOptions = await this.questionOptionService.findAll({
      questionId: questionFound._id.toString(),
    });

    return questionOptions;
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const questionFound = await this.questionService.findOne({
      _id: id,
    });

    if (!questionFound || !questionFound._id || questionFound.deleted) {
      throw new HttpException(`Question not exists!`, HttpStatus.NOT_FOUND);
    }

    return this.questionService.remove(id);
  }
}
