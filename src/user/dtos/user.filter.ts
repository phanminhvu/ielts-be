export class UserFilterDto {
  readonly _id?: string | string[];
  readonly username?: string;
  readonly email?: string;
  readonly fullname?: string;
  readonly resetPasswordCode?: string;
  readonly resetPasswordToken?: string;
  readonly dateRange?: string[];
  readonly userType?: string | string[];
}
