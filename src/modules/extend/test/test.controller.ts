import { Controller, Get } from '@nestjs/common';
import { TestService } from './test.service';
import { ApiOperation } from '@nestjs/swagger';
import { FunctionRunner } from './runner';


@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get()
  @ApiOperation({ summary: '获取所有数据' })
  async findAll() {
    // 根据项目Id获取项目信息
    const projectInfo = {}
    // 根据项目Id获取菜单信息
    const menuInfo = []
    // 获取模板信息
    const templateData = []

    // 开始遍历菜单信息

    // 根据菜单配置项结合清洗函数 + 模板文件遍历生成代码

    // 最终结果应该是每个菜单+菜单的代码,还不涉及代码生成
    const data1 = {
      projectInfo:{
          projectId:'1',
          name:'项目1'
      },
      menuInfo:[{
          menuId:'1',
          bindProject:'1',
          name:'首页菜单',
          code:'home_menu'
      },{
          menuId:'3',
          bindProject:'2',
          name:'头部菜单',
          code:'header_menu'
      }]
  }
  
  
  const functionList = [{
      script:`
          const result = {
              ...projectInfo,
              menuList:menuInfo.filter(item => item.bindProject === projectInfo.projectId).map(item => ({
                  ...item,
                  Code: utils.changeCase.pascalCase(item.code)
              }))
          }
          console.log('result:')
          return result
      `,
      data:data1
  },{
      script:`
          const result = {
              ...projectInfo,
              menuList:menuInfo.filter(item => item.bindProject === projectInfo.projectId).map(item => ({
                  ...item,
                  Code: utils.changeCase.pascalCase(item.code)
              }))
          }
          console.log('result:')
          return result
      `,
      data:data1
  }]
  
  
  functionList.forEach(item => {
      const result = FunctionRunner.run(item.script, item.data);
      console.log(result);
  })
    
    // return await this.testService.findAll();

  }
}
