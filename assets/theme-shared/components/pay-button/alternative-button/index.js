window.SLM = window.SLM || {};
window.SLM['theme-shared/components/pay-button/alternative-button/index.js'] = window.SLM['theme-shared/components/pay-button/alternative-button/index.js'] || function () {
  const _exports = {};
  const Toast = window['SLM']['theme-shared/components/hbs/shared/components/toast/index.js'].default;
  const baseLogger = window['@yy/sl-theme-shared']['/utils/logger/sentry'].default;
  const PayButton = window['@sl/pay-button']['default'];
  const { getPaymentConfig, isSubscription } = window['SLM']['theme-shared/components/pay-button/alternative-button/utils.js'];
  const { getExpressCheckoutDataList, emitExpressCheckoutData, getPaymentProps } = window['SLM']['theme-shared/components/pay-button/utils.js'];
  const { ButtonType } = window['SLM']['theme-shared/components/pay-button/constants.js'];
  const toast = message => Toast.init({
    content: message
  });
  const logger = baseLogger.pipeOwner('shared.alternative-button');
  class AlternativeButton {
    constructor(config) {
      logger.info('AlternativeButton init constructor', {
        config
      });
      this.config = config;
      this.isSubscription = isSubscription();
      const paymentConfig = getPaymentConfig();
      if (!paymentConfig) {
        logger.error('first load paymentButtonConfig data is null');
        throw new Error('first load paymentButtonConfig data is null');
      }
      const expressCheckoutDataList = getExpressCheckoutDataList(paymentConfig);
      const {
        getAbandonedInfo,
        props,
        ...rest
      } = config;
      const payButtonConfig = {
        ...rest,
        buttonTypes: this.isSubscription ? [ButtonType.Express] : [ButtonType.Express, ButtonType.Fast],
        paymentConfig,
        saveAbandonedOrder: async buttonName => {
          const {
            abandonedInfo,
            url
          } = getAbandonedInfo();
          await emitExpressCheckoutData({
            buttonName,
            dataList: expressCheckoutDataList,
            payload: {
              abandonedInfo
            },
            logger
          });
          return {
            abandonedInfo,
            url,
            canContinue: true
          };
        },
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
    }
    async rerender(paymentConfig, options) {
      await this.payButton.rerender(paymentConfig, options);
    }
    setDisabled(value, options) {
      this.payButton.setDisabled(value, options);
    }
    getRenderedButtons() {
      return this.payButton.getRenderedButtons();
    }
  }
  _exports.default = AlternativeButton;
  const { isStandard } = window['SLM']['theme-shared/components/pay-button/alternative-button/utils.js'];
  _exports.isStandard = isStandard;
  return _exports;
}();