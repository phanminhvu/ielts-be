import { SortOrder } from 'mongoose';
import { IsNumber } from "class-validator";

export class QuestionPartSortDto {
    @IsNumber()
    readonly createdAt?: SortOrder;

    @IsNumber()
    readonly updatedAt?: SortOrder;
}