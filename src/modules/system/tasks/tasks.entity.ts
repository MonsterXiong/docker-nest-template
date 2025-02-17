import { Entity, Column, BeforeInsert, PrimaryColumn, BeforeUpdate } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/common.entity';
import { nanoid } from 'nanoid';
import { format } from 'date-fns';

@Entity({
    name: 's_task',
    comment: '定时任务'
})
export class Task extends CommonEntity {
    @ApiProperty({
        description: '主键',
        example: ""
    })
    @PrimaryColumn({
        name: 'id',
        nullable: false,
        type: 'varchar',
        comment: '主键',
        length: 32,
    })
    id: string

    @ApiProperty({
        description: '任务名称',
        example: "数据备份任务"
    })
    @Column({
        name: 'name',
        type: 'varchar',
        length: 50,
        comment: '任务名称'
    })
    name: string;

    @ApiProperty({
        description: 'Cron表达式',
        example: "0 0 * * * *"
    })
    @Column({
        name: 'cron',
        type: 'varchar',
        length: 50,
        comment: 'Cron表达式'
    })
    cron: string;

    @ApiProperty({
        description: '任务类型',
        example: "BACKUP"
    })
    @Column({
        name: 'type',
        type: 'varchar',
        length: 50,
        comment: '任务类型'
    })
    type: string;

    @ApiProperty({
        description: '任务参数',
        example: "{\"path\":\"/backup\"}"
    })
    @Column({
        name: 'params',
        type: 'text',
        nullable: true,
        comment: '任务参数(JSON格式)'
    })
    params: string;

    @ApiProperty({
        description: '任务状态',
        example: "RUNNING"
    })
    @Column({
        name: 'status',
        type: 'varchar',
        length: 20,
        default: 'STOPPED',
        comment: '任务状态:RUNNING/STOPPED'
    })
    status: string;


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