import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import {
  CreateLeadDto,
  CreateCommentDto,
  GetLeadsDto,
  UpdateLeadDto,
} from './dto';

@ApiTags('Leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  // Create POST /leads
  @Post()
  createLead(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.createLead(createLeadDto);
  }
  // Create POST /comments
  // @Post('comments')
  // addComment(@Body() createCommentDto: CreateCommentDto) {
  //   return this.leadsService.addComment(createCommentDto);
  // }
  @Post(':id/comments') // Це створює шлях /api/leads/:id/comments
  createComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.leadsService.addComment(id, createCommentDto);
  }

  // GET all / leads

  @Get()
  findAll(@Query() query: GetLeadsDto) {
    return this.leadsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.update(id, updateLeadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leadsService.remove(id);
  }
}
