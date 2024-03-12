window.SLM = window.SLM || {};
window.SLM['theme-shared/events/product/updateSection/index.js'] = window.SLM['theme-shared/events/product/updateSection/index.js'] || function () {
  const _exports = {};
  const apiLogger = window['SLM']['theme-shared/events/utils/api-logger.js'].default;
  const EVENT_NAME = 'Product::UpdateSection::Filter';
  const logger = apiLogger(EVENT_NAME);
  const external = window.Shopline && window.Shopline.event;
  const filterUpdateSection = data => {
    if (external) {
      logger.info(`[emit]`, {
        data
      });
      return external.emit(EVENT_NAME, {
        data,
        onSuccess: result => {
          logger.info('success', {
            data: {
              result
            }
          });
        },
        onError: error => {
          logger.error('error', {
            error
          });
        }
      });
    }
  };
  filterUpdateSection.apiName = EVENT_NAME;
  _exports.default = filterUpdateSection;
  return _exports;
}();