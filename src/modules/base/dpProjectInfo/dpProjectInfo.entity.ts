import { Column, Entity, PrimaryColumn, UpdateDateColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm' ;
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/common.entity';

@Entity()
export class DpProjectInfo extends CommonEntity {
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
    description: '数据库主机'
  })
  @Column({
    name:'db_host',
    nullable: false,
    type: 'varchar',
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
    type: 'varchar',
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
    type: 'varchar',
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
    type: 'varchar',
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
    type: 'varchar',
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
    type: 'varchar',
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
    type: 'varchar',
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
    type: 'varchar',
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
    type: 'varchar',
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
    type: 'varchar',
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
    type: 'int',
    comment: '项目端口',
    width: 10,
  })
  port: number

}
