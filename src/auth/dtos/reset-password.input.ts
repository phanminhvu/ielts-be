import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ResetPasswordDto {
    @ApiProperty({
        example: '000000000000',
    })
    @IsString()
    readonly resetToken: string;

    @ApiProperty({
        example: '123456',
    })
    @IsString()
    readonly password: string;
}
