window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/request.js'] = window.SLM['theme-shared/utils/request.js'] || function () {
  const _exports = {};
  const axios = window['axios']['default'];
  const qs = window['query-string']['default'];
  const baseAxiosConfig = {
    baseURL: '/leproxy/api',
    timeout: 30e3,
    withCredentials: true,
    paramsSerializer(params) {
      return qs.stringify(params);
    }
  };
  _exports.baseAxiosConfig = baseAxiosConfig;
  const instance = axios.create(baseAxiosConfig);
  const leproxyInterceptor = [res => {
    const {
      status,
      data,
      config
    } = res;
    switch (config.baseURL) {
      case '/leproxy':
        if (status !== 200 || data.rescode !== '0') {
          return Promise.reject({
            message: data.resmsg,
            ...data
          });
        }
        break;
      case '/leproxy/api':
      default:
        if (status !== 200 || !(data.success || data.code === 'SUCCESS')) {
          return Promise.reject(data);
        }
        break;
    }
    return data;
  }, error => {
    return Promise.reject(error);
  }];
  _exports.leproxyInterceptor = leproxyInterceptor;
  instance.interceptors.response.use(...leproxyInterceptor);
  _exports.default = instance;
  return _exports;
}();