window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/biz/sign-in/loadAppleJS.js'] = window.SLM['theme-shared/biz-com/customer/biz/sign-in/loadAppleJS.js'] || function () {
  const _exports = {};
  function loadAppleJS(callback) {
    if (window.AppleID) {
      callback && callback();
    } else {
      const scriptElement = document.createElement('script');
      scriptElement.src = `https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js`;
      scriptElement.async = true;
      scriptElement.defer = true;
      scriptElement.onload = () => {
        callback && callback();
      };
      document.getElementsByTagName('body')[0].appendChild(scriptElement);
    }
  }
  _exports.default = loadAppleJS;
  return _exports;
}();