import { Controller, Post, Body } from '@nestjs/common';
import { OrchestrationService } from './orchestration.service';

@Controller('orchestrations')
export class OrchestrationController {
    constructor(private readonly orchestrationService: OrchestrationService) { }

    @Post('weekly-content')
    async generateWeeklyContent(@Body() body: { topics: string[]; context?: string }) {
        return this.orchestrationService.runFlow(body.topics, body.context);
    }
}
