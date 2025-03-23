import { GIT_BASE_PREFIX, GIT_VISIBILITY_DEFAULT, GROUP_ID } from "./config";
import { GITLAB_API } from "./gitApi";

/**
 * Git项目类型枚举
 */
enum GitProjectType {
  FRONTEND = 'fe',
  BACKEND = 'be',
  BACKEND_BASE = 'base_be',
}

/**
 * GitLab项目DTO字段枚举
 */
enum GitlabProjectDto {
  URL = 'url',
  ID = 'id',
  EMPTY = 'empty',
}

/**
 * 基础Git项目接口
 */
interface BaseGitProject {
  name: string;
  type: string;
  ext: string;
  avatarUrl: string;
}

/**
 * 项目信息接口
 */
interface ProjectInfo {
  id: string;
  name: string;
  fullName?: string | null;
  syncId?: string | null;
  code: string;
  description?: string | null;
  bindProjectType?: string;
  bindUnit?: string;
  unitName?: string;
  unitCode?: string;
  children?: ProjectChild[];
  projectInfo?: ProjectDetailsInfo;
}

/**
 * 项目详细信息接口
 */
interface ProjectDetailsInfo {
  id: string;
  name?: string | null;
  fullName?: string | null;
  syncId?: string | null;
  code?: string | null;
  description?: string | null;
  bindProject: string;
  dbHost: string;
  dbUser: string;
  dbPassword: string;
  dbPort: string;
  dbName: string;
  gitUrl?: string | null;
  jenkins?: string | null;
  apiPrefix?: string | null;
  outputDir?: string | null;
  bindFramework?: string | null;
  port?: string | null;
}

/**
 * 项目子项接口
 */
interface ProjectChild {
  id: string;
  name: string;
  fullName?: string | null;
  syncId?: string | null;
  code: string;
  description?: string | null;
  bindProjectType: string;
  bindUnit: string;
  unitName: string;
  unitCode: string;
  projectInfo: ProjectDetailsInfo;
  gitUrl?: string;
  type?: string;
}

/**
 * 子群组信息接口
 */
interface SubGroupInfo {
  name: string;
  path: string;
  visibility: string;
  parentId: string | number;
  description: string;
  id?: number;
}

/**
 * Git项目信息接口
 */
interface GitProjectInfo {
  name: string;
  path: string;
  type: string;
  avatarUrl: string;
  code: string;
  projectCode: string;
  description: string;
  visibility: string;
  namespaceId?: number;
}

/**
 * Git项目结果接口
 */
interface GitProjectResult {
  [key: string]: {
    url: string;
    id: number;
  };
}

/**
 * GitLab项目接口
 */
interface GitlabProject {
  id: number;
  name: string;
  path: string;
  httpUrlToRepo: string;
  description?: string;
}

/**
 * 定义基础Git项目模板
 */
const baseGitProjects: BaseGitProject[] = [
  {
    name: '【fe】视图模块',
    type: GitProjectType.FRONTEND,
    ext: '.view.fe',
    avatarUrl: '/uploads/-/system/project/avatar/538/fe.png',
  },
  {
    name: '【be】启动模块',
    type: GitProjectType.BACKEND,
    ext: '.boot.be',
    avatarUrl: '/uploads/-/system/project/avatar/536/be.png',
  },
  {
    name: '【be】基础模块',
    type: GitProjectType.BACKEND_BASE,
    ext: '.base.be',
    avatarUrl: '/uploads/-/system/project/avatar/537/be.png',
  },
];

/**
 * 子群组服务类 - 处理与子群组相关的操作
 */
class SubgroupService {
  /**
   * 获取群组名称
   * @param projectInfo - 项目信息
   * @returns 群组名称
   */
  public createGroupName(projectInfo: ProjectInfo): string {
    const { name, unitName } = projectInfo;
    return unitName ? `${unitName}_${name}` : name;
  }

  /**
   * 获取群组URL
   * @param projectInfo - 项目信息
   * @returns 群组URL
   */
  public buildGroupUrl(projectInfo: ProjectInfo): string {
    const { code, unitCode } = projectInfo;
    const relativePath = unitCode ? `${unitCode}.${code}` : code;
    return GIT_BASE_PREFIX + relativePath;
  }

  /**
   * 创建子群组信息对象
   * @param projectInfo - 项目信息
   * @returns 子群组信息
   */
  public createSubGroupInfo(projectInfo: ProjectInfo): SubGroupInfo {
    return {
      name: this.createGroupName(projectInfo),
      path: this.buildGroupUrl(projectInfo),
      visibility: GIT_VISIBILITY_DEFAULT,
      parentId: GROUP_ID,
      description: projectInfo.description || '',
    };
  }

  /**
   * 获取或创建子群组
   * @param subGroupInfo - 子群组信息
   * @returns 子群组ID
   */
  public async getOrCreateSubgroup(subGroupInfo: SubGroupInfo): Promise<number> {
    const subgroups = await GITLAB_API.getSubgroups(GROUP_ID);
    let subgroup = subgroups.find((item) => subGroupInfo.name === item.name);
    
    if (!subgroup) {
      subgroup = await GITLAB_API.createSubGroupAPI({
        ...subGroupInfo,
        parent_id: subGroupInfo.parentId,
      });
    }
    
    return subgroup.id;
  }
}

/**
 * Git项目服务类 - 处理与Git项目相关的操作
 */
class GitProjectService {
  private subgroupService: SubgroupService;

  constructor() {
    this.subgroupService = new SubgroupService();
  }

  /**
   * 创建Git路径
   * @param path - 基础路径
   * @param ext - 扩展名
   * @returns Git路径
   */
  public buildGitPath(path: string, ext: string): string {
    return `${path}${ext}`;
  }

  /**
   * 创建项目列表
   * @param subGroupInfo - 子群组信息
   * @param projectInfo - 项目信息
   * @returns 项目列表
   */
  public createProjectList(subGroupInfo: SubGroupInfo, projectInfo: ProjectInfo): GitProjectInfo[] {
    const { path, description } = subGroupInfo;
    const commonParams = {
      description,
      visibility: GIT_VISIBILITY_DEFAULT,
    };
    
    // 创建基础项目
    const projectList: GitProjectInfo[] = baseGitProjects.map((item) => {
      return {
        name: item.name,
        path: this.buildGitPath(path, item.ext),
        type: item.type,
        avatarUrl: item.avatarUrl,
        code: item.type,
        projectCode: projectInfo.code,
        ...commonParams,
      };
    });
    
    // 为每个子项目创建前端模块
    if (projectInfo?.children?.length) {
      projectInfo.children.forEach((childItem) => {
        projectList.push({
          name: `【fe】${childItem.name}模块`,
          path: this.buildGitPath(`${path}.${childItem.code}`, '.fe'),
          type: `${childItem.code}_${GitProjectType.FRONTEND}`,
          avatarUrl: '/uploads/-/system/project/avatar/538/fe.png',
          code: childItem.code,
          projectCode: projectInfo.code,
          ...commonParams,
        });
      });
    }
    
    return projectList;
  }

  /**
   * 根据项目信息查找GitLab项目
   * @param projectInfo - Git项目信息
   * @param gitlabProjects - GitLab项目列表
   * @returns 找到的项目或undefined
   */
  public findProjectByInfo(projectInfo: GitProjectInfo, gitlabProjects: GitlabProject[]): GitlabProject | undefined {
    return gitlabProjects.find((project) => {
      if (projectInfo.name === project.name || projectInfo.path === project.path) {
        console.log(`${projectInfo.name}或${projectInfo.path}已存在`);
        return true;
      }
      return false;
    });
  }

  /**
   * 根据Git URL查找项目
   * @param gitUrl - Git URL
   * @param gitlabProjects - GitLab项目列表
   * @returns 找到的项目或undefined
   */
  public findProjectByGitUrl(gitUrl: string, gitlabProjects: GitlabProject[]): GitlabProject | undefined {
    return gitlabProjects.find((project) => project.httpUrlToRepo === gitUrl);
  }

  /**
   * 找出已存在的项目
   * @param projectInfos - 项目信息列表
   * @param gitlabProjects - GitLab项目列表
   * @returns 找到的项目列表
   */
  public findExistingProjects(projectInfos: GitProjectInfo[], gitlabProjects: GitlabProject[]): GitlabProject[] {
    return projectInfos.reduce<GitlabProject[]>((existingProjects, currentProject) => {
      const project = this.findProjectByInfo(currentProject, gitlabProjects);
      if (project) {
        existingProjects.push(project);
      }
      return existingProjects;
    }, []);
  }

  /**
   * 从项目列表中分离出已存在和需要创建的项目
   * @param projectInfos - 项目信息列表
   * @param existingProjects - 已存在的项目列表
   * @returns 需要创建的项目和已存在项目的Git信息
   */
  public separateProjects(projectInfos: GitProjectInfo[], existingProjects: GitlabProject[]): { 
    projectsToCreate: GitProjectInfo[], 
    existingProjectsMap: Record<string, any> 
  } {
    const projectsToCreate: GitProjectInfo[] = [];
    const existingProjectsMap: Record<string, any> = {};
    
    projectInfos.forEach((project) => {
      const existingProject = existingProjects.find((item) => item.name === project.name);
      
      if (existingProject) {
        const { httpUrlToRepo, id } = existingProject;
        existingProjectsMap[project.type] = {
          ...project,
          [GitlabProjectDto.URL]: httpUrlToRepo,
          [GitlabProjectDto.ID]: id,
        };
      } else {
        projectsToCreate.push(project);
      }
    });
    
    return { projectsToCreate, existingProjectsMap };
  }

  /**
   * 创建Git项目
   * @param projectInfos - 项目信息列表
   * @param namespaceId - 命名空间ID
   * @returns 创建的项目信息
   */
  public async createProjects(projectInfos: GitProjectInfo[], namespaceId: number): Promise<Record<string, any>> {
    const createdProjectsMap: Record<string, any> = {};
    
    for await (const project of projectInfos) {
      const createdProject = await GITLAB_API.createProject({
        ...project,
        namespace_id: namespaceId,
        avatar_url: project.avatarUrl,
      });
      
      createdProjectsMap[project.type] = {
        [GitlabProjectDto.URL]: createdProject.http_url_to_repo,
        [GitlabProjectDto.ID]: createdProject.id,
      };
    }
    
    return createdProjectsMap;
  }

  /**
   * 匹配项目和Git URL
   * @param projectInfo - 项目信息
   * @param gitlabProjects - GitLab项目列表
   * @returns Git项目结果
   */
  public matchProjectGitUrl(projectInfo: ProjectInfo, gitlabProjects: GitlabProject[]): GitProjectResult {
    return (projectInfo.children || []).reduce<GitProjectResult>((resultMap, currentChild) => {
      const { gitUrl, type } = currentChild;
      if (gitUrl && type) {
        const project = this.findProjectByGitUrl(gitUrl, gitlabProjects);
        resultMap[type] = {
          url: gitUrl,
          id: project?.id || 0,
        };
      }
      return resultMap;
    }, {});
  }

  /**
   * 获取项目的Git信息
   * @param projectInfo - 项目信息
   * @returns 子群组信息和项目列表
   */
  public prepareGitInfo(projectInfo: ProjectInfo): { 
    subGroupInfo: SubGroupInfo, 
    projectList: GitProjectInfo[] 
  } {
    const subGroupInfo = this.subgroupService.createSubGroupInfo(projectInfo);
    const projectList = this.createProjectList(subGroupInfo, projectInfo);
    
    return { subGroupInfo, projectList };
  }
}

/**
 * 自动部署服务类 - 主要处理自动部署流程
 */
class AutoDeployService {
  private gitProjectService: GitProjectService;
  private subgroupService: SubgroupService;

  constructor() {
    this.gitProjectService = new GitProjectService();
    this.subgroupService = new SubgroupService();
  }

  /**
   * 处理Git项目创建和获取
   * @param project - 项目信息
   * @returns Git项目结果
   */
  public async deployGitProject(project: ProjectInfo): Promise<GitProjectResult> {
    console.log(project);
    
    // TODO: 这里是测试数据，应从实际项目中获取
    const projectInfo: ProjectInfo = this.prepareProjectInfo(project);

    // 获取Git信息
    const { subGroupInfo, projectList } = this.gitProjectService.prepareGitInfo(projectInfo);
    
    // 获取或创建子群组
    const namespaceId = await this.subgroupService.getOrCreateSubgroup(subGroupInfo);
    
    // 获取子群组下的所有项目
    const gitlabProjects = await GITLAB_API.getProjectListBySubgroups(namespaceId);

    // 检查是否所有子项目都已有Git URL
    const hasAllGitUrls = this.checkAllProjectsHaveGitUrl(projectInfo);
    
    // 如果所有项目都已有Git URL，直接匹配并返回
    if (hasAllGitUrls) {
      return this.gitProjectService.matchProjectGitUrl(projectInfo, gitlabProjects);
    }

    // 处理已存在和需要创建的项目
    return await this.processProjects(projectList, gitlabProjects, namespaceId);
  }

  /**
   * 准备项目信息（处理测试数据）
   * @param project - 原始项目信息
   * @returns 处理后的项目信息
   */
  private prepareProjectInfo(project: ProjectInfo): ProjectInfo {
    // 示例数据，实际应用中应该从参数获取
    return {
      ...project,
      children: [
        {
          id: '1',
          name: '需求开发',
          fullName: null,
          syncId: null,
          code: 'xqkf',
          description: null,
          bindProjectType: 'project',
          bindUnit: '2',
          unitName: '长沙科大4院',
          unitCode: 'cskd4y',
          projectInfo: {
            id: '1',
            name: null,
            fullName: null,
            syncId: null,
            code: null,
            description: null,
            bindProject: '1',
            dbHost: '192.168.2.231',
            dbUser: 'root',
            dbPassword: '123456',
            dbPort: '3306',
            dbName: 'development_platform',
            gitUrl: null,
            jenkins: null,
            apiPrefix: null,
            outputDir: null,
            bindFramework: null,
            port: null,
          },
        },
      ],
    };
  }

  /**
   * 检查所有项目是否都已有Git URL
   * @param projectInfo - 项目信息
   * @returns 是否所有项目都有Git URL
   */
  private checkAllProjectsHaveGitUrl(projectInfo: ProjectInfo): boolean {
    return projectInfo.children?.every((item) => item.gitUrl) ?? false;
  }

  /**
   * 处理项目创建流程
   * @param projectList - 项目信息列表
   * @param gitlabProjects - GitLab项目列表
   * @param namespaceId - 命名空间ID
   * @returns Git项目结果
   */
  private async processProjects(
    projectList: GitProjectInfo[], 
    gitlabProjects: GitlabProject[], 
    namespaceId: number
  ): Promise<GitProjectResult> {
    // 查找已存在的项目
    const existingProjects = this.gitProjectService.findExistingProjects(projectList, gitlabProjects);
    
    // 分离需要创建和已存在的项目
    const { projectsToCreate, existingProjectsMap } = this.gitProjectService.separateProjects(
      projectList, 
      existingProjects
    );
    
    console.log('已存在的项目:', existingProjectsMap);
    console.log('需要创建的项目:', projectsToCreate);
    
    // 创建需要的项目
    if (projectsToCreate.length > 0) {
      const createdProjectsMap = await this.gitProjectService.createProjects(projectsToCreate, namespaceId);
      return { ...existingProjectsMap, ...createdProjectsMap };
    }
    
    return existingProjectsMap;
  }
}

// 导出处理Git的主函数
export async function handleGit(project: ProjectInfo): Promise<GitProjectResult> {
  const autoDeployService = new AutoDeployService();
  return await autoDeployService.deployGitProject(project);
}