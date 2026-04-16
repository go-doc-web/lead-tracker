import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateLeadDto,
  CreateCommentDto,
  GetLeadsDto,
  UpdateLeadDto,
} from './dto';

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

  async addComment(id: string, dto: CreateCommentDto) {
    const lead = await this.prisma.lead.findUnique({
      where: { id: id }, // Ищем по id из параметров
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    return this.prisma.comment.create({
      data: {
        text: dto.text,
        leadId: id,
      },
    });
  }
  async findAll(query: GetLeadsDto) {
    const { page, limit, search, status, sort, order } = query;
    const skip = (page - 1) * limit;

    // Формуємо фільтри
    const where: any = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { company: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    // ОСЬ ЦЕ ЗМУСИТЬ БАЗУ СОРТУВАТИ:
    const leads = await this.prisma.lead.findMany({
      where,
      take: limit,
      skip,
      orderBy: {
        [sort]: order, // Динамічне поле: createdAt, value тощо
      },
      include: { _count: { select: { comments: true } } },
    });

    const total = await this.prisma.lead.count({ where });

    return {
      data: leads,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
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
