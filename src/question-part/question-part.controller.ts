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
import { QuestionPartService } from './question-part.service';
import { QuestionGroupService } from '../question-group/question-group.service';
import { QuestionLevel } from './enums/question-level.enum';
import { CreateUpdateReadingQuestionPartInput } from './dto/create-update-reading-question-part.input';
import { QuestionSkill } from './enums/question-skill.enum';
import { QuestionPartListDto } from './dto/question-part-list.query';
import { QuestionPartSortDto } from './dto/question-part-sort.dto';
import { CreateUpdateSpeakingQuestionPartInput } from './dto/create-update-speaking-question-part.input';
import { CreateUpdateListeningQuestionPartInput } from './dto/create-update-listening-question-part.input';

@ApiTags('Question Part')
@Controller('question-parts')
export class QuestionPartController {
  constructor(
    private readonly questionPartService: QuestionPartService,
    private readonly questionGroupService: QuestionGroupService,
  ) {}

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    // description: `level: ${QuestionLevel.A1} | ${QuestionLevel.A2} | ${QuestionLevel.B1} | ${QuestionLevel.B2} | ${QuestionLevel.A1} | ${QuestionLevel.A2}`,
  })
  @Post('reading')
  async createReading(
    @Request() req,
    @Body()
    createReadingQuestionPartInput: CreateUpdateReadingQuestionPartInput,
  ) {
    const requireFields = [
      'partNumber',
      'passageTitle',
      'passageText',
    ];
    for (let i = 0; i < requireFields.length; i++) {
      const field = requireFields[i];
      if (
        !createReadingQuestionPartInput[field] ||
        ((typeof createReadingQuestionPartInput[field]).toLocaleLowerCase() ===
          'string' &&
          !createReadingQuestionPartInput[field].trim())
      ) {
        throw new HttpException(
          `Field ${field} is required!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (!createReadingQuestionPartInput.partNumber || createReadingQuestionPartInput.partNumber <= 0) {
      throw new HttpException(
        `Invalid 'partNumber' value!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.questionPartService.create({
      ...createReadingQuestionPartInput,
      partNumber: createReadingQuestionPartInput.partNumber,
      skill: QuestionSkill.READING,
      level: QuestionLevel.A1,
    });
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    // description: `level: ${QuestionLevel.A1} | ${QuestionLevel.A2} | ${QuestionLevel.B1} | ${QuestionLevel.B2} | ${QuestionLevel.A1} | ${QuestionLevel.A2}`,
  })
  @Patch('reading/:id')
  async updateReading(
    @Param('id') id: string,
    @Body() updateReadingQuestionPartInput: CreateUpdateReadingQuestionPartInput,
  ) {
    const questionPartFound = await this.questionPartService.findOne({
      _id: id,
      skill: QuestionSkill.READING,
    });

    if (
      !questionPartFound ||
      !questionPartFound._id ||
      questionPartFound.deleted
    ) {
      throw new HttpException(
        `Question part not exists!`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (updateReadingQuestionPartInput.partNumber != undefined && updateReadingQuestionPartInput.partNumber <= 0) {
      throw new HttpException(
        `Invalid 'partNumber' value!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    for (let key in updateReadingQuestionPartInput) {
      if (updateReadingQuestionPartInput[key] == undefined) {
        delete updateReadingQuestionPartInput[key];
      }
    }

    return this.questionPartService.update(id, updateReadingQuestionPartInput);
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('speaking')
  async createSpeaking(
    @Request() req,
    @Body()
    createSpeakingQuestionPartInput: CreateUpdateSpeakingQuestionPartInput,
  ) {
    const requireFields = [
      'partNumber',
    ];
    for (let i = 0; i < requireFields.length; i++) {
      const field = requireFields[i];
      if (
        !createSpeakingQuestionPartInput[field] ||
        ((typeof createSpeakingQuestionPartInput[field]).toLocaleLowerCase() ===
          'string' &&
          !createSpeakingQuestionPartInput[field].trim())
      ) {
        throw new HttpException(
          `Field ${field} is required!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (!createSpeakingQuestionPartInput.partNumber || createSpeakingQuestionPartInput.partNumber <= 0) {
      throw new HttpException(
        `Invalid 'partNumber' value!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.questionPartService.create({
      ...createSpeakingQuestionPartInput,
      partNumber: createSpeakingQuestionPartInput.partNumber,
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
    @Body() updateSpeakingQuestionPartInput: CreateUpdateSpeakingQuestionPartInput,
  ) {
    const questionPartFound = await this.questionPartService.findOne({
      _id: id,
      skill: QuestionSkill.SPEAKING,
    });

    if (
      !questionPartFound ||
      !questionPartFound._id ||
      questionPartFound.deleted
    ) {
      throw new HttpException(
        `Question part not exists!`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (updateSpeakingQuestionPartInput.partNumber != undefined && updateSpeakingQuestionPartInput.partNumber <= 0) {
      throw new HttpException(
        `Invalid 'partNumber' value!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    for (let key in updateSpeakingQuestionPartInput) {
      if (updateSpeakingQuestionPartInput[key] == undefined) {
        delete updateSpeakingQuestionPartInput[key];
      }
    }

    return this.questionPartService.update(id, updateSpeakingQuestionPartInput);
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('listening')
  async createListening(
    @Request() req,
    @Body()
    createListeningQuestionPartInput: CreateUpdateListeningQuestionPartInput,
  ) {
    const requireFields = [
      'partNumber',
      'partTitle',
      'partAudio',
    ];
    for (let i = 0; i < requireFields.length; i++) {
      const field = requireFields[i];
      if (
        !createListeningQuestionPartInput[field] ||
        ((typeof createListeningQuestionPartInput[field]).toLocaleLowerCase() ===
          'string' &&
          !createListeningQuestionPartInput[field].trim())
      ) {
        throw new HttpException(
          `Field ${field} is required!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (!createListeningQuestionPartInput.partNumber || createListeningQuestionPartInput.partNumber <= 0) {
      throw new HttpException(
        `Invalid 'partNumber' value!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.questionPartService.create({
      ...createListeningQuestionPartInput,
      partNumber: createListeningQuestionPartInput.partNumber,
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
    @Body() updateListeningQuestionPartInput: CreateUpdateListeningQuestionPartInput,
  ) {
    const questionPartFound = await this.questionPartService.findOne({
      _id: id,
      skill: QuestionSkill.LISTENING,
    });

    if (
      !questionPartFound ||
      !questionPartFound._id ||
      questionPartFound.deleted
    ) {
      throw new HttpException(
        `Question part not exists!`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (updateListeningQuestionPartInput.partNumber != undefined && updateListeningQuestionPartInput.partNumber <= 0) {
      throw new HttpException(
        `Invalid 'partNumber' value!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    for (let key in updateListeningQuestionPartInput) {
      if (updateListeningQuestionPartInput[key] == undefined) {
        delete updateListeningQuestionPartInput[key];
      }
    }

    return this.questionPartService.update(id, updateListeningQuestionPartInput);
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @ApiOperation({
    description: `skill: ${QuestionSkill.LISTENING} | ${QuestionSkill.READING} | ${QuestionSkill.SPEAKING} | ${QuestionSkill.WRITING}`,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async query(@Query() query: QuestionPartListDto) {
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
    let questionPartSortDto: QuestionPartSortDto = null;
    if (
      sortBy &&
      sortBy.length == 2 &&
      sortableFields.includes(sortBy[0].trim()) &&
      ['ASC', 'DESC'].includes(sortBy[1].trim().toUpperCase())
    ) {
      questionPartSortDto = {
        [sortBy[0]]: sortBy[1].trim().toUpperCase() === 'ASC' ? 1 : -1,
      };
    }

    const questionPartQuery = {};

    if (
      query.skill &&
      query.skill.split(',') &&
      query.skill.split(',').length > 0
    ) {
      questionPartQuery['skill'] = query.skill.split(',');
    }

    const totalQuestionParts = await this.questionPartService.countDocuments(
      questionPartQuery,
    );
    const totalPage = Math.ceil(totalQuestionParts / pageSize);

    const questionPartList =
      page > 0 && page <= totalPage
        ? await this.questionPartService.query(
            { page, pageSize },
            questionPartSortDto,
            questionPartQuery,
          )
        : [];

    return {
      data: questionPartList,
      paging: {
        page,
        pageSize,
        totalPage,
        nextPage: page + 1 <= totalPage ? page + 1 : null,
        prevPage: page - 1 >= 1 ? page - 1 : null,
        total: totalQuestionParts,
      },
    };
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const questionPartFound = await this.questionPartService.findOne({
      _id: id,
    });

    if (
      !questionPartFound ||
      !questionPartFound._id ||
      questionPartFound.deleted
    ) {
      throw new HttpException(
        `Question part not exists!`,
        HttpStatus.NOT_FOUND,
      );
    }

    return questionPartFound;
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id/groups')
  async getQuestionGroups(@Param('id') id: string) {
    const questionPartFound = await this.questionPartService.findOne({
      _id: id,
    });

    if (
      !questionPartFound ||
      !questionPartFound._id ||
      questionPartFound.deleted
    ) {
      throw new HttpException(
        `Question part not exists!`,
        HttpStatus.NOT_FOUND,
      );
    }

    const questionGroups = await this.questionGroupService.findAll(null, { partId: questionPartFound._id.toString() });

    return questionGroups;
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const questionPartFound = await this.questionPartService.findOne({
      _id: id,
    });

    if (
      !questionPartFound ||
      !questionPartFound._id ||
      questionPartFound.deleted
    ) {
      throw new HttpException(
        `Question part not exists!`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.questionPartService.remove(id);
  }
}
