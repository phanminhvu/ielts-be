import { IsArray, IsBoolean, IsNumber, IsObject, IsString } from 'class-validator';

class CreateTestAnswerDto {
    @IsNumber()
    readonly score?: number;
  
    @IsString()
    readonly studentAnswer?: string;

    @IsBoolean()
    readonly isCorrect?: boolean;
}

class UpdateTestScoreDto {
    @IsNumber()
    readonly total?: number;
  
    @IsNumber()
    readonly reading?: number;
  
    @IsNumber()
    readonly writing?: number;
  
    @IsNumber()
    readonly speaking?: number;
  
    @IsNumber()
    readonly listening?: number;
  
    @IsNumber()
    readonly speaking_training_score?: number;
}

class UpdateTestSkillProgressDto {
    @IsNumber()
    readonly timeRemain?: number;
  
    @IsNumber()
    readonly currentPart?: number;
  
    @IsNumber()
    readonly currentGroup?: number;
  
    @IsNumber()
    readonly currentQuestion?: number;
  
    @IsNumber()
    readonly audioPlayedTime?: number;
}

class UpdateTestProgressDto {
    @IsObject()
    readonly reading?: UpdateTestSkillProgressDto;
    
    @IsObject()
    readonly listening?: UpdateTestSkillProgressDto;
}

export class UpdateTestDto {
    @IsString()
    readonly status?: string;

    @IsObject()
    readonly score?: UpdateTestScoreDto;

    @IsObject()
    readonly progress?: UpdateTestProgressDto;

    @IsArray()
    readonly answers?: CreateTestAnswerDto[];

    @IsBoolean()
    readonly isGrading?: boolean;

    @IsString()
    readonly readingStartDate?: string;

    @IsString()
    readonly listeningStartDate?: string;

    @IsString()
    readonly speakingStartDate?: string;

    @IsString()
    readonly writingStartDate?: string;

    @IsString()
    readonly readingFinishedDate?: string;

    @IsString()
    readonly listeningFinishedDate?: string;

    @IsString()
    readonly speakingFinishedDate?: string;

    @IsString()
    readonly writingFinishedDate?: string;

    @IsString()
    readonly finishedDate?: string;
}
