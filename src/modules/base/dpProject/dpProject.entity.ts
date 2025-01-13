import { Column, Entity, PrimaryColumn, UpdateDateColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm' ;
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/common.entity';

@Entity()
export class DpProject extends CommonEntity {
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
    nullable: true,
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
    description: '所属分类'
  })
  @Column({
    name:'bind_project_type',
    nullable: false,
    type: 'varchar',
    comment: '所属分类',
    length: 32,
  })
  bindProjectType: string
  @ApiProperty({
    description: '所属单位'
  })
  @Column({
    name:'bind_unit',
    nullable: true,
    type: 'varchar',
    comment: '所属单位',
    length: 32,
  })
  bindUnit: string
  @ApiProperty({
    description: '单位名称'
  })
  @Column({
    name:'unit_name',
    nullable: false,
    type: 'varchar',
    comment: '单位名称',
    length: 32,
  })
  unitName: string
  @ApiProperty({
    description: '单位标识'
  })
  @Column({
    name:'unit_code',
    nullable: false,
    type: 'varchar',
    comment: '单位标识',
    length: 32,
  })
  unitCode: string

}
