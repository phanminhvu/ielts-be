import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ForgotPasswordDto {
    @ApiProperty({
        example: 'email@example.com',
    })
    @IsString()
    readonly email: string;
}
