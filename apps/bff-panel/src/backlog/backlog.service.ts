import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

interface FindAllFilters {
    status?: string;
    postType?: string;
}

@Injectable()
export class BacklogService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.BacklogItemCreateInput) {
        return this.prisma.backlogItem.create({
            data,
        });
    }

    async findAll(filters: FindAllFilters = {}) {
        const where: Prisma.BacklogItemWhereInput = {};

        if (filters.status) {
            where.status = filters.status;
        }

        if (filters.postType) {
            where.postType = filters.postType;
        }

        return this.prisma.backlogItem.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const item = await this.prisma.backlogItem.findUnique({
            where: { id },
        });

        if (!item) {
            throw new NotFoundException(`BacklogItem with id ${id} not found`);
        }

        return item;
    }

    async update(id: string, data: Prisma.BacklogItemUpdateInput) {
        // Check if item exists
        await this.findOne(id);

        return this.prisma.backlogItem.update({
            where: { id },
            data,
        });
    }
}
