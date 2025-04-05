import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DpMenu, DpMenuService } from 'src/modules/base/dpMenu';
import { DpMenuDetail, DpMenuDetailService } from 'src/modules/base/dpMenuDetail';
import { DpmenuExtendDto } from './dpMenuExtend.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DpProjectExtendService } from '../dpProjectExtend/dpProjectExtend.service';
import { CommonService } from '../common/common.service';
import { GenFeEnum, TYPE_MAP_CODE, TYPE_MAP_SINGLE } from 'src/enums/genTypeMap.enum';
import { format, removeFullPath } from '../dpGen/dbGen.utils';
import { GenEnum } from 'src/enums/gen.enum';
import { outputCode } from 'src/utils/outputCode';

@Injectable()
export class DpMenuExtendService {
  dpEnvConfigService: any;

  constructor(
    private readonly dpMenuService: DpMenuService,
    private readonly dpMenuDetailService: DpMenuDetailService,
    private readonly commonService: CommonService,


    @Inject(forwardRef(()=>DpProjectExtendService))
    private readonly dpProjectExtendService: DpProjectExtendService,

    @InjectRepository(DpMenu)
    private readonly dpMenuRepository: Repository<DpMenu>,
  ) { }

  async queryList(queryCondition) {
    const { data: menuList, count } =
      await this.dpMenuService.queryList(queryCondition);

    const menuDetailList = await this.dpMenuDetailService.findAll();
    return {
      data: menuList.map((item) => {
        const menuDetail =
          menuDetailList.find((menuDetailItem) => menuDetailItem.bindMenu == item.id
          ) || {};
        return {
          ...item,
          menuDetail,
        };
      }),
      count
    }
  }

  async findOne(id) {
    const menu = await this.dpMenuService.findOne(id);
    if (!menu) {
      return null
    }
    const menuDetail = await this.dpMenuDetailService.findOneByParam({ 'bindMenu': id });
    return {
      ...menu,
      menuDetail
    }
  }

  async insert(entity: Partial<DpmenuExtendDto>, req) {
    const menuInfo = entity.menuDetail
    delete entity.menuDetail
    const menu = await this.dpMenuService.insert(entity, req);
    if (!menu) {
      return null
    }
    const menuDetail = await this.dpMenuDetailService.insert(menuInfo, req);
    return {
      ...menu,
      menuDetail
    }
  }

  async deleteBatch(ids: string[], req): Promise<any> {
    const data: any = await this.dpMenuRepository
      .createQueryBuilder('a')
      .leftJoinAndMapMany(
        'a.menuDetailList', 
        DpMenuDetail, 
        'b', 'b.bind_menu = a.id AND b.sys_is_del IS NOT NULL'
      )
      .where('a.id IN (:...ids)', { ids })
      .getMany()

    const menuIds = []
    let menuDetailIds = []

    data.forEach(menu => {
      menuIds.push(menu.id)
      const detailIds = menu.menuDetailList.map(item => item.id)
      menuDetailIds = [...menuDetailIds, ...detailIds]
    })

    await this.dpMenuDetailService.deleteBatch(menuDetailIds, req)
    return await this.dpMenuService.deleteBatch(menuIds, req)
  }

  async delete(id, req) {
    return await this.deleteBatch([id], req)
  }
  // 用于删除未删除的菜单详情：
  async cleanMenu(req) {
    const [menuList, menuDetailList] = await Promise.all([this.dpMenuService.findAll(), this.dpMenuDetailService.findAll()])
    const menuIds = menuList.map(item => item.id)
    const other = menuDetailList.filter(item => !menuIds.includes(item.bindMenu))
    return await this.dpMenuDetailService.deleteBatch(other.map(item => item.id), req)
  }

  async getServiceById(id,isGen,res){
      const menuInfo = await this.findOne(id)
      const configParam = JSON.parse(menuInfo?.menuDetail?.configParam)
      
      const collectList = configParam?.page?.reduce((pre,item)=>{
        if(item.children?.length){
          item.children.forEach((configItem)=>{
            if(configItem.params?.length){
              pre= pre.concat(configItem.params)
            }
          })
        }
        return pre
      },[])

      function collectForm(formList,result=[]){
        formList.forEach(item=>{
          if(item?.selectDataType=="interface"){
            result.push(item.sqlTable)
          }
        })
        return result
      }

      function colleact(arr,result){
        const service = arr.reduce((pre,item)=>{
          if(item.valueType == 'sql'){
            pre.push(item.value)
          }else if(item.valueType == 'formItem'){
            pre = pre.concat(collectForm(item.value?.props || []))
          }else if(item.valueType == 'table' && Array.isArray(item.value)){
            pre = pre.concat(colleact(item.value,[]))
          }
          return pre
        },[])
        return [...service,...result]
      }
      if(!collectList?.length){
        return []
      }
      const serviceList =  colleact(collectList,[])
      // 收集到了数据，需要根据菜单获取项目以及项目的表格信息

      const table = await this.dpProjectExtendService.getTableAndColumnByProjectId(menuInfo.bindProject)
      const serviceData = table.filter(item=>serviceList.includes(item.tableName))
      // TODO:
      const type = GenFeEnum.BASE_SERVICE;
      const transCode = TYPE_MAP_CODE[type];
      const isSingle = TYPE_MAP_SINGLE[type];
      const result = this.commonService.getCode(
        {},
        serviceData,
        type,
        isSingle,
      );
      
      const codeData =format(result, isSingle, transCode);
      const data = removeFullPath(codeData,type)
      if(GenEnum.GEN == isGen){
        return outputCode(res, data, type);
      }else{
        res.status(200).json({
          statusCode:200,
          code: 200,
          message: '请求成功',
          timestamp: new Date().toISOString(),
          data,
        });
        return
      }
  }
}


