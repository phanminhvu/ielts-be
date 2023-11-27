import { IsNumber } from "class-validator";
import { SortOrder } from "mongoose";

export class QuestionGroupSortDto {
    @IsNumber()
    readonly createdAt?: SortOrder;

    @IsNumber()
    readonly updatedAt?: SortOrder;
}