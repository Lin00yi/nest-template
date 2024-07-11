import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, length: 30, comment: '职位名称' })
  name: string;

  @Column({ nullable: true, length: 20, comment: '区域' })
  area: string;

  @Column({ nullable: true, length: 30, comment: '薪资范围' })
  salary: string;

  @Column({ nullable: true, length: 600, comment: '详情页链接' })
  link: string;

  @Column({ nullable: true, length: 20, comment: '公司名称' })
  company: string;

  @Column({ nullable: true, type: 'text', comment: '职位描述' }) // type: 'text' 会自动转换为 longtext 可存储大段文本
  desc: string;
}
