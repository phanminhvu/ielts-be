import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsObject, IsString } from 'class-validator';

export class UpdateExaminationExamDto {
    @IsBoolean()
    readonly isUsed?: boolean;
}
