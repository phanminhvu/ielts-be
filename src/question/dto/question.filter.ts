export class QuestionFilterDto {
  readonly _id?: string | string[];
  readonly skill?: string;
  readonly level?: string;
  readonly groupId?: string | string[];
  readonly analysisType?: string | any;
  readonly questionPartNumber?: number;
  readonly blankNumber?: number;
  readonly deleted?: boolean;
}
