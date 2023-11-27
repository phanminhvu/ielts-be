import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

export class TestSubmitScoreInput {
    @IsArray()
    @ApiProperty({
        example: "[{\"questionId\":\"627a20c2854826491d0c60af\", \"score\":1}]",
    })
    readonly answers: {
        readonly questionId?: string;
        readonly score?: number;
    }[]
}
