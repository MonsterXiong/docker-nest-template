import { Injectable } from '@nestjs/common';
import { DpMenu, DpMenuService } from 'src/modules/base/dpMenu';
import { DpMenuDetail, DpMenuDetailService } from 'src/modules/base/dpMenuDetail';
import { DpmenuExtendDto } from './dpMenuExtend.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DpMenuExtendService {
  dpEnvConfigService: any;

  constructor(
    private readonly dpMenuService: DpMenuService,
    private readonly dpMenuDetailService: DpMenuDetailService,

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

}


