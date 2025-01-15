import { Column, Entity,PrimaryColumn, UpdateDateColumn, CreateDateColumn, DeleteDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm' ;
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/common.entity';
import { nanoid } from 'nanoid';
import { format } from 'date-fns';

@Entity({
  comment: '项目'
})
export class DpProject extends CommonEntity {

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
    name:'bind_project_type',
    nullable: false,
    type: 'varchar',
    comment: '所属分类',
    length: 32,
  })
  bindProjectType: string

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
    description: '单位名称',
    example: ""
  })
  @Column({
    name:'unit_name',
    nullable: false,
    type: 'varchar',
    comment: '单位名称',
    length: 32,
  })
  unitName: string

  @ApiProperty({
    description: '单位标识',
    example: ""
  })
  @Column({
    name:'unit_code',
    nullable: false,
    type: 'varchar',
    comment: '单位标识',
    length: 32,
  })
  unitCode: string


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

