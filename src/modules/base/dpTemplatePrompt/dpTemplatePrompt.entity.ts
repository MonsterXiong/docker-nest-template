import { Column, Entity,PrimaryColumn, UpdateDateColumn, CreateDateColumn, DeleteDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm' ;
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/common.entity';
import { nanoid } from 'nanoid';
import { format } from 'date-fns';

@Entity({
  comment: '模板提示'
})
export class DpTemplatePrompt extends CommonEntity {

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
    description: '模板类型 | Method | Template | Params',
    example: ""
  })
  @Column({
    name:'type',
    nullable: false,
    type: 'varchar',
    comment: '模板类型 | Method | Template | Params',
    default:'Method',
    length: 32,
  })
  type: string

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
    type: 'text',
    comment: '描述',
  })
  description: string

  @ApiProperty({
    description: '内容',
    example: ""
  })
  @Column({
    name:'value',
    nullable: false,
    type: 'text',
    comment: '内容',
  })
  value: string

  @ApiProperty({
    description: '类别名称',
    example: ""
  })
  @Column({
    name:'category_name',
    nullable: true,
    type: 'varchar',
    comment: '类别名称',
    length: 50,
  })
  categoryName: string


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

