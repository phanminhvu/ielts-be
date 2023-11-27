import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString } from "class-validator";

import { QuestionSkill } from '../../question-part/enums/question-skill.enum';

export class TestGradeQueryDto {
    @ApiProperty({
        description: 'Minimum value 1',
        example: 1,
        required: false,
        default: 1,
        minimum: 1,
    })
    @IsNumber()
    readonly page?: number;

    @ApiProperty({
        description: 'Minimum value 1 - Maximum value 50',
        example: 10,
        required: false,
        default: 10,
        maximum: 50,
        minimum: 1,
    })
    @IsNumber()
    readonly pageSize?: number;

    @ApiProperty({
        example: "createdAt:DESC",
        required: false,
    })
    @IsString()
    readonly sort?: string;

    @ApiProperty({
        description: 'search by code',
        required: false,
    })
    @IsString()
    readonly code?: string;

    @ApiProperty({
        description: 'search by name',
        required: false,
    })
    @IsString()
    readonly name?: string;

    @ApiProperty({
        example: QuestionSkill.SPEAKING,
        required: false,
    })
    @IsString()
    readonly skill?: string;

    @ApiProperty({
        example: true,
        required: false,
    })
    @IsBoolean()
    readonly isGrading?: boolean;
}
