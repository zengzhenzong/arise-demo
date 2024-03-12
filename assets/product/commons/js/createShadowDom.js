window.SLM = window.SLM || {};
window.SLM['product/commons/js/createShadowDom.js'] = window.SLM['product/commons/js/createShadowDom.js'] || function () {
  const _exports = {};
  const shadowDomStyle = $('<style></style>').attr({
    type: 'text/css'
  }).append(`table{border-collapse:collapse}table:not([cellpadding]) td,table:not([cellpadding]) th{padding:.4rem}table:not([border="0"]):not([style*=border-width]) td,table:not([border="0"]):not([style*=border-width]) th{border-width:1px}table:not([border="0"]):not([style*=border-style]) td,table:not([border="0"]):not([style*=border-style]) th{border-style:solid}table:not([border="0"]):not([style*=border-color]) td,table:not([border="0"]):not([style*=border-color]) th{border-color:#ccc}iframe,video{max-width:100%;outline:none}img{height:auto;max-width:100%}figure{display:table;margin:1rem auto}figure figcaption{color:#999;display:block;margin-top:.25rem;text-align:center}hr{border-color:#ccc;border-style:solid;border-width:1px 0 0 0}code{background-color:#e8e8e8;border-radius:3px;padding:.1rem .2rem}.mce-content-body:not([dir=rtl]) blockquote{border-left:2px solid #ccc;margin-left:1.5rem;padding-left:1rem}.mce-content-body[dir=rtl] blockquote{border-right:2px solid #ccc;margin-right:1.5rem;padding-right:1rem}@media screen and (max-width: 750px){table{width: 100%!important}}`);
  _exports.shadowDomStyle = shadowDomStyle;
  const createShadowDom = () => {
    const shadowDoms = document.querySelectorAll('[data-node=shadow-dom]');
    if (!shadowDoms.length) return;
    shadowDoms.forEach(el => {
      const shadowContent = $(el).prev('[data-node=shadow-content]');
      $(el).attr('class', 'shadow-dom');
      if (shadowContent.get(0)) {
        shadowContent.children('.mce-content-body').css('word-break', 'break-word');
        shadowContent.prepend($('<style></style>').attr({
          type: 'text/css'
        }).append(`body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;line-height:1.4;margin:1rem}table{border-collapse:collapse}table:not([cellpadding]) td,table:not([cellpadding]) th{padding:.4rem}table:not([border="0"]):not([style*=border-width]) td,table:not([border="0"]):not([style*=border-width]) th{border-width:1px}table:not([border="0"]):not([style*=border-style]) td,table:not([border="0"]):not([style*=border-style]) th{border-style:solid}table:not([border="0"]):not([style*=border-color]) td,table:not([border="0"]):not([style*=border-color]) th{border-color:#ccc}iframe,video{max-width:100%;outline:none}img{height:auto;max-width:100%}figure{display:table;margin:1rem auto}figure figcaption{color:#999;display:block;margin-top:.25rem;text-align:center}hr{border-color:#ccc;border-style:solid;border-width:1px 0 0 0}code{background-color:#e8e8e8;border-radius:3px;padding:.1rem .2rem}.mce-content-body:not([dir=rtl]) blockquote{border-left:2px solid #ccc;margin-left:1.5rem;padding-left:1rem}.mce-content-body[dir=rtl] blockquote{border-right:2px solid #ccc;margin-right:1.5rem;padding-right:1rem}@media screen and (max-width: 750px){table{width: 100%}} .mce-content-body p:first-child { margin-top: 0 } .mce-content-body p:last-child { margin-bottom: 0 }`));
        const shadowRoot = el.attachShadow({
          mode: 'open'
        });
        shadowRoot.append(shadowContent.get(0));
        $(el).removeAttr('data-node');
        shadowContent.removeAttr('data-node');
      }
      el.__updateLazyExtraElements__();
    });
  };
  _exports.default = createShadowDom;
  return _exports;
}();