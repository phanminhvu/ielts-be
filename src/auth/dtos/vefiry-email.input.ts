import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class VerifyEmailDto {
    @ApiProperty({
        example: '000000',
    })
    @IsString()
    readonly verifyCode: string;
}
