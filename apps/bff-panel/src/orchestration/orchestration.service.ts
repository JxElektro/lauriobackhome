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

    async runFlow(topics: string[], context?: string) {
        this.logger.log(`Starting flow for topics: ${topics.join(', ')}`);

        try {
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
                for (const result of data.results as ADKResult[]) {
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
                    createdItems.push(newItem);
                    this.logger.log(`Created backlog item: ${newItem.id}`);
                }
            }

            return {
                status: 'success',
                message: `Successfully generated ${createdItems.length} content items`,
                createdItemsCount: createdItems.length,
                items: createdItems,
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
