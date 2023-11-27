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
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import * as moment from 'moment';
import examinationResultTemplate from '../common/examinationResultTemplate';

import { assign } from 'nodemailer/lib/shared';
import configuration from 'src/common/configuration';
import { QuestionType } from 'src/question-group/enums/question-type.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExaminationExamService } from '../examination-exam/examination-exam.service';
import { StudentProfileService } from '../student-profile/student-profile.service';
import { ExaminationService } from './../examination/examination.service';
import { QuestionGroupService } from './../question-group/question-group.service';
import { QuestionOptionService } from './../question-option/question-option.service';
import { QuestionSkill } from './../question-part/enums/question-skill.enum';
import { QuestionPartService } from './../question-part/question-part.service';
import { QuestionAnalysisType } from './../question/enums/question-analysis-type.enum';
import { QuestionService } from './../question/question.service';
import { UserService } from './../user/user.service';
import { CreateTestDto } from './dto/create-test.dto';
import { CreateTestInput } from './dto/create-test.input';
import { LatestTestQueryDto } from './dto/latest-test.query';
import { TestResultsQueryDto } from './dto/test-result.query';
import { TestSortDto } from './dto/test-sort.dto';
import { TestSubmitAnswerInput } from './dto/test-submit-answer.input';
import { UpdateTestProgressInput } from './dto/update-test-progress.input';
import { TestStatus } from './enums/test-status.enum';
import { TestService } from './test.service';
import {Roles} from "../auth/roles.decorator";
import {UserType} from "../user/enums/user-type.enum";
import {RolesGuard} from "../auth/roles.guard";

@ApiTags('Test')
@Controller('tests')
export class TestController {
  constructor(
    private readonly testService: TestService,
    private readonly questionPartService: QuestionPartService,
    private readonly questionGroupService: QuestionGroupService,
    private readonly questionService: QuestionService,
    private readonly questionOptionService: QuestionOptionService,
    private readonly userService: UserService,
    private readonly examinationService: ExaminationService,
    private readonly examinationExamService: ExaminationExamService,
    private readonly studentProfileService: StudentProfileService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('examination')
  async getExamination(@Request() req) {
    const userFound = await this.userService.findOne({
      _id: req.user._id,
    });

    if (!userFound || !userFound._id || userFound.deleted) {
      throw new HttpException(
        'Student account not exists!',
        HttpStatus.NOT_FOUND,
      );
    }

    const studentProfile = await this.studentProfileService.findOne({
      studentCode: req.user.studentCode,
      user: userFound._id.toString(),
    });

    if (!studentProfile || !studentProfile._id) {
      throw new HttpException('Student not exists!', HttpStatus.NOT_FOUND);
    }

    const examinationFound = await this.examinationService.findOne({
      active: true,
      studentIds: { $in: [studentProfile._id.toString()] },
    });

    if (!examinationFound || !examinationFound._id) {
      throw new HttpException(
        'You do not have any examination!',
        HttpStatus.NOT_FOUND,
      );
    }

    return examinationFound;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('prepare')
  async create(@Request() req, @Body() createTestInput: CreateTestInput) {
    const requireFields = ['examination'];
    for (let i = 0; i < requireFields.length; i++) {
      const field = requireFields[i];
      if (
        !createTestInput[field] ||
        ((typeof createTestInput[field]).toLocaleLowerCase() === 'string' &&
          !createTestInput[field].trim())
      ) {
        throw new HttpException(
          `Field ${field} is required!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const examinationFound = await this.examinationService.findById(
      createTestInput.examination,
    );
    if (!examinationFound || !examinationFound._id) {
      throw new HttpException(`Examination not exists`, HttpStatus.BAD_REQUEST);
    }

    if (!examinationFound.active) {
      throw new HttpException(
        `Examination is not active`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const studentFound = await this.studentProfileService.findOne({
      studentCode: req.user.studentCode,
      user: req.user._id,
    });
    if (!studentFound || !studentFound._id) {
      throw new HttpException(`Student not exists`, HttpStatus.BAD_REQUEST);
    }

    const userFound = await this.userService.findById(req.user._id);
    if (!userFound || !userFound._id || userFound.deleted) {
      throw new HttpException(
        `Student account not exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      !examinationFound.studentIds
        .map((student) => ((student && student._id) || student).toString())
        .includes(studentFound._id.toString())
    ) {
      throw new HttpException(
        `You are not allowed to join this examination!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const latestTest = await this.testService.getLatestSavedTest({
      userId: req.user._id,
      examination: examinationFound._id.toString(),
    });

    if (latestTest && latestTest.testCode) {
      // throw new HttpException(
      //   `You only can prepare examination once!`,
      //   HttpStatus.BAD_REQUEST,
      // );
      return {
        testCode: latestTest.testCode,
        pregress: latestTest.progress,
      };
    }

    const examFound = await this.examinationExamService.findOne({
      isUsed: false,
      examination: examinationFound._id.toString(),
    });
    if (!examFound || !examFound._id) {
      throw new HttpException(`Get exam failed!`, HttpStatus.BAD_REQUEST);
    }

    const newTest = {
      testCode: null,
      examination: createTestInput.examination,
      exam: examFound._id.toString(),
      score: {
        total: 0,
        reading: 0,
        writing: 0,
        speaking: 0,
        listening: 0,
        speaking_training_score: null,
      },
      userId: userFound._id.toString(),
      answers: [],
    };

    newTest.answers = [
      ...(examFound.reading || []).reduce(
        (result, questionPart) => [
          ...result,
          ...(questionPart.groups || []).reduce(
            (_result, questionGroup) => [
              ..._result,
              ...(questionGroup.questions || []).map((question) => ({
                score: 0,
                studentAnswer: null,
                isCorrect: false,
                questionId: question._id.toString(),
              })),
            ],
            [],
          ),
        ],
        [],
      ),
      ...(examFound.listening || []).reduce(
        (result, questionPart) => [
          ...result,
          ...(questionPart.groups || []).reduce(
            (_result, questionGroup) => [
              ..._result,
              ...(questionGroup.questions || []).map((question) => ({
                score: 0,
                studentAnswer: null,
                isCorrect: false,
                questionId: question._id.toString(),
              })),
            ],
            [],
          ),
        ],
        [],
      ),
    ];

    newTest.testCode = await this.testService.getNewTestCode();

    const testCreated = await this.testService.create({
      ...newTest,
      progress: {
        listening: {
          timeRemain: configuration().testTime.listening,
        },
        reading: {
          timeRemain: configuration().testTime.reading,
        },
      },
    });
    if (!testCreated || !testCreated._id) {
      throw new HttpException(
        `Failed to prepare new test`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.examinationExamService.update(examFound._id.toString(), {
      isUsed: true,
    });

    return {
      testCode: testCreated.testCode,
      progress: testCreated.progress,
    };
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id/export-result')
  async exportResult(@Param('id') id: string) {
    const examinationFound = await this.testService.findById(id);
    if (!examinationFound || !examinationFound._id) {
      throw new HttpException(`Examination not exists!`, HttpStatus.NOT_FOUND);
    }

    if (examinationFound.userId  ) {
      // @ts-ignore
      const student = await this.studentProfileService.findOne({
        user: examinationFound.userId.toString(),
      });

      const students  =[student]
      const tests = [examinationFound];
      const studentRows = students.map((student, studentIndex) => {
        const test = tests[studentIndex];

        const studentRow = {
          ...examinationResultTemplate.row,
        };

        const studentNames = (student.fullname || '').split(' ');
        const studentRowKeys = Object.keys(studentRow);
        studentRow[studentRowKeys[0]] = `${studentIndex + 1}`;
        studentRow[studentRowKeys[1]] = student.studentCode || '';
        studentRow[studentRowKeys[2]] = student.gender || '';
        studentRow[studentRowKeys[3]] =
            studentNames.length > 0 ? studentNames.slice(0, -1).join(' ') : '';
        studentRow[studentRowKeys[4]] =
            studentNames.length > 0 ? studentNames[studentNames.length - 1] : '';
        studentRow[studentRowKeys[5]] = `${
            student.dob && moment(student.dob).isValid()
                ? moment(student.dob).get('year')
                : ''
        }`;
        studentRow[studentRowKeys[6]] = student.idCardNumber || '';
        studentRow[studentRowKeys[7]] = student.majors || '';
        studentRow[studentRowKeys[8]] = student.classroom || '';
        studentRow[studentRowKeys[9]] =
            test && test.listeningStartDate
                ? moment(test.listeningStartDate).format('DD/MM/YYYY')
                : '';
        studentRow[studentRowKeys[10]] = '';
        studentRow[studentRowKeys[11]] =
            test && test.listeningStartDate
                ? moment(test.listeningStartDate).format('hh:mm')
                : '';
        studentRow[studentRowKeys[12]] = `${
            test && test.score && test.score.reading ? test.score.reading : 0
        }`;
        studentRow[studentRowKeys[13]] = `${
            test && test.score && test.score.listening ? test.score.listening : 0
        }`;
        studentRow[studentRowKeys[14]] = `${
            (test && test.score && test.score.reading ? test.score.reading : 0) +
            (test && test.score && test.score.listening
                ? test.score.listening
                : 0)
        }`;

        return studentRow;
      });
      const results = [
        ...examinationResultTemplate.start,
        ...studentRows,
        ...examinationResultTemplate.end,
      ];
      return results;
    }

    throw new HttpException(
        `Cannot export examination result!`,
        HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Get('latestTest')
  // async latestTest(@Request() req, @Query() query: LatestTestQueryDto) {
  //   const testQuery = {
  //     userId: req.user._id,
  //   };

  //   if (!query.examination) {
  //     throw new HttpException(
  //       `Field 'examination' is required`,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   const examinationFound = await this.examinationService.findById(
  //     query.examination,
  //   );
  //   if (!examinationFound || !examinationFound._id) {
  //     throw new HttpException(`Examination not exists`, HttpStatus.BAD_REQUEST);
  //   }

  //   if (!examinationFound.active) {
  //     throw new HttpException(
  //       `Examination is not active`,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   const latestTest = await this.testService.getLatestSavedTest({
  //     ...testQuery,
  //     examination: examinationFound._id.toString(),
  //   });

  //   return {
  //     latestTestCode: latestTest && latestTest._id ? latestTest.testCode : null,
  //   };
  // }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':code/:skill/progress')
  async getTestProgress(
    @Request() req,
    @Param('code') code: string,
    @Param('skill') skill: string,
  ) {
    const testSkill = (skill && skill.toUpperCase()) || null;

    if (!code || !Number.isSafeInteger(Number(code))) {
      throw new HttpException(`Invalid test code!`, HttpStatus.BAD_REQUEST);
    }

    if (
      !testSkill ||
      !Object.values(QuestionSkill)
        .map((item) => item.toString())
        .includes(testSkill)
    ) {
      throw new HttpException(`Invalid skill!`, HttpStatus.BAD_REQUEST);
    }

    const testFound = await this.testService.findOne({
      testCode: Number(code),
      userId: req.user._id,
    });

    if (!testFound || !testFound._id) {
      throw new HttpException(`Test not exists!`, HttpStatus.NOT_FOUND);
    }

    if (testFound.status == TestStatus.FINISHED) {
      throw new HttpException(
        `This test already finish!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = testFound.progress?.[skill];
    const timeStart =
      skill === 'listening'
        ? testFound.listeningStartDate
        : testFound.readingStartDate;
    const timeConfig =
      skill === 'listening'
        ? configuration().testTime.listening
        : configuration().testTime.reading;
    const timeRemain =
      moment(timeStart).valueOf() + timeConfig - moment().valueOf();

    return assign(result, {
      timeRemain: timeRemain > 0 ? timeRemain : timeConfig,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description: `skill: ${Object.values(QuestionSkill)
      .map((item) => item.toLowerCase())
      .join(' | ')}`,
  })
  @Get(':code/:skill')
  async getTestPart(
    @Request() req,
    @Param('code') code: string,
    @Param('skill') skill: string,
  ) {
    const testSkill = (skill && skill.toUpperCase()) || null;

    if (!code || !Number.isSafeInteger(Number(code))) {
      throw new HttpException(`Invalid test code!`, HttpStatus.BAD_REQUEST);
    }

    if (
      !testSkill ||
      !Object.values(QuestionSkill)
        .map((item) => item.toString())
        .includes(testSkill)
    ) {
      throw new HttpException(`Invalid skill!`, HttpStatus.BAD_REQUEST);
    }

    const testFound = await this.testService.findOne({
      testCode: Number(code),
      userId: req.user._id,
    });

    if (!testFound || !testFound._id) {
      throw new HttpException(`Test not exists!`, HttpStatus.NOT_FOUND);
    }

    if (testFound.status == TestStatus.FINISHED) {
      throw new HttpException(
        `This test already finish!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const examinationFound = await this.examinationService.findById(
      (
        (testFound.examination && testFound.examination._id) ||
        testFound.examination
      ).toString(),
    );

    if (!examinationFound.canStart) {
      throw new HttpException(
        `The examination hasn't started yet!`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (testFound.status == TestStatus.INITIALIZED) {
      await this.testService.update(testFound._id.toString(), {
        status: TestStatus.IN_PROGRESS,
      });
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

    let results = [];

    switch (testSkill) {
      case QuestionSkill.LISTENING:
        {
          if (!testFound.listeningStartDate) {
            await this.testService.update(testFound._id.toString(), {
              listeningStartDate: moment().toISOString(),
            });
          }

          results = (examFound.listening || []).map(
            (listeningQuestionPart, partIndex) =>
              this.testService.extractListeningTestQuestionPartFromQuestionPart(
                listeningQuestionPart,
                testFound.answers,
                partIndex,
              ),
          );
        }
        break;
      case QuestionSkill.READING:
        {
          if (!testFound.readingStartDate) {
            await this.testService.update(testFound._id.toString(), {
              readingStartDate: moment().toISOString(),
            });
          }

          results = (examFound.reading || []).map(
            (readingQuestionPart, partIndex) =>
              this.testService.extractReadingTestQuestionPartFromQuestionPart(
                readingQuestionPart,
                testFound.answers,
                partIndex,
              ),
          );
        }
        break;
      case QuestionSkill.SPEAKING:
      case QuestionSkill.WRITING:
      default:
        break;
    }

    let questionCount = 0;
    for (let i = 0; i < results.length; i++) {
      const questionPart = results[i];
      for (let j = 0; j < (questionPart.groups || []).length; j++) {
        const questionGroup = questionPart.groups[j];
        for (let k = 0; k < (questionGroup.questions || []).length; k++) {
          questionCount = questionCount + 1;
          results[i].groups[j].questions[k].question[
            'displayNumber'
          ] = `${questionCount}`;
        }
      }
    }

    return results;
  }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Get(':code/speaking')
  // async getSpeakingTest(@Request() req, @Param('code') code: string) {
  //   if (!code || !Number.isSafeInteger(Number(code))) {
  //     throw new HttpException(`Invalid test code!`, HttpStatus.NOT_FOUND);
  //   }

  //   const testFound = await this.testService.findOne({
  //     testCode: Number(code),
  //     userId: req.user._id,
  //   });

  //   if (!testFound || !testFound._id) {
  //     throw new HttpException(`Test not exists!`, HttpStatus.NOT_FOUND);
  //   }

  //   if (testFound.status == TestStatus.FINISHED) {
  //     throw new HttpException(
  //       `This test already finish!`,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   if (testFound.status == TestStatus.INITIALIZED) {
  //     await this.testService.update(testFound._id.toString(), {
  //       status: TestStatus.IN_PROGRESS,
  //     });
  //   }

  //   const speakingQuestionParts = await this.questionPartService.findAll(null, {
  //     _id: (testFound.speakingIds || []).map((item) =>
  //       (item._id || item).toString(),
  //     ),
  //   });
  //   const speakingQuestionGroups = await this.questionGroupService.findAll(
  //     null,
  //     {
  //       partId: (speakingQuestionParts || []).map((item) =>
  //         (item._id || item).toString(),
  //       ),
  //     },
  //   );
  //   const speakingQuestions = await this.questionService.findAll(null, {
  //     groupId: (speakingQuestionGroups || []).map((item) =>
  //       (item._id || item).toString(),
  //     ),
  //   });

  //   const results = speakingQuestionParts.map(
  //     (speakingQuestionPart, partIndex) => {
  //       return {
  //         _id: speakingQuestionPart._id,
  //         partNumber: speakingQuestionPart.partNumber || partIndex + 1,
  //         directionAudio: speakingQuestionPart.directionAudio,
  //         groups: speakingQuestionGroups
  //           .filter(
  //             (speakingQuestionGroup) =>
  //               (
  //                 (speakingQuestionGroup.partId &&
  //                   speakingQuestionGroup.partId._id) ||
  //                 speakingQuestionGroup.partId
  //               ).toString() == speakingQuestionPart._id.toString(),
  //           )
  //           .map((speakingQuestionGroup, groupIndex) => ({
  //             _id: speakingQuestionGroup._id,
  //             groupNumber:
  //               speakingQuestionGroup.groupPartNumber || groupIndex + 1,
  //             questions: speakingQuestions
  //               .filter(
  //                 (speakingQuestion) =>
  //                   (
  //                     (speakingQuestion.groupId &&
  //                       speakingQuestion.groupId._id) ||
  //                     speakingQuestion.groupId
  //                   ).toString() == speakingQuestionGroup._id.toString(),
  //               )
  //               .map((speakingQuestion) => {
  //                 const questionAnswer = testFound.answers.filter(
  //                   (answer) =>
  //                     (
  //                       (answer.questionId && answer.questionId._id) ||
  //                       answer.questionId
  //                     ).toString() == speakingQuestion._id.toString(),
  //                 )[0];
  //                 return questionAnswer && questionAnswer.questionId
  //                   ? {
  //                       questionId: questionAnswer.questionId,
  //                       studentAnswerAudio: questionAnswer.studentAnswerAudio,
  //                       question: {
  //                         _id: speakingQuestion._id,
  //                         questionAudio: speakingQuestion.questionAudio,
  //                         questionText: speakingQuestion.questionText,
  //                       },
  //                     }
  //                   : null;
  //               })
  //               .filter(
  //                 (speakingQuestion) =>
  //                   speakingQuestion && speakingQuestion.questionId,
  //               ),
  //           })),
  //       };
  //     },
  //   );

  //   let questionCount = 0;
  //   for (let i = 0; i < results.length; i++) {
  //     const questionPart = results[i];
  //     for (let j = 0; j < (questionPart.groups || []).length; j++) {
  //       const questionGroup = questionPart.groups[j];
  //       for (let k = 0; k < (questionGroup.questions || []).length; k++) {
  //         questionCount = questionCount + 1;
  //         results[i].groups[j].questions[k].question[
  //           'displayNumber'
  //         ] = `${questionCount}`;
  //       }
  //     }
  //   }

  //   return results;
  // }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Get(':code/writing')
  // async getWritingTest(@Request() req, @Param('code') code: string) {
  //   if (!code || !Number.isSafeInteger(Number(code))) {
  //     throw new HttpException(`Invalid test code!`, HttpStatus.NOT_FOUND);
  //   }

  //   const testFound = await this.testService.findOne({
  //     testCode: Number(code),
  //     userId: req.user._id,
  //   });

  //   if (!testFound || !testFound._id) {
  //     throw new HttpException(`Test not exists!`, HttpStatus.NOT_FOUND);
  //   }

  //   if (testFound.status == TestStatus.FINISHED) {
  //     throw new HttpException(
  //       `This test already finish!`,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   if (testFound.status == TestStatus.INITIALIZED) {
  //     await this.testService.update(testFound._id.toString(), {
  //       status: TestStatus.IN_PROGRESS,
  //     });
  //   }
  //   console.log(testFound.writingIds);
  //   const writingQuestions = await this.questionService.findAll(null, {
  //     _id: (testFound.writingIds || []).map((item) =>
  //       (item._id || item).toString(),
  //     ),
  //   });

  //   return testFound.answers
  //     .map((answer) => {
  //       const questionId = (
  //         (answer.questionId && answer.questionId._id) ||
  //         answer.questionId
  //       ).toString();
  //       const question =
  //         writingQuestions.filter(
  //           (question) => question._id.toString() == questionId,
  //         )[0] || null;
  //       return {
  //         questionId: questionId,
  //         questionNumber: (question && question.questionPartNumber) || 0,
  //         studentAnswer: answer.studentAnswer,
  //         question: question
  //           ? {
  //               _id: question._id,
  //               questionPartNumber: question.questionPartNumber,
  //               analysisType: question.analysisType,
  //               image: question.image,
  //               text: question.questionText,
  //               title: question.title,
  //             }
  //           : null,
  //       };
  //     })
  //     .filter((answer) => answer.question && answer.question._id)
  //     .map((answer, answerIndex) => {
  //       const question = {
  //         ...(answer.question || {}),
  //       };

  //       delete question.questionPartNumber;

  //       return {
  //         ...answer,
  //         question: {
  //           ...question,
  //           questionNumber:
  //             answer.question.questionPartNumber || answerIndex + 1,
  //           displayNumber: `${answerIndex + 1}`,
  //         },
  //       };
  //     });
  // }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Get(':code/reading/result')
  // async getReadingTestResult(@Request() req, @Param('code') code: string) {
  //   if (!code || !Number.isSafeInteger(Number(code))) {
  //     throw new HttpException(`Invalid test code!`, HttpStatus.NOT_FOUND);
  //   }

  //   const testFound = await this.testService.findOne({
  //     testCode: Number(code),
  //     userId: req.user._id,
  //   });

  //   if (!testFound || !testFound._id) {
  //     throw new HttpException(`Test not exists!`, HttpStatus.NOT_FOUND);
  //   }

  //   if (testFound.status != TestStatus.FINISHED) {
  //     throw new HttpException(
  //       `This test not finish yet!`,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   const readingQuestionParts = await this.questionPartService.findAll(null, {
  //     _id: (testFound.readingIds || []).map((item) =>
  //       (item._id || item).toString(),
  //     ),
  //   });
  //   const readingQuestionGroups = await this.questionGroupService.findAll(
  //     null,
  //     {
  //       partId: (readingQuestionParts || []).map((item) =>
  //         (item._id || item).toString(),
  //       ),
  //     },
  //   );
  //   const readingQuestions = await this.questionService.findAll(null, {
  //     groupId: (readingQuestionGroups || []).map((item) =>
  //       (item._id || item).toString(),
  //     ),
  //   });
  //   const readingQuestionOptions = await this.questionOptionService.findAll({
  //     questionId: (readingQuestions || []).map((item) =>
  //       (item._id || item).toString(),
  //     ),
  //   });

  //   const results = readingQuestionParts.map(
  //     (readingQuestionPart, partIndex) => {
  //       return {
  //         _id: readingQuestionPart._id,
  //         partNumber: readingQuestionPart.partNumber || partIndex + 1,
  //         passageTitle: readingQuestionPart.passageTitle,
  //         passageText: readingQuestionPart.passageText,
  //         groups: readingQuestionGroups
  //           .filter(
  //             (readingQuestionGroup) =>
  //               (
  //                 (readingQuestionGroup.partId &&
  //                   readingQuestionGroup.partId._id) ||
  //                 readingQuestionGroup.partId
  //               ).toString() == readingQuestionPart._id.toString(),
  //           )
  //           .map((readingQuestionGroup, groupIndex) => ({
  //             _id: readingQuestionGroup._id,
  //             answerList: readingQuestionGroup.answerList,
  //             directionText: readingQuestionGroup.directionText,
  //             questionTypeTips: readingQuestionGroup.questionTypeTips,
  //             image: readingQuestionGroup.image,
  //             questionBox: readingQuestionGroup.questionBox,
  //             questionType: readingQuestionGroup.questionType,
  //             groupNumber:
  //               readingQuestionGroup.groupPartNumber || groupIndex + 1,
  //             questions: readingQuestions
  //               .filter(
  //                 (readingQuestion) =>
  //                   (
  //                     (readingQuestion.groupId &&
  //                       readingQuestion.groupId._id) ||
  //                     readingQuestion.groupId
  //                   ).toString() == readingQuestionGroup._id.toString(),
  //               )
  //               .map((readingQuestion) => {
  //                 const questionAnswer = testFound.answers.filter(
  //                   (answer) =>
  //                     (
  //                       (answer.questionId && answer.questionId._id) ||
  //                       answer.questionId
  //                     ).toString() == readingQuestion._id.toString(),
  //                 )[0];
  //                 return questionAnswer && questionAnswer.questionId
  //                   ? {
  //                       questionId: questionAnswer.questionId,
  //                       studentAnswer: questionAnswer.studentAnswer,
  //                       isCorrect: questionAnswer.isCorrect,
  //                       score: questionAnswer.score,
  //                       question: {
  //                         _id: readingQuestion._id,
  //                         answer: readingQuestion.answer,
  //                         explanationText: readingQuestion.explanationText,
  //                         options: readingQuestionOptions
  //                           .filter(
  //                             (readingQuestionOption) =>
  //                               readingQuestion._id.toString() ==
  //                               readingQuestionOption.questionId.toString(),
  //                           )
  //                           .map((readingQuestionOption) => ({
  //                             _id: readingQuestionOption._id,
  //                             key: readingQuestionOption.key,
  //                             text: readingQuestionOption.text,
  //                           })),
  //                         questionText: readingQuestion.questionText,
  //                         blankNumber: readingQuestion.blankNumber,
  //                       },
  //                     }
  //                   : null;
  //               })
  //               .filter(
  //                 (readingQuestion) =>
  //                   readingQuestion && readingQuestion.questionId,
  //               ),
  //           })),
  //       };
  //     },
  //   );

  //   let questionCount = 0;
  //   for (let i = 0; i < results.length; i++) {
  //     const questionPart = results[i];
  //     for (let j = 0; j < (questionPart.groups || []).length; j++) {
  //       const questionGroup = questionPart.groups[j];
  //       for (let k = 0; k < (questionGroup.questions || []).length; k++) {
  //         questionCount = questionCount + 1;
  //         results[i].groups[j].questions[k].question[
  //           'displayNumber'
  //         ] = `${questionCount}`;
  //       }
  //     }
  //   }

  //   return {
  //     score: testFound.score,
  //     reading: results,
  //   };
  // }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Get(':code/writing/result')
  // async getWritingTestResult(@Request() req, @Param('code') code: string) {
  //   if (!code || !Number.isSafeInteger(Number(code))) {
  //     throw new HttpException(`Invalid test code!`, HttpStatus.NOT_FOUND);
  //   }

  //   const testFound = await this.testService.findOne({
  //     testCode: Number(code),
  //     userId: req.user._id,
  //   });

  //   if (!testFound || !testFound._id) {
  //     throw new HttpException(`Test not exists!`, HttpStatus.NOT_FOUND);
  //   }

  //   if (testFound.status != TestStatus.FINISHED) {
  //     throw new HttpException(
  //       `This test not finish yet!`,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   const writingQuestions = await this.questionService.findAll(null, {
  //     _id: (testFound.writingIds || []).map((item) =>
  //       (item._id || item).toString(),
  //     ),
  //   });

  //   return {
  //     score: testFound.score,
  //     writing: testFound.answers
  //       .map((answer) => {
  //         const questionId = (
  //           (answer.questionId && answer.questionId._id) ||
  //           answer.questionId
  //         ).toString();
  //         const question =
  //           writingQuestions.filter(
  //             (question) => question._id.toString() == questionId,
  //           )[0] || null;

  //         return {
  //           questionId: questionId,
  //           studentAnswer: answer.studentAnswer,
  //           question: question
  //             ? {
  //                 _id: question._id,
  //                 questionPartNumber: question.questionPartNumber,
  //                 analysisType: question.analysisType,
  //                 image: question.image,
  //                 questionType: question.questionType,
  //                 text: question.questionText,
  //                 title: question.title,
  //                 ideaSuggestion: question.ideaSuggestion,
  //                 modelAnswer: question.modelAnswer,
  //                 organization: question.organization,
  //                 tips: question.tips,
  //                 usefulGrammarNVocab: question.usefulGrammarNVocab,
  //               }
  //             : null,
  //         };
  //       })
  //       .filter((answer) => answer.question && answer.question._id)
  //       .map((answer, answerIndex) => {
  //         const question = {
  //           ...(answer.question || {}),
  //         };

  //         delete question.questionPartNumber;

  //         return {
  //           ...answer,
  //           question: {
  //             ...question,
  //             questionNumber:
  //               answer.question.questionPartNumber || answerIndex + 1,
  //             displayNumber: `${answerIndex + 1}`,
  //           },
  //         };
  //       }),
  //   };
  // }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Get(':code/listening/result')
  // async getListeningTestResult(@Request() req, @Param('code') code: string) {
  //   if (!code || !Number.isSafeInteger(Number(code))) {
  //     throw new HttpException(`Invalid test code!`, HttpStatus.NOT_FOUND);
  //   }
  //   const testFound = await this.testService.findOne({
  //     testCode: Number(code),
  //     userId: req.user._id,
  //   });
  //   if (!testFound || !testFound._id) {
  //     throw new HttpException(`Test not exists!`, HttpStatus.NOT_FOUND);
  //   }
  //   if (testFound.status != TestStatus.FINISHED) {
  //     throw new HttpException(
  //       `This test not finish yet!`,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   const listeningQuestionParts = await this.questionPartService.findAll(
  //     null,
  //     {
  //       _id: (testFound.listeningIds || []).map((item) =>
  //         (item._id || item).toString(),
  //       ),
  //     },
  //   );
  //   const listeningQuestionGroups = await this.questionGroupService.findAll(
  //     null,
  //     {
  //       partId: (listeningQuestionParts || []).map((item) =>
  //         (item._id || item).toString(),
  //       ),
  //     },
  //   );
  //   const listeningQuestions = await this.questionService.findAll(null, {
  //     groupId: (listeningQuestionGroups || []).map((item) =>
  //       (item._id || item).toString(),
  //     ),
  //   });
  //   const listeningQuestionOptions = await this.questionOptionService.findAll({
  //     questionId: (listeningQuestions || []).map((item) =>
  //       (item._id || item).toString(),
  //     ),
  //   });
  //   const results = listeningQuestionParts.map(
  //     (listeningQuestionPart, partIndex) => {
  //       return {
  //         _id: listeningQuestionPart._id,
  //         partNumber: listeningQuestionPart.partNumber || partIndex + 1,
  //         partAudio: listeningQuestionPart.partAudio,
  //         partTitle: listeningQuestionPart.partTitle,
  //         groups: listeningQuestionGroups
  //           .filter(
  //             (listeningQuestionGroup) =>
  //               (
  //                 (listeningQuestionGroup.partId &&
  //                   listeningQuestionGroup.partId._id) ||
  //                 listeningQuestionGroup.partId
  //               ).toString() == listeningQuestionPart._id.toString(),
  //           )
  //           .map((listeningQuestionGroup, groupIndex) => ({
  //             _id: listeningQuestionGroup._id,
  //             answerList: listeningQuestionGroup.answerList,
  //             directionText: listeningQuestionGroup.directionText,
  //             groupNumber:
  //               listeningQuestionGroup.groupPartNumber || groupIndex + 1,
  //             image: listeningQuestionGroup.image,
  //             questionBox: listeningQuestionGroup.questionBox,
  //             questionType: listeningQuestionGroup.questionType,
  //             script: listeningQuestionGroup.script,
  //             questionTypeTips: listeningQuestionGroup.questionTypeTips,
  //             questions: listeningQuestions
  //               .filter(
  //                 (listeningQuestion) =>
  //                   (
  //                     (listeningQuestion.groupId &&
  //                       listeningQuestion.groupId._id) ||
  //                     listeningQuestion.groupId
  //                   ).toString() == listeningQuestionGroup._id.toString(),
  //               )
  //               .map((listeningQuestion) => {
  //                 const questionAnswer = testFound.answers.filter(
  //                   (answer) =>
  //                     (
  //                       (answer.questionId && answer.questionId._id) ||
  //                       answer.questionId
  //                     ).toString() == listeningQuestion._id.toString(),
  //                 )[0];
  //                 return questionAnswer && questionAnswer.questionId
  //                   ? {
  //                       questionId: questionAnswer.questionId,
  //                       studentAnswer: questionAnswer.studentAnswer,
  //                       isCorrect: questionAnswer.isCorrect,
  //                       score: questionAnswer.score,
  //                       question: {
  //                         _id: listeningQuestion._id,
  //                         answer: listeningQuestion.answer,
  //                         explanationText: listeningQuestion.explanationText,
  //                         options: listeningQuestionOptions
  //                           .filter(
  //                             (listeningQuestionOption) =>
  //                               listeningQuestion._id.toString() ==
  //                               listeningQuestionOption.questionId.toString(),
  //                           )
  //                           .map((listeningQuestionOption) => ({
  //                             _id: listeningQuestionOption._id,
  //                             key: listeningQuestionOption.key,
  //                             text: listeningQuestionOption.text,
  //                           })),
  //                         questionText: listeningQuestion.questionText,
  //                         blankNumber: listeningQuestion.blankNumber,
  //                       },
  //                     }
  //                   : null;
  //               })
  //               .filter(
  //                 (listeningQuestion) =>
  //                   listeningQuestion && listeningQuestion.questionId,
  //               ),
  //           })),
  //       };
  //     },
  //   );
  //   let questionCount = 0;
  //   for (let i = 0; i < results.length; i++) {
  //     const questionPart = results[i];
  //     for (let j = 0; j < (questionPart.groups || []).length; j++) {
  //       const questionGroup = questionPart.groups[j];
  //       for (let k = 0; k < (questionGroup.questions || []).length; k++) {
  //         questionCount = questionCount + 1;
  //         results[i].groups[j].questions[k].question[
  //           'displayNumber'
  //         ] = `${questionCount}`;
  //       }
  //     }
  //   }
  //   return {
  //     score: testFound.score,
  //     listening: results,
  //   };
  // }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Get(':code/speaking/result')
  // async getSpeakingTestResult(@Request() req, @Param('code') code: string) {
  //   if (!code || !Number.isSafeInteger(Number(code))) {
  //     throw new HttpException(`Invalid test code!`, HttpStatus.NOT_FOUND);
  //   }

  //   const testFound = await this.testService.findOne({
  //     testCode: Number(code),
  //     userId: req.user._id,
  //   });

  //   if (!testFound || !testFound._id) {
  //     throw new HttpException(`Test not exists!`, HttpStatus.NOT_FOUND);
  //   }

  //   if (testFound.status != TestStatus.FINISHED) {
  //     throw new HttpException(
  //       `This test not finish yet!`,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   const speakingQuestionParts = await this.questionPartService.findAll(null, {
  //     _id: (testFound.speakingIds || []).map((item) =>
  //       (item._id || item).toString(),
  //     ),
  //   });
  //   const speakingQuestionGroups = await this.questionGroupService.findAll(
  //     null,
  //     {
  //       partId: (speakingQuestionParts || []).map((item) =>
  //         (item._id || item).toString(),
  //       ),
  //     },
  //   );
  //   const speakingQuestions = await this.questionService.findAll(null, {
  //     groupId: (speakingQuestionGroups || []).map((item) =>
  //       (item._id || item).toString(),
  //     ),
  //   });

  //   const results = speakingQuestionParts.map(
  //     (speakingQuestionPart, partIndex) => {
  //       return {
  //         _id: speakingQuestionPart._id,
  //         directionAudio: speakingQuestionPart.directionAudio,
  //         partNumber: speakingQuestionPart.partNumber || partIndex + 1,
  //         groups: speakingQuestionGroups
  //           .filter(
  //             (speakingQuestionGroup) =>
  //               (
  //                 (speakingQuestionGroup.partId &&
  //                   speakingQuestionGroup.partId._id) ||
  //                 speakingQuestionGroup.partId
  //               ).toString() == speakingQuestionPart._id.toString(),
  //           )
  //           .map((speakingQuestionGroup, groupIndex) => ({
  //             _id: speakingQuestionGroup._id,
  //             groupNumber:
  //               speakingQuestionGroup.groupPartNumber || groupIndex + 1,
  //             explanationText: speakingQuestionGroup.explanationText,
  //             ideaSuggestion: speakingQuestionGroup.ideaSuggestion,
  //             usefulGrammarNVocab: speakingQuestionGroup.usefulGrammarNVocab,
  //             title: speakingQuestionGroup.title,
  //             questions: speakingQuestions
  //               .filter(
  //                 (speakingQuestion) =>
  //                   (
  //                     (speakingQuestion.groupId &&
  //                       speakingQuestion.groupId._id) ||
  //                     speakingQuestion.groupId
  //                   ).toString() == speakingQuestionGroup._id.toString(),
  //               )
  //               .map((speakingQuestion) => {
  //                 const questionAnswer = testFound.answers.filter(
  //                   (answer) =>
  //                     (
  //                       (answer.questionId && answer.questionId._id) ||
  //                       answer.questionId
  //                     ).toString() == speakingQuestion._id.toString(),
  //                 )[0];
  //                 return questionAnswer && questionAnswer.questionId
  //                   ? {
  //                       questionId: questionAnswer.questionId,
  //                       studentAnswerAudio: questionAnswer.studentAnswerAudio,
  //                       score: questionAnswer.score,
  //                       question: {
  //                         _id: speakingQuestion._id,
  //                         modelAnswer: speakingQuestion.modelAnswer,
  //                         modelAnswerAudio: speakingQuestion.modelAnswerAudio,
  //                         questionText: speakingQuestion.questionText,
  //                       },
  //                     }
  //                   : null;
  //               })
  //               .filter(
  //                 (speakingQuestion) =>
  //                   speakingQuestion && speakingQuestion.questionId,
  //               ),
  //           })),
  //       };
  //     },
  //   );

  //   let questionCount = 0;
  //   for (let i = 0; i < results.length; i++) {
  //     const questionPart = results[i];
  //     for (let j = 0; j < (questionPart.groups || []).length; j++) {
  //       const questionGroup = questionPart.groups[j];
  //       for (let k = 0; k < (questionGroup.questions || []).length; k++) {
  //         questionCount = questionCount + 1;
  //         results[i].groups[j].questions[k].question[
  //           'displayNumber'
  //         ] = `${questionCount}`;
  //       }
  //     }
  //   }

  //   return {
  //     score: testFound.score,
  //     speaking: results,
  //   };
  // }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':code')
  async update(
    @Request() req,
    @Param('code') code: string,
    @Body() testSubmitAnswerInput: TestSubmitAnswerInput,
  ) {
    if (!code || !Number.isSafeInteger(Number(code))) {
      throw new HttpException(`Invalid test code!`, HttpStatus.NOT_FOUND);
    }

    const testFound = await this.testService.findOne({
      testCode: Number(code),
      userId: req.user._id,
    });

    if (!testFound || !testFound._id) {
      throw new HttpException(`Test not exists!`, HttpStatus.NOT_FOUND);
    }

    if (testFound.status == TestStatus.FINISHED) {
      throw new HttpException(
        `You cannot submit answer for this test anymore!`,
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
      testSubmitAnswerInput.answers &&
      testSubmitAnswerInput.answers.length > 0
    ) {
      for (let i = 0; i < testSubmitAnswerInput.answers.length; i++) {
        const testSubmitAnswer = testSubmitAnswerInput.answers[i];
        const isAnswerExists = userAnswerIds.includes(
          testSubmitAnswer.questionId,
        );
        if (!isAnswerExists) {
          throw new HttpException(
            `This test do not have question with _id '${testSubmitAnswer.questionId}'!`,
            HttpStatus.BAD_REQUEST,
          );
        }

        userAnswers[
          userAnswerIds.indexOf(testSubmitAnswer.questionId)
        ].studentAnswer = testSubmitAnswer.studentAnswer;
      }
    }

    await this.testService.update(testFound._id.toString(), {
      status: TestStatus.IN_PROGRESS,
      answers: userAnswers,
    });

    return true;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':code/:skill/progress')
  async updateProgress(
    @Request() req,
    @Param('code') code: string,
    @Param('skill') skill: string,
    @Body() updateTestProgressInput: UpdateTestProgressInput,
  ) {
    const testSkill = (skill && skill.toUpperCase()) || null;

    if (!code || !Number.isSafeInteger(Number(code))) {
      throw new HttpException(`Invalid test code!`, HttpStatus.NOT_FOUND);
    }

    if (
      !testSkill ||
      !Object.values(QuestionSkill)
        .map((item) => item.toString())
        .includes(testSkill)
    ) {
      throw new HttpException(`Invalid skill!`, HttpStatus.BAD_REQUEST);
    }

    const testFound = await this.testService.findOne({
      testCode: Number(code),
      userId: req.user._id,
    });

    if (!testFound || !testFound._id) {
      throw new HttpException(`Test not exists!`, HttpStatus.NOT_FOUND);
    }

    if (testFound.status == TestStatus.FINISHED) {
      throw new HttpException(
        `You cannot submit answer for this test anymore!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.testService.update(testFound._id.toString(), {
      progress: {
        ...Object.keys(testFound.progress || {})
          .map((progressSkill) => ({
            timeRemain: testFound.progress[progressSkill]?.timeRemain,
            currentPart: testFound.progress[progressSkill]?.currentPart,
            currentGroup: testFound.progress[progressSkill]?.currentGroup,
            currentQuestion: testFound.progress[progressSkill]?.currentQuestion,
            audioPlayedTime: testFound.progress[progressSkill]?.audioPlayedTime,
          }))
          .reduce(
            (result, item, index) => ({
              ...result,
              [Object.keys(testFound.progress)[index]]: item,
            }),
            {},
          ),
        [skill]: {
          timeRemain:
            updateTestProgressInput.timeRemain ||
            testFound.progress?.[skill]?.timeRemain,
          currentPart:
            updateTestProgressInput.currentPart ||
            testFound.progress?.[skill]?.currentPart,
          currentGroup:
            updateTestProgressInput.currentGroup ||
            testFound.progress?.[skill]?.currentGroup,
          currentQuestion:
            updateTestProgressInput.currentQuestion ||
            testFound.progress?.[skill]?.currentQuestion,
          audioPlayedTime:
            updateTestProgressInput.audioPlayedTime ||
            testFound.progress?.[skill]?.audioPlayedTime,
        },
      },
    });

    return true;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('/:code/:questionId/audio-answer')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userAudioAnswer: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['userAudioAnswer'],
    },
  })
  @UseInterceptors(FileInterceptor('userAudioAnswer'))
  async uploadFile(
    @Request() req,
    @UploadedFile() userAudioAnswerFile: Express.Multer.File,
    @Param('code') code: string,
    @Param('questionId') questionId: string,
  ) {
    if (!code || !Number.isSafeInteger(Number(code))) {
      throw new HttpException(`Invalid test code!`, HttpStatus.NOT_FOUND);
    }

    const testFound = await this.testService.findOne({
      testCode: Number(code),
      userId: req.user._id,
    });

    if (!testFound || !testFound._id) {
      throw new HttpException(`Test not exists!`, HttpStatus.NOT_FOUND);
    }

    if (testFound.status == TestStatus.FINISHED) {
      throw new HttpException(
        `You cannot submit answer for this test anymore!`,
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

    if (!userAnswerIds.includes(questionId)) {
      throw new HttpException(
        `Your test not contain this question!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    userAnswers[userAnswerIds.indexOf(questionId)].studentAnswerAudio = `${
      userAudioAnswerFile.destination.split('/public/')[1]
    }/${userAudioAnswerFile.filename}`;

    await this.testService.update(testFound._id.toString(), {
      status: TestStatus.IN_PROGRESS,
      answers: userAnswers,
    });

    return true;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description: `skill: ${Object.values(QuestionSkill)
      .map((item) => item.toLowerCase())
      .join(' | ')}`,
  })
  @Post(':code/:skill/finish')
  async finishSkill(
    @Request() req,
    @Param('code') code: string,
    @Param('skill') skill: string,
  ) {
    const testSkill = (skill && skill.toUpperCase()) || null;

    if (!code || !Number.isSafeInteger(Number(code))) {
      throw new HttpException(`Invalid test code!`, HttpStatus.NOT_FOUND);
    }

    if (
      !testSkill ||
      !Object.values(QuestionSkill)
        .map((item) => item.toString())
        .includes(testSkill)
    ) {
      throw new HttpException(`Invalid skill!`, HttpStatus.BAD_REQUEST);
    }

    const testFound = await this.testService.findOne({
      testCode: Number(code),
      userId: req.user._id,
    });

    if (!testFound || !testFound._id) {
      throw new HttpException(`Test not exists!`, HttpStatus.NOT_FOUND);
    }

    if (testFound.status == TestStatus.FINISHED) {
      throw new HttpException(
        `This test already finish!`,
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

    const updateData = {};

    const questionList = [
      ...(examFound.listening || []).reduce((result, listeningPart) => {
        const questions = (listeningPart.groups || []).reduce(
          (_result, listeningGroup) => {
            return [..._result, ...(listeningGroup.questions || [])];
          },
          [],
        );
        return [...result, ...questions];
      }, []),
      ...(examFound.reading || []).reduce((result, readingPart) => {
        const questions = (readingPart.groups || []).reduce(
          (_result, readingGroup) => {
            return [..._result, ...(readingGroup.questions || [])];
          },
          [],
        );
        return [...result, ...questions];
      }, []),
    ];
    const answers = testFound.answers;

    switch (testSkill) {
      case QuestionSkill.LISTENING:
        {
          if (testFound.listeningFinishedDate) {
            throw new HttpException(
              `Skill ${skill} already finish!`,
              HttpStatus.BAD_REQUEST,
            );
          }

          let totalListeningScore = 0;
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
              if (
                question.questionType ==
                QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWER
              ) {
                const studentAnswerList = (answer.studentAnswer || '')
                  .split(',')
                  .map((item) => item.trim())
                  .sort();
                const questionAnswerList = (question.answer || '')
                  .split(',')
                  .map((item) => item.trim())
                  .sort();
                if (
                  JSON.stringify(studentAnswerList) ==
                  JSON.stringify(questionAnswerList)
                ) {
                  answers[i].isCorrect = true;
                  answers[i].score = 1;
                  totalListeningScore = totalListeningScore + 1;
                } else {
                  answers[i].isCorrect = false;
                  answers[i].score = 0;
                }
              } else {
                if (
                  answer.studentAnswer &&
                  (question.answer || '')
                    .split(',')
                    .map((item) => item.trim())
                    .includes(answer.studentAnswer.trim())
                ) {
                  answers[i].isCorrect = true;
                  answers[i].score = 1;
                  totalListeningScore = totalListeningScore + 1;
                } else {
                  answers[i].isCorrect = false;
                  answers[i].score = 0;
                }
              }
            }
          }

          updateData['score.listening'] = totalListeningScore;
          updateData['listeningFinishedDate'] = moment().toISOString();
        }
        break;
      case QuestionSkill.READING:
        {
          if (testFound.readingFinishedDate) {
            throw new HttpException(
              `Skill ${skill} already finish!`,
              HttpStatus.BAD_REQUEST,
            );
          }

          let totalReadingScore = 0;
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
              if (
                question.questionType ==
                QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWER
              ) {
                const studentAnswerList = (answer.studentAnswer || '')
                  .split(',')
                  .map((item) => item.trim())
                  .sort();
                const questionAnswerList = (question.answer || '')
                  .split(',')
                  .map((item) => item.trim())
                  .sort();
                if (
                  JSON.stringify(studentAnswerList) ==
                  JSON.stringify(questionAnswerList)
                ) {
                  answers[i].isCorrect = true;
                  answers[i].score = 1;
                  totalReadingScore = totalReadingScore + 1;
                } else {
                  answers[i].isCorrect = false;
                  answers[i].score = 0;
                }
              } else {
                if (
                  answer.studentAnswer &&
                  (question.answer || '')
                    .split(',')
                    .map((item) => item.trim())
                    .includes(answer.studentAnswer.trim())
                ) {
                  answers[i].isCorrect = true;
                  answers[i].score = 1;
                  totalReadingScore = totalReadingScore + 1;
                } else {
                  answers[i].isCorrect = false;
                  answers[i].score = 0;
                }
              }
            }
          }

          updateData['score.reading'] = totalReadingScore;
          updateData['readingFinishedDate'] = moment().toISOString();
        }
        break;
      case QuestionSkill.SPEAKING:
      case QuestionSkill.WRITING:
      default:
        break;
    }

    await this.testService.update(testFound._id.toString(), updateData);

    return true;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':code/finish')
  async finish(@Request() req, @Param('code') code: string) {
    if (!code || !Number.isSafeInteger(Number(code))) {
      throw new HttpException(`Invalid test code!`, HttpStatus.NOT_FOUND);
    }

    const testFound = await this.testService.findOne({
      testCode: Number(code),
      userId: req.user._id,
    });

    if (!testFound || !testFound._id) {
      throw new HttpException(`Test not exists!`, HttpStatus.NOT_FOUND);
    }

    if (testFound.status == TestStatus.FINISHED) {
      throw new HttpException(
        `This test already finish!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const updateData = {
      status: TestStatus.FINISHED,
      finishedDate: moment().toISOString(),
    };

    const examFound = await this.examinationExamService.findOne({
      _id: (
        (testFound.exam && testFound.exam._id) ||
        testFound.exam
      ).toString(),
    });

    if (!examFound || !examFound._id) {
      throw new HttpException(`Get exam failed!`, HttpStatus.BAD_REQUEST);
    }

    const questionList = [
      ...(examFound.listening || []).reduce((result, listeningPart) => {
        const questions = (listeningPart.groups || []).reduce(
          (_result, listeningGroup) => {
            return [..._result, ...(listeningGroup.questions || [])];
          },
          [],
        );
        return [...result, ...questions];
      }, []),
      ...(examFound.reading || []).reduce((result, readingPart) => {
        const questions = (readingPart.groups || []).reduce(
          (_result, readingGroup) => {
            return [..._result, ...(readingGroup.questions || [])];
          },
          [],
        );
        return [...result, ...questions];
      }, []),
    ];
    const answers = testFound.answers;
    let totalReadingScore = 0;
    let totalListeningScore = 0;
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
        if (
          question.questionType == QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWER
        ) {
          const studentAnswerList = (answer.studentAnswer || '')
            .split(',')
            .map((item) => item.trim())
            .sort();
          const questionAnswerList = (question.answer || '')
            .split(',')
            .map((item) => item.trim())
            .sort();
          if (
            JSON.stringify(studentAnswerList) ==
            JSON.stringify(questionAnswerList)
          ) {
            answers[i].isCorrect = true;
            answers[i].score = 1;
            if (question.skill == QuestionSkill.READING) {
              totalReadingScore = totalReadingScore + 1;
            } else if (question.skill == QuestionSkill.LISTENING) {
              totalListeningScore = totalListeningScore + 1;
            }
          } else {
            answers[i].isCorrect = false;
            answers[i].score = 0;
          }
        } else {
          if (
            answer.studentAnswer &&
            (question.answer || '')
              .split(',')
              .map((item) => item.trim())
              .includes(answer.studentAnswer.trim())
          ) {
            answers[i].isCorrect = true;
            answers[i].score = 1;
            if (question.skill == QuestionSkill.READING) {
              totalReadingScore = totalReadingScore + 1;
            } else if (question.skill == QuestionSkill.LISTENING) {
              totalListeningScore = totalListeningScore + 1;
            }
          } else {
            answers[i].isCorrect = false;
            answers[i].score = 0;
          }
        }
      }
    }
    updateData['answers'] = answers;
    updateData['score.reading'] = totalReadingScore;
    updateData['score.listening'] = totalListeningScore;
    updateData['score.total'] = 0;
    updateData['isGrading'] = true;

    await this.testService.update(testFound._id.toString(), updateData);

    return true;
  }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // // @ApiOperation({
  // //   description: `skill: ${QuestionSkill.READING} | ${QuestionSkill.WRITING} | ${QuestionSkill.SPEAKING} | ${QuestionSkill.LISTENING}`,
  // // })
  // @Get('results')
  // async testResults(@Request() req, @Query() query: TestResultsQueryDto) {
  //   const page =
  //     query &&
  //     query.page &&
  //     Number.isSafeInteger(Number(query.page)) &&
  //     Number(query.page) > 0
  //       ? Number(query.page)
  //       : 1;
  //   const pageSize =
  //     query &&
  //     query.pageSize &&
  //     Number.isSafeInteger(Number(query.pageSize)) &&
  //     Number(query.pageSize) > 0
  //       ? Number(query.pageSize)
  //       : 10;
  //   const sortBy =
  //     query &&
  //     query.sort &&
  //     query.sort.trim() &&
  //     query.sort.trim().split(':').length == 2
  //       ? query.sort.trim().split(':')
  //       : null;

  //   const sortableFields = ['createdAt', 'updatedAt'];
  //   let testSortDto: TestSortDto = null;
  //   if (
  //     sortBy &&
  //     sortBy.length == 2 &&
  //     sortableFields.includes(sortBy[0].trim()) &&
  //     ['ASC', 'DESC'].includes(sortBy[1].trim().toUpperCase())
  //   ) {
  //     testSortDto = {
  //       [sortBy[0]]: sortBy[1].trim().toUpperCase() === 'ASC' ? 1 : -1,
  //     };
  //   }

  //   const testQuery = {
  //     userId: req.user._id,
  //     status: TestStatus.FINISHED,
  //   };

  //   const totalTests = await this.testService.countDocuments(testQuery);
  //   const totalPage = Math.ceil(totalTests / pageSize);

  //   const testList =
  //     page > 0 && page <= totalPage
  //       ? await this.testService.query(
  //           { page, pageSize },
  //           testSortDto,
  //           testQuery,
  //         )
  //       : [];

  //   return {
  //     data: testList.map((test) => ({
  //       _id: test._id,
  //       testCode: test.testCode,
  //       examination: test.examination,
  //       score: test.score,
  //       isGrading: test.isGrading,
  //       finishedDate: test.finishedDate,
  //     })),
  //     paging: {
  //       page,
  //       pageSize,
  //       totalPage,
  //       nextPage: page + 1 <= totalPage ? page + 1 : null,
  //       prevPage: page - 1 >= 1 ? page - 1 : null,
  //       total: totalTests,
  //     },
  //   };
  // }
}
