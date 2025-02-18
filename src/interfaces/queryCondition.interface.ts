import { ApiProperty } from '@nestjs/swagger';

export class QueryCondition{
  @ApiProperty({
    description:'查询条件',
    required: false,
    default: [{
			"property": "",
			"symbol": "",
			"value": "",
			"combine": "and"
    }],
  })
  readonly conditionParams:ConditionParam[]

  @ApiProperty({
    description:'排序条件 升序DESC 降序ASC',
    required: false,
    default: [{
			"property": "",
			"propertyType": "NON",
			"isDesc": true
    }],
  })
  readonly sortParams:SortParam[]

  @ApiProperty({
    description:'页码',
    required: false,
    default:1
  })
  readonly pageNumber?:number

  @ApiProperty({
    description:'页数大小',
    required: false,
    default:10
  })
  readonly pageSize?:number
}

export class ConditionParam{
  @ApiProperty({
    description:'属性',
    required: false,
    default: "",
  })
  readonly property:string

  @ApiProperty({
    description:'符号',
    required: false,
    default: '',
  })
  readonly symbol:string

  @ApiProperty({
    description:'值',
    required: false,
    default: '',
  })
  readonly value:string

  @ApiProperty({
    description:'',
    required: false,
    default: 'and',
  })
  readonly combine:string
}
export class SortParam{
  @ApiProperty({
    description:'属性',
    required: false,
    default: "",
  })
  readonly property:string

  @ApiProperty({
    description:'',
    required: false,
    default: 'NoN',
  })
  readonly propertyType:string

  @ApiProperty({
    description:'升序/降序',
    required: false,
    default: true,
  })
  readonly isDesc:boolean
}
