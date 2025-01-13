import { Column, Entity, PrimaryColumn, UpdateDateColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm' ;
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/common.entity';

@Entity()
export class DpMenu extends CommonEntity {
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
    description: '名称'
  })
  @Column({
    name:'name',
    nullable: false,
    type: 'varchar',
    comment: '名称',
    length: 50,
  })
  name: string
  @ApiProperty({
    description: '全称'
  })
  @Column({
    name:'full_name',
    nullable: true,
    type: 'varchar',
    comment: '全称',
    length: 50,
  })
  fullName: string
  @ApiProperty({
    description: '英文名称'
  })
  @Column({
    name:'english_name',
    nullable: true,
    type: 'varchar',
    comment: '英文名称',
    length: 50,
  })
  englishName: string
  @ApiProperty({
    description: '同步项目id'
  })
  @Column({
    name:'sync_id',
    nullable: true,
    type: 'varchar',
    comment: '同步项目id',
    length: 32,
  })
  syncId: string
  @ApiProperty({
    description: '标识'
  })
  @Column({
    name:'code',
    nullable: false,
    type: 'varchar',
    comment: '标识',
    length: 32,
  })
  code: string
  @ApiProperty({
    description: '描述'
  })
  @Column({
    name:'description',
    nullable: true,
    type: 'varchar',
    comment: '描述',
    length: 255,
  })
  description: string
  @ApiProperty({
    description: '所属项目'
  })
  @Column({
    name:'bind_project',
    nullable: false,
    type: 'varchar',
    comment: '所属项目',
    length: 32,
  })
  bindProject: string
  @ApiProperty({
    description: '父级'
  })
  @Column({
    name:'parent_id',
    nullable: true,
    type: 'varchar',
    comment: '父级',
    length: 32,
  })
  parentId: string

}
