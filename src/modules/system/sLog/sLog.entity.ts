import { Column, Entity,PrimaryColumn, UpdateDateColumn, CreateDateColumn, DeleteDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm' ;
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/common.entity';
import { nanoid } from 'nanoid';
import { format } from 'date-fns';

@Entity({
  comment: '日志'
})
export class SLog extends CommonEntity {

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
    description: '请求路径',
    example: ""
  })
  @Column({
    name:'path',
    nullable: true,
    type: 'varchar',
    comment: '请求路径',
    length: 100,
  })
  path: string

  @ApiProperty({
    description: '请求方法',
    example: ""
  })
  @Column({
    name:'method',
    nullable: true,
    type: 'varchar',
    comment: '请求方法',
    length: 20,
  })
  method: string

  @ApiProperty({
    description: '请求参数',
    example: ""
  })
  @Column({
    name:'params',
    nullable: true,
    type: 'text',
    comment: '请求参数',
  })
  params: string


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

