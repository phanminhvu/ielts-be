import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateNotificationDto {
    @IsBoolean()
    readonly isSeen?: boolean;
    
    @IsBoolean()
    readonly isRead?: boolean;

    @IsBoolean()
    readonly deleted?: boolean;
}
