import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ForgotPasswordVerifyCodeDto {
    @ApiProperty({
        example: 'email@example.com',
    })
    @IsString()
    readonly email: string;
    
    @ApiProperty({
        example: '000000',
    })
    @IsString()
    readonly verifyCode: string;
}
