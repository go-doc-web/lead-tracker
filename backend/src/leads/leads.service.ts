import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async createLead(dto: CreateLeadDto) {
    return this.prisma.lead.create({
      data: dto,
    });
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
  async findAll() {
    return this.prisma.lead.findMany({
      include: {
        _count: {
          select: { comments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
