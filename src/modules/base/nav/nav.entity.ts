import { Column, Entity, PrimaryColumn, UpdateDateColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm' ;
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/common.entity';

@Entity()
export class Nav extends CommonEntity {
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
    name:'bind_nav_category',
    nullable: true,
    type: 'varchar',
    comment: '所属分类',
    length: 32,
  })
  bindNavCategory: string
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
  @ApiProperty({
    description: '所属类型(项目、产品)'
  })
  @Column({
    name:'bind_nav_type',
    nullable: false,
    type: 'varchar',
    comment: '所属类型(项目、产品)',
    length: 32,
  })
  bindNavType: string
  @ApiProperty({
    description: '绑定项目'
  })
  @Column({
    name:'bind_project',
    nullable: true,
    type: 'varchar',
    comment: '绑定项目',
    length: 32,
  })
  bindProject: string
  @ApiProperty({
    description: '预览'
  })
  @Column({
    name:'url',
    nullable: false,
    type: 'varchar',
    comment: '预览',
    length: 255,
  })
  url: string
  @ApiProperty({
    description: 'jenkins链接'
  })
  @Column({
    name:'jenkins_url',
    nullable: true,
    type: 'varchar',
    comment: 'jenkins链接',
    length: 255,
  })
  jenkinsUrl: string
  @ApiProperty({
    description: 'git链接'
  })
  @Column({
    name:'git_url',
    nullable: true,
    type: 'varchar',
    comment: 'git链接',
    length: 255,
  })
  gitUrl: string
  @ApiProperty({
    description: '禅道链接'
  })
  @Column({
    name:'zentao_url',
    nullable: true,
    type: 'varchar',
    comment: '禅道链接',
    length: 255,
  })
  zentaoUrl: string
  @ApiProperty({
    description: '端口'
  })
  @Column({
    name:'port',
    nullable: true,
    type: 'int',
    comment: '端口',
    width: 10,
  })
  port: number
  @ApiProperty({
    description: '是否演示'
  })
  @Column({
    name:'is_preview',
    nullable: true,
    type: 'varchar',
    comment: '是否演示',
    default:'0',
    length: 1,
  })
  isPreview: string
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
  @ApiProperty({
    description: '图标'
  })
  @Column({
    name:'icon',
    nullable: true,
    type: 'varchar',
    comment: '图标',
    length: 32,
  })
  icon: string
  @ApiProperty({
    description: '背景图片'
  })
  @Column({
    name:'bg_image',
    nullable: true,
    type: 'varchar',
    comment: '背景图片',
    length: 255,
  })
  bgImage: string
  @ApiProperty({
    description: '标签'
  })
  @Column({
    name:'tag',
    nullable: true,
    type: 'varchar',
    comment: '标签',
    length: 255,
  })
  tag: string

}
