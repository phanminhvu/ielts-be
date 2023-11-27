import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { UpdateReadingQuestionInput } from '../../question/dto/create-update-reading-question.input';
import { QuestionType } from './../enums/question-type.enum';
import { UpdateQuestionOptionInput } from './../../question-option/dto/create-update-question-option.input';

export class QuestionGroupCreateQuestionOptionInput extends UpdateQuestionOptionInput {}

export class QuestionGroupCreateReadingQuestionInput extends UpdateReadingQuestionInput {
  @ApiProperty({
    example: `[{
          "key": "a",
          "text": "<p>Text</p>"
      }]`,
  })
  @IsArray()
  options?: QuestionGroupCreateQuestionOptionInput[];
}

export class QuestionGroupUpdateQuestionOptionInput extends UpdateQuestionOptionInput {
  @ApiProperty({
    example: '627a20c2854826491d0c60af',
  })
  @IsString()
  readonly _id?: string;
}

export class QuestionGroupUpdateReadingQuestionInput extends UpdateReadingQuestionInput {
  @ApiProperty({
    example: '627a20c2854826491d0c60af',
  })
  @IsString()
  readonly _id?: string;

  @ApiProperty({
    example: `[{
          "key": "a",
          "text": "<p>Text</p>"
      }]`,
  })
  @IsArray()
  options?: QuestionGroupUpdateQuestionOptionInput[];
}

export class UpdateReadingQuestionGroupInput {
  @ApiProperty({
    example: '<p>Text</p>',
  })
  @IsString()
  readonly answerList?: string;

  @ApiProperty({
    example: '<p>Text</p>',
  })
  @IsString()
  readonly directionText?: string;

  @ApiProperty({
    example: 'uploads/2022/01/01/pepe.png',
  })
  @IsString()
  readonly image?: string;

  @ApiProperty({
    example: '<p>Text</p>',
  })
  @IsString()
  readonly questionTypeTips?: string;

  @ApiProperty({
    example: '<p>Text</p>',
  })
  @IsString()
  readonly questionBox?: string;

  @ApiProperty({
    example: QuestionType.IDENTIFYING_INFORMATION,
  })
  @IsString()
  readonly questionType?: string;

  @ApiProperty({
    example: `[{
        "_id": "627a20c2854826491d0c60af",
        "answer": "<p>Text</p>",
        "explanationText": "<p>Text</p>",
        "questionText": "<p>Text</p>",
        "blankNumber": 1,
        "options": [{
            "_id": "627a20c2854826491d0c60af",
            "key": "a",
            "text": "<p>Text</p>"
        },{
            "key": "b",
            "text": "<p>Text</p>"
        }]
    },{
        "answer": "<p>Text</p>",
        "explanationText": "<p>Text</p>",
        "questionText": "<p>Text</p>",
        "blankNumber": 2,
        "options": [{
            "key": "a",
            "text": "<p>Text</p>"
        }]
    }]`,
  })
  @IsArray()
  readonly questions?: QuestionGroupUpdateReadingQuestionInput[];
}

export class CreateReadingQuestionGroupInput extends UpdateReadingQuestionGroupInput {
  @ApiProperty({
    example: `[{
          "answer": "<p>Text</p>",
          "explanationText": "<p>Text</p>",
          "questionText": "<p>Text</p>",
          "blankNumber": 1,
          "options": [{
              "key": "a",
              "text": "<p>Text</p>"
          }]
      }]`,
  })
  @IsArray()
  readonly questions?: QuestionGroupCreateReadingQuestionInput[];

  @ApiProperty({
    example: '627a20c2854826491d0c60af',
  })
  @IsString()
  readonly partId?: string;
}
