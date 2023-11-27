import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class StudentSigninDto {
    @ApiProperty({
        example: '11140000',
    })
    @IsString()
    readonly studentCode: string;

    @ApiProperty({
        example: 1,
    })
    @IsString()
    readonly orderNumber: number;
}
