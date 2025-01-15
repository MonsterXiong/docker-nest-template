import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
export class CommonEntity  extends BaseEntity {
  @Column({
    name:'sys_remark',
    nullable: true,
    type: 'varchar',
    comment: '备注',
    length: 255,
  })
  sysRemark: string

  @Column({
    name:'sys_sort',
    nullable: true,
    type: 'int',
    comment: '排序',
    width: 10,
  })
  sysSort: number

  // @ApiProperty({
  //   description: '状态'
  // })
  // @Column({
  //   name:'sys_is_active',
  //   nullable: true,
  //   comment: '状态'
  // })
  // sysIsActive: string

  @Column({
    name:'sys_is_del',
    nullable: true,
    type: 'varchar',
    comment: '是否删除',
    default:'0',
    length: 4,
  })
  sysIsDel: string

  @Column({
    name:'sys_creator',
    nullable: true,
    type: 'varchar',
    comment: '创建人',
    length: 32,
  })
  sysCreator: string

  @Column({
    name:'sys_create_time',
    nullable: true,
    type: 'varchar',
    comment: '创建时间',
    length: 32,
  })
  sysCreateTime: string

  @Column({
    name:'sys_create_ip',
    nullable: true,
    type: 'varchar',
    comment: '创建ip',
    length: 32,
  })
  sysCreateIp: string

  @Column({
    name:'sys_updater',
    nullable: true,
    type: 'varchar',
    comment: '修改人',
    length: 32,
  })
  sysUpdater: string

  @Column({
    name:'sys_update_time',
    nullable: true,
    type: 'varchar',
    comment: '修改时间',
    length: 32,
  })
  sysUpdateTime: string

  @Column({
    name:'sys_update_ip',
    nullable: true,
    type: 'varchar',
    comment: '修改ip',
    length: 32,
  })
  sysUpdateIp: string
} 