import { Column, Entity,PrimaryColumn, UpdateDateColumn, CreateDateColumn, DeleteDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm' ;
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/common.entity';
import { nanoid } from 'nanoid';
import { format } from 'date-fns';

@Entity({
  comment: '枚举'
})
export class DpMetaEnum extends CommonEntity {

  @ApiProperty({
    description: '元枚举属性ID',
    example: ""
  })
  @PrimaryColumn({
    name:'id',
    nullable: false,
    type: 'varchar',
    comment: '元枚举属性ID',
    length: 32,
  })
  id: string

  @ApiProperty({
    description: '元枚举名称',
    example: ""
  })
  @Column({
    name:'name',
    nullable: false,
    type: 'varchar',
    comment: '元枚举名称',
    length: 255,
  })
  name: string

  @ApiProperty({
    description: '元枚举标识',
    example: ""
  })
  @Column({
    name:'code',
    nullable: false,
    type: 'varchar',
    comment: '元枚举标识',
    length: 255,
  })
  code: string

  @ApiProperty({
    description: '同步id',
    example: ""
  })
  @Column({
    name:'sync_id',
    nullable: true,
    type: 'varchar',
    comment: '同步id',
    length: 32,
  })
  syncId: string

  @ApiProperty({
    description: '元枚举描述',
    example: ""
  })
  @Column({
    name:'description',
    nullable: true,
    type: 'varchar',
    comment: '元枚举描述',
    length: 255,
  })
  description: string

  @ApiProperty({
    description: '所属数据体系',
    example: ""
  })
  @Column({
    name:'bind_database',
    nullable: false,
    type: 'varchar',
    comment: '所属数据体系',
    length: 32,
  })
  bindDatabase: string

  @ApiProperty({
    description: '禁用标识',
    example: ""
  })
  @Column({
    name:'disabled_flag',
    nullable: true,
    type: 'int',
    comment: '禁用标识',
    default:0,
    width: 1,
  })
  disabledFlag: number

  @ApiProperty({
    description: '图标',
    example: ""
  })
  @Column({
    name:'icon',
    nullable: true,
    type: 'varchar',
    comment: '图标',
    length: 255,
  })
  icon: string


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

