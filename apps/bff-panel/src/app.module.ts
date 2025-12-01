import { Module } from '@nestjs/common';
import { BacklogModule } from './backlog/backlog.module';
import { OrchestrationModule } from './orchestration/orchestration.module';

@Module({
    imports: [BacklogModule, OrchestrationModule],
    controllers: [],
    providers: [],
})
export class AppModule { }
