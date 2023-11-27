export class UserDeviceFilterDto {
  readonly _id?: string;
  readonly user?: string | string[];
  readonly pushToken?: string | string[] | any;
}
