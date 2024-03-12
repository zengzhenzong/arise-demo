window.SLM = window.SLM || {};
window.SLM['commons/cart/globalEvent.js'] = window.SLM['commons/cart/globalEvent.js'] || function () {
  const _exports = {};
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const loggerService = window['@yy/sl-theme-shared']['/utils/logger'].default;
  const { getSyncData } = window['SLM']['theme-shared/utils/dataAccessor.js'];
  const { setAddtoCart } = window['SLM']['theme-shared/utils/tradeReport/index.js'];
  const { OPEN_MINI_CART, ADD_TO_CART, CONTROL_CART_BASIS } = window['SLM']['theme-shared/events/trade/interior-event/index.js'];
  const CartSidebarRender = window['SLM']['theme-shared/events/trade/developer-api/cart-sidebar-render/index.js'].default;
  const { listenCartReport } = window['SLM']['theme-shared/utils/tradeReport/eventListen.js'];
  const { reportMiniCartView } = window['SLM']['theme-shared/utils/tradeReport/hdReportV2.js'];
  const { DRAWER_EVENT_NAME: TOP_DRAWER_EVENT_NAME, DRAWER_OPERATORS } = window['SLM']['theme-shared/components/hbs/shared/components/topDrawer/const.js'];
  const { DRAWER_EVENT_NAME } = window['SLM']['theme-shared/components/hbs/shared/components/drawer/const.js'];
  const { initMiniStyleWhenOpen } = window['SLM']['cart/script/biz/sticky-cart/index.js'];
  const { setFixedContentStyle, listenElementMutation } = window['SLM']['cart/script/biz/sticky-cart/helper.js'];
  const Service = window['SLM']['cart/script/service/index.js'].default;
  const CartService = window['SLM']['cart/script/service/cart/index.js'].default;
  const responseCodeVO = window['SLM']['cart/script/domain/vo/responseCode.js'].default;
  const dynamicImportMiniCart = window['SLM']['commons/utils/dynamicImportMiniCart.js'].default;
  const handleAddToCartErrorCodeToast = window['SLM']['commons/cart/handleAddToCartErrorCodeToast.js'].default;
  const logger = loggerService.pipeOwner({
    owner: 'Cart',
    onTag: key => {
      switch (key) {
        case 'eventId':
          return true;
        default:
          return false;
      }
    }
  });
  _exports.OPEN_MINI_CART = OPEN_MINI_CART;
  _exports.ADD_TO_CART = ADD_TO_CART;
  const CLOSE_MINI_CART = Symbol('CLOSE_MINI_CART');
  _exports.CLOSE_MINI_CART = CLOSE_MINI_CART;
  const OPEN_TOP_CART = Symbol('OPEN_TOP_CART');
  _exports.OPEN_TOP_CART = OPEN_TOP_CART;
  const OPEN_CART_BANNER = 'NEED_OPEN_TOP_CART';
  _exports.OPEN_CART_BANNER = OPEN_CART_BANNER;
  const cartOpenType = SL_State.get('theme.settings.cart_open_type');
  Service.init();
  if (window.location.pathname.includes('/cart')) {
    dynamicImportMiniCart();
  } else if (cartOpenType !== 'newpage' && cartOpenType !== 'cartremain') {
    setTimeout(dynamicImportMiniCart, 6000);
  }
  const interior = window.SL_EventBus;
  const noop = () => {};
  listenCartReport();
  let miniCartContainerFixedObserver = null;
  function listenMiniCartStickContainerChange() {
    if (miniCartContainerFixedObserver) {
      miniCartContainerFixedObserver.disconnect();
      miniCartContainerFixedObserver = null;
    }
    if ($(`.miniCart__stick_container_fixed_observer`).length > 0) {
      miniCartContainerFixedObserver = listenElementMutation($(`.miniCart__stick_container_fixed_observer`).get(0), () => {
        $('#cart-drawer .trade_cart_not_empty_wrapper').prop('hadSet', false);
        setTimeout(() => {
          setFixedContentStyle('#cart-drawer .trade_cart_not_empty_wrapper', $('#cart-drawer .miniCart__stick_container_fixed_observer').outerHeight() + 20);
        }, 0);
      }, {
        attributes: true,
        childList: true,
        subtree: true
      });
    }
  }
  interior.on(OPEN_MINI_CART, async ({
    data = {},
    onSuccess = noop
  } = {}) => {
    const cartId = 'cart-drawer';
    const {
      needToFetch = true
    } = data;
    if (cartOpenType === 'newpage' || cartOpenType === 'minicart' || cartOpenType === 'cartremain') {
      onSuccess(data);
      window.location.href = window.Shopline.redirectTo('/cart');
    } else {
      await dynamicImportMiniCart();
      if (needToFetch) {
        await CartService.takeCartService().getCartDetail();
      }
      interior.emit(DRAWER_EVENT_NAME, {
        id: cartId,
        status: 'open',
        onOpen: onSuccess
      });
      initMiniStyleWhenOpen();
      reportMiniCartView();
      listenMiniCartStickContainerChange();
      CartSidebarRender({
        data: {
          dom: {
            id: cartId
          }
        }
      });
    }
  });
  window.SL_EventBus.on(OPEN_TOP_CART, async () => {
    await dynamicImportMiniCart();
    window.SL_EventBus.emit(cartOpenType === 'minicart' ? TOP_DRAWER_EVENT_NAME : DRAWER_EVENT_NAME, {
      id: cartOpenType === 'minicart' ? 'cart-select' : 'cart-drawer',
      operator: DRAWER_OPERATORS.OPEN,
      status: 'open'
    });
  });
  const closeMiniCart = () => {
    window.SL_EventBus.emit(cartOpenType === 'minicart' ? TOP_DRAWER_EVENT_NAME : DRAWER_EVENT_NAME, {
      id: cartOpenType === 'minicart' ? 'cart-select' : 'cart-drawer',
      operator: DRAWER_OPERATORS.CLOSE
    });
  };
  window.SL_EventBus.on(CLOSE_MINI_CART, closeMiniCart);
  interior.on('REFRESH_CART', async () => {
    await CartService.takeCartService().getCartDetail();
  });
  window.SL_EventBus.on(ADD_TO_CART, async ({
    spuId,
    skuId,
    num,
    price,
    currency,
    success,
    error,
    complete,
    eventID,
    reportParamsExt,
    sellingPlanId
  }) => {
    const dataReportReq = setAddtoCart(price, currency, eventID, reportParamsExt);
    const skuParams = {
      spuId,
      skuId,
      num,
      orderFrom: getSyncData('orderFrom'),
      dataReportReq,
      sellingPlanId
    };
    try {
      if (cartOpenType !== 'newpage') {
        closeMiniCart();
        await dynamicImportMiniCart();
      }
      const isDismissParams = ['orderFrom'].some(key => !skuParams[key] && skuParams[key] !== 0);
      if (isDismissParams) {
        logger.info('[加购请求参数缺失，请检查]', {
          ...skuParams
        });
      }
      logger.debug('[加购请求参数初始化]', {
        ...skuParams
      });
      const res = await CartService.takeCartService().addSku(skuParams);
      logger.debug('[加购请求响应数据]', {
        res,
        eventId: dataReportReq.eventId
      });
      if (!responseCodeVO.isOk(res)) {
        handleAddToCartErrorCodeToast(res);
        if (typeof error === 'function') {
          error();
        }
      } else {
        if (typeof success === 'function') {
          try {
            success();
          } catch (e) {
            console.error(e);
          }
        }
        if (cartOpenType === 'cartremain') {
          return;
        }
        if (cartOpenType === 'minicart') {
          window.SL_EventBus.emit(OPEN_CART_BANNER, {
            data: {
              ...res.data.itemDetail
            },
            onSuccess: () => {
              window.SL_EventBus.emit(OPEN_TOP_CART);
            }
          });
        } else {
          interior.emit(OPEN_MINI_CART, {
            data: {
              needToFetch: false
            }
          });
        }
      }
    } catch (e) {
      console.warn('add to cart fail:', e);
      logger.error(`[加购失败]`, {
        e,
        eventId: dataReportReq.eventId
      });
    } finally {
      if (typeof complete === 'function') {
        complete();
      }
    }
  });
  window.SL_EventBus.on(CONTROL_CART_BASIS, async ({
    options,
    success,
    error
  }) => {
    const paramsEnum = {
      switchSideBar: 'switchSideBar',
      updateState: 'updateState',
      rerenderDom: 'rerenderDom',
      cartDetail: 'cartDetail'
    };
    const sideBarStatusEnum = {
      open: 'open',
      close: 'close'
    };
    const paramsFilter = () => {
      const eventName = 'Cart::ControlCartBasis Event: ';
      if (!options || !Object.keys(options).length) {
        console.warn(eventName, 'params missing');
        return false;
      }
      if (!!Object.hasOwnProperty.call(options, paramsEnum.switchSideBar) && !Object.values(sideBarStatusEnum).includes(options.switchSideBar)) {
        console.warn(eventName, `【switchSideBar: ${options.switchSideBar}】 is invalid`);
        return false;
      }
      if (!!Object.hasOwnProperty.call(options, paramsEnum.updateState) && typeof options.updateState !== 'boolean') {
        console.warn(eventName, `【updateState: ${options.updateState}】 is invalid`);
        return false;
      }
      if (!!Object.hasOwnProperty.call(options, paramsEnum.rerenderDom) && typeof options.rerenderDom !== 'boolean') {
        console.warn(eventName, `【rerenderDom: ${options.rerenderDom}】 is invalid`);
        return false;
      }
      if (!!Object.hasOwnProperty.call(options, paramsEnum.cartDetail) && typeof options.cartDetail !== 'boolean') {
        console.warn(eventName, `【cartDetail: ${options.cartDetail}】 is invalid`);
        return false;
      }
      if (Object.keys(options).some(item => !Object.hasOwnProperty.call(paramsEnum, item))) {
        console.warn(eventName, 'params has invalid key');
        return false;
      }
      return true;
    };
    try {
      if (paramsFilter()) {
        const {
          switchSideBar,
          updateState,
          rerenderDom,
          cartDetail
        } = options;
        let cartInfo;
        if (switchSideBar) {
          interior.emit(OPEN_MINI_CART, {
            data: {
              needToFetch: false
            }
          });
        }
        if (updateState) {
          await CartService.takeCartService().updateCartState();
        }
        if (rerenderDom) {
          await CartService.takeCartService().rerenderCartDom();
        }
        if (cartDetail) {
          const CartInfoKey = 'cartInfo';
          cartInfo = SL_State.get(CartInfoKey) || null;
          success(cartInfo);
          return;
        }
        success();
        return;
      }
    } catch (e) {
      error();
      console.warn(`${CONTROL_CART_BASIS} FAIL:`, e);
    }
  });
  return _exports;
}();