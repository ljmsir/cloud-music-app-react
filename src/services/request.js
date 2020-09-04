import axios from "axios";
import qs from "qs";
import { Toast } from "antd-mobile";
const Cookies = require("js-cookie");

const service = axios.create({
  baseURL: "https://api.mtnhao.com",
  timeout: 10000,
});

// 请求头
service.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const cookie = Cookies.get("cookie");
    Toast.loading("加载中...", 2000);
    config.url =
      config.url + "?_t=" + new Date().getTime() + "&cookie=" + cookie;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截
service.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      Toast.hide();
      return Promise.resolve(response);
    }
    return Promise.reject(response);
  },
  (error) => {
    Toast.clear();
    const { response } = error;
    if (response) {
      if (response.status) {
        switch (response.status) {
          case 301:
            Toast.info(response.data.msg);
            break;
          case 403:
            Toast.info("内网访问");
            break;
          case 404:
            Toast.info("接口路径错误");
            break;
          case 502:
            Toast.info("服务器异常");
            break;
          default:
            Toast.info(`网络繁忙(${response.status})`);
        }
      }
      return Promise.reject(response);
    } else {
      return Promise.reject(error);
    }
  }
);

/**
 * get
 */

export function get(url, params) {
  return new Promise((resolve, reject) => {
    service
      .get(url, {
        params,
      })
      .then((res) => {
        if (res.data.code === 200) {
          resolve(res.data);
        } else {
          Toast.info(res.data.error_msg);
          reject(res.data);
        }
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}

/**
 * post
 */

export function post(url, params) {
  return new Promise((resolve, reject) => {
    service
      .post(url, qs.stringify(params))
      .then((res) => {
        if (res.data.code === 200) {
          resolve(res.data);
        } else {
          Toast.info(res.data.error_msg);
          reject(res.data);
        }
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}
