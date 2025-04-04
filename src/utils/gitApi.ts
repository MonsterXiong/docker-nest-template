import axios from 'axios';
import { GITLAB_CONFIG } from './config';

export class GitLab {
  http: any;
  constructor(gitlabConfig) {
    this.http = axios.create({
      baseURL: gitlabConfig.BASE_URL,
      headers: {
        'Private-Token': gitlabConfig.PRIVATE_TOKEN,
      },
    });
  }

  getInstance(){
    return this.http
  }

  async createProject(param) {
    const { data } = await this.http.post('/projects', param);
    return data;
  }
  /**
   * @description 查询子群组下的所有项目
   * @param namespace_id 
   * @returns 
   */
  async getProjectListBySubgroups(namespace_id) {
    let { data } = await this.http.get(
      `/groups/${namespace_id}/projects?per_page=99999`,
    );
    return data;
  }

  /**
   * 获取子群组信息
   * @param groupId 
   * @returns 
   */
  async getSubgroups(groupId) {
    const { data } = await this.http.get(
      `/groups/${groupId}/subgroups?per_page=9999`,
    );
    return data;
  }

  /**
   * @description 创建子群组
   * @param param 
   * @returns 
   */
  async createSubGroupAPI(param) {
    const { data } = await this.http.post('/groups', param);
    // GROUP_MEMBERS.forEach(member =>{
    //   gitlab.post(`groups/${data.id}/members`,{
    //     user_id:member.id,
    //     access_level:40
    //   })
    // });
    return data;
  }

  async getCommits(id){
    const { data } = await this.http.get(
        `/projects/${id}/repository/commits`,);
    return data;
  }
}


export const GITLAB_API = new GitLab(GITLAB_CONFIG);