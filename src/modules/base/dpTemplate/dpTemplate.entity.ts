import { Column, Entity,PrimaryColumn, UpdateDateColumn, CreateDateColumn, DeleteDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm' ;
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/common.entity';
import { nanoid } from 'nanoid';
import { format } from 'date-fns';

@Entity({
  comment: '模板'
})
export class DpTemplate extends CommonEntity {

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
    nullable: false,
    type: 'varchar',
    comment: '标识',
    length: 32,
  })
  code: string

  @ApiProperty({
    description: '布局配置',
    example: ""
  })
  @Column({
    name:'layout_param',
    nullable: true,
    type: 'text',
    comment: '布局配置',
  })
  layoutParam: string

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
    description: '生成类别（前端）',
    example: ""
  })
  @Column({
    name:'bind_gen',
    nullable: true,
    type: 'varchar',
    comment: '生成类别（前端）',
    length: 255,
  })
  bindGen: string

  @ApiProperty({
    description: '生成模板类别（前端后端）',
    example: ""
  })
  @Column({
    name:'bind_gen_template',
    nullable: true,
    type: 'varchar',
    comment: '生成模板类别（前端后端）',
    length: 255,
  })
  bindGenTemplate: string

  @ApiProperty({
    description: '生成模板类型（前端：页面、配置、路由；后端：接口）',
    example: ""
  })
  @Column({
    name:'bind_gen_template_type',
    nullable: true,
    type: 'varchar',
    comment: '生成模板类型（前端：页面、配置、路由；后端：接口）',
    length: 255,
  })
  bindGenTemplateType: string

  @ApiProperty({
    description: '父级ID',
    example: ""
  })
  @Column({
    name:'parent_id',
    nullable: true,
    type: 'varchar',
    comment: '父级ID',
    length: 32,
  })
  parentId: string

  @ApiProperty({
    description: '相对路径',
    example: ""
  })
  @Column({
    name:'relative_path',
    nullable: true,
    type: 'varchar',
    comment: '相对路径',
    length: 255,
  })
  relativePath: string

  @ApiProperty({
    description: '模板代码',
    example: ""
  })
  @Column({
    name:'template_code',
    nullable: true,
    type: 'text',
    comment: '模板代码',
  })
  templateCode: string

  @ApiProperty({
    description: '模板类型',
    example: ""
  })
  @Column({
    name:'template_type',
    nullable: true,
    type: 'varchar',
    comment: '模板类型',
    length: 50,
  })
  templateType: string

  @ApiProperty({
    description: '模板后缀名',
    example: ""
  })
  @Column({
    name:'template_ext',
    nullable: true,
    type: 'varchar',
    comment: '模板后缀名',
    length: 50,
  })
  templateExt: string


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

