import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '../common/common.entity';

@Entity('category')
export class Category extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ 
    type: 'varchar', 
    length: 50, 
    comment: '分类名称',
    collation: 'utf8mb4_general_ci'
  })
  name: string;

  @Column({ 
    type: 'varchar', 
    length: 50, 
    comment: '分类编码',
    collation: 'utf8mb4_general_ci'
  })
  code: string;

  @Column({ 
    type: 'varchar', 
    length: 32, 
    nullable: true, 
    comment: '父级ID',
    collation: 'utf8mb4_general_ci'
  })
  parentId: string;

  @Column({ 
    type: 'varchar', 
    length: 50, 
    comment: '分类类型',
    collation: 'utf8mb4_general_ci'
  })
  type: string;
} 