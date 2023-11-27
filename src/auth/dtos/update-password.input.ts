import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdatePasswordDto {
    @ApiProperty({
        example: 'current_password',
    })
    @IsString()
    readonly currentPassword: string;

    @ApiProperty({
        example: 'new_password',
    })
    @IsString()
    readonly newPassword: string;
}
