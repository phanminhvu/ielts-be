import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';

export class CreateNotificationDto {
    @ApiProperty({
        example: "Thông báo ABC"
    })
    @IsString()
    readonly title: string;
    
    @ApiProperty({
        example: "Nội dung"
    })
    @IsString()
    readonly content: string;

    @IsObject()
    readonly data: any;

    @IsString()
    readonly type?: string;

    @ApiProperty({
        example: "[\"627a20c2854826491d0c60af\"]"
    })
    @IsArray()
    readonly receiver: string | string[];
}
