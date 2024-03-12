window.SLM = window.SLM || {};
window.SLM['theme-shared/components/pay-button/additional-button/utils.js'] = window.SLM['theme-shared/components/pay-button/additional-button/utils.js'] || function () {
  const _exports = {};
  const { checkoutHiidoReportV2 } = window['@sl/pay-button'];
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const { ButtonLocation, ButtonType } = window['SLM']['theme-shared/components/pay-button/constants.js'];
  const isStandard = () => {
    const pageData = SL_State.get('paymentButtonConfig');
    if (!pageData || !pageData.buttonLocationDataList) return true;
    if (!pageData.grayscaleButtonLocation) return false;
    return pageData.grayscaleButtonLocation.includes(ButtonLocation.Cart);
  };
  _exports.isStandard = isStandard;
  const getPaymentConfig = () => {
    const pageData = SL_State.get('paymentButtonConfig');
    if (!pageData || !pageData.buttonLocationDataList) return null;
    const config = pageData.buttonLocationDataList.find(item => {
      return item.buttonLocation === ButtonLocation.Cart;
    });
    if (!config) return null;
    const newConfig = {
      ...config
    };
    newConfig.buttonTypeDataList = newConfig.buttonTypeDataList.filter(item => item.buttonType !== ButtonType.Normal);
    return newConfig;
  };
  _exports.getPaymentConfig = getPaymentConfig;
  const isSubscription = () => {
    const cartInfoSubscriptionInfo = SL_State.get('cartInfo.subscriptionInfo') || {};
    if (cartInfoSubscriptionInfo.existSubscription) return true;
    return false;
  };
  _exports.isSubscription = isSubscription;
  const reportFastCheckout = buttonName => {
    try {
      checkoutHiidoReportV2.reportFastCheckout(buttonName);
    } catch (error) {
      console.error('reportFastCheckout error: ', error);
    }
  };
  _exports.reportFastCheckout = reportFastCheckout;
  return _exports;
}();