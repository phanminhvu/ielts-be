import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateReadingQuestionInput {
    @ApiProperty({
        example: 1,
    })
    @IsNumber()
    readonly blankNumber?: number;

    @ApiProperty({
        example: '<p>Text</p>',
    })
    @IsString()
    readonly answer?: string;

    @ApiProperty({
        example: '<p>Text</p>',
    })
    @IsString()
    readonly explanationText?: string;

    @ApiProperty({
        example: '<p>Text</p>',
    })
    @IsString()
    readonly questionText?: string;
}

export class CreateReadingQuestionInput extends UpdateReadingQuestionInput {
    @ApiProperty({
        example: '627a20c2854826491d0c60af',
    })
    @IsString()
    readonly groupId?: string;
}