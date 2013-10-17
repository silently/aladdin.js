var Aladdin = { Lamp: function(){} };

(function() {
  // naive runtime dependency check
  if(typeof _ === 'undefined') return console.log('underscore or lodash needed');

  // following the Genius' specs
  Aladdin.Lamp.prototype = (function() {

    // private properties
    var self = this,
      wishes = {},
      globalCallbacks = [],
      bundleCallbacks = {},
      cache = {},

    // private methods
      prepare = function(uri, bundle) {
        if(typeof bundle === 'undefined') bundle = 'misc';
        if(!_.contains(wishes[bundle], uri)) {
          wishes[bundle] = wishes[bundle] || [];
          wishes[bundle].push(uri);
          if(!_.has(cache, uri)) cache[uri] = new Image();
        }
      },
      fulfill = function(bundle) {
        var cbs;// cloning callbacks: when chaining rubs, prevent from invoking a callback multiple times
        if(typeof bundle === 'undefined') {
          cbs = globalCallbacks.slice(0);
          globalCallbacks = [];
          while(cbs[0]) {
            cbs.shift().call(null, self);
          }
        } else {
          cbs = bundleCallbacks[bundle].slice(0);
          delete bundleCallbacks[bundle];
          while(cbs[0]) {
            cbs.shift().call(null, self);
          }
        }
      },
      request = function(uri, bundle) {
        if(typeof uri === 'string') {
          prepare(uri, bundle);
        } else if(typeof uri === 'object' && uri instanceof Array) {
          for(var i = 0, max = uri.length; i < max; i++) {
            prepare(uri[i], bundle);
          }
        }
        return self;
      },
      rub = function(bundle) {
        // clone and init
        var downloads;
        if(bundle) {
          downloads = wishes[bundle].slice(0);
          delete wishes[bundle];
        } else {
          downloads = _.reduce(wishes, function(union, w) { return _.union(union, w); }, []);
          wishes = {};
        }
        // cleanup downloads
        downloads = _.uniq(downloads);
        // resolve if nothing is in downloading queue
        if(downloads.length === 0) return;
        // create onload
        var onload = function(uri, bundle) {
          return function() {
            downloads = _.without(downloads, uri);
            if(downloads.length === 0) return fulfill(bundle);
          };
        };
        // start downloads
        for(var i = 0, max = downloads.length, uri; i < max; i++) {
          uri = downloads[i];
          cache[uri].onload = onload(uri, bundle);
          cache[uri].src = uri;
        }
      },
      on = function(eventName, callback) {
        // args processings
        if(typeof callback === 'undefined') {
          if(typeof eventName === 'undefined') return;
          callback = eventName;
          eventName = 'fulfilled';
        }
        if(typeof eventName !== 'string' || typeof callback !== 'function') return;
        if(eventName === 'fulfilled') {
          globalCallbacks.push(callback);
        } else {
          var matches = /fulfilled:(.*)/.exec(eventName);
          if(matches) {
            var bundle = matches[1];
            bundleCallbacks[bundle] = bundleCallbacks[bundle] || [];
            bundleCallbacks[bundle].push(callback);
          }
        }
      },
      get = function(uri) {
        return cache[uri];
      },
      remove = function(uri) {
        if(cache[uri]) {
          delete cache[uri];
          return true;
        }
        return false;
      };

    // API
    return {
      request: request,
      rub: rub,
      download: rub,
      on: on,
      get: get,
      remove: remove
    };

  })();
})();