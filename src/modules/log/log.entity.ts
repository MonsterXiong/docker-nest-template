import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../common/common.entity';

@Entity('log')
export class Log extends CommonEntity {
  @PrimaryColumn({ length: 32, comment: '主键' })
  @ApiProperty({ description: 'ID' })
  id: string;

  @Column({ length: 100, nullable: true, comment: '请求路径' })
  @ApiProperty({ description: '请求路径' })
  path: string;

  @Column({ length: 20, nullable: true, comment: '请求方法' })
  @ApiProperty({ description: '请求方法' })
  method: string;

  @Column({ type: 'text', nullable: true, comment: '请求参数' })
  @ApiProperty({ description: '请求参数' })
  params: string;
} 