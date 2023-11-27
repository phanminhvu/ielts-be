import { IsNumber, IsString } from "class-validator";
import { SortOrder } from "mongoose";

export class UserSortDto {
    @IsNumber()
    readonly email?: SortOrder;

    @IsNumber()
    readonly fullname?: SortOrder;

    @IsNumber()
    readonly createdAt?: SortOrder;

    @IsNumber()
    readonly updatedAt?: SortOrder;
}