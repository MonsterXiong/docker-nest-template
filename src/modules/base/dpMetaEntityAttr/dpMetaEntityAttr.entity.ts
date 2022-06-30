import { Column, Entity,PrimaryColumn, UpdateDateColumn, CreateDateColumn, DeleteDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm' ;
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../common/common.entity';
import { nanoid } from 'nanoid';
import { format } from 'date-fns';

@Entity({
  comment: '元对象属性'
})
export class DpMetaEntityAttr extends CommonEntity {

  @ApiProperty({
    description: '元对象属性ID',
    example: ""
  })
  @PrimaryColumn({
    name:'id',
    nullable: false,
    type: 'varchar',
    comment: '元对象属性ID',
    length: 32,
  })
  id: string

  @ApiProperty({
    description: '元对象属性名称',
    example: ""
  })
  @Column({
    name:'name',
    nullable: false,
    type: 'varchar',
    comment: '元对象属性名称',
    length: 255,
  })
  name: string

  @ApiProperty({
    description: '元对象属性标识',
    example: ""
  })
  @Column({
    name:'code',
    nullable: false,
    type: 'varchar',
    comment: '元对象属性标识',
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
    description: '元对象属性描述',
    example: ""
  })
  @Column({
    name:'description',
    nullable: true,
    type: 'varchar',
    comment: '元对象属性描述',
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
    description: '所属元对象',
    example: ""
  })
  @Column({
    name:'bind_entity',
    nullable: false,
    type: 'varchar',
    comment: '所属元对象',
    length: 32,
  })
  bindEntity: string

  @ApiProperty({
    description: '只读标识',
    example: ""
  })
  @Column({
    name:'readonly_flag',
    nullable: true,
    type: 'int',
    comment: '只读标识',
    default:0,
    width: 1,
  })
  readonlyFlag: number

  @ApiProperty({
    description: '主键标识',
    example: ""
  })
  @Column({
    name:'primary_flag',
    nullable: true,
    type: 'int',
    comment: '主键标识',
    default:0,
    width: 1,
  })
  primaryFlag: number

  @ApiProperty({
    description: '名称标识',
    example: ""
  })
  @Column({
    name:'display_flag',
    nullable: true,
    type: 'int',
    comment: '名称标识',
    default:0,
    width: 1,
  })
  displayFlag: number

  @ApiProperty({
    description: '层次标识',
    example: ""
  })
  @Column({
    name:'parent_flag',
    nullable: true,
    type: 'int',
    comment: '层次标识',
    default:0,
    width: 1,
  })
  parentFlag: number

  @ApiProperty({
    description: '必填标识',
    example: ""
  })
  @Column({
    name:'required_flag',
    nullable: true,
    type: 'int',
    comment: '必填标识',
    default:0,
    width: 1,
  })
  requiredFlag: number

  @ApiProperty({
    description: '数据类型',
    example: ""
  })
  @Column({
    name:'bind_data_type',
    nullable: false,
    type: 'varchar',
    comment: '数据类型',
    length: 50,
  })
  bindDataType: string

  @ApiProperty({
    description: '长度',
    example: ""
  })
  @Column({
    name:'length',
    nullable: true,
    type: 'varchar',
    comment: '长度',
    length: 50,
  })
  length: string

  @ApiProperty({
    description: '标签集',
    example: ""
  })
  @Column({
    name:'label_list',
    nullable: true,
    type: 'varchar',
    comment: '标签集',
    length: 255,
  })
  labelList: string

  @ApiProperty({
    description: '最大长度(字符约束)',
    example: ""
  })
  @Column({
    name:'constraint_string_max_size',
    nullable: true,
    type: 'int',
    comment: '最大长度(字符约束)',
    width: 10,
  })
  constraintStringMaxSize: number

  @ApiProperty({
    description: '最小长度(字符约束)',
    example: ""
  })
  @Column({
    name:'constraint_string_min_size',
    nullable: true,
    type: 'int',
    comment: '最小长度(字符约束)',
    default:0,
    width: 10,
  })
  constraintStringMinSize: number

  @ApiProperty({
    description: '正则表达式(字符约束)',
    example: ""
  })
  @Column({
    name:'constraint_string_regex_expression',
    nullable: true,
    type: 'varchar',
    comment: '正则表达式(字符约束)',
    length: 255,
  })
  constraintStringRegexExpression: string

  @ApiProperty({
    description: '最大值(数值约束)',
    example: ""
  })
  @Column({
    name:'constraint_number_max_number',
    nullable: true,
    type: 'int',
    comment: '最大值(数值约束)',
    width: 10,
  })
  constraintNumberMaxNumber: number

  @ApiProperty({
    description: '最小值(数值约束)',
    example: ""
  })
  @Column({
    name:'constraint_number_min_number',
    nullable: true,
    type: 'int',
    comment: '最小值(数值约束)',
    default:0,
    width: 10,
  })
  constraintNumberMinNumber: number

  @ApiProperty({
    description: '小数精度(数值约束)',
    example: ""
  })
  @Column({
    name:'constraint_number_decimal_precision',
    nullable: true,
    type: 'varchar',
    comment: '小数精度(数值约束)',
    length: 50,
  })
  constraintNumberDecimalPrecision: string

  @ApiProperty({
    description: '格式表达式(时间约束)',
    example: ""
  })
  @Column({
    name:'constraint_data_format_expression',
    nullable: true,
    type: 'varchar',
    comment: '格式表达式(时间约束)',
    length: 255,
  })
  constraintDataFormatExpression: string

  @ApiProperty({
    description: '多选标识(枚举引用约束)',
    example: ""
  })
  @Column({
    name:'constraint_enum_multiple_flag',
    nullable: true,
    type: 'int',
    comment: '多选标识(枚举引用约束)',
    default:0,
    width: 1,
  })
  constraintEnumMultipleFlag: number

  @ApiProperty({
    description: '引用目标实体(实体引用约束)',
    example: ""
  })
  @Column({
    name:'constraint_entity_bind_target_entity',
    nullable: true,
    type: 'varchar',
    comment: '引用目标实体(实体引用约束)',
    length: 32,
  })
  constraintEntityBindTargetEntity: string

  @ApiProperty({
    description: '多选标识(实体引用约束)',
    example: ""
  })
  @Column({
    name:'constraint_entity_multiple_flag',
    nullable: true,
    type: 'int',
    comment: '多选标识(实体引用约束)',
    default:0,
    width: 1,
  })
  constraintEntityMultipleFlag: number

  @ApiProperty({
    description: '引用形式(实体引用约束)',
    example: ""
  })
  @Column({
    name:'constraint_entity_bind_quote_type',
    nullable: true,
    type: 'varchar',
    comment: '引用形式(实体引用约束)',
    default:'list',
    length: 50,
  })
  constraintEntityBindQuoteType: string

  @ApiProperty({
    description: '引用形式属性(实体引用约束)',
    example: ""
  })
  @Column({
    name:'constraint_entity_bind_quote_entity_attr',
    nullable: true,
    type: 'varchar',
    comment: '引用形式属性(实体引用约束)',
    length: 32,
  })
  constraintEntityBindQuoteEntityAttr: string

  @ApiProperty({
    description: '禁用标识',
    example: ""
  })
  @Column({
    name:'disabled_flag',
    nullable: true,
    type: 'int',
    comment: '禁用标识',
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

  @ApiProperty({
    description: '引用目标枚举(枚举引用约束)',
    example: ""
  })
  @Column({
    name:'constraint_enum_bind_target_enum',
    nullable: true,
    type: 'varchar',
    comment: '引用目标枚举(枚举引用约束)',
    length: 32,
  })
  constraintEnumBindTargetEnum: string

  @ApiProperty({
    description: '默认值',
    example: ""
  })
  @Column({
    name:'default_value',
    nullable: true,
    type: 'varchar',
    comment: '默认值',
    length: 50,
  })
  defaultValue: string

  @ApiProperty({
    description: '依赖标识',
    example: ""
  })
  @Column({
    name:'depend_flag',
    nullable: true,
    type: 'int',
    comment: '依赖标识',
    default:0,
    width: 1,
  })
  dependFlag: number

  @ApiProperty({
    description: '联查标识',
    example: ""
  })
  @Column({
    name:'rel_query_flag',
    nullable: true,
    type: 'int',
    comment: '联查标识',
    default:0,
    width: 1,
  })
  relQueryFlag: number


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

