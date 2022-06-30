import { GIT_BASE_PREFIX, GIT_VISIBILITY_DEFAULT, GROUP_ID } from './config';
import { GITLAB_API } from './gitApi';

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

export async function handleGit(projectInfo) {
  // 根据项目信息清洗gitInfo
  const { subGroupInfo, children } = getGitInfo(projectInfo, {
    parent_id: GROUP_ID,
    visibility: GIT_VISIBILITY_DEFAULT,
  });
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
  console.log(gitUrl, childList);
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

/**
 * @description 找到已存在的项目
 * @param children
 * @param projectList
 * @returns
 */
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

/**
 * @description 将projectInfo.children中的数据和git比对
 * @param projectInfo
 * @param projectList
 * @returns
 */
function matchProjectGitUrl(projectInfo, projectList) {
  return projectInfo.children.reduce((pre, cur) => {
    const { gitUrl } = cur;
    const project = projectList.find(
      (item) => item.http_url_to_repo === gitUrl,
    );
    pre[cur.type] = {
      url: gitUrl,
      id: project?.id,
    };
    return pre;
  }, {});
}

/**
 * @description 根据subGroupsInfo获取子群组的id
 * @param subGroupInfo
 * @returns
 */
async function getIdBySubgroup(subGroupInfo) {
  const { parent_id, name } = subGroupInfo;
  const subgroups = await GITLAB_API.getSubgroups(parent_id);
  let subgroup = subgroups.find((item) => name === item.name);
  if (!subgroup) {
    subgroup = await GITLAB_API.createSubGroupAPI(subGroupInfo);
  }
  return subgroup.id;
}

/**
 * @description 根据project格式化获取git信息
 * @param projectInfo
 * @param options
 * @returns
 */
function getGitInfo(projectInfo, options = {}) {
  // 子群组信息
  const subGroupInfo = {
    name: _getGroupName(projectInfo),
    path: _getGroupUrl(projectInfo, GIT_BASE_PREFIX),
    description: projectInfo.description || '',
    ...options,
  };
  return {
    subGroupInfo,
    children: _getCurrentProjectList(subGroupInfo, projectInfo),
  };
}
/**
 * @description 由单位名称加上名称
 * @example unitName为体系 name 为项目 则返回体系_项目
 * @param projectInfo 项目信息
 * @returns 返回群组名称
 */
function _getGroupName(projectInfo) {
  const { name, unitName } = projectInfo;
  return unitName ? `${unitName}_${name}` : name;
}

/**
 * @description 返回群组Url,由单位code加上项目code
 * @example unitCode为tixi name 为project 则返回tixi_project
 * @param projectInfo 项目信息
 * @param prefix git前缀(如com.tixi)
 * @returns 返回群组url
 */
function _getGroupUrl(projectInfo, prefix) {
  const { code, unitCode } = projectInfo;
  const relativePath = unitCode ? `${unitCode}.${code}` : code;
  return prefix ? prefix + relativePath : relativePath;
}

// 子群组下的git项目信息
function _getCurrentProjectList(subGroupInfo, projectInfo) {
  const { path, description, visibility } = subGroupInfo;
  const param = {
    description,
    visibility,
  };
  const result = baseGitProject.map((item) => {
    return {
      name: item.name,
      path: `${path}${item.ext}`,
      type: item.type,
      avatar_url: item.avatar_url,
      code: item.type,
      projectCode: projectInfo.code,
      ...param,
    };
  });
  if (projectInfo?.children?.length) {
    projectInfo.children.forEach((childItem) => {
      result.push({
        name: `【fe】${childItem.name}模块`,
        path: `${path}.${childItem.code}.fe`,
        type: `${childItem.code}_${GIT_PROJECT_TYPE.FRONTEND}`,
        avatar_url: '/uploads/-/system/project/avatar/538/fe.png',
        code: childItem.code,
        projectCode: projectInfo.code,
        ...param,
      });
    });
  }
  return result;
}
