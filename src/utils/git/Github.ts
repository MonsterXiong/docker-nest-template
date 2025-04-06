import GitServer from './GitServer';
import GitRequest from './GitRequest';

/**
 * GitHub服务实现类
 */
export default class GitHub extends GitServer {
  /** API请求实例 */
  private request: GitRequest | null;
  /** API基础URL */
  private static readonly BASE_URL = 'https://api.github.com';

  private headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Enterprise-Version': '2022-11-28',
    Authorization: `Bearer ${this.token}`,
  };

  /**
   * 构造函数
   * @param token 访问令牌（可选）
   */
  constructor(token?: string) {
    super('github', token);
    this.request = token ? new GitRequest(GitHub.BASE_URL, token) : null;
  }

  /**
   * 设置访问令牌
   * @param token 访问令牌
   */
  setToken(token: string): void {
    super.setToken(token);
    this.request = new GitRequest(GitHub.BASE_URL, token);
  }

  /**
   * 获取用户信息
   * @returns Promise<any> 用户信息
   */
  getUser(): Promise<any> {
    if (!this.request) throw new Error('令牌未设置');
    return this.request.get('/user', null, this.headers);
  }

  /**
   * 获取组织信息
   * @param _username 用户名(未使用，保持与基类接口一致)
   * @returns Promise<any> 组织列表
   */
  getOrg(_username?: string): Promise<any> {
    if (!this.request) throw new Error('令牌未设置');
    return this.request.get(
      '/user/orgs',
      {
        page: 1,
        per_page: 100,
      },
      this.headers,
    );
  }

  /**
   * 获取仓库信息
   * @param login 仓库所有者
   * @param name 仓库名称
   * @returns Promise<any> 仓库信息
   */
  getRepo(login: string, name: string): Promise<any> {
    if (!this.request) throw new Error('令牌未设置');
    return this.request
      .get(`/repos/${login}/${name}`, null, this.headers)
      .then(this.handleResponse);
  }

  /**
   * 删除仓库
   * @param login 用户名/组织名
   * @param name 仓库名
   */
  delRepo(login: string, name: string): Promise<any> {
    if (!this.request) throw new Error('令牌未设置');
    return this.request.delete(`/repos/${login}/${name}`, null, this.headers);
  }
  /**
   * 创建个人仓库
   * @param name 仓库名称
   * @returns Promise<any> 创建结果
   */
  createRepo(name: string): Promise<any> {
    if (!this.request) throw new Error('令牌未设置');
    return this.request.post(
      '/user/repos',
      {
        name,
      },
      this.headers,
    );
  }
  /**
   * 创建组织仓库
   * @param name 仓库名称
   * @param orgName 组织名称
   * @returns Promise<any> 创建结果
   */
  createOrgRepo(name: string, orgName: string): Promise<any> {
    if (!this.request) throw new Error('令牌未设置');
    return this.request.post(
      `/orgs/${orgName}/repos`,
      {
        name,
      },
      this.headers,
    );
  }

  /**
   * 获取令牌URL
   * @returns string 令牌URL
   */
  getTokenUrl(): string {
    return 'https://github.com/settings/tokens';
  }

  /**
   * 获取令牌帮助URL
   * @returns string 令牌帮助URL
   */
  getTokenHelpUrl(): string {
    return 'https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh';
  }

  /**
   * 获取仓库远程地址
   * @param login 用户名/组织名
   * @param name 仓库名
   * @returns string 仓库远程地址
   */
  getRemote(login: string, name: string): string {
    return `git@github.com:${login}/${name}.git`;
  }
}
