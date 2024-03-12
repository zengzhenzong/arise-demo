window.SLM = window.SLM || {};
window.SLM['cart/script/components/promotion-limited/index.js'] = window.SLM['cart/script/components/promotion-limited/index.js'] || function () {
  const _exports = {};
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const { toastTypeEnum } = window['SLM']['cart/script/domain/model/skuPromotionVerify.js'];
  const { cartLimitedEnum } = window['SLM']['cart/script/constant/stockType.js'];
  const newErrorTextKeyMap = [{
    errorCode: '0111',
    errorText: num => {
      return t(`cart.${toastTypeEnum.activeStockLimit}1`, {
        stock: num > 0 ? num : '0'
      });
    },
    errorTextNumkey: 'maxPurchaseTotalNum'
  }, {
    errorCode: '0112',
    errorText: num => {
      return t(`cart.${toastTypeEnum.activeStockLimit}2`, {
        stock: num > 0 ? num : '0'
      });
    },
    errorTextNumkey: 'maxPurchaseTotalNum'
  }, {
    errorCode: '0107',
    errorText: num => {
      return t(`cart.${toastTypeEnum.activeStockLimit}3`, {
        stock: num > 0 ? num : '0'
      });
    },
    errorTextNumkey: 'maxPurchaseTotalNum'
  }, {
    errorCode: '0113',
    errorText: num => {
      return t(`cart.b2b.amount.increase.desc`, {
        num
      });
    },
    errorTextNumkey: 'minPurchaseNum'
  }, {
    errorCode: '0125',
    errorText: num => {
      return t(`cart.b2b.amount.most.desc`, {
        num
      });
    },
    errorTextNumkey: 'maxPurchaseNum'
  }, {
    errorCode: '0126',
    errorText: num => {
      return t(`cart.b2b.amount.noIncrement.desc`, {
        num
      });
    },
    errorTextNumkey: 'purchaseIncrementNum'
  }];
  class PromotionLimited {
    constructor(props) {
      this.state = {
        ...props
      };
    }
    shouldRender() {
      const {
        errorList
      } = this.state;
      return errorList.length && newErrorTextKeyMap.map(item => item.errorCode).includes(errorList[0]);
    }
    getComponent() {
      if (![...cartLimitedEnum.ACTIVE, ...cartLimitedEnum.B2B_PURCHASE].includes(this.state.maxPurchaseReasonCode) || !this.shouldRender()) {
        return '';
      }
      const errorConfig = newErrorTextKeyMap.find(item => item.errorCode === this.state.errorList[0]);
      return `<div>${errorConfig.errorText(this.state[errorConfig.errorTextNumkey] || '')}</div>`;
    }
    render() {
      this.component = this.getComponent();
      return this.component;
    }
  }
  _exports.default = PromotionLimited;
  return _exports;
}();