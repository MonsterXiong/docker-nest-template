import { Injectable } from '@nestjs/common';
import { DpMenuService } from 'src/modules/base/dpMenu';
import { DpMenuDetailService } from 'src/modules/base/dpMenuDetail';
import { DpmenuExtendDto } from './dpMenuExtend.dto';

@Injectable()
export class DpMenuExtendService {
    dpEnvConfigService: any;

    constructor(
        private readonly dpMenuService: DpMenuService,
        private readonly dpMenuDetailService: DpMenuDetailService,
      ) { }

    async queryList(queryCondition){
        const { data: menuList, count} =
        await this.dpMenuService.queryList(queryCondition);
        
        const menuDetailList = await this.dpMenuDetailService.findAll();
        return {
            data:menuList.map((item) => {
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
      if(!menu){
        return null
      }
      const menuDetail =await this.dpMenuDetailService.findOneByParam({'bindMenu':id});
      return {
        ...menu,
        menuDetail
      }
    }

    async insert(entity: Partial<DpmenuExtendDto>,req) {
        const menuInfo = entity.menuDetail
        delete entity.menuDetail
      const menu = await this.dpMenuService.insert(entity,req);
      if(!menu){
        return null
      }
      const menuDetail =await this.dpMenuDetailService.insert(menuInfo,req);
      return {
        ...menu,
        menuDetail
      }
    }

    async delete(id: string,req): Promise<void> {
        const [menuEntity,menuDetailEntity] = await Promise.all([
            this.dpMenuService.findOne(id),
            this.dpMenuDetailService.findOneByParam({"bindMenu":id})
        ])
        const [menu,menuDetaul]= await Promise.all([
            this.dpMenuService.update({...menuEntity,sysIsDel: null},req),
            this.dpMenuDetailService.update({...menuDetailEntity,sysIsDel: null},req)]
        )
        return menu
      }

      async deleteBatch(ids: string[],req): Promise<void> {
        // TODO:
      }

}


