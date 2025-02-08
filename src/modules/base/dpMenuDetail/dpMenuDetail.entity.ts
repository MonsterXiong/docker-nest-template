import { Column, Entity,PrimaryColumn, UpdateDateColumn, CreateDateColumn, DeleteDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm' ;
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/common.entity';
import { nanoid } from 'nanoid';
import { format } from 'date-fns';

@Entity({
  comment: '菜单详情'
})
export class DpMenuDetail extends CommonEntity {

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
    description: '所属菜单',
    example: ""
  })
  @Column({
    name:'bind_menu',
    nullable: false,
    type: 'varchar',
    comment: '所属菜单',
    length: 32,
  })
  bindMenu: string

  @ApiProperty({
    description: '英文名称',
    example: ""
  })
  @Column({
    name:'english_name',
    nullable: true,
    type: 'varchar',
    comment: '英文名称',
    length: 50,
  })
  englishName: string

  @ApiProperty({
    description: '同步项目id',
    example: ""
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
    description: '配置',
    example: ""
  })
  @Column({
    name:'config_param',
    nullable: true,
    type: 'varchar',
    comment: '配置',
    length: 255,
  })
  configParam: string

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

