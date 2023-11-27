import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { QuestionType } from './../enums/question-type.enum';
import { UpdateQuestionOptionInput } from './../../question-option/dto/create-update-question-option.input';
import { UpdateListeningQuestionInput } from '../../question/dto/create-update-listening-question.input';

export class QuestionGroupCreateQuestionOptionInput extends UpdateQuestionOptionInput {}

export class QuestionGroupCreateListeningQuestionInput extends UpdateListeningQuestionInput {
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

export class QuestionGroupUpdateListeningQuestionInput extends UpdateListeningQuestionInput {
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

export class UpdateListeningQuestionGroupInput {
  @ApiProperty({
    example: 1,
  })
  @IsString()
  readonly groupPartNumber?: number;

  @ApiProperty({
    example: '<p>Text</p>',
  })
  @IsString()
  readonly script?: string;

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
        "questionPartNumber": 1,
        "blankNumber": 1,
        "questionText": "<p>Text</p>",
        "explanationText": "<p>Text</p>",
        "answer": "<p>Text</p>",
        "options": [{
            "_id": "627a20c2854826491d0c60af",
            "key": "a",
            "text": "<p>Text</p>"
        },{
            "key": "b",
            "text": "<p>Text</p>"
        }]
    },{
      "questionPartNumber": 1,
      "questionText": "<p>Text</p>",
      "blankNumber": 2,
      "explanationText": "<p>Text</p>",
      "answer": "<p>Text</p>",
      "options": [{
          "key": "a",
          "text": "<p>Text</p>"
      }]
    }]`,
  })
  @IsArray()
  readonly questions?: QuestionGroupUpdateListeningQuestionInput[];
}

export class CreateListeningQuestionGroupInput extends UpdateListeningQuestionGroupInput {
  @ApiProperty({
    example: `[{
        "questionPartNumber": 1,
        "blankNumber": 1,
        "questionText": "<p>Text</p>",
        "explanationText": "<p>Text</p>",
        "answer": "<p>Text</p>",
        "options": [{
            "key": "a",
            "text": "<p>Text</p>"
        }]
      }]`,
  })
  @IsArray()
  readonly questions?: QuestionGroupCreateListeningQuestionInput[];

  @ApiProperty({
    example: '627a20c2854826491d0c60af',
  })
  @IsString()
  readonly partId?: string;
}
