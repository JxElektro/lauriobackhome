import { Controller, Get, Post, Body, Patch, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { BacklogService } from './backlog.service';
import { Prisma } from '@prisma/client';

@Controller('backlog')
export class BacklogController {
    constructor(private readonly backlogService: BacklogService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createBacklogItemDto: Prisma.BacklogItemCreateInput) {
        return this.backlogService.create(createBacklogItemDto);
    }

    @Get()
    findAll(
        @Query('status') status?: string,
        @Query('postType') postType?: string,
    ) {
        return this.backlogService.findAll({ status, postType });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.backlogService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBacklogItemDto: Prisma.BacklogItemUpdateInput) {
        return this.backlogService.update(id, updateBacklogItemDto);
    }
}
