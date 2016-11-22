'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  'use strict';

  var Disposable = function () {
    function Disposable(block) {
      _classCallCheck(this, Disposable);

      if (!block) {
        throw new Error('A Disposable must be created with a dispose callback');
      }
      this.block = block;
    }

    _createClass(Disposable, [{
      key: 'dispose',
      value: function dispose() {
        if (this.block) {
          this.block();
          delete this.block;
        }
      }
    }]);

    return Disposable;
  }();

  var CompositeDisposable = function (_Disposable) {
    _inherits(CompositeDisposable, _Disposable);

    function CompositeDisposable() {
      var disposables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      _classCallCheck(this, CompositeDisposable);

      var _this = _possibleConstructorReturn(this, (CompositeDisposable.__proto__ || Object.getPrototypeOf(CompositeDisposable)).call(this, function () {
        for (var i = 0; i < _this.disposables.length; i++) {
          var disposable = _this.disposables[i];
          disposable.dispose();
        }
      }));

      _this.disposables = disposables;
      return _this;
    }

    _createClass(CompositeDisposable, [{
      key: 'add',
      value: function add(disposable) {
        this.disposables.push(disposable);
      }
    }, {
      key: 'remove',
      value: function remove(disposable) {
        var index = this.disposables.indexOf(disposable);

        if (index !== -1) {
          this.disposables.splice(index, 1);
        }
      }
    }]);

    return CompositeDisposable;
  }(Disposable);

  var DisposableEvent = function (_Disposable2) {
    _inherits(DisposableEvent, _Disposable2);

    function DisposableEvent(target, event, listener) {
      _classCallCheck(this, DisposableEvent);

      var events = event.split(/\s+/g);

      if (typeof target.addEventListener === 'function') {
        var _this2 = _possibleConstructorReturn(this, (DisposableEvent.__proto__ || Object.getPrototypeOf(DisposableEvent)).call(this, function () {
          return events.forEach(function (e) {
            return target.removeEventListener(e, listener);
          });
        }));

        events.forEach(function (e) {
          return target.addEventListener(e, listener);
        });
      } else if (typeof target.on === 'function') {
        var _this2 = _possibleConstructorReturn(this, (DisposableEvent.__proto__ || Object.getPrototypeOf(DisposableEvent)).call(this, function () {
          return events.forEach(function (e) {
            return target.off(e, listener);
          });
        }));

        events.forEach(function (e) {
          return target.on(e, listener);
        });
      } else {
        throw new Error('The passed-in source must have either a addEventListener or on method');
      }
      return _possibleConstructorReturn(_this2);
    }

    return DisposableEvent;
  }(Disposable);

  //  ######  ######## ########
  // ##    ##    ##    ##     ##
  // ##          ##    ##     ##
  //  ######     ##    ##     ##
  //       ##    ##    ##     ##
  // ##    ##    ##    ##     ##
  //  ######     ##    ########

  function merge(a, b) {
    var c = {};

    for (var k in a) {
      c[k] = a[k];
    }
    for (var _k in b) {
      c[_k] = b[_k];
    }

    return c;
  }

  function clone(object) {
    var copy = {};
    for (var k in object) {
      copy[k] = object[k];
    }
    return copy;
  }

  var slice = Array.prototype.slice;

  var _curry = function _curry(n, fn) {
    var curryArgs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var concatArgs = curryArgs.concat(args);

      return n > concatArgs.length ? _curry(n, fn, concatArgs) : fn.apply(null, concatArgs);
    };
  };

  function curryN(n, fn) {
    return _curry(n, fn);
  }

  var curry1 = curryN(2, curryN)(1);
  var curry2 = curryN(2, curryN)(2);
  var curry3 = curryN(2, curryN)(3);
  var curry4 = curryN(2, curryN)(4);

  var apply = curry2(function (fn, args) {
    return fn.apply(null, args);
  });

  var identity = function identity(a) {
    return a;
  };
  var always = function always(a) {
    return true;
  };

  var head = function head(a) {
    return a[0];
  };
  var last = function last(a) {
    return a[a.length - 1];
  };
  var tail = function tail(a) {
    return a.slice(1);
  };

  var when = curry2(function (predicates) {
    for (var _len2 = arguments.length, values = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      values[_key2 - 1] = arguments[_key2];
    }

    var doWhen = function doWhen(a) {
      var _head = head(a),
          _head2 = _slicedToArray(_head, 2),
          predicate = _head2[0],
          resolve = _head2[1];

      return predicate.apply(undefined, values) ? resolve.apply(undefined, values) : doWhen(tail(a));
    };

    return doWhen(predicates);
  });

  function compose() {
    for (var _len3 = arguments.length, fns = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      fns[_key3] = arguments[_key3];
    }

    fns.push(apply(fns.pop()));
    return function () {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return fns.reduceRight(function (memo, fn) {
        return fn(memo);
      }, args);
    };
  }

  var asArray = function asArray(collection) {
    return slice.call(collection);
  };
  var asPair = function asPair(object) {
    return Object.keys(object).map(function (k) {
      return [k, object[k]];
    });
  };

  var fill = curry2(function (len, value) {
    return new Array(len).fill(value);
  });

  var mapEach = curry2(function (maps, values) {
    return values.map(function (v, i) {
      return maps[i % maps.length](v);
    });
  });

  // ########   #######  ##     ##
  // ##     ## ##     ## ###   ###
  // ##     ## ##     ## #### ####
  // ##     ## ##     ## ## ### ##
  // ##     ## ##     ## ##     ##
  // ##     ## ##     ## ##     ##
  // ########   #######  ##     ##

  var previewNode = void 0;

  function getNode(html) {
    if (!html) {
      return undefined;
    }
    if (previewNode == null) {
      previewNode = document.createElement('div');
    }

    previewNode.innerHTML = html;
    var node = previewNode.firstElementChild;
    if (node) {
      previewNode.removeChild(node);
    }
    previewNode.innerHTML = '';
    return node || null;
  }

  function cloneNode(node) {
    return node ? getNode(node.outerHTML) : undefined;
  }

  function detachNode(node) {
    node && node.parentNode && node.parentNode.removeChild(node);
  }

  // ########     ###    ########  ######## ##    ## ########  ######
  // ##     ##   ## ##   ##     ## ##       ###   ##    ##    ##    ##
  // ##     ##  ##   ##  ##     ## ##       ####  ##    ##    ##
  // ########  ##     ## ########  ######   ## ## ##    ##     ######
  // ##        ######### ##   ##   ##       ##  ####    ##          ##
  // ##        ##     ## ##    ##  ##       ##   ###    ##    ##    ##
  // ##        ##     ## ##     ## ######## ##    ##    ##     ######

  function eachParent(node, block) {
    var parent = node.parentNode;

    while (parent) {
      block(parent);

      if (parent.nodeName === 'HTML') {
        break;
      }
      parent = parent.parentNode;
    }
  }

  function parents(node) {
    var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '*';

    var parentNodes = [];

    eachParent(node, function (parent) {
      if (parent.matches && parent.matches(selector)) {
        parentNodes.push(parent);
      }
    });

    return parentNodes;
  }

  function parent(node) {
    var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '*';

    return parents(node, selector)[0];
  }

  function nodeAndParents(node) {
    var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '*';

    return [node].concat(parents(node, selector));
  }

  // ######## ##     ## ######## ##    ## ########  ######
  // ##       ##     ## ##       ###   ##    ##    ##    ##
  // ##       ##     ## ##       ####  ##    ##    ##
  // ######   ##     ## ######   ## ## ##    ##     ######
  // ##        ##   ##  ##       ##  ####    ##          ##
  // ##         ## ##   ##       ##   ###    ##    ##    ##
  // ########    ###    ######## ##    ##    ##     ######

  function appendData(data, event) {
    if (data) {
      event.data = data;
    }
    return event;
  }

  var newEvent = function newEvent(type, data, props) {
    return appendData(data, new window.Event(type, {
      bubbles: props.bubbles != null ? props.bubbles : true,
      cancelable: props.cancelable != null ? props.cancelable : true
    }));
  };

  var createEvent = function createEvent(type, data, props) {
    var event = document.createEvent('Event');
    event.initEvent(type, props.bubbles != null ? props.bubbles : true, props.cancelable != null ? props.cancelable : true);
    return appendData(data, event);
  };

  var createEventObject = function createEventObject(type, data, props) {
    var event = document.createEventObject();
    event.type = type;
    event.cancelBubble = props.bubbles === false;
    delete props.bubbles;
    for (var k in props) {
      event[k] = props[k];
    }
    return appendData(data, event);
  };

  var domEventImplementation = void 0;
  var domEvent = function domEvent(type, data) {
    var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (!domEventImplementation) {
      try {
        var e = new window.Event('test');
        domEventImplementation = e && newEvent;
      } catch (e) {
        domEventImplementation = document.createEvent ? createEvent : createEventObject;
      }
    }

    return domEventImplementation(type, data, props);
  };

  function addDelegatedEventListener(object, event, selector, callback) {
    if (typeof selector === 'function') {
      callback = selector;
      selector = '*';
    }

    var listener = function listener(e) {
      if (e.isPropagationStopped) {
        return;
      }

      var target = e.target;

      decorateEvent(e);
      nodeAndParents(target).forEach(function (node) {
        var matched = node.matches(selector);
        if (e.isImmediatePropagationStopped || !matched) {
          return;
        }

        e.matchedTarget = node;
        callback(e);
      });
    };

    return new DisposableEvent(object, event, listener);

    function decorateEvent(e) {
      var overriddenStop = window.Event.prototype.stopPropagation;
      e.stopPropagation = function () {
        this.isPropagationStopped = true;
        overriddenStop.apply(this, arguments);
      };

      var overriddenStopImmediate = window.Event.prototype.stopImmediatePropagation;
      e.stopImmediatePropagation = function () {
        this.isImmediatePropagationStopped = true;
        overriddenStopImmediate.apply(this, arguments);
      };
    }
  }

  var Hash = function () {
    function Hash() {
      _classCallCheck(this, Hash);

      this.clear();
    }

    _createClass(Hash, [{
      key: 'clear',
      value: function clear() {
        this.keys = [];
        this.values = [];
      }
    }, {
      key: 'set',
      value: function set(key, value) {
        if (this.hasKey(key)) {
          var index = this.keys.indexOf(key);
          this.values[index] = value;
        } else {
          this.keys.push(key);
          this.values.push(value);
        }
      }
    }, {
      key: 'get',
      value: function get(key) {
        return this.values[this.keys.indexOf(key)];
      }
    }, {
      key: 'getKey',
      value: function getKey(value) {
        return this.keys[this.values.indexOf(value)];
      }
    }, {
      key: 'hasKey',
      value: function hasKey(key) {
        return this.keys.indexOf(key) > -1;
      }
    }, {
      key: 'unset',
      value: function unset(key) {
        var index = this.keys.indexOf(key);
        this.keys.splice(index, 1);
        this.values.splice(index, 1);
      }
    }, {
      key: 'each',
      value: function each(block) {
        if (!block) {
          return;
        }

        this.values.forEach(block);
      }
    }, {
      key: 'eachKey',
      value: function eachKey(block) {
        if (!block) {
          return;
        }

        this.keys.forEach(block);
      }
    }, {
      key: 'eachPair',
      value: function eachPair(block) {
        var _this3 = this;

        if (!block) {
          return;
        }

        this.keys.forEach(function (key) {
          return block(key, _this3.get(key));
        });
      }
    }]);

    return Hash;
  }();

  var Widget = function () {
    function Widget(element, handler, options, handledClass) {
      _classCallCheck(this, Widget);

      this.active = false;
      this.element = element;
      this.options = options;
      this.handledClass = handledClass;

      if ((typeof handler === 'undefined' ? 'undefined' : _typeof(handler)) === 'object') {
        this.onInitialize = handler.initialize;
        this.onActivate = handler.activate;
        this.onDeactivate = handler.deactivate;
        this.onDispose = handler.dispose;
      } else {
        this.handler = handler;
      }
    }

    _createClass(Widget, [{
      key: 'activate',
      value: function activate() {
        if (this.active) {
          return;
        }

        this.onActivate && this.onActivate();
        this.active = true;
      }
    }, {
      key: 'deactivate',
      value: function deactivate() {
        if (!this.active) {
          return;
        }

        this.onDeactivate && this.onDeactivate();
        this.active = false;
      }
    }, {
      key: 'init',
      value: function init() {
        if (this.initialized) {
          return;
        }

        this.element.classList.add(this.handledClass);
        var args = [this.element, this];
        if (this.handler) {
          this.disposable = this.handler.apply(this, args);
        }
        this.onInitialize && this.onInitialize();

        this.initialized = true;
      }
    }, {
      key: 'dispose',
      value: function dispose() {
        if (this.disposed) {
          return;
        }

        this.element.classList.remove(this.handledClass);

        this.disposable && this.disposable.dispose();
        this.onDispose && this.onDispose();

        delete this.element;
        delete this.handler;
        delete this.handledClass;
        delete this.disposable;

        this.disposed = true;
      }
    }]);

    return Widget;
  }();

  /**
   * The `WIDGETS` object stores all the registered widget factories.
   */


  var WIDGETS = {};

  /**
   * The `INSTANCES` object stores the returned instances of the various widgets,
   * stored by widget type and then mapped with their target DOM element as key.
   */
  var INSTANCES = {};

  /**
   * The `SUBSCRIPTIONS` object stores all the subscriptions object created
   * through the `widgets.subscribe` function.
   */
  var SUBSCRIPTIONS = {};

  /**
   * The `widgets` function is both the main module and the function
   * used to register the widgets to apply on a page.
   *
   * @param {string} name the name of the widget to apply
   * @param {string} selector the CSS selector for the targets of the widge
   * @param {Object} [options={}] the base options for this widget application.
   * @param {string|Array<string>} [options.on] the list of events that will
   *                                            trigger the application
   *                                            of the widget
   * @param {function():boolean} [options.if] a function use to define when
   *                                          to apply the widget
   * @param {function():boolean} [options.unless] a function use to define when
   *                                              to not apply the widget
   * @param {Object|function} [options.media] a media condition to apply
   *                                          to the widget
   * @param {Object|function} [options.media.min] the minimum screen width
   *                                              at which the widget will apply
   * @param {Object|function} [options.media.max] the maximum screen width
   *                                              at which the widget will apply
   * @param {function(el:HTMLElement):void} [block]
   */
  function widgets(name, selector) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var block = arguments[3];

    if (WIDGETS[name] == null) {
      throw new Error('Unable to find widget \'' + name + '\'');
    }

    // The options specific to the widget registration and activation are
    // extracted from the options object.
    var ifCond = options['if'];
    var unlessCond = options.unless;
    var targetFrame = options.targetFrame;
    var events = options.on || 'init';
    var mediaCondition = options.media;
    var mediaHandler = void 0;

    delete options.on;
    delete options['if'];
    delete options.unless;
    delete options.media;
    delete options.targetFrame;

    var define = WIDGETS[name];
    var elementHandle = define(options);

    var targetDocument = targetFrame ? document.querySelector(targetFrame).contentDocument : document;

    var targetWindow = targetFrame ? document.querySelector(targetFrame).contentWindow : window;

    // Events can be passed as a string with event names separated with spaces.
    if (typeof events === 'string') {
      events = events.split(/\s+/g);
    }

    // The widgets instances are stored in a Hash with the DOM element they
    // target as key. The instances hashes are stored per widget type.
    var instances = INSTANCES[name] || (INSTANCES[name] = new Hash());

    // This method execute a test condition for the given element. The condition
    // can be either a function or a value converted to boolean.
    function testCondition(condition, element) {
      return typeof condition === 'function' ? condition(element) : !!condition;
    }

    // The DOM elements handled by a widget will receive a handled class
    // to differenciate them from unhandled elements.
    var handledClass = name + '-handled';

    // This method will test if an element can be handled by the current widget.
    // It will test for both the handled class presence and the widget
    // conditions. Note that if both the `if` and `unless` conditions
    // are passed in the options object they will be tested as both part
    // of a single `&&` condition.
    function canBeHandled(element) {
      var res = !element.classList.contains(handledClass);
      res = ifCond ? res && testCondition(ifCond, element) : res;
      res = unlessCond ? res && !testCondition(unlessCond, element) : res;
      return res;
    }

    // If a media condition have been specified, the widget activation will be
    // conditionned based on the result of this condition. The condition is
    // verified each time the `resize` event is triggered.
    if (mediaCondition) {
      // The media condition can be either a boolean value, a function, or,
      // to simply the setup, an object with `min` and `max` property containing
      // the minimal and maximal window width where the widget is activated.
      if (mediaCondition instanceof Object) {
        (function () {
          var _mediaCondition = mediaCondition,
              min = _mediaCondition.min,
              max = _mediaCondition.max;

          mediaCondition = function __mediaCondition() {
            var res = true;

            var _widgets$getScreenSiz = widgets.getScreenSize(targetWindow),
                _widgets$getScreenSiz2 = _slicedToArray(_widgets$getScreenSiz, 1),
                width = _widgets$getScreenSiz2[0];

            res = min != null ? res && width >= min : res;
            res = max != null ? res && width <= max : res;
            return res;
          };
        })();
      }

      // The media handler is registered on the `resize` event of the `window`
      // object.
      mediaHandler = function mediaHandler(element, widget) {
        var conditionMatched = testCondition(mediaCondition, element);

        if (conditionMatched && !widget.active) {
          widget.activate();
        } else if (!conditionMatched && widget.active) {
          widget.deactivate();
        }
      };

      widgets.subscribe(name, targetWindow, 'resize', function () {
        instances.eachPair(function (element, widget) {
          return mediaHandler(element, widget);
        });
      });
    }

    // The `handler` function is the function registered on specified event and
    // will proceed to the creation of the widgets if the conditions are met.
    var handler = function handler() {
      var elements = targetDocument.querySelectorAll(selector);

      asArray(elements).forEach(function (element) {
        if (!canBeHandled(element)) {
          return;
        }

        var widget = new Widget(element, elementHandle, clone(options), handledClass);

        widget.init();

        instances.set(element, widget);

        // The widgets activation state are resolved at creation
        mediaCondition ? mediaHandler(element, widget) : widget.activate();

        widgets.dispatch(name + ':handled', { element: element, widget: widget });

        block && block.call(element, element, widget);
      });
    };

    // For each event specified, the handler is registered as listener.
    // A special case is the `init` event that simply mean to trigger the
    // handler as soon a the function is called.
    events.forEach(function (event) {
      switch (event) {
        case 'init':
          handler();
          break;
        case 'load':
        case 'resize':
          widgets.subscribe(name, targetWindow, event, handler);
          break;
        default:
          widgets.subscribe(name, targetDocument, event, handler);
      }
    });
  }

  /**
   * A helper function used to dispatch an event from a given `source` or from
   * the `document` if no source is provided.
   *
   * @param  {HTMLElement} source the element onto which dispatch the event
   * @param  {string} type the name of the event to dispatch
   * @param  {Object} [properties={}] the properties of the event to dispatch
   */
  widgets.dispatch = function dispatch(source, type) {
    var properties = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (typeof source === 'string') {
      properties = type || {};
      type = source;
      source = document;
    }

    var event = domEvent(type, properties);
    if (source.dispatchEvent) {
      source.dispatchEvent(event);
    } else {
      source.fireEvent('on' + event.type, event);
    }
  };

  /**
   * The `widgets.define` is used to create a new widget usable through the
   * `widgets` method. Basically, a widget is defined using a `name`, and
   * a definition function that either returns another function or an object.
   *
   * The definition function should have the following signature:
   *
   * ```js
   * function (options:Object):function|object
   * ```
   *
   * The `options` object will contains all the options passed to the `widgets`
   * method except the `on`, `if`, `unless` and `media` ones.
   *
   * If the definition function is returning a function, the function should have
   * the following signature:
   *
   * ```js
   * function (element:HTMLElement, widget:Widget):Disposable
   * ```
   *
   * In case of an object, it should have the following structure:
   *
   * ```js
   * {
   *  initialize: function () { ... },
   *  activate: function () { ... },
   *  deactivate: function () { ... },
   *  dispose: function () { ... }
   * }
   * ```
   *
   * Each functions of the object correspond to the hooks available in a widget
   * handler function.
   *
   * @param {string} name the widget name
   * @param {Object|function} blockOrPrototype the widgets' block callback
   *                                           or an object to use as the widget
   *                                           prototype
   */
  widgets.define = function (name, blockOrPrototype) {
    WIDGETS[name] = blockOrPrototype;
  };

  /**
   * Returns whether a widget is currently defined.
   * @param  {string} name the widget name
   * @return {boolean} whether the widget is defined or not
   */
  widgets.defined = function (name) {
    return WIDGETS[name] != null;
  };

  /**
   * Deletes a widget definition.
   *
   * @param  {String} name the name of the widget to delete
   */
  widgets['delete'] = function (name) {
    if (SUBSCRIPTIONS[name]) {
      SUBSCRIPTIONS[name].forEach(function (subscription) {
        return subscription.dispose();
      });
    }
    widgets.release(name);
    delete WIDGETS[name];
  };

  /**
   * Resets parts of all of widgets by deleting their definitions
   *
   * If no name is passed, all the definitions are deleted.
   *
   * @param {...string} names the names of the wigets to delete
   */
  widgets.reset = function () {
    for (var _len5 = arguments.length, names = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      names[_key5] = arguments[_key5];
    }

    if (names.length === 0) {
      names = Object.keys(WIDGETS);
    }

    names.forEach(function (name) {
      widgets['delete'](name);
      INSTANCES[name] && INSTANCES[name].clear();
      delete INSTANCES[name];
    });
  };

  /**
   * Returns all or a specific widget for a given `element`.
   *
   * If no `widget` is specified all the widgets registered for the passed-in
   * element are returned.
   *
   * @param  {HTMLElement} element the element for which retrieving the widgets
   * @param  {string} widget a name of a specific widget class to retrieve
   * @return {Array<Widget>|Widget} the widget(s) associated to the element
   */
  widgets.widgetsFor = function (element, widget) {
    if (widget) {
      return INSTANCES[widget] && INSTANCES[widget].get(element);
    } else {
      return Object.keys(INSTANCES).map(function (key) {
        return INSTANCES[key];
      }).filter(function (instances) {
        return instances.hasKey(element);
      }).map(function (instances) {
        return instances.get(element);
      }).reduce(function (memo, arr) {
        return memo.concat(arr);
      }, []);
    }
  };

  /**
   * Returns an array with the dimension of the passed-in window
   * @param  {Window} w the target window object
   * @return {array} the dimensions of the window
   */
  widgets.getScreenSize = function (w) {
    return [w.innerWidth, w.innerHeight];
  };

  /**
   * Subscribes an event listener to the specified events onto the specified
   * target and stores a subscription so that it can be unsubscribed later.
   *
   * @param  {string} name the name of the event making the subscription
   * @param  {HTMLElement} to the target element of the subscription
   * @param  {string} evt the target event of the subscription
   * @param  {function(e:Event):void} handler the listener of the subscription
   * @return {DisposableEvent} a disposable object to remove the subscription
   * @private
   */
  widgets.subscribe = function (name, to, evt, handler) {
    SUBSCRIPTIONS[name] || (SUBSCRIPTIONS[name] = []);
    var subscription = new DisposableEvent(to, evt, handler);
    SUBSCRIPTIONS[name].push(subscription);
    return subscription;
  };

  /**
   * The `widgets.release` method can be used to completely remove the widgets
   * of the given `name` from the page.
   * It's the widget responsibility to clean up its dependencies during
   * the `dispose` call.
   *
   * @param {...string} names
   */
  widgets.release = function () {
    for (var _len6 = arguments.length, names = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      names[_key6] = arguments[_key6];
    }

    if (names.length === 0) {
      names = Object.keys(INSTANCES);
    }
    names.forEach(function (name) {
      INSTANCES[name] && INSTANCES[name].each(function (value) {
        return value.dispose();
      });
    });
  };

  /**
   * Activates all the widgets instances of type `name`.
   *
   * @param  {...string} names [description]
   */
  widgets.activate = function () {
    for (var _len7 = arguments.length, names = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      names[_key7] = arguments[_key7];
    }

    if (names.length === 0) {
      names = Object.keys(INSTANCES);
    }
    names.forEach(function (name) {
      INSTANCES[name] && INSTANCES[name].each(function (value) {
        return value.activate();
      });
    });
  };

  /**
   * Deactivates all the widgets instances of type `name`.
   *
   * @param  {...string} names [description]
   */
  widgets.deactivate = function () {
    for (var _len8 = arguments.length, names = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      names[_key8] = arguments[_key8];
    }

    if (names.length === 0) {
      names = Object.keys(INSTANCES);
    }
    names.forEach(function (name) {
      INSTANCES[name] && INSTANCES[name].each(function (value) {
        return value.deactivate();
      });
    });
  };

  function inputPredicate() {
    for (var _len9 = arguments.length, types = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      types[_key9] = arguments[_key9];
    }

    return function (input) {
      return input.nodeName === 'INPUT' && types.indexOf(input.type) > -1;
    };
  }

  function selectPredicate(multiple) {
    return function (input) {
      return input.nodeName === 'SELECT' && input.multiple === multiple;
    };
  }

  function validatePresence(i18n, value) {
    return value != null && value.length !== 0 ? null : i18n('blank_value');
  }

  function validateChecked(i18n, value) {
    return value ? null : i18n('unchecked');
  }

  function validateEmail(i18n, value) {
    return validatePresence(i18n, value) || (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/.test(value.toUpperCase()) ? null : i18n('invalid_email'));
  }

  var match = function match(re, s) {
    return new RegExp(re).test(s);
  };

  var escDot = function escDot(s) {
    return s.replace('.', '\\.');
  };

  var compact = function compact(a) {
    return a.filter(function (v) {
      return v != null;
    });
  };

  var getFileValidator = when([[function (s) {
    return (/^\./.test(s)
    );
  }, function (s) {
    return function (f) {
      return match(escDot(s) + '$', f.name);
    };
  }], [function (s) {
    return (/\/\*/.test(s)
    );
  }, function (s) {
    return function (f) {
      return match('^' + s.replace('*', ''), f.type);
    };
  }], [always, function (s) {
    return function (f) {
      return f.type === s;
    };
  }]]);

  var DEFAULT_VALIDATORS = [[inputPredicate('email'), validateEmail], [inputPredicate('checkbox'), validateChecked], [always, validatePresence]];

  var DEFAULT_RESOLVERS = [[inputPredicate('checkbox'), function (i) {
    return i.checked;
  }], [inputPredicate('number', 'range'), function (i) {
    return i.value && parseFloat(i.value);
  }], [inputPredicate('radio'), function (i) {
    return radioValue(parent(i, 'form'), i.name);
  }], [inputPredicate('file'), function (i) {
    return i.files;
  }], [selectPredicate(true), function (i) {
    return optionValues(i);
  }], [selectPredicate(false), function (i) {
    return optionValues(i)[0];
  }], [always, function (i) {
    return i.value;
  }]];

  function optionValues(input) {
    return asArray(input.querySelectorAll('option')).filter(function (o) {
      return o.selected;
    }).map(function (o) {
      return o.value;
    });
  }

  function radioValue(form, name) {
    var checked = form && asArray(form.querySelectorAll('[name="' + name + '"]')).filter(function (i) {
      return i.checked;
    })[0];
    return checked ? checked.value : undefined;
  }

  widgets.define('live-validation', function (options) {
    var validator = getValidator(options);
    var events = options.events || 'change blur';

    return function (input) {
      input.validate = function () {
        return validator(input);
      };

      if (options.validateOnInit) {
        input.validate();
      }

      return new CompositeDisposable([new DisposableEvent(input, events, function () {
        return input.validate();
      }), new Disposable(function () {
        return delete input.validate;
      })]);
    };
  });

  widgets.define('form-validation', function (options) {
    var required = options.required || '[required]';
    var events = options.events || 'submit';
    var validator = getValidator(options);
    var reducer = function reducer(memo, item) {
      return (item.validate ? item.validate() : validator(item)) || memo;
    };

    return function (form) {
      form.validate = function () {
        return asArray(form.querySelectorAll(required)).reduce(reducer, false);
      };

      if (options.validateOnInit) {
        form.validate();
      }

      return new CompositeDisposable([new Disposable(function () {
        form.removeAttribute('novalidate');
        delete form.validate;
      }), new DisposableEvent(form, events, function (e) {
        var hasErrors = form.validate();
        if (hasErrors) {
          e.stopImmediatePropagation();
          e.preventDefault();
        }
        return !hasErrors;
      })]);
    };
  });

  function getValidator(options) {
    var validators = (options.validators || []).concat(DEFAULT_VALIDATORS);
    var resolvers = (options.resolvers || []).concat(DEFAULT_RESOLVERS);
    var i18n = options.i18n || identity;
    var onSuccess = options.onSuccess || identity;
    var onError = options.onError || defaultErrorFeedback;
    var clean = options.clean || defaultCleanFeedback;
    var validator = when(validators.map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          predicate = _ref2[0],
          validate = _ref2[1];

      return [predicate, compose(apply(curry2(validate)(i18n)), mapEach([when(resolvers), identity]), fill(2))];
    }));

    return function (input) {
      clean(input);
      var res = validator(input);

      res != null ? onError(input, res) : onSuccess(input);
      return res != null;
    };
  }

  function defaultErrorFeedback(input, res) {
    var prevError = document.querySelector('[name="' + input.name + '"] + .error');
    if (prevError) {
      detachNode(prevError);
    }

    var error = getNode('<div class=\'error\'>' + res + '</div>');
    input.parentNode.insertBefore(error, input.nextElementSibling);
  }

  function defaultCleanFeedback(input) {
    var next = input.nextElementSibling;
    if (next && next.classList.contains('error')) {
      detachNode(next);
    }
  }

  var isNode = curry2(function (name, node) {
    return node.nodeName === name.toUpperCase();
  });

  var isOption = isNode('option');
  var isOptgroup = isNode('optgroup');

  function copyOptions(from, to) {
    var content = asArray(from.children);
    content.map(function (child) {
      return isOptgroup(child) ? copyOptgroup(child) : copyOption(child);
    }).forEach(function (copy) {
      return to.appendChild(copy);
    });
  }

  function copyOptgroup(optgroup) {
    var copy = document.createElement('optgroup');
    copy.label = optgroup.label;
    copyOptions(optgroup, copy);
    return copy;
  }

  function copyOption(option) {
    var copy = document.createElement('option');
    copy.value = option.value;
    copy.textContent = option.textContent;
    return copy;
  }

  function optionsOf(select) {
    return asArray(select.querySelectorAll('option'));
  }

  function eachOptgroup(node, block) {
    asArray(node.children).filter(function (n) {
      return isOptgroup(n);
    }).forEach(function (group) {
      eachOptgroup(group, block);
      block(group);
    });
  }

  function selectedOptionsOf(select) {
    return optionsOf(select).filter(function (option) {
      return option.selected;
    });
  }

  widgets.define('select-multiple', function (options) {
    var wrapperClass = options.wrapperClass || 'select-multiple';
    var itemsWrapperClass = options.itemsWrapperClass || 'values';
    var itemClass = options.itemClass || 'option';
    var itemLabelClass = options.itemLabelClass || 'label';
    var itemCloseClass = options.itemCloseClass || 'close';
    var itemCloseIconClass = options.itemCloseIconClass || 'fa fa-close';

    return function (select) {
      var parent$$1 = wrapSelect(select);
      var selector = document.createElement('select');
      var valuesContainer = document.createElement('div');
      var formatValue = options[select.getAttribute('data-format-value')] || options.formatValue || defaultFormatValue;

      valuesContainer.classList.add(itemsWrapperClass);

      copyOptions(select, selector);
      updateDivsFromMultiple(valuesContainer, select, formatValue);
      updateSingleFromMultiple(selector, select);

      var subscriptions = new CompositeDisposable();

      subscriptions.add(new DisposableEvent(selector, 'change', function (e) {
        updateMultipleFromSingleChanges(selector, select);
      }));

      subscriptions.add(new DisposableEvent(select, 'change', function (e) {
        updateDivsFromMultiple(valuesContainer, select, formatValue);
        updateSingleFromMultiple(selector, select);
      }));

      subscriptions.add(addDelegatedEventListener(valuesContainer, 'click', '.' + itemCloseClass, function (e) {
        var value = e.target.parentNode.getAttribute('data-value');

        select.querySelector('option[value="' + value + '"]').selected = false;
        widgets.dispatch(select, 'change');
      }));

      parent$$1.appendChild(selector);
      parent$$1.appendChild(valuesContainer);

      return subscriptions;
    };

    function wrapSelect(select) {
      var parent$$1 = document.createElement('div');
      parent$$1.classList.add(wrapperClass);
      select.parentNode.insertBefore(parent$$1, select);
      parent$$1.appendChild(select);
      return parent$$1;
    }

    function updateSingleFromMultiple(single, multiple) {
      var singleOptions = optionsOf(single);
      var multipleOptions = selectedOptionsOf(multiple).map(function (option) {
        return option.value;
      });

      singleOptions.forEach(function (option) {
        option.selected = false;
        multipleOptions.indexOf(option.value) !== -1 ? option.style.display = 'none' : option.removeAttribute('style');
      });

      eachOptgroup(single, function (group) {
        asArray(group.children).every(function (n) {
          return n.style.display === 'none';
        }) ? group.style.display = 'none' : group.removeAttribute('style');
      });
    }

    function updateMultipleFromSingleChanges(single, multiple) {
      var multipleOptions = selectedOptionsOf(multiple);
      var singleOptions = selectedOptionsOf(single);
      var added = singleOptions.filter(function (option) {
        return multipleOptions.indexOf(option.value) === -1;
      })[0];

      multiple.querySelector('option[value="' + added.value + '"]').selected = true;
      widgets.dispatch(multiple, 'change');
    }

    function updateDivsFromMultiple(container, multiple, formatValue) {
      var multipleOptions = selectedOptionsOf(multiple);
      var multipleOptionsValues = multipleOptions.map(function (option) {
        return option.value;
      });

      asArray(container.children).forEach(function (div) {
        if (multipleOptionsValues.indexOf(div.getAttribute('data-value')) === -1) {
          detachNode(div);
        }
      });

      multipleOptions.forEach(function (option) {
        if (!container.querySelector('[data-value="' + option.value + '"]')) {
          container.appendChild(formatValue(option));
        }
      });
    }

    function defaultFormatValue(option) {
      var div = document.createElement('div');
      div.classList.add(itemClass);
      div.setAttribute('data-value', option.value);
      div.innerHTML = '\n      <span class="' + itemLabelClass + '">' + option.textContent + '</span>\n      <button type="button" class="' + itemCloseClass + '" tabindex="-1">\n        <i class="' + itemCloseIconClass + '"></i>\n      </button>\n    ';

      return div;
    }
  });

  var previewsByFileKeys = {};

  function fileKey(file) {
    return file.name + '-' + file.type + '-' + file.size + '-' + file.lastModified;
  }

  var imageType = function imageType() {
    for (var _len10 = arguments.length, ts = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
      ts[_key10] = arguments[_key10];
    }

    var types = ts.map(function (t) {
      return 'image/' + t;
    });
    return function (o) {
      return types.indexOf(o.file.type) > -1;
    };
  };

  var DEFAULT_PREVIEWERS = [[imageType('jpeg', 'png', 'gif', 'bmp', 'svg+xml'), function (o) {
    return getImagePreview(o);
  }], [always, function (o) {
    return Promise.resolve();
  }]];

  var previewBuilder = function previewBuilder() {
    var previewers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var previewer = when(previewers.concat(DEFAULT_PREVIEWERS));
    return function (o) {
      var key = fileKey(o.file);
      return previewsByFileKeys[key] ? previewsByFileKeys[key] : previewsByFileKeys[key] = previewer(o);
    };
  };

  function disposePreview(file) {
    delete previewsByFileKeys[fileKey(file)];
  }

  function getImagePreview(_ref3) {
    var file = _ref3.file,
        onprogress = _ref3.onprogress;

    return new Promise(function (resolve, reject) {
      var reader = new window.FileReader();
      reader.onload = function (e) {
        return resolve(getNode('<img src="' + e.target.result + '">'));
      };
      reader.onerror = reject;
      reader.onprogress = onprogress;
      reader.readAsDataURL(file);
    });
  }

  function getTextPreview(_ref4) {
    var file = _ref4.file,
        onprogress = _ref4.onprogress;

    return new Promise(function (resolve, reject) {
      var reader = new window.FileReader();
      reader.onload = function (e) {
        return resolve(getNode('<pre>' + e.target.result + '</pre>'));
      };
      reader.onerror = reject;
      reader.onprogress = onprogress;
      reader.readAsText(file);
    });
  }

  function getPDFPreview(_ref5) {
    var file = _ref5.file,
        onprogress = _ref5.onprogress;

    return new Promise(function (resolve, reject) {
      var reader = new window.FileReader();
      reader.onload = function (e) {
        return resolve(getNode('<iframe src="' + e.target.result + '"></iframe>'));
      };
      reader.onerror = reject;
      reader.onprogress = onprogress;
      reader.readAsDataURL(file);
    });
  }

  var id = 0;
  var nextId = function nextId() {
    return 'file-input-' + ++id;
  };

  widgets.define('file-preview', function (options) {
    var _merge = merge(defaults, options),
        wrap = _merge.wrap,
        previewSelector = _merge.previewSelector,
        nameMetaSelector = _merge.nameMetaSelector,
        mimeMetaSelector = _merge.mimeMetaSelector,
        dimensionsMetaSelector = _merge.dimensionsMetaSelector,
        sizeMetaSelector = _merge.sizeMetaSelector,
        progressSelector = _merge.progressSelector,
        resetButtonSelector = _merge.resetButtonSelector,
        formatSize = _merge.formatSize,
        formatDimensions = _merge.formatDimensions;

    var getPreview = previewBuilder(options.previewers);

    return function (input) {
      if (!input.id) {
        input.id = nextId();
      }

      var container = input.parentNode;
      var nextSibling = input.nextElementSibling;
      var wrapper = wrap(input);
      container.insertBefore(wrapper, nextSibling);

      var previewContainer = wrapper.querySelector(previewSelector);
      var size = wrapper.querySelector(sizeMetaSelector);
      var dimensions = wrapper.querySelector(dimensionsMetaSelector);
      var name = wrapper.querySelector(nameMetaSelector);
      var mime = wrapper.querySelector(mimeMetaSelector);
      var progress = wrapper.querySelector(progressSelector);
      var resetButton = wrapper.querySelector(resetButtonSelector);
      var onprogress = function onprogress(e) {
        return writeValue(progress, e.loaded / e.total * 100);
      };

      var composite = new CompositeDisposable();

      resetButton && composite.add(new DisposableEvent(resetButton, 'click', function () {
        input.value = '';
        widgets.dispatch(input, 'change');
        widgets.dispatch(input, 'preview:removed');
      }));

      composite.add(new DisposableEvent(input, 'change', function (e) {
        resetField();
        createPreview();
      }));

      if (input.files.length) {
        createPreview();
      } else if (input.hasAttribute('data-file')) {
        createPreviewFromURL();
      }

      return composite;

      function createPreview() {
        var file = input.files[0];
        file && createFilePreview(file);
      }

      function createPreviewFromURL() {
        wrapper.classList.add('loading');
        var url = new window.URL(input.getAttribute('data-file'));
        var req = new window.XMLHttpRequest();
        req.responseType = 'arraybuffer';
        req.onprogress = onprogress;
        req.onload = function (e) {
          wrapper.classList.remove('loading');
          var type = req.getResponseHeader('Content-Type');
          var lastModified = new Date(req.getResponseHeader('Last-Modified'));
          var parts = [new window.Blob([req.response], { type: type })];
          var file = new window.File(parts, last(url.pathname.split('/')), { type: type, lastModified: lastModified });
          createFilePreview(file);
        };
        req.open('GET', url.href);
        req.send();
      }

      function createFilePreview(file) {
        wrapper.classList.add('loading');
        writeValue(progress, 0);

        return getPreview({ file: file, onprogress: onprogress }).then(function (preview) {
          preview && preview.nodeName === 'IMG' ? preview.onload = function () {
            writeText(dimensions, formatDimensions(preview));
            previewLoaded(file);
          } : previewLoaded(file);

          if (preview) {
            previewContainer.appendChild(preview);
          }
          filesById[input.id] = file;
          widgets.dispatch(input, 'preview:ready');
        });
      }

      function previewLoaded(file) {
        writeText(size, formatSize(file.size));
        writeText(name, file.name);
        writeText(mime, file.type);
        wrapper.classList.remove('loading');
        widgets.dispatch(input, 'preview:loaded');
      }

      function resetField() {
        if (filesById[input.id]) {
          disposePreview(filesById[input.id]);
          delete filesById[input.id];
        }

        progress && progress.removeAttribute('value');
        previewContainer.innerHTML = '';
        writeText(size, '');
        writeText(name, '');
        writeText(mime, '');
        writeText(dimensions, '');
      }
    };
  });

  var filesById = {};

  var writeText = function writeText(node, value) {
    return node && (node.textContent = value);
  };

  var writeValue = function writeValue(node, value) {
    return node && (node.value = value);
  };

  var unitPerSize = ['B', 'kB', 'MB', 'GB', 'TB'].map(function (u, i) {
    return [Math.pow(1000, i + 1), u, i === 0 ? 1 : Math.pow(1000, i)];
  });

  var round = function round(n) {
    return Math.floor(n * 100) / 100;
  };

  var formatSize = when(unitPerSize.map(function (_ref6) {
    var _ref7 = _slicedToArray(_ref6, 3),
        limit = _ref7[0],
        unit = _ref7[1],
        divider = _ref7[2];

    return [function (n) {
      return n < limit / 2;
    }, function (n) {
      return [round(n / divider), unit].join('');
    }];
  }));

  var formatDimensions = function formatDimensions(image) {
    return (image.naturalWidth || image.width) + 'x' + (image.naturalHeight || image.height) + 'px';
  };

  var defaults = {
    previewSelector: '.preview',
    nameMetaSelector: '.meta .name',
    mimeMetaSelector: '.meta .mime',
    dimensionsMetaSelector: '.meta .dimensions',
    progressSelector: 'progress',
    resetButtonSelector: 'button',
    sizeMetaSelector: '.meta .size',
    formatSize: formatSize,
    formatDimensions: formatDimensions,
    wrap: function wrap(input) {
      var wrapper = getNode('\n      <div class="file-input">\n        <div class=\'file-container\'>\n          <label for="' + input.id + '"></label>\n          <div class="preview"></div>\n          <button type="button" tabindex="-1"><span>Reset</span></button>\n        </div>\n\n        <progress min="0" max="100"></progress>\n\n        <div class="meta">\n          <div class="name"></div>\n          <div class="mime"></div>\n          <div class="size"></div>\n          <div class="dimensions"></div>\n        </div>\n      </div>\n    ');

      var label = wrapper.querySelector('label');
      label.parentNode.insertBefore(input, label);
      return wrapper;
    }
  };

  var ratio = function ratio(_ref8) {
    var _ref9 = _slicedToArray(_ref8, 2),
        w = _ref9[0],
        h = _ref9[1];

    return w / h;
  };

  var dimensions = function dimensions(img) {
    return [img.naturalWidth, img.naturalHeight];
  };

  var Version = function () {
    function Version(name, size) {
      _classCallCheck(this, Version);

      this.name = name;
      this.size = size;
      this.targetBox = [0, 0].concat(size);
      this.width = head(size);
      this.height = last(size);
    }

    _createClass(Version, [{
      key: 'setBox',
      value: function setBox(box) {
        this.box = box;
      }
    }, {
      key: 'getVersion',
      value: function getVersion(image) {
        var _getCanvas = this.getCanvas(),
            _getCanvas2 = _slicedToArray(_getCanvas, 2),
            canvas = _getCanvas2[0],
            context = _getCanvas2[1];

        context.clearRect.apply(context, _toConsumableArray(this.targetBox));
        context.drawImage.apply(context, [image].concat(_toConsumableArray(this.getBox(image))));
        return canvas;
      }
    }, {
      key: 'getRatio',
      value: function getRatio() {
        return ratio(this.size);
      }
    }, {
      key: 'getCanvas',
      value: function getCanvas() {
        if (!this.canvas) {
          this.canvas = document.createElement('canvas');
          this.context = this.canvas.getContext('2d');

          this.canvas.width = this.width;
          this.canvas.height = this.height;
        }
        return [this.canvas, this.context];
      }
    }, {
      key: 'getBox',
      value: function getBox(image) {
        return this.box ? this.box.concat(this.targetBox) : this.getDefaultBox(image);
      }
    }, {
      key: 'getDefaultBox',
      value: function getDefaultBox(image) {
        return ratio(dimensions(image)) > this.getRatio() ? this.getDefaultHorizontalBox(image) : this.getDefaultVerticalBox(image);
      }
    }, {
      key: 'getDefaultHorizontalBox',
      value: function getDefaultHorizontalBox(image) {
        var width = image.naturalHeight * this.getRatio();
        return [(image.naturalWidth - width) / 2, 0, width, image.naturalHeight].concat(this.targetBox);
      }
    }, {
      key: 'getDefaultVerticalBox',
      value: function getDefaultVerticalBox(image) {
        var height = image.naturalWidth / this.getRatio();
        return [0, (image.naturalHeight - height) / 2, image.naturalWidth, height].concat(this.targetBox);
      }
    }]);

    return Version;
  }();

  var px = function px(v) {
    return v + 'px';
  };
  var clamp = function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  };
  var hasFixedParent = function hasFixedParent(node) {
    return parents(node).some(function (n) {
      return window.getComputedStyle(n).position === 'fixed';
    });
  };
  var getBoundingScreenRect = function getBoundingScreenRect(node) {
    var bounds = node.getBoundingClientRect();
    if (hasFixedParent(node)) {
      bounds = {
        left: bounds.left + document.body.scrollLeft + document.documentElement.scrollLeft,
        right: bounds.right + document.body.scrollLeft + document.documentElement.scrollLeft,
        top: bounds.top + document.body.scrollTop + document.documentElement.scrollTop,
        bottom: bounds.bottom + document.body.scrollTop + document.documentElement.scrollTop,
        width: bounds.width,
        height: bounds.height
      };
    }
    return bounds;
  };

  function editVersion(source, version) {
    return new Promise(function (resolve, reject) {
      var editor = new VersionEditor(source, version);
      editor.onSave = function () {
        var box = editor.getVersionBox();
        detachNode(editor.element);
        editor.dispose();
        resolve(box);
      };
      editor.onCancel = function () {
        detachNode(editor.element);
        editor.dispose();
        reject();
      };

      document.body.appendChild(editor.element);
      editor.init();
    });
  }

  var VersionEditor = function () {
    function VersionEditor(source, version) {
      _classCallCheck(this, VersionEditor);

      var node = getNode('\n      <div class="version-editor">\n        <div class="version-preview">\n          <div class="version-box">\n            <div class="drag-box"></div>\n            <div class="top-handle"></div>\n            <div class="left-handle"></div>\n            <div class="bottom-handle"></div>\n            <div class="right-handle"></div>\n            <div class="top-left-handle"></div>\n            <div class="top-right-handle"></div>\n            <div class="bottom-left-handle"></div>\n            <div class="bottom-right-handle"></div>\n          </div>\n        </div>\n        <div class="actions">\n          <button type="button" class="cancel"><span>Cancel</span></button>\n          <button type="button" class="save"><span>Save</span></button>\n        </div>\n      </div>\n      ');

      var box = node.querySelector('.version-box');
      var container = node.querySelector('.version-preview');
      var clone$$1 = cloneNode(source);
      container.insertBefore(clone$$1, container.firstElementChild);

      this.source = source;
      this.clone = clone$$1;
      this.version = version;
      this.element = node;
      this.box = box;
      this.container = container;
    }

    _createClass(VersionEditor, [{
      key: 'init',
      value: function init() {
        var _this4 = this;

        var cancelButton = this.element.querySelector('.cancel');
        var saveButton = this.element.querySelector('.save');
        this.boxToPreview(this.version.getBox(this.source));

        this.subscriptions = new CompositeDisposable();

        this.subscriptions.add(new DisposableEvent(saveButton, 'click', function () {
          _this4.onSave && _this4.onSave();
        }));

        this.subscriptions.add(new DisposableEvent(cancelButton, 'click', function () {
          _this4.onCancel && _this4.onCancel();
        }));

        this.subscribeToDragBox();
      }
    }, {
      key: 'dispose',
      value: function dispose() {
        this.subscriptions.dispose();
      }
    }, {
      key: 'getVersionBox',
      value: function getVersionBox() {
        var scale = this.clone.width / this.source.naturalWidth;
        return [this.box.offsetLeft / scale, this.box.offsetTop / scale, this.box.offsetWidth / scale, this.box.offsetHeight / scale];
      }
    }, {
      key: 'boxToPreview',
      value: function boxToPreview(boxData) {
        var scale = this.clone.width / this.source.naturalWidth;
        this.updateBox(boxData[0] * scale, boxData[1] * scale, boxData[2] * scale, boxData[3] * scale);
      }
    }, {
      key: 'updateBox',
      value: function updateBox(left, top, width, height) {
        this.box.style.cssText = '\n      left: ' + px(left) + ';\n      top: ' + px(top) + ';\n      width: ' + px(width) + ';\n      height: ' + px(height) + ';\n    ';
      }
    }, {
      key: 'subscribeToDragBox',
      value: function subscribeToDragBox() {
        var _this5 = this;

        this.dragGesture('.drag-box', function (data) {
          var b = data.containerBounds,
              hb = data.handleBounds,
              mouseX = data.mouseX,
              mouseY = data.mouseY;


          _this5.box.style.left = px(clamp(mouseX, 0, b.width - hb.width));
          _this5.box.style.top = px(clamp(mouseY, 0, b.height - hb.height));
        });

        this.dragGesture('.top-handle', function (data) {
          var b = data.containerBounds,
              hb = data.handleBounds,
              bb = data.boxBounds,
              mouseY = data.mouseY;


          var y = mouseY + hb.height / 2;
          var ratio = _this5.version.getRatio();
          var center = bb.left + bb.width / 2;
          var newHeight = bb.bottom - y;
          var newWidth = newHeight * ratio;
          var _contraintBoxSize = _this5.contraintBoxSize([newWidth, newHeight], [Math.min(center * 2, (b.width - center) * 2), bb.bottom]);

          var _contraintBoxSize2 = _slicedToArray(_contraintBoxSize, 2);

          newWidth = _contraintBoxSize2[0];
          newHeight = _contraintBoxSize2[1];


          _this5.updateBox(center - newWidth / 2, clamp(bb.bottom - newHeight, 0, b.height), newWidth, newHeight);
        });

        this.dragGesture('.bottom-handle', function (data) {
          var b = data.containerBounds,
              hb = data.handleBounds,
              bb = data.boxBounds,
              mouseY = data.mouseY;


          var y = mouseY + hb.height / 2;
          var ratio = _this5.version.getRatio();
          var center = bb.left + bb.width / 2;
          var newHeight = y - bb.top;
          var newWidth = newHeight * ratio;
          var _contraintBoxSize3 = _this5.contraintBoxSize([newWidth, newHeight], [Math.min(center * 2, (b.width - center) * 2), b.height - bb.top]);

          var _contraintBoxSize4 = _slicedToArray(_contraintBoxSize3, 2);

          newWidth = _contraintBoxSize4[0];
          newHeight = _contraintBoxSize4[1];


          _this5.updateBox(center - newWidth / 2, bb.top, newWidth, newHeight);
        });

        this.dragGesture('.left-handle', function (data) {
          var b = data.containerBounds,
              hb = data.handleBounds,
              bb = data.boxBounds,
              mouseX = data.mouseX;


          var x = mouseX + hb.width / 2;
          var ratio = _this5.version.getRatio();
          var center = bb.top + bb.height / 2;
          var newWidth = bb.right - x;
          var newHeight = newWidth / ratio;
          var _contraintBoxSize5 = _this5.contraintBoxSize([newWidth, newHeight], [bb.right, Math.min(center * 2, (b.height - center) * 2)]);

          var _contraintBoxSize6 = _slicedToArray(_contraintBoxSize5, 2);

          newWidth = _contraintBoxSize6[0];
          newHeight = _contraintBoxSize6[1];


          _this5.updateBox(clamp(bb.right - newWidth, 0, b.width), center - newHeight / 2, newWidth, newHeight);
        });

        this.dragGesture('.right-handle', function (data) {
          var b = data.containerBounds,
              hb = data.handleBounds,
              bb = data.boxBounds,
              mouseX = data.mouseX;


          var x = mouseX + hb.width / 2;
          var ratio = _this5.version.getRatio();
          var center = bb.top + bb.height / 2;
          var newWidth = x - bb.left;
          var newHeight = newWidth / ratio;
          var _contraintBoxSize7 = _this5.contraintBoxSize([newWidth, newHeight], [b.width - bb.left, Math.min(center * 2, (b.height - center) * 2)]);

          var _contraintBoxSize8 = _slicedToArray(_contraintBoxSize7, 2);

          newWidth = _contraintBoxSize8[0];
          newHeight = _contraintBoxSize8[1];


          _this5.updateBox(bb.left, center - newHeight / 2, newWidth, newHeight);
        });

        this.dragGesture('.top-left-handle', function (data) {
          var b = data.containerBounds,
              hb = data.handleBounds,
              bb = data.boxBounds,
              mouseX = data.mouseX;


          var x = mouseX + hb.width / 2;
          var ratio = _this5.version.getRatio();
          var newWidth = bb.right - x;
          var newHeight = newWidth / ratio;
          var _contraintBoxSize9 = _this5.contraintBoxSize([newWidth, newHeight], [bb.right, bb.bottom]);

          var _contraintBoxSize10 = _slicedToArray(_contraintBoxSize9, 2);

          newWidth = _contraintBoxSize10[0];
          newHeight = _contraintBoxSize10[1];


          _this5.updateBox(clamp(bb.right - newWidth, 0, b.width), clamp(bb.bottom - newHeight, 0, b.height), newWidth, newHeight);
        });

        this.dragGesture('.top-right-handle', function (data) {
          var b = data.containerBounds,
              hb = data.handleBounds,
              bb = data.boxBounds,
              mouseX = data.mouseX;


          var x = mouseX + hb.width / 2;
          var ratio = _this5.version.getRatio();
          var newWidth = x - bb.left;
          var newHeight = newWidth / ratio;
          var _contraintBoxSize11 = _this5.contraintBoxSize([newWidth, newHeight], [b.width - bb.left, b.bottom]);

          var _contraintBoxSize12 = _slicedToArray(_contraintBoxSize11, 2);

          newWidth = _contraintBoxSize12[0];
          newHeight = _contraintBoxSize12[1];


          _this5.updateBox(bb.left, clamp(bb.bottom - newHeight, 0, b.height), newWidth, newHeight);
        });

        this.dragGesture('.bottom-left-handle', function (data) {
          var b = data.containerBounds,
              hb = data.handleBounds,
              bb = data.boxBounds,
              mouseX = data.mouseX;


          var x = mouseX + hb.width / 2;
          var ratio = _this5.version.getRatio();
          var newWidth = bb.right - x;
          var newHeight = newWidth / ratio;
          var _contraintBoxSize13 = _this5.contraintBoxSize([newWidth, newHeight], [bb.right, b.height - bb.top]);

          var _contraintBoxSize14 = _slicedToArray(_contraintBoxSize13, 2);

          newWidth = _contraintBoxSize14[0];
          newHeight = _contraintBoxSize14[1];


          _this5.updateBox(clamp(bb.right - newWidth, 0, b.width), bb.top, newWidth, newHeight);
        });

        this.dragGesture('.bottom-right-handle', function (data) {
          var b = data.containerBounds,
              hb = data.handleBounds,
              bb = data.boxBounds,
              mouseX = data.mouseX;


          var x = mouseX + hb.width / 2;
          var ratio = _this5.version.getRatio();
          var newWidth = x - bb.left;
          var newHeight = newWidth / ratio;
          var _contraintBoxSize15 = _this5.contraintBoxSize([newWidth, newHeight], [b.width - bb.left, b.height - bb.top]);

          var _contraintBoxSize16 = _slicedToArray(_contraintBoxSize15, 2);

          newWidth = _contraintBoxSize16[0];
          newHeight = _contraintBoxSize16[1];


          _this5.updateBox(bb.left, bb.top, newWidth, newHeight);
        });

        this.dragGesture('img', function (data) {
          var b = data.containerBounds,
              offsetX = data.offsetX,
              offsetY = data.offsetY,
              mouseX = data.mouseX;


          var ratio = _this5.version.getRatio();
          var targetX = mouseX + offsetX;

          if (targetX < offsetX) {
            var newWidth = offsetX - targetX;
            var newHeight = newWidth / ratio;
            var _contraintBoxSize17 = _this5.contraintBoxSize([newWidth, newHeight], [offsetX, offsetY]);

            var _contraintBoxSize18 = _slicedToArray(_contraintBoxSize17, 2);

            newWidth = _contraintBoxSize18[0];
            newHeight = _contraintBoxSize18[1];


            _this5.updateBox(targetX, offsetY - newHeight, newWidth, newHeight);
          } else {
            var _newWidth = targetX - offsetX;
            var _newHeight = _newWidth / ratio;
            var _contraintBoxSize19 = _this5.contraintBoxSize([_newWidth, _newHeight], [b.width - offsetX, b.height - offsetY]);

            var _contraintBoxSize20 = _slicedToArray(_contraintBoxSize19, 2);

            _newWidth = _contraintBoxSize20[0];
            _newHeight = _contraintBoxSize20[1];


            _this5.updateBox(offsetX, offsetY, _newWidth, _newHeight);
          }
        });
      }
    }, {
      key: 'contraintBoxSize',
      value: function contraintBoxSize(_ref10, _ref11) {
        var _ref13 = _slicedToArray(_ref10, 2),
            width = _ref13[0],
            height = _ref13[1];

        var _ref12 = _slicedToArray(_ref11, 2),
            maxWidth = _ref12[0],
            maxHeight = _ref12[1];

        var ratio = this.version.getRatio();

        if (width > maxWidth) {
          width = maxWidth;
          height = width / ratio;
        }

        if (height > maxHeight) {
          height = maxHeight;
          width = height * ratio;
        }

        return [width, height];
      }
    }, {
      key: 'dragGesture',
      value: function dragGesture(selector, handler) {
        var _this6 = this;

        var target = this.element.querySelector(selector);
        this.subscriptions.add(new DisposableEvent(target, 'mousedown', function (e) {
          e.preventDefault();
          e.stopPropagation();

          var dragSubs = new CompositeDisposable();
          var handleBounds = getBoundingScreenRect(target);
          var containerBounds = getBoundingScreenRect(_this6.container);
          var offsetX = e.pageX - handleBounds.left;
          var offsetY = e.pageY - handleBounds.top;
          var boxBounds = {
            top: _this6.box.offsetTop,
            left: _this6.box.offsetLeft,
            width: _this6.box.offsetWidth,
            height: _this6.box.offsetHeight,
            right: _this6.box.offsetLeft + _this6.box.offsetWidth,
            bottom: _this6.box.offsetTop + _this6.box.offsetHeight
          };

          dragSubs.add(new DisposableEvent(document.body, 'mousemove', function (e) {
            e.preventDefault();
            e.stopPropagation();

            handler({
              containerBounds: containerBounds,
              boxBounds: boxBounds,
              handleBounds: {
                top: target.offsetTop,
                left: target.offsetLeft,
                width: target.offsetWidth,
                height: target.offsetHeight,
                right: target.offsetLeft + target.offsetWidth,
                bottom: target.offsetTop + target.offsetHeight
              },
              offsetX: offsetX, offsetY: offsetY,
              pageX: e.pageX,
              pageY: e.pageY,
              mouseX: e.pageX - (containerBounds.left + offsetX),
              mouseY: e.pageY - (containerBounds.top + offsetY)
            });
          }));

          dragSubs.add(new DisposableEvent(document.body, 'mouseup', function (e) {
            e.preventDefault();
            e.stopPropagation();

            _this6.subscriptions.remove(dragSubs);
            dragSubs.dispose();
          }));

          _this6.subscriptions.add(dragSubs);
        }));
      }
    }]);

    return VersionEditor;
  }();

  widgets.define('file-versions', function (options) {
    var versionsProvider = options.versionsProvider,
        versionBoxesProvider = options.versionBoxesProvider,
        onVersionsChange = options.onVersionsChange;


    var getVersion = options.getVersion || function (img, version) {
      var canvas = version.getVersion(img);
      var div = getNode('\n      <div class="version">\n        <button type="button" tabindex="-1"><span>Edit</span></button>\n        <div class="version-meta">\n          <span class="version-name">' + version.name + '</span>\n          <span class="version-size">' + version.size.join('x') + '</span>\n        </div>\n      </div>\n    ');
      div.appendChild(canvas, div.firstChild);
      return div;
    };
    return function (input, widget) {
      var container = parent(input, '.file-input');
      var versionsContainer = document.createElement('div');
      var versionsData = versionsProvider(input);
      var versionBoxesData = versionBoxesProvider(input);
      var versions = {};
      versionsContainer.classList.add('versions');

      widget.versions = versions;

      for (var versionName in versionsData) {
        versions[versionName] = new Version(versionName, versionsData[versionName]);
        if (versionBoxesData[versionName]) {
          versions[versionName].setBox(versionBoxesData[versionName]);
        }
      }

      container.appendChild(versionsContainer);
      var versionsSubs = void 0;

      return new CompositeDisposable([new DisposableEvent(input, 'preview:removed', function () {
        versionsContainer.innerHTML = '';
        versionsSubs && versionsSubs.dispose();
      }), new DisposableEvent(input, 'preview:loaded', function () {
        versionsContainer.innerHTML = '';
        versionsSubs && versionsSubs.dispose();

        var img = container.querySelector('img');

        if (img) {
          versionsSubs = new CompositeDisposable();

          asPair(versions).forEach(function (_ref14) {
            var _ref15 = _slicedToArray(_ref14, 2),
                versionName = _ref15[0],
                version = _ref15[1];

            version.setBox();
            var div = getVersion(img, version);
            var btn = div.querySelector('button');

            versionsSubs.add(new DisposableEvent(btn, 'click', function () {
              editVersion(img, version).then(function (box) {
                version.setBox(box);
                version.getVersion(img);
                onVersionsChange && onVersionsChange(input, collectVersions());
              })['catch'](function () {});
            }));
            versionsContainer.appendChild(div);
          });
        }
      }), new Disposable(function () {
        return versionsSubs && versionsSubs.dispose();
      })]);

      function collectVersions() {
        return asPair(versions).reduce(function (memo, _ref16) {
          var _ref17 = _slicedToArray(_ref16, 2),
              name = _ref17[0],
              version = _ref17[1];

          memo[name] = version.box;
          return memo;
        }, {});
      }
    };
  });

  function insertText(textarea, start, end, text) {
    textarea.value = textarea.value.substring(0, start) + text + textarea.value.substring(end, textarea.value.length);
  }

  function wrapSelection(textarea, prefix, suffix) {
    var start = textarea.selectionStart;
    var end = textarea.selectionEnd;
    var selectedText = textarea.value.substring(start, end);
    var replacement = prefix + selectedText + suffix;

    insertText(textarea, start, end, replacement);

    textarea.selectionStart = start + prefix.length;
    textarea.selectionEnd = end + prefix.length;
  }

  function collectMatches(string, regex) {
    var match = void 0;
    var matches = [];

    while (match = regex.exec(string)) {
      matches.push(match[0]);
    }

    return matches;
  }

  function scanLines(block) {
    return function (textarea) {
      var lines = textarea.value.split(/\n/);
      var counter = 0;

      for (var _len11 = arguments.length, args = Array(_len11 > 1 ? _len11 - 1 : 0), _key11 = 1; _key11 < _len11; _key11++) {
        args[_key11 - 1] = arguments[_key11];
      }

      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var result = block.apply(undefined, [{
          textarea: textarea, line: line, lineIndex: i, charIndex: counter
        }].concat(args));

        if (result != null) {
          return result;
        }
        counter += line.length + 1;
      }
    };
  }

  var lineAt = scanLines(function (_ref18, index) {
    var line = _ref18.line,
        charIndex = _ref18.charIndex;
    return index >= charIndex && index <= charIndex + line.length ? line : undefined;
  });

  var lineStartIndexAt = scanLines(function (_ref19, index) {
    var line = _ref19.line,
        charIndex = _ref19.charIndex;
    return index >= charIndex && index <= charIndex + line.length ? charIndex : undefined;
  });

  var lineEndIndexAt = scanLines(function (_ref20, index) {
    var line = _ref20.line,
        charIndex = _ref20.charIndex;
    return index >= charIndex && index <= charIndex + line.length ? charIndex + line.length : undefined;
  });

  var lineAtCursor = function lineAtCursor(textarea) {
    return lineAt(textarea, textarea.selectionStart);
  };

  var lineStartIndexAtCursor = function lineStartIndexAtCursor(textarea) {
    return lineStartIndexAt(textarea, textarea.selectionStart);
  };

  var lineEndIndexAtCursor = function lineEndIndexAtCursor(textarea) {
    return lineEndIndexAt(textarea, textarea.selectionStart);
  };

  var wholeLinesContaining = function wholeLinesContaining(textarea, start) {
    var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : start;

    var s = Math.min(lineStartIndexAt(textarea, start), start);
    var e = Math.max(lineEndIndexAt(textarea, end), end);
    return [s, e, textarea.value.substring(s, e)];
  };

  var wholeLinesAtCursor = function wholeLinesAtCursor(textarea) {
    return wholeLinesContaining(textarea, textarea.selectionStart, textarea.selectionEnd);
  };

  var patchLines = function patchLines(str, block) {
    return str.split('\n').map(block).join('\n');
  };

  var utils = {
    lineAt: lineAt,
    lineAtCursor: lineAtCursor,
    lineEndIndexAt: lineEndIndexAt,
    lineEndIndexAtCursor: lineEndIndexAtCursor,
    lineStartIndexAt: lineStartIndexAt,
    lineStartIndexAtCursor: lineStartIndexAtCursor,
    patchLines: patchLines,
    scanLines: scanLines,
    wholeLinesAtCursor: wholeLinesAtCursor,
    wholeLinesContaining: wholeLinesContaining
  };

  var KeyStroke = function () {
    _createClass(KeyStroke, null, [{
      key: 'parse',
      value: function parse(str, button) {
        var strokes = str.split(/-|\+/);
        var key = strokes.pop();
        var modifiers = {
          ctrl: false,
          shift: false,
          alt: false,
          meta: false
        };

        strokes.forEach(function (stroke) {
          return modifiers[stroke.toLowerCase()] = true;
        });

        return new KeyStroke(key, modifiers, button);
      }
    }]);

    function KeyStroke(key, modifiers, trigger) {
      _classCallCheck(this, KeyStroke);

      this.key = key;
      this.modifiers = modifiers;
      this.trigger = trigger;
    }

    _createClass(KeyStroke, [{
      key: 'matches',
      value: function matches(event) {
        var key = event.char || event.key || String.fromCharCode(event.keyCode);

        return key === this.key && event.ctrlKey === this.modifiers.ctrl && event.shiftKey === this.modifiers.shift && event.altKey === this.modifiers.alt && event.metaKey === this.modifiers.meta;
      }
    }]);

    return KeyStroke;
  }();

  var Markdown = {
    blockquote: function blockquote(textarea) {
      var _wholeLinesAtCursor = wholeLinesAtCursor(textarea),
          _wholeLinesAtCursor2 = _slicedToArray(_wholeLinesAtCursor, 3),
          start = _wholeLinesAtCursor2[0],
          end = _wholeLinesAtCursor2[1],
          string = _wholeLinesAtCursor2[2];

      var newSelection = patchLines(string, function (line) {
        return '> ' + line;
      });

      return [start, end, newSelection];
    },

    codeBlock: function codeBlock(textarea) {
      var _wholeLinesAtCursor3 = wholeLinesAtCursor(textarea),
          _wholeLinesAtCursor4 = _slicedToArray(_wholeLinesAtCursor3, 3),
          start = _wholeLinesAtCursor4[0],
          end = _wholeLinesAtCursor4[1],
          string = _wholeLinesAtCursor4[2];

      var newSelection = patchLines(string, function (line) {
        return '    ' + line;
      });

      return [start, end, newSelection];
    },

    orderedList: function orderedList(textarea) {
      var _wholeLinesAtCursor5 = wholeLinesAtCursor(textarea),
          _wholeLinesAtCursor6 = _slicedToArray(_wholeLinesAtCursor5, 3),
          start = _wholeLinesAtCursor6[0],
          end = _wholeLinesAtCursor6[1],
          string = _wholeLinesAtCursor6[2];

      var newSelection = patchLines(string, function (line, i) {
        return i === 0 ? '1. ' + line : '  ' + line;
      });

      return [start, end, newSelection];
    },

    unorderedList: function unorderedList(textarea) {
      var _wholeLinesAtCursor7 = wholeLinesAtCursor(textarea),
          _wholeLinesAtCursor8 = _slicedToArray(_wholeLinesAtCursor7, 3),
          start = _wholeLinesAtCursor8[0],
          end = _wholeLinesAtCursor8[1],
          string = _wholeLinesAtCursor8[2];

      var newSelection = patchLines(string, function (line, i) {
        return i === 0 ? '- ' + line : '  ' + line;
      });

      return [start, end, newSelection];
    },

    // Repeaters
    repeatOrderedList: [function (line) {
      return line.match(/^\d+\. /);
    }, function (line) {
      return parseInt(line.match(/^\d+/)[0], 10) + 1 + '. ';
    }]
  };

  var escapeRegExp = function escapeRegExp(s) {
    return s.replace(/[$^\[\]().+?*]/g, '\\$1');
  };

  var eachPair = function eachPair(o, block) {
    for (var k in o) {
      block(k, o[k]);
    }
  };

  widgets.define('text-editor', function (options) {
    var collectTokens = options.collectTokens || function (tokens) {
      return new Promise(function (resolve) {
        resolve(tokens.reduce(function (memo, token) {
          memo[token] = window.prompt(token.replace('$', ''));
          return memo;
        }, {}));
      });
    };

    return function (el) {
      var textarea = el.querySelector('textarea');
      var keystrokes = [];
      var wrapButtons = asArray(el.querySelectorAll('[data-wrap]'));
      var nodesWithRepeater = el.querySelectorAll('[data-next-line-repeater]');
      var repeaters = asArray(nodesWithRepeater).map(function (n) {
        var s = n.getAttribute('data-next-line-repeater');
        if (options[s]) {
          return options[s];
        } else {
          return [function (line) {
            return line.match(new RegExp('^' + escapeRegExp(s)));
          }, function (line) {
            return s;
          }];
        }
      });
      repeaters.push([function (a) {
        return true;
      }, function (a) {
        return undefined;
      }]);

      var repeater = when(repeaters);

      wrapButtons.forEach(function (button) {
        var wrap = button.getAttribute('data-wrap');

        if (button.hasAttribute('data-keystroke')) {
          keystrokes.push(KeyStroke.parse(button.getAttribute('data-keystroke'), button));
        }

        button.addEventListener('click', function (e) {
          textarea.focus();

          if (options[wrap]) {
            insertText.apply(undefined, [textarea].concat(_toConsumableArray(options[wrap](textarea, utils))));
          } else {
            defaultWrap(textarea, wrap);
          }

          widgets.dispatch(textarea, 'input');
          widgets.dispatch(textarea, 'change');
        });
      });

      if (keystrokes.length > 0) {
        textarea.addEventListener('keydown', function (e) {
          var match = keystrokes.filter(function (ks) {
            return ks.matches(e);
          })[0];

          if (match) {
            e.preventDefault();
            widgets.dispatch(match.trigger, 'click');
          }

          if (e.keyCode === 13) {
            checkLineRepeater(e, textarea, repeater);
          }
        });
      }
    };

    function defaultWrap(textarea, wrap) {
      var _wrap$replace$split$m = wrap.replace(/\\\|/g, '[__PIPE__]').split('|').map(function (s) {
        return s.replace(/\[__PIPE__\]/g, '|');
      }),
          _wrap$replace$split$m2 = _slicedToArray(_wrap$replace$split$m, 2),
          start = _wrap$replace$split$m2[0],
          end = _wrap$replace$split$m2[1];

      var tokens = collectMatches(wrap, /\$\w+/g);

      if (tokens.length) {
        (function () {
          var newStart = start;
          var newEnd = end;

          collectTokens(tokens).then(function (results) {
            eachPair(results, function (token, value) {
              var re = new RegExp(token.replace('$', '\\$'), 'g');
              newStart = newStart.replace(re, value);
              newEnd = newEnd.replace(re, value);
            });

            wrapSelection(textarea, newStart, newEnd);
          });
        })();
      } else {
        wrapSelection(textarea, start, end);
      }
    }
  });

  function checkLineRepeater(event, textarea, repeater) {
    var line = lineAtCursor(textarea);
    var next = line && repeater(line);

    if (next) {
      event.preventDefault();
      var start = textarea.selectionStart;
      var end = textarea.selectionEnd;
      insertText(textarea, start, end, '\n' + next);
      textarea.selectionEnd = end + next.length + 1;
      widgets.dispatch(textarea, 'input');
      widgets.dispatch(textarea, 'change');
    }
  }

  widgets.define('propagate-focus', function (options) {
    return function (el) {
      return new CompositeDisposable([new DisposableEvent(el, 'focus', function () {
        return parent(el, '.field').classList.add('has-focus');
      }), new DisposableEvent(el, 'blur', function () {
        return parent(el, '.field').classList.remove('has-focus');
      })]);
    };
  });

  var checkboxCollectionPredicate = function checkboxCollectionPredicate(i) {
    return i.nodeName === 'INPUT' && i.type === 'checkbox' && i.parentNode.classList.contains('btn-group');
  };

  var radioCollectionPredicate = function radioCollectionPredicate(i) {
    return i.nodeName === 'INPUT' && i.type === 'radio' && i.parentNode.classList.contains('btn-group');
  };

  var versionSiblings = function versionSiblings(el) {
    return asArray(parent(el, '.controls').querySelectorAll('input[data-size]'));
  };

  var jsonReducer = function jsonReducer(attr) {
    return function (m, i) {
      m[i.getAttribute('data-version-name')] = JSON.parse(i.getAttribute(attr));
      return m;
    };
  };

  var versionsProvider = function versionsProvider(el) {
    return versionSiblings(el).reduce(jsonReducer('data-size'), {});
  };

  var versionBoxesProvider = function versionBoxesProvider(el) {
    return versionSiblings(el).reduce(jsonReducer('value'), {});
  };

  var onVersionsChange = function onVersionsChange(el, versions) {
    var container = parent(el, '.controls');
    asPair(versions).forEach(function (_ref21) {
      var _ref22 = _slicedToArray(_ref21, 2),
          name = _ref22[0],
          box = _ref22[1];

      if (box) {
        container.querySelector('input[data-version-name="' + name + '"]').value = JSON.stringify(box);
      }
    });
  };

  widgets('select-multiple', 'select[multiple]', { on: 'load' });
  widgets('file-preview', 'input[type="file"]', {
    on: 'load',
    previewers: [[function (o) {
      return o.file.type === 'text/plain';
    }, getTextPreview], [function (o) {
      return o.file.type === 'application/pdf';
    }, getPDFPreview]]
  });
  widgets('file-versions', 'input[type="file"]', {
    on: 'load',
    versionsProvider: versionsProvider,
    versionBoxesProvider: versionBoxesProvider,
    onVersionsChange: onVersionsChange
  });
  widgets('text-editor', '.markdown-editor', {
    on: 'load',
    blockquote: Markdown.blockquote,
    codeBlock: Markdown.codeBlock,
    unorderedList: Markdown.unorderedList,
    orderedList: Markdown.orderedList,
    repeatOrderedList: Markdown.repeatOrderedList
  });
  widgets('form-validation', 'form', { on: 'load' });
  widgets('live-validation', '[required]', {
    on: 'load',
    resolvers: [[checkboxCollectionPredicate, function (input) {
      var container = input.parentNode;
      var checked = asArray(container.querySelectorAll('input:checked'));
      return checked.map(function (i) {
        return i.value;
      });
    }], [radioCollectionPredicate, function (input) {
      var checked = input.parentNode.querySelector('input:checked');
      return checked ? checked.value : undefined;
    }]],
    validators: [[checkboxCollectionPredicate, function (i18n, value) {
      return value && value.length > 0 ? null : i18n('blank_value');
    }], [radioCollectionPredicate, function (i18n, value) {
      return value ? null : i18n('blank_value');
    }]],
    onSuccess: function onSuccess(input) {
      var field = parent(input, '.field');
      field.classList.add('has-success');

      var label = field.querySelector('label');
      label.insertBefore(getNode('<i class="fa fa-check feedback-icon"></i>'), label.firstChild);
    },
    onError: function onError(input, res) {
      var field = parent(input, '.field');
      field.classList.add('has-error');

      var label = field.querySelector('label');
      label.insertBefore(getNode('<i class="fa fa-times feedback-icon"></i>'), label.firstChild);
      label.appendChild(getNode('<div class=\'text-red\'>' + res + '</div>'));
    },
    clean: function clean(input) {
      var field = parent(input, '.field');
      field.classList.remove('has-success');
      field.classList.remove('has-error');

      var feedbackNodes = field.querySelectorAll('.feedback-icon, .text-red');

      asArray(feedbackNodes).forEach(function (node) {
        return detachNode(node);
      });
    }
  });
  widgets('propagate-focus', 'input, select, textarea', { on: 'load' });
})();

