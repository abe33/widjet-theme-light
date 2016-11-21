(function () {
'use strict';

class Disposable {
  constructor (block) {
    if (!block) {
      throw new Error('A Disposable must be created with a dispose callback')
    }
    this.block = block;
  }

  dispose () {
    if (this.block) {
      this.block();
      delete this.block;
    }
  }
}

class CompositeDisposable extends Disposable {
  constructor (disposables = []) {
    super(() => {
      for (let i = 0; i < this.disposables.length; i++) {
        const disposable = this.disposables[i];
        disposable.dispose();
      }
    });

    this.disposables = disposables;
  }

  add (disposable) { this.disposables.push(disposable); }

  remove (disposable) {
    const index = this.disposables.indexOf(disposable);

    if (index !== -1) { this.disposables.splice(index, 1); }
  }
}

class DisposableEvent extends Disposable {
  constructor (target, event, listener) {
    const events = event.split(/\s+/g);

    if (typeof target.addEventListener === 'function') {
      super(() => events.forEach(e => target.removeEventListener(e, listener)));
      events.forEach(e => target.addEventListener(e, listener));
    } else if (typeof target.on === 'function') {
      super(() => events.forEach(e => target.off(e, listener)));
      events.forEach(e => target.on(e, listener));
    } else {
      throw new Error('The passed-in source must have either a addEventListener or on method')
    }
  }
}

//  ######  ######## ########
// ##    ##    ##    ##     ##
// ##          ##    ##     ##
//  ######     ##    ##     ##
//       ##    ##    ##     ##
// ##    ##    ##    ##     ##
//  ######     ##    ########

function merge (a, b) {
  const c = {};

  for (let k in a) { c[k] = a[k]; }
  for (let k in b) { c[k] = b[k]; }

  return c
}

function clone (object) {
  const copy = {};
  for (let k in object) { copy[k] = object[k]; }
  return copy
}

const slice = Array.prototype.slice;

const _curry = (n, fn, curryArgs = []) => {
  return (...args) => {
    const concatArgs = curryArgs.concat(args);

    return n > concatArgs.length
      ? _curry(n, fn, concatArgs)
      : fn.apply(null, concatArgs)
  }
};



function curryN (n, fn) { return _curry(n, fn) }

const curry1 = curryN(2, curryN)(1);
const curry2 = curryN(2, curryN)(2);
const curry3 = curryN(2, curryN)(3);
const curry4 = curryN(2, curryN)(4);

const apply = curry2((fn, args) => fn.apply(null, args));

const identity = a => a;
const always = a => true;

const head = a => a[0];
const last = a => a[a.length - 1];
const tail = a => a.slice(1);


const when = curry2((predicates, ...values) => {
  const doWhen = (a) => {
    const [predicate, resolve] = head(a);
    return predicate(...values) ? resolve(...values) : doWhen(tail(a))
  };

  return doWhen(predicates)
});

function compose (...fns) {
  fns.push(apply(fns.pop()));
  return (...args) => fns.reduceRight((memo, fn) => fn(memo), args)
}



const asArray = (collection) => slice.call(collection);
const asPair = (object) => Object.keys(object).map((k) => [k, object[k]]);







const fill = curry2((len, value) => new Array(len).fill(value));

const mapEach = curry2((maps, values) =>
  values.map((v, i) => maps[i % maps.length](v))
);

// ########   #######  ##     ##
// ##     ## ##     ## ###   ###
// ##     ## ##     ## #### ####
// ##     ## ##     ## ## ### ##
// ##     ## ##     ## ##     ##
// ##     ## ##     ## ##     ##
// ########   #######  ##     ##

let previewNode;



function getNode (html) {
  if (!html) { return undefined }
  if (previewNode == null) { previewNode = document.createElement('div'); }

  previewNode.innerHTML = html;
  const node = previewNode.firstElementChild;
  if (node) { previewNode.removeChild(node); }
  previewNode.innerHTML = '';
  return node || null
}



function cloneNode (node) {
  return node ? getNode(node.outerHTML) : undefined
}



function detachNode (node) {
  node && node.parentNode && node.parentNode.removeChild(node);
}



// ########     ###    ########  ######## ##    ## ########  ######
// ##     ##   ## ##   ##     ## ##       ###   ##    ##    ##    ##
// ##     ##  ##   ##  ##     ## ##       ####  ##    ##    ##
// ########  ##     ## ########  ######   ## ## ##    ##     ######
// ##        ######### ##   ##   ##       ##  ####    ##          ##
// ##        ##     ## ##    ##  ##       ##   ###    ##    ##    ##
// ##        ##     ## ##     ## ######## ##    ##    ##     ######

function eachParent (node, block) {
  let parent = node.parentNode;

  while (parent) {
    block(parent);

    if (parent.nodeName === 'HTML') { break }
    parent = parent.parentNode;
  }
}

function parents (node, selector = '*') {
  const parentNodes = [];

  eachParent(node, (parent) => {
    if (parent.matches && parent.matches(selector)) { parentNodes.push(parent); }
  });

  return parentNodes
}

function parent (node, selector = '*') {
  return parents(node, selector)[0]
}

function nodeAndParents (node, selector = '*') {
  return [node].concat(parents(node, selector))
}

// ######## ##     ## ######## ##    ## ########  ######
// ##       ##     ## ##       ###   ##    ##    ##    ##
// ##       ##     ## ##       ####  ##    ##    ##
// ######   ##     ## ######   ## ## ##    ##     ######
// ##        ##   ##  ##       ##  ####    ##          ##
// ##         ## ##   ##       ##   ###    ##    ##    ##
// ########    ###    ######## ##    ##    ##     ######

function appendData (data, event) {
  if (data) { event.data = data; }
  return event
}

const newEvent = (type, data, props) =>
  appendData(data, new window.Event(type, {
    bubbles: props.bubbles != null ? props.bubbles : true,
    cancelable: props.cancelable != null ? props.cancelable : true
  }));

const createEvent = (type, data, props) => {
  const event = document.createEvent('Event');
  event.initEvent(
    type,
    props.bubbles != null ? props.bubbles : true,
    props.cancelable != null ? props.cancelable : true
  );
  return appendData(data, event)
};

const createEventObject = (type, data, props) => {
  const event = document.createEventObject();
  event.type = type;
  event.cancelBubble = props.bubbles === false;
  delete props.bubbles;
  for (var k in props) { event[k] = props[k]; }
  return appendData(data, event)
};

let domEventImplementation;
const domEvent = (type, data, props = {}) => {
  if (!domEventImplementation) {
    try {
      const e = new window.Event('test');
      domEventImplementation = e && newEvent;
    } catch (e) {
      domEventImplementation = document.createEvent
      ? createEvent
      : createEventObject;
    }
  }

  return domEventImplementation(type, data, props)
};

function addDelegatedEventListener (object, event, selector, callback) {
  if (typeof selector === 'function') {
    callback = selector;
    selector = '*';
  }

  const listener = e => {
    if (e.isPropagationStopped) { return }

    let {target} = e;
    decorateEvent(e);
    nodeAndParents(target).forEach((node) => {
      const matched = node.matches(selector);
      if (e.isImmediatePropagationStopped || !matched) { return }

      e.matchedTarget = node;
      callback(e);
    });
  };

  return new DisposableEvent(object, event, listener)

  function decorateEvent (e) {
    const overriddenStop = window.Event.prototype.stopPropagation;
    e.stopPropagation = function () {
      this.isPropagationStopped = true;
      overriddenStop.apply(this, arguments);
    };

    const overriddenStopImmediate = window.Event.prototype.stopImmediatePropagation;
    e.stopImmediatePropagation = function () {
      this.isImmediatePropagationStopped = true;
      overriddenStopImmediate.apply(this, arguments);
    };
  }
}

class Hash {
  constructor () {
    this.clear();
  }

  clear () {
    this.keys = [];
    this.values = [];
  }

  set (key, value) {
    if (this.hasKey(key)) {
      const index = this.keys.indexOf(key);
      this.values[index] = value;
    } else {
      this.keys.push(key);
      this.values.push(value);
    }
  }

  get (key) { return this.values[ this.keys.indexOf(key) ] }

  getKey (value) { return this.keys[ this.values.indexOf(value) ] }

  hasKey (key) { return this.keys.indexOf(key) > -1 }

  unset (key) {
    const index = this.keys.indexOf(key);
    this.keys.splice(index, 1);
    this.values.splice(index, 1);
  }

  each (block) {
    if (!block) { return }

    this.values.forEach(block);
  }

  eachKey (block) {
    if (!block) { return }

    this.keys.forEach(block);
  }

  eachPair (block) {
    if (!block) { return }

    this.keys.forEach(key => block(key, this.get(key)));
  }
}

class Widget {
  constructor (element, handler, options, handledClass) {
    this.active = false;
    this.element = element;
    this.options = options;
    this.handledClass = handledClass;

    if (typeof handler === 'object') {
      this.onInitialize = handler.initialize;
      this.onActivate = handler.activate;
      this.onDeactivate = handler.deactivate;
      this.onDispose = handler.dispose;
    } else {
      this.handler = handler;
    }
  }

  activate () {
    if (this.active) { return }

    this.onActivate && this.onActivate();
    this.active = true;
  }

  deactivate () {
    if (!this.active) { return }

    this.onDeactivate && this.onDeactivate();
    this.active = false;
  }

  init () {
    if (this.initialized) { return }

    this.element.classList.add(this.handledClass);
    const args = [this.element, this];
    if (this.handler) { this.disposable = this.handler.apply(this, args); }
    this.onInitialize && this.onInitialize();

    this.initialized = true;
  }

  dispose () {
    if (this.disposed) { return }

    this.element.classList.remove(this.handledClass);

    this.disposable && this.disposable.dispose();
    this.onDispose && this.onDispose();

    delete this.element;
    delete this.handler;
    delete this.handledClass;
    delete this.disposable;

    this.disposed = true;
  }
}

/**
 * The `WIDGETS` object stores all the registered widget factories.
 */
const WIDGETS = {};

/**
 * The `INSTANCES` object stores the returned instances of the various widgets,
 * stored by widget type and then mapped with their target DOM element as key.
 */
const INSTANCES = {};

/**
 * The `SUBSCRIPTIONS` object stores all the subscriptions object created
 * through the `widgets.subscribe` function.
 */
const SUBSCRIPTIONS = {};

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
function widgets (name, selector, options = {}, block) {
  if (WIDGETS[name] == null) {
    throw new Error(`Unable to find widget '${name}'`)
  }

  // The options specific to the widget registration and activation are
  // extracted from the options object.
  const ifCond = options.if;
  const unlessCond = options.unless;
  const targetFrame = options.targetFrame;
  let events = options.on || 'init';
  let mediaCondition = options.media;
  let mediaHandler;

  delete options.on;
  delete options.if;
  delete options.unless;
  delete options.media;
  delete options.targetFrame;

  const define = WIDGETS[name];
  const elementHandle = define(options);

  const targetDocument = targetFrame
    ? document.querySelector(targetFrame).contentDocument
    : document;

  const targetWindow = targetFrame
    ? document.querySelector(targetFrame).contentWindow
    : window;

  // Events can be passed as a string with event names separated with spaces.
  if (typeof events === 'string') { events = events.split(/\s+/g); }

  // The widgets instances are stored in a Hash with the DOM element they
  // target as key. The instances hashes are stored per widget type.
  const instances = INSTANCES[name] || (INSTANCES[name] = new Hash());

  // This method execute a test condition for the given element. The condition
  // can be either a function or a value converted to boolean.
  function testCondition (condition, element) {
    return typeof condition === 'function' ? condition(element) : !!condition
  }

  // The DOM elements handled by a widget will receive a handled class
  // to differenciate them from unhandled elements.
  const handledClass = `${name}-handled`;

  // This method will test if an element can be handled by the current widget.
  // It will test for both the handled class presence and the widget
  // conditions. Note that if both the `if` and `unless` conditions
  // are passed in the options object they will be tested as both part
  // of a single `&&` condition.
  function canBeHandled (element) {
    let res = !element.classList.contains(handledClass);
    res = ifCond ? res && testCondition(ifCond, element) : res;
    res = unlessCond ? res && !testCondition(unlessCond, element) : res;
    return res
  }

  // If a media condition have been specified, the widget activation will be
  // conditionned based on the result of this condition. The condition is
  // verified each time the `resize` event is triggered.
  if (mediaCondition) {
    // The media condition can be either a boolean value, a function, or,
    // to simply the setup, an object with `min` and `max` property containing
    // the minimal and maximal window width where the widget is activated.
    if (mediaCondition instanceof Object) {
      const {min, max} = mediaCondition;
      mediaCondition = function __mediaCondition () {
        let res = true;
        const [width] = widgets.getScreenSize(targetWindow);
        res = min != null ? res && width >= min : res;
        res = max != null ? res && width <= max : res;
        return res
      };
    }

    // The media handler is registered on the `resize` event of the `window`
    // object.
    mediaHandler = function (element, widget) {
      const conditionMatched = testCondition(mediaCondition, element);

      if (conditionMatched && !widget.active) {
        widget.activate();
      } else if (!conditionMatched && widget.active) {
        widget.deactivate();
      }
    };

    widgets.subscribe(name, targetWindow, 'resize', () => {
      instances.eachPair((element, widget) => mediaHandler(element, widget));
    });
  }

  // The `handler` function is the function registered on specified event and
  // will proceed to the creation of the widgets if the conditions are met.
  const handler = function () {
    const elements = targetDocument.querySelectorAll(selector);

    asArray(elements).forEach((element) => {
      if (!canBeHandled(element)) { return }

      const widget = new Widget(
        element, elementHandle, clone(options), handledClass
      );

      widget.init();

      instances.set(element, widget);

      // The widgets activation state are resolved at creation
      mediaCondition ? mediaHandler(element, widget) : widget.activate();

      widgets.dispatch(`${name}:handled`, {element, widget});

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
        break
      case 'load':
      case 'resize':
        widgets.subscribe(name, targetWindow, event, handler);
        break
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
widgets.dispatch = function dispatch (source, type, properties = {}) {
  if (typeof source === 'string') {
    properties = type || {};
    type = source;
    source = document;
  }

  const event = domEvent(type, properties);
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
  return WIDGETS[name] != null
};

/**
 * Deletes a widget definition.
 *
 * @param  {String} name the name of the widget to delete
 */
widgets.delete = function (name) {
  if (SUBSCRIPTIONS[name]) {
    SUBSCRIPTIONS[name].forEach(subscription => subscription.dispose());
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
widgets.reset = function (...names) {
  if (names.length === 0) { names = Object.keys(WIDGETS); }

  names.forEach(name => {
    widgets.delete(name);
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
    return INSTANCES[widget] && INSTANCES[widget].get(element)
  } else {
    return Object.keys(INSTANCES)
    .map(key => INSTANCES[key])
    .filter(instances => instances.hasKey(element))
    .map(instances => instances.get(element))
    .reduce((memo, arr) => memo.concat(arr), [])
  }
};

/**
 * Returns an array with the dimension of the passed-in window
 * @param  {Window} w the target window object
 * @return {array} the dimensions of the window
 */
widgets.getScreenSize = function (w) {
  return [w.innerWidth, w.innerHeight]
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
  const subscription = new DisposableEvent(to, evt, handler);
  SUBSCRIPTIONS[name].push(subscription);
  return subscription
};

/**
 * The `widgets.release` method can be used to completely remove the widgets
 * of the given `name` from the page.
 * It's the widget responsibility to clean up its dependencies during
 * the `dispose` call.
 *
 * @param {...string} names
 */
widgets.release = function (...names) {
  if (names.length === 0) { names = Object.keys(INSTANCES); }
  names.forEach(name => {
    INSTANCES[name] && INSTANCES[name].each(value => value.dispose());
  });
};

/**
 * Activates all the widgets instances of type `name`.
 *
 * @param  {...string} names [description]
 */
widgets.activate = function (...names) {
  if (names.length === 0) { names = Object.keys(INSTANCES); }
  names.forEach(name => {
    INSTANCES[name] && INSTANCES[name].each(value => value.activate());
  });
};

/**
 * Deactivates all the widgets instances of type `name`.
 *
 * @param  {...string} names [description]
 */
widgets.deactivate = function (...names) {
  if (names.length === 0) { names = Object.keys(INSTANCES); }
  names.forEach(name => {
    INSTANCES[name] && INSTANCES[name].each(value => value.deactivate());
  });
};

function inputPredicate (...types) {
  return input => input.nodeName === 'INPUT' && types.indexOf(input.type) > -1
}

function selectPredicate (multiple) {
  return input => input.nodeName === 'SELECT' && input.multiple === multiple
}

function validatePresence (i18n, value) {
  return value != null && value.length !== 0 ? null : i18n('blank_value')
}

function validateChecked (i18n, value) {
  return value ? null : i18n('unchecked')
}

function validateEmail (i18n, value) {
  return validatePresence(i18n, value) || (
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/.test(value.toUpperCase())
      ? null
      : i18n('invalid_email')
  )
}

const match = (re, s) => new RegExp(re).test(s);

const escDot = s => s.replace('.', '\\.');

const compact = a => a.filter(v => v != null);

const getFileValidator = when([
  [s => /^\./.test(s), s => f => match(`${escDot(s)}$`, f.name)],
  [s => /\/\*/.test(s), s => f => match(`^${s.replace('*', '')}`, f.type)],
  [always, s => f => f.type === s]
]);



var DEFAULT_VALIDATORS = [
  [inputPredicate('email'), validateEmail],
  [inputPredicate('checkbox'), validateChecked],
  [always, validatePresence]
];

var DEFAULT_RESOLVERS = [
  [inputPredicate('checkbox'), i => i.checked],
  [inputPredicate('number', 'range'), i => i.value && parseFloat(i.value)],
  [inputPredicate('radio'), i => radioValue(parent(i, 'form'), i.name)],
  [inputPredicate('file'), i => i.files],
  [selectPredicate(true), i => optionValues(i)],
  [selectPredicate(false), i => optionValues(i)[0]],
  [always, i => i.value]
];

function optionValues (input) {
  return asArray(input.querySelectorAll('option'))
  .filter(o => o.selected)
  .map(o => o.value)
}

function radioValue (form, name) {
  const checked = form &&
    asArray(form.querySelectorAll(`[name="${name}"]`)).filter(i => i.checked)[0];
  return checked ? checked.value : undefined
}

widgets.define('live-validation', (options) => {
  const validator = getValidator(options);
  const events = options.events || 'change blur';

  return (input) => {
    input.validate = () => validator(input);

    if (options.validateOnInit) { input.validate(); }

    return new CompositeDisposable([
      new DisposableEvent(input, events, () => input.validate()),
      new Disposable(() => delete input.validate)
    ])
  }
});

widgets.define('form-validation', (options) => {
  const required = options.required || '[required]';
  const events = options.events || 'submit';
  const validator = getValidator(options);
  const reducer = (memo, item) =>
    (item.validate ? item.validate() : validator(item)) || memo;

  return (form) => {
    form.validate = () =>
      asArray(form.querySelectorAll(required)).reduce(reducer, false);

    if (options.validateOnInit) { form.validate(); }

    return new CompositeDisposable([
      new Disposable(() => {
        form.removeAttribute('novalidate');
        delete form.validate;
      }),
      new DisposableEvent(form, events, (e) => {
        const hasErrors = form.validate();
        if (hasErrors) {
          e.stopImmediatePropagation();
          e.preventDefault();
        }
        return !hasErrors
      })
    ])
  }
});

function getValidator (options) {
  const validators = (options.validators || []).concat(DEFAULT_VALIDATORS);
  const resolvers = (options.resolvers || []).concat(DEFAULT_RESOLVERS);
  const i18n = options.i18n || identity;
  const onSuccess = options.onSuccess || identity;
  const onError = options.onError || defaultErrorFeedback;
  const clean = options.clean || defaultCleanFeedback;
  const validator = when(validators.map(([predicate, validate]) =>
    [
      predicate,
      compose(
        apply(curry2(validate)(i18n)),
        mapEach([when(resolvers), identity]),
        fill(2)
      )
    ]
  ));

  return input => {
    clean(input);
    const res = validator(input);

    res != null ? onError(input, res) : onSuccess(input);
    return res != null
  }
}

function defaultErrorFeedback (input, res) {
  const prevError = document.querySelector(`[name="${input.name}"] + .error`);
  if (prevError) { detachNode(prevError); }

  const error = getNode(`<div class='error'>${res}</div>`);
  input.parentNode.insertBefore(error, input.nextElementSibling);
}

function defaultCleanFeedback (input) {
  const next = input.nextElementSibling;
  if (next && next.classList.contains('error')) { detachNode(next); }
}

const isNode = curry2((name, node) => {
  return node.nodeName === name.toUpperCase()
});

const isOption = isNode('option');
const isOptgroup = isNode('optgroup');

function copyOptions (from, to) {
  const content = asArray(from.children);
  content.map(child =>
    isOptgroup(child) ? copyOptgroup(child) : copyOption(child)
  )
  .forEach(copy => to.appendChild(copy));
}

function copyOptgroup (optgroup) {
  const copy = document.createElement('optgroup');
  copy.label = optgroup.label;
  copyOptions(optgroup, copy);
  return copy
}

function copyOption (option) {
  const copy = document.createElement('option');
  copy.value = option.value;
  copy.textContent = option.textContent;
  return copy
}

function optionsOf (select) {
  return asArray(select.querySelectorAll('option'))
}

function eachOptgroup (node, block) {
  asArray(node.children).filter(n => isOptgroup(n)).forEach(group => {
    eachOptgroup(group, block);
    block(group);
  });
}

function selectedOptionsOf (select) {
  return optionsOf(select).filter(option => option.selected)
}

widgets.define('select-multiple', (options) => {
  const wrapperClass = options.wrapperClass || 'select-multiple';
  const itemsWrapperClass = options.itemsWrapperClass || 'values';
  const itemClass = options.itemClass || 'option';
  const itemLabelClass = options.itemLabelClass || 'label';
  const itemCloseClass = options.itemCloseClass || 'close';
  const itemCloseIconClass = options.itemCloseIconClass || 'fa fa-close';

  return (select) => {
    const parent$$1 = wrapSelect(select);
    const selector = document.createElement('select');
    const valuesContainer = document.createElement('div');
    const formatValue = options[select.getAttribute('data-format-value')] ||
                        options.formatValue ||
                        defaultFormatValue;

    valuesContainer.classList.add(itemsWrapperClass);

    copyOptions(select, selector);
    updateDivsFromMultiple(valuesContainer, select, formatValue);
    updateSingleFromMultiple(selector, select);

    const subscriptions = new CompositeDisposable();

    subscriptions.add(new DisposableEvent(selector, 'change', (e) => {
      updateMultipleFromSingleChanges(selector, select);
    }));

    subscriptions.add(new DisposableEvent(select, 'change', (e) => {
      updateDivsFromMultiple(valuesContainer, select, formatValue);
      updateSingleFromMultiple(selector, select);
    }));

    subscriptions.add(addDelegatedEventListener(valuesContainer, 'click', `.${itemCloseClass}`, (e) => {
      const value = e.target.parentNode.getAttribute('data-value');

      select.querySelector(`option[value="${value}"]`).selected = false;
      widgets.dispatch(select, 'change');
    }));

    parent$$1.appendChild(selector);
    parent$$1.appendChild(valuesContainer);

    return subscriptions
  }

  function wrapSelect (select) {
    const parent$$1 = document.createElement('div');
    parent$$1.classList.add(wrapperClass);
    select.parentNode.insertBefore(parent$$1, select);
    parent$$1.appendChild(select);
    return parent$$1
  }

  function updateSingleFromMultiple (single, multiple) {
    const singleOptions = optionsOf(single);
    const multipleOptions = selectedOptionsOf(multiple).map(option => option.value);

    singleOptions.forEach((option) => {
      option.selected = false;
      multipleOptions.indexOf(option.value) !== -1
        ? option.style.display = 'none'
        : option.removeAttribute('style');
    });

    eachOptgroup(single, (group) => {
      asArray(group.children).every(n => n.style.display === 'none')
        ? group.style.display = 'none'
        : group.removeAttribute('style');
    });
  }

  function updateMultipleFromSingleChanges (single, multiple) {
    const multipleOptions = selectedOptionsOf(multiple);
    const singleOptions = selectedOptionsOf(single);
    const added = singleOptions.filter(option => multipleOptions.indexOf(option.value) === -1)[0];

    multiple.querySelector(`option[value="${added.value}"]`).selected = true;
    widgets.dispatch(multiple, 'change');
  }

  function updateDivsFromMultiple (container, multiple, formatValue) {
    const multipleOptions = selectedOptionsOf(multiple);
    const multipleOptionsValues = multipleOptions.map(option => option.value);

    asArray(container.children).forEach((div) => {
      if (multipleOptionsValues.indexOf(div.getAttribute('data-value')) === -1) {
        detachNode(div);
      }
    });

    multipleOptions.forEach((option) => {
      if (!container.querySelector(`[data-value="${option.value}"]`)) {
        container.appendChild(formatValue(option));
      }
    });
  }

  function defaultFormatValue (option) {
    const div = document.createElement('div');
    div.classList.add(itemClass);
    div.setAttribute('data-value', option.value);
    div.innerHTML = `
      <span class="${itemLabelClass}">${option.textContent}</span>
      <button type="button" class="${itemCloseClass}" tabindex="-1">
        <i class="${itemCloseIconClass}"></i>
      </button>
    `;

    return div
  }
});

const previewsByFileKeys = {};

function fileKey (file) {
  return `${file.name}-${file.type}-${file.size}-${file.lastModified}`
}

const imageType = (...ts) => {
  const types = ts.map(t => `image/${t}`);
  return o => types.indexOf(o.file.type) > -1
};

const DEFAULT_PREVIEWERS = [
  [imageType('jpeg', 'png', 'gif', 'bmp'), o => getImagePreview(o)],
  [always, o => Promise.resolve()]
];

const previewBuilder = (previewers = []) => {
  const previewer = when(previewers.concat(DEFAULT_PREVIEWERS));
  return (o) => {
    const key = fileKey(o.file);
    return previewsByFileKeys[key]
      ? previewsByFileKeys[key]
      : previewsByFileKeys[key] = previewer(o)
  }
};

function disposePreview (file) {
  delete previewsByFileKeys[fileKey(file)];
}



function getImagePreview ({file, onprogress}) {
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.onload = (e) => resolve(getNode(`<img src="${e.target.result}">`));
    reader.onerror = reject;
    reader.onprogress = onprogress;
    reader.readAsDataURL(file);
  })
}

function getTextPreview ({file, onprogress}) {
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.onload = (e) => resolve(getNode(`<pre>${e.target.result}</pre>`));
    reader.onerror = reject;
    reader.onprogress = onprogress;
    reader.readAsText(file);
  })
}

function getPDFPreview ({file, onprogress}) {
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.onload = (e) => resolve(getNode(`<iframe src="${e.target.result}"></iframe>`));
    reader.onerror = reject;
    reader.onprogress = onprogress;
    reader.readAsDataURL(file);
  })
}

widgets.define('file-preview', (options) => {
  const {
    wrap, previewSelector, nameMetaSelector, mimeMetaSelector, dimensionsMetaSelector, sizeMetaSelector, progressSelector, resetButtonSelector, formatSize, formatDimensions
  } = merge(defaults, options);

  const getPreview = previewBuilder(options.previewers);

  return (input) => {
    const container = input.parentNode;
    const wrapper = wrap(input);
    const nextSibling = input.nextElementSibling;
    container.insertBefore(wrapper, nextSibling);

    const previewContainer = wrapper.querySelector(previewSelector);
    const size = wrapper.querySelector(sizeMetaSelector);
    const dimensions = wrapper.querySelector(dimensionsMetaSelector);
    const name = wrapper.querySelector(nameMetaSelector);
    const mime = wrapper.querySelector(mimeMetaSelector);
    const progress = wrapper.querySelector(progressSelector);
    const resetButton = wrapper.querySelector(resetButtonSelector);
    const onprogress = (e) => writeValue(progress, (e.loaded / e.total) * 100);

    const composite = new CompositeDisposable();

    resetButton && composite.add(new DisposableEvent(resetButton, 'click', () => {
      input.value = '';
      widgets.dispatch(input, 'change');
      widgets.dispatch(input, 'preview:removed');
    }));

    composite.add(new DisposableEvent(input, 'change', (e) => {
      resetField();
      createPreview();
    }));

    if (input.files.length) {
      createPreview();
    } else if (input.hasAttribute('data-file')) {
      createPreviewFromURL();
    }

    return composite

    function createPreview () {
      const file = input.files[0];
      file && createFilePreview(file);
    }

    function createPreviewFromURL () {
      wrapper.classList.add('loading');
      const url = new window.URL(input.getAttribute('data-file'));
      const req = new window.XMLHttpRequest();
      req.responseType = 'arraybuffer';
      req.onprogress = onprogress;
      req.onload = (e) => {
        wrapper.classList.remove('loading');
        const type = req.getResponseHeader('Content-Type');
        const lastModified = new Date(req.getResponseHeader('Last-Modified'));
        const parts = [new window.Blob([req.response], {type})];
        const file = new window.File(parts, last(url.pathname.split('/')), {type, lastModified});
        createFilePreview(file);
      };
      req.open('GET', url.href);
      req.send();
    }

    function createFilePreview (file) {
      wrapper.classList.add('loading');
      writeValue(progress, 0);

      return getPreview({file, onprogress}).then((preview) => {
        preview && preview.nodeName === 'IMG'
          ? preview.onload = () => {
            writeText(dimensions, formatDimensions(preview));
            previewLoaded(file);
          }
          : previewLoaded(file);

        if (preview) { previewContainer.appendChild(preview); }
        filesById[input.id] = file;
        widgets.dispatch(input, 'preview:ready');
      })
    }

    function previewLoaded (file) {
      writeText(size, formatSize(file.size));
      writeText(name, file.name);
      writeText(mime, file.type);
      wrapper.classList.remove('loading');
      widgets.dispatch(input, 'preview:loaded');
    }

    function resetField () {
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
  }
});

const filesById = {};

const writeText = (node, value) => node && (node.textContent = value);

const writeValue = (node, value) => node && (node.value = value);

const unitPerSize = ['B', 'kB', 'MB', 'GB', 'TB'].map((u, i) => [Math.pow(1000, i + 1), u, i === 0 ? 1 : Math.pow(1000, i)]);

const round = n => Math.floor(n * 100) / 100;

const formatSize = when(unitPerSize.map(([limit, unit, divider]) =>
  [n => n < limit / 2, n => [round(n / divider), unit].join('')])
);

const formatDimensions = (image) =>
  `${image.naturalWidth || image.width}x${image.naturalHeight || image.height}px`;

const defaults = {
  previewSelector: '.preview',
  nameMetaSelector: '.meta .name',
  mimeMetaSelector: '.meta .mime',
  dimensionsMetaSelector: '.meta .dimensions',
  progressSelector: 'progress',
  resetButtonSelector: 'button',
  sizeMetaSelector: '.meta .size',
  formatSize,
  formatDimensions,
  wrap: (input) => {
    const wrapper = getNode(`
      <div class="file-input">
        <div class='file-container'>
          <label></label>
          <div class="preview"></div>
          <button type="button" tabindex="-1"><span>Reset</span></button>
        </div>

        <progress min="0" max="100"></progress>

        <div class="meta">
          <div class="name"></div>
          <div class="mime"></div>
          <div class="size"></div>
          <div class="dimensions"></div>
        </div>
      </div>
    `);
    wrapper.querySelector('label').appendChild(input);
    return wrapper
  }
};

const ratio = ([w, h]) => w / h;

const dimensions = (img) => [img.naturalWidth, img.naturalHeight];

class Version {
  constructor (name, size) {
    this.name = name;
    this.size = size;
    this.targetBox = [0, 0].concat(size);
    this.width = head(size);
    this.height = last(size);
  }

  setBox (box) {
    this.box = box;
  }

  getVersion (image) {
    const [canvas, context] = this.getCanvas();
    context.drawImage(image, ...this.getBox(image));
    return canvas
  }

  getRatio () { return ratio(this.size) }

  getCanvas () {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d');

      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }
    return [this.canvas, this.context]
  }

  getBox (image) {
    return this.box
      ? this.box.concat(this.targetBox)
      : this.getDefaultBox(image)
  }

  getDefaultBox (image) {
    return ratio(dimensions(image)) > this.getRatio()
      ? this.getDefaultHorizontalBox(image)
      : this.getDefaultVerticalBox(image)
  }

  getDefaultHorizontalBox (image) {
    const width = image.naturalHeight * this.getRatio();
    return [
      (image.naturalWidth - width) / 2,
      0,
      width,
      image.naturalHeight
    ].concat(this.targetBox)
  }

  getDefaultVerticalBox (image) {
    const height = image.naturalWidth / this.getRatio();
    return [
      0,
      (image.naturalHeight - height) / 2,
      image.naturalWidth,
      height
    ].concat(this.targetBox)
  }
}

const px = (v) => `${v}px`;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const hasFixedParent = (node) => parents(node).some((n) => window.getComputedStyle(n).position === 'fixed');
const getBoundingScreenRect = (node) => {
  let bounds = node.getBoundingClientRect();
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
  return bounds
};

function editVersion (source, version) {
  return new Promise((resolve, reject) => {
    const editor = new VersionEditor(source, version);
    editor.onSave = () => {
      const box = editor.getVersionBox();
      detachNode(editor.element);
      editor.dispose();
      resolve(box);
    };
    editor.onCancel = () => {
      detachNode(editor.element);
      editor.dispose();
      reject();
    };

    document.body.appendChild(editor.element);
    editor.init();
  })
}

class VersionEditor {
  constructor (source, version) {
    const node = getNode(`
      <div class="version-editor">
        <div class="version-preview">
          <div class="version-box">
            <div class="drag-box"></div>
            <div class="top-handle"></div>
            <div class="left-handle"></div>
            <div class="bottom-handle"></div>
            <div class="right-handle"></div>
            <div class="top-left-handle"></div>
            <div class="top-right-handle"></div>
            <div class="bottom-left-handle"></div>
            <div class="bottom-right-handle"></div>
          </div>
        </div>
        <div class="actions">
          <button type="button" class="cancel"><span>Cancel</span></button>
          <button type="button" class="save"><span>Save</span></button>
        </div>
      </div>
      `);

    const box = node.querySelector('.version-box');
    const container = node.querySelector('.version-preview');
    const clone$$1 = cloneNode(source);
    container.insertBefore(clone$$1, container.firstElementChild);

    this.source = source;
    this.clone = clone$$1;
    this.version = version;
    this.element = node;
    this.box = box;
    this.container = container;
  }

  init () {
    const cancelButton = this.element.querySelector('.cancel');
    const saveButton = this.element.querySelector('.save');
    this.boxToPreview(this.version.getBox(this.source));

    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(new DisposableEvent(saveButton, 'click', () => {
      this.onSave && this.onSave();
    }));

    this.subscriptions.add(new DisposableEvent(cancelButton, 'click', () => {
      this.onCancel && this.onCancel();
    }));

    this.subscribeToDragBox();
  }

  dispose () {
    this.subscriptions.dispose();
  }

  getVersionBox () {
    const scale = this.clone.width / this.source.naturalWidth;
    return [
      this.box.offsetLeft / scale,
      this.box.offsetTop / scale,
      this.box.offsetWidth / scale,
      this.box.offsetHeight / scale
    ]
  }

  boxToPreview (boxData) {
    const scale = this.clone.width / this.source.naturalWidth;
    this.updateBox(
      boxData[0] * scale,
      boxData[1] * scale,
      boxData[2] * scale,
      boxData[3] * scale
    );
  }

  updateBox (left, top, width, height) {
    this.box.style.cssText = `
      left: ${px(left)};
      top: ${px(top)};
      width: ${px(width)};
      height: ${px(height)};
    `;
  }

  subscribeToDragBox () {
    this.dragGesture('.drag-box', (data) => {
      const {containerBounds: b, handleBounds: hb, mouseX, mouseY} = data;

      this.box.style.left = px(clamp(mouseX, 0, b.width - hb.width));
      this.box.style.top = px(clamp(mouseY, 0, b.height - hb.height));
    });

    this.dragGesture('.top-handle', (data) => {
      const {
        containerBounds: b, handleBounds: hb, boxBounds: bb, mouseY
      } = data;

      const y = mouseY + (hb.height / 2);
      const ratio = this.version.getRatio();
      const center = bb.left + bb.width / 2;
      let newHeight = bb.bottom - y;
      let newWidth = newHeight / ratio;[newWidth, newHeight] = this.contraintBoxSize([
        newWidth, newHeight
      ], [
        Math.min(center * 2, (b.width - center) * 2),
        bb.bottom
      ]);

      this.updateBox(
        center - newWidth / 2,
        clamp(bb.bottom - newHeight, 0, b.height),
        newWidth,
        newHeight
      );
    });

    this.dragGesture('.bottom-handle', (data) => {
      const {
        containerBounds: b, handleBounds: hb, boxBounds: bb, mouseY
      } = data;

      const y = mouseY + (hb.height / 2);
      const ratio = this.version.getRatio();
      const center = bb.left + bb.width / 2;
      let newHeight = y - bb.top;
      let newWidth = newHeight / ratio;[newWidth, newHeight] = this.contraintBoxSize([
        newWidth, newHeight
      ], [
        Math.min(center * 2, (b.width - center) * 2),
        b.height - bb.top
      ]);

      this.updateBox(
        center - newWidth / 2,
        bb.top,
        newWidth,
        newHeight
      );
    });

    this.dragGesture('.left-handle', (data) => {
      const {
        containerBounds: b, handleBounds: hb, boxBounds: bb, mouseX
      } = data;

      const x = mouseX + (hb.width / 2);
      const ratio = this.version.getRatio();
      const center = bb.top + bb.height / 2;
      let newWidth = bb.right - x;
      let newHeight = newWidth / ratio;[newWidth, newHeight] = this.contraintBoxSize([
        newWidth, newHeight
      ], [
        bb.right,
        Math.min(center * 2, (b.height - center) * 2)
      ]);

      this.updateBox(
        clamp(bb.right - newWidth, 0, b.width),
        center - newHeight / 2,
        newWidth,
        newHeight
      );
    });

    this.dragGesture('.right-handle', (data) => {
      const {
        containerBounds: b, handleBounds: hb, boxBounds: bb, mouseX
      } = data;

      const x = mouseX + (hb.width / 2);
      const ratio = this.version.getRatio();
      const center = bb.top + bb.height / 2;
      let newWidth = x - bb.left;
      let newHeight = newWidth / ratio;[newWidth, newHeight] = this.contraintBoxSize([
        newWidth, newHeight
      ], [
        b.height - bb.top,
        Math.min(center * 2, (b.height - center) * 2)
      ]);

      this.updateBox(
        bb.left,
        center - newHeight / 2,
        newWidth,
        newHeight
      );
    });

    this.dragGesture('.top-left-handle', (data) => {
      const {
        containerBounds: b, handleBounds: hb, boxBounds: bb, mouseX
      } = data;

      const x = mouseX + (hb.width / 2);
      const ratio = this.version.getRatio();
      let newWidth = bb.right - x;
      let newHeight = newWidth / ratio;[newWidth, newHeight] = this.contraintBoxSize([
        newWidth, newHeight
      ], [
        bb.right, bb.bottom
      ]);

      this.updateBox(
        clamp(bb.right - newWidth, 0, b.width),
        clamp(bb.bottom - newHeight, 0, b.height),
        newWidth,
        newHeight
      );
    });

    this.dragGesture('.top-right-handle', (data) => {
      const {
        containerBounds: b, handleBounds: hb, boxBounds: bb, mouseX
      } = data;

      const x = mouseX + (hb.width / 2);
      const ratio = this.version.getRatio();
      let newWidth = x - bb.left;
      let newHeight = newWidth / ratio;[newWidth, newHeight] = this.contraintBoxSize([
        newWidth, newHeight
      ], [
        b.width - bb.left, b.bottom
      ]);

      this.updateBox(
        bb.left,
        clamp(bb.bottom - newHeight, 0, b.height),
        newWidth,
        newHeight
      );
    });

    this.dragGesture('.bottom-left-handle', (data) => {
      const {
        containerBounds: b, handleBounds: hb, boxBounds: bb, mouseX
      } = data;

      const x = mouseX + (hb.width / 2);
      const ratio = this.version.getRatio();
      let newWidth = bb.right - x;
      let newHeight = newWidth / ratio;[newWidth, newHeight] = this.contraintBoxSize([
        newWidth, newHeight
      ], [
        bb.right, b.height - bb.top
      ]);

      this.updateBox(
        clamp(bb.right - newWidth, 0, b.width),
        bb.top,
        newWidth,
        newHeight
      );
    });

    this.dragGesture('.bottom-right-handle', (data) => {
      const {
        containerBounds: b, handleBounds: hb, boxBounds: bb, mouseX
      } = data;

      const x = mouseX + (hb.width / 2);
      const ratio = this.version.getRatio();
      let newWidth = x - bb.left;
      let newHeight = newWidth / ratio;[newWidth, newHeight] = this.contraintBoxSize([
        newWidth, newHeight
      ], [
        b.width - bb.left, b.height - bb.top
      ]);

      this.updateBox(
        bb.left,
        bb.top,
        newWidth,
        newHeight
      );
    });

    this.dragGesture('img', (data) => {
      const {
        containerBounds: b, offsetX, offsetY, mouseX
      } = data;

      const ratio = this.version.getRatio();
      const targetX = mouseX + offsetX;

      if (targetX < offsetX) {
        let newWidth = offsetX - targetX;
        let newHeight = newWidth / ratio;[newWidth, newHeight] = this.contraintBoxSize([
          newWidth, newHeight
        ], [
          offsetX, offsetY
        ]);

        this.updateBox(
          targetX,
          offsetY - newHeight,
          newWidth,
          newHeight
        );
      } else {
        let newWidth = targetX - offsetX;
        let newHeight = newWidth / ratio;[newWidth, newHeight] = this.contraintBoxSize([
          newWidth, newHeight
        ], [
          b.width - offsetX, b.height - offsetY
        ]);

        this.updateBox(
          offsetX,
          offsetY,
          newWidth,
          newHeight
        );
      }
    });
  }

  contraintBoxSize ([width, height], [maxWidth, maxHeight]) {
    const ratio = this.version.getRatio();

    if (width > maxWidth) {
      width = maxWidth;
      height = width / ratio;
    }

    if (height > maxHeight) {
      height = maxHeight;
      width = height * ratio;
    }

    return [width, height]
  }

  dragGesture (selector, handler) {
    const target = this.element.querySelector(selector);
    this.subscriptions.add(new DisposableEvent(target, 'mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const dragSubs = new CompositeDisposable();
      const handleBounds = getBoundingScreenRect(target);
      let containerBounds = getBoundingScreenRect(this.container);
      const offsetX = e.pageX - handleBounds.left;
      const offsetY = e.pageY - handleBounds.top;
      const boxBounds = {
        top: this.box.offsetTop,
        left: this.box.offsetLeft,
        width: this.box.offsetWidth,
        height: this.box.offsetHeight,
        right: this.box.offsetLeft + this.box.offsetWidth,
        bottom: this.box.offsetTop + this.box.offsetHeight
      };

      dragSubs.add(new DisposableEvent(document.body, 'mousemove', (e) => {
        e.preventDefault();
        e.stopPropagation();

        handler({
          containerBounds,
          boxBounds,
          handleBounds: {
            top: target.offsetTop,
            left: target.offsetLeft,
            width: target.offsetWidth,
            height: target.offsetHeight,
            right: target.offsetLeft + target.offsetWidth,
            bottom: target.offsetTop + target.offsetHeight
          },
          offsetX, offsetY,
          pageX: e.pageX,
          pageY: e.pageY,
          mouseX: e.pageX - (containerBounds.left + offsetX),
          mouseY: e.pageY - (containerBounds.top + offsetY)
        });
      }));

      dragSubs.add(new DisposableEvent(document.body, 'mouseup', (e) => {
        e.preventDefault();
        e.stopPropagation();

        this.subscriptions.remove(dragSubs);
        dragSubs.dispose();
      }));

      this.subscriptions.add(dragSubs);
    }));
  }
}

widgets.define('file-versions', (options) => {
  const {versionsProvider, versionBoxesProvider, onVersionsChange} = options;

  const getVersion = options.getVersion || ((img, version) => {
    const canvas = version.getVersion(img);
    const div = getNode(`
      <div class="version">
        <button type="button" tabindex="-1"><span>Edit</span></button>
        <div class="version-meta">
          <span class="version-name">${version.name}</span>
          <span class="version-size">${version.size.join('x')}</span>
        </div>
      </div>
    `);
    div.appendChild(canvas, div.firstChild);
    return div
  });
  return (input, widget) => {
    const container = parent(input, '.file-input');
    const versionsContainer = document.createElement('div');
    const versionsData = versionsProvider(input);
    const versionBoxesData = versionBoxesProvider(input);
    const versions = {};
    versionsContainer.classList.add('versions');

    widget.versions = versions;

    for (let versionName in versionsData) {
      versions[versionName] = new Version(versionName, versionsData[versionName]);
      if (versionBoxesData[versionName]) {
        versions[versionName].setBox(versionBoxesData[versionName]);
      }
    }

    container.appendChild(versionsContainer);
    let versionsSubs;

    return new CompositeDisposable([
      new DisposableEvent(input, 'preview:removed', () => {
        versionsContainer.innerHTML = '';
        versionsSubs && versionsSubs.dispose();
      }),
      new DisposableEvent(input, 'preview:loaded', () => {
        versionsContainer.innerHTML = '';
        versionsSubs && versionsSubs.dispose();

        const img = container.querySelector('img');

        if (img) {
          versionsSubs = new CompositeDisposable();

          asPair(versions).forEach(([versionName, version]) => {
            version.setBox();
            const div = getVersion(img, version);
            const btn = div.querySelector('button');

            versionsSubs.add(new DisposableEvent(btn, 'click', () => {
              editVersion(img, version).then((box) => {
                version.setBox(box);
                version.getVersion(img);
                onVersionsChange && onVersionsChange(input, collectVersions());
              });
            }));
            versionsContainer.appendChild(div);
          });
        }
      }),
      new Disposable(() => versionsSubs && versionsSubs.dispose())
    ])

    function collectVersions () {
      return asPair(versions).reduce((memo, [name, version]) => {
        memo[name] = version.box;
        return memo
      }, {})
    }
  }
});

function insertText (textarea, start, end, text) {
  textarea.value = textarea.value.substring(0, start) +
                   text +
                   textarea.value.substring(end, textarea.value.length);
}

function wrapSelection (textarea, prefix, suffix) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);
  const replacement = prefix + selectedText + suffix;

  insertText(textarea, start, end, replacement);

  textarea.selectionStart = start + prefix.length;
  textarea.selectionEnd = end + prefix.length;
}

function collectMatches (string, regex) {
  let match;
  const matches = [];

  while ((match = regex.exec(string))) {
    matches.push(match[0]);
  }

  return matches
}

function scanLines (block) {
  return function (textarea, ...args) {
    const lines = textarea.value.split(/\n/);
    let counter = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const result = block({
        textarea, line, lineIndex: i, charIndex: counter
      }, ...args);

      if (result != null) { return result }
      counter += line.length + 1;
    }
  }
}

const lineAt = scanLines(({line, charIndex}, index) =>
  index >= charIndex && index <= charIndex + line.length ? line : undefined
);

const lineStartIndexAt = scanLines(({line, charIndex}, index) =>
  index >= charIndex && index <= charIndex + line.length ? charIndex : undefined
);

const lineEndIndexAt = scanLines(({line, charIndex}, index) =>
  index >= charIndex && index <= charIndex + line.length
    ? charIndex + line.length
    : undefined
);

const lineAtCursor = (textarea) =>
  lineAt(textarea, textarea.selectionStart);

const lineStartIndexAtCursor = (textarea) =>
  lineStartIndexAt(textarea, textarea.selectionStart);

const lineEndIndexAtCursor = (textarea) =>
  lineEndIndexAt(textarea, textarea.selectionStart);

const wholeLinesContaining = (textarea, start, end = start) => {
  const s = Math.min(lineStartIndexAt(textarea, start), start);
  const e = Math.max(lineEndIndexAt(textarea, end), end);
  return [s, e, textarea.value.substring(s, e)]
};

const wholeLinesAtCursor = (textarea) =>
  wholeLinesContaining(textarea, textarea.selectionStart, textarea.selectionEnd);

const patchLines = (str, block) => str.split('\n').map(block).join('\n');

var utils = {
  lineAt,
  lineAtCursor,
  lineEndIndexAt,
  lineEndIndexAtCursor,
  lineStartIndexAt,
  lineStartIndexAtCursor,
  patchLines,
  scanLines,
  wholeLinesAtCursor,
  wholeLinesContaining
};

class KeyStroke {
  static parse (str, button) {
    const strokes = str.split(/-|\+/);
    const key = strokes.pop();
    const modifiers = {
      ctrl: false,
      shift: false,
      alt: false,
      meta: false
    };

    strokes.forEach((stroke) => modifiers[stroke.toLowerCase()] = true);

    return new KeyStroke(key, modifiers, button)
  }
  constructor (key, modifiers, trigger) {
    this.key = key;
    this.modifiers = modifiers;
    this.trigger = trigger;
  }
  matches (event) {
    const key = event.char || event.key || String.fromCharCode(event.keyCode);

    return key === this.key &&
           event.ctrlKey === this.modifiers.ctrl &&
           event.shiftKey === this.modifiers.shift &&
           event.altKey === this.modifiers.alt &&
           event.metaKey === this.modifiers.meta
  }
}

var Markdown = {
  blockquote: (textarea) => {
    const [start, end, string] = wholeLinesAtCursor(textarea);
    const newSelection = patchLines(string, line => `> ${line}`);

    return [start, end, newSelection]
  },

  codeBlock: (textarea) => {
    const [start, end, string] = wholeLinesAtCursor(textarea);
    const newSelection = patchLines(string, line => `    ${line}`);

    return [start, end, newSelection]
  },

  orderedList: (textarea) => {
    const [start, end, string] = wholeLinesAtCursor(textarea);
    const newSelection = patchLines(string, (line, i) =>
      i === 0 ? `1. ${line}` : `  ${line}`
    );

    return [start, end, newSelection]
  },

  unorderedList: (textarea) => {
    const [start, end, string] = wholeLinesAtCursor(textarea);
    const newSelection = patchLines(string, (line, i) =>
      i === 0 ? `- ${line}` : `  ${line}`
    );

    return [start, end, newSelection]
  },

  // Repeaters
  repeatOrderedList: [
    (line) => line.match(/^\d+\. /),
    (line) => `${parseInt(line.match(/^\d+/)[0], 10) + 1}. `
  ]
};

const escapeRegExp = (s) => s.replace(/[$^\[\]().+?*]/g, '\\$1');

const eachPair = (o, block) => { for (let k in o) { block(k, o[k]); } };

widgets.define('text-editor', (options) => {
  const collectTokens = options.collectTokens || ((tokens) => {
    return new Promise((resolve) => {
      resolve(tokens.reduce((memo, token) => {
        memo[token] = window.prompt(token.replace('$', ''));
        return memo
      }, {}));
    })
  });

  return (el) => {
    const textarea = el.querySelector('textarea');
    const keystrokes = [];
    const wrapButtons = asArray(el.querySelectorAll('[data-wrap]'));
    const nodesWithRepeater = el.querySelectorAll('[data-next-line-repeater]');
    const repeaters = asArray(nodesWithRepeater).map((n) => {
      const s = n.getAttribute('data-next-line-repeater');
      if (options[s]) {
        return options[s]
      } else {
        return [
          (line) => line.match(new RegExp(`^${escapeRegExp(s)}`)),
          (line) => s
        ]
      }
    });
    repeaters.push([a => true, a => undefined]);

    const repeater = when(repeaters);

    wrapButtons.forEach((button) => {
      const wrap = button.getAttribute('data-wrap');

      if (button.hasAttribute('data-keystroke')) {
        keystrokes.push(KeyStroke.parse(button.getAttribute('data-keystroke'), button));
      }

      button.addEventListener('click', (e) => {
        textarea.focus();

        if (options[wrap]) {
          insertText(textarea, ...options[wrap](textarea, utils));
        } else {
          defaultWrap(textarea, wrap);
        }

        widgets.dispatch(textarea, 'input');
        widgets.dispatch(textarea, 'change');
      });
    });

    if (keystrokes.length > 0) {
      textarea.addEventListener('keydown', (e) => {
        const match = keystrokes.filter(ks => ks.matches(e))[0];

        if (match) {
          e.preventDefault();
          widgets.dispatch(match.trigger, 'click');
        }

        if (e.keyCode === 13) {
          checkLineRepeater(e, textarea, repeater);
        }
      });
    }
  }

  function defaultWrap (textarea, wrap) {
    const [start, end] = wrap.replace(/\\\|/g, '[__PIPE__]').split('|').map(s => s.replace(/\[__PIPE__\]/g, '|'));
    const tokens = collectMatches(wrap, /\$\w+/g);

    if (tokens.length) {
      let newStart = start;
      let newEnd = end;

      collectTokens(tokens).then((results) => {
        eachPair(results, (token, value) => {
          const re = new RegExp(token.replace('$', '\\$'), 'g');
          newStart = newStart.replace(re, value);
          newEnd = newEnd.replace(re, value);
        });

        wrapSelection(textarea, newStart, newEnd);
      });
    } else {
      wrapSelection(textarea, start, end);
    }
  }
});

function checkLineRepeater (event, textarea, repeater) {
  const line = lineAtCursor(textarea);
  const next = line && repeater(line);

  if (next) {
    event.preventDefault();
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    insertText(textarea, start, end, `\n${next}`);
    textarea.selectionEnd = end + next.length + 1;
    widgets.dispatch(textarea, 'input');
    widgets.dispatch(textarea, 'change');
  }
}

widgets.define('propagate-focus', (options) => (el) =>
  new CompositeDisposable([
    new DisposableEvent(el, 'focus', () =>
      parent(el, '.field').classList.add('has-focus')
    ),
    new DisposableEvent(el, 'blur', () =>
      parent(el, '.field').classList.remove('has-focus')
    )
  ])
);

const checkboxCollectionPredicate = i =>
  i.nodeName === 'INPUT' &&
  i.type === 'checkbox' &&
  i.parentNode.classList.contains('btn-group');

const radioCollectionPredicate = i =>
  i.nodeName === 'INPUT' &&
  i.type === 'radio' &&
  i.parentNode.classList.contains('btn-group');

const versionSiblings = (el) =>
  asArray(parent(el, '.controls').querySelectorAll('input[data-size]'));

const jsonReducer = (attr) => (m, i) => {
  m[i.getAttribute('data-version-name')] = JSON.parse(i.getAttribute(attr));
  return m
};

const versionsProvider = (el) =>
  versionSiblings(el).reduce(jsonReducer('data-size'), {});

const versionBoxesProvider = (el) =>
  versionSiblings(el).reduce(jsonReducer('value'), {});

const onVersionsChange = (el, versions) => {
  const container = parent(el, '.controls');
  asPair(versions).forEach(([name, box]) => {
    if (box) {
      container.querySelector(`input[data-version-name="${name}"]`).value = JSON.stringify(box);
    }
  });
};

widgets('select-multiple', 'select[multiple]', {on: 'load'});
widgets('file-preview', 'input[type="file"]', {
  on: 'load',
  previewers: [
    [o => o.file.type === 'text/plain', getTextPreview],
    [o => o.file.type === 'application/pdf', getPDFPreview]
  ]
});
widgets('file-versions', 'input[type="file"]', {
  on: 'load',
  versionsProvider,
  versionBoxesProvider,
  onVersionsChange
});
widgets('text-editor', '.markdown-editor', {
  on: 'load',
  blockquote: Markdown.blockquote,
  codeBlock: Markdown.codeBlock,
  unorderedList: Markdown.unorderedList,
  orderedList: Markdown.orderedList,
  repeatOrderedList: Markdown.repeatOrderedList
});
widgets('form-validation', 'form', {on: 'load'});
widgets('live-validation', '[required]', {
  on: 'load',
  resolvers: [
    [
      checkboxCollectionPredicate,
      input => {
        const container = input.parentNode;
        const checked = asArray(container.querySelectorAll('input:checked'));
        return checked.map(i => i.value)
      }
    ], [
      radioCollectionPredicate,
      input => {
        const checked = input.parentNode.querySelector('input:checked');
        return checked ? checked.value : undefined
      }
    ]
  ],
  validators: [
    [
      checkboxCollectionPredicate,
      (i18n, value) => value && value.length > 0 ? null : i18n('blank_value')
    ], [
      radioCollectionPredicate,
      (i18n, value) => value ? null : i18n('blank_value')
    ]
  ],
  onSuccess: (input) => {
    const field = parent(input, '.field');
    field.classList.add('has-success');

    const label = field.querySelector('label');
    label.insertBefore(getNode('<i class="fa fa-check feedback-icon"></i>'), label.firstChild);
  },
  onError: (input, res) => {
    const field = parent(input, '.field');
    field.classList.add('has-error');

    const label = field.querySelector('label');
    label.insertBefore(getNode('<i class="fa fa-times feedback-icon"></i>'), label.firstChild);
    label.appendChild(getNode(`<div class='text-red'>${res}</div>`));
  },
  clean: (input) => {
    const field = parent(input, '.field');
    field.classList.remove('has-success');
    field.classList.remove('has-error');

    const feedbackNodes = field.querySelectorAll('.feedback-icon, .text-red');

    asArray(feedbackNodes).forEach((node) => detachNode(node));
  }
});
widgets('propagate-focus', 'input, select, textarea', {on: 'load'});

}());
