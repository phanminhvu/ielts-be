import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

import { UserSocialConnectionType } from './../../user/enums/user-social-connection-type.enum';

export class SignupSocialDto {
    @ApiProperty({
        example: 'abcdef',
    })
    @IsString()
    readonly token: string;
    
    @ApiProperty({
        example: UserSocialConnectionType.FACEBOOK,
    })
    @IsString()
    readonly provider: string;
}
