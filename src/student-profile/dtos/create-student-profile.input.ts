import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateStudentProfileDto {
  @ApiProperty({
    example: '11140000',
    type: String,
  })
  @IsString()
  readonly studentCode: string;

  @IsString()
  readonly candidateCode: string;

  @IsString()
  readonly user: string;

  @ApiProperty({})
  @IsString()
  readonly fullname?: string;

  @ApiProperty({})
  @IsString()
  readonly gender?: string;

  @ApiProperty({})
  @IsString()
  readonly idCardNumber?: string;

  @ApiProperty({})
  @IsString()
  readonly phone?: string;

  @ApiProperty({})
  @IsString()
  readonly email?: string;

  @ApiProperty({})
  @IsString()
  readonly majors?: string;

  @ApiProperty({})
  @IsString()
  readonly classroom?: string;

  @ApiProperty({
    example: '2022-05-10T09:41:13.415Z',
  })
  @IsString()
  readonly dob?: string;

  @ApiProperty({
    example: 'uploads/2022/01/01/pepe.png',
  })
  @IsString()
  readonly image?: string;


  @ApiProperty({})
  @IsString()
  readonly examroom?: string;
}
