var exports = this;

(function ($) {
  var mod = {};

  var eventSplitter = /^(\w+)\s*(.*)$/;
  var delegateEvents = function(events) {
    var eventList = [];
    for (var key in events) {
      var methodName = events[key];
      var match = key.match(eventSplitter);
      var eventName = match[1],
          selector = match[2];

      eventList.push({
        selector: selector,
        eventName: eventName,
        methodName: methodName
      });
    }
    return eventList;
  };
  
  mod.create = function (includes) {
    var result = function () {
      this.init.apply(this, arguments);
    };
    
    result.fn = result.prototype;
    result.fn.init = function () {};
    
    result.fn.proxy = result.proxy = function (func) {
      return $.proxy(func, this);
    };
    
    result.include = function (obj) {
      $.extend(this.fn, obj);
    };
    
    result.extend = function (obj) {
      $.extend(this, obj);
    };

    result.include({
      initializer: function(options) {
        for (var key in options) {
          this[key] = options[key];
        }

        if (this.events) {
          var eventList = delegateEvents(this.events);
          if (eventList && eventList.length > 0) {
            if (this.el) {
              for (var i = 0, len = eventList.length; i < len; i++) {
                var selector = eventList[i].selector,
                    eventName = eventList[i].eventName,
                    methodName = eventList[i].methodName,
                    method = this.proxy(this[methodName]);

                if (selector === '') {
                  this.el.bind(eventName, method);
                } else {
                  this.el.delegate(selector, eventName, method);
                }
              }
            }
          }
        }
      }
    });
    
    if (includes) {
      result.include(includes);
    }
    
    return result;
  };
  
  exports.Controller = mod;
})(jQuery);