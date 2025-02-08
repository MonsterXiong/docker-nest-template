import { Injectable } from '@nestjs/common';
import { DpMenuService } from 'src/modules/base/dpMenu';
import { DpMenuDetailService } from 'src/modules/base/dpMenuDetail';
import { DpProjectService } from 'src/modules/base/dpProject/dpProject.service';
import { DpProjectInfoService } from 'src/modules/base/dpProjectInfo';
import QueryConditionBuilder from 'src/utils/queryCondition';

@Injectable()
export class DpProjectExtendService {
  constructor(
    private readonly dpProjectService: DpProjectService,
    private readonly dpProjectInfoService: DpProjectInfoService,
    private readonly dpMenuService: DpMenuService,
    private readonly dpMenuDetailService: DpMenuDetailService,
  ) {}

  async getProjectInfo(id) {
    const project = await this.dpProjectService.findOne(id);
    const projectInfo = await this.dpProjectInfoService.findOneByParam({
      bindProject: id,
    });
    return { ...project, projectInfo };
  }

  async getMenu(id) {
    const queryCondition =
      QueryConditionBuilder.getInstanceNoPage().buildEqualQuery(
        'bindProject',
        id,
      );
    const { data: menuList } =
      await this.dpMenuService.queryList(queryCondition);
    const menuDetailList = await this.dpMenuDetailService.findAll();
    return menuList.map((item) => {
      const menuDetail =
        menuDetailList.find(
          (menuDetailItem) => menuDetailItem.bindMenu == item.id,
        ) || {};
      return {
        ...item,
        menuDetail,
      };
    });
  }
}
