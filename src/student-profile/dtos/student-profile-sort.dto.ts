import { IsNumber, IsString } from "class-validator";
import { SortOrder } from "mongoose";

export class StudentProfileSortDto {
    @IsNumber()
    readonly createdAt?: SortOrder;

    @IsNumber()
    readonly updatedAt?: SortOrder;
}