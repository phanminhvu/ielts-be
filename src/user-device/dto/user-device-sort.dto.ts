import { SortOrder } from 'mongoose';
import { IsNumber } from "class-validator";

export class UserDeviceSortDto {
    @IsNumber()
    readonly user?: SortOrder;

    @IsNumber()
    readonly createdAt?: SortOrder;

    @IsNumber()
    readonly updatedAt?: SortOrder;
}