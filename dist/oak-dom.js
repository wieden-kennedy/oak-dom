/**
 * A module that provides strap functionality for modifying the dom
 * and also provides oak namespaced dom helpers. 
 */
(function (o) {
  "use strict";

  var dummy = document.createElement("div"),
      strap = {
        addClass: function (val) {
          return this.each(function (targ) {
            if (self.hasClass(targ, val) === false) {
              var cName = targ.className + ((targ.className.length) ? " " : "");
              cName += val;
              targ.className = cName;
            }
          });
        },
        // append
        // ------
        // Takes either a node, strap or string and appends it to the strapped elements
        append: function (val) {
          return this.each(function (targ) {
            if (o.isNode(val)) {
              targ.appendChild(val);
            } else if (o.isString(val)) {
              targ.appendChild(self.build(val));
            } else if (o.isStrap(val)) {
              val.each(function (el) {
                targ.appendChild(el);
              });
            }
          });
        },
        // TODO test
        attribute: function (key, val) {
          if (typeof val !== "undefined") {
            return this.each(function (targ) {
              targ.setAttribute(key, val);
            });
          } else {
            return this[0].getAttribute(key);
          }
        },
        bounds: function () {
          return this[0].getBoundingClientRect();
        },
        asString: function () {
          var tmp = document.createElement("div");
          tmp.appendChild(this[0].cloneNode(true));
          var ret = tmp.innerHTML;
          tmp = null;
          return ret;
        },
        className: function (val) {
          if (typeof val === "string") {
            return this.each(function (targ) {
              targ.className = val;
            });
          } else {
            return this[0].className;
          }
        },
        css: function (prop, val) {
          if (typeof prop === "object") {
            var key, propVal;
            for (key in prop) {
              if (prop.hasOwnProperty(key)) {
                propVal = o.isString(propVal) ? prop[key] : prop[key].toString();
                key = self.toStyle(key);
                addStyle(this, key, propVal);
              }
            }
          } else {
            prop = self.toStyle(prop);
            if (!exists(val)) {
              return this[0].style[prop] || window.getComputedStyle(this[0])[prop];
            }
            this.each(function (targ) {
              targ.style[prop] = val;
            });
          }
          return this;
        },
        // find
        // ----
        // Uses querySelectorAll to find dom elements within a strapped collection
        // Returns the results as a new strapped collection
        find: function (val) {
          var results, strap = o.strap();
          this.each(function (targ) {
            results = targ.querySelectorAll(val);
            o.each(results, function (result) {
              strap.push(result);
            });
          });
          return strap;
        },
        forceEvent: function (val) {
          return this.each(function (targ) {
            var evt;
            if (document.createEvent) {
              evt = document.createEvent('HTMLEvents');
              evt.initEvent(val, true, true);
              targ.dispatchEvent(evt);
            } else {
              // IE
              evt = document.createEventObject();
              targ.fireEvent('on' + val, evt);
            }
          });
        },
        // Checks if any objects in the collection has a class
        hasClass: function (val) {
          var has = false;
          this.each(function (targ) {
            if (self.hasClass(targ, val)) {
              has = true;
            }
          });
          return has;
        },
        // Set the inner html of all elements in the collection
        html: function (val) {
          if (val) {
            return this.each(function (targ) {
              targ.innerHTML = val;
            });
          } else {
            return this[0].innerHTML;
          }
        },
        hide: function () {
          return this.css("display", "none");
        },
        // TODO add selector support
        next: function (selector) {
          var strap = oak.strap();
          this.each(function (targ) {
            var sib = nextElementSibling(targ);
            if (sib) {
              strap.add(sib);
            }
          });
          return strap;
        },
        offset: function () {
          var 
            el = this[0],
            x = 0,
            y = 0;

          while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            x += el.offsetLeft;// - el.scrollLeft;
            y += el.offsetTop;// - el.scrollTop;
            el = el.offsetParent;
          }
          return {top: y, left: x};
        },
        prepend: function (val) {
          return this.each(function (targ) {
            var node = val;
            if(o.isStrap(val)) {
              val.each(function (node) {
                if (targ.children.length) {
                  targ.insertBefore(node, targ.firstChild);
                } else {
                  targ.appendChild(node);
                }
              });
            } else {
              if (o.isString(val)) {
                node = o.build(val);
              } else if (o.isNode(val)) {
                node = val;
              }
              if (targ.children.length) {
                targ.insertBefore(node, targ.firstChild);
              } else {
                targ.appendChild(node);
              }
            }
          });
        },
        // TODO add selector support
        prev: function (selector) {
          var strap = oak.strap();
          this.each(function (targ) {
            var sib = prevElementSibling(targ);
            if (sib) {
              strap.add(sib);
            }
          });
          return strap;
        },
        remove: function () {
          return this.each(function (targ) {
            var pNode = targ.parentNode;
            if (pNode) {
              pNode.removeChild(targ);
            }
          });
        },
        removeClass: function () {
          var i,
              vals = oak._arrProto.slice.call(arguments, 0),
              reArr = [];

          for (i = 0; i < vals.length; i += 1) {
            reArr.push('\\b' + vals[i] + '\\b\\s?');
          }

          var cName,
              re = new RegExp(reArr.join("|"), 'g');
          return this.each(function (targ) {
            cName = targ.className.replace(re, "");
            targ.className = cName;
          });
        },
        scroll: function (val) {
          return this.each(function (targ) {
            targ.scrollTop = val;
          });
        },
        show: function () {
          return this.each(function (targ) {
            targ.style.display = "block";
          });
        },
        transform: function (prop, val) {
          var transVal = this.css(o.support.transform);
          var regexp = new RegExp('(' + prop + ')\\([^\\(\\)]+\\)');
          if (regexp.test(transVal)) {
            transVal = transVal.replace(regexp, "$1(" + val + ")");
          } else {
            transVal += " " + prop + "(" + val + ")";
          }
          this.css(o.support.transform, transVal);
          return this;
        },
        visible: function (val) {
          if (o.defined(val)) {
            return this.each(function (targ) {
              targ.style.visibility = (val === false) ? "hidden" : "visible";
            });
          } else {
            return this.css("visibility") !== "hidden";
          }
        },
        x: function (val) {
          return this.transform("translateX", val); 
        },
        y: function (val) {
          return this.transform("translateY", val); 
        }
      },
      self = {
        // Build an html node from a string
        build: function (str) {
          dummy.innerHTML = str;
          var node = dummy.firstChild;
          return node;
        },
        contains: function (targ, child) {
          if (child) {
            var b;
            while (b = b.parentNode) {
              if (b === targ[0]) {
                  return true;
              }
            }
          }
          return false;
        },
        find: function (val) {
          return document.querySelector(val);
        },
        findAll: function (val) {
          return document.querySelectorAll(val);
        },
        hasClass: function (targ, val) {
          var has = false,
              re = new RegExp('\\b' + val + '\\b\\s?', 'g');
          if (re.test(targ.className)) {
            has = true;
          }
          return has;
        },
        /**
        * Converts a DOM style string into a dashed style property.
        * ie: backgroundColor => background-color
        * @param {string} str The string to be converted.
        * @return {string} The converted string.
        */
        toDash: function (val) {
          var str = val.replace(/^(webkit|moz|o|ms)(?=[A-Z]{1})/, function (x) {
            return "-" + x;
          }); 
          str = str.replace(/([A-Z])/g, function (x) {
            return '-' + x.toLowerCase();
          }); 

          return str;
        },
        /**
        * Converts a dashed string into a DOM style property.
        * ie: -webkit-transition => webkitTransition
        * @param {string} str The string to be converted.
        * @return {string} The converted string.
        */
        toStyle: function (val) {
          return val.replace(/\b-(\w{1})|-/g, function (x) {
            return x.replace(/\-/, "").toUpperCase();
          });
        },
        /**
        * Adds event for domready
        * @param {function} cb The callback
        */
        domready:function(cb){
          if(document.readyState === 'complete'){
            if(typeof cb === "function"){ cb.call(arguments, 0); }
          }else{
            document.addEventListener('readystatechange', function(){
              if(document.readyState === 'complete'){
                if(typeof cb === "function"){ cb.call(arguments, 0); }
              }
            });
          }
        }
      };

  // Loops through a collection setting a style property to the value
  function addStyle(strap, key, val) {
    strap.each(function (targ) {
      targ.style[key] = val;
    });
  }

  /**
  * Helper to see if the argument is defined and is not a falsy value.
  * @param {Object} o The argument in question of truthiness.
  * @return {boolean}
  */
  function exists(o) {
    return typeof o !== "undefined" && o !== null;
  }
  
  // wrap module methods with a scope
  function moduleStrap(obj) {
    if (typeof obj === "undefined" || !obj) { return; }
    var strap = {};
    for (var key in module) {
      strap[key] = module[key].bind(obj);
    }
    return strap;
  }

  function nextElementSibling(el) {
    el = el.nextSibling;
    while (el && el.nodeType !== 1) {
      el = el.nextSibling;
    }
    return el;
  }

  function prevElementSibling(el) {
    el = el.previousSibling;
    while (el && el.nodeType !== 1) {
      el = el.previousSibling;
    }
    return el;
  }

  o.core.expose(strap);
  o.core.extend(self);
}(oak));
