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
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as moment from 'moment';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QuestionOptionService } from './../question-option/question-option.service';
import { QuestionService } from './../question/question.service';
import { QuestionGroupService } from './../question-group/question-group.service';
import { QuestionPartService } from './../question-part/question-part.service';
import { QuestionSkill } from './../question-part/enums/question-skill.enum';
import { CreateExamDto } from './dto/create-exam.dto';
import { ExamService } from './exam.service';
import { UserType } from '../user/enums/user-type.enum';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ExamListDto } from './dto/exam-list.query';
import { ExamSortDto } from './dto/exam-sort.dto';

@ApiTags('Exam')
@Controller('exams')
export class ExamController {
  constructor(
    private readonly examService: ExamService,
    private readonly questionPartService: QuestionPartService,
    private readonly questionGroupService: QuestionGroupService,
    private readonly questionService: QuestionService,
    private readonly questionOptionService: QuestionOptionService,
  ) {}

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('')
  async create(@Request() req, @Body() createExamInput: CreateExamDto) {
    const requireFields = ['examName'];
    for (let i = 0; i < requireFields.length; i++) {
      const field = requireFields[i];
      if (
        !createExamInput[field] ||
        ((typeof createExamInput[field]).toLocaleLowerCase() === 'string' &&
          !createExamInput[field].trim())
      ) {
        throw new HttpException(
          `Field ${field} is required!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (
      createExamInput.listeningIds &&
      createExamInput.listeningIds.length > 0
    ) {
      const questionPartCount = await this.questionPartService.countDocuments({
        _id: createExamInput.listeningIds,
        skill: QuestionSkill.LISTENING,
      });
      if (questionPartCount != createExamInput.listeningIds.length) {
        throw new HttpException(
          `Incorrect listening part id!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (createExamInput.readingIds && createExamInput.readingIds.length > 0) {
      const questionPartCount = await this.questionPartService.countDocuments({
        _id: createExamInput.readingIds,
        skill: QuestionSkill.READING,
      });
      if (questionPartCount != createExamInput.readingIds.length) {
        throw new HttpException(
          `Incorrect reading part id!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (createExamInput.speakingIds && createExamInput.speakingIds.length > 0) {
      const questionPartCount = await this.questionPartService.countDocuments({
        _id: createExamInput.speakingIds,
        skill: QuestionSkill.SPEAKING,
      });
      if (questionPartCount != createExamInput.speakingIds.length) {
        throw new HttpException(
          `Incorrect speaking part id!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (createExamInput.writingIds && createExamInput.writingIds.length > 0) {
      const questionCount = await this.questionService.countDocuments({
        _id: createExamInput.writingIds,
        skill: QuestionSkill.WRITING,
      });
      if (questionCount != createExamInput.writingIds.length) {
        throw new HttpException(
          `Incorrect writing question id!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const examCode = await this.examService.getNewExamCode();

    return this.examService.create({
      ...createExamInput,
      examCode,
    });
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('')
  async query(@Request() req, @Query() query: ExamListDto) {
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
    let examSort: ExamSortDto = null;
    if (
      sortBy &&
      sortBy.length == 2 &&
      sortableFields.includes(sortBy[0].trim()) &&
      ['ASC', 'DESC'].includes(sortBy[1].trim().toUpperCase())
    ) {
      examSort = {
        [sortBy[0]]: sortBy[1].trim().toUpperCase() === 'ASC' ? 1 : -1,
      };
    }

    const filter = {};

    const totalExams = await this.examService.countDocuments(filter);
    const totalPage = Math.ceil(totalExams / pageSize);

    const examList =
      page > 0 && page <= totalPage
        ? await this.examService.query({ page, pageSize }, examSort, filter)
        : [];

    return {
      data: examList,
      paging: {
        page,
        pageSize,
        totalPage,
        nextPage: page + 1 <= totalPage ? page + 1 : null,
        prevPage: page - 1 >= 1 ? page - 1 : null,
        total: totalExams,
      },
    };
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const examFound = await this.examService.findOneWithFullDetail({
      _id: id,
    });

    if (!examFound || !examFound._id) {
      throw new HttpException(`Exam not exists!`, HttpStatus.NOT_FOUND);
    }

    const questionGroups = await this.questionGroupService.findAll(null, {
      partId: [
        ...(examFound.readingIds || []),
        ...(examFound.listeningIds || []),
        ...(examFound.speakingIds || []),
      ].map((item) => (item._id || item).toString()),
    });
    const questions = await this.questionService.findAll(null, {
      groupId: (questionGroups || []).map((item) =>
        (item._id || item).toString(),
      ),
    });
    const questionOptions = await this.questionOptionService.findAll({
      questionId: (questions || []).map((item) =>
        (item._id || item).toString(),
      ),
    });

    const result = {
      ...examFound,
      readingDetail: (examFound['readingDetail'] || []).map(
        (questionPart, partIndex) => {
          return {
            _id: questionPart._id,
            partNumber: questionPart.partNumber || partIndex + 1,
            passageTitle: questionPart.passageTitle,
            passageText: questionPart.passageText,
            groups: questionGroups
              .filter(
                (questionGroup) =>
                  (
                    (questionGroup.partId && questionGroup.partId._id) ||
                    questionGroup.partId
                  ).toString() == questionPart._id.toString(),
              )
              .map((questionGroup, groupIndex) => ({
                _id: questionGroup._id,
                answerList: questionGroup.answerList,
                directionText: questionGroup.directionText,
                image: questionGroup.image,
                questionBox: questionGroup.questionBox,
                questionType: questionGroup.questionType,
                groupNumber: questionGroup.groupPartNumber || groupIndex + 1,
                questionTypeTips: questionGroup.questionTypeTips,
                questions: questions
                  .filter(
                    (question) =>
                      (
                        (question.groupId && question.groupId._id) ||
                        question.groupId
                      ).toString() == questionGroup._id.toString(),
                  )
                  .map((question) => {
                    return {
                      _id: question._id,
                      answer: question.answer,
                      explanationText: question.explanationText,
                      options: questionOptions
                        .filter(
                          (questionOption) =>
                            question._id.toString() ==
                            questionOption.questionId.toString(),
                        )
                        .map((questionOption) => ({
                          _id: questionOption._id,
                          key: questionOption.key,
                          text: questionOption.text,
                        })),
                      questionText: question.questionText,
                      blankNumber: question.blankNumber,
                    };
                  }),
              })),
          };
        },
      ),
      listeningDetail: (examFound['listeningDetail'] || []).map(
        (questionPart, partIndex) => {
          return {
            _id: questionPart._id,
            partNumber: questionPart.partNumber || partIndex + 1,
            partAudio: questionPart.partAudio,
            partTitle: questionPart.partTitle,
            groups: questionGroups
              .filter(
                (questionGroup) =>
                  (
                    (questionGroup.partId && questionGroup.partId._id) ||
                    questionGroup.partId
                  ).toString() == questionPart._id.toString(),
              )
              .map((questionGroup, groupIndex) => ({
                _id: questionGroup._id,
                answerList: questionGroup.answerList,
                directionText: questionGroup.directionText,
                image: questionGroup.image,
                questionBox: questionGroup.questionBox,
                questionType: questionGroup.questionType,
                groupNumber: questionGroup.groupPartNumber || groupIndex + 1,
                script: questionGroup.script,
                questionTypeTips: questionGroup.questionTypeTips,
                questions: questions
                  .filter(
                    (question) =>
                      (
                        (question.groupId && question.groupId._id) ||
                        question.groupId
                      ).toString() == questionGroup._id.toString(),
                  )
                  .map((question) => {
                    return {
                      _id: question._id,
                      answer: question.answer,
                      explanationText: question.explanationText,
                      options: questionOptions
                        .filter(
                          (questionOption) =>
                            question._id.toString() ==
                            questionOption.questionId.toString(),
                        )
                        .map((questionOption) => ({
                          _id: questionOption._id,
                          key: questionOption.key,
                          text: questionOption.text,
                        })),
                      questionText: question.questionText,
                      blankNumber: question.blankNumber,
                    };
                  }),
              })),
          };
        },
      ),
      speakingDetail: (examFound['speakingDetail'] || []).map(
        (questionPart, partIndex) => {
          return {
            _id: questionPart._id,
            partNumber: questionPart.partNumber || partIndex + 1,
            directionAudio: questionPart.directionAudio,
            groups: questionGroups
              .filter(
                (questionGroup) =>
                  (
                    (questionGroup.partId && questionGroup.partId._id) ||
                    questionGroup.partId
                  ).toString() == questionPart._id.toString(),
              )
              .map((questionGroup, groupIndex) => ({
                _id: questionGroup._id,
                groupNumber: questionGroup.groupPartNumber || groupIndex + 1,
                explanationText: questionGroup.explanationText,
                ideaSuggestion: questionGroup.ideaSuggestion,
                usefulGrammarNVocab: questionGroup.usefulGrammarNVocab,
                title: questionGroup.title,
                questions: questions
                  .filter(
                    (question) =>
                      (
                        (question.groupId && question.groupId._id) ||
                        question.groupId
                      ).toString() == questionGroup._id.toString(),
                  )
                  .map((question) => {
                    return {
                      _id: question._id,
                      questionAudio: question.questionAudio,
                      questionText: question.questionText,
                      modelAnswer: question.modelAnswer,
                      modelAnswerAudio: question.modelAnswerAudio,
                    };
                  }),
              })),
          };
        },
      ),
      writingDetail: (examFound['writingDetail'] || []).map(
        (question, questionIndex) => {
          return {
            _id: question._id,
            questionPartNumber: question.questionPartNumber,
            analysisType: question.analysisType,
            image: question.image,
            questionType: question.questionType,
            text: question.questionText,
            title: question.title,
            ideaSuggestion: question.ideaSuggestion,
            modelAnswer: question.modelAnswer,
            organization: question.organization,
            tips: question.tips,
            usefulGrammarNVocab: question.usefulGrammarNVocab,
          };
        },
      ),
    };

    let readingQuestionCount = 0;
    for (let i = 0; i < result.readingDetail.length; i++) {
      const questionPart = result.readingDetail[i];
      for (let j = 0; j < (questionPart.groups || []).length; j++) {
        const questionGroup = questionPart.groups[j];
        for (let k = 0; k < (questionGroup.questions || []).length; k++) {
          readingQuestionCount = readingQuestionCount + 1;
          result.readingDetail[i].groups[j].questions[k][
            'displayNumber'
          ] = `${readingQuestionCount}`;
        }
      }
    }

    let listeningQuestionCount = 0;
    for (let i = 0; i < result.listeningDetail.length; i++) {
      const questionPart = result.listeningDetail[i];
      for (let j = 0; j < (questionPart.groups || []).length; j++) {
        const questionGroup = questionPart.groups[j];
        for (let k = 0; k < (questionGroup.questions || []).length; k++) {
          listeningQuestionCount = listeningQuestionCount + 1;
          result.listeningDetail[i].groups[j].questions[k][
            'displayNumber'
          ] = `${listeningQuestionCount}`;
        }
      }
    }

    let speakingQuestionCount = 0;
    for (let i = 0; i < result.speakingDetail.length; i++) {
      const questionPart = result.speakingDetail[i];
      for (let j = 0; j < (questionPart.groups || []).length; j++) {
        const questionGroup = questionPart.groups[j];
        for (let k = 0; k < (questionGroup.questions || []).length; k++) {
          speakingQuestionCount = speakingQuestionCount + 1;
          result.speakingDetail[i].groups[j].questions[k][
            'displayNumber'
          ] = `${speakingQuestionCount}`;
        }
      }
    }

    return result;
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateExamInput: UpdateExamDto,
  ) {
    const examFound = await this.examService.findById(id);

    if (!examFound || !examFound._id) {
      throw new HttpException(`Exam not exists!`, HttpStatus.NOT_FOUND);
    }

    if (
      updateExamInput.listeningIds &&
      updateExamInput.listeningIds.length > 0
    ) {
      const questionPartCount = await this.questionPartService.countDocuments({
        _id: updateExamInput.listeningIds,
        skill: QuestionSkill.LISTENING,
      });
      if (questionPartCount != updateExamInput.listeningIds.length) {
        throw new HttpException(
          `Incorrect listening part id!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (updateExamInput.readingIds && updateExamInput.readingIds.length > 0) {
      const questionPartCount = await this.questionPartService.countDocuments({
        _id: updateExamInput.readingIds,
        skill: QuestionSkill.READING,
      });
      if (questionPartCount != updateExamInput.readingIds.length) {
        throw new HttpException(
          `Incorrect reading part id!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (updateExamInput.speakingIds && updateExamInput.speakingIds.length > 0) {
      const questionPartCount = await this.questionPartService.countDocuments({
        _id: updateExamInput.speakingIds,
        skill: QuestionSkill.SPEAKING,
      });
      if (questionPartCount != updateExamInput.speakingIds.length) {
        throw new HttpException(
          `Incorrect speaking part id!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (updateExamInput.writingIds && updateExamInput.writingIds.length > 0) {
      const questionCount = await this.questionService.countDocuments({
        _id: updateExamInput.writingIds,
        skill: QuestionSkill.WRITING,
      });
      if (questionCount != updateExamInput.writingIds.length) {
        throw new HttpException(
          `Incorrect writing question id!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const updateData = {
      ...updateExamInput,
    };

    for (let key in updateData) {
      if (updateData[key] == undefined) {
        delete updateData[key];
      }
    }

    return this.examService.update(id, updateData);
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const examFound = await this.examService.findById(id);

    if (!examFound || !examFound._id) {
      throw new HttpException(`Exam not exists!`, HttpStatus.NOT_FOUND);
    }

    return this.examService.remove(id);
  }
}
