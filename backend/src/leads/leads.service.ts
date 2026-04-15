import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetLeadsDto } from './dto/get-leads.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async createLead(dto: CreateLeadDto) {
    return this.prisma.lead.create({
      data: dto,
    });
  }

  async findOne(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        comments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!lead) {
      throw new NotFoundException(`Лид с ID ${id} не найден`);
    }

    return lead;
  }

  async addComment(dto: CreateCommentDto) {
    const lead = await this.prisma.lead.findUnique({
      where: { id: dto.leadId },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${dto.leadId}  not found`);
    }

    return this.prisma.comment.create({
      data: {
        text: dto.text,
        leadId: dto.leadId,
      },
    });
  }
  async findAll(query: GetLeadsDto) {
    const { search, status, page = 1, limit = 10 } = query;

    // Calculate how many records to skip (offset)
    const skip = (page - 1) * limit;

    // Initialize filter conditions object
    const where: any = {};

    // Apply status filter if provided
    if (status) {
      where.status = status;
    }

    // Apply full-text search across multiple fields
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Execute two database queries in parallel for better performance
    // 1. Fetch the paginated data
    // 2. Count the total records matching the filters
    const [data, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }, // Latest leads first
        include: {
          _count: {
            select: { comments: true }, // Include comment count for each lead
          },
        },
      }),
      this.prisma.lead.count({ where }),
    ]);

    // Return formatted response with data and pagination metadata
    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit), // Calculate total number of pages
      },
    };
  }

  // Update /leads

  async update(id: string, dto: UpdateLeadDto) {
    await this.findOne(id);

    return this.prisma.lead.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.lead.delete({
      where: { id },
    });
  }
}
