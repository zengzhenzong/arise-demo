window.SLM = window.SLM || {};
window.SLM['theme-shared/components/pay-button/additional-button/index.js'] = window.SLM['theme-shared/components/pay-button/additional-button/index.js'] || function () {
  const _exports = {};
  const Toast = window['SLM']['theme-shared/components/hbs/shared/components/toast/index.js'].default;
  const baseLogger = window['@yy/sl-theme-shared']['/utils/logger/sentry'].default;
  const PayButton = window['@sl/pay-button']['default'];
  const { save } = window['@sl/pay-button'];
  const { ButtonName } = window['SLM']['theme-shared/components/pay-button/constants.js'];
  const { setInitialCheckoutData, getExpressCheckoutDataList, emitExpressCheckoutData, getPaymentProps } = window['SLM']['theme-shared/components/pay-button/utils.js'];
  const { CHECKOUT_CLASS_NAME, ECartUpdate } = window['SLM']['theme-shared/components/pay-button/additional-button/constants.js'];
  const { getPaymentConfig, isSubscription, reportFastCheckout } = window['SLM']['theme-shared/components/pay-button/additional-button/utils.js'];
  const toast = message => Toast.init({
    content: message
  });
  const logger = baseLogger.pipeOwner('shared.additional-button');
  class AdditionalButton {
    constructor(config) {
      logger.info('AdditionalButton init constructor', {
        config
      });
      this.config = config;
      this.isSubscription = isSubscription();
      this.cartType = config.props.cartType;
      this.expressCheckoutDataList = null;
      const {
        domId
      } = config;
      const checkoutELem = document.querySelector(`#${domId} .${CHECKOUT_CLASS_NAME}`);
      if (checkoutELem) {
        checkoutELem.addEventListener('click', this.onCheckoutClick.bind(this));
      }
      const paymentConfig = getPaymentConfig();
      if (!paymentConfig) {
        logger.error('first load paymentButtonConfig data is null');
        throw new Error('first load paymentButtonConfig data is null');
      }
      this.expressCheckoutDataList = getExpressCheckoutDataList(paymentConfig);
      const {
        getSaveAbandonOrderParams,
        props,
        ...rest
      } = config;
      const payButtonConfig = {
        ...rest,
        paymentConfig,
        saveAbandonedOrder: this.saveAbandonedOrder.bind(this),
        props: {
          ...props,
          ...getPaymentProps(),
          logger: baseLogger,
          toast,
          isSubscription: this.isSubscription
        }
      };
      this.payButton = new PayButton(payButtonConfig);
    }
    async render() {
      await this.payButton.render();
      this.addSubscriptionListener();
    }
    async onCheckoutClick() {
      const {
        canContinue,
        url
      } = await this.saveAbandonedOrder(ButtonName.CHECKOUT);
      if (!canContinue) {
        return;
      }
      if (url) {
        logger.info('jump to checkout', {
          data: url
        });
        window.location.href = url;
      }
    }
    async saveAbandonedOrder(buttonName) {
      const {
        getSaveAbandonOrderParams
      } = this.config;
      const {
        products,
        discountCodes,
        useMemberPoint
      } = getSaveAbandonOrderParams();
      const restParams = {};
      const query = {};
      if (buttonName === ButtonName.PAY_PAL) {
        query.spb = true;
      }
      if (buttonName === ButtonName.SHOP_BY_FAST_CHECKOUT) {
        restParams.notSupportSubscriptionCheck = true;
      }
      logger.info('save abandon order', {
        data: {
          products,
          query,
          discountCodes,
          restParams,
          useMemberPoint,
          associateCart: true
        }
      });
      const {
        errorType,
        needLogin,
        abandonedInfo,
        url
      } = await save({
        products,
        query,
        discountCodes,
        useMemberPoint,
        associateCart: true,
        toast,
        logger,
        ...restParams
      });
      if (errorType) {
        return {
          canContinue: false
        };
      }
      await emitExpressCheckoutData({
        buttonName,
        dataList: this.expressCheckoutDataList,
        payload: {
          abandonedInfo
        },
        logger
      });
      reportFastCheckout(buttonName);
      if ([ButtonName.PAY_PAL, ButtonName.CHECKOUT].includes(buttonName)) {
        setInitialCheckoutData(abandonedInfo.seq);
      }
      if (needLogin) {
        logger.info('save abandonOrder need login');
        setTimeout(() => {
          window.location.href = url;
        }, 0);
        return {
          canContinue: false
        };
      }
      return {
        canContinue: true,
        abandonedInfo,
        url
      };
    }
    addSubscriptionListener() {
      window.Shopline.event.on(ECartUpdate, async data => {
        if (data.subscriptionInfo) {
          this.payButton.setSubscription(Boolean(data.subscriptionInfo.existSubscription));
        }
      });
    }
    setDisabled(value, options) {
      this.payButton.setDisabled(value, options);
    }
    setVisible(value, options) {
      this.payButton.setVisible(value, options);
    }
    customButtons(params) {
      this.payButton.customButtons(params);
    }
    getButtonElement(params) {
      return this.payButton.getButtonElement(params);
    }
  }
  _exports.default = AdditionalButton;
  const { isStandard } = window['SLM']['theme-shared/components/pay-button/additional-button/utils.js'];
  _exports.isStandard = isStandard;
  return _exports;
}();