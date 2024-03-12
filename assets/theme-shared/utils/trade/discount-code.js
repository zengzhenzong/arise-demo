window.SLM = window.SLM || {};
window.SLM['theme-shared/utils/trade/discount-code.js'] = window.SLM['theme-shared/utils/trade/discount-code.js'] || function () {
  const _exports = {};
  const getDiscountCodeName = (entity = {}) => {
    const {
      discountApplication
    } = entity;
    if (!discountApplication) return '';
    const {
      displayLabel,
      title
    } = discountApplication || {};
    return displayLabel || title || '';
  };
  _exports.getDiscountCodeName = getDiscountCodeName;
  return _exports;
}();