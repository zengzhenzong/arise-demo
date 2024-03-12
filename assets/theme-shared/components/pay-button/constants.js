window.SLM = window.SLM || {};
window.SLM['theme-shared/components/pay-button/constants.js'] = window.SLM['theme-shared/components/pay-button/constants.js'] || function () {
  const _exports = {};
  const ButtonLocation = {
    ProductDetail: 'productDetail',
    Cart: 'cart',
    Checkout: 'checkout'
  };
  _exports.ButtonLocation = ButtonLocation;
  const ButtonType = {
    Normal: 'normalButton',
    Express: 'expressCheckoutButton',
    Fast: 'fastCheckoutButton'
  };
  _exports.ButtonType = ButtonType;
  const ButtonName = {
    BUY_NOW: 'BUY_NOW',
    MORE_OPTIONS: 'MORE_OPTIONS',
    CHECKOUT: 'CHECKOUT',
    PAY_PAL: 'PAY_PAL',
    APPLE_PAY: 'APPLE_PAY',
    GOOGLE_PAY: 'GOOGLE_PAY',
    SHOP_BY_FAST_CHECKOUT: 'SHOP_BY_FAST_CHECKOUT'
  };
  _exports.ButtonName = ButtonName;
  const SAVE_ERROR_TYPE = {
    PRODUCT_VERIFY: 'product_verify',
    SAVE_ORDER: 'save_order'
  };
  _exports.SAVE_ERROR_TYPE = SAVE_ERROR_TYPE;
  const EPaymentUpdate = 'Payment::Update';
  _exports.EPaymentUpdate = EPaymentUpdate;
  const EPaymentUpdateType = {
    CartPayButton: 'cart-pay-button'
  };
  _exports.EPaymentUpdateType = EPaymentUpdateType;
  return _exports;
}();