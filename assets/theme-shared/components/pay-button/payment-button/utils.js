window.SLM = window.SLM || {};
window.SLM['theme-shared/components/pay-button/payment-button/utils.js'] = window.SLM['theme-shared/components/pay-button/payment-button/utils.js'] || function () {
  const _exports = {};
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const { ButtonLocation } = window['SLM']['theme-shared/components/pay-button/constants.js'];
  const isStandard = () => {
    const pageData = SL_State.get('paymentButtonConfig');
    if (!pageData || !pageData.buttonLocationDataList) return true;
    if (!pageData.grayscaleButtonLocation) return false;
    return pageData.grayscaleButtonLocation.includes(ButtonLocation.ProductDetail);
  };
  _exports.isStandard = isStandard;
  const getConfig = () => {
    const pageData = SL_State.get('paymentButtonConfig');
    if (!pageData || !pageData.buttonLocationDataList) return null;
    const config = pageData.buttonLocationDataList.find(item => {
      return item.buttonLocation === ButtonLocation.ProductDetail;
    });
    if (!config) return null;
    return config;
  };
  _exports.getConfig = getConfig;
  const isSubscription = () => {
    return !!(SL_State.get('product.selling_plan_groups') || []).length;
  };
  _exports.isSubscription = isSubscription;
  const isPreview = () => {
    return SL_State.get('templateAlias') === 'PreviewProductsDetail';
  };
  _exports.isPreview = isPreview;
  const isValidateJson = str => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };
  _exports.isValidateJson = isValidateJson;
  return _exports;
}();