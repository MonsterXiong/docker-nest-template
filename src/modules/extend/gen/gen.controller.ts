import { Controller, Post, Body, Param } from '@nestjs/common';
import { GenService } from './gen.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { 
  DatabaseConfigDto, 
  BatchTablesDto, 
} from '../../../shared/dto/database.dto';

@ApiTags('代码生成')
@Controller('gen')
export class GenController {
  constructor(private readonly genService: GenService) {}

  @Post('previewServiceCode/:tableName')
  @ApiOperation({ 
    summary: '根据单表预览代码',
  })
  async getCurdServiceCode(
    @Param('tableName') tableName: string,
    @Body() dbInfo: DatabaseConfigDto
  ) {
    return await this.genService.getCurdServiceCode(tableName, dbInfo);
  }

 
  @Post('previewServiceCodeBatch')
  @ApiOperation({ 
    summary: '批量预览代码',
  })
  async getCurdServiceCodeBatch(@Body() data: BatchTablesDto) {
    return await this.genService.getCurdServiceCodeBatch(data.tableNames,data.config);
  }

  @Post('previewServiceCodeList')
  @ApiOperation({ 
    summary: '预览所有表代码',
  })
  async getCurdServiceCodeList(@Body() dbInfo: DatabaseConfigDto) {
    return await this.genService.getCurdServiceCodeList(dbInfo);
  }

  @Post('genServiceCode/:tableName')
  @ApiOperation({ 
    summary: '根据单表生成代码',
  })
  async genCurdServiceCode(
    @Param('tableName') tableName: string,
    @Body() dbInfo: DatabaseConfigDto
  ) {
    return await this.genService.genCurdServiceCode(tableName, dbInfo);
  }

 
  @Post('genServiceCodeBatch')
  @ApiOperation({ 
    summary: '批量生成代码',
  })
  async genCurdServiceCodeBatch(@Body() data: BatchTablesDto) {
    return await this.genService.genCurdServiceCodeBatch(data.tableNames,data.config);
  }

  @Post('genServiceCodeList')
  @ApiOperation({ 
    summary: '生成所有表代码',
  })
  async genCurdServiceCodeList(@Body() dbInfo: DatabaseConfigDto) {
    return await this.genService.genCurdServiceCodeList(dbInfo);
  }

  @Post('clearCurdServiceCode')
  @ApiOperation({ 
    summary: '清除基础代码',
  })
  async clearCurdServiceCode() {
    return await this.genService.clearCurdServiceCodeList();
  }
}
