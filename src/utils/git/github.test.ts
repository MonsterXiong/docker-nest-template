import GitHub from './GitHub';

const TOKEN = 'new token';
/**
 * GitHub API使用示例
 */
async function testGitHub(token: string): Promise<void> {
  try {
    // 创建GitHub实例 (使用你的个人访问令牌)
    // 注意: 实际应用中应从环境变量或配置文件中读取令牌
    const github = new GitHub(token);

    // 获取当前用户信息
    console.log('=== 获取用户信息 ===');
    const user = await github.getUser();
    console.log(`用户名: ${user.login}`);
    console.log(`用户ID: ${user.id}`);
    console.log(`姓名: ${user.name || '未设置'}`);
    console.log(`邮箱: ${user.email || '未公开'}`);

    // 获取用户所属组织
    console.log('\n=== 获取组织列表 ===');
    const orgs = await github.getOrg();
    if (orgs.length === 0) {
      console.log('未找到任何组织');
    } else {
      orgs.forEach((org: any) => {
        console.log(`组织名: ${org.login}`);
      });
    }

    // 创建组织仓库
    console.log('\n=== 创建组织仓库 ===');
    const orgRepo = await github.createOrgRepo(
      'test-org-repo' + Date.now(),
      'monster-collection',
    );
    console.log(`创建成功: ${orgRepo.name}`);
    console.log(`仓库地址: ${orgRepo.html_url}`);
    console.log(
      `Git地址: ${github.getRemote('monster-collection', orgRepo.name)}`,
    );

    // 删除组织仓库
    console.log('\n=== 删除组织仓库 ===');
    await github.delRepo('monster-collection', orgRepo.name);
    console.log(`删除成功: ${orgRepo.name}`);

    // 获取特定仓库信息
    console.log('\n=== 获取仓库信息 ===');
    const repo = await github.getRepo('octocat', 'Hello-World');
    console.log(`仓库名: ${repo.name}`);
    console.log(`描述: ${repo.description || '无描述'}`);
    console.log(`Star数: ${repo.stargazers_count}`);
    console.log(`Fork数: ${repo.forks_count}`);

    // 创建新的个人仓库
    console.log('\n=== 创建个人仓库 ===');
    const newRepo = await github.createRepo('test-repo-' + Date.now());
    console.log(`创建成功: ${newRepo.name}`);
    console.log(`仓库地址: ${newRepo.html_url}`);
    console.log(`克隆地址: ${github.getRemote(user.login, newRepo.name)}`);

    // 删除个人仓库
    console.log('\n=== 删除个人仓库 ===');
    await github.delRepo(user.login, newRepo.name);
    console.log(`删除成功: ${newRepo.name}`);

    // 打印令牌获取地址
    console.log('\n=== 获取令牌信息 ===');
    console.log(`获取令牌地址: ${github.getTokenUrl()}`);
    console.log(`令牌帮助文档: ${github.getTokenHelpUrl()}`);
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

/**
 * 运行示例代码
 *
 * 使用方法:
 * 1. 替换上面的'your-personal-access-token'为你的GitHub个人访问令牌
 * 2. 运行此文件: ts-node test.ts
 *
 * 获取GitHub令牌:
 * 1. 访问 https://github.com/settings/tokens
 * 2. 点击 "Generate new token"
 * 3. 至少选择以下权限:
 *    - repo (所有)
 *    - read:org
 *    - read:user
 */

// 示例：使用GitHubAPI创建组织仓库
async function createOrgRepositoryExample(token: string): Promise<void> {
  const github = new GitHub(token);
  const orgName = 'monster-collection';
  const repoName = 'test-org-repo';

  try {
    // 创建组织仓库
    const newRepo = await github.createOrgRepo(repoName, orgName);

    console.log(`在组织${orgName}下创建仓库成功: ${newRepo.name}`);
    console.log(`仓库地址: ${newRepo.html_url}`);
    console.log(`Git地址: ${github.getRemote(orgName, repoName)}`);
  } catch (error) {
    console.error('创建组织仓库失败:', error);
  }
}

// 更清晰的错误处理示例
async function simpleErrorTest() {
  const githubNoToken = new GitHub();

  try {
    const user = await githubNoToken.getUser();
    console.log('成功获取用户:', user);
  } catch (err) {
    console.error('错误信息:', err.message);
  }
}

// 运行测试

testGitHub(TOKEN).catch(console.error);
// createOrgRepositoryExample(TOKEN).catch(console.error);
// simpleErrorTest();
