/**
 * 抛出未实现方法的错误
 * @param methodName 方法名称
 */
function error(methodName: string): never {
  throw new Error(`必须实现${methodName}方法`);
}

/**
 * Git服务类型
 */
export type GitServiceType = 'github' | 'gitee' | 'gitlab';

/**
 * Git服务初始化选项
 */
export interface GitServiceOptions {
  /** 自定义API基础URL（主要用于自托管GitLab） */
  baseURL?: string;
}

/**
 * Git服务器抽象基类
 * 定义了Git服务器公共接口
 */
export default abstract class GitServer {
  /** Git服务类型 */
  protected type: GitServiceType;
  /** 访问令牌 */
  protected token: string;

  /**
   * 构造函数
   * @param type Git服务类型
   * @param token 访问令牌
   */
  constructor(type: GitServiceType, token?: string) {
    this.type = type;
    this.token = token || '';
  }

  /**
   * 设置访问令牌
   * @param token 访问令牌
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * 创建个人仓库
   * @param name 仓库名称
   */
  createRepo(_name: string): Promise<any> {
    error('createRepo');
  }

  /**
   * 创建组织仓库
   * @param name 仓库名称
   * @param orgName 组织名称
   */
  createOrgRepo(_name: string, _orgName: string): Promise<any> {
    error('createOrgRepo');
  }

  /**
   * 获取仓库远程地址
   * @param login 用户名/组织名
   * @param name 仓库名
   */
  getRemote(_login: string, _name: string): string {
    error('getRemote');
  }

  /**
   * 获取用户信息
   */
  getUser(): Promise<any> {
    error('getUser');
  }

  /**
   * 获取组织信息
   * @param username 用户名(可选，部分实现需要)
   */
  getOrg(_username?: string): Promise<any> {
    error('getOrg');
  }

  /**
   * 获取仓库信息
   * @param login 用户名/组织名
   * @param name 仓库名
   */
  getRepo(_login: string, _name: string): Promise<any> {
    error('getRepo');
  }

  /**
   * 删除仓库
   * @param login 用户名/组织名
   * @param name 仓库名
   */
  delRepo(_login: string, _name: string): Promise<any> {
    error('delRepo');
  }
  /**
   * 获取令牌URL
   */
  getTokenUrl(): string {
    error('getTokenUrl');
  }

  /**
   * 获取令牌帮助URL
   */
  getTokenHelpUrl(): string {
    error('getTokenHelpUrl');
  }

  /**
   * 检查响应是否为HTTP响应
   * @param response 响应对象
   */
  protected isHttpResponse = (response: any): boolean => {
    return response && typeof response.status !== 'undefined';
  };

  /**
   * 处理响应
   * @param response 响应对象
   */
  protected handleResponse = (response: any): any => {
    if (this.isHttpResponse(response) && response.status !== 200) {
      return null;
    } else {
      return response;
    }
  };
}
