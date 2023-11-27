import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

import {CreateTestDto} from './dto/create-test.dto';
import {TestFilterDto} from './dto/test-filter.dto';
import {TestSortDto} from './dto/test-sort.dto';
import {UpdateTestDto} from './dto/update-test.dto';
import {TestStatus} from './enums/test-status.enum';
import {Test, TestAnswer, TestDocument} from './test.schema';
import {PagingDto} from '../dtos/paging.dto';
import {
    ListeningQuestionPart,
    TestListeningQuestionPart,
} from './../dtos/listening-question.dto';
import {QuestionSkill} from './../question-part/enums/question-skill.enum';
import {
    ReadingQuestionPart,
    TestReadingQuestionPart,
} from '../dtos/reading-question.dto';

@Injectable()
export class TestService {
    constructor(
        @InjectModel(Test.name)
        private readonly testModel: Model<TestDocument>,
    ) {
    }

    filterTransform(filter: TestFilterDto) {
        let _filter = {};

        if (filter && Object.keys(filter).length > 0) {
            for (let key in filter) {
                _filter[key] = filter[key];
            }
        }

        return _filter;
    }

    async create(createTestDto: CreateTestDto): Promise<Test> {
        const createdDoc = await this.testModel.create(createTestDto);
        return (createdDoc && createdDoc.toObject()) || null;
    }

    async update(id: string, updateTestDto: UpdateTestDto): Promise<Test> {
        const updatedDoc = await this.testModel.findByIdAndUpdate(
            id,
            {
                $set: updateTestDto,
            },
            {new: true},
        );
        return (updatedDoc && updatedDoc.toObject()) || null;
    }

    async countDocuments(filter?: TestFilterDto): Promise<number> {
        return this.testModel.countDocuments({
            ...this.filterTransform(filter),
        });
    }

    async queryWithUserInfo(
        paging: PagingDto = {page: 1, pageSize: 10},
        sort?: TestSortDto,
        filter?: TestFilterDto,
    ): Promise<Test[]> {
        const {page = 1, pageSize = 10} = paging;
        const regex = new RegExp(filter.name, 'i');

        // @ts-ignore
        // @ts-ignore
        return filter.code ?  (
            await this.testModel
                .find({
                    ...this.filterTransform(filter),
                })
                .sort({...(sort || {createdAt: -1})})
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .populate({
                    path: 'userDetail',
                    match: { username: { $regex: filter.code, $options: 'i' } }
                })
        ).filter( (item : any)  => item.userDetail !== null).map((item) => item.toObject()) :
            filter.name ? (
                await this.testModel
                    .find({
                        ...this.filterTransform(filter),
                    })
                    .sort({...(sort || {createdAt: -1})})
                    .skip((page - 1) * pageSize)
                    .limit(pageSize)
                    .populate({
                        path: 'userDetail',
                        match: {  fullname: { $regex: filter.name, $options: 'i' } }
                    })
            ).filter( (item : any) => item.userDetail !== null).map((item) => item.toObject())  : (
            await this.testModel
                .find({
                    ...this.filterTransform(filter),
                })
                .sort({...(sort || {createdAt: -1})})
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .populate('userDetail')
        ).map((item) => item.toObject() )


        ;
    }

    async query(
        paging: PagingDto = {page: 1, pageSize: 10},
        sort?: TestSortDto,
        filter?: TestFilterDto,
    ): Promise<Test[]> {
        const {page = 1, pageSize = 10} = paging;

        return (
            await this.testModel
                .find({
                    ...this.filterTransform(filter),
                })
                .sort({...(sort || {createdAt: -1})})
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .populate('examinationDetail')
        ).map((docFound) => docFound.toObject());
    }

    async findOneWithFullDetail(filter: TestFilterDto): Promise<Test> {
        const docFound = await this.testModel
            .findOne({
                ...this.filterTransform(filter),
            })
            .populate('userDetail')
            .populate('examDetail')
            .populate('examinationDetail');
        return (docFound && docFound.toObject()) || null;
    }

    async findById(id: string): Promise<Test> {
        const docFound = await this.testModel.findById(id);
        return (docFound && docFound.toObject()) || null;
    }

    async findOne(filter: TestFilterDto): Promise<Test> {
        const docFound = await this.testModel.findOne({
            ...this.filterTransform(filter),
        });
        return (docFound && docFound.toObject()) || null;
    }

    remove(id: string) {
        return this.testModel.findByIdAndDelete(id);
    }

    async getNewTestCode(): Promise<number> {
        const docFound = await this.testModel.findOne({}).sort({testCode: -1});
        return (
            (((docFound && docFound.toObject()) || {testCode: 0}).testCode || 0) + 1
        );
    }

    async getLatestSavedTest(filter: TestFilterDto): Promise<Test> {
        const docFound = await this.testModel
            .findOne({
                ...this.filterTransform(filter),
            })
            .sort({testCode: -1});
        return (docFound && docFound.toObject()) || null;
    }

    extractListeningTestQuestionPartFromQuestionPart(
        questionPart: ListeningQuestionPart,
        answers: TestAnswer[],
        partIndex?: number,
    ): TestListeningQuestionPart {
        return {
            _id: questionPart._id,
            partNumber: questionPart.partNumber || partIndex + 1,
            partAudio: questionPart.partAudio,
            groups: (questionPart.groups || []).map(
                (listeningQuestionGroup, groupIndex) => ({
                    _id: listeningQuestionGroup._id,
                    answerList: listeningQuestionGroup.answerList,
                    directionText: listeningQuestionGroup.directionText,
                    image: listeningQuestionGroup.image,
                    questionBox: listeningQuestionGroup.questionBox,
                    questionType: listeningQuestionGroup.questionType,
                    groupNumber: listeningQuestionGroup.groupNumber || groupIndex + 1,
                    questions: (listeningQuestionGroup.questions || [])
                        .map((listeningQuestion) => {
                            const questionAnswer = answers.filter(
                                (answer) =>
                                    (
                                        (answer.questionId && answer.questionId._id) ||
                                        answer.questionId
                                    ).toString() == listeningQuestion._id.toString(),
                            )[0];
                            return questionAnswer && questionAnswer.questionId
                                ? {
                                    questionId: (
                                        (questionAnswer.questionId &&
                                            questionAnswer.questionId._id) ||
                                        questionAnswer.questionId
                                    ).toString(),
                                    studentAnswer: questionAnswer.studentAnswer,
                                    question: {
                                        _id: listeningQuestion._id,
                                        options: (listeningQuestion.options || []).map(
                                            (listeningQuestionOption) => ({
                                                _id: listeningQuestionOption._id,
                                                key: listeningQuestionOption.key,
                                                text: listeningQuestionOption.text,
                                            }),
                                        ),
                                        questionText: listeningQuestion.questionText,
                                        blankNumber: listeningQuestion.blankNumber,
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
    }

    extractReadingTestQuestionPartFromQuestionPart(
        questionPart: ReadingQuestionPart,
        answers: TestAnswer[],
        partIndex?: number,
    ): TestReadingQuestionPart {
        return {
            _id: questionPart._id,
            partNumber: questionPart.partNumber || partIndex + 1,
            passageText: questionPart.passageText,
            groups: (questionPart.groups || []).map(
                (readingQuestionGroup, groupIndex) => ({
                    _id: readingQuestionGroup._id,
                    answerList: readingQuestionGroup.answerList,
                    directionText: readingQuestionGroup.directionText,
                    image: readingQuestionGroup.image,
                    questionBox: readingQuestionGroup.questionBox,
                    questionType: readingQuestionGroup.questionType,
                    groupNumber: readingQuestionGroup.groupNumber || groupIndex + 1,
                    questions: (readingQuestionGroup.questions || [])
                        .map((readingQuestion) => {
                            const questionAnswer = answers.filter(
                                (answer) =>
                                    (
                                        (answer.questionId && answer.questionId._id) ||
                                        answer.questionId
                                    ).toString() == readingQuestion._id.toString(),
                            )[0];
                            return questionAnswer && questionAnswer.questionId
                                ? {
                                    questionId: (
                                        (questionAnswer.questionId &&
                                            questionAnswer.questionId._id) ||
                                        questionAnswer.questionId
                                    ).toString(),
                                    studentAnswer: questionAnswer.studentAnswer,
                                    question: {
                                        _id: readingQuestion._id,
                                        options: (readingQuestion.options || []).map(
                                            (readingQuestionOption) => ({
                                                _id: readingQuestionOption._id,
                                                key: readingQuestionOption.key,
                                                text: readingQuestionOption.text,
                                            }),
                                        ),
                                        questionText: readingQuestion.questionText,
                                        blankNumber: readingQuestion.blankNumber,
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
    }
}
