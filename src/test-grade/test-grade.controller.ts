import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ExaminationExamService } from '../examination-exam/examination-exam.service';
import { UserType } from '../user/enums/user-type.enum';

import * as moment from 'moment/moment';
import examinationResultTemplate from '../common/examinationResultTemplate';
import { QuestionGroupService } from './../question-group/question-group.service';
import { QuestionOptionService } from './../question-option/question-option.service';
import { QuestionSkill } from './../question-part/enums/question-skill.enum';
import { QuestionService } from './../question/question.service';
import { TestSortDto } from './../test/dto/test-sort.dto';
import { TestStatus } from './../test/enums/test-status.enum';
import { TestService } from './../test/test.service';
import { TestGradeQueryDto } from './dto/test-grade.query';
import { TestSubmitScoreInput } from './dto/test-submit-score.input';

@ApiTags('Test Grade')
@Controller('test-grades')
export class TestGradeController {
  constructor(
    private readonly testService: TestService,
    private readonly questionGroupService: QuestionGroupService,
    private readonly questionService: QuestionService,
    private readonly questionOptionService: QuestionOptionService,
    private readonly examinationExamService: ExaminationExamService,
  ) {}

  @ApiBearerAuth()
  @Roles(
    UserType.SUPER_ADMIN,
    UserType.ADMIN,
    UserType.TEACHER,
    UserType.POINTMANAGER,
  )
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    description: `skill: ${QuestionSkill.SPEAKING} | ${QuestionSkill.WRITING}`,
  })
  @Get('')
  async query(@Request() req, @Query() query: TestGradeQueryDto) {
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
    let testSortDto: TestSortDto = null;
    if (
      sortBy &&
      sortBy.length == 2 &&
      sortableFields.includes(sortBy[0].trim()) &&
      ['ASC', 'DESC'].includes(sortBy[1].trim().toUpperCase())
    ) {
      testSortDto = {
        [sortBy[0]]: sortBy[1].trim().toUpperCase() === 'ASC' ? 1 : -1,
      };
    }

    const testQuery = {
      status: TestStatus.FINISHED,
    };

    const questionSkills: string[] = Object.values(QuestionSkill);
    if (query.skill && !questionSkills.includes(query.skill)) {
      throw new HttpException(
        `'skill' value not correct!`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (query.skill) {
      testQuery['skill'] = query.skill;
    }

    if (query.isGrading != undefined && query.isGrading != null) {
      testQuery['isGrading'] = query.isGrading;
    }

    if (query.name != '' && query.name != null) {
      testQuery['name'] = query.name;
    }

    if (query.code != null && query.code != 'NaN') {
      testQuery['code'] = query.code;
    }

    const totalTests = await this.testService.countDocuments(testQuery);
    const totalPage = Math.ceil(totalTests / pageSize);

    const testList =
      page > 0 && page <= totalPage
        ? await this.testService.queryWithUserInfo(
            { page, pageSize },
            testSortDto,
            testQuery,
          )
        : [];

    return {
      data: testList,
      paging: {
        page,
        pageSize,
        totalPage,
        nextPage: page + 1 <= totalPage ? page + 1 : null,
        prevPage: page - 1 >= 1 ? page - 1 : null,
        total: totalTests,
      },
    };
  }

  @ApiBearerAuth()
  @Roles(
    UserType.SUPER_ADMIN,
    UserType.ADMIN,
    UserType.TEACHER,
    UserType.POINTMANAGER,
  )
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async getTestDetail(@Request() req, @Param('id') id: string) {
    const testFound = await this.testService.findOneWithFullDetail({
      _id: id,
    });

    if (!testFound || !testFound._id) {
      throw new HttpException(`Test not exists!`, HttpStatus.NOT_FOUND);
    }

    if (testFound.status != TestStatus.FINISHED) {
      throw new HttpException(
        `This test is not finish yet!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const examFound = await this.examinationExamService.findOne({
      _id: (
        (testFound.exam && testFound.exam._id) ||
        testFound.exam
      ).toString(),
    });
    if (!examFound || !examFound._id) {
      throw new HttpException(`Get exam failed!`, HttpStatus.BAD_REQUEST);
    }

    const result = {
      ...testFound,
      readingDetail: (examFound.reading || []).map(
        (questionPart, partIndex) => {
          return {
            _id: questionPart._id,
            partNumber: questionPart.partNumber || partIndex + 1,
            passageTitle: questionPart.passageTitle,
            passageText: questionPart.passageText,
            groups: (questionPart.groups || []).map(
              (questionGroup, groupIndex) => ({
                _id: questionGroup._id,
                answerList: questionGroup.answerList,
                directionText: questionGroup.directionText,
                image: questionGroup.image,
                questionBox: questionGroup.questionBox,
                questionType: questionGroup.questionType,
                groupNumber: questionGroup.groupNumber || groupIndex + 1,
                questionTypeTips: questionGroup.questionTypeTips,
                questions: (questionGroup.questions || [])
                  .map((question) => {
                    const questionAnswer = testFound.answers.filter(
                      (answer) =>
                        (
                          (answer.questionId && answer.questionId._id) ||
                          answer.questionId
                        ).toString() == question._id.toString(),
                    )[0];
                    return questionAnswer && questionAnswer.questionId
                      ? {
                          questionId: questionAnswer.questionId,
                          studentAnswer: questionAnswer.studentAnswer,
                          isCorrect: questionAnswer.isCorrect,
                          score: questionAnswer.score,
                          question: {
                            _id: question._id,
                            answer: question.answer,
                            explanationText: question.explanationText,
                            options: (question.options || []).map(
                              (questionOption) => ({
                                _id: questionOption._id,
                                key: questionOption.key,
                                text: questionOption.text,
                              }),
                            ),
                            questionText: question.questionText,
                            blankNumber: question.blankNumber,
                          },
                        }
                      : null;
                  })
                  .filter(
                    (readingQuestion) =>
                      readingQuestion && readingQuestion.questionId,
                  ),
              }),
            ),
          };
        },
      ),
      listeningDetail: (examFound.listening || []).map(
        (questionPart, partIndex) => {
          return {
            _id: questionPart._id,
            partNumber: questionPart.partNumber || partIndex + 1,
            partAudio: questionPart.partAudio,
            partTitle: questionPart.partTitle,
            groups: (questionPart.groups || []).map(
              (questionGroup, groupIndex) => ({
                _id: questionGroup._id,
                answerList: questionGroup.answerList,
                directionText: questionGroup.directionText,
                image: questionGroup.image,
                questionBox: questionGroup.questionBox,
                questionType: questionGroup.questionType,
                groupNumber: questionGroup.groupNumber || groupIndex + 1,
                script: questionGroup.script,
                questionTypeTips: questionGroup.questionTypeTips,
                questions: (questionGroup.questions || [])
                  .map((question) => {
                    const questionAnswer = testFound.answers.filter(
                      (answer) =>
                        (
                          (answer.questionId && answer.questionId._id) ||
                          answer.questionId
                        ).toString() == question._id.toString(),
                    )[0];
                    return questionAnswer && questionAnswer.questionId
                      ? {
                          questionId: questionAnswer.questionId,
                          studentAnswer: questionAnswer.studentAnswer,
                          isCorrect: questionAnswer.isCorrect,
                          score: questionAnswer.score,
                          question: {
                            _id: question._id,
                            answer: question.answer,
                            explanationText: question.explanationText,
                            options: (question.options || []).map(
                              (questionOption) => ({
                                _id: questionOption._id,
                                key: questionOption.key,
                                text: questionOption.text,
                              }),
                            ),
                            questionText: question.questionText,
                            blankNumber: question.blankNumber,
                          },
                        }
                      : null;
                  })
                  .filter(
                    (readingQuestion) =>
                      readingQuestion && readingQuestion.questionId,
                  ),
              }),
            ),
          };
        },
      ),
      // speakingDetail: (testFound['speakingDetail'] || []).map(
      //   (questionPart, partIndex) => {
      //     return {
      //       _id: questionPart._id,
      //       partNumber: questionPart.partNumber || partIndex + 1,
      //       directionAudio: questionPart.directionAudio,
      //       groups: []
      //         .filter(
      //           (questionGroup) =>
      //             (
      //               (questionGroup.partId && questionGroup.partId._id) ||
      //               questionGroup.partId
      //             ).toString() == questionPart._id.toString(),
      //         )
      //         .map((questionGroup, groupIndex) => ({
      //           _id: questionGroup._id,
      //           groupNumber: questionGroup.groupPartNumber || groupIndex + 1,
      //           explanationText: questionGroup.explanationText,
      //           ideaSuggestion: questionGroup.ideaSuggestion,
      //           usefulGrammarNVocab: questionGroup.usefulGrammarNVocab,
      //           title: questionGroup.title,
      //           questions: []
      //             .filter(
      //               (question) =>
      //                 (
      //                   (question.groupId && question.groupId._id) ||
      //                   question.groupId
      //                 ).toString() == questionGroup._id.toString(),
      //             )
      //             .map((question) => {
      //               const questionAnswer = testFound.answers.filter(
      //                 (answer) =>
      //                   (
      //                     (answer.questionId && answer.questionId._id) ||
      //                     answer.questionId
      //                   ).toString() == question._id.toString(),
      //               )[0];
      //               return questionAnswer && questionAnswer.questionId
      //                 ? {
      //                     questionId: questionAnswer.questionId,
      //                     studentAnswerAudio: questionAnswer.studentAnswerAudio,
      //                     score: questionAnswer.score,
      //                     question: {
      //                       _id: question._id,
      //                       questionAudio: question.questionAudio,
      //                       questionText: question.questionText,
      //                       modelAnswer: question.modelAnswer,
      //                       modelAnswerAudio: question.modelAnswerAudio,
      //                     },
      //                   }
      //                 : null;
      //             })
      //             .filter(
      //               (readingQuestion) =>
      //                 readingQuestion && readingQuestion.questionId,
      //             ),
      //         })),
      //     };
      //   },
      // ),
      // writingDetail: (testFound['writingDetail'] || []).map(
      //   (question, questionIndex) => {
      //     const answer =
      //       testFound.answers.filter(
      //         (answer) => question._id.toString() == answer.questionId,
      //       )[0] || null;
      //     return {
      //       ...answer,
      //       questionNumber: question.questionPartNumber || questionIndex + 1,
      //       displayNumber: `${questionIndex + 1}`,
      //       question: {
      //         _id: question._id,
      //         questionPartNumber: question.questionPartNumber,
      //         analysisType: question.analysisType,
      //         image: question.image,
      //         questionType: question.questionType,
      //         text: question.questionText,
      //         title: question.title,
      //         ideaSuggestion: question.ideaSuggestion,
      //         modelAnswer: question.modelAnswer,
      //         organization: question.organization,
      //         tips: question.tips,
      //         usefulGrammarNVocab: question.usefulGrammarNVocab,
      //       },
      //     };
      //   },
      // ),
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

    // let speakingQuestionCount = 0;
    // for (let i = 0; i < result.speakingDetail.length; i++) {
    //   const questionPart = result.speakingDetail[i];
    //   for (let j = 0; j < (questionPart.groups || []).length; j++) {
    //     const questionGroup = questionPart.groups[j];
    //     for (let k = 0; k < (questionGroup.questions || []).length; k++) {
    //       speakingQuestionCount = speakingQuestionCount + 1;
    //       result.speakingDetail[i].groups[j].questions[k][
    //         'displayNumber'
    //       ] = `${speakingQuestionCount}`;
    //     }
    //   }
    // }

    return result;
  }

  @ApiBearerAuth()
  @Roles(
    UserType.SUPER_ADMIN,
    UserType.ADMIN,
    UserType.TEACHER,
    UserType.POINTMANAGER,
  )
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() testSubmitScoreInput: TestSubmitScoreInput,
  ) {
    const testFound = await this.testService.findOneWithFullDetail({
      _id: id,
    });

    if (!testFound || !testFound._id) {
      throw new HttpException(`Test not exists!`, HttpStatus.NOT_FOUND);
    }

    if (testFound.status != TestStatus.FINISHED) {
      throw new HttpException(
        `This test is not finish yet!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!testFound.isGrading) {
      throw new HttpException(
        `You cannot update score for this test!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const userAnswers = testFound.answers;
    const userAnswerIds = userAnswers.map((userAnswer) =>
      (
        (userAnswer.questionId && userAnswer.questionId._id) ||
        userAnswer.questionId
      ).toString(),
    );
    if (
      testSubmitScoreInput.answers &&
      testSubmitScoreInput.answers.length > 0
    ) {
      for (let i = 0; i < testSubmitScoreInput.answers.length; i++) {
        const testSubmitAnswer = testSubmitScoreInput.answers[i];
        const isAnswerExists = userAnswerIds.includes(
          testSubmitAnswer.questionId,
        );
        if (!isAnswerExists) {
          throw new HttpException(
            `This test do not have question with _id '${testSubmitAnswer.questionId}'!`,
            HttpStatus.BAD_REQUEST,
          );
        }

        if (testSubmitAnswer.score < 0 || testSubmitAnswer.score > 1) {
          throw new HttpException(
            `Score must be between 0 and 1!`,
            HttpStatus.BAD_REQUEST,
          );
        }

        userAnswers[userAnswerIds.indexOf(testSubmitAnswer.questionId)].score =
          testSubmitAnswer.score;
      }
    }

    await this.testService.update(testFound._id.toString(), {
      answers: userAnswers,
    });

    return true;
  }

  @ApiBearerAuth()
  @Roles(
    UserType.SUPER_ADMIN,
    UserType.ADMIN,
    UserType.TEACHER,
    UserType.POINTMANAGER,
  )
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':id/finish')
  async finish(@Request() req, @Param('id') id: string) {
    const testFound = await this.testService.findOneWithFullDetail({
      _id: id,
    });

    if (!testFound || !testFound._id) {
      throw new HttpException(`Test not exists!`, HttpStatus.NOT_FOUND);
    }

    if (testFound.status != TestStatus.FINISHED) {
      throw new HttpException(
        `This test is not finish yet!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!testFound.isGrading) {
      throw new HttpException(
        `You cannot update grade status for this test!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const updateData = {
      isGrading: false,
    };

    const questionList = await this.questionService.findAll(null, {
      _id: testFound.answers.map((answer) =>
        (
          (answer.questionId && answer.questionId._id) ||
          answer.questionId
        ).toString(),
      ),
    });
    const answers = testFound.answers;
    let totalWritingScore = 0;
    let totalSpeakingScore = 0;
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      const question = questionList.filter(
        (question) =>
          question._id.toString() ==
          (
            (answer.questionId && answer.questionId._id) ||
            answer.questionId
          ).toString(),
      )[0];
      if (question && question._id) {
        if (question.skill == QuestionSkill.WRITING) {
          totalWritingScore = totalWritingScore + (answer.score || 0);
        } else if (question.skill == QuestionSkill.SPEAKING) {
          totalSpeakingScore = totalSpeakingScore + (answer.score || 0);
        }
      }
    }

    updateData['answers'] = answers;
    updateData['score.writing'] = totalWritingScore;
    updateData['score.speaking'] = totalSpeakingScore;
    updateData['score.total'] =
      updateData['score.writing'] +
      updateData['score.speaking'] +
      (testFound.score.listening || 0) +
      (testFound.score.reading || 0);

    await this.testService.update(testFound._id.toString(), updateData);

    return true;
  }
}
