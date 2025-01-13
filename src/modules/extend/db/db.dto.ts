import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { DatabaseConfigDto } from "src/shared/dto/database.dto";

export class ConnectionTestResultDto {
    @ApiProperty({
      description: '连接测试是否成功',
      example: true
    })
    success: boolean;
  
    @ApiProperty({
      description: '结果信息',
      example: '连接成功'
    })
    message: string;
  
    @ApiProperty({
      description: '错误信息',
      required: false,
      example: '连接被拒绝'
    })
    error?: string;
  }