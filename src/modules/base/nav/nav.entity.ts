import { Column, Entity,PrimaryColumn, UpdateDateColumn, CreateDateColumn, DeleteDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm' ;
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/common.entity';
import { nanoid } from 'nanoid';
import { format } from 'date-fns';

@Entity({
  comment: '导航'
})
export class Nav extends CommonEntity {

  @ApiProperty({
    description: '主键',
    example: ""
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
    description: '名称',
    example: ""
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
    description: '全称',
    example: ""
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
    description: '标识',
    example: ""
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
    description: '描述',
    example: ""
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
    description: '所属分类',
    example: ""
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
    description: '所属单位',
    example: ""
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
    description: '所属类型(项目、产品)',
    example: ""
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
    description: '绑定项目',
    example: ""
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
    description: '预览',
    example: ""
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
    description: 'jenkins链接',
    example: ""
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
    description: 'git链接',
    example: ""
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
    description: '禅道链接',
    example: ""
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
    description: '端口',
    example: ""
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
    description: '是否演示',
    example: ""
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
    description: '父级',
    example: ""
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
    description: '图标',
    example: ""
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
    description: '背景图片',
    example: ""
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
    description: '标签',
    example: ""
  })
  @Column({
    name:'tag',
    nullable: true,
    type: 'varchar',
    comment: '标签',
    length: 255,
  })
  tag: string


  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = nanoid()
    }
    this.sysCreateTime = format(new Date(), 'yyyy:MM:dd HH:mm:ss');
  }

  @BeforeUpdate()
  updateTime() {
    this.sysUpdateTime = format(new Date(), 'yyyy:MM:dd HH:mm:ss');
  }
}

