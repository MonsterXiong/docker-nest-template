import GitServer from './GitServer';
import GitRequest from './GitRequest';

/**
 * GitLab服务实现类
 */
export default class GitLab extends GitServer {
  /** API请求实例 */
  private request: GitRequest | null;
  /** API基础URL */
  private baseURL: string;
  /** 默认API基础URL */
  private static readonly DEFAULT_BASE_URL = 'https://gitlab.com/api/v4';

  /**
   * 构造函数
   * @param token 访问令牌（可选）
   * @param baseURL 自定义API基础URL（可选，用于自托管GitLab实例）
   */
  constructor(token?: string, baseURL?: string) {
    super('gitlab', token);
    this.baseURL = baseURL || GitLab.DEFAULT_BASE_URL;
    this.request = token ? new GitRequest(this.baseURL, token) : null;
  }

  /**
   * 设置访问令牌
   * @param token 访问令牌
   */
  setToken(token: string): void {
    super.setToken(token);
    this.request = new GitRequest(this.baseURL, token);
  }

  /**
   * 设置自定义API基础URL（用于自托管GitLab实例）
   * @param url 自定义API基础URL
   */
  setBaseURL(url: string): void {
    this.baseURL = url;
    if (this.token) {
      this.request = new GitRequest(this.baseURL, this.token);
    }
  }

  /**
   * 获取用户信息
   * @returns Promise<any> 用户信息
   */
  getUser(): Promise<any> {
    if (!this.request) throw new Error('令牌未设置');
    return this.request.get('/user');
  }

  /**
   * 获取组织（群组）信息
   * @param _username 用户名(未使用，保持与基类接口一致)
   * @returns Promise<any> 组织列表
   */
  getOrg(_username?: string): Promise<any> {
    if (!this.request) throw new Error('令牌未设置');
    return this.request.get('/groups', {
      min_access_level: 30, // Developer access level or higher
      top_level_only: true,
      per_page: 100,
    });
  }

  /**
   * 获取仓库信息
   * @param login 仓库所有者（用户名或群组名）
   * @param name 仓库名称
   * @returns Promise<any> 仓库信息
   */
  getRepo(login: string, name: string): Promise<any> {
    if (!this.request) throw new Error('令牌未设置');
    // GitLab API 需要编码路径
    const encodedPath = encodeURIComponent(`${login}/${name}`);
    return this.request
      .get(`/projects/${encodedPath}`)
      .then(this.handleResponse);
  }

  /**
   * 创建个人仓库
   * @param name 仓库名称
   * @returns Promise<any> 创建结果
   */
  createRepo(name: string): Promise<any> {
    if (!this.request) throw new Error('令牌未设置');
    return this.request.post('/projects', {
      name,
      visibility: 'private',
    });
  }

  /**
   * 创建组织（群组）仓库
   * @param name 仓库名称
   * @param orgName 组织名称
   * @returns Promise<any> 创建结果
   */
  createOrgRepo(name: string, orgName: string): Promise<any> {
    if (!this.request) throw new Error('令牌未设置');
    return this.request.post('/projects', {
      name,
      namespace_id: orgName, // 需要提供群组ID而不是名称
      visibility: 'private',
    });
  }

  /**
   * 获取令牌URL
   * @returns string 令牌URL
   */
  getTokenUrl(): string {
    return this.baseURL === GitLab.DEFAULT_BASE_URL
      ? 'https://gitlab.com/-/profile/personal_access_tokens'
      : `${this.baseURL.replace('/api/v4', '')}/-/profile/personal_access_tokens`;
  }

  /**
   * 获取令牌帮助URL
   * @returns string 令牌帮助URL
   */
  getTokenHelpUrl(): string {
    return 'https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html';
  }

  /**
   * 获取仓库远程地址
   * @param login 用户名/组织名
   * @param name 仓库名
   * @returns string 仓库远程地址
   */
  getRemote(login: string, name: string): string {
    const domain =
      this.baseURL === GitLab.DEFAULT_BASE_URL
        ? 'gitlab.com'
        : new URL(this.baseURL).hostname;
    return `git@${domain}:${login}/${name}.git`;
  }
}
