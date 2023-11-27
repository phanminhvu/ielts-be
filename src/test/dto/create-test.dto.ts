import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';

class CreateTestAnswerDto {
    @IsNumber()
    readonly score?: number;
  
    @IsString()
    readonly studentAnswer?: string;
  
    @IsString()
    readonly questionId: string;
}

class CreateTestScoreDto {
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

class CreateTestSkillProgressDto {
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

class CreateTestProgressDto {
    @IsObject()
    readonly reading?: CreateTestSkillProgressDto;
    
    @IsObject()
    readonly listening?: CreateTestSkillProgressDto;
}

export class CreateTestDto {
    @IsNumber()
    readonly testCode: number;
  
    @IsObject()
    readonly progress?: CreateTestProgressDto;
  
    @IsObject()
    readonly score?: CreateTestScoreDto;
  
    @IsArray()
    readonly answers?: CreateTestAnswerDto[];
  
    @IsString()
    readonly examination: string;
  
    @IsString()
    readonly exam: string;
  
    @IsString()
    readonly userId: string;
}
