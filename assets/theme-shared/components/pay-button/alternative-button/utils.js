window.SLM = window.SLM || {};
window.SLM['theme-shared/components/pay-button/alternative-button/utils.js'] = window.SLM['theme-shared/components/pay-button/alternative-button/utils.js'] || function () {
  const _exports = {};
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const { ButtonLocation } = window['SLM']['theme-shared/components/pay-button/constants.js'];
  const { BrowserPreloadStateFields } = window['SLM']['theme-shared/const/preload-state-fields.js'];
  const isStandard = () => {
    const pageData = SL_State.get(`${BrowserPreloadStateFields.TRADE_CHECKOUT}.paymentButtonConfig`);
    if (!pageData || !pageData.buttonLocationDataList) return true;
    if (!pageData.grayscaleButtonLocation) return false;
    return pageData.grayscaleButtonLocation.includes(ButtonLocation.Checkout);
  };
  _exports.isStandard = isStandard;
  const getPaymentConfig = () => {
    const pageData = SL_State.get(`${BrowserPreloadStateFields.TRADE_CHECKOUT}.paymentButtonConfig`);
    if (!pageData || !pageData.buttonLocationDataList) return null;
    const config = pageData.buttonLocationDataList.find(item => {
      return item.buttonLocation === ButtonLocation.Checkout;
    });
    if (!config) return null;
    return config;
  };
  _exports.getPaymentConfig = getPaymentConfig;
  const isSubscription = () => {
    const value = SL_State.get(`${BrowserPreloadStateFields.TRADE_CHECKOUT}.subscriptionInfo.existSubscription`);
    return Boolean(value);
  };
  _exports.isSubscription = isSubscription;
  return _exports;
}();