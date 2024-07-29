import { Injectable, Inject } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import puppeteer, { Browser } from 'puppeteer';
import { Job } from './entities/job.entity';
import { EntityManager } from 'typeorm';
import { waitTime } from 'src/utils';
import { Subject, Observable } from 'rxjs';
import { UpdateJobDto } from './dto/update-job.dto';
import { ResultService } from 'src/utils/resultUtils';

interface ServerSentEvent<T = any> {
  data: T;
  id?: string;
  type?: string;
  retry?: number;
}

@Injectable()
export class JobService {
  private readonly subject = new Subject<ServerSentEvent>();
  private browser: Browser | null = null;
  private isRunning = false;
  constructor(
    @Inject(EntityManager) private readonly entityManager: EntityManager, //依赖注入方式
  ) {}

  getSseStream(
    query: string,
    city: string | number,
  ): Observable<{ data: any }> {
    //返回值类型Observable<{ data: any }>
    // return interval(1000).pipe(
    //   map((i) => ({
    //     data: `Job message ${i} for query ${query} and city ${city}`,
    //   })),
    // );
    // 调用startSpider并推送数据
    this.startSpider(query, city);
    return this.subject.asObservable();
  }
  sendData(data: ServerSentEvent) {
    this.subject.next(data);
  }

  //启动爬虫
  async startSpider(query: string, city: number | string = 100010000) {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('Starting spider...', query, city);
    const encodedQuery = encodeURIComponent(query);
    const spiderUrl = `https://www.zhipin.com/web/geek/job?query=${encodedQuery}&city=${city}`;
    this.browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 1920, height: 1080 },
    });
    // // 监听浏览器断开连接事件
    // this.browser.on('disconnected', async () => {
    //   console.log('Browser disconnected.');
    //   await this.stopSpider();
    // });

    console.log('Browser opened.');
    const page = await this.browser.newPage();
    try {
      await page.goto(spiderUrl, { timeout: 60000 });
      await page.waitForSelector('.job-list-box', { timeout: 30000 });
      const totalPage = await page.$eval(
        '.options-pages a:nth-last-child(2)',
        (el) => parseInt(el.textContent),
      );
      const allJobs = [];

      for (let i = 1; i <= totalPage; i++) {
        await waitTime(2000);
        await page.goto(`${spiderUrl}&page=${i}`, { timeout: 60000 });
        await page.waitForSelector('.job-list-box', { timeout: 60000 });

        const jobs = await page.$$eval('.job-card-wrapper', (items) => {
          return items.map((item) => ({
            job: {
              name: item.querySelector('.job-name')?.textContent || 'Unknown',
              area: item.querySelector('.job-area')?.textContent || 'Unknown',
              salary: item.querySelector('.salary')?.textContent || 'Unknown',
            },
            link: item.querySelector('a')?.href || '',
            company: {
              name:
                item.querySelector('.company-name')?.textContent || 'Unknown',
            },
          }));
        });

        allJobs.push(...jobs);
        this.sendData({ data: jobs });
      }

      await Promise.all(
        allJobs.map(async (job, index) => {
          try {
            if (job.link) {
              await page.goto(job.link, { timeout: 60000 });
              await page.waitForSelector('.job-sec-text', { timeout: 30000 });
              const desc = await page.$eval(
                '.job-sec-text',
                (el) => el.textContent,
              );
              allJobs[index].desc = desc;
              console.log(`Job ${index + 1} description retrieved.`);
            }
          } catch (error) {
            console.error(
              `Failed to retrieve description for job ${index + 1}:`,
              error,
            );
          }
        }),
      );

      await this.stopSpider(); // 确保在结束时关闭浏览器
      console.log('Spider finished.');

      const cleanedJobs = allJobs.map((job) => ({
        job: {
          name: job.job.name || 'Unknown',
          area: job.job.area || 'Unknown',
          salary: job.job.salary || 'Unknown',
        },
        link: job.link || '',
        company: {
          name: job.company.name || 'Unknown',
        },
        desc: job.desc || 'No description available',
      }));

      for (const job of cleanedJobs) {
        const createJobDto = new CreateJobDto();
        createJobDto.name = job.job.name;
        createJobDto.area = job.job.area;
        createJobDto.salary = job.job.salary;
        createJobDto.link = job.link;
        createJobDto.company = job.company.name;
        createJobDto.desc = job.desc;
        await this.entityManager.save(Job, createJobDto);
      }
    } catch (e) {
      //如果出现错误，需要统一抛出异常
      console.error('Spider error:', e);
    }
  }

  //停止爬虫
  async stopSpider() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.isRunning = false;
      console.log('Spider stopped.');
    }
    this.subject.next({ data: 'disconnect', type: 'disconnect' }); // 发送断开连接的通知
    this.subject.complete(); // 关闭SSE连接
    return ResultService.success('Spider stopped.');
  }

  create(createJobDto: CreateJobDto) {
    console.log('Creating job...', createJobDto);
    return 'This action adds a new job';
  }

  findAll() {
    return `This action returns all job`;
  }

  findOne(id: number) {
    return `This action returns a #${id} job hhh`;
  }

  update(id: number, updateJobDto: UpdateJobDto) {
    console.log('UpdateJob job...', updateJobDto);
    return `This action updates a #${id} job`;
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
  }
}
