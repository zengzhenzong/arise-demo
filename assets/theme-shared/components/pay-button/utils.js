window.SLM = window.SLM || {};
window.SLM['theme-shared/components/pay-button/utils.js'] = window.SLM['theme-shared/components/pay-button/utils.js'] || function () {
  const _exports = {};
  const { setIniiateCheckout, reportCheckout } = window['SLM']['theme-shared/utils/tradeReport/index.js'];
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const { ButtonType } = window['SLM']['theme-shared/components/pay-button/constants.js'];
  const setInitialCheckoutData = abandonedSeq => {
    setIniiateCheckout(abandonedSeq);
    reportCheckout({});
  };
  _exports.setInitialCheckoutData = setInitialCheckoutData;
  const getExpressCheckoutDataList = paymentConfig => {
    if (paymentConfig && Array.isArray(paymentConfig.buttonTypeDataList)) {
      const buttonConfig = paymentConfig.buttonTypeDataList.find(item => item.buttonType === ButtonType.Express);
      if (buttonConfig) {
        return buttonConfig.buttonNameDataList;
      }
    }
    return [];
  };
  _exports.getExpressCheckoutDataList = getExpressCheckoutDataList;
  const emitExpressCheckoutData = (() => {
    const eventName = 'Checkout::AdditionalChargeUpdate';
    const getAdditionalChargeUpdateParams = (buttonName, dataList) => {
      let currentChannelInfo = null;
      let delayMillSeconds = 0;
      const payChannelInfo = {
        items: []
      };
      dataList.forEach(config => {
        if (!config) return;
        const {
          channelCode,
          methodCode,
          paymentId
        } = config.buttonConfigData || {};
        const channelInfo = {
          channelCode,
          methodCode,
          select: false
        };
        if (config.buttonName === buttonName) {
          currentChannelInfo = {
            channelCode,
            methodCode,
            paymentId
          };
          delayMillSeconds = config.delayMillSeconds;
          channelInfo.select = true;
        }
        payChannelInfo.items.push(channelInfo);
      });
      return [{
        ...currentChannelInfo,
        payChannelInfo
      }, delayMillSeconds];
    };
    const delayCallback = (handler, timeout, logger) => {
      if (!timeout || typeof timeout !== 'number') return handler;
      let once = true;
      const timestamp = Date.now();
      const invoke = () => {
        const spent = Date.now() - timestamp;
        logger.info(`${eventName} delay callback`, {
          data: {
            timestamp,
            timeout,
            spent,
            once,
            delay: spent > timeout
          }
        });
        if (once) {
          once = false;
          handler();
        }
      };
      const timer = setTimeout(invoke, timeout);
      return () => {
        clearTimeout(timer);
        invoke();
      };
    };
    const hasEventListeners = () => {
      const listeners = window.Shopline.event.listeners(eventName) || [];
      return listeners.length > 0;
    };
    return async ({
      buttonName,
      dataList,
      payload,
      logger
    }) => {
      const shouldEmit = hasEventListeners();
      if (!shouldEmit || !buttonName || !Array.isArray(dataList)) return;
      const [params, timeout] = getAdditionalChargeUpdateParams(buttonName, dataList);
      if (!params.channelCode) return;
      const data = {
        ...payload,
        ...params,
        buttonType: ButtonType.Express
      };
      return new Promise(resolve => {
        const cb = delayCallback(resolve, timeout, logger);
        window.Shopline.event.emit(eventName, data, cb);
      });
    };
  })();
  _exports.emitExpressCheckoutData = emitExpressCheckoutData;
  const getPaymentProps = () => {
    const pageData = SL_State.get('paymentButtonConfig') || {};
    return {
      expressOptimizationSwitch: pageData.expressOptimizationSwitch || false
    };
  };
  _exports.getPaymentProps = getPaymentProps;
  return _exports;
}();