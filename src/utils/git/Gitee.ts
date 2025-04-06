import GitServer from './GitServer';
import GitRequest from './GitRequest';

/**
 * Gitee服务实现类
 */
export default class Gitee extends GitServer {
  /** API请求实例 */
  private request: GitRequest | null;
  /** API基础URL */
  private static readonly BASE_URL = 'https://gitee.com/api/v5';

  /**
   * 构造函数
   * @param token 访问令牌（可选）
   */
  constructor(token?: string) {
    super('gitee', token);
    this.request = token ? new GitRequest(Gitee.BASE_URL, token) : null;
  }

  /**
   * 设置访问令牌
   * @param token 访问令牌
   */
  setToken(token: string): void {
    super.setToken(token);
    this.request = new GitRequest(Gitee.BASE_URL, token);
  }

  /**
   * 获取用户信息
   * @returns Promise<any> 用户信息
   */
  getUser(): Promise<any> {
    if (!this.request) throw new Error('令牌未设置');
    return this.request.get('/user').then(this.handleResponse);
  }

  /**
   * 获取组织信息
   * @param username 用户名
   * @returns Promise<any> 组织信息
   */
  getOrg(username: string): Promise<any> {
    if (!this.request) throw new Error('令牌未设置');
    return this.request.get(`/users/${username}/orgs`, {
      page: 1,
      per_page: 100,
    });
  }

  /**
   * 获取仓库信息
   * @param owner 仓库所有者
   * @param repo 仓库名称
   * @returns Promise<any> 仓库信息
   */
  getRepo(owner: string, repo: string): Promise<any> {
    if (!this.request) throw new Error('令牌未设置');
    return this.request
      .get(`/repos/${owner}/${repo}`)
      .then(this.handleResponse);
  }

  /**
   * 创建个人仓库
   * @param name 仓库名称
   * @returns Promise<any> 创建结果
   */
  createRepo(name: string): Promise<any> {
    if (!this.request) throw new Error('令牌未设置');
    return this.request.post('/user/repos', {
      name,
    });
  }

  /**
   * 创建组织仓库
   * @param name 仓库名称
   * @param orgName 组织名称
   * @returns Promise<any> 创建结果
   */
  createOrgRepo(name: string, orgName: string): Promise<any> {
    if (!this.request) throw new Error('令牌未设置');
    return this.request.post(`/orgs/${orgName}/repos`, {
      name,
    });
  }

  /**
   * 获取SSH密钥URL
   * @returns string SSH密钥URL
   */
  getSSHKeysUrl(): string {
    return 'https://gitee.com/profile/sshkeys';
  }

  /**
   * 获取SSH密钥帮助URL
   * @returns string SSH密钥帮助URL
   */
  getSSHKeysHelpUrl(): string {
    return 'https://gitee.com/help/articles/4191';
  }

  /**
   * 获取令牌URL
   * @returns string 令牌URL
   */
  getTokenUrl(): string {
    return 'https://gitee.com/personal_access_tokens';
  }

  /**
   * 获取令牌帮助URL
   * @returns string 令牌帮助URL
   */
  getTokenHelpUrl(): string {
    return 'https://gitee.com/help/articles/4191';
  }

  /**
   * 获取仓库远程地址
   * @param login 用户名/组织名
   * @param name 仓库名
   * @returns string 仓库远程地址
   */
  getRemote(login: string, name: string): string {
    return `git@gitee.com:${login}/${name}.git`;
  }
}
