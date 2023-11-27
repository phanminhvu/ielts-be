import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';
import { UserType } from '../enums/user-type.enum';

export class CreateUserDto {
    @ApiProperty({
    })
    @IsString()
    readonly username: string;

    @ApiProperty({
    })
    @IsString()
    readonly email: string;

    @ApiProperty({
    })
    @IsString()
    readonly password?: string;

    @ApiProperty({
        default: UserType.USER,
    })
    @IsString()
    readonly userType?: string;

    @IsString()
    readonly verifyCode?: string;

    @IsString()
    readonly verifyCodeExpirationTime?: string;

    @IsBoolean()
    readonly verified?: boolean;

    @ApiProperty({
    })
    @IsString()
    readonly fullname?: string;

    @ApiProperty({
        example: '2022-05-10T09:41:13.415Z',
    })
    @IsString()
    readonly dob?: string;
  
    @IsString()
    readonly facebookId?: string;
  
    @IsString()
    readonly googleId?: string;
  
    @IsString()
    readonly appleId?: string;

    @ApiProperty({
        example: 'uploads/2022/01/01/pepe.png',
    })
    @IsString()
    readonly avatar?: string;
}
