import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateListeningQuestionInput {
    @ApiProperty({
        example: 1,
    })
    @IsNumber()
    readonly questionPartNumber?: number;

    @ApiProperty({
        example: 1,
    })
    @IsNumber()
    readonly blankNumber?: number;

    @ApiProperty({
        example: '<p>Text</p>',
    })
    @IsString()
    readonly questionText?: string;

    @ApiProperty({
        example: '<p>Text</p>',
    })
    @IsString()
    readonly explanationText?: string;

    @ApiProperty({
        example: '<p>Text</p>',
    })
    @IsString()
    readonly answer?: string;
}

export class CreateListeningQuestionInput extends UpdateListeningQuestionInput {
    @ApiProperty({
        example: '627a20c2854826491d0c60af',
    })
    @IsString()
    readonly groupId?: string;
}