window.SLM = window.SLM || {};
window.SLM['stage/header/scripts/mobile-locale-currency-drawer.js'] = window.SLM['stage/header/scripts/mobile-locale-currency-drawer.js'] || function () {
  const _exports = {};
  const Base = window['SLM']['commons/base/BaseClass.js'].default;
  const TopDrawer = window['SLM']['commons/components/topDrawer/index.js'].default;
  class DrawerMenu extends Base {
    constructor() {
      super();
      this.config = {
        namespace: 'stage:mobileLocaleCurrencyDrawer'
      };
      this.classes = {};
      this.selector = {
        drawer: '.stage-top-drawer.top-drawer--open',
        localeCurrencyContainer: '.drawer-menu-locale-currency',
        localeBtn: '.j-locale-drawer-btn',
        countryBtn: '.j-country-drawer-btn'
      };
      this.drawers = {
        localeDrawer: null,
        countryDrawer: null
      };
      this.$setNamespace(this.config.namespace);
      this.init();
      this.bindEvent();
      this.bindLocaleCurrencyChange();
    }
    init() {
      this.drawers.localeDrawer = new TopDrawer('global-locale-drawer', {
        fullScreen: true
      });
      this.drawers.countryDrawer = new TopDrawer('global-country-drawer', {
        fullScreen: true
      });
    }
    bindEvent() {
      this.$on('click', this.selector.localeBtn, () => {
        this.drawers.localeDrawer.open();
      });
      this.$on('click', this.selector.countryBtn, () => {
        this.drawers.countryDrawer.open();
      });
    }
    bindLocaleCurrencyChange() {
      this.$on('click', `${this.selector.localeCurrencyContainer} li`, e => {
        const $target = $(e.currentTarget);
        const drawerId = $target.parents(this.selector.drawer).eq(0).attr('id');
        Object.keys(this.drawers).forEach(key => {
          const drawer = this.drawers[key];
          if (drawer.id === drawerId) {
            drawer.close();
          }
        });
      });
    }
    off() {
      this.drawers.localeDrawer.$offAll();
      this.drawers.countryDrawer.$offAll();
      this.$offAll();
    }
  }
  let instance = new DrawerMenu();
  $(document).on('shopline:section:load', () => {
    instance.off();
    instance = new DrawerMenu();
  });
  return _exports;
}();