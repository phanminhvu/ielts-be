import { Module } from '@nestjs/common';

import { CronTasksService } from './cron-tasks.service';

@Module({
  imports: [
  ],
  providers: [CronTasksService],
})
export class CronTasksModule {}
