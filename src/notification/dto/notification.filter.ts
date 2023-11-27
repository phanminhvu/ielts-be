export class NotificationFilterDto {
  readonly _id?: string;
  readonly isRead?: boolean;
  readonly isSeen?: boolean;
  readonly receiver?: string;
  readonly type?: string;
}
