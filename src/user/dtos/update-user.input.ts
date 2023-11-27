import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

import { UserType } from '../enums/user-type.enum';

export class UpdateUserDto {
    @IsString()
    readonly email?: string;

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
    readonly password?: string;

    @ApiProperty({
    })
    @IsBoolean()
    readonly verified?: boolean;

    @ApiProperty({
        example: 'uploads/2022/01/01/pepe.png',
    })
    @IsString()
    readonly avatar?: string;

    @IsString()
    readonly verifyCode?: string;

    @IsString()
    readonly verifyCodeExpirationTime?: string;

    @IsString()
    readonly resetPasswordCode?: string;

    @IsString()
    readonly resetPasswordToken?: string;

    @IsString()
    readonly resetPasswordCodeExpirationTime?: string;

    @ApiProperty({
        default: UserType.USER,
    })
    @IsString()
    readonly userType?: string;
}
