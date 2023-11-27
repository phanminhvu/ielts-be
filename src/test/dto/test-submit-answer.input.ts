import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

export class TestSubmitAnswerInput {
    @IsArray()
    @ApiProperty({
        example: "[{\"questionId\":\"627a20c2854826491d0c60af\", \"studentAnswer\":\"TRUE\"}]",
    })
    readonly answers: {
        readonly questionId?: string;
        readonly studentAnswer?: string;
    }[]
}
