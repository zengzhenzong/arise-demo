window.SLM = window.SLM || {};
window.SLM['theme-shared/events/utils/api-logger.js'] = window.SLM['theme-shared/events/utils/api-logger.js'] || function () {
  const _exports = {};
  const loggerService = window['@yy/sl-theme-shared']['/utils/logger/sentry'].default;
  _exports.default = apiName => loggerService.pipeOwner('developer-api').pipeOwner(apiName);
  return _exports;
}();