import { Column, Entity, PrimaryColumn, UpdateDateColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm' ;
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/common.entity';

@Entity()
export class NavUrl{
  

  @ApiProperty({
    description: '主键'
  })
  @PrimaryColumn({
    name:'id',
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
    comment: '描述',
    length: 255,
  })
  description: string

  @ApiProperty({
    description: '所属链接类别'
  })
  @Column({
    name:'bind_url_type',
    nullable: false,
    comment: '所属链接类别',
    length: 32,
  })
  bindUrlType: string

  @ApiProperty({
    description: '所属单位'
  })
  @Column({
    name:'bind_nav',
    nullable: true,
    comment: '所属单位',
    length: 32,
  })
  bindNav: string

  @ApiProperty({
    description: '预览'
  })
  @Column({
    name:'url',
    nullable: false,
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
    comment: 'git链接',
    length: 255,
  })
  gitUrl: string

  @ApiProperty({
    description: '备注'
  })
  @Column({
    name:'sys_remark',
    nullable: true,
    comment: '备注',
    length: 255,
  })
  sysRemark: string

  @ApiProperty({
    description: '排序'
  })
  @Column({
    name:'sys_sort',
    nullable: true,
    comment: '排序',
    width: 10,
  })
  sysSort: number

  @ApiProperty({
    description: '状态'
  })
  @Column({
    name:'sys_is_active',
    nullable: true,
    comment: '状态',
    default:'0',
    length: 1,
  })
  sysIsActive: string

  @ApiProperty({
    description: '是否删除'
  })
  @Column({
    name:'sys_is_del',
    nullable: true,
    comment: '是否删除',
    default:'0',
    length: 1,
  })
  sysIsDel: string

  @ApiProperty({
    description: '创建人'
  })
  @Column({
    name:'sys_creator',
    nullable: true,
    comment: '创建人',
    length: 32,
  })
  sysCreator: string

  @ApiProperty({
    description: '创建时间'
  })
  @Column({
    name:'sys_create_time',
    nullable: true,
    comment: '创建时间',
    length: 32,
  })
  sysCreateTime: string

  @ApiProperty({
    description: '创建ip'
  })
  @Column({
    name:'sys_create_ip',
    nullable: true,
    comment: '创建ip',
    length: 32,
  })
  sysCreateIp: string

  @ApiProperty({
    description: '修改人'
  })
  @Column({
    name:'sys_updater',
    nullable: true,
    comment: '修改人',
    length: 32,
  })
  sysUpdater: string

  @ApiProperty({
    description: '修改时间'
  })
  @Column({
    name:'sys_update_time',
    nullable: true,
    comment: '修改时间',
    length: 32,
  })
  sysUpdateTime: string

  @ApiProperty({
    description: '修改ip'
  })
  @Column({
    name:'sys_update_ip',
    nullable: true,
    comment: '修改ip',
    length: 32,
  })
  sysUpdateIp: string

}
