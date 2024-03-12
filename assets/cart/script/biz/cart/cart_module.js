window.SLM = window.SLM || {};
window.SLM['cart/script/biz/cart/cart_module.js'] = window.SLM['cart/script/biz/cart/cart_module.js'] || function () {
  const _exports = {};
  const Cookie = window['js-cookie']['default'];
  const { SL_State } = window['SLM']['theme-shared/utils/state-selector.js'];
  const { convertFormat } = window['SLM']['theme-shared/utils/newCurrency/CurrencyConvert.js'];
  const { cartPage } = window['SLM']['theme-shared/utils/tradeReport/const.js'];
  const { Owner, Action } = window['@yy/sl-theme-shared']['/utils/logger/sentryReport'];
  const TopDrawer = window['SLM']['theme-shared/components/hbs/shared/components/topDrawer/index.js'].default;
  const { DRAWER_EVENT_NAME, DRAWER_OPERATORS } = window['SLM']['theme-shared/components/hbs/shared/components/topDrawer/const.js'];
  const AdditionalButton = window['SLM']['theme-shared/components/pay-button/additional-button/index.js'].default;
  const { isStandard } = window['SLM']['theme-shared/components/pay-button/additional-button/index.js'];
  const { EPaymentUpdate, EPaymentUpdateType } = window['SLM']['theme-shared/components/pay-button/constants.js'];
  const { isNewExpressCheckout } = window['SLM']['theme-shared/components/smart-payment/utils.js'];
  const { PageType } = window['SLM']['theme-shared/components/smart-payment/payments.js'];
  const LoggerService = window['SLM']['commons/logger/index.js'].default;
  const { Status: LoggerStatus } = window['SLM']['commons/logger/index.js'];
  const SkuCard = window['SLM']['cart/script/components/sku-card.js'].default;
  const { initMainCartSticky, listenHeaderSectionChange, initMiniCartSticky } = window['SLM']['cart/script/biz/sticky-cart/index.js'];
  const SummationModule = window['SLM']['cart/script/biz/trade-summations/index.js'].default;
  const initCoupon = window['SLM']['cart/script/biz/trade-coupon/index.js'].default;
  const CheckoutModule = window['SLM']['cart/script/biz/checkout/module_checkout.js'].default;
  const { newExpressCheckoutModule } = window['SLM']['cart/script/biz/checkout/module_express_checkout.js'];
  const PayemtnButtonModule = window['SLM']['cart/script/biz/checkout/payment_button.js'].default;
  const CheckoutErrorModule = window['SLM']['cart/script/biz/checkout-error/index.js'].default;
  const CartService = window['SLM']['cart/script/service/cart/index.js'].default;
  const Service = window['SLM']['cart/script/service/index.js'].default;
  const context = window['SLM']['cart/script/utils/context/index.js'].default;
  const cartServiceValuer = window['SLM']['cart/script/valuer/cartService.js'].default;
  const cartConstant = window['SLM']['cart/script/biz/cart/contant.js'].default;
  const valuer = window['SLM']['cart/script/valuer/index.js'].default;
  const CartBanner = window['SLM']['cart/script/components/banner.js'].default;
  const initTradeCheckbox = window['SLM']['cart/script/components/trade-checkbox/index.js'].default;
  const cartReport = window['SLM']['cart/script/report/cartReport.js'].default;
  const checkoutEffect = window['SLM']['cart/script/biz/checkout/effect.js'].default;
  const logger = LoggerService.pipeOwner(`${Owner.cart} biz/cart/index.js`);
  const cartToken = Cookie.get('t_cart');
  const listenMap = {};
  class CartModule {
    constructor(cartType) {
      this._cartType = cartType;
      this._skuCardComponent = null;
      this._ctx = null;
      this._isStandard = isStandard();
      this._initAfterLoaded();
    }
    _initCurrencyChangeListener() {
      const cartRootNode = this._root;
      SL_State.on('currencyCode', () => {
        const amountNode = cartRootNode.find('[data-amount]');
        amountNode.each(function () {
          $(this).html(convertFormat($(this).attr('data-amount')));
        });
      });
    }
    _initAfterLoaded() {
      logger.info(`normal 主站购物车 初始化 _initAfterLoaded`, {
        data: {
          cartToken
        },
        action: Action.InitCart,
        status: LoggerStatus.Success
      });
      if (document.readyState !== 'loading') {
        this._init();
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          this._init();
        });
      }
    }
    _init() {
      logger.info(`normal 主站购物车 全局化 cart service _init`, {
        data: {
          cartToken
        },
        action: Action.InitCart,
        status: LoggerStatus.Start
      });
      Service.init();
      let ctx = context.background();
      ctx = context.withValue(ctx, cartServiceValuer.valuer, CartService.takeCartService());
      ctx = valuer.checkoutHooksValuer.withCheckoutHooks(ctx);
      ctx = valuer.cartActionHooksValuer.withCartActionHooks(ctx);
      this._ctx = ctx;
      if (this._cartType === 'main') {
        logger.info(`normal 主站购物车 _init`, {
          data: {
            cartToken
          },
          action: Action.InitCart,
          status: LoggerStatus.Start
        });
        initMainCartSticky();
        try {
          SummationModule.init('cart');
        } catch (error) {
          logger.error(`normal 主站购物车 _init SummationModule 初始化失败`, {
            data: {
              cartToken
            },
            action: Action.InitCart,
            error,
            errorLevel: 'P0'
          });
        }
        try {
          initCoupon(`.${this._cartType}`);
        } catch (error) {
          logger.error(`normal 主站购物车 _init Coupon 初始化失败`, {
            data: {
              cartToken
            },
            action: Action.InitCart,
            error,
            errorLevel: 'P0'
          });
        }
        if (!this._isStandard) {
          logger.info(`normal 主站购物车 Paypal 初始化 _init`, {
            data: {
              cartToken
            },
            action: Action.InitCart,
            status: LoggerStatus.Start
          });
          try {
            this._initMainPaypalModule();
          } catch (error) {
            logger.error(`normal 主站购物车 _init PaypalModule 初始化失败`, {
              data: {
                cartToken
              },
              action: Action.InitCart,
              error,
              errorLevel: 'P0'
            });
          }
          logger.info(`normal 主站购物车 SummationModule 初始化 _init`, {
            data: {
              cartToken
            },
            action: Action.InitCart,
            status: LoggerStatus.Success
          });
        }
        logger.info(`非 main 主站购物车 Coupon 初始化 _init`, {
          data: {
            cartToken
          },
          action: Action.InitCart,
          status: LoggerStatus.Start
        });
      } else {
        listenHeaderSectionChange();
        new TopDrawer('cart-select');
        this._initBanner();
        initTradeCheckbox();
        const cartOpenType = window.SL_State.get('theme.settings.cart_open_type');
        if (cartOpenType === 'drawer') {
          initMiniCartSticky();
          SummationModule.init('miniCart');
          initCoupon(`.${this._cartType}`);
        } else {
          CartBanner.init();
        }
        logger.info(`normal 主站购物车 CartBanner 初始化 _init`, {
          data: {
            cartToken
          },
          action: Action.InitCart,
          status: LoggerStatus.Start
        });
      }
      if (this._isStandard) {
        this._initPayButton();
      }
      const cartOpenType = window.SL_State.get('theme.settings.cart_open_type');
      if (cartOpenType === 'drawer' || this._cartType === 'main') {
        this._skuCardComponent = new SkuCard(ctx, this._cartType);
        this._skuCardComponent.init();
      }
      if (!this._isStandard) {
        if (!isNewExpressCheckout(PageType.Cart) || this._cartType !== 'main') {
          this._initCheckoutModule();
        }
      }
      this._initCheckoutErrorModule();
      this._root = $(`.${this._cartType === 'main' ? 'trade_cart' : 'trade_mini_cart'}`);
      this._initCurrencyChangeListener();
      if (window.location.pathname === window.Shopline.redirectTo('/cart') && this._cartType === 'main') {
        const cartInfo = SL_State.get('cartInfo');
        cartReport.viewCart(cartInfo);
      }
    }
    _initCheckoutModule() {
      logger.info(`normal 主站购物车 结算按钮初始化 _initCheckoutModule`, {
        data: {
          cartToken
        },
        action: Action.InitCart,
        status: LoggerStatus.Start
      });
      const nodeList = document.querySelectorAll(`.${this._cartType}__trade-cart-checkout [data-sl-module=${cartConstant.MODULE_BUTTON_CHECKOUT}]`);
      const extra = {
        stage: this._cartType === 'main' ? cartPage.Cart : cartPage.MiniCart
      };
      nodeList.forEach(el => {
        const key = el.getAttribute('id');
        if (!listenMap[key]) {
          CheckoutModule.newCheckoutModule(this._ctx, el, extra);
          listenMap[key] = 1;
        }
      });
      logger.info(`normal 主站购物车 结算按钮初始化 _initCheckoutModule`, {
        data: {
          cartToken
        },
        action: Action.InitCart,
        status: LoggerStatus.Success
      });
    }
    _initCheckoutErrorModule() {
      logger.info(`normal 主站购物车 结账错误初始化 _initCheckoutErrorModule`, {
        data: {
          cartToken
        },
        action: Action.InitCart,
        status: LoggerStatus.Start
      });
      const nodeList = document.querySelectorAll(`.${this._cartType}__trade-cart-checkout-error`);
      nodeList.forEach(el => {
        CheckoutErrorModule.newCheckoutErrorModule(this._ctx, el);
      });
      logger.info(`normal 主站购物车 结账错误初始化 _initCheckoutErrorModule`, {
        data: {
          cartToken
        },
        action: Action.InitCart,
        status: LoggerStatus.Success
      });
    }
    _initMainPaypalModule() {
      logger.info(`main 主站购物车 Paypal 初始化 _initMainPaypalModule`, {
        data: {
          cartToken
        },
        action: Action.InitCart,
        status: LoggerStatus.Start
      });
      const props = {
        ctx: this._ctx,
        pageType: cartPage.Cart,
        cbFn: () => this._initCheckoutModule(),
        elementId: 'cart-spb'
      };
      if (isNewExpressCheckout(PageType.Cart)) {
        PayemtnButtonModule.newButtonModule(props);
        PayemtnButtonModule.newButtonModule({
          ...props,
          elementId: 'cart-spb-fixed'
        });
      } else {
        newExpressCheckoutModule(props);
        newExpressCheckoutModule({
          ...props,
          elementId: 'cart-spb-fixed'
        });
      }
      logger.info(`main 主站购物车 Paypal 初始化 _initMainPaypalModule`, {
        data: {
          cartToken
        },
        action: Action.InitCart,
        status: LoggerStatus.Success
      });
    }
    _initBanner() {
      logger.info(`mini 主站购物车 banner 初始化`, {
        action: Action.InitCart,
        status: LoggerStatus.Start
      });
      $(document).on('click', '.trade-cart-banner--close', () => {
        window.SL_EventBus.emit(DRAWER_EVENT_NAME, {
          id: 'cart-select',
          operator: DRAWER_OPERATORS.CLOSE
        });
      });
    }
    getButtonStyleBySetting(wrapperCls) {
      const {
        btn_border_thickness,
        btn_border_radius
      } = window.Shopline.theme.settings;
      const borderRadius = btn_border_thickness + btn_border_radius;
      return {
        height: $(`#${wrapperCls} .pay-button-checkout`).outerHeight(),
        borderRadius
      };
    }
    async _initPayButton() {
      const CART_TYPE = {
        MAIN: 'main',
        DRAWER: 'drawer',
        MINI: 'mini'
      };
      const mainCartIds = ['additional_button_cart-spb', 'additional_button_cart-spb-fixed'];
      const drawerCartIds = ['additional_button_mini-cart-spb', 'additional_button_mini-cart-spb-fixed'];
      const miniCartIds = ['additional_button_mini-cart-pay-button'];
      const cartOpenType = SL_State.get('theme.settings.cart_open_type');
      const buttonStyle = this.getButtonStyleBySetting(mainCartIds[0]);
      const config = {
        getSaveAbandonOrderParams: () => {
          const cartService = cartServiceValuer.withCartService(this._ctx);
          const cartItemList = cartService.getCardItemList();
          const params = checkoutEffect.getCheckoutParams(this._ctx, cartItemList);
          return {
            products: params && params.products,
            discountCodes: params && params.discountCode,
            useMemberPoint: params && params.useMemberPoint
          };
        },
        props: {
          style: {
            height: buttonStyle.height,
            'border-radius': buttonStyle.borderRadius
          }
        }
      };
      let payButton = null;
      let fixedPayButton = null;
      if (this._cartType === 'main') {
        payButton = new AdditionalButton({
          ...config,
          domId: mainCartIds[0],
          props: {
            ...config.props,
            cartType: CART_TYPE.MAIN
          }
        });
        fixedPayButton = new AdditionalButton({
          ...config,
          domId: mainCartIds[1],
          props: {
            ...config.props,
            cartType: CART_TYPE.MAIN
          }
        });
      } else if (cartOpenType === 'drawer') {
        payButton = new AdditionalButton({
          ...config,
          domId: drawerCartIds[0],
          buttonTypes: ['normalButton'],
          props: {
            cartType: CART_TYPE.DRAWER
          }
        });
        fixedPayButton = new AdditionalButton({
          ...config,
          domId: drawerCartIds[1],
          props: {
            cartType: CART_TYPE.DRAWER
          }
        });
      } else {
        payButton = new AdditionalButton({
          ...config,
          domId: miniCartIds[0],
          buttonTypes: ['normalButton'],
          props: {
            cartType: CART_TYPE.MINI
          }
        });
      }
      await Promise.all([payButton && payButton.render(), fixedPayButton && fixedPayButton.render()].filter(item => Boolean(item)));
      window.Shopline.event.emit(EPaymentUpdate, {
        type: EPaymentUpdateType.CartPayButton,
        data: [payButton, fixedPayButton].filter(item => Boolean(item))
      });
    }
  }
  _exports.default = CartModule;
  return _exports;
}();