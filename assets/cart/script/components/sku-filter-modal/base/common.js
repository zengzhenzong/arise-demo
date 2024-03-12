window.SLM = window.SLM || {};
window.SLM['cart/script/components/sku-filter-modal/base/common.js'] = window.SLM['cart/script/components/sku-filter-modal/base/common.js'] || function () {
  const _exports = {};
  const createNamespace = window['SLM']['commons/utils/bem.js'].default;
  const { disablePageScroll, enablePageScroll } = window['scroll-lock'];
  _exports.disablePageScroll = disablePageScroll;
  _exports.enablePageScroll = enablePageScroll;
  const bem = createNamespace('trade', 'modal');
  _exports.bem = bem;
  const DEFAULT_MODAL_ID_PRE = 'TradeModal';
  _exports.DEFAULT_MODAL_ID_PRE = DEFAULT_MODAL_ID_PRE;
  const VISIBLE = 'visible';
  _exports.VISIBLE = VISIBLE;
  const HIDDEN = 'hidden';
  _exports.HIDDEN = HIDDEN;
  const animationClassMap = {
    visible: bem('visibleAnimation'),
    hidden: bem('notVisibleAnimation')
  };
  _exports.animationClassMap = animationClassMap;
  const visibleClassName = bem('visible');
  _exports.visibleClassName = visibleClassName;
  const maskClosableClass = bem('closable');
  _exports.maskClosableClass = maskClosableClass;
  return _exports;
}();