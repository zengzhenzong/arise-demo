window.SLM = window.SLM || {};
window.SLM['theme-shared/biz-com/customer/biz/address/address-component/autocomplete.js'] = window.SLM['theme-shared/biz-com/customer/biz/address/address-component/autocomplete.js'] || function () {
  const _exports = {};
  const { request } = window['SLM']['theme-shared/biz-com/customer/helpers/request.js'];
  const { PLACE_AUTOCOMPLETE, PLACE_DETAIL } = window['SLM']['theme-shared/biz-com/customer/constant/url.js'];
  class AutocompleteService {
    constructor(regionCode, lang) {
      this.placeIdMetaCache = {};
      this.regionCode = regionCode;
      this.lang = lang;
      this.predictionRequest = async params => {
        const res = await request.get(PLACE_AUTOCOMPLETE, {
          params: {
            input: params.keyword,
            country: this.regionCode,
            language: this.lang,
            scene: 'settlePage'
          }
        });
        if (res.code === 'SUCCESS' && res.data) {
          const {
            token,
            predictions,
            type
          } = res.data;
          (predictions || []).forEach(v => {
            this.placeIdMetaCache[v.placeId] = {
              token,
              type,
              input: params.keyword
            };
          });
          return responseCompleteWithData({
            type: res.data.type,
            list: res.data.predictions || []
          });
        }
        return responseFailWithCode(res.code);
      };
      this.shoplinePlaceDetailRequest = async params => {
        const cache = this.placeIdMetaCache[params.placeId];
        const res = await request.get(PLACE_DETAIL, {
          params: {
            placeId: params.placeId,
            country: this.regionCode,
            token: cache ? cache.token : undefined,
            language: this.lang,
            type: cache ? cache.type : undefined
          }
        });
        if (res.code === 'SUCCESS' && res.data) {
          return responseCompleteWithData(res.data);
        }
        return responseFailWithCode(res.code);
      };
    }
  }
  _exports.AutocompleteService = AutocompleteService;
  function responseCompleteWithData(data) {
    return {
      success: true,
      data
    };
  }
  _exports.responseCompleteWithData = responseCompleteWithData;
  function responseFailWithCode(code, traceId, msg) {
    return {
      success: false,
      code,
      msg,
      traceId
    };
  }
  _exports.responseFailWithCode = responseFailWithCode;
  return _exports;
}();