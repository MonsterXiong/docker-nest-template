import { Column, Entity, PrimaryColumn, UpdateDateColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm' ;
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/common.entity';

@Entity()
export class DpProjectInfo{
  

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
    description: '同步项目id'
  })
  @Column({
    name:'sync_id',
    nullable: true,
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
    description: '所属项目'
  })
  @Column({
    name:'bind_project',
    nullable: false,
    comment: '所属项目',
    length: 32,
  })
  bindProject: string

  @ApiProperty({
    description: '数据库主机'
  })
  @Column({
    name:'db_host',
    nullable: false,
    comment: '数据库主机',
    length: 32,
  })
  dbHost: string

  @ApiProperty({
    description: '数据库用户名'
  })
  @Column({
    name:'db_user',
    nullable: false,
    comment: '数据库用户名',
    length: 32,
  })
  dbUser: string

  @ApiProperty({
    description: '数据库密码'
  })
  @Column({
    name:'db_password',
    nullable: false,
    comment: '数据库密码',
    length: 32,
  })
  dbPassword: string

  @ApiProperty({
    description: '数据库端口'
  })
  @Column({
    name:'db_port',
    nullable: false,
    comment: '数据库端口',
    length: 32,
  })
  dbPort: string

  @ApiProperty({
    description: '数据库名称'
  })
  @Column({
    name:'db_name',
    nullable: false,
    comment: '数据库名称',
    length: 32,
  })
  dbName: string

  @ApiProperty({
    description: '仓库地址'
  })
  @Column({
    name:'git_url',
    nullable: true,
    comment: '仓库地址',
    length: 32,
  })
  gitUrl: string

  @ApiProperty({
    description: 'jenkins'
  })
  @Column({
    name:'jenkins',
    nullable: true,
    comment: 'jenkins',
    length: 32,
  })
  jenkins: string

  @ApiProperty({
    description: '接口前缀'
  })
  @Column({
    name:'api_prefix',
    nullable: true,
    comment: '接口前缀',
    length: 32,
  })
  apiPrefix: string

  @ApiProperty({
    description: '输出目录'
  })
  @Column({
    name:'output_dir',
    nullable: true,
    comment: '输出目录',
    length: 32,
  })
  outputDir: string

  @ApiProperty({
    description: '所属框架'
  })
  @Column({
    name:'bind_framework',
    nullable: true,
    comment: '所属框架',
    length: 32,
  })
  bindFramework: string

  @ApiProperty({
    description: '项目端口'
  })
  @Column({
    name:'port',
    nullable: true,
    comment: '项目端口',
    width: 10,
  })
  port: number

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
