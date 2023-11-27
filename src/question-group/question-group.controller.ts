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
import { QuestionGroupService } from './question-group.service';
import { QuestionPartService } from '../question-part/question-part.service';
import { QuestionType } from './enums/question-type.enum';
import { QuestionSkill } from './../question-part/enums/question-skill.enum';
import { QuestionGroupListDto } from './dto/question-group-list.query';
import { QuestionGroupSortDto } from './dto/question-group-sort.dto';
import {
  CreateReadingQuestionGroupInput,
  UpdateReadingQuestionGroupInput,
} from './dto/create-update-reading-question-group.input';
import { QuestionService } from '../question/question.service';
import { QuestionLevel } from './../question-part/enums/question-level.enum';
import { QuestionOptionService } from '../question-option/question-option.service';
import {
  CreateSpeakingQuestionGroupInput,
  UpdateSpeakingQuestionGroupInput,
} from './dto/create-update-speaking-question-group.input';
import {
  CreateListeningQuestionGroupInput,
  UpdateListeningQuestionGroupInput,
} from './dto/create-update-listening-question-group.input';

@ApiTags('Question Group')
@Controller('question-groups')
export class QuestionGroupController {
  constructor(
    private readonly questionGroupService: QuestionGroupService,
    private readonly questionPartService: QuestionPartService,
    private readonly questionService: QuestionService,
    private readonly questionOptionService: QuestionOptionService,
  ) {}

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    description: `questionType: ${QuestionType.IDENTIFYING_INFORMATION} | ${QuestionType.MATCHING_HEADINGS} | ${QuestionType.MATCHING_SENTENCE_ENDINGS} | ${QuestionType.MULTIPLE_CHOICE_1_ANSWER} | ${QuestionType.NOTE_COMPLETION} | ${QuestionType.SUMMARY_COMPLETION} | ${QuestionType.SENTENCE_COMPLETION} | ${QuestionType.LABELLING_A_PLAN_MAP}`,
  })
  @Post('reading')
  async createReading(
    @Request() req,
    @Body()
    createReadingQuestionGroupInput: CreateReadingQuestionGroupInput,
  ) {
    const requireFields = ['questionType', 'directionText', 'partId'];
    for (let i = 0; i < requireFields.length; i++) {
      const field = requireFields[i];
      if (
        !createReadingQuestionGroupInput[field] ||
        ((typeof createReadingQuestionGroupInput[field]).toLocaleLowerCase() ===
          'string' &&
          !createReadingQuestionGroupInput[field].trim())
      ) {
        throw new HttpException(
          `Field ${field} is required!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const questionPartFound = await this.questionPartService.findOne({
      _id: createReadingQuestionGroupInput.partId,
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

    const questionTypes: string[] = Object.values(QuestionType);
    if (!questionTypes.includes(createReadingQuestionGroupInput.questionType)) {
      throw new HttpException(
        `'questionType' value not correct!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const questions = createReadingQuestionGroupInput.questions || [];

    const createReadingQuestionGroupData = {
      ...createReadingQuestionGroupInput,
    };

    delete createReadingQuestionGroupData.questions;

    const questionGroupCreated = await this.questionGroupService.create({
      ...createReadingQuestionGroupData,
      skill: QuestionSkill.READING,
      level: QuestionLevel.A1,
    });

    if (
      questionGroupCreated &&
      questionGroupCreated._id &&
      questions &&
      questions.length > 0
    ) {
      const questionsData = questions.map((question) => ({
        skill: QuestionSkill.READING,
        level: QuestionLevel.A1,
        answer: question.answer,
        explanationText: question.explanationText,
        questionText: question.questionText,
        blankNumber: question.blankNumber,
        groupId: questionGroupCreated._id.toString(),
      }));
      const questionsCreated = await this.questionService.createBulk(
        questionsData,
      );

      const questionOptionsData = questions
        .reduce(
          (total, question, questionIndex) => [
            ...total,
            ...question.options.map((option) => ({
              key: option.key,
              text: option.text,
              questionId:
                (questionsCreated[questionIndex] &&
                  questionsCreated[questionIndex]._id) ||
                null,
            })),
          ],
          [],
        )
        .filter((item) => !!item.questionId);

      const questionOptionsCreated =
        await this.questionOptionService.createBulk(questionOptionsData);
    }

    return questionGroupCreated;
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    description: `questionType: ${QuestionType.IDENTIFYING_INFORMATION} | ${QuestionType.MATCHING_HEADINGS} | ${QuestionType.MATCHING_SENTENCE_ENDINGS} | ${QuestionType.MULTIPLE_CHOICE_1_ANSWER} | ${QuestionType.NOTE_COMPLETION} | ${QuestionType.SUMMARY_COMPLETION} | ${QuestionType.SENTENCE_COMPLETION} | ${QuestionType.LABELLING_A_PLAN_MAP}`,
  })
  @Patch('reading/:id')
  async updateReading(
    @Param('id') id: string,
    @Body() updateReadingQuestionGroupInput: UpdateReadingQuestionGroupInput,
  ) {
    const questionGroupFound = await this.questionGroupService.findOne({
      _id: id,
      skill: QuestionSkill.READING,
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

    const questionTypes: string[] = Object.values(QuestionType);
    if (
      updateReadingQuestionGroupInput.questionType &&
      !questionTypes.includes(updateReadingQuestionGroupInput.questionType)
    ) {
      throw new HttpException(
        `'questionType' value not correct!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const updateData = {
      level: QuestionLevel.A1,
      answerList: updateReadingQuestionGroupInput.answerList,
      directionText: updateReadingQuestionGroupInput.directionText,
      image: updateReadingQuestionGroupInput.image,
      questionTypeTips: updateReadingQuestionGroupInput.questionTypeTips,
      questionBox: updateReadingQuestionGroupInput.questionBox,
      questionType: updateReadingQuestionGroupInput.questionType,
    };

    for (let key in updateData) {
      if (updateData[key] == undefined) {
        delete updateData[key];
      }
    }

    const questionGroupUpdated = await this.questionGroupService.update(
      id,
      updateData,
    );

    const questions = await this.questionService.findAll(null, {
      groupId: questionGroupFound._id.toString(),
    });
    const questionOptions = await this.questionOptionService.findAll({
      questionId: questions.map((question) => question._id.toString()),
    });

    const currentQuestionIds = questions.map((question) =>
      question._id.toString(),
    );
    const currentQuestionOptionIds = questionOptions.map((questionOption) =>
      questionOption._id.toString(),
    );

    // const questionsData = questions.map((question) => ({
    //   skill: QuestionSkill.READING,
    //   level: questionGroupFound.level,
    //   answer: question.answer,
    //   explanationText: question.explanationText,
    //   questionText: question.questionText,
    //   groupId: questionGroupFound._id.toString(),
    // }));

    if (
      updateReadingQuestionGroupInput.questions &&
      updateReadingQuestionGroupInput.questions.length > 0
    ) {
      const questionToUpdate = updateReadingQuestionGroupInput.questions.filter(
        (question) => question._id,
      );
      const questionToCreate = updateReadingQuestionGroupInput.questions.filter(
        (question) => !question._id,
      );
      const questionIdsToDelete = currentQuestionIds.filter(
        (questionId) =>
          !updateReadingQuestionGroupInput.questions
            .map((question) => question._id)
            .includes(questionId),
      );
      const questionOptionIdsToDelete = currentQuestionOptionIds.filter(
        (questionOptionId) =>
          !updateReadingQuestionGroupInput.questions
            .filter((question) => question._id)
            .reduce(
              (total, question) => [
                ...total,
                ...(question.options || [])
                  .filter((questionOption) => questionOption._id)
                  .map((questionOption) => questionOption._id),
              ],
              [],
            )
            .includes(questionOptionId),
      );
      const questionOptionToUpdate = updateReadingQuestionGroupInput.questions
        .filter((question) => question._id)
        .reduce(
          (total, question) => [
            ...total,
            ...(question.options || []).filter(
              (questionOption) =>
                questionOption._id &&
                currentQuestionOptionIds.includes(questionOption._id),
            ),
          ],
          [],
        );
      const questionOptionToCreate = updateReadingQuestionGroupInput.questions
        .filter((question) => question._id)
        .reduce(
          (total, question) => [
            ...total,
            ...(question.options || [])
              .filter((questionOption) => !questionOption._id)
              .map((questionOption) => ({
                key: questionOption.key,
                text: questionOption.text,
                questionId: question._id,
              })),
          ],
          [],
        );

      const results = await Promise.all([
        this.questionService.createBulk(
          questionToCreate.map((question) => ({
            skill: QuestionSkill.READING,
            level: QuestionLevel.A1,
            answer: question.answer,
            explanationText: question.explanationText,
            questionText: question.questionText,
            blankNumber: question.blankNumber,
            groupId: questionGroupFound._id.toString(),
          })),
        ),
        this.questionService.removeMany(questionIdsToDelete),
        this.questionOptionService.removeMany(questionOptionIdsToDelete),
        this.questionOptionService.createBulk(questionOptionToCreate),
        ...questionToUpdate.map((question) => {
          const questionUpdateData = {
            answer: question.answer,
            explanationText: question.explanationText,
            questionText: question.questionText,
            blankNumber: question.blankNumber,
          };
          for (let key in questionUpdateData) {
            if (questionUpdateData[key] == undefined)
              delete questionUpdateData[key];
          }
          return this.questionService.update(question._id, questionUpdateData);
        }),
        ...questionOptionToUpdate.map((questionOption) => {
          const questionOptionUpdateData = {
            text: questionOption.text,
            key: questionOption.key,
          };
          for (let key in questionOptionUpdateData) {
            if (questionOptionUpdateData[key] == undefined)
              delete questionOptionUpdateData[key];
          }
          return this.questionOptionService.update(
            questionOption._id,
            questionOptionUpdateData,
          );
        }),
      ]);
      const questionsCreated = results[0];
      const questionOptionsData = questionToCreate
        .reduce(
          (total, question, questionIndex) => [
            ...total,
            ...question.options.map((option) => ({
              key: option.key,
              text: option.text,
              questionId:
                (questionsCreated[questionIndex] &&
                  questionsCreated[questionIndex]._id) ||
                null,
            })),
          ],
          [],
        )
        .filter((item) => !!item.questionId);
      const questionOptionsCreated =
        await this.questionOptionService.createBulk(questionOptionsData);
    }

    return questionGroupUpdated;
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('reading/:id')
  async findOneReading(@Param('id') id: string) {
    const questionGroupFound = await this.questionGroupService.findOne({
      _id: id,
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

    const questions = await this.questionService.findAll(null, {
      groupId: questionGroupFound._id.toString(),
    });
    const questionOptions = await this.questionOptionService.findAll({
      questionId: questions.map((question) => question._id.toString()),
    });

    return {
      ...questionGroupFound,
      questions: questions.map((question) => ({
        ...question,
        options: questionOptions.filter(
          (questionOption) =>
            (
              (questionOption.questionId && questionOption.questionId._id) ||
              questionOption.questionId
            ).toString() == question._id.toString(),
        ),
      })),
    };
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    description: `questionType: ${QuestionType.IDENTIFYING_INFORMATION} | ${QuestionType.MATCHING_HEADINGS} | ${QuestionType.MATCHING_SENTENCE_ENDINGS} | ${QuestionType.MULTIPLE_CHOICE_1_ANSWER} | ${QuestionType.NOTE_COMPLETION} | ${QuestionType.SUMMARY_COMPLETION} | ${QuestionType.SENTENCE_COMPLETION} | ${QuestionType.LABELLING_A_PLAN_MAP}`,
  })
  @Post('listening')
  async createListening(
    @Request() req,
    @Body()
    createListeningQuestionGroupInput: CreateListeningQuestionGroupInput,
  ) {
    const requireFields = ['questionType', 'directionText', 'partId'];
    for (let i = 0; i < requireFields.length; i++) {
      const field = requireFields[i];
      if (
        !createListeningQuestionGroupInput[field] ||
        ((typeof createListeningQuestionGroupInput[
          field
        ]).toLocaleLowerCase() === 'string' &&
          !createListeningQuestionGroupInput[field].trim())
      ) {
        throw new HttpException(
          `Field ${field} is required!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const questionPartFound = await this.questionPartService.findOne({
      _id: createListeningQuestionGroupInput.partId,
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

    const questionTypes: string[] = Object.values(QuestionType);
    if (
      !questionTypes.includes(createListeningQuestionGroupInput.questionType)
    ) {
      throw new HttpException(
        `'questionType' value not correct!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const questions = createListeningQuestionGroupInput.questions || [];

    const createListeningQuestionGroupData = {
      ...createListeningQuestionGroupInput,
    };

    delete createListeningQuestionGroupData.questions;

    const questionGroupCreated = await this.questionGroupService.create({
      ...createListeningQuestionGroupData,
      skill: QuestionSkill.LISTENING,
      level: QuestionLevel.A1,
    });

    if (
      questionGroupCreated &&
      questionGroupCreated._id &&
      questions &&
      questions.length > 0
    ) {
      const questionsData = questions.map((question) => ({
        skill: QuestionSkill.LISTENING,
        level: QuestionLevel.A1,
        answer: question.answer,
        explanationText: question.explanationText,
        questionText: question.questionText,
        blankNumber: question.blankNumber,
        questionPartNumber: question.questionPartNumber,
        groupId: questionGroupCreated._id.toString(),
      }));
      const questionsCreated = await this.questionService.createBulk(
        questionsData,
      );

      const questionOptionsData = questions
        .reduce(
          (total, question, questionIndex) => [
            ...total,
            ...question.options.map((option) => ({
              key: option.key,
              text: option.text,
              questionId:
                (questionsCreated[questionIndex] &&
                  questionsCreated[questionIndex]._id) ||
                null,
            })),
          ],
          [],
        )
        .filter((item) => !!item.questionId);

      const questionOptionsCreated =
        await this.questionOptionService.createBulk(questionOptionsData);
    }

    return questionGroupCreated;
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    description: `questionType: ${QuestionType.IDENTIFYING_INFORMATION} | ${QuestionType.MATCHING_HEADINGS} | ${QuestionType.MATCHING_SENTENCE_ENDINGS} | ${QuestionType.MULTIPLE_CHOICE_1_ANSWER} | ${QuestionType.NOTE_COMPLETION} | ${QuestionType.SUMMARY_COMPLETION} | ${QuestionType.SENTENCE_COMPLETION} | ${QuestionType.LABELLING_A_PLAN_MAP}`,
  })
  @Patch('listening/:id')
  async updateListening(
    @Param('id') id: string,
    @Body()
    updateListeningQuestionGroupInput: UpdateListeningQuestionGroupInput,
  ) {
    const questionGroupFound = await this.questionGroupService.findOne({
      _id: id,
      skill: QuestionSkill.LISTENING,
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

    const questionTypes: string[] = Object.values(QuestionType);
    if (
      updateListeningQuestionGroupInput.questionType &&
      !questionTypes.includes(updateListeningQuestionGroupInput.questionType)
    ) {
      throw new HttpException(
        `'questionType' value not correct!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const updateData = {
      level: QuestionLevel.A1,
      groupPartNumber: updateListeningQuestionGroupInput.groupPartNumber,
      script: updateListeningQuestionGroupInput.script,
      answerList: updateListeningQuestionGroupInput.answerList,
      directionText: updateListeningQuestionGroupInput.directionText,
      image: updateListeningQuestionGroupInput.image,
      questionTypeTips: updateListeningQuestionGroupInput.questionTypeTips,
      questionBox: updateListeningQuestionGroupInput.questionBox,
      questionType: updateListeningQuestionGroupInput.questionType,
    };

    for (let key in updateData) {
      if (updateData[key] == undefined) {
        delete updateData[key];
      }
    }

    const questionGroupUpdated = await this.questionGroupService.update(
      id,
      updateData,
    );

    const questions = await this.questionService.findAll(null, {
      groupId: questionGroupFound._id.toString(),
    });
    const questionOptions = await this.questionOptionService.findAll({
      questionId: questions.map((question) => question._id.toString()),
    });

    const currentQuestionIds = questions.map((question) =>
      question._id.toString(),
    );
    const currentQuestionOptionIds = questionOptions.map((questionOption) =>
      questionOption._id.toString(),
    );

    if (
      updateListeningQuestionGroupInput.questions &&
      updateListeningQuestionGroupInput.questions.length > 0
    ) {
      const questionToUpdate =
        updateListeningQuestionGroupInput.questions.filter(
          (question) => question._id,
        );
      const questionToCreate =
        updateListeningQuestionGroupInput.questions.filter(
          (question) => !question._id,
        );
      const questionIdsToDelete = currentQuestionIds.filter(
        (questionId) =>
          !updateListeningQuestionGroupInput.questions
            .map((question) => question._id)
            .includes(questionId),
      );
      const questionOptionIdsToDelete = currentQuestionOptionIds.filter(
        (questionOptionId) =>
          !updateListeningQuestionGroupInput.questions
            .filter((question) => question._id)
            .reduce(
              (total, question) => [
                ...total,
                ...(question.options || [])
                  .filter((questionOption) => questionOption._id)
                  .map((questionOption) => questionOption._id),
              ],
              [],
            )
            .includes(questionOptionId),
      );
      const questionOptionToUpdate = updateListeningQuestionGroupInput.questions
        .filter((question) => question._id)
        .reduce(
          (total, question) => [
            ...total,
            ...(question.options || []).filter(
              (questionOption) =>
                questionOption._id &&
                currentQuestionOptionIds.includes(questionOption._id),
            ),
          ],
          [],
        );
      const questionOptionToCreate = updateListeningQuestionGroupInput.questions
        .filter((question) => question._id)
        .reduce(
          (total, question) => [
            ...total,
            ...(question.options || [])
              .filter((questionOption) => !questionOption._id)
              .map((questionOption) => ({
                key: questionOption.key,
                text: questionOption.text,
                questionId: question._id,
              })),
          ],
          [],
        );

      const results = await Promise.all([
        this.questionService.createBulk(
          questionToCreate.map((question) => ({
            skill: QuestionSkill.LISTENING,
            level: QuestionLevel.A1,
            answer: question.answer,
            explanationText: question.explanationText,
            questionText: question.questionText,
            blankNumber: question.blankNumber,
            questionPartNumber: question.questionPartNumber,
            groupId: questionGroupFound._id.toString(),
          })),
        ),
        this.questionService.removeMany(questionIdsToDelete),
        this.questionOptionService.removeMany(questionOptionIdsToDelete),
        this.questionOptionService.createBulk(questionOptionToCreate),
        ...questionToUpdate.map((question) => {
          const questionUpdateData = {
            answer: question.answer,
            explanationText: question.explanationText,
            questionText: question.questionText,
            blankNumber: question.blankNumber,
            questionPartNumber: question.questionPartNumber,
          };
          for (let key in questionUpdateData) {
            if (questionUpdateData[key] == undefined)
              delete questionUpdateData[key];
          }
          return this.questionService.update(question._id, questionUpdateData);
        }),
        ...questionOptionToUpdate.map((questionOption) => {
          const questionOptionUpdateData = {
            text: questionOption.text,
            key: questionOption.key,
          };
          for (let key in questionOptionUpdateData) {
            if (questionOptionUpdateData[key] == undefined)
              delete questionOptionUpdateData[key];
          }
          return this.questionOptionService.update(
            questionOption._id,
            questionOptionUpdateData,
          );
        }),
      ]);
      const questionsCreated = results[0];
      const questionOptionsData = questionToCreate
        .reduce(
          (total, question, questionIndex) => [
            ...total,
            ...question.options.map((option) => ({
              key: option.key,
              text: option.text,
              questionId:
                (questionsCreated[questionIndex] &&
                  questionsCreated[questionIndex]._id) ||
                null,
            })),
          ],
          [],
        )
        .filter((item) => !!item.questionId);
      const questionOptionsCreated =
        await this.questionOptionService.createBulk(questionOptionsData);
      // console.log(questionToUpdate, questionToCreate);
      // console.log(
      //   questionIdsToDelete,
      //   questionOptionIdsToDelete,
      //   questionOptionToUpdate,
      //   questionOptionToCreate,
      // );
    }

    return questionGroupUpdated;
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('listening/:id')
  async findOneListening(@Param('id') id: string) {
    const questionGroupFound = await this.questionGroupService.findOne({
      _id: id,
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

    const questions = await this.questionService.findAll(null, {
      groupId: questionGroupFound._id.toString(),
    });
    const questionOptions = await this.questionOptionService.findAll({
      questionId: questions.map((question) => question._id.toString()),
    });

    return {
      ...questionGroupFound,
      questions: questions.map((question) => ({
        ...question,
        options: questionOptions.filter(
          (questionOption) =>
            (
              (questionOption.questionId && questionOption.questionId._id) ||
              questionOption.questionId
            ).toString() == question._id.toString(),
        ),
      })),
    };
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('speaking')
  async createSpeaking(
    @Request() req,
    @Body()
    createSpeakingQuestionGroupInput: CreateSpeakingQuestionGroupInput,
  ) {
    const requireFields = ['title', 'partId'];
    for (let i = 0; i < requireFields.length; i++) {
      const field = requireFields[i];
      if (
        !createSpeakingQuestionGroupInput[field] ||
        ((typeof createSpeakingQuestionGroupInput[
          field
        ]).toLocaleLowerCase() === 'string' &&
          !createSpeakingQuestionGroupInput[field].trim())
      ) {
        throw new HttpException(
          `Field ${field} is required!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const questionPartFound = await this.questionPartService.findOne({
      _id: createSpeakingQuestionGroupInput.partId,
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

    const questions = createSpeakingQuestionGroupInput.questions || [];

    const createSpeakingQuestionGroupData = {
      ...createSpeakingQuestionGroupInput,
    };

    delete createSpeakingQuestionGroupData.questions;

    const questionGroupCreated = await this.questionGroupService.create({
      ...createSpeakingQuestionGroupData,
      skill: QuestionSkill.SPEAKING,
      level: QuestionLevel.A1,
    });

    if (
      questionGroupCreated &&
      questionGroupCreated._id &&
      questions &&
      questions.length > 0
    ) {
      const questionsData = questions.map((question) => ({
        skill: QuestionSkill.SPEAKING,
        level: QuestionLevel.A1,
        questionAudio: question.questionAudio,
        questionText: question.questionText,
        modelAnswerAudio: question.modelAnswerAudio,
        modelAnswer: question.modelAnswer,
        groupId: questionGroupCreated._id.toString(),
      }));

      if (
        questionsData.filter((question) => !question.questionAudio).length > 0
      ) {
        throw new HttpException(
          `Field questionAudio is required!`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const questionsCreated = await this.questionService.createBulk(
        questionsData,
      );
    }

    return questionGroupCreated;
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('speaking/:id')
  async updateSpeaking(
    @Param('id') id: string,
    @Body() updateSpeakingQuestionGroupInput: UpdateSpeakingQuestionGroupInput,
  ) {
    const questionGroupFound = await this.questionGroupService.findOne({
      _id: id,
      skill: QuestionSkill.SPEAKING,
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

    const updateData = {
      level: QuestionLevel.A1,
      explanationText: updateSpeakingQuestionGroupInput.explanationText,
      usefulGrammarNVocab: updateSpeakingQuestionGroupInput.usefulGrammarNVocab,
      ideaSuggestion: updateSpeakingQuestionGroupInput.ideaSuggestion,
      title: updateSpeakingQuestionGroupInput.title,
    };

    for (let key in updateData) {
      if (updateData[key] == undefined) {
        delete updateData[key];
      }
    }

    const questionGroupUpdated = await this.questionGroupService.update(
      id,
      updateData,
    );

    const questions = await this.questionService.findAll(null, {
      groupId: questionGroupFound._id.toString(),
    });

    const currentQuestionIds = questions.map((question) =>
      question._id.toString(),
    );

    if (
      updateSpeakingQuestionGroupInput.questions &&
      updateSpeakingQuestionGroupInput.questions.length > 0
    ) {
      const questionToUpdate =
        updateSpeakingQuestionGroupInput.questions.filter(
          (question) => question._id,
        );
      const questionToCreate =
        updateSpeakingQuestionGroupInput.questions.filter(
          (question) => !question._id,
        );
      const questionIdsToDelete = currentQuestionIds.filter(
        (questionId) =>
          !updateSpeakingQuestionGroupInput.questions
            .map((question) => question._id)
            .includes(questionId),
      );

      if (
        questionToCreate.filter((question) => !question.questionAudio).length >
        0
      ) {
        throw new HttpException(
          `Field questionAudio is required!`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const results = await Promise.all([
        this.questionService.createBulk(
          questionToCreate.map((question) => ({
            skill: QuestionSkill.SPEAKING,
            level: QuestionLevel.A1,
            questionAudio: question.questionAudio,
            questionText: question.questionText,
            modelAnswerAudio: question.modelAnswerAudio,
            modelAnswer: question.modelAnswer,
            groupId: questionGroupFound._id.toString(),
          })),
        ),
        this.questionService.removeMany(questionIdsToDelete),
        ...questionToUpdate.map((question) => {
          const questionUpdateData = {
            questionAudio: question.questionAudio,
            questionText: question.questionText,
            modelAnswerAudio: question.modelAnswerAudio,
            modelAnswer: question.modelAnswer,
          };
          for (let key in questionUpdateData) {
            if (questionUpdateData[key] == undefined)
              delete questionUpdateData[key];
          }
          return this.questionService.update(question._id, questionUpdateData);
        }),
      ]);
    }

    return questionGroupUpdated;
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('speaking/:id')
  async findOneSpeaking(@Param('id') id: string) {
    const questionGroupFound = await this.questionGroupService.findOne({
      _id: id,
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

    const questions = await this.questionService.findAll(null, {
      groupId: questionGroupFound._id.toString(),
    });

    return {
      ...questionGroupFound,
      questions: questions,
    };
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @ApiOperation({
    description: `skill: ${QuestionSkill.LISTENING} | ${QuestionSkill.READING} | ${QuestionSkill.SPEAKING} | ${QuestionSkill.WRITING}`,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async query(@Query() query: QuestionGroupListDto) {
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
    let questionGroupSortDto: QuestionGroupSortDto = null;
    if (
      sortBy &&
      sortBy.length == 2 &&
      sortableFields.includes(sortBy[0].trim()) &&
      ['ASC', 'DESC'].includes(sortBy[1].trim().toUpperCase())
    ) {
      questionGroupSortDto = {
        [sortBy[0]]: sortBy[1].trim().toUpperCase() === 'ASC' ? 1 : -1,
      };
    }

    const questionGroupQuery = {};

    if (
      query.skill &&
      query.skill.split(',') &&
      query.skill.split(',').length > 0
    ) {
      questionGroupQuery['skill'] = query.skill.split(',');
    }

    const totalQuestionGroups = await this.questionGroupService.countDocuments(
      questionGroupQuery,
    );
    const totalPage = Math.ceil(totalQuestionGroups / pageSize);

    const questionGroupList =
      page > 0 && page <= totalPage
        ? await this.questionGroupService.query(
            { page, pageSize },
            questionGroupSortDto,
            questionGroupQuery,
          )
        : [];

    return {
      data: questionGroupList,
      paging: {
        page,
        pageSize,
        totalPage,
        nextPage: page + 1 <= totalPage ? page + 1 : null,
        prevPage: page - 1 >= 1 ? page - 1 : null,
        total: totalQuestionGroups,
      },
    };
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const questionGroupFound = await this.questionGroupService.findOne({
      _id: id,
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

    return questionGroupFound;
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id/questions')
  async getQuestions(@Param('id') id: string) {
    const questionGroupFound = await this.questionGroupService.findOne({
      _id: id,
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

    const questions = await this.questionService.findAll(null, {
      groupId: questionGroupFound._id.toString(),
    });

    return questions;
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const questionGroupFound = await this.questionGroupService.findOne({
      _id: id,
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

    return this.questionGroupService.remove(id);
  }
}
