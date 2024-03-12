window.SLM = window.SLM || {};
window.SLM['stage/video/utils/LibraryLoader.js'] = window.SLM['stage/video/utils/LibraryLoader.js'] || function () {
  const _exports = {};
  const libraries = {
    youtubeSdk: {
      tagId: 'youtube-sdk',
      src: 'https://www.youtube.com/iframe_api',
      type: 'script'
    },
    vimeo: {
      tagId: 'vimeo-api',
      src: 'https://player.vimeo.com/api/player.js',
      type: 'script'
    }
  };
  const status = {
    requested: 'requested',
    loaded: 'loaded'
  };
  function createScriptTag(library, callback) {
    const tag = document.createElement('script');
    tag.src = library.src;
    tag.addEventListener('load', function () {
      Object.assign(library, {
        status: status.loaded
      });
      callback();
    });
    return tag;
  }
  function load(libraryName, _callback) {
    const library = libraries[libraryName];
    if (!library) return;
    if (library.status === status.requested) return;
    const callback = _callback || function () {};
    if (library.status === status.loaded) {
      callback();
      return;
    }
    library.status = status.requested;
    const tag = createScriptTag(library, callback);
    tag.id = library.tagId;
    library.element = tag;
    const firstScriptTag = document.getElementsByTagName(library.type)[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
  const LibraryLoader = {
    load
  };
  _exports.default = LibraryLoader;
  return _exports;
}();