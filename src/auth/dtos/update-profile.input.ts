import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateProfileDto {
    @ApiProperty({
        example: 'Việt Nam',
    })
    @IsString()
    readonly nationality?: string;
    
    @ApiProperty({
        example: 'John Doe',
    })
    @IsString()
    readonly fullname?: string;

    @ApiProperty({
        example: '000000000000',
    })
    @IsString()
    readonly idCardNumber?: string;
    
    @ApiProperty({
        example: '2022-05-10T09:41:13.415Z',
    })
    @IsString()
    readonly dob?: string;

    @ApiProperty({
        example: '+84',
    })
    readonly countryCode?: string;
  
    @ApiProperty({
        example: '333333333',
    })
    readonly phoneNumber?: string;
  
    @ApiProperty({
        example: 'Hoàn Kiếm, Hà Nội',
    })
    readonly address?: string;
  
    @ApiProperty({
        example: 'uploads/2022/01/01/pepe.png',
    })
    readonly avatar?: string;
}
