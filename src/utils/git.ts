import simpleGit from 'simple-git';
import fse from 'fs-extra';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { GITLAB_API } from './gitApi';
import { GITLAB_PROJECT_DTO, USER_INFO } from './config';
const GIT_PROJECT_CONFIG = {
  LOCAL_PATH: 'C:/Users/Administrator/.monster', //本地临时存储拉取项目的地址
  GIT_SOURCE:
    'http://192.168.2.199:8081/common/basefe/com.framework.txsjgj.fe.git', //所应用的基础框架git地址
  COMMIT_DEFAULT: 'Initial commit',
  BRANCES_DEFAULT: 'master',
  FOLDER_NAME: 'framework',
};

const BASE_DIR = path.join(os.homedir(), '.monster_dp');
fse.ensureDirSync(BASE_DIR);
const FRAMEWORK_DIR = path.join(BASE_DIR, 'com.framework.txsjgj.fe');

function isFe(key) {
  return key.endsWith('fe');
}

function getGit(baseDir) {
  const git = simpleGit({ baseDir });
  git.addConfig('user.name', USER_INFO.NAME);
  git.addConfig('user.email', USER_INFO.EMAIL);
  return git;
}

export async function handleCode(gitUrl) {
  console.time('start');
  //判断项目是否为空项目
  const projectList = await findEmptyProject(gitUrl);
  //   确保框架数据最新
  if (!fse.pathExistsSync(FRAMEWORK_DIR)) {
    await getGit(BASE_DIR).clone(GIT_PROJECT_CONFIG.GIT_SOURCE);
  } else {
    await getGit(FRAMEWORK_DIR).pull();
  }

  for await (let key of Object.keys(projectList)) {
    const projectData = projectList[key];
    const baseProjectDir = path.join(BASE_DIR, projectData.projectCode);
    await fse.ensureDirSync(baseProjectDir);
    const projectDir = path.join(baseProjectDir, projectData.code);
    if (isFe(key)) {
      if (projectList[key][GITLAB_PROJECT_DTO.EMPTY]) {
        fse.copySync(FRAMEWORK_DIR, projectDir);
        // 删除.git文件
        rmDir(path.join(projectDir, '.git'));
        const Git = getGit(`${projectDir}`);
        //删除.git文件
        //初始化本地git
        await Git.init();
        console.log('git初始化成功');
        await Git.addRemote('origin', projectList[key][GITLAB_PROJECT_DTO.URL]);
        // 从这里开始添加数据
        await Git.add('./*');
        await Git.commit(GIT_PROJECT_CONFIG.COMMIT_DEFAULT);
        console.log(`commit: ${GIT_PROJECT_CONFIG.COMMIT_DEFAULT}`);
        await Git.push('origin', GIT_PROJECT_CONFIG.BRANCES_DEFAULT);
        console.log(
          `代码已推送到远程仓库${GIT_PROJECT_CONFIG.BRANCES_DEFAULT}分支`,
        );
        rmDir(projectDir);
      }
    }
  }
  console.timeEnd('start');
}

async function findEmptyProject(gitUrls) {
  let projectInfo = gitUrls;
  for await (let key of Object.keys(gitUrls)) {
    const { data } = await GITLAB_API.getCommits(
      gitUrls[key][GITLAB_PROJECT_DTO.ID],
    );
    projectInfo[key][GITLAB_PROJECT_DTO.EMPTY] =
      data?.length > 0 ? false : true;
  }
  return projectInfo;
}

function rmDir(dir) {
  try {
    fs.rmSync(`${dir}`, { recursive: true });
    console.log('文件夹删除成功');
  } catch {
    console.log('文件夹删除失败');
  }
}
