import GitServer, { GitServiceType, GitServiceOptions } from './GitServer';
import GitHub from './Github';
import Gitee from './Gitee';
import GitLab from './Gitlab';

/**
 * Git服务工厂类
 * 用于创建不同类型的Git服务实例
 */
export default class GitFactory {
  /**
   * 创建Git服务实例
   * @param type Git服务类型
   * @param token 访问令牌（可选）
   * @param options 额外选项（可选）
   * @returns GitServer 创建的Git服务实例
   */
  static createGitService(
    type: GitServiceType,
    token?: string,
    options?: GitServiceOptions,
  ): GitServer {
    switch (type) {
      case 'github':
        return new GitHub(token);
      case 'gitee':
        return new Gitee(token);
      case 'gitlab':
        return new GitLab(token, options?.baseURL);
      default:
        // 使用类型系统确保所有可能的类型都已处理
        const exhaustiveCheck: never = type;
        throw new Error(`不支持的Git服务类型: ${exhaustiveCheck}`);
    }
  }
}
