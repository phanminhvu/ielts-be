import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import combinate from 'combinate';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as path from 'path';
import * as XLSX from 'xlsx';
import { verifyEmail } from './../helpers/utils';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import configuration from '../common/configuration';
import examinationResultTemplate from '../common/examinationResultTemplate';
import {
  ListeningQuestionGroup,
  ListeningQuestionPart,
} from '../dtos/listening-question.dto';
import {
  ReadingQuestionGroup,
  ReadingQuestionPart,
} from '../dtos/reading-question.dto';
import { ExaminationExamService } from '../examination-exam/examination-exam.service';
import { permute } from '../helpers/utils';
import { QuestionGroupService } from '../question-group/question-group.service';
import { QuestionOptionService } from '../question-option/question-option.service';
import { QuestionSkill } from '../question-part/enums/question-skill.enum';
import { QuestionService } from '../question/question.service';
import { CreateStudentProfileDto } from '../student-profile/dtos/create-student-profile.input';
import { StudentProfileService } from '../student-profile/student-profile.service';
import { TestService } from '../test/test.service';
import { UserType } from '../user/enums/user-type.enum';
import { ExamService } from './../exam/exam.service';
import { QuestionType } from './../question-group/enums/question-type.enum';
import { QuestionPartService } from './../question-part/question-part.service';
import { UserService } from './../user/user.service';
import { CreateExaminationDto } from './dto/create-examination.input';
import { ExaminationExamListDto } from './dto/examination-exam-list.query';
import { ExaminationGenerateExamDto } from './dto/examination-generate-exam.input';
import { ExaminationListDto } from './dto/examination-list.query';
import { ExaminationSortDto } from './dto/examination-sort.dto';
import { UpdateExaminationDto } from './dto/update-examination.input';
import { ExaminationService } from './examination.service';

@ApiTags('Examination')
@Controller('examinations')
export class ExaminationController {
  constructor(
    private readonly examinationService: ExaminationService,
    private readonly examinationExamService: ExaminationExamService,
    private readonly userService: UserService,
    private readonly examService: ExamService,
    private readonly questionPartService: QuestionPartService,
    private readonly questionGroupService: QuestionGroupService,
    private readonly questionService: QuestionService,
    private readonly questionOptionService: QuestionOptionService,
    private readonly studentProfileService: StudentProfileService,
    private readonly testService: TestService,
  ) {}

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.POETCREATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(
    @Request() req,
    @Body() createExaminationInput: CreateExaminationDto,
  ) {
    const requireFields = ['name'];
    for (let i = 0; i < requireFields.length; i++) {
      const field = requireFields[i];
      if (
        !createExaminationInput[field] ||
        ((typeof createExaminationInput[field]).toLocaleLowerCase() ===
          'string' &&
          !createExaminationInput[field].trim())
      ) {
        throw new HttpException(
          `Field ${field} is required!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (
      createExaminationInput.studentIds &&
      createExaminationInput.studentIds.length > 0
    ) {
      if (
        createExaminationInput.studentIds.length >
        configuration().maxExaminationStudent
      ) {
        throw new HttpException(
          `Max student of examination is ${
            configuration().maxExaminationStudent
          }!`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const totalUserExists = await this.studentProfileService.findAll({
        _id: createExaminationInput.studentIds,
      });
      if (
        createExaminationInput.studentIds.filter(
          (userId) =>
            !totalUserExists
              .map((user) => user._id.toString())
              .includes(userId),
        ).length > 0
      ) {
        throw new HttpException(
          `Student with ids '${createExaminationInput.studentIds
            .filter(
              (userId) =>
                !totalUserExists
                  .map((user) => user._id.toString())
                  .includes(userId),
            )
            .join(', ')}' are not exists!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return this.examinationService.create({
      ...createExaminationInput,
    });
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.POETCREATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('import-excel')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@Request() req, @UploadedFile() file: Express.Multer.File) {
    const workbook = XLSX.readFile(file.path, {
      cellText: false,
      cellDates: true,
    });
    if (workbook.SheetNames && workbook.SheetNames.length > 0) {
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      let startRow;
      let endRow;
      const sheetFirstColumnKeys = Object.keys(sheet).filter((key) =>
        new RegExp('^A').test(key),
      );
      for (let i = 0; i < sheetFirstColumnKeys.length; i++) {
        const key = sheetFirstColumnKeys[i];
        const rowNumber = Number(key.replace('A', ''));
        if (
          sheet[key] &&
          sheet[key].t == 's' &&
          sheet[key].v &&
          sheet[key].v.trim() &&
          sheet[key].v.trim().toLowerCase() == 'stt'
        ) {
          const nextKey = sheetFirstColumnKeys[i + 1];
          startRow = (nextKey && Number(nextKey.replace('A', ''))) || null;
        } else if (
          startRow &&
          rowNumber > startRow &&
          !endRow &&
          sheet[key] &&
          sheet[key].v &&
          sheet[key].t == 's'
        ) {
          endRow = rowNumber;
        }
      }

      if (startRow && endRow) {
        let sheetRowKeys = Object.keys(sheet);
        sheetRowKeys = sheetRowKeys.slice(
          sheetRowKeys.indexOf(`A${startRow}`),
          sheetRowKeys.indexOf(`A${endRow}`),
        );
        const studentData = {
          ...sheetRowKeys.reduce(
            (result, item) => ({
              ...result,
              [item]: sheet[item],
            }),
            {},
          ),
          '!ref': sheet['!ref'],
          '!merges': [],
        };
        const sheetData = XLSX.utils.sheet_to_json(studentData, {
          raw: false,
          dateNF: 'DD/MM/YYYY',
          defval: '',
        });

        if (sheetData && sheetData.length > 0) {
          const students = await Promise.all(
            sheetData.map((sheetDataRow) =>
              (async () => {
                const rowData = Object.values(sheetDataRow);
                const newStudent: CreateStudentProfileDto = {
                  studentCode: rowData[1],
                  candidateCode: null,
                  user: null,
                  gender: rowData[2] || '',
                  fullname:
                    rowData[6] && rowData[6]
                      ? `${rowData[3] || ''} ${rowData[4] || ''}`
                      : '',
                  dob:
                    rowData[6] && rowData[6] && rowData[6]
                      ? moment(
                          `${rowData[6] || ''}/${rowData[7] || ''}/${
                            rowData[8] || ''
                          }`,
                          'DD/MM/YYYY',
                        ).toISOString()
                      : '',
                  idCardNumber: rowData[9] || '',
                  phone: rowData[10] || '',
                  email: rowData[11] || '',
                  majors: rowData[12] || '',
                  classroom: rowData[13] || '',
                  examroom: rowData[14] || '',
                };

                if (newStudent.email && !verifyEmail(newStudent.email)) {
                  throw new HttpException(
                    `Email is not in correct format!`,
                    HttpStatus.BAD_REQUEST,
                  );
                }
                const studentFound = await this.studentProfileService.findOne({
                  studentCode: newStudent.studentCode,
                });
                const studentEmail =
                  newStudent.email ||
                  `${newStudent.studentCode}${
                    configuration().defaultEmailDomain
                  }`;
                if (studentFound && studentFound._id) {
                  const updateData = {
                    gender: newStudent.gender,
                    fullname: newStudent.fullname,
                    dob: newStudent.dob,
                    idCardNumber: newStudent.idCardNumber,
                    phone: newStudent.phone,
                    email: studentEmail,
                    majors: newStudent.majors,
                    classroom: newStudent.classroom,
                    examroom: newStudent.examroom,
                  };
                  for (const key in updateData) {
                    if (!updateData[key]) delete updateData[key];
                  }
                  const studentUpdated =
                    await this.studentProfileService.update(
                      studentFound._id.toString(),
                      {
                        ...updateData,
                      },
                    );
                  return studentUpdated;
                }
                let userFound = await this.userService.findOne({
                  username: newStudent.studentCode,
                });
                if (!userFound || !userFound._id) {
                  userFound = await this.userService.findOne({
                    email: studentEmail,
                  });
                }
                if (!userFound || !userFound._id) {
                  userFound = await this.userService.create({
                    username: newStudent.studentCode,
                    email: studentEmail,
                    fullname: newStudent.fullname || null,
                    dob: newStudent.dob || null,
                    avatar: newStudent.image || null,
                    verified: true,
                  });
                }
                if (!userFound || !userFound._id) {
                  throw new HttpException(
                    `Internal server error!`,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                  );
                }
                const studentCreated = await this.studentProfileService.create({
                  ...newStudent,
                  candidateCode: userFound._id.toString(),
                  user: userFound._id.toString(),
                });
                if (studentCreated && studentCreated._id) return studentCreated;
              })(),
            ),
          );

          fs.unlinkSync(file.path);
          return students;
        }
      }
    }

    throw new HttpException(
      `Failed to get data from file!`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async all() {
    return await this.examinationService.findAll({ active: true });
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.POETCREATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/list')
  async query(@Request() req, @Query() query: ExaminationListDto) {
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
    let examinationSort: ExaminationSortDto = null;
    if (
      sortBy &&
      sortBy.length == 2 &&
      sortableFields.includes(sortBy[0].trim()) &&
      ['ASC', 'DESC'].includes(sortBy[1].trim().toUpperCase())
    ) {
      examinationSort = {
        [sortBy[0]]: sortBy[1].trim().toUpperCase() === 'ASC' ? 1 : -1,
      };
    }

    const filter = {};

    const totalExaminations = await this.examinationService.countDocuments(
      filter,
    );
    const totalPage = Math.ceil(totalExaminations / pageSize);

    const examinationList =
      page > 0 && page <= totalPage
        ? await this.examinationService.query(
            { page, pageSize },
            examinationSort,
            filter,
          )
        : [];

    return {
      data: examinationList,
      paging: {
        page,
        pageSize,
        totalPage,
        nextPage: page + 1 <= totalPage ? page + 1 : null,
        prevPage: page - 1 >= 1 ? page - 1 : null,
        total: totalExaminations,
      },
    };
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.POETCREATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const examinationFound =
      await this.examinationService.findByIdWithFullDetail(id);
    if (!examinationFound || !examinationFound._id) {
      throw new HttpException(`Examination not exists!`, HttpStatus.NOT_FOUND);
    }

    const totalExaminationExams =
      await this.examinationExamService.countDocuments({
        examination: examinationFound._id.toString(),
      });
    const totalIsUsedExaminationExams =
      await this.examinationExamService.countDocuments({
        examination: examinationFound._id.toString(),
        isUsed: true,
      });
    return {
      ...examinationFound,
      studentDetails: (examinationFound.studentDetails || []).map(
        (studentProfile, index) => ({
          ...studentProfile,
          orderNumber: index + 1,
        }),
      ),
      totalExam: totalExaminationExams,
      totalIsUsedExam: totalIsUsedExaminationExams,
      totalRemainExam: totalExaminationExams - totalIsUsedExaminationExams,
    };
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.POETCREATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':id/generate-exam')
  async generateExam(
    @Param('id') id: string,
    @Body() examinationGenerateExamInput: ExaminationGenerateExamDto,
  ) {
    const examinationFound = await this.examinationService.findById(id);
    if (!examinationFound || !examinationFound._id) {
      throw new HttpException(`Examination not exists!`, HttpStatus.NOT_FOUND);
    }

    if (
      !examinationGenerateExamInput.examIds ||
      examinationGenerateExamInput.examIds.length <= 0
    ) {
      throw new HttpException(
        `You need to provide at least one exam!`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (examinationGenerateExamInput.examIds.length > 2) {
      throw new HttpException(
        `Max exam can combine is 2!`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (
      examinationFound.examIds.filter((examId) =>
        examinationGenerateExamInput.examIds.includes(
          (examId._id || examId).toString(),
        ),
      ).length > 0
    ) {
      throw new HttpException(
        `This examination already use the exam(s) with id '${examinationFound.examIds
          .filter((examId) =>
            examinationGenerateExamInput.examIds.includes(
              (examId._id || examId).toString(),
            ),
          )
          .join(' | ')}'!`,
        HttpStatus.NOT_FOUND,
      );
    }

    const exams = await this.examService.findAll(null, {
      _id: examinationGenerateExamInput.examIds,
    });

    const questionParts = await this.questionPartService.findAll(null, {
      _id: exams.reduce(
        (total, exam) => [
          ...total,
          ...exam.listeningIds,
          ...exam.speakingIds,
          ...exam.readingIds,
        ],
        [],
      ),
    });
    const questionGroups = await this.questionGroupService.findAll(null, {
      partId: (questionParts || []).map((item) =>
        (item._id || item).toString(),
      ),
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

    const readingQuestionPart: ReadingQuestionPart[] = questionParts
      .filter((questionPart) => questionPart.skill == QuestionSkill.READING)
      .map((questionPart) => ({
        _id: questionPart._id.toString(),
        partNumber: questionPart.partNumber,
        passageText: questionPart.passageText,
        passageTitle: questionPart.passageTitle,
        groups: questionGroups
          .filter(
            (group) =>
              ((group.partId && group.partId._id) || group.partId).toString() ==
              questionPart._id.toString(),
          )
          .map((questionGroup) => ({
            _id: questionGroup._id.toString(),
            answerList: questionGroup.answerList,
            directionText: questionGroup.directionText,
            questionTypeTips: questionGroup.questionTypeTips,
            image: questionGroup.image,
            questionBox: questionGroup.questionBox,
            questionType: questionGroup.questionType,
            groupNumber: questionGroup.groupPartNumber,
            questions: questions
              .filter(
                (question) =>
                  (
                    (question.groupId && question.groupId._id) ||
                    question.groupId
                  ).toString() == questionGroup._id.toString(),
              )
              .map((question) => ({
                _id: question._id.toString(),
                answer: question.answer,
                explanationText: question.explanationText,
                questionText: question.questionText,
                blankNumber: question.blankNumber,
                options: questionOptions
                  .filter(
                    (questionOption) =>
                      (
                        (questionOption.questionId &&
                          questionOption.questionId._id) ||
                        questionOption.questionId
                      ).toString() == question._id.toString(),
                  )
                  .map((questionOption) => ({
                    _id: questionOption._id.toString(),
                    key: questionOption.key,
                    text: questionOption.text,
                  })),
              })),
          })),
      }));

    const listeningQuestionPart: ListeningQuestionPart[] = questionParts
      .filter((questionPart) => questionPart.skill == QuestionSkill.LISTENING)
      .map((questionPart) => ({
        _id: questionPart._id.toString(),
        partNumber: questionPart.partNumber,
        partAudio: questionPart.partAudio,
        partTitle: questionPart.partTitle,
        groups: questionGroups
          .filter(
            (group) =>
              ((group.partId && group.partId._id) || group.partId).toString() ==
              questionPart._id.toString(),
          )
          .map((questionGroup) => ({
            _id: questionGroup._id.toString(),
            answerList: questionGroup.answerList,
            directionText: questionGroup.directionText,
            questionTypeTips: questionGroup.questionTypeTips,
            image: questionGroup.image,
            questionBox: questionGroup.questionBox,
            questionType: questionGroup.questionType,
            groupNumber: questionGroup.groupPartNumber,
            script: questionGroup.script,
            questions: questions
              .filter(
                (question) =>
                  (
                    (question.groupId && question.groupId._id) ||
                    question.groupId
                  ).toString() == questionGroup._id.toString(),
              )
              .map((question) => ({
                _id: question._id.toString(),
                answer: question.answer,
                explanationText: question.explanationText,
                questionText: question.questionText,
                blankNumber: question.blankNumber,
                options: questionOptions
                  .filter(
                    (questionOption) =>
                      (
                        (questionOption.questionId &&
                          questionOption.questionId._id) ||
                        questionOption.questionId
                      ).toString() == question._id.toString(),
                  )
                  .map((questionOption) => ({
                    _id: questionOption._id.toString(),
                    key: questionOption.key,
                    text: questionOption.text,
                  })),
              })),
          })),
      }));

    const maxCombination = 3;
    const maxQuestionGroupCombination = 4;
    const maxQuestionCombination = 5;

    const readingQuestionParts = readingQuestionPart.map((questionPart) => {
      const questionGroups = questionPart.groups.map((questionGroup) => {
        let questionGroups: ReadingQuestionGroup[] = [questionGroup];

        if (
          (
            [
              QuestionType.MULTIPLE_CHOICE_1_ANSWER,
              QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWER,
            ] as string[]
          ).includes(questionGroup.questionType)
        ) {
          const questions = questionGroup.questions.map((question) => {
            const questionOptionIds = question.options.map(
              (option) => option._id,
            );
            const questionOptionPermuteds = permute(questionOptionIds).map(
              (questionOptionPermuted) =>
                questionOptionPermuted.map(
                  (questionOptionId) =>
                    question.options.filter(
                      (questionOption) =>
                        questionOption._id == questionOptionId,
                    )[0],
                ),
            );

            const questions = _.shuffle(questionOptionPermuteds).map(
              (questionOptions) => ({
                ...question,
                options: questionOptions,
              }),
            );

            return {
              questionId: question._id,
              questions: questions,
            };
          });
          const questionBanks = combinate(
            questions.reduce(
              (result, question) => ({
                ...result,
                [question.questionId]: _.sampleSize(
                  _.shuffle(question.questions),
                  maxQuestionCombination,
                ),
              }),
              {},
            ),
          );
          questionGroups = _.shuffle(questionBanks).map((questionBank) => ({
            ...questionGroup,
            questions: Object.values(questionBank),
          }));
        }
        // else if (
        //   (
        //     [
        //       QuestionType.IDENTIFYING_INFORMATION,
        //       QuestionType.IDENTIFYING_VIEWS_CLAIMS,
        //     ] as string[]
        //   ).includes(questionGroup.questionType)
        // ) {
        //   const questionIds = questionGroup.questions.map(
        //     (question) => question._id,
        //   );
        //   const questionPermuteds = permute(questionIds).map(
        //     (questionPermuted) =>
        //       questionPermuted.map(
        //         (questionId) =>
        //           questionGroup.questions.filter(
        //             (question) => question._id == questionId,
        //           )[0],
        //       ),
        //   );

        //   questionGroups = _.shuffle(questionPermuteds).map((questions) => ({
        //     ...questionGroup,
        //     questions: questions,
        //   }));
        // }

        return {
          groupId: questionGroup._id,
          groups: questionGroups,
        };
      });

      const questionGroupBanks = combinate(
        questionGroups.reduce(
          (result, questionGroup) => ({
            ...result,
            [questionGroup.groupId]: _.sampleSize(
              _.shuffle(questionGroup.groups),
              maxQuestionGroupCombination,
            ),
          }),
          {},
        ),
      );
      const questionParts: ReadingQuestionPart[] = questionGroupBanks.map(
        (questionGroupBank) => ({
          ...questionPart,
          groups: Object.values(questionGroupBank),
        }),
      );

      return {
        partId: questionPart._id,
        partNumber: questionPart.partNumber,
        parts: questionParts,
      };
    });

    const listeningQuestionParts = listeningQuestionPart.map((questionPart) => {
      const questionGroups = questionPart.groups.map((questionGroup) => {
        let questionGroups: ListeningQuestionGroup[] = [questionGroup];

        if (
          (
            [
              QuestionType.MULTIPLE_CHOICE_1_ANSWER,
              QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWER,
            ] as string[]
          ).includes(questionGroup.questionType)
        ) {
          const questions = questionGroup.questions.map((question) => {
            const questionOptionIds = question.options.map(
              (option) => option._id,
            );
            const questionOptionPermuteds = permute(questionOptionIds).map(
              (questionOptionPermuted) =>
                questionOptionPermuted.map(
                  (questionOptionId) =>
                    question.options.filter(
                      (questionOption) =>
                        questionOption._id == questionOptionId,
                    )[0],
                ),
            );

            const questions = _.shuffle(questionOptionPermuteds).map(
              (questionOptions) => ({
                ...question,
                options: questionOptions,
              }),
            );

            return {
              questionId: question._id,
              questions: questions,
            };
          });
          const questionBanks = combinate(
            questions.reduce(
              (result, question) => ({
                ...result,
                [question.questionId]: _.sampleSize(
                  _.shuffle(question.questions),
                  maxQuestionCombination,
                ),
              }),
              {},
            ),
          );
          questionGroups = _.shuffle(questionBanks).map((questionBank) => ({
            ...questionGroup,
            questions: Object.values(questionBank),
          }));
        }
        // else if (
        //   (
        //     [
        //       QuestionType.IDENTIFYING_INFORMATION,
        //       QuestionType.IDENTIFYING_VIEWS_CLAIMS,
        //       QuestionType.MULTIPLE_CHOICE_1_ANSWER,
        //     ] as string[]
        //   ).includes(questionGroup.questionType)
        // ) {
        //   const questionIds = questionGroup.questions.map(
        //     (question) => question._id,
        //   );
        //   const questionPermuteds = permute(questionIds).map(
        //     (questionPermuted) =>
        //       questionPermuted.map(
        //         (questionId) =>
        //           questionGroup.questions.filter(
        //             (question) => question._id == questionId,
        //           )[0],
        //       ),
        //   );

        //   questionGroups = _.shuffle(questionPermuteds).map((questions) => ({
        //     ...questionGroup,
        //     questions: questions,
        //   }));
        // }

        return {
          groupId: questionGroup._id,
          groups: questionGroups,
        };
      });

      const questionGroupBanks = combinate(
        questionGroups.reduce(
          (result, questionGroup) => ({
            ...result,
            [questionGroup.groupId]: _.sampleSize(
              _.shuffle(questionGroup.groups),
              maxQuestionGroupCombination,
            ),
          }),
          {},
        ),
      );
      const questionParts: ListeningQuestionPart[] = questionGroupBanks.map(
        (questionGroupBank) => ({
          ...questionPart,
          groups: Object.values(questionGroupBank),
        }),
      );

      return {
        partId: questionPart._id,
        partNumber: questionPart.partNumber,
        parts: questionParts,
      };
    });

    const examBank = {
      reading_1: readingQuestionParts
        .filter((readingQuestionPart) => readingQuestionPart.partNumber == 1)
        .reduce(
          (result, readingQuestionPart) => [
            ...result,
            ..._.sampleSize(
              _.shuffle(readingQuestionPart.parts),
              maxCombination,
            ),
          ],
          [],
        ),
      reading_2: readingQuestionParts
        .filter((readingQuestionPart) => readingQuestionPart.partNumber == 2)
        .reduce(
          (result, readingQuestionPart) => [
            ...result,
            ..._.sampleSize(
              _.shuffle(readingQuestionPart.parts),
              maxCombination,
            ),
          ],
          [],
        ),
      reading_3: readingQuestionParts
        .filter((readingQuestionPart) => readingQuestionPart.partNumber == 3)
        .reduce(
          (result, readingQuestionPart) => [
            ...result,
            ..._.sampleSize(
              _.shuffle(readingQuestionPart.parts),
              maxCombination,
            ),
          ],
          [],
        ),
      listening_1: listeningQuestionParts
        .filter(
          (listeningQuestionPart) => listeningQuestionPart.partNumber == 1,
        )
        .reduce(
          (result, listeningQuestionPart) => [
            ...result,
            ..._.sampleSize(
              _.shuffle(listeningQuestionPart.parts),
              maxCombination,
            ),
          ],
          [],
        ),
      listening_2: listeningQuestionParts
        .filter(
          (listeningQuestionPart) => listeningQuestionPart.partNumber == 2,
        )
        .reduce(
          (result, listeningQuestionPart) => [
            ...result,
            ..._.sampleSize(
              _.shuffle(listeningQuestionPart.parts),
              maxCombination,
            ),
          ],
          [],
        ),
      listening_3: listeningQuestionParts
        .filter(
          (listeningQuestionPart) => listeningQuestionPart.partNumber == 3,
        )
        .reduce(
          (result, listeningQuestionPart) => [
            ...result,
            ..._.sampleSize(
              _.shuffle(listeningQuestionPart.parts),
              maxCombination,
            ),
          ],
          [],
        ),
      listening_4: listeningQuestionParts
        .filter(
          (listeningQuestionPart) => listeningQuestionPart.partNumber == 4,
        )
        .reduce(
          (result, listeningQuestionPart) => [
            ...result,
            ..._.sampleSize(
              _.shuffle(listeningQuestionPart.parts),
              maxCombination,
            ),
          ],
          [],
        ),
    };
    for (const key in examBank) {
      if (examBank[key] && examBank[key].length == 0) delete examBank[key];
    }

    const examLimit = configuration().maxExaminationStudent + 10;
    const examBanks = _.sampleSize(_.shuffle(combinate(examBank)), examLimit);

    if (examBanks.length == 0) {
      throw new HttpException(
        `Failed to generate exams!`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (examBanks.length < examLimit) {
      const _examBanks = [...examBanks];
      for (let i = 0; i < examLimit - _examBanks.length; i++) {
        const exam = _examBanks[i % _examBanks.length];
        if (exam) {
          examBanks.push(exam);
        }
      }
    }

    const examCreateds = await this.examinationExamService.createBulk(
      examBanks.map((examBank) => ({
        examination: examinationFound._id.toString(),
        reading: [
          examBank.reading_1,
          examBank.reading_2,
          examBank.reading_3,
        ].filter((part) => !!part),
        listening: [
          examBank.listening_1,
          examBank.listening_2,
          examBank.listening_3,
          examBank.listening_4,
        ].filter((part) => !!part),
      })),
    );

    if (examCreateds && examCreateds.length > 0) {
      await this.examinationService.update(examinationFound._id.toString(), {
        examIds: [
          ...examinationFound.examIds.map((examId) =>
            (examId._id || examId).toString(),
          ),
          ...examinationGenerateExamInput.examIds,
        ],
      });
    }

    return true;
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.POETCREATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id/export-result')
  async exportResult(@Param('id') id: string) {
    const examinationFound = await this.examinationService.findById(id);
    if (!examinationFound || !examinationFound._id) {
      throw new HttpException(`Examination not exists!`, HttpStatus.NOT_FOUND);
    }

    if (examinationFound.studentIds && examinationFound.studentIds.length > 0) {
      const students = await this.studentProfileService.findAll({
        _id: examinationFound.studentIds.map((studentId) =>
          studentId.toString(),
        ),
      });
      const tests = await Promise.all(
        students.map((student) =>
          this.testService.findOne({
            examination: examinationFound._id.toString(),
            userId: (student.user && student.user._id).toString(),
          }),
        ),
      );
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

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.POETCREATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,

    @Body() updateExaminationInput: UpdateExaminationDto,
  ) {
    const examinationFound = await this.examinationService.findById(id);

    if (!examinationFound || !examinationFound._id) {
      throw new HttpException(`Examination not exists!`, HttpStatus.NOT_FOUND);
    }

    if (
      updateExaminationInput.studentIds &&
      updateExaminationInput.studentIds.length > 0
    ) {
      if (
        updateExaminationInput.studentIds.length >
        configuration().maxExaminationStudent
      ) {
        throw new HttpException(
          `Max student of examination is ${
            configuration().maxExaminationStudent
          }!`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const totalUserExists = await this.studentProfileService.findAll({
        _id: updateExaminationInput.studentIds,
      });
      if (
        updateExaminationInput.studentIds.filter(
          (userId) =>
            !totalUserExists
              .map((user) => user._id.toString())
              .includes(userId),
        ).length > 0
      ) {
        throw new HttpException(
          `Student with ids '${updateExaminationInput.studentIds
            .filter(
              (userId) =>
                !totalUserExists
                  .map((user) => user._id.toString())
                  .includes(userId),
            )
            .join(', ')}' are not exists!`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const updateData = {
      ...updateExaminationInput,
    };

    for (const key in updateData) {
      if (updateData[key] == undefined) {
        delete updateData[key];
      }
    }

    if (updateData.examIds && updateData.examIds.length > 0) {
      updateData.examIds = _.uniq(updateData.examIds);
    }

    return this.examinationService.update(id, updateData);
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.POETCREATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const examinationFound = await this.examinationService.findById(id);
    if (!examinationFound || !examinationFound._id) {
      throw new HttpException(`Examination not exists!`, HttpStatus.NOT_FOUND);
    }
    return this.examinationService.remove(id);
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.POETCREATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id/exams')
  async queryExam(
    @Request() req,
    @Param('id') id: string,
    @Query() query: ExaminationExamListDto,
  ) {
    const examinationFound = await this.examinationService.findById(id);
    if (!examinationFound || !examinationFound._id) {
      throw new HttpException(`Examination not exists!`, HttpStatus.NOT_FOUND);
    }

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

    const filter = {
      examination: id,
    };
    if (query.isUsed != undefined && query.isUsed != null) {
      console.log(query.isUsed, typeof query.isUsed);
      filter['isUsed'] = query.isUsed;
    }

    const totalExaminationExams =
      await this.examinationExamService.countDocuments(filter);
    const totalPage = Math.ceil(totalExaminationExams / pageSize);

    const examinationExamList =
      page > 0 && page <= totalPage
        ? await this.examinationExamService.query({ page, pageSize }, filter)
        : [];

    return {
      data: examinationExamList,
      paging: {
        page,
        pageSize,
        totalPage,
        nextPage: page + 1 <= totalPage ? page + 1 : null,
        prevPage: page - 1 >= 1 ? page - 1 : null,
        total: totalExaminationExams,
      },
    };
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.POETCREATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id/exams/:examId')
  async getExamDetail(
    @Request() req,
    @Param('id') id: string,
    @Param('examId') examId: string,
  ) {
    const examinationFound = await this.examinationService.findById(id);
    if (!examinationFound || !examinationFound._id) {
      throw new HttpException(`Examination not exists!`, HttpStatus.NOT_FOUND);
    }

    console.log(examId);
    const examinationExamFound = await this.examinationExamService.findById(
      examId,
    );
    if (!examinationExamFound || !examinationExamFound._id) {
      throw new HttpException(`Exam not exists!`, HttpStatus.NOT_FOUND);
    }

    const result = {
      ...examinationExamFound,
      reading: (examinationExamFound.reading || []).map(
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
                questions: (questionGroup.questions || []).map((question) => {
                  if (question._id == '62f061efc953863e29b4e603') {
                    console.log(question.options);
                  }
                  return {
                    questionId: question._id,
                    studentAnswer: null,
                    isCorrect: false,
                    score: 0,
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
                  };
                }),
              }),
            ),
          };
        },
      ),
      listening: (examinationExamFound.listening || []).map(
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
                questions: (questionGroup.questions || []).map((question) => {
                  return {
                    questionId: question._id,
                    studentAnswer: null,
                    isCorrect: false,
                    score: 0,
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
                  };
                }),
              }),
            ),
          };
        },
      ),
    };

    let readingQuestionCount = 0;
    for (let i = 0; i < result.reading.length; i++) {
      const questionPart = result.reading[i];
      for (let j = 0; j < (questionPart.groups || []).length; j++) {
        const questionGroup = questionPart.groups[j];
        for (let k = 0; k < (questionGroup.questions || []).length; k++) {
          readingQuestionCount = readingQuestionCount + 1;
          result.reading[i].groups[j].questions[k].question[
            'displayNumber'
          ] = `${readingQuestionCount}`;
        }
      }
    }

    let listeningQuestionCount = 0;
    for (let i = 0; i < result.listening.length; i++) {
      const questionPart = result.listening[i];
      for (let j = 0; j < (questionPart.groups || []).length; j++) {
        const questionGroup = questionPart.groups[j];
        for (let k = 0; k < (questionGroup.questions || []).length; k++) {
          listeningQuestionCount = listeningQuestionCount + 1;
          result.listening[i].groups[j].questions[k].question[
            'displayNumber'
          ] = `${listeningQuestionCount}`;
        }
      }
    }

    return result;
  }
}
