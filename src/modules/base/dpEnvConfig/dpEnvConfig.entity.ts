import { Column, Entity,PrimaryColumn, UpdateDateColumn, CreateDateColumn, DeleteDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm' ;
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/common.entity';
import { nanoid } from 'nanoid';
import { format } from 'date-fns';

@Entity({
  comment: '环境变量配置'
})
export class DpEnvConfig extends CommonEntity {

  @ApiProperty({
    description: 'ID',
    example: ""
  })
  @PrimaryColumn({
    name:'id',
    nullable: false,
    type: 'varchar',
    comment: 'ID',
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
    description: '所属项目',
    example: ""
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
    description: '父id',
    example: ""
  })
  @Column({
    name:'parentId',
    nullable: true,
    type: 'varchar',
    comment: '父id',
    length: 32,
  })
  parentId: string

  @ApiProperty({
    description: '键',
    example: ""
  })
  @Column({
    name:'key',
    nullable: false,
    type: 'varchar',
    comment: '键',
    length: 50,
  })
  key: string

  @ApiProperty({
    description: '类型',
    example: ""
  })
  @Column({
    name:'type',
    nullable: false,
    type: 'varchar',
    comment: '类型',
    length: 50,
  })
  type: string

  @ApiProperty({
    description: '值类型',
    example: ""
  })
  @Column({
    name:'value_type',
    nullable: false,
    type: 'varchar',
    comment: '值类型',
    length: 50,
  })
  valueType: string

  @ApiProperty({
    description: '值',
    example: ""
  })
  @Column({
    name:'value',
    nullable: true,
    type: 'varchar',
    comment: '值',
    length: 255,
  })
  value: string

  @ApiProperty({
    description: '开发环境值',
    example: ""
  })
  @Column({
    name:'dev_value',
    nullable: true,
    type: 'varchar',
    comment: '开发环境值',
    length: 255,
  })
  devValue: string

  @ApiProperty({
    description: '生产环境值',
    example: ""
  })
  @Column({
    name:'prod_value',
    nullable: true,
    type: 'varchar',
    comment: '生产环境值',
    length: 255,
  })
  prodValue: string

  @ApiProperty({
    description: '预发布环境值',
    example: ""
  })
  @Column({
    name:'staging_value',
    nullable: true,
    type: 'varchar',
    comment: '预发布环境值',
    length: 255,
  })
  stagingValue: string

  @ApiProperty({
    description: '配置值',
    example: ""
  })
  @Column({
    name:'config_value',
    nullable: true,
    type: 'varchar',
    comment: '配置值',
    length: 255,
  })
  configValue: string

  @ApiProperty({
    description: '同步配置',
    example: ""
  })
  @Column({
    name:'sync_config',
    nullable: true,
    type: 'varchar',
    comment: '同步配置',
    length: 255,
  })
  syncConfig: string


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

