window.SLM = window.SLM || {};
window.SLM['theme-shared/components/pay-button/payment-button/constants.js'] = window.SLM['theme-shared/components/pay-button/payment-button/constants.js'] || function () {
  const _exports = {};
  const { ButtonType } = window['SLM']['theme-shared/components/pay-button/constants.js'];
  const PageType = {
    ProductDetail: 'productDetail',
    Cart: 'cart',
    MiniCart: 'MiniCart',
    Checkout: 'checkout'
  };
  _exports.PageType = PageType;
  const DEFAULT_CONFIG = {
    buttonLocation: 'productDetail',
    isSystem: false,
    buttonTypeDataList: [{
      buttonType: ButtonType.Normal,
      buttonNameDataList: [{
        buttonName: 'BUY_NOW',
        buttonConfigData: null
      }]
    }]
  };
  _exports.DEFAULT_CONFIG = DEFAULT_CONFIG;
  return _exports;
}();