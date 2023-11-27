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
import { QuestionService } from '../question/question.service';
import { QuestionOptionService } from './question-option.service';
import { CreateQuestionOptionInput, UpdateQuestionOptionInput } from './dto/create-update-question-option.input';

@ApiTags('Question Option')
@Controller('question-options')
export class QuestionOptionController {
  constructor(
    private readonly questionOptionService: QuestionOptionService,
    private readonly questionService: QuestionService,
  ) {}

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('')
  async create(
    @Request() req,
    @Body()
    createQuestionOptionInput: CreateQuestionOptionInput,
  ) {
    const requireFields = ['questionId', 'text'];
    for (let i = 0; i < requireFields.length; i++) {
      const field = requireFields[i];
      if (
        !createQuestionOptionInput[field] ||
        ((typeof createQuestionOptionInput[field]).toLocaleLowerCase() ===
          'string' &&
          !createQuestionOptionInput[field].trim())
      ) {
        throw new HttpException(
          `Field ${field} is required!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const questionFound = await this.questionService.findOne({
      _id: createQuestionOptionInput.questionId,
    });
    if (
      !questionFound ||
      !questionFound._id ||
      questionFound.deleted
    ) {
      throw new HttpException(
        `Question not exists!`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.questionOptionService.create({
      questionId: createQuestionOptionInput.questionId,
      text: createQuestionOptionInput.text,
    });
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuestionOptionInput: UpdateQuestionOptionInput,
  ) {
    const questionOptionFound = await this.questionOptionService.findOne({
      _id: id,
    });

    if (!questionOptionFound || !questionOptionFound._id || questionOptionFound.deleted) {
      throw new HttpException(`Question option not exists!`, HttpStatus.NOT_FOUND);
    }

    for (let key in updateQuestionOptionInput) {
      if (updateQuestionOptionInput[key] == undefined) {
        delete updateQuestionOptionInput[key];
      }
    }

    return this.questionOptionService.update(id, updateQuestionOptionInput);
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const questionOptionFound = await this.questionOptionService.findOne({
      _id: id,
    });

    if (!questionOptionFound || !questionOptionFound._id || questionOptionFound.deleted) {
      throw new HttpException(`Question option not exists!`, HttpStatus.NOT_FOUND);
    }

    return questionOptionFound;
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const questionOptionFound = await this.questionOptionService.findOne({
      _id: id,
    });

    if (!questionOptionFound || !questionOptionFound._id || questionOptionFound.deleted) {
      throw new HttpException(`Question option not exists!`, HttpStatus.NOT_FOUND);
    }

    return this.questionOptionService.remove(id);
  }
}
