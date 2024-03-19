/*
 * @Author: sikonggpw 1327325804@qq.com
 * @Date: 2023-06-02 11:54:58
 * @LastEditors: sikonggpw 1327325804@qq.com
 * @LastEditTime: 2023-07-07 21:24:05
 * @FilePath: \snow-vue\src\server\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import HttpRequest from "./http";
import { merge } from "lodash-es";
import { isLoginOut, loginOut401Message, loginOut403Message } from '@/utils/login'

// token白名单
const whiteList = ['/api/login', '/api/code', '/api/code/check', '/api/newToken', '/api/register']
const baseUrlPublic = import.meta.env.VITE_PMS_APP_BASE_URL;
const requestHooks = {
  requestInterceptorsHook(options, config) {
    options.header = options.header || {}
    const url = options.url;
    // #ifdef MP-WEIXIN
    options.url = options.url.replace("/api", baseUrlPublic);
    // #endif
    options.header["Access-Control-Allow-Origin"] = "*";
    options.header["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";

    // 白名单不需要token
    if (!whiteList.includes(url)) {
      // 获取token
      const { token } = isLoginOut()
      // 在请求头中加token
      options.headers.Authorization = token
    }

    // 添加终端类型
    const isToc = import.meta.env.VITE_IS_TOC;
    if (isToc === "true") {
      options.header["CLIENT-TOC"] = "Y";
    }

    return options;
  },
  async responseInterceptorsHook(response) {
    const { statusCode, data } = response;
    switch (statusCode) {
      case 400:
        uni.showToast({
          icon: "error",
          title: error.response.data.msg,
        });
        break;
      // 401: 未登录
      // 未登录则跳转登录页面，并携带当前页面的路径
      // 在登录成功后返回当前页面，这一步需要在登录页操作。
      case 401:
        loginOut401Message()
        break
      // 403 token过期
      // 登录过期对用户进行提示
      // 清除本地token和清空vuex中token对象
      // 跳转登录页面
      case 403:
        loginOut403Message()
        uni.navigateTo({
          url: '/pages/login/index',
        });
        break
      // 404请求不存在
      case 404:
        uni.navigateTo({
          url: '/pages/not-find/index',
        });
        break
    }
    return data;
  },
  async responseInterceptorsCatchHook(options, error) {
    if (options.method?.toUpperCase() == 'POST') {
    }
    return Promise.reject(error);
  },
};

const defaultOptions = {
  requestOptions: {
    timeout: 10 * 1000,
  },
  baseUrl: "/",
  //是否返回默认的响应
  isReturnDefaultResponse: false,
  // 需要对返回数据进行处理
  isTransformResponse: true,
  // 接口拼接地址
  urlPrefix: "",
  // 忽略重复请求
  ignoreCancel: false,
  // 是否携带token
  withToken: true,
  isAuth: false,
  retryCount: 2,
  retryTimeout: 20000,
  requestHooks: requestHooks,
};

function createRequest(opt) {
  return new HttpRequest(
    // 深度合并
    merge(defaultOptions, opt || {})
  );
}
const request = createRequest();
export default request;
