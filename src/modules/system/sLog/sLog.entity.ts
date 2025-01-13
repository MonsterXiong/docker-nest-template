import { Column, Entity, PrimaryColumn, UpdateDateColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm' ;
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/common.entity';

@Entity()
export class SLog extends CommonEntity {
  @ApiProperty({
    description: '主键'
  })
  @PrimaryColumn({
    name:'id',
    nullable: false,
    type: 'varchar',
    comment: '主键',
    length: 32,
  })
  id: string
  @ApiProperty({
    description: '请求路径'
  })
  @Column({
    name:'path',
    nullable: true,
    type: 'varchar',
    comment: '请求路径',
    length: 100,
  })
  path: string
  @ApiProperty({
    description: '请求方法'
  })
  @Column({
    name:'method',
    nullable: true,
    type: 'varchar',
    comment: '请求方法',
    length: 20,
  })
  method: string
  @ApiProperty({
    description: '请求参数'
  })
  @Column({
    name:'params',
    nullable: true,
    type: 'varchar',
    comment: '请求参数',
    length: 2000,
  })
  params: string

}
