import axios, { AxiosInstance } from 'axios';

/**
 * Git服务请求基类
 * 用于处理与Git服务器的HTTP请求
 */
export default class GitRequest {
  /** 访问令牌 */
  protected token: string;
  /** Axios实例 */
  protected service: AxiosInstance;

  /**
   * 构造函数
   * @param baseURL API基础URL
   * @param token 访问令牌
   */
  constructor(baseURL: string, token: string) {
    this.token = token;
    this.service = axios.create({
      baseURL,
      timeout: 10000,
    });

    this.service.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        if (error.response && error.response.data) {
          return error.response;
        } else {
          return Promise.reject(error);
        }
      },
    );
  }

  /**
   * 发送GET请求
   * @param url 请求路径
   * @param params 请求参数
   * @param headers 请求头
   */
  get(
    url: string,
    params?: Record<string, any>,
    headers?: Record<string, string>,
  ): Promise<any> {
    return this.service({
      url,
      params: {
        ...params,
        access_token: this.token,
      },
      method: 'get',
      headers,
    });
  }

  /**
   * 发送POST请求
   * @param url 请求路径
   * @param data 请求数据
   * @param headers 请求头
   */
  post(
    url: string,
    data?: any,
    headers?: Record<string, string>,
  ): Promise<any> {
    return this.service({
      url,
      params: {
        access_token: this.token,
      },
      data,
      method: 'post',
      headers,
    });
  }

  /**
   * 发送DELETE请求
   * @param url 请求路径
   * @param params 请求参数
   * @param headers 请求头
   */
  delete(
    url: string,
    params?: Record<string, any>,
    headers?: Record<string, string>,
  ): Promise<any> {
    return this.service({ url, params, method: 'delete', headers });
  }
}
