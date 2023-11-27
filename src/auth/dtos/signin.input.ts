import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SigninDto {
    @ApiProperty({
        example: 'username',
    })
    @IsString()
    readonly username: string;

    @ApiProperty({
        example: 'email@example.com',
    })
    @IsString()
    readonly email: string;
    
    @ApiProperty({
        example: 'password',
    })
    @IsString()
    readonly password: string;
}
