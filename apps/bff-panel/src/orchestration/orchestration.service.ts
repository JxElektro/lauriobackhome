import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { BacklogService } from '../backlog/backlog.service';
import { firstValueFrom, timeout } from 'rxjs';

interface ADKResult {
    topic: string;
    postType: string;
    mainMessage: string;
    objective: string;
    sourceInsights: any;
    structure: any;
    visualPrompts: any;
}

@Injectable()
export class OrchestrationService {
    private readonly logger = new Logger(OrchestrationService.name);
    private readonly adkUrl = process.env.PYTHON_AGENT_URL || 'http://localhost:8000';
    private readonly adkTimeout = 120000; // 120 seconds for LLM calls

    constructor(
        private readonly httpService: HttpService,
        private readonly backlogService: BacklogService,
    ) { }

    async runFlow(topics: string[], context?: string, schedule?: { startAt?: string; intervalMinutes?: number }) {
        this.logger.log(`Starting flow for topics: ${topics.join(', ')}`);

        try {
            const now = new Date();
            const scheduleStart = (() => {
                if (schedule?.startAt) {
                    const d = new Date(schedule.startAt);
                    return isNaN(d.getTime()) ? now : d;
                }
                const d = new Date();
                d.setHours(6, 0, 0, 0);
                return d;
            })();
            // Call Python ADK with extended timeout
            const { data } = await firstValueFrom(
                this.httpService.post(`${this.adkUrl}/run-flow`, {
                    topics,
                    context: context || 'Audiencia joven, tono cercano y práctico',
                }).pipe(timeout(this.adkTimeout))
            );

            this.logger.log(`Received ${data.results?.length || 0} results from ADK`);

            const createdItems = [];

            // Process results and save to Backlog
            if (data.results && Array.isArray(data.results)) {
                const base = scheduleStart;
                const step = (schedule?.intervalMinutes ?? 120) * 60 * 1000;

                let idx = 0;
                for (const result of data.results as ADKResult[]) {
                    const plannedDate = new Date(base.getTime() + idx * step);
                    const newItem = await this.backlogService.create({
                        topic: result.topic,
                        status: 'ready_for_review',
                        postType: result.postType || 'ig_carousel',
                        targetAudience: 'youth',
                        mainMessage: result.mainMessage || '',
                        objective: result.objective || 'Generated via ADK',
                        // Store complex objects as JSON strings
                        sourceInsights: typeof result.sourceInsights === 'string'
                            ? result.sourceInsights
                            : JSON.stringify(result.sourceInsights || []),
                        structure: typeof result.structure === 'string'
                            ? result.structure
                            : JSON.stringify(result.structure || {}),
                        visualPrompts: typeof result.visualPrompts === 'string'
                            ? result.visualPrompts
                            : JSON.stringify(result.visualPrompts || []),
                        notes: `Generated from context: ${context || 'None'}`,
                    });
                    // ensure plannedDate is persisted reliably
                    const updatedItem = await this.backlogService.update(newItem.id, { plannedDate: { set: plannedDate } as any });
                    idx += 1;
                    createdItems.push(updatedItem);
                    this.logger.log(`Created backlog item: ${updatedItem.id} scheduled at ${plannedDate.toISOString()}`);
                }
            }

                return {
                    status: 'success',
                    message: `Successfully generated ${createdItems.length} content items`,
                    createdItemsCount: createdItems.length,
                    items: createdItems,
                    schedule: {
                    startAt: schedule?.startAt || scheduleStart.toISOString(),
                    intervalMinutes: schedule?.intervalMinutes ?? 120,
                },
                };

        } catch (error) {
            this.logger.error('Error calling ADK service:', error.message);

            // Return a more helpful error response
            return {
                status: 'error',
                message: error.message || 'Failed to generate content',
                error: error.code === 'ECONNREFUSED'
                    ? 'Python ADK service is not running. Please start it on port 8000.'
                    : error.message,
            };
        }
    }
}
