import {
  Injectable,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import * as ejs from 'ejs';
import {
  getGroupList,
  getInterfaceBatch,
  getServiceBatch,
} from './utils/getSwaggerService';
import { DpTemplateExtendService } from '../dpTemplateExtend/dpTemplateExtend.service';
import { GenFeEnum } from 'src/enums/genTypeMap.enum';
import { DpTemplatePromptService } from 'src/modules/base/dpTemplatePrompt';
import { formatObject } from './utils/formatObject';
import QueryConditionBuilder from 'src/utils/queryCondition';
import { formatColumnType } from './utils/formatColumnType';
import { RenderEngine } from './utils/renderEngine';
import { ConfigService } from '@nestjs/config';
import { SSHClient } from 'src/utils/ssh';
@Injectable()
export class CommonService implements OnApplicationBootstrap {
  private TEMPLATE_TREE;
  private TEMPLATE_PROMPT;
  private TEMPLATE_MAP;
  private TEMPLATE_METHOD;
  constructor(
    private readonly configService: ConfigService,
    private readonly dpTemplateExtendService: DpTemplateExtendService,
    private readonly dpTemplatePromptService: DpTemplatePromptService,
  ) {}
  async onApplicationBootstrap() {
    console.log('缓存模板数据');
    this.TEMPLATE_TREE = await this.dpTemplateExtendService.getTemplateTree();
    this.TEMPLATE_MAP = await this.dpTemplateExtendService.getTemplateMap();
    this.TEMPLATE_PROMPT = await this._getTemplatePrompListByType('Template');
    this.TEMPLATE_METHOD =
      await this._getTemplatePrompListByType('TemplateMethod');
  }
  async _getTemplatePrompListByType(type) {
    const queryCondition = QueryConditionBuilder.getInstanceNoPage();
    queryCondition.buildEqualQuery('type', type);
    const { data } =
      await this.dpTemplatePromptService.queryList(queryCondition);
    return data;
  }
  getTemplate(type) {
    return this.TEMPLATE_TREE.find((item) => item.code === type);
  }

  commonParse(type, data) {
    const templateCode = this.getTemplate(type).templateCode;
    const templateData = this.dpTemplateExtendService.runFunc(
      templateCode,
      data,
    );
    return templateData || {};
    // return {}
  }

  commonParseMethod(type, data) {
    const templateCode = this.getTemplate(type).templateCode;
    
    const templateData = this.dpTemplateExtendService.runFunc(
      templateCode,
      data,
    );
    return templateData
  }


  getTemplateFile(type) {
    return this.TEMPLATE_TREE.find((item) => item.code === type);
  }

  _genTemplateFunc() {
    const returnStr = `\r\nreturn { ${this.TEMPLATE_PROMPT.map((item) => item.code).join(',')}}`;
    const funcStr =
      this.TEMPLATE_PROMPT.map((item) => item.value + '\n').join('') +
      returnStr;
    const templateFunc = this.dpTemplateExtendService.runFunc(funcStr, {});
    return templateFunc;
  }

  _cleanCode(code) {
    return code
      .replace(/&#34;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#39;/g, "'");
  }

  _formatResult(template) {
    return {
      filePath: template.filePath,
      fileExt: template.templateExt,
      name: template.code,
    };
  }

  // _gen(templateItem,option) {
  //   let code = ejs.render(templateItem.templateCode, option);
  //   return {
  //     code: this._cleanCode(code),
  //     ...this._formatResult(templateItem),
  //   };
  // }

  _gen(templateItem, option) {
    const renderEngine = new RenderEngine(this.TEMPLATE_MAP);
    let code = renderEngine.render(templateItem.pathKey, option);
    return {
      code: this._cleanCode(code),
      ...this._formatResult(templateItem),
    };
  }

  _genCode(type, context) {
    const template = this.getTemplate(type);
    const templateData = this.dpTemplateExtendService.runFunc(
      template.templateCode,
      context,
      {
        COMMON_PARSE:(type,data)=>this.commonParseMethod(type,data)
      }
    );
    const templateFunc = this._genTemplateFunc();
    return template.children.reduce((pre, templateItem) => {
      if (templateItem.templateType !== 'dir') {
        const result = this._gen(templateItem, {
          ...templateData,
          // sql方法
          helpers: { formatColumnType },
          TEMPLATE_UTILS: { ...templateFunc, formatObject },
          COMMON_PARSE: (type, data) => this.commonParse(type, data),
        });
        pre.push(result);
      }
      return pre;
    }, []);
  }

  getCode(projectInfo, list, type, isSingle = false) {
     // todo:优化 可删除
    this.onApplicationBootstrap();
    if (isSingle) {
      return this._genCode(type, {
        PROJECT_INFO: projectInfo,
        PARAMS: list,
      });
    }
    return list.map((item) => {
      let codeType = type;
      if (type == GenFeEnum.PAGE) {
        const configParam = JSON.parse(item.menuDetail.configParam);
        codeType = configParam?.code || 'Empty';
      }
      return {
        ...item,
        children: this._genCode(codeType, {
          PROJECT_INFO: projectInfo,
          PARAMS: item,
          // 将模板中的方法体传入进来
        }),
      };
    });
  }

  async getSwaggerService() {
    const params = {
      baseUrl: 'http://192.168.2.231:8062',
      account: 'admin',
      password: '123456',
    };
    const groupList = await getGroupList(params);
    let serviceList = await getServiceBatch(params.baseUrl, groupList);
    return serviceList;
  }
  getServerConfig() {
    return {
      host: this.configService.get('SERVER_HOST'),
      port: this.configService.get('SERVER_PORT'),
      username: this.configService.get('SERVER_USERNAME'),
      password: this.configService.get('SERVER_PASSWORD'),
    };
  }

  // 连接服务器
  async test(){
    const ssh = new SSHClient(this.getServerConfig())
    try {
      // 连接服务器
      await ssh.connect()
      console.log('执行ls -la命令:');
      const result:any = await ssh.executeCommand('/usr/local/monster/autoDeploy.sh')
      return result.stdout
    } catch (error) {
      console.error('发生错误:',error);
    }finally{
      ssh.disconnect()
    }
  }
}
