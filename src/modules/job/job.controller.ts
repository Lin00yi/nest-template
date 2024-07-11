import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Sse,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('招聘信息爬取')
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @ApiOperation({ summary: '启用爬虫' })
  @Get('spider/start') //启用爬虫
  @Sse()
  startSpider(@Query('query') query: string, @Query('city') city: number) {
    return this.jobService.getSseStream(query, city);
  }

  @ApiOperation({ summary: '停止爬虫' })
  @Get('spider/stop') //停止爬虫
  stopSpider() {
    console.log('Stopping spider...');
    return this.jobService.stopSpider();
  }

  @Post()
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobService.create(createJobDto);
  }

  @Get()
  findAll() {
    return this.jobService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.update(+id, updateJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobService.remove(+id);
  }
}
