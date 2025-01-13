import { Column, Entity, PrimaryColumn, UpdateDateColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm' ;
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/common.entity';

@Entity()
export class DpTemplate extends CommonEntity {
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
    description: '生成类别（前端）'
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
    description: '生成模板类别（前端后端）'
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
    description: '生成模板类型（前端：页面、配置、路由；后端：接口）'
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
    description: '父级ID'
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
    description: '相对路径'
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
    description: '模板代码'
  })
  @Column({
    name:'template_code',
    nullable: true,
    type: 'text',
    comment: '模板代码',
  })
  templateCode: string
  @ApiProperty({
    description: '模板算法'
  })
  @Column({
    name:'template_algithorm',
    nullable: true,
    type: 'text',
    comment: '模板算法',
  })
  templateAlgithorm: string
  @ApiProperty({
    description: '模板类型'
  })
  @Column({
    name:'template_ext',
    nullable: true,
    type: 'varchar',
    comment: '模板类型',
    length: 50,
  })
  templateExt: string

}
