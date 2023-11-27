import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';

export class CreateExamDto {
    @IsNumber()
    readonly examCode: number;
  
    @ApiProperty({
        example: "Exam ABC",
    })
    @IsString()
    readonly examName: string;
  
    @ApiProperty({
        example: "[\"627a20c2854826491d0c60af\"]",
    })
    @IsArray()
    readonly readingIds?: string[];
  
    @ApiProperty({
        example: "[\"627a20c2854826491d0c60af\"]",
    })
    @IsArray()
    readonly listeningIds?: string[];
  
    @ApiProperty({
        example: "[\"627a20c2854826491d0c60af\"]",
    })
    @IsArray()
    readonly speakingIds?: string[];
  
    @ApiProperty({
        example: "[\"627a20c2854826491d0c60af\"]",
    })
    @IsArray()
    readonly writingIds?: string[];
}
