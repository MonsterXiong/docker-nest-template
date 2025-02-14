import { GIT_BASE_PREFIX, GIT_VISIBILITY_DEFAULT, GROUP_ID } from "./config";
import { GITLAB_API } from "./gitApi";



const GIT_PROJECT_TYPE = {
  FRONTEND: 'fe',
  BACKEND: 'be',
  BACKEND_BASE: 'base_be',
};

const GITLAB_PROJECT_DTO = {
  URL: 'url',
  ID: 'id',
  EMPTY: 'empty',
};

const baseGitProject = [
  {
    name: '【fe】视图模块',
    type: GIT_PROJECT_TYPE.FRONTEND,
    ext: '.view.fe',
    avatar_url: '/uploads/-/system/project/avatar/538/fe.png',
  },
  {
    name: '【be】启动模块',
    type: GIT_PROJECT_TYPE.BACKEND,
    ext: '.boot.be',
    avatar_url: '/uploads/-/system/project/avatar/536/be.png',
  },
  {
    name: '【be】基础模块',
    type: GIT_PROJECT_TYPE.BACKEND_BASE,
    ext: '.base.be',
    avatar_url: '/uploads/-/system/project/avatar/537/be.png',
  },
];

export async function handleGit(project) {
  // 需要调整，看projectInfo有没有children，有children，则前端就是children的文件夹
  console.log(project);
  const projectInfo = {
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
  // 根据项目信息得到gitInfo
  const { subGroupInfo, children } = getGitInfo(projectInfo);
  // 根据子群组信息获取namespace_id
  const namespaceId = await getIdBySubgroup(subGroupInfo);
  // 查询子群组下的所有项目
  const projectList = await GITLAB_API.getProjectListBySubgroups(namespaceId);

  const isExeGitCreate = projectInfo.children.every((item) => item.gitUrl);
  //   如果都有值，则获取到url即可，即不进行git操作
  if (isExeGitCreate) {
    return matchProjectGitUrl(projectInfo, projectList);
  }

  // 找到已存在的项目
  const findedProjects = findProjects(children, projectList);
  // 将已存在的项目git地址放到返回值中,并从children中剔除
  const { childList, gitUrl } = deleteChild(children, findedProjects);
  
  const result = gitUrl;
  console.log(gitUrl,childList);
  // 创建项目并获取gitUrl
  if (childList.length) {
    for await (let child of childList) {
      let projectItemInfo = await GITLAB_API.createProject({
        ...child,
        namespace_id: namespaceId,
      });
      result[child.type] = {
        [GITLAB_PROJECT_DTO.URL]: projectItemInfo.http_url_to_repo,
        [GITLAB_PROJECT_DTO.ID]: projectItemInfo.id,
      };
    }
  }
  return result;
}
function findProjects(children, projectList) {
  return children.reduce((pre, cur) => {
    const project = findProjectInfoByItem(cur, projectList);
    if (project) {
      pre.push(project);
    }
    return pre;
  }, []);
}
function findProjectInfoByItem(item, projectList) {
  return projectList.find((project) => {
    if (item.name === project.name || item.path === project.path) {
      console.log(`${item.name}或${item.path}已存在`);
      return project;
    }
  });
}

function deleteChild(children, findedProjects) {
  const childList = children;
  const result = [];
  const gitUrl = {};
  childList.forEach((child) => {
    const index = findedProjects.findIndex((item) => item.name === child.name);
    if (index !== -1) {
      const { http_url_to_repo, id } = findedProjects[index];
      gitUrl[child.type] = {
        ...child,
        [GITLAB_PROJECT_DTO.URL]: http_url_to_repo,
        [GITLAB_PROJECT_DTO.ID]: id,
      };
    } else {
      result.push(child);
    }
  });
  return { childList: result, gitUrl };
}

function findProjectInfoByGitUrl(url, projectList) {
  return projectList.find((item) => item.http_url_to_repo === url);
}

function getGitInfo(projectInfo) {
  // 子群组信息
  const subGroupInfo = {
    name: _getGroupName(projectInfo),
    path: _getGroupUrl(projectInfo),
    visibility: GIT_VISIBILITY_DEFAULT,
    parent_id: GROUP_ID,
    description: projectInfo.description || '',
  };
  return {
    subGroupInfo,
    children: _getCurrentProjectList(subGroupInfo, projectInfo),
  };
}

function _getGroupName(projectInfo) {
  const { name, unitName } = projectInfo;
  return unitName ? `${unitName}_${name}` : name;
}

function _getGroupUrl(projectInfo) {
  const { code, unitCode } = projectInfo;
  const relativePath = unitCode ? `${unitCode}.${code}` : code;
  return GIT_BASE_PREFIX + relativePath;
}

// 子群组下的git项目信息
function _getCurrentProjectList(subGroupInfo, projectInfo) {
  const { path, description } = subGroupInfo;
  const param = {
    description,
    visibility: GIT_VISIBILITY_DEFAULT,
  };
  const result = baseGitProject.map((item) => {
    return {
      name: item.name,
      path: _getGitPath(path, item.ext),
      type: item.type,
      avatar_url: item.avatar_url,
      code:item.type,
      projectCode:projectInfo.code,
      ...param,
    };
  });
  if (projectInfo?.children?.length) {
    projectInfo.children.forEach((childItem) => {
      result.push({
        name: `【fe】${childItem.name}模块`,
        path: _getGitPath(`${path}.${childItem.code}`, '.fe'),
        type: `${childItem.code}_${GIT_PROJECT_TYPE.FRONTEND}`,
        avatar_url: '/uploads/-/system/project/avatar/538/fe.png',
        code:childItem.code,
        projectCode:projectInfo.code,
        ...param,
      });
    });
  }
  return result;
}

function _getGitPath(path, ext) {
  return `${path}${ext}`;
}

//  根据subGroupsInfo获取子群组的id
async function getIdBySubgroup(subGroupInfo) {
  const subgroups = await GITLAB_API.getSubgroups(GROUP_ID);
  let subgroup = subgroups.find((item) => subGroupInfo.name === item.name);
  if (!subgroup) {
    subgroup = await GITLAB_API.createSubGroupAPI(subGroupInfo);
  }
  return subgroup.id;
}

// 将projectInfo.children中的数据和git比对
function matchProjectGitUrl(projectInfo, projectList) {
  return projectInfo.children.reduce((pre, cur) => {
    const { gitUrl } = cur;
    pre[cur.type] = {
      url: gitUrl,
      id: findProjectInfoByGitUrl(gitUrl, projectList)?.id,
    };
    return pre;
  }, {});
}
