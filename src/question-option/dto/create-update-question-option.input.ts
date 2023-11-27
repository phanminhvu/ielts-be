import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateQuestionOptionInput {
    @ApiProperty({
        example: 'a',
    })
    @IsString()
    readonly key?: string;

    @ApiProperty({
        example: '<p>Text</p>',
    })
    @IsString()
    readonly text?: string;
}

export class CreateQuestionOptionInput extends UpdateQuestionOptionInput {
    @ApiProperty({
        example: '627a20c2854826491d0c60af',
    })
    @IsString()
    readonly questionId?: string;
}