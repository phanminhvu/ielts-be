import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { QuestionType } from './../enums/question-type.enum';
import { UpdateSpeakingQuestionInput } from 'src/question/dto/create-update-speaking-question.input';

export class QuestionGroupCreateSpeakingQuestionInput extends UpdateSpeakingQuestionInput {}

export class QuestionGroupUpdateSpeakingQuestionInput extends UpdateSpeakingQuestionInput {
  @ApiProperty({
    example: '627a20c2854826491d0c60af',
  })
  @IsString()
  readonly _id?: string;
}

export class UpdateSpeakingQuestionGroupInput {
  @ApiProperty({
    example: '<p>Text</p>',
  })
  @IsString()
  readonly explanationText?: string;

  @ApiProperty({
    example: '<p>Text</p>',
  })
  @IsString()
  readonly usefulGrammarNVocab?: string;

  @ApiProperty({
    example: '<p>Text</p>',
  })
  @IsString()
  readonly ideaSuggestion?: string;

  @ApiProperty({
    example: 'Title',
  })
  @IsString()
  readonly title?: string;

  @ApiProperty({
    example: `[{
      "_id": "627a20c2854826491d0c60af",
      "questionAudio": "uploads/2022/01/01/pepe.mp3",
      "questionText": "<p>Text</p>",
      "modelAnswerAudio": "uploads/2022/01/01/pepe.mp3",
      "modelAnswer": "<p>Text</p>"
    },{
      "questionAudio": "uploads/2022/01/01/pepe.mp3",
      "questionText": "<p>Text</p>",
      "modelAnswerAudio": "uploads/2022/01/01/pepe.mp3",
      "modelAnswer": "<p>Text</p>"
    }]`,
  })
  @IsArray()
  readonly questions?: QuestionGroupUpdateSpeakingQuestionInput[];
}

export class CreateSpeakingQuestionGroupInput extends UpdateSpeakingQuestionGroupInput {
  @ApiProperty({
    example: `[{
      "questionAudio": "uploads/2022/01/01/pepe.mp3",
      "questionText": "<p>Text</p>",
      "modelAnswerAudio": "uploads/2022/01/01/pepe.mp3",
      "modelAnswer": "<p>Text</p>"
    }]`,
  })
  @IsArray()
  readonly questions?: QuestionGroupCreateSpeakingQuestionInput[];

  @ApiProperty({
    example: '627a20c2854826491d0c60af',
  })
  @IsString()
  readonly partId?: string;
}
