window.SLM = window.SLM || {};
window.SLM['commons/utils/convertPrice.js'] = window.SLM['commons/utils/convertPrice.js'] || function () {
  const _exports = {};
  const currency = window['SLM']['theme-shared/utils/newCurrency/index.js'].default;
  const {
    convertFormat,
    getConvertPrice
  } = currency;
  function convertPrice(price, {
    code,
    lang
  }) {
    const formattedPrice = convertFormat(price);
    if (code === null || code === undefined) {
      code = window.SL_State.get('currencyCode');
    }
    if (lang === null || lang === undefined) {
      lang = window.SL_State.get('request.locale');
    }
    const {
      symbolOrder,
      currencySymbol,
      integer,
      decimal,
      fraction
    } = getConvertPrice(price, {
      code,
      lang
    });
    return {
      symbolIsPrefix: symbolOrder === 'prefix',
      symbol: currencySymbol,
      integer,
      decimal,
      fraction,
      origin: formattedPrice
    };
  }
  _exports.convertPrice = convertPrice;
  function processPrice($el, price, {
    isSavePrice,
    code,
    lang
  } = {}) {
    const {
      origin
    } = convertPrice(price, {
      code,
      lang
    });
    let content = '';
    const renderSavePrice = () => {
      return `<span class="notranslate">${origin}</span>`;
    };
    content = `<span class="notranslate">${origin}</span>`;
    if (isSavePrice) {
      content = renderSavePrice();
    }
    return {
      render: () => {
        $el.html(content);
      },
      get: () => content
    };
  }
  _exports.processPrice = processPrice;
  return _exports;
}();