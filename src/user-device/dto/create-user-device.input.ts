import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateUserDeviceDto {
    @ApiProperty({
        example: "ABCD1234"
    })
    @IsString()
    readonly deviceID?: string;

    @ApiProperty({
        example: "ABCD1234"
    })
    @IsString()
    readonly pushToken?: string;

    @ApiProperty({
        example: "IOS"
    })
    @IsString()
    readonly os?: string;

    @IsString()
    readonly accessToken: string;

    @IsString()
    readonly user: string;
}
