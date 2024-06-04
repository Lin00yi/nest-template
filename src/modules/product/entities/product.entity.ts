import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 20 })
  name: string;

  @Column({ nullable: false })
  price: string;

  @Column({ nullable: false })
  description: string;
}
