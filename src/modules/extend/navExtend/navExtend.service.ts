import { Injectable, Logger } from '@nestjs/common';
import { NavService } from '../../base/nav/nav.service';
import { NavToolService } from '../../base/navTool/navTool.service';
import { NavUrlService } from '../../base/navUrl/navUrl.service';
import { SCategoryService } from '../../base/sCategory/sCategory.service';
import { QueryConditionBuilder } from 'src/utils/queryCondition';
import { v4 as uuidv4 } from 'uuid';
import { Nav } from 'src/modules/base/nav';
import { NavUrl } from 'src/modules/base/navUrl';
import { SCategory } from 'src/modules/base/sCategory';
import { NavTool } from 'src/modules/base/navTool';
import { CategoryType } from 'src/enums/category.enum';
import { PreviewStatus } from 'src/enums/preview.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export interface NavTreeItem extends Nav {
  children: Array<NavTreeItem | NavUrl>;
}

interface ToolCategoryItem extends SCategory {
  children: NavTool[];
}

interface NavDataResult {
  tools: ToolCategoryItem[];
  navs: Record<string, NavTreeItem[]>;
}

@Injectable()
export class NavExtendService {
  private readonly logger = new Logger(NavExtendService.name);

  constructor(
    private readonly navService: NavService,
    private readonly navToolService: NavToolService,
    private readonly navUrlService: NavUrlService,
    private readonly sCategoryService: SCategoryService,
    @InjectRepository(Nav)
    private readonly navRepository: Repository<Nav>,
    @InjectRepository(NavUrl)
    private readonly navUrlRepository: Repository<NavUrl>,
  ) {}

  async getNavData(): Promise<NavDataResult> {
    // 并行获取所有必要数据
    const [toolList, categories, navList, navUrls] = await Promise.all([
      this.navToolService.findAll(),
      this.getCategories(),
      this.navService.findAll(),
      this.navUrlService.findAll()
    ]);

    const activeNavs = navList.filter(nav => nav.isPreview === PreviewStatus.ACTIVE);
    
    return {
      tools: this.buildToolCategories(categories, toolList),
      navs: this.buildNavTree(activeNavs, navUrls)
    };
  }

  /**
   * 获取分类数据
   * @returns 返回分类数据数组
   * @description
   * 查询指定分类类型（导航工具和项目）的分类数据
   */
  private async getCategories(): Promise<SCategory[]> {
    const queryCondition = QueryConditionBuilder.getInstanceNoPage();
    queryCondition.buildInQuery('bindCategoryType', [
      CategoryType.NAV_TOOL,
      CategoryType.PROJECT
    ]);
    const result = await this.sCategoryService.queryList(queryCondition);
    return result.data;
  }

  /**
   * 构建工具分类树
   * @param categories 分类数据
   * @param tools 工具数据
   * @returns 返回工具分类树
   * @description
   * 根据分类类型为 NAV_TOOL 的分类数据构建工具分类树
   */
  private buildToolCategories(categories: SCategory[], tools: NavTool[]): ToolCategoryItem[] {
    const toolCategories = categories.filter(c => c.bindCategoryType === CategoryType.NAV_TOOL);
    
    return toolCategories.map(category => ({
      ...category,
      children: tools.filter(tool => tool.bindNavToolCategory === category.code)
    }));
  }

  private buildNavTree(navs: Nav[], urls: NavUrl[]): Record<string, NavTreeItem[]> {
    const navMap = new Map<string, NavTreeItem>();
    const rootNavs: NavTreeItem[] = [];

    // 创建导航项映射并处理父子关系
    navs.forEach(nav => {
      const navItem: NavTreeItem = { ...nav, children: [] };
      navMap.set(nav.id, navItem);
      
      if (nav.parentId) {
        const parentNav = navMap.get(nav.parentId);
        parentNav?.children.push(navItem);
      } else {
        rootNavs.push(navItem);
      }
    });

    // 添加导航链接
    urls.forEach(url => {
      const parentNav = navMap.get(url.bindNav);
      parentNav?.children.push(url);
    });

    // 按类型分类
    return rootNavs.reduce((acc, nav) => {
      const type = nav.bindProjectType || 'default';
      acc[type] = acc[type] || [];
      acc[type].push(nav);
      return acc;
    }, {} as Record<string, NavTreeItem[]>);
  }

  /**
   * 批量新增导航树
   * @param navTree 导航树结构
   * @returns 返回创建后的导航树
   * @description
   * 将树形结构转换为扁平结构，并使用事务批量插入 Nav 和 NavUrl
   */
  async batchCreateNavTree(navTree: NavTreeItem): Promise<{ navs: Nav[]; urls: NavUrl[] }> {
    try {
      const { navs, urls } = this.flattenNavTree(navTree);
        console.log(navs,urls);
        
      if (navs.length === 0) {
        throw new Error('No nav items to insert');
      }
      const createdNavs = await this.navRepository.save(navs);
      const navIdMap = new Map<string, string>();
      createdNavs.forEach(nav => {
        const originalId = nav.id
        if (originalId) {
          navIdMap.set(nav.id, nav.id);
        }
      });
      console.log(createdNavs,'url');
      const processedUrls = urls.map(url => ({
        ...url,
      }));

      const createdUrls = urls.length > 0 ? await this.navUrlRepository.save(processedUrls) : [];

      return {
        navs: createdNavs,
        urls: createdUrls,
      };
    } catch (error) {
      this.logger.error('Failed to batch create nav tree', error.stack);
      throw new Error('Failed to batch create nav tree');
    }
  }

  private flattenNavTree(navTree: NavTreeItem): { navs: Nav[]; urls: NavUrl[];  } {
    const navs: Nav[] = [];
    const urls: NavUrl[] = [];

    const processNode = (node: NavTreeItem, parentId: string | null) => {
      // 创建新的 nav 对象，不修改原始对象
      const newNav = {
        ...node,
        parentId,
      };
      delete newNav.children; // 删除新对象的 children

      navs.push(newNav);

      // 处理子节点
      node.children.forEach(child => {
        if ('url' in child) {
          urls.push({
            ...child,
          });
        } else {
          processNode(child, node.id);
        }
      });
    };

    processNode(navTree, null);
    return { navs, urls };
  }
}



