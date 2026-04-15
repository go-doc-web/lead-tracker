import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetLeadsDto } from './dto/get-leads.dto';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  // Create POST /leads
  @Post()
  createLead(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.createLead(createLeadDto);
  }
  // Create POST /comments
  @Post()
  addComment(@Body() createCommentDto: CreateCommentDto) {
    return this.leadsService.addComment(createCommentDto);
  }

  // GET all / leads

  @Get()
  findAll(@Query() query: GetLeadsDto) {
    return this.leadsService.findAll(query);
  }
}
