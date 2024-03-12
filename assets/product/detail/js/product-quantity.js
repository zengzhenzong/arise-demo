window.SLM = window.SLM || {};
window.SLM['product/detail/js/product-quantity.js'] = window.SLM['product/detail/js/product-quantity.js'] || function () {
  const _exports = {};
  const DataWatcher = window['SLM']['theme-shared/utils/sku/DataWatcher.js'].default;
  const { t } = window['SLM']['theme-shared/utils/i18n.js'];
  const FlashSale = window['SLM']['theme-shared/components/hbs/flashSale/index.js'].default;
  const get = window['lodash']['get'];
  const SkuStepper = window['SLM']['product/commons/js/sku-stepper.js'].default;
  const { processPrice, convertPrice } = window['SLM']['commons/utils/convertPrice.js'];
  const initValue = 1;
  _exports.initValue = initValue;
  class SkuQuality {
    constructor({
      sku,
      spu,
      activeSku,
      id,
      onChange,
      dataPool,
      isCheckStock = true,
      isOpenFlashSale,
      fixedMax = 0,
      isShowTips = true
    }) {
      this.activeSku = activeSku;
      this.sku = sku;
      this.spu = spu;
      this.id = id;
      this.root = `#product-detail-sku-quantity_${id}`;
      this.isOpenFlashSale = isOpenFlashSale || $(`#has-b2b-plugin-${id}`).length <= 0;
      this.dataPool = dataPool || new DataWatcher();
      this.onChange = onChange;
      this.isCheckStock = isCheckStock;
      this.fixedMax = fixedMax;
      this.isShowTips = isShowTips;
      this.productHasQuantityRule = get(this.sku, 'skuList.length') ? this.sku.skuList.some(skuItem => {
        return skuItem.quantity_rule && (skuItem.quantity_rule.min > 1 || skuItem.quantity_rule.increment > 1 || skuItem.quantity_rule.max);
      }) : false;
      this.init();
    }
    getMax(hasQuantityRule = false) {
      if (this.fixedMax) {
        return this.fixedMax;
      }
      if (!this.activeSku) {
        return 99999;
      }
      if (hasQuantityRule) {
        return 99999 - 99999 % (this.activeSku.quantity_rule.increment || 1);
      }
      if (this.isTrackStock() && this.isCheckStock) {
        return this.activeSku.stock > 0 ? Math.min(99999, this.activeSku.stock) : 1;
      }
      return 99999;
    }
    isTrackStock() {
      return !get(this.activeSku, 'infiniteStock') && !get(this.activeSku, 'allowOversold');
    }
    init() {
      const $quantityInput = document.querySelector(`${this.root} input`);
      this.skuStepper = new SkuStepper({
        domReady: true,
        root: $(`#product-detail-sku-stepper_${this.id}`),
        max: this.getMax(),
        value: $quantityInput ? +$quantityInput.value : initValue,
        min: 1,
        disabled: get(this.spu, 'soldOut') || this.isTrackStock() && this.activeSku && this.activeSku.stock < 1,
        showOverStockToast: this.isShowTips,
        onChange: num => {
          if (num !== this.dataPool.quantity) {
            this.dataPool.quantity = num;
          }
          this.onChange && this.onChange(num);
        }
      });
      if (this.isOpenFlashSale) {
        new FlashSale({
          id: `${this.id}`
        }).init();
      }
      this.dataPool.quantity = $quantityInput ? $quantityInput.value : initValue;
      this.dataPool.watch(['quantity'], () => {
        this.setCurrentNum(this.dataPool.quantity);
        this.renderHitPrice();
      });
    }
    render() {
      if (this.isShowTips) {
        const showTips = this.isTrackStock() && this.activeSku && this.activeSku.stock < 10 && this.activeSku.stock > 0;
        if (showTips) {
          const content = t(`cart.stock.limit`, {
            stock: this.activeSku.stock
          });
          this.setErrorTips(showTips, content);
        } else {
          this.setErrorTips(showTips);
        }
      } else {
        let content = '';
        if (!this.activeSku) {
          content = '0';
          $(`#product-in-stock_${this.id} .stock-num`).html(content);
          $(`#product-in-stock_${this.id}`).addClass('stock-hide');
        } else {
          if (this.activeSku.infiniteStock) {
            content = t('products.product_details.in_stock');
          } else if (!this.activeSku.infiniteStock && !this.activeSku.allowOversold) {
            if (this.activeSku.stock >= 0) {
              content = this.activeSku.stock > 99999 ? 99999 : this.activeSku.stock;
            } else {
              content = 0;
            }
          } else if (!this.activeSku.infiniteStock && this.activeSku.allowOversold) {
            content = t('products.product_details.in_stock');
          }
          $(`#product-in-stock_${this.id} .stock-num`).html(content);
          $(`#product-in-stock_${this.id}`).removeClass('stock-hide');
        }
      }
      this.renderGradsPrice();
      this.renderQuantityRule();
      this.renderHitPrice();
    }
    setErrorTips(show, content) {
      if (show) {
        $(this.root).parent('.product-sku-quantity__container').children('.stepper-tip').html(content).removeClass('d-none');
      } else {
        $(this.root).parent('.product-sku-quantity__container').children('.stepper-tip').addClass('d-none');
      }
    }
    setCurrentNum(num) {
      const data = {
        ...this.skuStepper.data,
        value: num
      };
      this.skuStepper.setStepperData(data);
    }
    setActiveSku(sku) {
      let current = this.skuStepper.data.value < 0 ? 1 : this.skuStepper.data.value;
      if (!sku) {
        this.activeSku = null;
        const stepperData = this.productHasQuantityRule ? {
          value: current,
          max: this.fixedMax || 99999,
          disabled: false,
          step: 1,
          showOverStockToast: true,
          showMoqToast: false,
          min: 1
        } : {
          value: current,
          max: this.fixedMax || 99999,
          disabled: false
        };
        this.skuStepper.setStepperData(stepperData);
        this.render();
        return;
      }
      this.activeSku = sku;
      const hasQuantityRule = this.activeSku.quantity_rule && (this.activeSku.quantity_rule.min > 1 || this.activeSku.quantity_rule.increment > 1 || this.activeSku.quantity_rule.max);
      if (current > this.getMax() && !hasQuantityRule) {
        current = this.getMax();
        if (!sku.soldOut && this.isShowTips) {
          this.skuStepper.toast.open(t(`cart.stock.limit`, {
            stock: current
          }), 1000);
        }
      }
      if (!document.querySelector(this.root) && this.productHasQuantityRule) {
        current = get(this.activeSku, 'quantity_rule.min') || 1;
      }
      const stepperData = this.productHasQuantityRule ? {
        value: current,
        max: get(this.activeSku, 'quantity_rule.max') ? get(this.activeSku, 'quantity_rule.max') : this.getMax(hasQuantityRule),
        disabled: !this.activeSku.quantity_rule && (this.spu.soldOut || this.isTrackStock() && this.activeSku.stock < 1),
        step: this.activeSku.quantity_rule ? this.activeSku.quantity_rule.increment : 1,
        min: get(this.activeSku, 'quantity_rule.min') ? get(this.activeSku, 'quantity_rule.min') : 1,
        showOverStockToast: !hasQuantityRule,
        showMoqToast: hasQuantityRule
      } : {
        value: current,
        max: this.getMax(),
        disabled: this.spu.soldOut || this.isTrackStock() && this.activeSku && this.activeSku.stock < 1
      };
      this.skuStepper.setStepperData(stepperData);
      if (hasQuantityRule) {
        this.skuStepper.processNewInputValue(current);
      }
      this.render();
    }
    renderGradsPrice() {
      const $gradsContainer = $(this.root).parent('.product-sku-quantity__container').children(' .product-moq-grads-price')[0];
      if (!$gradsContainer) return;
      if (!this.activeSku || !get(this.activeSku, 'quantity_price_breaks.length')) {
        $gradsContainer.classList.add('hide');
        return;
      }
      let gradsContentStr = `
    <div class="product-moq-grads-price-row">
      <div class="product-moq-grads-price-content">${t(`products.product_details.amount`)}</div>
      <div class="product-moq-grads-price-content">${t(`products.product_details.price`)}</div>
    </div>
    <div class="product-moq-grads-price-row">
        <div class="product-moq-grads-price-content">${get(this.activeSku, 'quantity_rule.min') || 1}+</div>
        <div class="product-moq-grads-price-content">
          ${t(`products.product_details.table_each_price`, {
        price: ` <span class="body1">${processPrice(null, this.activeSku.price).get()}</span>`
      })}
        </div>
    </div>`;
      this.activeSku.quantity_price_breaks.forEach(breakItem => {
        gradsContentStr += `
      <div class="product-moq-grads-price-row">
        <div class="product-moq-grads-price-content">${breakItem.minimum_quantity}+</div>
        <div class="product-moq-grads-price-content">
            ${t(`products.product_details.table_each_price`, {
          price: ` <span class="body1">${processPrice(null, breakItem.price).get()}</span>`
        })}
        </div>
    </div>`;
      });
      $gradsContainer.querySelector('.product-moq-grads-price-table').innerHTML = gradsContentStr;
      $gradsContainer.classList.remove('hide');
    }
    renderQuantityRule() {
      const $ruleContainer = $(this.root).parent('.product-sku-quantity__container').children(' .product-moq-quantity-rule')[0];
      const hasQuantityRule = get(this.activeSku, 'quantity_rule') && (this.activeSku.quantity_rule.min > 1 || this.activeSku.quantity_rule.increment > 1 || this.activeSku.quantity_rule.max);
      if (!$ruleContainer) return;
      if (!hasQuantityRule) {
        $ruleContainer.classList.add('hide');
        return;
      }
      let ruleStr = '';
      if (this.activeSku.quantity_rule.increment > 1) ruleStr += `${t(`products.product_details.moq_increment`, {
        num: this.activeSku.quantity_rule.increment
      })}`;
      if (this.activeSku.quantity_rule.min > 1) ruleStr += ` • ${t(`products.product_details.moq_minimum`, {
        num: this.activeSku.quantity_rule.min
      })}`;
      if (this.activeSku.quantity_rule.max > 1) ruleStr += ` • ${t(`products.product_details.moq_maximum`, {
        num: this.activeSku.quantity_rule.max
      })}`;
      $ruleContainer.innerHTML = ruleStr;
      $ruleContainer.classList.remove('hide');
    }
    renderHitPrice() {
      const $priceContainer = $(this.root).parent('.product-sku-quantity__container').children(` .product-sku-moq-price`)[0];
      if (!$priceContainer) return;
      if (!get(this.activeSku, 'quantity_price_breaks.length')) {
        $priceContainer.classList.add('hide');
        return;
      }
      let hitPrice = this.activeSku.price;
      if (this.dataPool.quantity >= this.activeSku.quantity_price_breaks[0].minimum_quantity) {
        const hitBreak = [...this.activeSku.quantity_price_breaks].reverse().find(breakItem => {
          return breakItem.minimum_quantity <= this.dataPool.quantity;
        });
        hitPrice = hitBreak.price;
      }
      $priceContainer.innerHTML = `${t(`products.product_details.each_price`, {
        price: convertPrice(hitPrice, {}).origin
      })}`;
      $priceContainer.classList.remove('hide');
    }
  }
  _exports.default = SkuQuality;
  return _exports;
}();