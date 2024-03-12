window.SLM = window.SLM || {};
window.SLM['theme-shared/components/pay-button/payment-button/index.js'] = window.SLM['theme-shared/components/pay-button/payment-button/index.js'] || function () {
  const _exports = {};
  const Toast = window['SLM']['theme-shared/components/hbs/shared/components/toast/index.js'].default;
  const baseLogger = window['@yy/sl-theme-shared']['/utils/logger/sentry'].default;
  const PayButton = window['@sl/pay-button']['default'];
  const { save, checkoutHiidoReportV2 } = window['@sl/pay-button'];
  const { setInitialCheckoutData, getExpressCheckoutDataList, emitExpressCheckoutData, getPaymentProps } = window['SLM']['theme-shared/components/pay-button/utils.js'];
  const { SAVE_ERROR_TYPE, ButtonName, EPaymentUpdate } = window['SLM']['theme-shared/components/pay-button/constants.js'];
  const { getConfig, isPreview, isSubscription, isValidateJson } = window['SLM']['theme-shared/components/pay-button/payment-button/utils.js'];
  const { DEFAULT_CONFIG } = window['SLM']['theme-shared/components/pay-button/payment-button/constants.js'];
  const toast = message => Toast.init({
    content: message
  });
  const logger = baseLogger.pipeOwner('shared.payment-button');
  class PaymentButton {
    constructor(config) {
      logger.info('PaymentButton init constructor', {
        config
      });
      this.config = config;
      this.isSubscription = isSubscription();
      this.expressCheckoutDataList = null;
      let paymentConfig = getConfig();
      if (!paymentConfig) {
        paymentConfig = DEFAULT_CONFIG;
        logger.error('first load productDetailConfig data is null');
      }
      this.expressCheckoutDataList = getExpressCheckoutDataList(paymentConfig);
      const {
        products,
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
          isSubscription: this.isSubscription,
          isPreview: isPreview()
        }
      };
      this.payButton = new PayButton(payButtonConfig);
    }
    async render() {
      await this.payButton.render();
      if (this.isSubscription) {
        this.addSubscriptionListener();
      }
    }
    async saveAbandonedOrder(buttonName) {
      const {
        products
      } = this.config;
      const restParams = {};
      const query = {};
      if (buttonName === ButtonName.PAY_PAL) {
        query.spb = true;
      }
      if (buttonName === ButtonName.SHOP_BY_FAST_CHECKOUT) {
        restParams.notSupportSubscriptionCheck = true;
      }
      const discountCodes = [];
      const tradeExtraInfoStr = sessionStorage.getItem('tradeExtraInfo');
      if (tradeExtraInfoStr) {
        const tradeExtraInfo = isValidateJson(tradeExtraInfoStr) ? JSON.parse(tradeExtraInfoStr) : {};
        const discountCode = tradeExtraInfo && tradeExtraInfo.discountCode && tradeExtraInfo.discountCode.value;
        if (discountCode) discountCodes.push(discountCode);
      }
      logger.info('save abandon order', {
        data: {
          products,
          query,
          discountCodes,
          restParams
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
        toast,
        logger,
        ...restParams
      });
      if (errorType) {
        if (errorType === SAVE_ERROR_TYPE.SAVE_ORDER) {
          this.handleAfterSaveAbandonedOrder({
            status: false,
            buttonName
          });
        }
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
      this.handleAfterSaveAbandonedOrder({
        status: true,
        buttonName
      });
      if ([ButtonName.BUY_NOW, ButtonName.MORE_OPTIONS, ButtonName.PAY_PAL].includes(buttonName)) {
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
    handleAfterSaveAbandonedOrder(data) {
      logger.info('handleAfterSaveAbandonedOrder', {
        data
      });
      try {
        if (data.status) {
          checkoutHiidoReportV2.reportFastCheckout(data.buttonName);
        }
        this.config.afterSaveAbandonedOrder && this.config.afterSaveAbandonedOrder(data);
      } catch (error) {
        logger.warn('afterSaveAbandonedOrder error', {
          data: {
            error
          }
        });
      }
    }
    addSubscriptionListener() {
      let timer = setTimeout(async () => {
        this.payButton.setSubscription(false);
      }, 5000);
      window.Shopline.event.on(EPaymentUpdate, async ({
        isSubscription
      }) => {
        if (isSubscription === undefined) return;
        clearTimeout(timer);
        timer = null;
        this.payButton.setSubscription(isSubscription);
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
    getRenderedButtons() {
      return this.payButton.getRenderedButtons();
    }
  }
  _exports.default = PaymentButton;
  return _exports;
}();