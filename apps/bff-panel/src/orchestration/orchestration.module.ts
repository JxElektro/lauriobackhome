import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrchestrationService } from './orchestration.service';
import { OrchestrationController } from './orchestration.controller';
import { BacklogModule } from '../backlog/backlog.module';

@Module({
    imports: [HttpModule, BacklogModule],
    controllers: [OrchestrationController],
    providers: [OrchestrationService],
})
export class OrchestrationModule { }
