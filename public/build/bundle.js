
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
  'use strict';

  const Utils = {
    text(text) {
      if (typeof text === 'undefined' || text === null) return '';
      return text;
    },
    noUndefinedProps(obj) {
      const o = {};
      Object.keys(obj).forEach((key) => {
        if (typeof obj[key] !== 'undefined') o[key] = obj[key];
      });
      return o;
    },
    isTrueProp(val) {
      return val === true || val === '';
    },
    isStringProp(val) {
      return typeof val === 'string' && val !== '';
    },
    isObject(o) {
      return typeof o === 'object' && o !== null && o.constructor && o.constructor === Object;
    },
    now() {
      return Date.now();
    },
    extend(...args) {
      let deep = true;
      let to;
      let from;
      if (typeof args[0] === 'boolean') {
        [deep, to] = args;
        args.splice(0, 2);
        from = args;
      } else {
        [to] = args;
        args.splice(0, 1);
        from = args;
      }
      for (let i = 0; i < from.length; i += 1) {
        const nextSource = args[i];
        if (nextSource !== undefined && nextSource !== null) {
          const keysArray = Object.keys(Object(nextSource));
          for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
            const nextKey = keysArray[nextIndex];
            const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
            if (desc !== undefined && desc.enumerable) {
              if (!deep) {
                to[nextKey] = nextSource[nextKey];
              } else if (Utils.isObject(to[nextKey]) && Utils.isObject(nextSource[nextKey])) {
                Utils.extend(to[nextKey], nextSource[nextKey]);
              } else if (!Utils.isObject(to[nextKey]) && Utils.isObject(nextSource[nextKey])) {
                to[nextKey] = {};
                Utils.extend(to[nextKey], nextSource[nextKey]);
              } else {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
      }
      return to;
    },
    flattenArray(...args) {
      const arr = [];
      args.forEach((arg) => {
        if (Array.isArray(arg)) arr.push(...Utils.flattenArray(...arg));
        else arr.push(arg);
      });
      return arr;
    },
    classNames(...args) {
      const classes = [];
      args.forEach((arg) => {
        if (typeof arg === 'object' && arg.constructor === Object) {
          Object.keys(arg).forEach((key) => {
            if (arg[key]) classes.push(key);
          });
        } else if (arg) classes.push(arg);
      });
      const uniqueClasses = [];
      classes.forEach((c) => {
        if (uniqueClasses.indexOf(c) < 0) uniqueClasses.push(c);
      });
      return uniqueClasses.join(' ');
    },
    bindMethods(context, methods = []) {
      for (let i = 0; i < methods.length; i += 1) {
        if (context[methods[i]]) context[methods[i]] = context[methods[i]].bind(context);
      }
    },
  };

  const Mixins = {
    colorProps: {
      color: String,
      colorTheme: String,
      textColor: String,
      bgColor: String,
      borderColor: String,
      rippleColor: String,
      themeDark: Boolean,
    },
    colorClasses(props) {
      const {
        color,
        colorTheme,
        textColor,
        bgColor,
        borderColor,
        rippleColor,
        themeDark,
      } = props;

      return {
        'theme-dark': themeDark,
        [`color-${color}`]: color,
        [`color-theme-${colorTheme}`]: colorTheme,
        [`text-color-${textColor}`]: textColor,
        [`bg-color-${bgColor}`]: bgColor,
        [`border-color-${borderColor}`]: borderColor,
        [`ripple-color-${rippleColor}`]: rippleColor,
      };
    },
    linkIconProps: {
      icon: String,
      iconMaterial: String,
      iconF7: String,
      iconIos: String,
      iconMd: String,
      iconAurora: String,
      iconColor: String,
      iconSize: [String, Number],
    },
    linkRouterProps: {
      back: Boolean,
      external: Boolean,
      force: Boolean,
      animate: {
        type: Boolean,
        default: undefined,
      },
      ignoreCache: Boolean,
      reloadCurrent: Boolean,
      reloadAll: Boolean,
      reloadPrevious: Boolean,
      reloadDetail: {
        type: Boolean,
        default: undefined,
      },
      routeTabId: String,
      view: String,
      routeProps: Object,
      preventRouter: Boolean,
      transition: String,
    },
    linkRouterAttrs(props) {
      const {
        force,
        reloadCurrent,
        reloadPrevious,
        reloadAll,
        reloadDetail,
        animate,
        ignoreCache,
        routeTabId,
        view,
        transition,
      } = props;

      let dataAnimate;
      if ('animate' in props && typeof animate !== 'undefined') {
        dataAnimate = animate.toString();
      }

      let dataReloadDetail;
      if ('reloadDetail' in props && typeof reloadDetail !== 'undefined') {
        dataReloadDetail = reloadDetail.toString();
      }

      return {
        'data-force': force || undefined,
        'data-reload-current': reloadCurrent || undefined,
        'data-reload-all': reloadAll || undefined,
        'data-reload-previous': reloadPrevious || undefined,
        'data-reload-detail': dataReloadDetail,
        'data-animate': dataAnimate,
        'data-ignore-cache': ignoreCache || undefined,
        'data-route-tab-id': routeTabId || undefined,
        'data-view': Utils.isStringProp(view) ? view : undefined,
        'data-transition': Utils.isStringProp(transition) ? transition : undefined,
      };
    },
    linkRouterClasses(props) {
      const { back, linkBack, external, preventRouter } = props;

      return {
        back: back || linkBack,
        external,
        'prevent-router': preventRouter,
      };
    },
    linkActionsProps: {
      searchbarEnable: [Boolean, String],
      searchbarDisable: [Boolean, String],

      searchbarClear: [Boolean, String],
      searchbarToggle: [Boolean, String],

      // Panel
      panelOpen: [Boolean, String],
      panelClose: [Boolean, String],
      panelToggle: [Boolean, String],

      // Popup
      popupOpen: [Boolean, String],
      popupClose: [Boolean, String],

      // Actions
      actionsOpen: [Boolean, String],
      actionsClose: [Boolean, String],

      // Popover
      popoverOpen: [Boolean, String],
      popoverClose: [Boolean, String],

      // Login Screen
      loginScreenOpen: [Boolean, String],
      loginScreenClose: [Boolean, String],

      // Picker
      sheetOpen: [Boolean, String],
      sheetClose: [Boolean, String],

      // Sortable
      sortableEnable: [Boolean, String],
      sortableDisable: [Boolean, String],
      sortableToggle: [Boolean, String],

      // Card
      cardOpen: [Boolean, String],
      cardPreventOpen: [Boolean, String],
      cardClose: [Boolean, String],

      // Menu
      menuClose: {
        type: [Boolean, String],
        default: undefined,
      },
    },
    linkActionsAttrs(props) {
      const {
        searchbarEnable,
        searchbarDisable,
        searchbarClear,
        searchbarToggle,
        panelOpen,
        panelClose,
        panelToggle,
        popupOpen,
        popupClose,
        actionsOpen,
        actionsClose,
        popoverOpen,
        popoverClose,
        loginScreenOpen,
        loginScreenClose,
        sheetOpen,
        sheetClose,
        sortableEnable,
        sortableDisable,
        sortableToggle,
        cardOpen,
        cardClose,
      } = props;

      return {
        'data-searchbar': (Utils.isStringProp(searchbarEnable) && searchbarEnable)
                          || (Utils.isStringProp(searchbarDisable) && searchbarDisable)
                          || (Utils.isStringProp(searchbarClear) && searchbarClear)
                          || (Utils.isStringProp(searchbarToggle) && searchbarToggle) || undefined,
        'data-panel': (Utils.isStringProp(panelOpen) && panelOpen)
                      || (Utils.isStringProp(panelClose) && panelClose)
                      || (Utils.isStringProp(panelToggle) && panelToggle) || undefined,
        'data-popup': (Utils.isStringProp(popupOpen) && popupOpen)
                      || (Utils.isStringProp(popupClose) && popupClose) || undefined,
        'data-actions': (Utils.isStringProp(actionsOpen) && actionsOpen)
                      || (Utils.isStringProp(actionsClose) && actionsClose) || undefined,
        'data-popover': (Utils.isStringProp(popoverOpen) && popoverOpen)
                        || (Utils.isStringProp(popoverClose) && popoverClose) || undefined,
        'data-sheet': (Utils.isStringProp(sheetOpen) && sheetOpen)
                      || (Utils.isStringProp(sheetClose) && sheetClose) || undefined,
        'data-login-screen': (Utils.isStringProp(loginScreenOpen) && loginScreenOpen)
                             || (Utils.isStringProp(loginScreenClose) && loginScreenClose) || undefined,
        'data-sortable': (Utils.isStringProp(sortableEnable) && sortableEnable)
                         || (Utils.isStringProp(sortableDisable) && sortableDisable)
                         || (Utils.isStringProp(sortableToggle) && sortableToggle) || undefined,
        'data-card': (Utils.isStringProp(cardOpen) && cardOpen)
                      || (Utils.isStringProp(cardClose) && cardClose) || undefined,
      };
    },
    linkActionsClasses(props) {
      const {
        searchbarEnable,
        searchbarDisable,
        searchbarClear,
        searchbarToggle,
        panelOpen,
        panelClose,
        panelToggle,
        popupOpen,
        popupClose,
        actionsClose,
        actionsOpen,
        popoverOpen,
        popoverClose,
        loginScreenOpen,
        loginScreenClose,
        sheetOpen,
        sheetClose,
        sortableEnable,
        sortableDisable,
        sortableToggle,
        cardOpen,
        cardPreventOpen,
        cardClose,
        menuClose,
      } = props;

      return {
        'searchbar-enable': searchbarEnable || searchbarEnable === '',
        'searchbar-disable': searchbarDisable || searchbarDisable === '',
        'searchbar-clear': searchbarClear || searchbarClear === '',
        'searchbar-toggle': searchbarToggle || searchbarToggle === '',
        'panel-close': panelClose || panelClose === '',
        'panel-open': panelOpen || panelOpen === '',
        'panel-toggle': panelToggle || panelToggle === '',
        'popup-close': popupClose || popupClose === '',
        'popup-open': popupOpen || popupOpen === '',
        'actions-close': actionsClose || actionsClose === '',
        'actions-open': actionsOpen || actionsOpen === '',
        'popover-close': popoverClose || popoverClose === '',
        'popover-open': popoverOpen || popoverOpen === '',
        'sheet-close': sheetClose || sheetClose === '',
        'sheet-open': sheetOpen || sheetOpen === '',
        'login-screen-close': loginScreenClose || loginScreenClose === '',
        'login-screen-open': loginScreenOpen || loginScreenOpen === '',
        'sortable-enable': sortableEnable || sortableEnable === '',
        'sortable-disable': sortableDisable || sortableDisable === '',
        'sortable-toggle': sortableToggle || sortableToggle === '',
        'card-close': cardClose || cardClose === '',
        'card-open': cardOpen || cardOpen === '',
        'card-prevent-open': cardPreventOpen || cardPreventOpen === '',
        'menu-close': menuClose || menuClose === '',
      };
    },
  };

  function __vueComponentProps (component) {
    const props = {};
    const $props = component.$props;
    Object.keys($props).forEach((propKey) => {
      if (typeof $props[propKey] !== 'undefined') props[propKey] = $props[propKey];
    });

    const children = [];
    Object.keys(component.$slots).forEach((slotName) => {
      children.push(...component.$slots[slotName]);
    });
    props.children = children;

    return props;
  }

  ({
    props: Object.assign({
      id: [String, Number]
    }, Mixins.colorProps),
    name: 'f7-accordion-content',

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        className,
        id,
        style
      } = props;
      const classes = Utils.classNames(className, 'accordion-item-content', Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  function __vueComponentDispatchEvent (component, events, ...args) {
    const self = component;
    events.split(' ').forEach((event) => {
      self.$emit(event, ...args);
    });
  }

  ({
    name: 'f7-accordion-item',
    props: Object.assign({
      id: [String, Number],
      opened: Boolean
    }, Mixins.colorProps),

    created() {
      Utils.bindMethods(this, 'onBeforeOpen onOpen onOpened onBeforeClose onClose onClosed'.split(' '));
    },

    mounted() {
      const self = this;
      const el = self.$refs.el;
      if (!el) return;
      self.eventTargetEl = el;
      self.$f7ready(f7 => {
        f7.on('accordionBeforeOpen', self.onBeforeOpen);
        f7.on('accordionOpen', self.onOpen);
        f7.on('accordionOpened', self.onOpened);
        f7.on('accordionBeforeClose', self.onBeforeClose);
        f7.on('accordionClose', self.onClose);
        f7.on('accordionClosed', self.onClosed);
      });
    },

    beforeDestroy() {
      const self = this;
      const el = self.$refs.el;
      if (!el || !self.$f7) return;
      const f7 = self.$f7;
      f7.off('accordionBeforeOpen', self.onBeforeOpen);
      f7.off('accordionOpen', self.onOpen);
      f7.off('accordionOpened', self.onOpened);
      f7.off('accordionBeforeClose', self.onBeforeClose);
      f7.off('accordionClose', self.onClose);
      f7.off('accordionClosed', self.onClosed);
      delete this.eventTargetEl;
    },

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        className,
        id,
        style,
        opened
      } = props;
      const classes = Utils.classNames(className, 'accordion-item', {
        'accordion-item-opened': opened
      }, Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        ref: 'el',
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    methods: {
      onBeforeOpen(el, prevent) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('accordionBeforeOpen accordion:beforeopen', prevent);
      },

      onOpen(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('accordionOpen accordion:open');
      },

      onOpened(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('accordionOpened accordion:opened');
      },

      onBeforeClose(el, prevent) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('accordionBeforeClose accordion:beforeclose', prevent);
      },

      onClose(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('accordionClose accordion:close');
      },

      onClosed(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('accordionClosed accordion:closed');
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    props: Object.assign({
      id: [String, Number]
    }, Mixins.colorProps),
    name: 'f7-accordion-toggle',

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        className,
        id,
        style
      } = props;
      const classes = Utils.classNames(className, 'accordion-item-toggle', Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    props: Object.assign({
      id: [String, Number],
      accordionOpposite: Boolean
    }, Mixins.colorProps),
    name: 'f7-accordion',

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        className,
        id,
        style,
        accordionOpposite
      } = props;
      const classes = Utils.classNames(className, 'accordion-list', accordionOpposite && 'accordion-opposite', Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-actions-button',
    props: Object.assign({
      id: [String, Number],
      bold: Boolean,
      close: {
        type: Boolean,
        default: true
      }
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        id,
        className,
        style,
        bold
      } = props;
      let mediaEl;

      if (self.$slots.media && self.$slots.media.length) {
        mediaEl = _h('div', {
          class: 'actions-button-media'
        }, [this.$slots['media']]);
      }

      const classes = Utils.classNames(className, {
        'actions-button': true,
        'actions-button-bold': bold
      }, Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        ref: 'el',
        attrs: {
          id: id
        }
      }, [mediaEl, _h('div', {
        class: 'actions-button-text'
      }, [this.$slots['default']])]);
    },

    created() {
      Utils.bindMethods(this, ['onClick']);
    },

    mounted() {
      this.$refs.el.addEventListener('click', this.onClick);
    },

    beforeDestroy() {
      this.$refs.el.removeEventListener('click', this.onClick);
    },

    methods: {
      onClick(event) {
        const self = this;
        const $$ = self.$$;
        const el = self.$refs.el;

        if (self.props.close && self.$f7 && el) {
          self.$f7.actions.close($$(el).parents('.actions-modal'));
        }

        self.dispatchEvent('click', event);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-actions-group',
    props: Object.assign({
      id: [String, Number]
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        className,
        id,
        style
      } = props;
      const classes = Utils.classNames(className, 'actions-group', Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-actions-label',
    props: Object.assign({
      id: [String, Number],
      bold: Boolean
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        className,
        id,
        style,
        bold
      } = props;
      const classes = Utils.classNames(className, 'actions-label', {
        'actions-button-bold': bold
      }, Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        ref: 'el',
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    created() {
      Utils.bindMethods(this, ['onClick']);
    },

    mounted() {
      this.$refs.el.addEventListener('click', this.onClick);
    },

    beforeDestroy() {
      this.$refs.el.removeEventListener('click', this.onClick);
    },

    methods: {
      onClick(event) {
        this.dispatchEvent('click', event);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-actions',
    props: Object.assign({
      id: [String, Number],
      opened: Boolean,
      grid: Boolean,
      convertToPopover: Boolean,
      forceToPopover: Boolean,
      target: [String, Object],
      backdrop: Boolean,
      backdropEl: [String, Object],
      closeByBackdropClick: Boolean,
      closeByOutsideClick: Boolean,
      closeOnEscape: Boolean
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        className,
        id,
        style,
        grid
      } = props;
      const classes = Utils.classNames(className, 'actions-modal', {
        'actions-grid': grid
      }, Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        ref: 'el',
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    watch: {
      'props.opened': function watchOpened(opened) {
        const self = this;
        if (!self.f7Actions) return;

        if (opened) {
          self.f7Actions.open();
        } else {
          self.f7Actions.close();
        }
      }
    },

    created() {
      Utils.bindMethods(this, ['onOpen', 'onOpened', 'onClose', 'onClosed']);
    },

    mounted() {
      const self = this;
      const el = self.$refs.el;
      if (!el) return;
      const props = self.props;
      const {
        grid,
        target,
        convertToPopover,
        forceToPopover,
        opened,
        closeByBackdropClick,
        closeByOutsideClick,
        closeOnEscape,
        backdrop,
        backdropEl
      } = props;
      const actionsParams = {
        el,
        grid,
        on: {
          open: self.onOpen,
          opened: self.onOpened,
          close: self.onClose,
          closed: self.onClosed
        }
      };
      if (target) actionsParams.targetEl = target;
      {
        const propsData = self.$options.propsData;
        if (typeof propsData.convertToPopover !== 'undefined') actionsParams.convertToPopover = convertToPopover;
        if (typeof propsData.forceToPopover !== 'undefined') actionsParams.forceToPopover = forceToPopover;
        if (typeof propsData.backdrop !== 'undefined') actionsParams.backdrop = backdrop;
        if (typeof propsData.backdropEl !== 'undefined') actionsParams.backdropEl = backdropEl;
        if (typeof propsData.closeByBackdropClick !== 'undefined') actionsParams.closeByBackdropClick = closeByBackdropClick;
        if (typeof propsData.closeByOutsideClick !== 'undefined') actionsParams.closeByOutsideClick = closeByOutsideClick;
        if (typeof propsData.closeOnEscape !== 'undefined') actionsParams.closeOnEscape = closeOnEscape;
      }
      self.$f7ready(() => {
        self.f7Actions = self.$f7.actions.create(actionsParams);

        if (opened) {
          self.f7Actions.open(false);
        }
      });
    },

    beforeDestroy() {
      const self = this;
      if (self.f7Actions) self.f7Actions.destroy();
      delete self.f7Actions;
    },

    methods: {
      onOpen(instance) {
        this.dispatchEvent('actions:open actionsOpen', instance);
      },

      onOpened(instance) {
        this.dispatchEvent('actions:opened actionsOpened', instance);
      },

      onClose(instance) {
        this.dispatchEvent('actions:close actionsClose', instance);
      },

      onClosed(instance) {
        this.dispatchEvent('actions:closed actionsClosed', instance);
      },

      open(animate) {
        const self = this;
        if (!self.f7Actions) return undefined;
        return self.f7Actions.open(animate);
      },

      close(animate) {
        const self = this;
        if (!self.f7Actions) return undefined;
        return self.f7Actions.close(animate);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  const f7 = {
    instance: null,
    Framework7: null,
    events: null,
    init(rootEl, params = {}, routes) {
      const { events, Framework7 } = f7;
      const f7Params = Utils.extend({}, params, {
        root: rootEl,
      });
      if (routes && routes.length && !f7Params.routes) f7Params.routes = routes;

      const instance = new Framework7(f7Params);
      if (instance.initialized) {
        f7.instance = instance;
        events.emit('ready', f7.instance);
      } else {
        instance.on('init', () => {
          f7.instance = instance;
          events.emit('ready', f7.instance);
        });
      }
    },
    ready(callback) {
      if (!callback) return;
      if (f7.instance) callback(f7.instance);
      else {
        f7.events.once('ready', callback);
      }
    },
    routers: {
      views: [],
      tabs: [],
      modals: null,
    },
  };

  function __vueComponentSetState (component, updater, callback) {
    const self = component;
    let newState;
    if (typeof updater === 'function') {
      newState = updater(self.state, self.props);
    } else {
      newState = updater;
    }
    Object.keys(newState).forEach((key) => {
      self.$set(self.state, key, newState[key]);
    });
    if (typeof callback === 'function') callback();
  }

  var RoutableModals = {
    name: 'f7-routable-modals',

    data() {
      const state = (() => {
        return {
          modals: []
        };
      })();

      return {
        state
      };
    },

    render() {
      const _h = this.$createElement;
      return _h('div', {
        ref: 'el',
        class: 'framework7-modals'
      }, [this.state.modals.map(modal => {
        const ModalComponent = modal.component;
        {
          return _h(ModalComponent, {
            key: modal.id,
            props: modal.props
          });
        }
      })]);
    },

    updated() {
      const self = this;
      if (!self.routerData) return;
      f7.events.emit('modalsRouterDidUpdate', self.routerData);
    },

    beforeDestroy() {
      const self = this;
      if (!self.routerData) return;
      f7.routers.modals = null;
      self.routerData = null;
      delete self.routerData;
    },

    mounted() {
      const self = this;
      const el = self.$refs.el;
      self.routerData = {
        modals: self.state.modals,
        el,
        component: self,

        setModals(modals) {
          self.setState({
            modals
          });
        }

      };
      f7.routers.modals = self.routerData;
    },

    methods: {
      setState(updater, callback) {
        __vueComponentSetState(this, updater, callback);
      }

    }
  };

  ({
    name: 'f7-app',
    props: Object.assign({
      id: [String, Number],
      params: Object,
      routes: Array
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        id,
        style,
        className
      } = props;
      const classes = Utils.classNames(className, 'framework7-root', Mixins.colorClasses(props));
      return _h('div', {
        ref: 'el',
        style: style,
        class: classes,
        attrs: {
          id: id || 'framework7-root'
        }
      }, [this.$slots['default'], _h(RoutableModals)]);
    },

    mounted() {
      const self = this;
      const {
        params = {},
        routes
      } = self.props;
      const el = self.$refs.el;
      const parentEl = el.parentNode;

      if (parentEl && parentEl !== document.body && parentEl.parentNode === document.body) {
        parentEl.style.height = '100%';
      }

      if (f7.instance) return;
      f7.init(el, params, routes);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-appbar',
    props: Object.assign({
      id: [String, Number],
      noShadow: Boolean,
      noHairline: Boolean,
      inner: {
        type: Boolean,
        default: true
      },
      innerClass: String,
      innerClassName: String
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        inner,
        innerClass,
        innerClassName,
        className,
        id,
        style,
        noShadow,
        noHairline
      } = props;
      let innerEl;

      if (inner) {
        innerEl = _h('div', {
          class: Utils.classNames('appbar-inner', innerClass, innerClassName)
        }, [this.$slots['default']]);
      }

      const classes = Utils.classNames(className, 'appbar', {
        'no-shadow': noShadow,
        'no-hairline': noHairline
      }, Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['before-inner'], innerEl || self.$slots.default, this.$slots['after-inner']]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  var F7Badge = {
    name: 'f7-badge',
    props: Object.assign({
      id: [String, Number],
      tooltip: String,
      tooltipTrigger: String
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        className,
        id,
        style
      } = props;
      const classes = Utils.classNames(className, 'badge', Mixins.colorClasses(props));
      return _h('span', {
        ref: 'el',
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    watch: {
      'props.tooltip': function watchTooltip(newText) {
        const self = this;

        if (!newText && self.f7Tooltip) {
          self.f7Tooltip.destroy();
          self.f7Tooltip = null;
          delete self.f7Tooltip;
          return;
        }

        if (newText && !self.f7Tooltip && self.$f7) {
          self.f7Tooltip = self.$f7.tooltip.create({
            targetEl: self.$refs.el,
            text: newText,
            trigger: self.props.tooltipTrigger
          });
          return;
        }

        if (!newText || !self.f7Tooltip) return;
        self.f7Tooltip.setText(newText);
      }
    },

    mounted() {
      const self = this;
      const el = self.$refs.el;
      if (!el) return;
      const {
        tooltip,
        tooltipTrigger
      } = self.props;
      if (!tooltip) return;
      self.$f7ready(f7 => {
        self.f7Tooltip = f7.tooltip.create({
          targetEl: el,
          text: tooltip,
          trigger: tooltipTrigger
        });
      });
    },

    beforeDestroy() {
      const self = this;

      if (self.f7Tooltip && self.f7Tooltip.destroy) {
        self.f7Tooltip.destroy();
        self.f7Tooltip = null;
        delete self.f7Tooltip;
      }
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  };

  ({
    name: 'f7-block-footer',
    props: Object.assign({
      id: [String, Number]
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        className,
        id,
        style
      } = props;
      const classes = Utils.classNames(className, 'block-footer', Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-block-header',
    props: Object.assign({
      id: [String, Number]
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        className,
        id,
        style
      } = props;
      const classes = Utils.classNames(className, 'block-header', Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-block-title',
    props: Object.assign({
      id: [String, Number],
      large: Boolean,
      medium: Boolean
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        className,
        id,
        style,
        large,
        medium
      } = props;
      const classes = Utils.classNames(className, 'block-title', {
        'block-title-large': large,
        'block-title-medium': medium
      }, Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-block',
    props: Object.assign({
      id: [String, Number],
      inset: Boolean,
      xsmallInset: Boolean,
      smallInset: Boolean,
      mediumInset: Boolean,
      largeInset: Boolean,
      xlargeInset: Boolean,
      strong: Boolean,
      tabs: Boolean,
      tab: Boolean,
      tabActive: Boolean,
      accordionList: Boolean,
      accordionOpposite: Boolean,
      noHairlines: Boolean,
      noHairlinesMd: Boolean,
      noHairlinesIos: Boolean,
      noHairlinesAurora: Boolean
    }, Mixins.colorProps),

    created() {
      Utils.bindMethods(this, ['onTabShow', 'onTabHide']);
    },

    mounted() {
      const self = this;
      const el = self.$refs.el;
      if (!el) return;
      self.eventTargetEl = el;
      self.$f7ready(f7 => {
        f7.on('tabShow', self.onTabShow);
        f7.on('tabHide', self.onTabHide);
      });
    },

    beforeDestroy() {
      const el = this.$refs.el;
      if (!el || !this.$f7) return;
      this.$f7.off('tabShow', this.onTabShow);
      this.$f7.off('tabHide', this.onTabHide);
      delete this.eventTargetEl;
    },

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        className,
        inset,
        xsmallInset,
        smallInset,
        mediumInset,
        largeInset,
        xlargeInset,
        strong,
        accordionList,
        accordionOpposite,
        tabs,
        tab,
        tabActive,
        noHairlines,
        noHairlinesIos,
        noHairlinesMd,
        noHairlinesAurora,
        id,
        style
      } = props;
      const classes = Utils.classNames(className, 'block', {
        inset,
        'xsmall-inset': xsmallInset,
        'small-inset': smallInset,
        'medium-inset': mediumInset,
        'large-inset': largeInset,
        'xlarge-inset': xlargeInset,
        'block-strong': strong,
        'accordion-list': accordionList,
        'accordion-opposite': accordionOpposite,
        tabs,
        tab,
        'tab-active': tabActive,
        'no-hairlines': noHairlines,
        'no-hairlines-md': noHairlinesMd,
        'no-hairlines-ios': noHairlinesIos,
        'no-hairlines-aurora': noHairlinesAurora
      }, Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        ref: 'el',
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    methods: {
      onTabShow(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('tabShow tab:show', el);
      },

      onTabHide(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('tabHide tab:hide', el);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  var F7Icon = {
    name: 'f7-icon',
    props: Object.assign({
      id: [String, Number],
      material: String,
      f7: String,
      icon: String,
      ios: String,
      aurora: String,
      md: String,
      tooltip: String,
      tooltipTrigger: String,
      size: [String, Number]
    }, Mixins.colorProps),

    data() {
      const props = __vueComponentProps(this);

      const state = (() => {
        const self = this;
        const $f7 = self.$f7;

        if (!$f7) {
          self.$f7ready(() => {
            self.setState({
              _theme: self.$theme
            });
          });
        }

        return {
          _theme: $f7 ? self.$theme : null
        };
      })();

      return {
        state
      };
    },

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        id,
        style
      } = props;
      let size = props.size;

      if (typeof size === 'number' || parseFloat(size) === size * 1) {
        size = `${size}px`;
      }

      return _h('i', {
        ref: 'el',
        style: Utils.extend({
          fontSize: size,
          width: size,
          height: size
        }, style),
        class: self.classes,
        attrs: {
          id: id
        }
      }, [self.iconTextComputed, this.$slots['default']]);
    },

    watch: {
      'props.tooltip': function watchTooltip(newText) {
        const self = this;

        if (!newText && self.f7Tooltip) {
          self.f7Tooltip.destroy();
          self.f7Tooltip = null;
          delete self.f7Tooltip;
          return;
        }

        if (newText && !self.f7Tooltip && self.$f7) {
          self.f7Tooltip = self.$f7.tooltip.create({
            targetEl: self.$refs.el,
            text: newText,
            trigger: self.props.tooltipTrigger
          });
          return;
        }

        if (!newText || !self.f7Tooltip) return;
        self.f7Tooltip.setText(newText);
      }
    },

    mounted() {
      const self = this;
      const el = self.$refs.el;
      if (!el) return;
      const {
        tooltip,
        tooltipTrigger
      } = self.props;
      if (!tooltip) return;
      self.$f7ready(f7 => {
        self.f7Tooltip = f7.tooltip.create({
          targetEl: el,
          text: tooltip,
          trigger: tooltipTrigger
        });
      });
    },

    beforeDestroy() {
      const self = this;

      if (self.f7Tooltip && self.f7Tooltip.destroy) {
        self.f7Tooltip.destroy();
        self.f7Tooltip = null;
        delete self.f7Tooltip;
      }
    },

    computed: {
      iconTextComputed() {
        const self = this;
        const {
          material,
          f7,
          md,
          ios,
          aurora
        } = self.props;
        const theme = self.state._theme;
        let text = material || f7;

        if (md && theme && theme.md && (md.indexOf('material:') >= 0 || md.indexOf('f7:') >= 0)) {
          text = md.split(':')[1];
        } else if (ios && theme && theme.ios && (ios.indexOf('material:') >= 0 || ios.indexOf('f7:') >= 0)) {
          text = ios.split(':')[1];
        } else if (aurora && theme && theme.aurora && (aurora.indexOf('material:') >= 0 || aurora.indexOf('f7:') >= 0)) {
          text = aurora.split(':')[1];
        }

        return text;
      },

      classes() {
        let classes = {
          icon: true
        };
        const self = this;
        const props = self.props;
        const theme = self.state._theme;
        const {
          material,
          f7,
          icon,
          md,
          ios,
          aurora,
          className
        } = props;
        let themeIcon;
        if (theme && theme.ios) themeIcon = ios;else if (theme && theme.md) themeIcon = md;else if (theme && theme.aurora) themeIcon = aurora;

        if (themeIcon) {
          const parts = themeIcon.split(':');
          const prop = parts[0];
          const value = parts[1];

          if (prop === 'material' || prop === 'f7') {
            classes['material-icons'] = prop === 'material';
            classes['f7-icons'] = prop === 'f7';
          }

          if (prop === 'icon') {
            classes[value] = true;
          }
        } else {
          classes = {
            icon: true,
            'material-icons': material,
            'f7-icons': f7
          };
          if (icon) classes[icon] = true;
        }

        return Utils.classNames(className, classes, Mixins.colorClasses(props));
      },

      props() {
        return __vueComponentProps(this);
      }

    },
    methods: {
      setState(updater, callback) {
        __vueComponentSetState(this, updater, callback);
      }

    }
  };

  var __vueComponentTransformJSXProps = (props) => {
    if (!props) return props;
    const nestedPropsKeys = ('style class domProps slot key ref attrs on props').split(' ');
    Object.keys(props).forEach((key) => {
      if (key === 'className') {
        props.class = props.className;
        delete props.className;
        return;
      } else if (key === 'dangerouslySetInnerHTML') {
        if (!props.domProps) props.domProps = {};
        props.domProps.innerHTML = props[key];
        if (props.domProps.innerHTML && props.domProps.innerHTML.__html) {
          props.domProps.innerHTML = props.domProps.innerHTML.__html;
        }
        delete props.dangerouslySetInnerHTML;
        return;
      } else if (key.match(/^on?([A-Z])/)) {
        if (!props.on) props.on = {};
        const newKey = key.replace(/(^on?)([A-Z])/, (found, first, second) => second.toLowerCase());
        props.on[newKey] = props[key];
        delete props[key];
        return;
      }
      if (nestedPropsKeys.indexOf(key) >= 0) {
        return;
      }
      if (!props.attrs) {
        props.attrs = {};
      }
      if (!props.attrs[key]) {
        props.attrs[key] = props[key];
        delete props[key];
      }
    });

    return props;
  };

  ({
    name: 'f7-button',
    props: Object.assign({
      id: [String, Number],
      text: String,
      tabLink: [Boolean, String],
      tabLinkActive: Boolean,
      type: String,
      href: {
        type: [String, Boolean],
        default: '#'
      },
      target: String,
      round: Boolean,
      roundMd: Boolean,
      roundIos: Boolean,
      roundAurora: Boolean,
      fill: Boolean,
      fillMd: Boolean,
      fillIos: Boolean,
      fillAurora: Boolean,
      large: Boolean,
      largeMd: Boolean,
      largeIos: Boolean,
      largeAurora: Boolean,
      small: Boolean,
      smallMd: Boolean,
      smallIos: Boolean,
      smallAurora: Boolean,
      raised: Boolean,
      raisedMd: Boolean,
      raisedIos: Boolean,
      raisedAurora: Boolean,
      outline: Boolean,
      outlineMd: Boolean,
      outlineIos: Boolean,
      outlineAurora: Boolean,
      active: Boolean,
      disabled: Boolean,
      tooltip: String,
      tooltipTrigger: String
    }, Mixins.colorProps, {}, Mixins.linkIconProps, {}, Mixins.linkRouterProps, {}, Mixins.linkActionsProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      let iconEl;
      let textEl;
      const props = self.props;
      const {
        text,
        icon,
        iconMaterial,
        iconF7,
        iconMd,
        iconIos,
        iconAurora,
        iconColor,
        iconSize,
        id,
        style,
        type
      } = props;

      if (text) {
        textEl = _h('span', [text]);
      }

      if (icon || iconMaterial || iconF7 || iconMd || iconIos || iconAurora) {
        iconEl = _h(F7Icon, {
          attrs: {
            material: iconMaterial,
            f7: iconF7,
            icon: icon,
            md: iconMd,
            ios: iconIos,
            aurora: iconAurora,
            color: iconColor,
            size: iconSize
          }
        });
      }

      const ButtonTag = type === 'submit' || type === 'reset' || type === 'button' ? 'button' : 'a';
      return _h(ButtonTag, __vueComponentTransformJSXProps(Object.assign({
        ref: 'el',
        style: style,
        class: self.classes
      }, self.attrs, {
        attrs: {
          id: id
        }
      })), [iconEl, textEl, this.$slots['default']]);
    },

    computed: {
      attrs() {
        const self = this;
        const props = self.props;
        const {
          href,
          target,
          tabLink,
          type
        } = props;
        let hrefComputed = href;
        if (href === true) hrefComputed = '#';
        if (href === false) hrefComputed = undefined;
        return Utils.extend({
          href: hrefComputed,
          target,
          type,
          'data-tab': Utils.isStringProp(tabLink) && tabLink || undefined
        }, Mixins.linkRouterAttrs(props), Mixins.linkActionsAttrs(props));
      },

      classes() {
        const self = this;
        const props = self.props;
        const {
          tabLink,
          tabLinkActive,
          round,
          roundIos,
          roundAurora,
          roundMd,
          fill,
          fillIos,
          fillAurora,
          fillMd,
          large,
          largeIos,
          largeAurora,
          largeMd,
          small,
          smallIos,
          smallAurora,
          smallMd,
          raised,
          raisedIos,
          raisedAurora,
          raisedMd,
          active,
          outline,
          outlineIos,
          outlineAurora,
          outlineMd,
          disabled,
          className
        } = props;
        return Utils.classNames(className, 'button', {
          'tab-link': tabLink || tabLink === '',
          'tab-link-active': tabLinkActive,
          'button-round': round,
          'button-round-ios': roundIos,
          'button-round-aurora': roundAurora,
          'button-round-md': roundMd,
          'button-fill': fill,
          'button-fill-ios': fillIos,
          'button-fill-aurora': fillAurora,
          'button-fill-md': fillMd,
          'button-large': large,
          'button-large-ios': largeIos,
          'button-large-aurora': largeAurora,
          'button-large-md': largeMd,
          'button-small': small,
          'button-small-ios': smallIos,
          'button-small-aurora': smallAurora,
          'button-small-md': smallMd,
          'button-raised': raised,
          'button-raised-ios': raisedIos,
          'button-raised-aurora': raisedAurora,
          'button-raised-md': raisedMd,
          'button-active': active,
          'button-outline': outline,
          'button-outline-ios': outlineIos,
          'button-outline-aurora': outlineAurora,
          'button-outline-md': outlineMd,
          disabled
        }, Mixins.colorClasses(props), Mixins.linkRouterClasses(props), Mixins.linkActionsClasses(props));
      },

      props() {
        return __vueComponentProps(this);
      }

    },
    methods: {
      onClick(event) {
        this.dispatchEvent('click', event);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    watch: {
      'props.tooltip': function watchTooltip(newText) {
        const self = this;

        if (!newText && self.f7Tooltip) {
          self.f7Tooltip.destroy();
          self.f7Tooltip = null;
          delete self.f7Tooltip;
          return;
        }

        if (newText && !self.f7Tooltip && self.$f7) {
          self.f7Tooltip = self.$f7.tooltip.create({
            targetEl: self.$refs.el,
            text: newText,
            trigger: self.props.tooltipTrigger
          });
          return;
        }

        if (!newText || !self.f7Tooltip) return;
        self.f7Tooltip.setText(newText);
      }
    },

    created() {
      Utils.bindMethods(this, ['onClick']);
    },

    mounted() {
      const self = this;
      const el = self.$refs.el;
      el.addEventListener('click', self.onClick);
      const {
        tooltip,
        tooltipTrigger,
        routeProps
      } = self.props;

      if (routeProps) {
        el.f7RouteProps = routeProps;
      }

      if (!tooltip) return;
      self.$f7ready(f7 => {
        self.f7Tooltip = f7.tooltip.create({
          targetEl: el,
          text: tooltip,
          trigger: tooltipTrigger
        });
      });
    },

    updated() {
      const self = this;
      const el = self.$refs.el;
      const {
        routeProps
      } = self.props;

      if (routeProps) {
        el.f7RouteProps = routeProps;
      }
    },

    beforeDestroy() {
      const self = this;
      const el = self.$refs.el;
      el.removeEventListener('click', self.onClick);
      delete el.f7RouteProps;

      if (self.f7Tooltip && self.f7Tooltip.destroy) {
        self.f7Tooltip.destroy();
        self.f7Tooltip = null;
        delete self.f7Tooltip;
      }
    }

  });

  var F7CardContent = {
    name: 'f7-card-content',
    props: Object.assign({
      id: [String, Number],
      padding: {
        type: Boolean,
        default: true
      }
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        id,
        className,
        style,
        padding
      } = props;
      const classes = Utils.classNames(className, 'card-content', {
        'card-content-padding': padding
      }, Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  };

  var F7CardFooter = {
    name: 'f7-card-footer',
    props: Object.assign({
      id: [String, Number]
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        className,
        id,
        style
      } = props;
      const classes = Utils.classNames(className, 'card-footer', Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  };

  var F7CardHeader = {
    name: 'f7-card-header',
    props: Object.assign({
      id: [String, Number]
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        className,
        id,
        style
      } = props;
      const classes = Utils.classNames(className, 'card-header', Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  };

  ({
    name: 'f7-card',
    props: Object.assign({
      id: [String, Number],
      title: [String, Number],
      content: [String, Number],
      footer: [String, Number],
      outline: Boolean,
      expandable: Boolean,
      expandableAnimateWidth: Boolean,
      expandableOpened: Boolean,
      animate: {
        type: Boolean,
        default: undefined
      },
      hideNavbarOnOpen: {
        type: Boolean,
        default: undefined
      },
      hideToolbarOnOpen: {
        type: Boolean,
        default: undefined
      },
      hideStatusbarOnOpen: {
        type: Boolean,
        default: undefined
      },
      scrollableEl: {
        type: String,
        default: undefined
      },
      swipeToClose: {
        type: Boolean,
        default: undefined
      },
      closeByBackdropClick: {
        type: Boolean,
        default: undefined
      },
      backdrop: {
        type: Boolean,
        default: undefined
      },
      backdropEl: {
        type: String,
        default: undefined
      },
      noShadow: Boolean,
      noBorder: Boolean,
      padding: {
        type: Boolean,
        default: true
      }
    }, Mixins.colorProps),
    watch: {
      'props.expandableOpened': function watchOpened(expandableOpened) {
        const self = this;

        if (expandableOpened) {
          self.open();
        } else {
          self.close();
        }
      }
    },

    created() {
      Utils.bindMethods(this, 'onBeforeOpen onOpen onOpened onClose onClosed'.split(' '));
    },

    mounted() {
      const self = this;
      if (!self.props.expandable) return;
      const el = self.$refs.el;
      if (!el) return;
      self.eventTargetEl = el;
      self.$f7ready(f7 => {
        f7.on('cardBeforeOpen', self.onBeforeOpen);
        f7.on('cardOpen', self.onOpen);
        f7.on('cardOpened', self.onOpened);
        f7.on('cardClose', self.onClose);
        f7.on('cardClosed', self.onClosed);

        if (self.props.expandable && self.props.expandableOpened) {
          self.$f7.card.open(el, false);
        }
      });
    },

    beforeDestroy() {
      const self = this;
      if (!self.props.expandable) return;
      const el = self.$refs.el;
      if (!el || !self.$f7) return;
      self.$f7.off('cardBeforeOpen', self.onBeforeOpen);
      self.$f7.off('cardOpen', self.onOpen);
      self.$f7.off('cardOpened', self.onOpened);
      self.$f7.off('cardClose', self.onClose);
      self.$f7.off('cardClosed', self.onClosed);
      self.eventTargetEl = null;
      delete self.eventTargetEl;
    },

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        className,
        id,
        style,
        title,
        content,
        footer,
        padding,
        outline,
        expandable,
        expandableAnimateWidth,
        animate,
        hideNavbarOnOpen,
        hideToolbarOnOpen,
        hideStatusbarOnOpen,
        scrollableEl,
        swipeToClose,
        closeByBackdropClick,
        backdrop,
        backdropEl,
        noShadow,
        noBorder
      } = props;
      let headerEl;
      let contentEl;
      let footerEl;
      const classes = Utils.classNames(className, 'card', {
        'card-outline': outline,
        'card-expandable': expandable,
        'card-expandable-animate-width': expandableAnimateWidth,
        'no-shadow': noShadow,
        'no-border': noBorder
      }, Mixins.colorClasses(props));

      if (title || self.$slots && self.$slots.header) {
        headerEl = _h(F7CardHeader, [title, this.$slots['header']]);
      }

      if (content || self.$slots && self.$slots.content) {
        contentEl = _h(F7CardContent, {
          attrs: {
            padding: padding
          }
        }, [content, this.$slots['content']]);
      }

      if (footer || self.$slots && self.$slots.footer) {
        footerEl = _h(F7CardFooter, [footer, this.$slots['footer']]);
      }

      return _h('div', {
        style: style,
        class: classes,
        ref: 'el',
        attrs: {
          id: id,
          'data-animate': typeof animate === 'undefined' ? animate : animate.toString(),
          'data-hide-navbar-on-open': typeof hideNavbarOnOpen === 'undefined' ? hideNavbarOnOpen : hideNavbarOnOpen.toString(),
          'data-hide-toolbar-on-open': typeof hideToolbarOnOpen === 'undefined' ? hideToolbarOnOpen : hideToolbarOnOpen.toString(),
          'data-hide-statusbar-on-open': typeof hideStatusbarOnOpen === 'undefined' ? hideStatusbarOnOpen : hideStatusbarOnOpen.toString(),
          'data-scrollable-el': scrollableEl,
          'data-swipe-to-close': typeof swipeToClose === 'undefined' ? swipeToClose : swipeToClose.toString(),
          'data-close-by-backdrop-click': typeof closeByBackdropClick === 'undefined' ? closeByBackdropClick : closeByBackdropClick.toString(),
          'data-backdrop': typeof backdrop === 'undefined' ? backdrop : backdrop.toString(),
          'data-backdrop-el': backdropEl
        }
      }, [headerEl, contentEl, footerEl, this.$slots['default']]);
    },

    methods: {
      open() {
        const self = this;
        if (!self.$refs.el) return;
        self.$f7.card.open(self.$refs.el);
      },

      close() {
        const self = this;
        if (!self.$refs.el) return;
        self.$f7.card.close(self.$refs.el);
      },

      onBeforeOpen(el, prevent) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('cardBeforeOpen card:beforeopen', el, prevent);
      },

      onOpen(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('cardOpen card:open', el);
      },

      onOpened(el, pageEl) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('cardOpened card:opened', el, pageEl);
      },

      onClose(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('cardClose card:close', el);
      },

      onClosed(el, pageEl) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('cardClosed card:closed', el, pageEl);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-checkbox',
    props: Object.assign({
      id: [String, Number],
      checked: Boolean,
      indeterminate: Boolean,
      name: [Number, String],
      value: [Number, String, Boolean],
      disabled: Boolean,
      readonly: Boolean,
      defaultChecked: Boolean
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        name,
        value,
        disabled,
        readonly,
        checked,
        defaultChecked,
        id,
        style
      } = props;
      let inputEl;
      {
        inputEl = _h('input', {
          ref: 'inputEl',
          domProps: {
            value,
            disabled,
            readonly,
            checked
          },
          on: {
            change: self.onChange
          },
          attrs: {
            type: 'checkbox',
            name: name
          }
        });
      }

      const iconEl = _h('i', {
        class: 'icon-checkbox'
      });

      return _h('label', {
        style: style,
        class: self.classes,
        attrs: {
          id: id
        }
      }, [inputEl, iconEl, this.$slots['default']]);
    },

    computed: {
      classes() {
        const self = this;
        const props = self.props;
        const {
          className,
          disabled
        } = props;
        return Utils.classNames(className, {
          checkbox: true,
          disabled
        }, Mixins.colorClasses(props));
      },

      props() {
        return __vueComponentProps(this);
      }

    },

    created() {
      Utils.bindMethods(this, ['onChange']);
    },

    mounted() {
      const self = this;
      const {
        inputEl
      } = self.$refs;
      const {
        indeterminate
      } = self.props;

      if (indeterminate && inputEl) {
        inputEl.indeterminate = true;
      }
    },

    updated() {
      const self = this;
      const {
        inputEl
      } = self.$refs;
      const {
        indeterminate
      } = self.props;

      if (inputEl) {
        inputEl.indeterminate = indeterminate;
      }
    },

    methods: {
      onChange(event) {
        this.dispatchEvent('change', event);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    }
  });

  ({
    name: 'f7-chip',
    props: Object.assign({
      id: [String, Number],
      media: String,
      text: [String, Number],
      deleteable: Boolean,
      mediaBgColor: String,
      mediaTextColor: String,
      outline: Boolean,
      tooltip: String,
      tooltipTrigger: String
    }, Mixins.colorProps, {}, Mixins.linkIconProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        media,
        text,
        deleteable,
        className,
        id,
        style,
        mediaTextColor,
        mediaBgColor,
        outline,
        icon,
        iconMaterial,
        iconF7,
        iconMd,
        iconIos,
        iconAurora,
        iconColor,
        iconSize
      } = props;
      let iconEl;
      let mediaEl;
      let labelEl;
      let deleteEl;

      if (icon || iconMaterial || iconF7 || iconMd || iconIos || iconAurora) {
        iconEl = _h(F7Icon, {
          attrs: {
            material: iconMaterial,
            f7: iconF7,
            icon: icon,
            md: iconMd,
            ios: iconIos,
            aurora: iconAurora,
            color: iconColor,
            size: iconSize
          }
        });
      }

      if (media || iconEl || self.$slots && self.$slots.media) {
        const mediaClasses = Utils.classNames('chip-media', mediaTextColor && `text-color-${mediaTextColor}`, mediaBgColor && `bg-color-${mediaBgColor}`);
        mediaEl = _h('div', {
          class: mediaClasses
        }, [iconEl, media, this.$slots['media']]);
      }

      if (text || self.$slots && (self.$slots.text || self.$slots.default && self.$slots.default.length)) {
        labelEl = _h('div', {
          class: 'chip-label'
        }, [text, this.$slots['text'], this.$slots['default']]);
      }

      if (deleteable) {
        deleteEl = _h('a', {
          ref: 'deleteEl',
          class: 'chip-delete'
        });
      }

      const classes = Utils.classNames(className, 'chip', {
        'chip-outline': outline
      }, Mixins.colorClasses(props));
      return _h('div', {
        ref: 'el',
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [mediaEl, labelEl, deleteEl]);
    },

    watch: {
      'props.tooltip': function watchTooltip(newText) {
        const self = this;

        if (!newText && self.f7Tooltip) {
          self.f7Tooltip.destroy();
          self.f7Tooltip = null;
          delete self.f7Tooltip;
          return;
        }

        if (newText && !self.f7Tooltip && self.$f7) {
          self.f7Tooltip = self.$f7.tooltip.create({
            targetEl: self.$refs.el,
            text: newText,
            trigger: self.props.tooltipTrigger
          });
          return;
        }

        if (!newText || !self.f7Tooltip) return;
        self.f7Tooltip.setText(newText);
      }
    },

    created() {
      Utils.bindMethods(this, ['onClick', 'onDeleteClick']);
    },

    mounted() {
      const self = this;
      const el = self.$refs.el;
      el.addEventListener('click', self.onClick);

      if (self.$refs.deleteEl) {
        self.$refs.deleteEl.addEventListener('click', self.onDeleteClick);
      }

      const {
        tooltip,
        tooltipTrigger
      } = self.props;
      if (!tooltip) return;
      self.$f7ready(f7 => {
        self.f7Tooltip = f7.tooltip.create({
          targetEl: el,
          text: tooltip,
          trigger: tooltipTrigger
        });
      });
    },

    beforeDestroy() {
      const self = this;
      self.$refs.el.removeEventListener('click', self.onClick);

      if (self.$refs.deleteEl) {
        self.$refs.deleteEl.removeEventListener('click', self.onDeleteClick);
      }

      if (self.f7Tooltip && self.f7Tooltip.destroy) {
        self.f7Tooltip.destroy();
        self.f7Tooltip = null;
        delete self.f7Tooltip;
      }
    },

    methods: {
      onClick(event) {
        this.dispatchEvent('click', event);
      },

      onDeleteClick(event) {
        this.dispatchEvent('delete', event);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-col',
    props: Object.assign({
      id: [String, Number],
      tag: {
        type: String,
        default: 'div'
      },
      width: {
        type: [Number, String],
        default: 'auto'
      },
      xsmall: {
        type: [Number, String]
      },
      small: {
        type: [Number, String]
      },
      medium: {
        type: [Number, String]
      },
      large: {
        type: [Number, String]
      },
      xlarge: {
        type: [Number, String]
      },
      resizable: Boolean,
      resizableFixed: Boolean,
      resizableAbsolute: Boolean,
      resizableHandler: {
        type: Boolean,
        default: true
      }
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        className,
        id,
        style,
        tag,
        width,
        xsmall,
        small,
        medium,
        large,
        xlarge,
        resizable,
        resizableFixed,
        resizableAbsolute,
        resizableHandler
      } = props;
      const ColTag = tag;
      const classes = Utils.classNames(className, {
        col: width === 'auto',
        [`col-${width}`]: width !== 'auto',
        [`xsmall-${xsmall}`]: xsmall,
        [`small-${small}`]: small,
        [`medium-${medium}`]: medium,
        [`large-${large}`]: large,
        [`xlarge-${xlarge}`]: xlarge,
        resizable,
        'resizable-fixed': resizableFixed,
        'resizable-absolute': resizableAbsolute
      }, Mixins.colorClasses(props));
      return _h(ColTag, {
        style: style,
        class: classes,
        ref: 'el',
        attrs: {
          id: id
        }
      }, [this.$slots['default'], resizable && resizableHandler && _h('span', {
        class: 'resize-handler'
      })]);
    },

    created() {
      Utils.bindMethods(this, ['onClick', 'onResize']);
    },

    mounted() {
      const self = this;
      self.eventTargetEl = self.$refs.el;
      self.eventTargetEl.addEventListener('click', self.onClick);
      self.$f7ready(f7 => {
        f7.on('gridResize', self.onResize);
      });
    },

    beforeDestroy() {
      const self = this;
      const el = self.$refs.el;
      if (!el || !self.$f7) return;
      el.removeEventListener('click', self.onClick);
      self.$f7.off('gridResize', self.onResize);
      delete self.eventTargetEl;
    },

    methods: {
      onClick(event) {
        this.dispatchEvent('click', event);
      },

      onResize(el) {
        if (el === this.eventTargetEl) {
          this.dispatchEvent('grid:resize gridResize');
        }
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-fab-button',
    props: Object.assign({
      id: [String, Number],
      fabClose: Boolean,
      label: String,
      target: String,
      tooltip: String,
      tooltipTrigger: String
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        className,
        id,
        style,
        fabClose,
        label,
        target
      } = props;
      const classes = Utils.classNames(className, {
        'fab-close': fabClose,
        'fab-label-button': label
      }, Mixins.colorClasses(props));
      let labelEl;

      if (label) {
        labelEl = _h('span', {
          class: 'fab-label'
        }, [label]);
      }

      return _h('a', {
        ref: 'el',
        style: style,
        class: classes,
        attrs: {
          id: id,
          target: target
        }
      }, [this.$slots['default'], labelEl]);
    },

    created() {
      Utils.bindMethods(this, ['onClick']);
    },

    mounted() {
      const self = this;
      self.$refs.el.addEventListener('click', self.onClick);
      const {
        tooltip,
        tooltipTrigger
      } = self.props;
      if (!tooltip) return;
      self.$f7ready(f7 => {
        self.f7Tooltip = f7.tooltip.create({
          targetEl: self.$refs.el,
          text: tooltip,
          trigger: tooltipTrigger
        });
      });
    },

    beforeDestroy() {
      const self = this;
      self.$refs.el.removeEventListener('click', self.onClick);

      if (self.f7Tooltip && self.f7Tooltip.destroy) {
        self.f7Tooltip.destroy();
        self.f7Tooltip = null;
        delete self.f7Tooltip;
      }
    },

    methods: {
      onClick(event) {
        this.dispatchEvent('click', event);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    watch: {
      'props.tooltip': function watchTooltip(newText) {
        const self = this;

        if (!newText && self.f7Tooltip) {
          self.f7Tooltip.destroy();
          self.f7Tooltip = null;
          delete self.f7Tooltip;
          return;
        }

        if (newText && !self.f7Tooltip && self.$f7) {
          self.f7Tooltip = self.$f7.tooltip.create({
            targetEl: self.$refs.el,
            text: newText,
            trigger: self.props.tooltipTrigger
          });
          return;
        }

        if (!newText || !self.f7Tooltip) return;
        self.f7Tooltip.setText(newText);
      }
    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-fab-buttons',
    props: Object.assign({
      id: [String, Number],
      position: {
        type: String,
        default: 'top'
      }
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        className,
        id,
        style,
        position
      } = props;
      const classes = Utils.classNames(className, 'fab-buttons', `fab-buttons-${position}`, Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-fab',
    props: Object.assign({
      id: [String, Number],
      morphTo: String,
      href: [Boolean, String],
      target: String,
      text: String,
      position: {
        type: String,
        default: 'right-bottom'
      },
      tooltip: String,
      tooltipTrigger: String
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        className,
        id,
        style,
        morphTo,
        href: initialHref,
        position,
        text,
        target
      } = props;
      let href = initialHref;
      if (href === true) href = '#';
      if (href === false) href = undefined;
      const linkChildren = [];
      const rootChildren = [];
      const {
        link: linkSlots,
        default: defaultSlots,
        root: rootSlots,
        text: textSlots
      } = self.$slots;

      if (defaultSlots) {
        for (let i = 0; i < defaultSlots.length; i += 1) {
          const child = defaultSlots[i];
          let isRoot;
          {
            if (child.tag && child.tag.indexOf('fab-buttons') >= 0) isRoot = true;
          }
          if (isRoot) rootChildren.push(child);else linkChildren.push(child);
        }
      }

      let textEl;

      if (text || textSlots && textSlots.length) {
        textEl = _h('div', {
          class: 'fab-text'
        }, [text || textSlots]);
      }

      let linkEl;

      if (linkChildren.length || linkSlots && linkSlots.length || textEl) {
        linkEl = _h('a', {
          ref: 'linkEl',
          attrs: {
            target: target,
            href: href
          }
        }, [linkChildren, textEl, linkSlots]);
      }

      const classes = Utils.classNames(className, 'fab', `fab-${position}`, {
        'fab-morph': morphTo,
        'fab-extended': typeof textEl !== 'undefined'
      }, Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id,
          'data-morph-to': morphTo
        }
      }, [linkEl, rootChildren, rootSlots]);
    },

    watch: {
      'props.tooltip': function watchTooltip(newText) {
        const self = this;

        if (!newText && self.f7Tooltip) {
          self.f7Tooltip.destroy();
          self.f7Tooltip = null;
          delete self.f7Tooltip;
          return;
        }

        if (newText && !self.f7Tooltip && self.$f7) {
          self.f7Tooltip = self.$f7.tooltip.create({
            targetEl: self.$refs.el,
            text: newText,
            trigger: self.props.tooltipTrigger
          });
          return;
        }

        if (!newText || !self.f7Tooltip) return;
        self.f7Tooltip.setText(newText);
      }
    },

    created() {
      Utils.bindMethods(this, ['onClick']);
    },

    mounted() {
      const self = this;

      if (self.$refs.linkEl) {
        self.$refs.linkEl.addEventListener('click', self.onClick);
      }

      const {
        tooltip,
        tooltipTrigger
      } = self.props;
      if (!tooltip) return;
      self.$f7ready(f7 => {
        self.f7Tooltip = f7.tooltip.create({
          targetEl: self.$refs.el,
          text: tooltip,
          trigger: tooltipTrigger
        });
      });
    },

    beforeDestroy() {
      const self = this;

      if (self.$refs.linkEl) {
        self.$refs.linkEl.removeEventListener('click', self.onClick);
      }

      if (self.f7Tooltip && self.f7Tooltip.destroy) {
        self.f7Tooltip.destroy();
        self.f7Tooltip = null;
        delete self.f7Tooltip;
      }
    },

    methods: {
      onClick(event) {
        const self = this;
        self.dispatchEvent('click', event);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  var F7Toggle = {
    name: 'f7-toggle',
    props: Object.assign({
      id: [String, Number],
      init: {
        type: Boolean,
        default: true
      },
      checked: Boolean,
      defaultChecked: Boolean,
      disabled: Boolean,
      readonly: Boolean,
      name: String,
      value: [String, Number, Array]
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        className,
        disabled,
        id,
        style,
        name,
        readonly,
        checked,
        defaultChecked,
        value
      } = props;
      const labelClasses = Utils.classNames('toggle', className, {
        disabled
      }, Mixins.colorClasses(props));
      let inputEl;
      {
        inputEl = _h('input', {
          ref: 'inputEl',
          domProps: {
            disabled,
            readOnly: readonly,
            value,
            checked
          },
          on: {
            change: self.onChange
          },
          attrs: {
            type: 'checkbox',
            name: name
          }
        });
      }
      return _h('label', {
        ref: 'el',
        style: style,
        class: labelClasses,
        attrs: {
          id: id
        }
      }, [inputEl, _h('span', {
        class: 'toggle-icon'
      })]);
    },

    watch: {
      'props.checked': function watchChecked(newValue) {
        const self = this;
        if (!self.f7Toggle) return;
        self.f7Toggle.checked = newValue;
      }
    },

    created() {
      Utils.bindMethods(this, ['onChange']);
    },

    mounted() {
      const self = this;
      if (!self.props.init) return;
      self.$f7ready(f7 => {
        self.f7Toggle = f7.toggle.create({
          el: self.$refs.el,
          on: {
            change(toggle) {
              self.dispatchEvent('toggle:change toggleChange', toggle.checked);
            }

          }
        });
      });
    },

    beforeDestroy() {
      const self = this;
      if (self.f7Toggle && self.f7Toggle.destroy && self.f7Toggle.$el) self.f7Toggle.destroy();
    },

    methods: {
      toggle() {
        const self = this;
        if (self.f7Toggle && self.f7Toggle.toggle) self.f7Toggle.toggle();
      },

      onChange(event) {
        const self = this;
        self.dispatchEvent('change', event);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  };

  var F7Range = {
    name: 'f7-range',
    props: Object.assign({
      id: [String, Number],
      init: {
        type: Boolean,
        default: true
      },
      value: {
        type: [Number, Array, String],
        default: 0
      },
      min: {
        type: [Number, String],
        default: 0
      },
      max: {
        type: [Number, String],
        default: 100
      },
      step: {
        type: [Number, String],
        default: 1
      },
      label: {
        type: Boolean,
        default: false
      },
      dual: {
        type: Boolean,
        default: false
      },
      vertical: {
        type: Boolean,
        default: false
      },
      verticalReversed: {
        type: Boolean,
        default: false
      },
      draggableBar: {
        type: Boolean,
        default: true
      },
      formatLabel: Function,
      scale: {
        type: Boolean,
        default: false
      },
      scaleSteps: {
        type: Number,
        default: 5
      },
      scaleSubSteps: {
        type: Number,
        default: 0
      },
      formatScaleLabel: Function,
      limitKnobPosition: {
        type: Boolean,
        default: undefined
      },
      name: String,
      input: Boolean,
      inputId: String,
      disabled: Boolean
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        id,
        disabled,
        className,
        style,
        input,
        inputId,
        name,
        vertical,
        verticalReversed
      } = self.props;
      const classes = Utils.classNames(className, 'range-slider', {
        'range-slider-horizontal': !vertical,
        'range-slider-vertical': vertical,
        'range-slider-vertical-reversed': vertical && verticalReversed,
        disabled
      }, Mixins.colorClasses(props));
      return _h('div', {
        ref: 'el',
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [input && _h('input', {
        attrs: {
          type: 'range',
          name: name,
          id: inputId
        }
      }), this.$slots['default']]);
    },

    watch: {
      'props.value': function watchValue(newValue) {
        const self = this;
        if (!self.f7Range) return;
        self.f7Range.setValue(newValue);
      }
    },

    mounted() {
      const self = this;
      self.$f7ready(f7 => {
        if (!self.props.init) return;
        const props = self.props;
        const {
          value,
          min,
          max,
          step,
          label,
          dual,
          draggableBar,
          vertical,
          verticalReversed,
          formatLabel,
          scale,
          scaleSteps,
          scaleSubSteps,
          formatScaleLabel,
          limitKnobPosition
        } = props;
        self.f7Range = f7.range.create(Utils.noUndefinedProps({
          el: self.$refs.el,
          value,
          min,
          max,
          step,
          label,
          dual,
          draggableBar,
          vertical,
          verticalReversed,
          formatLabel,
          scale,
          scaleSteps,
          scaleSubSteps,
          formatScaleLabel,
          limitKnobPosition,
          on: {
            change(range, val) {
              self.dispatchEvent('range:change rangeChange', val);
            },

            changed(range, val) {
              self.dispatchEvent('range:changed rangeChanged', val);
            }

          }
        }));
      });
    },

    beforeDestroy() {
      const self = this;
      if (self.f7Range && self.f7Range.destroy) self.f7Range.destroy();
    },

    methods: {
      setValue(newValue) {
        const self = this;
        if (self.f7Range && self.f7Range.setValue) self.f7Range.setValue(newValue);
      },

      getValue() {
        const self = this;

        if (self.f7Range && self.f7Range.getValue) {
          return self.f7Range.getValue();
        }

        return undefined;
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  };

  var F7TextEditor = {
    name: 'f7-text-editor',
    props: Object.assign({
      id: [String, Number]
    }, Mixins.colorProps, {
      mode: {
        type: String,
        default: undefined
      },
      value: {
        type: String,
        default: undefined
      },
      buttons: Array,
      customButtons: Object,
      dividers: {
        type: Boolean,
        default: undefined
      },
      imageUrlText: {
        type: String,
        default: undefined
      },
      linkUrlText: {
        type: String,
        default: undefined
      },
      placeholder: {
        type: String,
        default: undefined
      },
      clearFormattingOnPaste: {
        type: Boolean,
        default: undefined
      },
      resizable: {
        type: Boolean,
        default: false
      }
    }),

    created() {
      Utils.bindMethods(this, 'onChange onInput onFocus onBlur onButtonClick onKeyboardOpen onKeyboardClose onPopoverOpen onPopoverClose'.split(' '));
    },

    mounted() {
      const props = this.props;
      const {
        mode,
        value,
        buttons,
        customButtons,
        dividers,
        imageUrlText,
        linkUrlText,
        placeholder,
        clearFormattingOnPaste
      } = props;
      const params = Utils.noUndefinedProps({
        el: this.$refs.el,
        mode,
        value,
        buttons,
        customButtons,
        dividers,
        imageUrlText,
        linkUrlText,
        placeholder,
        clearFormattingOnPaste,
        on: {
          change: this.onChange,
          input: this.onInput,
          focus: this.onFocus,
          blur: this.onBlur,
          buttonClick: this.onButtonClick,
          keyboardOpen: this.onKeyboardOpen,
          keyboardClose: this.onKeyboardClose,
          popoverOpen: this.onPopoverOpen,
          popoverClose: this.onPopoverClose
        }
      });
      this.$f7ready(f7 => {
        this.f7TextEditor = f7.textEditor.create(params);
      });
    },

    beforeDestroy() {
      if (this.f7TextEditor && this.f7TextEditor.destroy) {
        this.f7TextEditor.destroy();
      }
    },

    watch: {
      'props.value': function watchValue() {
        if (this.f7TextEditor) {
          this.f7TextEditor.setValue(this.props.value);
        }
      }
    },

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        className,
        id,
        style,
        resizable
      } = props;
      const classes = Utils.classNames(className, 'text-editor', resizable && 'text-editor-resizable', Mixins.colorClasses(props));
      return _h('div', {
        ref: 'el',
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['root-start'], _h('div', {
        class: 'text-editor-content',
        attrs: {
          contenteditable: true
        }
      }, [this.$slots['default']]), this.$slots['root-end'], this.$slots['root']]);
    },

    methods: {
      onChange(editor, value) {
        this.dispatchEvent('texteditor:change textEditorChange', value);
      },

      onInput() {
        this.dispatchEvent('texteditor:change textEditorChange');
      },

      onFocus() {
        this.dispatchEvent('texteditor:focus textEditorFocus');
      },

      onBlur() {
        this.dispatchEvent('texteditor:blur textEditorBlur');
      },

      onButtonClick(editor, button) {
        this.dispatchEvent('texteditor:buttonclick textEditorButtonClick', button);
      },

      onKeyboardOpen() {
        this.dispatchEvent('texteditor:keyboardopen textEditorKeyboardOpen');
      },

      onKeyboardClose() {
        this.dispatchEvent('texteditor:keyboardclose textEditorKeyboardClose');
      },

      onPopoverOpen() {
        this.dispatchEvent('texteditor:popoveropen textEditorPopoverOpen');
      },

      onPopoverClose() {
        this.dispatchEvent('texteditor:popoverclose textEditorPopoverClose');
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  };

  var F7Input = {
    name: 'f7-input',
    props: Object.assign({
      type: String,
      name: String,
      value: [String, Number, Array, Date, Object],
      defaultValue: [String, Number, Array],
      inputmode: String,
      placeholder: String,
      id: [String, Number],
      inputId: [String, Number],
      size: [String, Number],
      accept: [String, Number],
      autocomplete: [String],
      autocorrect: [String],
      autocapitalize: [String],
      spellcheck: [String],
      autofocus: Boolean,
      autosave: String,
      checked: Boolean,
      disabled: Boolean,
      max: [String, Number],
      min: [String, Number],
      step: [String, Number],
      maxlength: [String, Number],
      minlength: [String, Number],
      multiple: Boolean,
      readonly: Boolean,
      required: Boolean,
      inputStyle: [String, Object],
      pattern: String,
      validate: [Boolean, String],
      validateOnBlur: Boolean,
      onValidate: Function,
      tabindex: [String, Number],
      resizable: Boolean,
      clearButton: Boolean,
      noFormStoreData: Boolean,
      noStoreData: Boolean,
      ignoreStoreData: Boolean,
      errorMessage: String,
      errorMessageForce: Boolean,
      info: String,
      outline: Boolean,
      wrap: {
        type: Boolean,
        default: true
      },
      dropdown: {
        type: [String, Boolean],
        default: 'auto'
      },
      calendarParams: Object,
      colorPickerParams: Object,
      textEditorParams: Object
    }, Mixins.colorProps),

    data() {
      const props = __vueComponentProps(this);

      const state = (() => {
        return {
          inputFocused: false,
          inputInvalid: false
        };
      })();

      return {
        state
      };
    },

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        type,
        name,
        value,
        defaultValue,
        inputmode,
        placeholder,
        id,
        inputId,
        size,
        accept,
        autocomplete,
        autocorrect,
        autocapitalize,
        spellcheck,
        autofocus,
        autosave,
        checked,
        disabled,
        max,
        min,
        step,
        maxlength,
        minlength,
        multiple,
        readonly,
        required,
        inputStyle,
        pattern,
        validate,
        validateOnBlur,
        tabindex,
        resizable,
        clearButton,
        errorMessage,
        errorMessageForce,
        info,
        wrap,
        dropdown,
        style,
        className,
        noStoreData,
        noFormStoreData,
        ignoreStoreData,
        outline,
        textEditorParams
      } = props;
      const domValue = self.domValue();
      const inputHasValue = self.inputHasValue();
      let inputEl;

      const createInput = (InputTag, children) => {
        const needsValue = type !== 'file' && type !== 'datepicker' && type !== 'colorpicker';
        const needsType = InputTag === 'input';
        let inputType = type;

        if (inputType === 'datepicker' || inputType === 'colorpicker') {
          inputType = 'text';
        }

        const inputClassName = Utils.classNames(!wrap && className, {
          resizable: inputType === 'textarea' && resizable,
          'no-store-data': noFormStoreData || noStoreData || ignoreStoreData,
          'input-invalid': errorMessage && errorMessageForce || self.state.inputInvalid,
          'input-with-value': inputHasValue,
          'input-focused': self.state.inputFocused
        });
        let input;
        let inputValue;

        if (needsValue) {
          if (typeof value !== 'undefined') inputValue = value;else inputValue = domValue;
        }

        const valueProps = {};

        if (type !== 'datepicker' && type !== 'colorpicker') {
          if ('value' in props) valueProps.value = inputValue;
          if ('defaultValue' in props) valueProps.defaultValue = defaultValue;
        }

        {
          input = _h(InputTag, {
            ref: 'inputEl',
            style: inputStyle,
            class: inputClassName,
            domProps: Object.assign({
              checked,
              disabled,
              readOnly: readonly,
              multiple,
              required
            }, valueProps),
            on: {
              focus: self.onFocus,
              blur: self.onBlur,
              input: self.onInput,
              change: self.onChange
            },
            attrs: {
              name: name,
              type: needsType ? inputType : undefined,
              placeholder: placeholder,
              inputmode: inputmode,
              id: inputId,
              size: size,
              accept: accept,
              autocomplete: autocomplete,
              autocorrect: autocorrect,
              autocapitalize: autocapitalize,
              spellcheck: spellcheck,
              autofocus: autofocus,
              autoSave: autosave,
              max: max,
              maxlength: maxlength,
              min: min,
              minlength: minlength,
              step: step,
              pattern: pattern,
              validate: typeof validate === 'string' && validate.length ? validate : undefined,
              'data-validate': validate === true || validate === '' || validateOnBlur === true || validateOnBlur === '' ? true : undefined,
              'data-validate-on-blur': validateOnBlur === true || validateOnBlur === '' ? true : undefined,
              tabindex: tabindex,
              'data-error-message': errorMessageForce ? undefined : errorMessage
            }
          }, [children]);
        }
        return input;
      };

      const {
        default: slotsDefault,
        info: slotsInfo
      } = self.$slots;

      if (type === 'select' || type === 'textarea' || type === 'file') {
        if (type === 'select') {
          inputEl = createInput('select', slotsDefault);
        } else if (type === 'file') {
          inputEl = createInput('input');
        } else {
          inputEl = createInput('textarea');
        }
      } else if (slotsDefault && slotsDefault.length > 0 || !type) {
        inputEl = slotsDefault;
      } else if (type === 'toggle') {
        inputEl = _h(F7Toggle, {
          on: {
            change: self.onChange
          },
          attrs: {
            checked: checked,
            readonly: readonly,
            name: name,
            value: value,
            disabled: disabled,
            id: inputId
          }
        });
      } else if (type === 'range') {
        inputEl = _h(F7Range, {
          on: {
            rangeChange: self.onChange
          },
          attrs: {
            value: value,
            disabled: disabled,
            min: min,
            max: max,
            step: step,
            name: name,
            id: inputId,
            input: true
          }
        });
      } else if (type === 'texteditor') {
        inputEl = _h(F7TextEditor, __vueComponentTransformJSXProps(Object.assign({}, textEditorParams, {
          on: {
            textEditorFocus: self.onFocus,
            textEditorBlur: self.onBlur,
            textEditorInput: self.onInput,
            textEditorChange: self.onChange
          },
          attrs: {
            value: value,
            resizable: resizable,
            placeholder: placeholder
          }
        })));
      } else {
        inputEl = createInput('input');
      }

      if (wrap) {
        const wrapClasses = Utils.classNames(className, 'input', {
          'input-outline': outline,
          'input-dropdown': dropdown === 'auto' ? type === 'select' : dropdown
        }, Mixins.colorClasses(props));
        return _h('div', {
          class: wrapClasses,
          style: style,
          attrs: {
            id: id
          }
        }, [inputEl, errorMessage && errorMessageForce && _h('div', {
          class: 'input-error-message'
        }, [errorMessage]), clearButton && _h('span', {
          class: 'input-clear-button'
        }), (info || slotsInfo && slotsInfo.length) && _h('div', {
          class: 'input-info'
        }, [info, this.$slots['info']])]);
      }

      return inputEl;
    },

    watch: {
      'props.colorPickerParams': function watchValue() {
        const self = this;
        if (!self.$f7 || !self.f7ColorPicker) return;
        Utils.extend(self.f7ColorPicker.params, self.colorPickerParams || {});
      },
      'props.calendarParams': function watchValue() {
        const self = this;
        if (!self.$f7 || !self.f7Calendar) return;
        Utils.extend(self.f7Calendar.params, self.calendarParams || {});
      },
      'props.value': function watchValue() {
        const self = this;
        const {
          type
        } = self.props;
        if (type === 'range' || type === 'toggle') return;
        if (!self.$f7) return;
        self.updateInputOnDidUpdate = true;

        if (self.f7Calendar) {
          self.f7Calendar.setValue(self.props.value);
        }

        if (self.f7ColorPicker) {
          self.f7ColorPicker.setValue(self.props.value);
        }
      }
    },

    created() {
      Utils.bindMethods(this, 'onFocus onBlur onInput onChange onTextareaResize onInputNotEmpty onInputEmpty onInputClear'.split(' '));
    },

    mounted() {
      const self = this;
      self.$f7ready(f7 => {
        const {
          validate,
          validateOnBlur,
          resizable,
          type,
          clearButton,
          value,
          defaultValue,
          calendarParams,
          colorPickerParams
        } = self.props;
        if (type === 'range' || type === 'toggle') return;
        const inputEl = self.$refs.inputEl;
        if (!inputEl) return;
        inputEl.addEventListener('input:notempty', self.onInputNotEmpty, false);

        if (type === 'textarea' && resizable) {
          inputEl.addEventListener('textarea:resize', self.onTextareaResize, false);
        }

        if (clearButton) {
          inputEl.addEventListener('input:empty', self.onInputEmpty, false);
          inputEl.addEventListener('input:clear', self.onInputClear, false);
        }

        if (type === 'datepicker') {
          self.f7Calendar = f7.calendar.create(Object.assign({
            inputEl,
            value,
            on: {
              change(calendar, calendarValue) {
                self.dispatchEvent('calendar:change calendarChange', calendarValue);
              }

            }
          }, calendarParams || {}));
        }

        if (type === 'colorpicker') {
          self.f7ColorPicker = f7.colorPicker.create(Object.assign({
            inputEl,
            value,
            on: {
              change(colorPicker, colorPickerValue) {
                self.dispatchEvent('colorpicker:change colorPickerChange', colorPickerValue);
              }

            }
          }, colorPickerParams || {}));
        }

        f7.input.checkEmptyState(inputEl);

        if (!(validateOnBlur || validateOnBlur === '') && (validate || validate === '') && (typeof value !== 'undefined' && value !== null && value !== '' || typeof defaultValue !== 'undefined' && defaultValue !== null && defaultValue !== '')) {
          setTimeout(() => {
            self.validateInput(inputEl);
          }, 0);
        }

        if (resizable) {
          f7.input.resizeTextarea(inputEl);
        }
      });
    },

    updated() {
      const self = this;
      const {
        validate,
        validateOnBlur,
        resizable
      } = self.props;
      const f7 = self.$f7;
      if (!f7) return;

      if (self.updateInputOnDidUpdate) {
        const inputEl = self.$refs.inputEl;
        if (!inputEl) return;
        self.updateInputOnDidUpdate = false;
        f7.input.checkEmptyState(inputEl);

        if (validate && !validateOnBlur) {
          self.validateInput(inputEl);
        }

        if (resizable) {
          f7.input.resizeTextarea(inputEl);
        }
      }
    },

    beforeDestroy() {
      const self = this;
      const {
        type,
        resizable,
        clearButton
      } = self.props;
      if (type === 'range' || type === 'toggle') return;
      const inputEl = self.$refs.inputEl;
      if (!inputEl) return;
      inputEl.removeEventListener('input:notempty', self.onInputNotEmpty, false);

      if (type === 'textarea' && resizable) {
        inputEl.removeEventListener('textarea:resize', self.onTextareaResize, false);
      }

      if (clearButton) {
        inputEl.removeEventListener('input:empty', self.onInputEmpty, false);
        inputEl.removeEventListener('input:clear', self.onInputClear, false);
      }

      if (self.f7Calendar && self.f7Calendar.destroy) {
        self.f7Calendar.destroy();
      }

      if (self.f7ColorPicker && self.f7ColorPicker.destroy) {
        self.f7ColorPicker.destroy();
      }

      delete self.f7Calendar;
      delete self.f7ColorPicker;
    },

    methods: {
      domValue() {
        const self = this;
        const {
          inputEl
        } = self.$refs;
        if (!inputEl) return undefined;
        return inputEl.value;
      },

      inputHasValue() {
        const self = this;
        const {
          value,
          type
        } = self.props;

        if (type === 'datepicker' && Array.isArray(value) && value.length === 0) {
          return false;
        }

        const domValue = self.domValue();
        return typeof value === 'undefined' ? domValue || domValue === 0 : value || value === 0;
      },

      validateInput(inputEl) {
        const self = this;
        const f7 = self.$f7;
        if (!f7 || !inputEl) return;
        const validity = inputEl.validity;
        if (!validity) return;
        const {
          onValidate
        } = self.props;

        if (!validity.valid) {
          if (onValidate) onValidate(false);

          if (self.state.inputInvalid !== true) {
            self.setState({
              inputInvalid: true
            });
          }
        } else if (self.state.inputInvalid !== false) {
          if (onValidate) onValidate(true);
          self.setState({
            inputInvalid: false
          });
        }
      },

      onTextareaResize(event) {
        this.dispatchEvent('textarea:resize textareaResize', event);
      },

      onInputNotEmpty(event) {
        this.dispatchEvent('input:notempty inputNotEmpty', event);
      },

      onInputEmpty(event) {
        this.dispatchEvent('input:empty inputEmpty', event);
      },

      onInputClear(event) {
        this.dispatchEvent('input:clear inputClear', event);
      },

      onInput(...args) {
        const self = this;
        const {
          validate,
          validateOnBlur
        } = self.props;
        self.dispatchEvent('input', ...args);

        if (!(validateOnBlur || validateOnBlur === '') && (validate || validate === '') && self.$refs && self.$refs.inputEl) {
          self.validateInput(self.$refs.inputEl);
        }
      },

      onFocus(...args) {
        this.dispatchEvent('focus', ...args);
        this.setState({
          inputFocused: true
        });
      },

      onBlur(...args) {
        const self = this;
        const {
          validate,
          validateOnBlur
        } = self.props;
        self.dispatchEvent('blur', ...args);

        if ((validate || validate === '' || validateOnBlur || validateOnBlur === '') && self.$refs && self.$refs.inputEl) {
          self.validateInput(self.$refs.inputEl);
        }

        self.setState({
          inputFocused: false
        });
      },

      onChange(...args) {
        this.dispatchEvent('change', ...args);

        if (this.props.type === 'texteditor') {
          this.dispatchEvent('texteditor:change textEditorChange', args[1]);
        }
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      },

      setState(updater, callback) {
        __vueComponentSetState(this, updater, callback);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  };

  var F7Link = {
    name: 'f7-link',
    props: Object.assign({
      id: [String, Number],
      noLinkClass: Boolean,
      text: String,
      tabLink: [Boolean, String],
      tabLinkActive: Boolean,
      tabbarLabel: Boolean,
      iconOnly: Boolean,
      badge: [String, Number],
      badgeColor: [String],
      iconBadge: [String, Number],
      href: {
        type: [String, Boolean],
        default: '#'
      },
      target: String,
      tooltip: String,
      tooltipTrigger: String,
      smartSelect: Boolean,
      smartSelectParams: Object
    }, Mixins.colorProps, {}, Mixins.linkIconProps, {}, Mixins.linkRouterProps, {}, Mixins.linkActionsProps),

    data() {
      const props = __vueComponentProps(this);

      const state = (() => {
        return {
          isTabbarLabel: props.tabbarLabel
        };
      })();

      return {
        state
      };
    },

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        text,
        badge,
        badgeColor,
        iconOnly,
        iconBadge,
        icon,
        iconColor,
        iconSize,
        iconMaterial,
        iconF7,
        iconMd,
        iconIos,
        iconAurora,
        id,
        style
      } = props;
      const defaultSlots = self.$slots.default || [];
      Object.keys(self.$slots).forEach(key => {
        if (typeof self.$slots[key] === 'undefined' || key === 'default') return;
        self.$slots[key].forEach(child => defaultSlots.push(child));
      });
      let iconEl;
      let textEl;
      let badgeEl;
      let iconBadgeEl;

      if (text) {
        if (badge) badgeEl = _h(F7Badge, {
          attrs: {
            color: badgeColor
          }
        }, [badge]);
        textEl = _h('span', {
          class: self.state.isTabbarLabel ? 'tabbar-label' : ''
        }, [text, badgeEl]);
      }

      if (icon || iconMaterial || iconF7 || iconMd || iconIos || iconAurora) {
        if (iconBadge) {
          iconBadgeEl = _h(F7Badge, {
            attrs: {
              color: badgeColor
            }
          }, [iconBadge]);
        }

        iconEl = _h(F7Icon, {
          attrs: {
            material: iconMaterial,
            f7: iconF7,
            icon: icon,
            md: iconMd,
            ios: iconIos,
            aurora: iconAurora,
            color: iconColor,
            size: iconSize
          }
        }, [iconBadgeEl]);
      }

      if (iconOnly || !text && defaultSlots && defaultSlots.length === 0 || !text && !defaultSlots) {
        self.iconOnlyComputed = true;
      } else {
        self.iconOnlyComputed = false;
      }

      return _h('a', __vueComponentTransformJSXProps(Object.assign({
        ref: 'el',
        style: style,
        class: self.classes
      }, self.attrs, {
        attrs: {
          id: id
        }
      })), [iconEl, textEl, defaultSlots]);
    },

    watch: {
      'props.tooltip': function watchTooltip(newText) {
        const self = this;

        if (!newText && self.f7Tooltip) {
          self.f7Tooltip.destroy();
          self.f7Tooltip = null;
          delete self.f7Tooltip;
          return;
        }

        if (newText && !self.f7Tooltip && self.$f7) {
          self.f7Tooltip = self.$f7.tooltip.create({
            targetEl: self.$refs.el,
            text: newText,
            trigger: self.props.tooltipTrigger
          });
          return;
        }

        if (!newText || !self.f7Tooltip) return;
        self.f7Tooltip.setText(newText);
      }
    },

    created() {
      Utils.bindMethods(this, ['onClick']);
    },

    mounted() {
      const self = this;
      const el = self.$refs.el;
      el.addEventListener('click', self.onClick);
      const {
        tabbarLabel,
        tabLink,
        tooltip,
        tooltipTrigger,
        smartSelect,
        smartSelectParams,
        routeProps
      } = self.props;
      let isTabbarLabel = false;

      if (tabbarLabel || (tabLink || tabLink === '') && self.$$(el).parents('.tabbar-labels').length) {
        isTabbarLabel = true;
      }

      self.setState({
        isTabbarLabel
      });
      if (routeProps) el.f7RouteProps = routeProps;
      self.$f7ready(f7 => {
        if (smartSelect) {
          const ssParams = Utils.extend({
            el
          }, smartSelectParams || {});
          self.f7SmartSelect = f7.smartSelect.create(ssParams);
        }

        if (tooltip) {
          self.f7Tooltip = f7.tooltip.create({
            targetEl: el,
            text: tooltip,
            trigger: tooltipTrigger
          });
        }
      });
    },

    updated() {
      const self = this;
      const el = self.$refs.el;
      const {
        routeProps
      } = self.props;

      if (routeProps) {
        el.f7RouteProps = routeProps;
      }
    },

    beforeDestroy() {
      const self = this;
      const el = self.$refs.el;
      el.removeEventListener('click', self.onClick);
      delete el.f7RouteProps;

      if (self.f7SmartSelect && self.f7SmartSelect.destroy) {
        self.f7SmartSelect.destroy();
      }

      if (self.f7Tooltip && self.f7Tooltip.destroy) {
        self.f7Tooltip.destroy();
        self.f7Tooltip = null;
        delete self.f7Tooltip;
      }
    },

    computed: {
      attrs() {
        const self = this;
        const props = self.props;
        const {
          href,
          target,
          tabLink
        } = props;
        let hrefComputed = href;
        if (href === true) hrefComputed = '#';
        if (href === false) hrefComputed = undefined;
        return Utils.extend({
          href: hrefComputed,
          target,
          'data-tab': Utils.isStringProp(tabLink) && tabLink || undefined
        }, Mixins.linkRouterAttrs(props), Mixins.linkActionsAttrs(props));
      },

      classes() {
        const self = this;
        const props = self.props;
        const {
          tabLink,
          tabLinkActive,
          noLinkClass,
          smartSelect,
          className
        } = props;
        return Utils.classNames(className, {
          link: !(noLinkClass || self.state.isTabbarLabel),
          'icon-only': self.iconOnlyComputed,
          'tab-link': tabLink || tabLink === '',
          'tab-link-active': tabLinkActive,
          'smart-select': smartSelect
        }, Mixins.colorClasses(props), Mixins.linkRouterClasses(props), Mixins.linkActionsClasses(props));
      },

      props() {
        return __vueComponentProps(this);
      }

    },
    methods: {
      onClick(event) {
        this.dispatchEvent('click', event);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      },

      setState(updater, callback) {
        __vueComponentSetState(this, updater, callback);
      }

    }
  };

  ({
    name: 'f7-list-button',
    props: Object.assign({
      id: [String, Number],
      title: [String, Number],
      text: [String, Number],
      tabLink: [Boolean, String],
      tabLinkActive: Boolean,
      link: [Boolean, String],
      href: [Boolean, String],
      target: String,
      tooltip: String,
      tooltipTrigger: String
    }, Mixins.colorProps, {}, Mixins.linkRouterProps, {}, Mixins.linkActionsProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = this.props;
      const {
        className,
        id,
        style,
        title,
        text
      } = props;
      return _h('li', {
        style: style,
        class: className,
        attrs: {
          id: id
        }
      }, [_h('a', __vueComponentTransformJSXProps(Object.assign({
        class: self.classes
      }, self.attrs, {
        ref: 'linkEl'
      })), [this.$slots['default'] || [title || text]])]);
    },

    computed: {
      attrs() {
        const self = this;
        const props = self.props;
        const {
          link,
          href,
          target,
          tabLink
        } = props;
        return Utils.extend({
          href: typeof link === 'boolean' && typeof href === 'boolean' ? '#' : link || href,
          target,
          'data-tab': Utils.isStringProp(tabLink) && tabLink
        }, Mixins.linkRouterAttrs(props), Mixins.linkActionsAttrs(props));
      },

      classes() {
        const self = this;
        const props = self.props;
        const {
          tabLink,
          tabLinkActive
        } = props;
        return Utils.classNames({
          'list-button': true,
          'tab-link': tabLink || tabLink === '',
          'tab-link-active': tabLinkActive
        }, Mixins.colorClasses(props), Mixins.linkRouterClasses(props), Mixins.linkActionsClasses(props));
      },

      props() {
        return __vueComponentProps(this);
      }

    },
    watch: {
      'props.tooltip': function watchTooltip(newText) {
        const self = this;

        if (!newText && self.f7Tooltip) {
          self.f7Tooltip.destroy();
          self.f7Tooltip = null;
          delete self.f7Tooltip;
          return;
        }

        if (newText && !self.f7Tooltip && self.$f7) {
          self.f7Tooltip = self.$f7.tooltip.create({
            targetEl: self.$refs.el,
            text: newText,
            trigger: self.props.tooltipTrigger
          });
          return;
        }

        if (!newText || !self.f7Tooltip) return;
        self.f7Tooltip.setText(newText);
      }
    },

    created() {
      Utils.bindMethods(this, ['onClick']);
    },

    mounted() {
      const self = this;
      const linkEl = self.$refs.linkEl;
      const {
        routeProps,
        tooltip,
        tooltipTrigger
      } = self.props;

      if (routeProps) {
        linkEl.f7RouteProps = routeProps;
      }

      linkEl.addEventListener('click', self.onClick);
      self.$f7ready(f7 => {
        if (tooltip) {
          self.f7Tooltip = f7.tooltip.create({
            targetEl: linkEl,
            text: tooltip,
            trigger: tooltipTrigger
          });
        }
      });
    },

    updated() {
      const self = this;
      const linkEl = self.$refs.linkEl;
      const {
        routeProps
      } = self.props;

      if (routeProps) {
        linkEl.f7RouteProps = routeProps;
      }
    },

    beforeDestroy() {
      const self = this;
      const linkEl = self.$refs.linkEl;
      linkEl.removeEventListener('click', this.onClick);
      delete linkEl.f7RouteProps;

      if (self.f7Tooltip && self.f7Tooltip.destroy) {
        self.f7Tooltip.destroy();
        self.f7Tooltip = null;
        delete self.f7Tooltip;
      }
    },

    methods: {
      onClick(event) {
        this.dispatchEvent('click', event);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    }
  });

  ({
    name: 'f7-list-group',
    props: Object.assign({
      id: [String, Number],
      mediaList: Boolean,
      sortable: Boolean,
      sortableOpposite: Boolean,
      sortableTapHold: Boolean,
      sortableMoveElements: {
        type: Boolean,
        default: undefined
      }
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        className,
        id,
        style,
        mediaList,
        sortable,
        sortableOpposite,
        sortableTapHold,
        sortableMoveElements
      } = props;
      const classes = Utils.classNames(className, 'list-group', {
        'media-list': mediaList,
        sortable,
        'sortable-tap-hold': sortableTapHold,
        'sortable-opposite': sortableOpposite
      }, Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id,
          'data-sortable-move-elements': typeof sortableMoveElements !== 'undefined' ? sortableMoveElements.toString() : undefined
        }
      }, [_h('ul', [this.$slots['default']])]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-list-index',
    props: Object.assign({
      id: [String, Number],
      init: {
        type: Boolean,
        default: true
      },
      listEl: [String, Object],
      indexes: {
        type: [String, Array],
        default: 'auto'
      },
      scrollList: {
        type: Boolean,
        default: true
      },
      label: {
        type: Boolean,
        default: false
      },
      iosItemHeight: {
        type: Number,
        default: 14
      },
      mdItemHeight: {
        type: Number,
        default: 14
      },
      auroraItemHeight: {
        type: Number,
        default: 14
      }
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        className,
        id,
        style
      } = props;
      const classes = Utils.classNames(className, 'list-index', Mixins.colorClasses(props));
      return _h('div', {
        ref: 'el',
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    beforeDestroy() {
      if (!this.props.init) return;

      if (this.f7ListIndex && this.f7ListIndex.destroy) {
        this.f7ListIndex.destroy();
      }
    },

    mounted() {
      const self = this;
      if (!self.props.init) return;
      self.$f7ready(f7 => {
        const el = self.$refs.el;
        const {
          listEl,
          indexes,
          iosItemHeight,
          mdItemHeight,
          auroraItemHeight,
          scrollList,
          label
        } = self.props;
        self.f7ListIndex = f7.listIndex.create({
          el,
          listEl,
          indexes,
          iosItemHeight,
          mdItemHeight,
          auroraItemHeight,
          scrollList,
          label,
          on: {
            select(index, itemContent, itemIndex) {
              self.dispatchEvent('listindex:select listIndexSelect', itemContent, itemIndex);
            }

          }
        });
      });
    },

    watch: {
      'props.indexes': function watchIndexes() {
        if (!this.f7ListIndex) return;
        this.f7ListIndex.params.indexes = this.props.indexes;
        this.update();
      }
    },
    methods: {
      update() {
        if (!this.f7ListIndex) return;
        this.f7ListIndex.update();
      },

      scrollListToIndex(indexContent) {
        if (!this.f7ListIndex) return;
        this.f7ListIndex.scrollListToIndex(indexContent);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-list-input',
    props: Object.assign({
      id: [String, Number],
      sortable: {
        type: Boolean,
        default: undefined
      },
      media: String,
      dropdown: {
        type: [String, Boolean],
        default: 'auto'
      },
      wrap: {
        type: Boolean,
        default: true
      },
      input: {
        type: Boolean,
        default: true
      },
      type: {
        type: String,
        default: 'text'
      },
      name: String,
      value: [String, Number, Array, Date, Object],
      defaultValue: [String, Number, Array],
      inputmode: String,
      readonly: Boolean,
      required: Boolean,
      disabled: Boolean,
      placeholder: String,
      inputId: [String, Number],
      size: [String, Number],
      accept: [String, Number],
      autocomplete: [String],
      autocorrect: [String],
      autocapitalize: [String],
      spellcheck: [String],
      autofocus: Boolean,
      autosave: String,
      max: [String, Number],
      min: [String, Number],
      step: [String, Number],
      maxlength: [String, Number],
      minlength: [String, Number],
      multiple: Boolean,
      inputStyle: [String, Object],
      pattern: String,
      validate: [Boolean, String],
      validateOnBlur: Boolean,
      onValidate: Function,
      tabindex: [String, Number],
      resizable: Boolean,
      clearButton: Boolean,
      noFormStoreData: Boolean,
      noStoreData: Boolean,
      ignoreStoreData: Boolean,
      errorMessage: String,
      errorMessageForce: Boolean,
      info: String,
      outline: Boolean,
      label: [String, Number],
      inlineLabel: Boolean,
      floatingLabel: Boolean,
      calendarParams: Object,
      colorPickerParams: Object,
      textEditorParams: Object
    }, Mixins.colorProps),

    data() {
      const props = __vueComponentProps(this);

      const state = (() => {
        return {
          isSortable: props.sortable,
          inputFocused: false,
          inputInvalid: false
        };
      })();

      return {
        state
      };
    },

    render() {
      const _h = this.$createElement;
      const self = this;
      const {
        inputFocused,
        inputInvalid
      } = self.state;
      const props = self.props;
      const {
        id,
        style,
        className,
        sortable,
        media,
        dropdown,
        input: renderInput,
        wrap,
        type,
        name,
        value,
        defaultValue,
        readonly,
        required,
        disabled,
        inputmode,
        placeholder,
        inputId,
        size,
        accept,
        autocomplete,
        autocorrect,
        autocapitalize,
        spellcheck,
        autofocus,
        autosave,
        max,
        min,
        step,
        maxlength,
        minlength,
        multiple,
        inputStyle,
        pattern,
        validate,
        validateOnBlur,
        tabindex,
        resizable,
        clearButton,
        noFormStoreData,
        noStoreData,
        ignoreStoreData,
        errorMessage,
        errorMessageForce,
        info,
        outline,
        label,
        inlineLabel,
        floatingLabel,
        textEditorParams
      } = props;
      const domValue = self.domValue();
      const inputHasValue = self.inputHasValue();
      const isSortable = sortable || self.state.isSortable;

      const createInput = (InputTag, children) => {
        const needsValue = type !== 'file' && type !== 'datepicker' && type !== 'colorpicker';
        const needsType = InputTag === 'input';
        let inputType = type;

        if (inputType === 'datepicker' || inputType === 'colorpicker') {
          inputType = 'text';
        }

        const inputClassName = Utils.classNames({
          resizable: inputType === 'textarea' && resizable,
          'no-store-data': noFormStoreData || noStoreData || ignoreStoreData,
          'input-invalid': errorMessage && errorMessageForce || inputInvalid,
          'input-with-value': inputHasValue,
          'input-focused': inputFocused
        });
        let input;
        let inputValue;

        if (needsValue) {
          if (typeof value !== 'undefined') inputValue = value;else inputValue = domValue;
        }

        const valueProps = {};

        if (type !== 'datepicker' && type !== 'colorpicker') {
          if ('value' in props) valueProps.value = inputValue;
          if ('defaultValue' in props) valueProps.defaultValue = defaultValue;
        }

        {
          input = _h(InputTag, {
            ref: 'inputEl',
            style: inputStyle,
            class: inputClassName,
            domProps: Object.assign({
              disabled,
              readOnly: readonly,
              multiple,
              required
            }, valueProps),
            on: {
              focus: self.onFocus,
              blur: self.onBlur,
              input: self.onInput,
              change: self.onChange
            },
            attrs: {
              name: name,
              type: needsType ? inputType : undefined,
              placeholder: placeholder,
              inputmode: inputmode,
              id: inputId,
              size: size,
              accept: accept,
              autocomplete: autocomplete,
              autocorrect: autocorrect,
              autocapitalize: autocapitalize,
              spellcheck: spellcheck,
              autofocus: autofocus,
              autoSave: autosave,
              max: max,
              maxlength: maxlength,
              min: min,
              minlength: minlength,
              step: step,
              pattern: pattern,
              validate: typeof validate === 'string' && validate.length ? validate : undefined,
              'data-validate': validate === true || validate === '' || validateOnBlur === true || validateOnBlur === '' ? true : undefined,
              'data-validate-on-blur': validateOnBlur === true || validateOnBlur === '' ? true : undefined,
              tabindex: tabindex,
              'data-error-message': errorMessageForce ? undefined : errorMessage
            }
          }, [children]);
        }
        return input;
      };

      let inputEl;

      if (renderInput) {
        if (type === 'select' || type === 'textarea' || type === 'file') {
          if (type === 'select') {
            inputEl = createInput('select', self.$slots.default);
          } else if (type === 'file') {
            inputEl = createInput('input');
          } else {
            inputEl = createInput('textarea');
          }
        } else if (type === 'texteditor') {
          inputEl = _h(F7TextEditor, __vueComponentTransformJSXProps(Object.assign({}, textEditorParams, {
            on: {
              textEditorFocus: self.onFocus,
              textEditorBlur: self.onBlur,
              textEditorInput: self.onInput,
              textEditorChange: self.onChange
            },
            attrs: {
              value: value,
              resizable: resizable,
              placeholder: placeholder
            }
          })));
        } else {
          inputEl = createInput('input');
        }
      }

      const hasErrorMessage = !!errorMessage || self.$slots['error-message'] && self.$slots['error-message'].length;

      const ItemContent = _h('div', {
        ref: 'itemContentEl',
        class: Utils.classNames('item-content item-input', !wrap && className, !wrap && {
          disabled
        }, !wrap && Mixins.colorClasses(props), {
          'inline-label': inlineLabel,
          'item-input-outline': outline,
          'item-input-focused': inputFocused,
          'item-input-with-info': !!info || self.$slots.info && self.$slots.info.length,
          'item-input-with-value': inputHasValue,
          'item-input-with-error-message': hasErrorMessage && errorMessageForce || inputInvalid,
          'item-input-invalid': hasErrorMessage && errorMessageForce || inputInvalid
        })
      }, [this.$slots['content-start'], (media || self.$slots.media) && _h('div', {
        class: 'item-media'
      }, [media && _h('img', {
        attrs: {
          src: media
        }
      }), this.$slots['media']]), _h('div', {
        class: 'item-inner'
      }, [this.$slots['inner-start'], (label || self.$slots.label) && _h('div', {
        class: Utils.classNames('item-title item-label', {
          'item-floating-label': floatingLabel
        })
      }, [label, this.$slots['label']]), _h('div', {
        class: Utils.classNames('item-input-wrap', {
          'input-dropdown': dropdown === 'auto' ? type === 'select' : dropdown
        })
      }, [inputEl, this.$slots['input'], hasErrorMessage && errorMessageForce && _h('div', {
        class: 'item-input-error-message'
      }, [errorMessage, this.$slots['error-message']]), clearButton && _h('span', {
        class: 'input-clear-button'
      }), (info || self.$slots.info) && _h('div', {
        class: 'item-input-info'
      }, [info, this.$slots['info']])]), this.$slots['inner'], this.$slots['inner-end']]), this.$slots['content'], this.$slots['content-end']]);

      if (!wrap) {
        return ItemContent;
      }

      return _h('li', {
        ref: 'el',
        style: style,
        class: Utils.classNames(className, {
          disabled
        }, Mixins.colorClasses(props)),
        attrs: {
          id: id
        }
      }, [this.$slots['root-start'], ItemContent, isSortable && _h('div', {
        class: 'sortable-handler'
      }), this.$slots['root'], this.$slots['root-end']]);
    },

    watch: {
      'props.colorPickerParams': function watchValue() {
        const self = this;
        if (!self.$f7 || !self.f7ColorPicker) return;
        Utils.extend(self.f7ColorPicker.params, self.colorPickerParams || {});
      },
      'props.calendarParams': function watchValue() {
        const self = this;
        if (!self.$f7 || !self.f7Calendar) return;
        Utils.extend(self.f7Calendar.params, self.calendarParams || {});
      },
      'props.value': function watchValue() {
        const self = this;
        if (!self.$f7) return;
        self.updateInputOnDidUpdate = true;

        if (self.f7Calendar) {
          self.f7Calendar.setValue(self.props.value);
        }

        if (self.f7ColorPicker) {
          self.f7ColorPicker.setValue(self.props.value);
        }
      }
    },

    created() {
      Utils.bindMethods(this, 'onChange onInput onFocus onBlur onTextareaResize onInputNotEmpty onInputEmpty onInputClear'.split(' '));
    },

    mounted() {
      const self = this;
      const el = self.$refs.el;
      const itemContentEl = self.$refs.itemContentEl;
      if (!el && !itemContentEl) return;
      self.$f7ready(f7 => {
        const {
          validate,
          validateOnBlur,
          resizable,
          value,
          defaultValue,
          type,
          calendarParams,
          colorPickerParams
        } = self.props;
        const inputEl = self.$refs.inputEl;
        if (!inputEl) return;
        inputEl.addEventListener('input:notempty', self.onInputNotEmpty, false);
        inputEl.addEventListener('textarea:resize', self.onTextareaResize, false);
        inputEl.addEventListener('input:empty', self.onInputEmpty, false);
        inputEl.addEventListener('input:clear', self.onInputClear, false);

        if (type === 'datepicker') {
          self.f7Calendar = f7.calendar.create(Object.assign({
            inputEl,
            value,
            on: {
              change(calendar, calendarValue) {
                self.dispatchEvent('calendar:change calendarChange', calendarValue);
              }

            }
          }, calendarParams || {}));
        }

        if (type === 'colorpicker') {
          self.f7ColorPicker = f7.colorPicker.create(Object.assign({
            inputEl,
            value,
            on: {
              change(colorPicker, colorPickerValue) {
                self.dispatchEvent('colorpicker:change colorPickerChange', colorPickerValue);
              }

            }
          }, colorPickerParams || {}));
        }

        if (!(validateOnBlur || validateOnBlur === '') && (validate || validate === '') && (typeof value !== 'undefined' && value !== null && value !== '' || typeof defaultValue !== 'undefined' && defaultValue !== null && defaultValue !== '')) {
          setTimeout(() => {
            self.validateInput(inputEl);
          }, 0);
        }

        if (type === 'textarea' && resizable) {
          f7.input.resizeTextarea(inputEl);
        }
      });
      self.$listEl = self.$$(el || itemContentEl).parents('.list, .list-group').eq(0);

      if (self.$listEl.length) {
        self.setState({
          isSortable: self.$listEl.hasClass('sortable')
        });
      }
    },

    updated() {
      const self = this;
      const {
        $listEl
      } = self;
      if (!$listEl || $listEl && $listEl.length === 0) return;
      const isSortable = $listEl.hasClass('sortable');

      if (isSortable !== self.state.isSortable) {
        self.setState({
          isSortable
        });
      }

      const {
        validate,
        validateOnBlur,
        resizable,
        type
      } = self.props;
      const f7 = self.$f7;
      if (!f7) return;

      if (self.updateInputOnDidUpdate) {
        const inputEl = self.$refs.inputEl;
        if (!inputEl) return;
        self.updateInputOnDidUpdate = false;

        if (validate && !validateOnBlur) {
          self.validateInput(inputEl);
        }

        if (type === 'textarea' && resizable) {
          f7.input.resizeTextarea(inputEl);
        }
      }
    },

    beforeDestroy() {
      const self = this;
      const inputEl = self.$refs.inputEl;
      if (!inputEl) return;
      inputEl.removeEventListener('input:notempty', self.onInputNotEmpty, false);
      inputEl.removeEventListener('textarea:resize', self.onTextareaResize, false);
      inputEl.removeEventListener('input:empty', self.onInputEmpty, false);
      inputEl.removeEventListener('input:clear', self.onInputClear, false);

      if (self.f7Calendar && self.f7Calendar.destroy) {
        self.f7Calendar.destroy();
      }

      if (self.f7ColorPicker && self.f7ColorPicker.destroy) {
        self.f7ColorPicker.destroy();
      }

      delete self.f7Calendar;
      delete self.f7ColorPicker;
    },

    methods: {
      domValue() {
        const self = this;
        const {
          inputEl
        } = self.$refs;
        if (!inputEl) return undefined;
        return inputEl.value;
      },

      inputHasValue() {
        const self = this;
        const {
          value,
          type
        } = self.props;

        if (type === 'datepicker' && Array.isArray(value) && value.length === 0) {
          return false;
        }

        const domValue = self.domValue();
        return typeof value === 'undefined' ? domValue || domValue === 0 : value || value === 0;
      },

      validateInput(inputEl) {
        const self = this;
        const f7 = self.$f7;
        if (!f7 || !inputEl) return;
        const validity = inputEl.validity;
        if (!validity) return;
        const {
          onValidate
        } = self.props;

        if (!validity.valid) {
          if (onValidate) onValidate(false);

          if (self.state.inputInvalid !== true) {
            self.setState({
              inputInvalid: true
            });
          }
        } else if (self.state.inputInvalid !== false) {
          if (onValidate) onValidate(true);
          self.setState({
            inputInvalid: false
          });
        }
      },

      onTextareaResize(event) {
        this.dispatchEvent('textarea:resize textareaResize', event);
      },

      onInputNotEmpty(event) {
        this.dispatchEvent('input:notempty inputNotEmpty', event);
      },

      onInputEmpty(event) {
        this.dispatchEvent('input:empty inputEmpty', event);
      },

      onInputClear(event) {
        this.dispatchEvent('input:clear inputClear', event);
      },

      onInput(...args) {
        const self = this;
        const {
          validate,
          validateOnBlur
        } = self.props;
        self.dispatchEvent('input', ...args);

        if (!(validateOnBlur || validateOnBlur === '') && (validate || validate === '') && self.$refs && self.$refs.inputEl) {
          self.validateInput(self.$refs.inputEl);
        }
      },

      onFocus(...args) {
        this.dispatchEvent('focus', ...args);
        this.setState({
          inputFocused: true
        });
      },

      onBlur(...args) {
        const self = this;
        const {
          validate,
          validateOnBlur
        } = self.props;
        self.dispatchEvent('blur', ...args);

        if ((validate || validate === '' || validateOnBlur || validateOnBlur === '') && self.$refs && self.$refs.inputEl) {
          self.validateInput(self.$refs.inputEl);
        }

        self.setState({
          inputFocused: false
        });
      },

      onChange(...args) {
        this.dispatchEvent('change', ...args);

        if (this.props.type === 'texteditor') {
          this.dispatchEvent('texteditor:change textEditorChange', args[0]);
        }
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      },

      setState(updater, callback) {
        __vueComponentSetState(this, updater, callback);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-list-item-cell',
    props: Object.assign({
      id: [String, Number]
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        className,
        id,
        style
      } = props;
      const classes = Utils.classNames(className, 'item-cell', Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  var F7ListItemContent = {
    name: 'f7-list-item-content',
    props: Object.assign({
      id: [String, Number],
      title: [String, Number],
      text: [String, Number],
      media: String,
      subtitle: [String, Number],
      header: [String, Number],
      footer: [String, Number],
      after: [String, Number],
      badge: [String, Number],
      badgeColor: String,
      mediaList: Boolean,
      mediaItem: Boolean,
      checkbox: Boolean,
      checked: Boolean,
      defaultChecked: Boolean,
      indeterminate: Boolean,
      radio: Boolean,
      radioIcon: String,
      name: String,
      value: [String, Number, Array],
      readonly: Boolean,
      required: Boolean,
      disabled: Boolean
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        id,
        className,
        style,
        radio,
        radioIcon,
        checkbox,
        value,
        name,
        checked,
        defaultChecked,
        readonly,
        disabled,
        required,
        media,
        header,
        footer,
        title,
        subtitle,
        text,
        after,
        badge,
        mediaList,
        mediaItem,
        badgeColor
      } = props;
      const slotsContentStart = [];
      const slotsContent = [];
      const slotsContentEnd = [];
      const slotsInnerStart = [];
      const slotsInner = [];
      const slotsInnerEnd = [];
      const slotsAfterStart = [];
      const slotsAfter = [];
      const slotsAfterEnd = [];
      const slotsMedia = [];
      const slotsBeforeTitle = [];
      const slotsTitle = [];
      const slotsAfterTitle = [];
      const slotsSubtitle = [];
      const slotsText = [];
      const slotsHeader = [];
      const slotsFooter = [];
      let titleEl;
      let afterWrapEl;
      let afterEl;
      let badgeEl;
      let innerEl;
      let titleRowEl;
      let subtitleEl;
      let textEl;
      let mediaEl;
      let inputEl;
      let inputIconEl;
      let headerEl;
      let footerEl;
      const slotsDefault = self.$slots.default;
      const flattenSlots = [];

      if (slotsDefault && slotsDefault.length) {
        slotsDefault.forEach(slot => {
          if (Array.isArray(slot)) flattenSlots.push(...slot);else flattenSlots.push(slot);
        });
      }

      const passedSlotsContentStart = self.$slots['content-start'];

      if (passedSlotsContentStart && passedSlotsContentStart.length) {
        slotsContentStart.push(...passedSlotsContentStart);
      }

      flattenSlots.forEach(child => {
        if (typeof child === 'undefined') return;
        let slotName;
        slotName = child.data ? child.data.slot : undefined;
        if (!slotName || slotName === 'inner') slotsInner.push(child);
        if (slotName === 'content-start') slotsContentStart.push(child);
        if (slotName === 'content') slotsContent.push(child);
        if (slotName === 'content-end') slotsContentEnd.push(child);
        if (slotName === 'after-start') slotsAfterStart.push(child);
        if (slotName === 'after') slotsAfter.push(child);
        if (slotName === 'after-end') slotsAfterEnd.push(child);
        if (slotName === 'media') slotsMedia.push(child);
        if (slotName === 'inner-start') slotsInnerStart.push(child);
        if (slotName === 'inner-end') slotsInnerEnd.push(child);
        if (slotName === 'before-title') slotsBeforeTitle.push(child);
        if (slotName === 'title') slotsTitle.push(child);
        if (slotName === 'after-title') slotsAfterTitle.push(child);
        if (slotName === 'subtitle') slotsSubtitle.push(child);
        if (slotName === 'text') slotsText.push(child);
        if (slotName === 'header') slotsHeader.push(child);
        if (slotName === 'footer') slotsFooter.push(child);
      });

      if (radio || checkbox) {
        {
          inputEl = _h('input', {
            ref: 'inputEl',
            domProps: {
              checked,
              readonly,
              disabled,
              required,
              value
            },
            on: {
              change: this.onChange
            },
            attrs: {
              name: name,
              type: radio ? 'radio' : 'checkbox'
            }
          });
        }
        inputIconEl = _h('i', {
          class: `icon icon-${radio ? 'radio' : 'checkbox'}`
        });
      }

      if (media || slotsMedia.length) {
        let mediaImgEl;

        if (media) {
          mediaImgEl = _h('img', {
            attrs: {
              src: media
            }
          });
        }

        mediaEl = _h('div', {
          class: 'item-media'
        }, [mediaImgEl, slotsMedia]);
      }

      const isMedia = mediaItem || mediaList;

      if (header || slotsHeader.length) {
        headerEl = _h('div', {
          class: 'item-header'
        }, [header, slotsHeader]);
      }

      if (footer || slotsFooter.length) {
        footerEl = _h('div', {
          class: 'item-footer'
        }, [footer, slotsFooter]);
      }

      if (title || slotsTitle.length || !isMedia && headerEl || !isMedia && footerEl) {
        titleEl = _h('div', {
          class: 'item-title'
        }, [!isMedia && headerEl, title, slotsTitle, !isMedia && footerEl]);
      }

      if (subtitle || slotsSubtitle.length) {
        subtitleEl = _h('div', {
          class: 'item-subtitle'
        }, [subtitle, slotsSubtitle]);
      }

      if (text || slotsText.length) {
        textEl = _h('div', {
          class: 'item-text'
        }, [text, slotsText]);
      }

      if (after || badge || slotsAfter.length) {
        if (after) {
          afterEl = _h('span', [after]);
        }

        if (badge) {
          badgeEl = _h(F7Badge, {
            attrs: {
              color: badgeColor
            }
          }, [badge]);
        }

        afterWrapEl = _h('div', {
          class: 'item-after'
        }, [slotsAfterStart, afterEl, badgeEl, slotsAfter, slotsAfterEnd]);
      }

      if (isMedia) {
        titleRowEl = _h('div', {
          class: 'item-title-row'
        }, [slotsBeforeTitle, titleEl, slotsAfterTitle, afterWrapEl]);
        innerEl = _h('div', {
          ref: 'innerEl',
          class: 'item-inner'
        }, [slotsInnerStart, headerEl, titleRowEl, subtitleEl, textEl, slotsInner, footerEl, slotsInnerEnd]);
      } else {
        innerEl = _h('div', {
          ref: 'innerEl',
          class: 'item-inner'
        }, [slotsInnerStart, slotsBeforeTitle, titleEl, slotsAfterTitle, afterWrapEl, slotsInner, slotsInnerEnd]);
      }

      const ItemContentTag = checkbox || radio ? 'label' : 'div';
      const classes = Utils.classNames(className, 'item-content', {
        'item-checkbox': checkbox,
        'item-radio': radio,
        'item-radio-icon-start': radio && radioIcon === 'start',
        'item-radio-icon-end': radio && radioIcon === 'end'
      }, Mixins.colorClasses(props));
      return _h(ItemContentTag, {
        ref: 'el',
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [slotsContentStart, inputEl, inputIconEl, mediaEl, innerEl, slotsContent, slotsContentEnd]);
    },

    created() {
      Utils.bindMethods(this, 'onClick onChange'.split(' '));
    },

    mounted() {
      const self = this;
      const {
        el,
        inputEl
      } = self.$refs;
      const {
        indeterminate
      } = self.props;

      if (indeterminate && inputEl) {
        inputEl.indeterminate = true;
      }

      el.addEventListener('click', self.onClick);
    },

    updated() {
      const self = this;
      const {
        inputEl
      } = self.$refs;
      const {
        indeterminate
      } = self.props;

      if (inputEl) {
        inputEl.indeterminate = indeterminate;
      }
    },

    beforeDestroy() {
      const self = this;
      const {
        el
      } = self.$refs;
      el.removeEventListener('click', self.onClick);
    },

    methods: {
      onClick(event) {
        this.dispatchEvent('click', event);
      },

      onChange(event) {
        this.dispatchEvent('change', event);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  };

  ({
    name: 'f7-list-item-row',
    props: Object.assign({
      id: [String, Number]
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        className,
        id,
        style
      } = props;
      const classes = Utils.classNames(className, 'item-row', Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-list-item',
    props: Object.assign({
      id: [String, Number],
      title: [String, Number],
      text: [String, Number],
      media: String,
      subtitle: [String, Number],
      header: [String, Number],
      footer: [String, Number],
      tooltip: String,
      tooltipTrigger: String,
      link: [Boolean, String],
      target: String,
      tabLink: [Boolean, String],
      tabLinkActive: Boolean,
      after: [String, Number],
      badge: [String, Number],
      badgeColor: String,
      mediaItem: Boolean,
      mediaList: Boolean,
      divider: Boolean,
      groupTitle: Boolean,
      swipeout: Boolean,
      swipeoutOpened: Boolean,
      sortable: {
        type: Boolean,
        default: undefined
      },
      sortableOpposite: {
        type: Boolean,
        default: undefined
      },
      accordionItem: Boolean,
      accordionItemOpened: Boolean,
      smartSelect: Boolean,
      smartSelectParams: Object,
      noChevron: Boolean,
      chevronCenter: Boolean,
      checkbox: Boolean,
      radio: Boolean,
      radioIcon: String,
      checked: Boolean,
      defaultChecked: Boolean,
      indeterminate: Boolean,
      name: String,
      value: [String, Number, Array],
      readonly: Boolean,
      required: Boolean,
      disabled: Boolean,
      virtualListIndex: Number
    }, Mixins.colorProps, {}, Mixins.linkRouterProps, {}, Mixins.linkActionsProps),

    data() {
      const props = __vueComponentProps(this);

      const state = (() => {
        return {
          isMedia: props.mediaItem || props.mediaList,
          isSortable: props.sortable,
          isSortableOpposite: props.sortableOpposite,
          isSimple: false
        };
      })();

      return {
        state
      };
    },

    render() {
      const _h = this.$createElement;
      const self = this;
      let linkEl;
      let itemContentEl;
      const props = self.props;
      const {
        id,
        style,
        className,
        title,
        text,
        media,
        subtitle,
        header,
        footer,
        link,
        tabLink,
        tabLinkActive,
        href,
        target,
        after,
        badge,
        badgeColor,
        mediaItem,
        mediaList,
        divider,
        groupTitle,
        swipeout,
        accordionItem,
        accordionItemOpened,
        smartSelect,
        checkbox,
        radio,
        radioIcon,
        checked,
        defaultChecked,
        indeterminate,
        name,
        value,
        readonly,
        required,
        disabled,
        sortable,
        sortableOpposite,
        noChevron,
        chevronCenter,
        virtualListIndex
      } = props;
      const isMedia = mediaItem || mediaList || self.state.isMedia;
      const isSortable = sortable || self.state.isSortable;
      const isSortableOpposite = isSortable && (sortableOpposite || self.state.isSortableOpposite);
      const isSimple = self.state.isSimple;

      if (!isSimple) {
        const needsEvents = !(link || href || accordionItem || smartSelect);
        itemContentEl = _h(F7ListItemContent, {
          on: needsEvents ? {
            click: self.onClick,
            change: self.onChange
          } : undefined,
          attrs: {
            title: title,
            text: text,
            media: media,
            subtitle: subtitle,
            after: after,
            header: header,
            footer: footer,
            badge: badge,
            badgeColor: badgeColor,
            mediaList: isMedia,
            accordionItem: accordionItem,
            checkbox: checkbox,
            checked: checked,
            defaultChecked: defaultChecked,
            indeterminate: indeterminate,
            radio: radio,
            radioIcon: radioIcon,
            name: name,
            value: value,
            readonly: readonly,
            required: required,
            disabled: disabled
          }
        }, [this.$slots['content-start'], this.$slots['content'], this.$slots['content-end'], this.$slots['media'], this.$slots['inner-start'], this.$slots['inner'], this.$slots['inner-end'], this.$slots['after-start'], this.$slots['after'], this.$slots['after-end'], this.$slots['header'], this.$slots['footer'], this.$slots['before-title'], this.$slots['title'], this.$slots['after-title'], this.$slots['subtitle'], this.$slots['text'], swipeout || accordionItem ? null : self.$slots.default, isSortable && sortable !== false && isSortableOpposite && _h('div', {
          class: 'sortable-handler',
          slot: 'content-start'
        })]);

        if (link || href || accordionItem || smartSelect) {
          const linkAttrs = Object.assign({
            href: link === true ? '' : link || href,
            target,
            'data-tab': Utils.isStringProp(tabLink) && tabLink || undefined
          }, Mixins.linkRouterAttrs(props), {}, Mixins.linkActionsAttrs(props));
          const linkClasses = Utils.classNames({
            'item-link': true,
            'smart-select': smartSelect,
            'tab-link': tabLink || tabLink === '',
            'tab-link-active': tabLinkActive
          }, Mixins.linkRouterClasses(props), Mixins.linkActionsClasses(props));
          linkEl = _h('a', __vueComponentTransformJSXProps(Object.assign({
            ref: 'linkEl',
            class: linkClasses
          }, linkAttrs)), [itemContentEl]);
        }
      }

      const liClasses = Utils.classNames(className, {
        'item-divider': divider,
        'list-group-title': groupTitle,
        'media-item': isMedia,
        swipeout,
        'accordion-item': accordionItem,
        'accordion-item-opened': accordionItemOpened,
        disabled: disabled && !(radio || checkbox),
        'no-chevron': noChevron,
        'chevron-center': chevronCenter,
        'disallow-sorting': sortable === false
      }, Mixins.colorClasses(props));

      if (divider || groupTitle) {
        return _h('li', {
          ref: 'el',
          style: style,
          class: liClasses,
          attrs: {
            id: id,
            'data-virtual-list-index': virtualListIndex
          }
        }, [_h('span', [this.$slots['default'] || [title]])]);
      }

      if (isSimple) {
        return _h('li', {
          ref: 'el',
          style: style,
          class: liClasses,
          attrs: {
            id: id,
            'data-virtual-list-index': virtualListIndex
          }
        }, [title, this.$slots['default']]);
      }

      const linkItemEl = link || href || smartSelect || accordionItem ? linkEl : itemContentEl;
      return _h('li', {
        ref: 'el',
        style: style,
        class: liClasses,
        attrs: {
          id: id,
          'data-virtual-list-index': virtualListIndex
        }
      }, [this.$slots['root-start'], swipeout ? _h('div', {
        class: 'swipeout-content'
      }, [linkItemEl]) : linkItemEl, isSortable && sortable !== false && !isSortableOpposite && _h('div', {
        class: 'sortable-handler'
      }), (swipeout || accordionItem) && self.$slots.default, this.$slots['root'], this.$slots['root-end']]);
    },

    watch: {
      'props.tooltip': function watchTooltip(newText) {
        const self = this;

        if (!newText && self.f7Tooltip) {
          self.f7Tooltip.destroy();
          self.f7Tooltip = null;
          delete self.f7Tooltip;
          return;
        }

        if (newText && !self.f7Tooltip && self.$f7) {
          self.f7Tooltip = self.$f7.tooltip.create({
            targetEl: self.$refs.el,
            text: newText,
            trigger: self.props.tooltipTrigger
          });
          return;
        }

        if (!newText || !self.f7Tooltip) return;
        self.f7Tooltip.setText(newText);
      },
      'props.swipeoutOpened': function watchSwipeoutOpened(opened) {
        const self = this;
        if (!self.props.swipeout) return;
        const el = self.$refs.el;

        if (opened) {
          self.$f7.swipeout.open(el);
        } else {
          self.$f7.swipeout.close(el);
        }
      }
    },

    created() {
      Utils.bindMethods(this, ['onClick', 'onChange', 'onSwipeoutOpen', 'onSwipeoutOpened', 'onSwipeoutClose', 'onSwipeoutClosed', 'onSwipeoutDelete', 'onSwipeoutDeleted', 'onSwipeoutOverswipeEnter', 'onSwipeoutOverswipeExit', 'onSwipeout', 'onAccBeforeOpen', 'onAccOpen', 'onAccOpened', 'onAccBeforeClose', 'onAccClose', 'onAccClosed']);
    },

    mounted() {
      const self = this;
      const {
        el,
        linkEl
      } = self.$refs;
      if (!el) return;
      const {
        link,
        href,
        smartSelect,
        swipeout,
        swipeoutOpened,
        accordionItem,
        smartSelectParams,
        routeProps,
        tooltip,
        tooltipTrigger
      } = self.props;
      const needsEvents = !(link || href || accordionItem || smartSelect);

      if (!needsEvents && linkEl) {
        linkEl.addEventListener('click', self.onClick);
      }

      if (linkEl && routeProps) {
        linkEl.f7RouteProps = routeProps;
      }

      self.$listEl = self.$$(el).parents('.list, .list-group').eq(0);

      if (self.$listEl.length) {
        self.setState({
          isMedia: self.$listEl.hasClass('media-list'),
          isSimple: self.$listEl.hasClass('simple-list'),
          isSortable: self.$listEl.hasClass('sortable'),
          isSortableOpposite: self.$listEl.hasClass('sortable-opposite')
        });
      }

      self.$f7ready(f7 => {
        self.eventTargetEl = el;

        if (swipeout) {
          f7.on('swipeoutOpen', self.onSwipeoutOpen);
          f7.on('swipeoutOpened', self.onSwipeoutOpened);
          f7.on('swipeoutClose', self.onSwipeoutClose);
          f7.on('swipeoutClosed', self.onSwipeoutClosed);
          f7.on('swipeoutDelete', self.onSwipeoutDelete);
          f7.on('swipeoutDeleted', self.onSwipeoutDeleted);
          f7.on('swipeoutOverswipeEnter', self.onSwipeoutOverswipeEnter);
          f7.on('swipeoutOverswipeExit', self.onSwipeoutOverswipeExit);
          f7.on('swipeout', self.onSwipeout);
        }

        if (accordionItem) {
          f7.on('accordionBeforeOpen', self.onAccBeforeOpen);
          f7.on('accordionOpen', self.onAccOpen);
          f7.on('accordionOpened', self.onAccOpened);
          f7.on('accordionBeforeClose', self.onAccBeforeClose);
          f7.on('accordionClose', self.onAccClose);
          f7.on('accordionClosed', self.onAccClosed);
        }

        if (smartSelect) {
          const ssParams = Utils.extend({
            el: el.querySelector('a.smart-select')
          }, smartSelectParams || {});
          self.f7SmartSelect = f7.smartSelect.create(ssParams);
        }

        if (swipeoutOpened) {
          f7.swipeout.open(el);
        }

        if (tooltip) {
          self.f7Tooltip = f7.tooltip.create({
            targetEl: el,
            text: tooltip,
            trigger: tooltipTrigger
          });
        }
      });
    },

    updated() {
      const self = this;
      const {
        $listEl
      } = self;
      const {
        linkEl
      } = self.$refs;
      const {
        routeProps
      } = self.props;

      if (linkEl && routeProps) {
        linkEl.f7RouteProps = routeProps;
      }

      if (!$listEl || $listEl && $listEl.length === 0) return;
      const isMedia = $listEl.hasClass('media-list');
      const isSimple = $listEl.hasClass('simple-list');
      const isSortable = $listEl.hasClass('sortable');
      const isSortableOpposite = $listEl.hasClass('sortable-opposite');

      if (isMedia !== self.state.isMedia) {
        self.setState({
          isMedia
        });
      }

      if (isSimple !== self.state.isSimple) {
        self.setState({
          isSimple
        });
      }

      if (isSortable !== self.state.isSortable) {
        self.setState({
          isSortable
        });

        if (isSortableOpposite !== self.state.isSortableOpposite) {
          self.setState({
            isSortableOpposite
          });
        }
      }
    },

    beforeDestroy() {
      const self = this;
      const {
        linkEl
      } = self.$refs;
      const {
        link,
        href,
        smartSelect,
        swipeout,
        accordionItem
      } = self.props;
      const needsEvents = !(link || href || accordionItem || smartSelect);

      if (linkEl) {
        if (!needsEvents) {
          linkEl.removeEventListener('click', self.onClick);
        }

        delete linkEl.f7RouteProps;
      }

      if (self.$f7) {
        const f7 = self.$f7;

        if (swipeout) {
          f7.off('swipeoutOpen', self.onSwipeoutOpen);
          f7.off('swipeoutOpened', self.onSwipeoutOpened);
          f7.off('swipeoutClose', self.onSwipeoutClose);
          f7.off('swipeoutClosed', self.onSwipeoutClosed);
          f7.off('swipeoutDelete', self.onSwipeoutDelete);
          f7.off('swipeoutDeleted', self.onSwipeoutDeleted);
          f7.off('swipeoutOverswipeEnter', self.onSwipeoutOverswipeEnter);
          f7.off('swipeoutOverswipeExit', self.onSwipeoutOverswipeExit);
          f7.off('swipeout', self.onSwipeout);
        }

        if (accordionItem) {
          f7.off('accordionBeforeOpen', self.onAccBeforeOpen);
          f7.off('accordionOpen', self.onAccOpen);
          f7.off('accordionOpened', self.onAccOpened);
          f7.off('accordionBeforeClose', self.onAccBeforeClose);
          f7.off('accordionClose', self.onAccClose);
          f7.off('accordionClosed', self.onAccClosed);
        }
      }

      if (smartSelect && self.f7SmartSelect) {
        self.f7SmartSelect.destroy();
      }

      if (self.f7Tooltip && self.f7Tooltip.destroy) {
        self.f7Tooltip.destroy();
        self.f7Tooltip = null;
        delete self.f7Tooltip;
      }

      self.eventTargetEl = null;
      delete self.eventTargetEl;
    },

    methods: {
      onClick(event) {
        const self = this;

        if (event.target.tagName.toLowerCase() !== 'input') {
          self.dispatchEvent('click', event);
        }
      },

      onSwipeoutOverswipeEnter(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('swipeout:overswipeenter swipeoutOverswipeEnter');
      },

      onSwipeoutOverswipeExit(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('swipeout:overswipeexit swipeoutOverswipeExit');
      },

      onSwipeoutDeleted(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('swipeout:deleted swipeoutDeleted');
      },

      onSwipeoutDelete(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('swipeout:delete swipeoutDelete');
      },

      onSwipeoutClose(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('swipeout:close swipeoutClose');
      },

      onSwipeoutClosed(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('swipeout:closed swipeoutClosed');
      },

      onSwipeoutOpen(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('swipeout:open swipeoutOpen');
      },

      onSwipeoutOpened(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('swipeout:opened swipeoutOpened');
      },

      onSwipeout(el, progress) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('swipeout', progress);
      },

      onAccBeforeClose(el, prevent) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('accordion:beforeclose accordionBeforeClose', prevent);
      },

      onAccClose(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('accordion:close accordionClose');
      },

      onAccClosed(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('accordion:closed accordionClosed');
      },

      onAccBeforeOpen(el, prevent) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('accordion:beforeopen accordionBeforeOpen', prevent);
      },

      onAccOpen(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('accordion:open accordionOpen');
      },

      onAccOpened(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('accordion:opened accordionOpened');
      },

      onChange(event) {
        this.dispatchEvent('change', event);
      },

      onInput(event) {
        this.dispatchEvent('input', event);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      },

      setState(updater, callback) {
        __vueComponentSetState(this, updater, callback);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-list',
    props: Object.assign({
      id: [String, Number],
      inset: Boolean,
      xsmallInset: Boolean,
      smallInset: Boolean,
      mediumInset: Boolean,
      largeInset: Boolean,
      xlargeInset: Boolean,
      mediaList: Boolean,
      sortable: Boolean,
      sortableTapHold: Boolean,
      sortableEnabled: Boolean,
      sortableMoveElements: {
        type: Boolean,
        default: undefined
      },
      sortableOpposite: Boolean,
      accordionList: Boolean,
      accordionOpposite: Boolean,
      contactsList: Boolean,
      simpleList: Boolean,
      linksList: Boolean,
      noHairlines: Boolean,
      noHairlinesBetween: Boolean,
      noHairlinesMd: Boolean,
      noHairlinesBetweenMd: Boolean,
      noHairlinesIos: Boolean,
      noHairlinesBetweenIos: Boolean,
      noHairlinesAurora: Boolean,
      noHairlinesBetweenAurora: Boolean,
      noChevron: Boolean,
      chevronCenter: Boolean,
      tab: Boolean,
      tabActive: Boolean,
      form: Boolean,
      formStoreData: Boolean,
      inlineLabels: Boolean,
      virtualList: Boolean,
      virtualListParams: Object
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        id,
        style,
        form,
        sortableMoveElements
      } = props;
      const {
        list: slotsList,
        default: slotsDefault
      } = self.$slots;
      const rootChildrenBeforeList = [];
      const rootChildrenAfterList = [];
      const ulChildren = slotsList || [];
      const flattenSlots = Utils.flattenArray(slotsDefault);
      let wasUlChild = false;
      flattenSlots.forEach(child => {
        if (typeof child === 'undefined') return;
        let tag;
        {
          tag = child.tag;
        }

        if (!tag && 'vue' === 'react' || tag && !(tag === 'li' || tag === 'F7ListItem' || tag === 'F7ListButton' || tag === 'F7ListInput' || tag.indexOf('list-item') >= 0 || tag.indexOf('list-button') >= 0 || tag.indexOf('list-input') >= 0 || tag.indexOf('f7-list-item') >= 0 || tag.indexOf('f7-list-button') >= 0 || tag.indexOf('f7-list-input') >= 0)) {
          if (wasUlChild) rootChildrenAfterList.push(child);else rootChildrenBeforeList.push(child);
        } else if (tag) {
          wasUlChild = true;
          ulChildren.push(child);
        }
      });
      const ListTag = form ? 'form' : 'div';

      if (ulChildren.length > 0) {
        return _h(ListTag, {
          ref: 'el',
          style: style,
          class: self.classes,
          attrs: {
            id: id,
            'data-sortable-move-elements': typeof sortableMoveElements !== 'undefined' ? sortableMoveElements.toString() : undefined
          }
        }, [self.$slots['before-list'], rootChildrenBeforeList, _h('ul', [ulChildren]), self.$slots['after-list'], rootChildrenAfterList]);
      } else {
        return _h(ListTag, {
          ref: 'el',
          style: style,
          class: self.classes,
          attrs: {
            id: id,
            'data-sortable-move-elements': typeof sortableMoveElements !== 'undefined' ? sortableMoveElements.toString() : undefined
          }
        }, [self.$slots['before-list'], rootChildrenBeforeList, self.$slots['after-list'], rootChildrenAfterList]);
      }
    },

    computed: {
      classes() {
        const self = this;
        const props = self.props;
        const {
          inset,
          xsmallInset,
          smallInset,
          mediumInset,
          largeInset,
          xlargeInset,
          mediaList,
          simpleList,
          linksList,
          sortable,
          sortableTapHold,
          sortableEnabled,
          sortableOpposite,
          accordionList,
          accordionOpposite,
          contactsList,
          virtualList,
          tab,
          tabActive,
          noHairlines,
          noHairlinesIos,
          noHairlinesMd,
          noHairlinesAurora,
          noHairlinesBetween,
          noHairlinesBetweenIos,
          noHairlinesBetweenMd,
          noHairlinesBetweenAurora,
          formStoreData,
          inlineLabels,
          className,
          noChevron,
          chevronCenter
        } = props;
        return Utils.classNames(className, 'list', {
          inset,
          'xsmall-inset': xsmallInset,
          'small-inset': smallInset,
          'medium-inset': mediumInset,
          'large-inset': largeInset,
          'xlarge-inset': xlargeInset,
          'media-list': mediaList,
          'simple-list': simpleList,
          'links-list': linksList,
          sortable,
          'sortable-tap-hold': sortableTapHold,
          'sortable-enabled': sortableEnabled,
          'sortable-opposite': sortableOpposite,
          'accordion-list': accordionList,
          'accordion-opposite': accordionOpposite,
          'contacts-list': contactsList,
          'virtual-list': virtualList,
          tab,
          'tab-active': tabActive,
          'no-hairlines': noHairlines,
          'no-hairlines-md': noHairlinesMd,
          'no-hairlines-ios': noHairlinesIos,
          'no-hairlines-aurora': noHairlinesAurora,
          'no-hairlines-between': noHairlinesBetween,
          'no-hairlines-between-md': noHairlinesBetweenMd,
          'no-hairlines-between-ios': noHairlinesBetweenIos,
          'no-hairlines-between-aurora': noHairlinesBetweenAurora,
          'form-store-data': formStoreData,
          'inline-labels': inlineLabels,
          'no-chevron': noChevron,
          'chevron-center': chevronCenter
        }, Mixins.colorClasses(props));
      },

      props() {
        return __vueComponentProps(this);
      }

    },

    created() {
      Utils.bindMethods(this, ['onSortableEnable', 'onSortableDisable', 'onSortableSort', 'onTabShow', 'onTabHide', 'onSubmit']);
    },

    mounted() {
      const self = this;
      const el = self.$refs.el;
      const {
        virtualList,
        virtualListParams,
        form
      } = self.props;
      self.$f7ready(f7 => {
        self.eventTargetEl = el;
        f7.on('sortableEnable', self.onSortableEnable);
        f7.on('sortableDisable', self.onSortableDisable);
        f7.on('sortableSort', self.onSortableSort);
        f7.on('tabShow', self.onTabShow);
        f7.on('tabHide', self.onTabHide);

        if (form) {
          el.addEventListener('submit', self.onSubmit);
        }

        if (!virtualList) return;
        const vlParams = virtualListParams || {};
        if (!vlParams.renderItem && !vlParams.itemTemplate && !vlParams.renderExternal) return;
        self.f7VirtualList = f7.virtualList.create(Utils.extend({
          el,
          on: {
            itemBeforeInsert(itemEl, item) {
              const vl = this;
              self.dispatchEvent('virtual:itembeforeinsert virtualItemBeforeInsert', vl, itemEl, item);
            },

            beforeClear(fragment) {
              const vl = this;
              self.dispatchEvent('virtual:beforeclear virtualBeforeClear', vl, fragment);
            },

            itemsBeforeInsert(fragment) {
              const vl = this;
              self.dispatchEvent('virtual:itemsbeforeinsert virtualItemsBeforeInsert', vl, fragment);
            },

            itemsAfterInsert(fragment) {
              const vl = this;
              self.dispatchEvent('virtual:itemsafterinsert virtualItemsAfterInsert', vl, fragment);
            }

          }
        }, vlParams));
      });
    },

    beforeDestroy() {
      const self = this;
      const el = self.$refs.el;
      const f7 = self.$f7;
      if (!el || !f7) return;
      f7.off('sortableEnable', self.onSortableEnable);
      f7.off('sortableDisable', self.onSortableDisable);
      f7.off('sortableSort', self.onSortableSort);
      f7.off('tabShow', self.onTabShow);
      f7.off('tabHide', self.onTabHide);
      el.removeEventListener('submit', self.onSubmit);
      self.eventTargetEl = null;
      delete self.eventTargetEl;
      if (!(self.virtualList && self.f7VirtualList)) return;
      if (self.f7VirtualList.destroy) self.f7VirtualList.destroy();
    },

    methods: {
      onSubmit(event) {
        this.dispatchEvent('submit', event);
      },

      onSortableEnable(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('sortable:enable sortableEnable');
      },

      onSortableDisable(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('sortable:disable sortableDisable');
      },

      onSortableSort(el, sortData, listEl) {
        if (this.eventTargetEl !== listEl) return;
        this.dispatchEvent('sortable:sort sortableSort', sortData);
      },

      onTabShow(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('tab:show tabShow', el);
      },

      onTabHide(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('tab:hide tabHide', el);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    }
  });

  ({
    name: 'f7-login-screen-title',
    props: Object.assign({
      id: [String, Number]
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        className,
        id,
        style
      } = props;
      const classes = Utils.classNames(className, 'login-screen-title', Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-login-screen',
    props: Object.assign({
      id: [String, Number],
      opened: Boolean
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        className,
        id,
        style
      } = props;
      const classes = Utils.classNames(className, 'login-screen', Mixins.colorClasses(props));
      return _h('div', {
        ref: 'el',
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    watch: {
      'props.opened': function watchOpened(opened) {
        const self = this;
        if (!self.f7LoginScreen) return;

        if (opened) {
          self.f7LoginScreen.open();
        } else {
          self.f7LoginScreen.close();
        }
      }
    },

    created() {
      Utils.bindMethods(this, ['onOpen', 'onOpened', 'onClose', 'onClosed']);
    },

    mounted() {
      const self = this;
      const el = self.$refs.el;
      if (!el) return;
      self.$f7ready(() => {
        self.f7LoginScreen = self.$f7.loginScreen.create({
          el,
          on: {
            open: self.onOpen,
            opened: self.onOpened,
            close: self.onClose,
            closed: self.onClosed
          }
        });

        if (self.props.opened) {
          self.f7LoginScreen.open(false);
        }
      });
    },

    beforeDestroy() {
      const self = this;
      if (self.f7LoginScreen) self.f7LoginScreen.destroy();
    },

    methods: {
      onOpen(instance) {
        this.dispatchEvent('loginscreen:open loginScreenOpen', instance);
      },

      onOpened(instance) {
        this.dispatchEvent('loginscreen:opened loginScreenOpened', instance);
      },

      onClose(instance) {
        this.dispatchEvent('loginscreen:close loginScreenClose', instance);
      },

      onClosed(instance) {
        this.dispatchEvent('loginscreen:closed loginScreenClosed', instance);
      },

      open(animate) {
        const self = this;
        if (!self.f7LoginScreen) return undefined;
        return self.f7LoginScreen.open(animate);
      },

      close(animate) {
        const self = this;
        if (!self.f7LoginScreen) return undefined;
        return self.f7LoginScreen.close(animate);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-menu-dropdown-item',
    props: Object.assign({
      id: [String, Number],
      text: String,
      link: Boolean,
      href: String,
      target: String,
      divider: Boolean
    }, Mixins.colorProps, {}, Mixins.linkRouterProps, {}, Mixins.linkActionsProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        id,
        className,
        style,
        link,
        href,
        text,
        divider,
        menuClose
      } = props;
      const isLink = link || href || href === '';
      const Tag = isLink ? 'a' : 'div';
      const classes = Utils.classNames({
        'menu-dropdown-link': isLink && !divider,
        'menu-dropdown-item': !isLink && !divider,
        'menu-dropdown-divider': divider
      }, className, Mixins.colorClasses(props), Mixins.linkRouterClasses(props), Mixins.linkActionsClasses(props), {
        'menu-close': typeof menuClose === 'undefined'
      });
      return _h(Tag, __vueComponentTransformJSXProps(Object.assign({
        ref: 'el',
        class: classes,
        style: style
      }, self.attrs, {
        attrs: {
          id: id
        }
      })), [text, this.$slots['default']]);
    },

    created() {
      Utils.bindMethods(this, ['onClick']);
    },

    mounted() {
      const self = this;
      const el = self.$refs.el;
      if (!el) return;
      el.addEventListener('click', self.onClick);
      const {
        routeProps
      } = self.props;
      if (routeProps) el.f7RouteProps = routeProps;
    },

    updated() {
      const self = this;
      const el = self.$refs.el;
      if (!el) return;
      const {
        routeProps
      } = self.props;
      if (routeProps) el.f7RouteProps = routeProps;
    },

    beforeDestroy() {
      const self = this;
      const el = self.$refs.el;
      if (!el) return;
      el.removeEventListener('click', self.onClick);
      delete el.f7RouteProps;
    },

    computed: {
      attrs() {
        const self = this;
        const props = self.props;
        const {
          link,
          href,
          target
        } = props;
        let hrefComputed = href;
        if (typeof hrefComputed === 'undefined' && link) hrefComputed = '#';
        return Utils.extend({
          href: hrefComputed,
          target
        }, Mixins.linkRouterAttrs(props), Mixins.linkActionsAttrs(props));
      },

      props() {
        return __vueComponentProps(this);
      }

    },
    methods: {
      onClick(event) {
        this.dispatchEvent('click', event);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    }
  });

  ({
    name: 'f7-menu-dropdown',
    props: Object.assign({
      id: [String, Number],
      contentHeight: String,
      position: String,
      left: Boolean,
      center: Boolean,
      right: Boolean
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        id,
        className,
        style,
        contentHeight,
        position,
        left,
        center,
        right
      } = props;
      let positionComputed = position || 'left';
      if (left) positionComputed = 'left';
      if (center) positionComputed = 'center';
      if (right) positionComputed = 'right';
      const classes = Utils.classNames('menu-dropdown', `menu-dropdown-${positionComputed}`, Mixins.colorClasses(props), className);
      return _h('div', {
        class: classes,
        style: style,
        attrs: {
          id: id
        }
      }, [_h('div', {
        class: 'menu-dropdown-content',
        style: {
          height: contentHeight
        }
      }, [this.$slots['default']])]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-menu-item',
    props: Object.assign({
      id: [String, Number],
      text: String,
      iconOnly: Boolean,
      href: String,
      link: Boolean,
      target: String,
      dropdown: Boolean
    }, Mixins.colorProps, {}, Mixins.linkIconProps, {}, Mixins.linkRouterProps, {}, Mixins.linkActionsProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        id,
        className,
        style,
        link,
        href,
        text,
        dropdown,
        iconOnly,
        icon,
        iconColor,
        iconSize,
        iconMaterial,
        iconF7,
        iconMd,
        iconIos,
        iconAurora
      } = props;
      const slots = self.$slots;
      let iconEl;
      let iconOnlyComputed;

      if (icon || iconMaterial || iconF7 || iconMd || iconIos || iconAurora) {
        iconEl = _h(F7Icon, {
          attrs: {
            material: iconMaterial,
            f7: iconF7,
            icon: icon,
            md: iconMd,
            ios: iconIos,
            aurora: iconAurora,
            color: iconColor,
            size: iconSize
          }
        });
      }

      if (iconOnly || !text && slots.text && slots.text.length === 0 || !text && !slots.text) {
        iconOnlyComputed = true;
      } else {
        iconOnlyComputed = false;
      }

      const isLink = link || href || href === '';
      const Tag = isLink ? 'a' : 'div';
      const isDropdown = dropdown || dropdown === '';
      const classes = Utils.classNames({
        'menu-item': true,
        'menu-item-dropdown': isDropdown,
        'icon-only': iconOnlyComputed
      }, className, Mixins.colorClasses(props), Mixins.linkRouterClasses(props), Mixins.linkActionsClasses(props));
      return _h(Tag, __vueComponentTransformJSXProps(Object.assign({
        ref: 'el',
        class: classes,
        style: style
      }, self.attrs, {
        attrs: {
          id: id
        }
      })), [(text || slots.text && slots.text.length || iconEl) && _h('div', {
        class: 'menu-item-content'
      }, [text, iconEl, this.$slots['text']]), this.$slots['default']]);
    },

    created() {
      Utils.bindMethods(this, ['onClick', 'onOpened', 'onClosed']);
    },

    mounted() {
      const self = this;
      const el = self.$refs.el;
      if (!el) return;
      self.eventTargetEl = el;
      el.addEventListener('click', self.onClick);
      const {
        routeProps
      } = self.props;
      if (routeProps) el.f7RouteProps = routeProps;
      self.$f7ready(f7 => {
        f7.on('menuOpened', self.onOpened);
        f7.on('menuClosed', self.onClosed);
      });
    },

    updated() {
      const self = this;
      const el = self.$refs.el;
      if (!el) return;
      const {
        routeProps
      } = self.props;
      if (routeProps) el.f7RouteProps = routeProps;
    },

    beforeDestroy() {
      const self = this;
      const el = self.$refs.el;
      if (!el || !self.$f7) return;
      el.removeEventListener('click', self.onClick);
      self.$f7.off('menuOpened', self.onOpened);
      self.$f7.off('menuClosed', self.onOpened);
      self.eventTargetEl = null;
      delete el.f7RouteProps;
      delete self.eventTargetEl;
    },

    computed: {
      attrs() {
        const self = this;
        const props = self.props;
        const {
          href,
          link,
          target
        } = props;
        let hrefComputed = href;
        if (typeof hrefComputed === 'undefined' && link) hrefComputed = '#';
        return Utils.extend({
          href: hrefComputed,
          target
        }, Mixins.linkRouterAttrs(props), Mixins.linkActionsAttrs(props));
      },

      props() {
        return __vueComponentProps(this);
      }

    },
    methods: {
      onClick(e) {
        this.dispatchEvent('click', e);
      },

      onOpened(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('menuOpened menu:opened', el);
      },

      onClosed(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('menuClosed menu:closed', el);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    }
  });

  ({
    name: 'f7-menu',
    props: Object.assign({
      id: [String, Number]
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        id,
        className,
        style
      } = props;
      return _h('div', {
        class: Utils.classNames('menu', Mixins.colorClasses(props), className),
        style: style,
        attrs: {
          id: id
        }
      }, [_h('div', {
        class: 'menu-inner'
      }, [this.$slots['default']])]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-message',
    props: Object.assign({
      id: [String, Number],
      text: String,
      name: String,
      avatar: String,
      type: {
        type: String,
        default: 'sent'
      },
      image: String,
      header: String,
      footer: String,
      textHeader: String,
      textFooter: String,
      first: Boolean,
      last: Boolean,
      tail: Boolean,
      sameName: Boolean,
      sameHeader: Boolean,
      sameFooter: Boolean,
      sameAvatar: Boolean,
      typing: Boolean
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        text,
        name,
        avatar,
        image,
        header,
        footer,
        textHeader,
        textFooter,
        typing,
        id,
        style
      } = props;
      const {
        start: slotsStart,
        end: slotsEnd,
        default: slotsDefault,
        'content-start': slotsContentStart,
        'content-end': slotsContentEnd,
        avatar: slotsAvatar,
        name: slotsName,
        header: slotsHeader,
        footer: slotsFooter,
        image: slotsImage,
        text: slotsText,
        'text-header': slotsTextHeader,
        'text-footer': slotsTextFooter,
        'bubble-start': slotsBubbleStart,
        'bubble-end': slotsBubbleEnd
      } = self.$slots;
      return _h('div', {
        ref: 'el',
        style: style,
        class: self.classes,
        attrs: {
          id: id
        }
      }, [slotsStart, (avatar || slotsAvatar) && _h('div', {
        ref: 'avatarEl',
        class: 'message-avatar',
        style: {
          backgroundImage: avatar && `url(${avatar})`
        }
      }, [slotsAvatar]), _h('div', {
        class: 'message-content'
      }, [slotsContentStart, (slotsName || name) && _h('div', {
        ref: 'nameEl',
        class: 'message-name'
      }, [slotsName || name]), (slotsHeader || header) && _h('div', {
        ref: 'headerEl',
        class: 'message-header'
      }, [slotsHeader || header]), _h('div', {
        ref: 'bubbleEl',
        class: 'message-bubble'
      }, [slotsBubbleStart, (slotsImage || image) && _h('div', {
        class: 'message-image'
      }, [slotsImage || _h('img', {
        attrs: {
          src: image
        }
      })]), (slotsTextHeader || textHeader) && _h('div', {
        class: 'message-text-header'
      }, [slotsTextHeader || textHeader]), (slotsText || text || typing) && _h('div', {
        ref: 'textEl',
        class: 'message-text'
      }, [slotsText || text, typing && _h('div', {
        class: 'message-typing-indicator'
      }, [_h('div'), _h('div'), _h('div')])]), (slotsTextFooter || textFooter) && _h('div', {
        class: 'message-text-footer'
      }, [slotsTextFooter || textFooter]), slotsBubbleEnd, slotsDefault]), (slotsFooter || footer) && _h('div', {
        ref: 'footerEl',
        class: 'message-footer'
      }, [slotsFooter || footer]), slotsContentEnd]), slotsEnd]);
    },

    computed: {
      classes() {
        const self = this;
        const props = self.props;
        const {
          type,
          typing,
          first,
          last,
          tail,
          sameName,
          sameHeader,
          sameFooter,
          sameAvatar,
          className
        } = props;
        return Utils.classNames(className, 'message', {
          'message-sent': type === 'sent',
          'message-received': type === 'received',
          'message-typing': typing,
          'message-first': first,
          'message-last': last,
          'message-tail': tail,
          'message-same-name': sameName,
          'message-same-header': sameHeader,
          'message-same-footer': sameFooter,
          'message-same-avatar': sameAvatar
        }, Mixins.colorClasses(props));
      },

      props() {
        return __vueComponentProps(this);
      }

    },

    created() {
      Utils.bindMethods(this, ['onClick', 'onNameClick', 'onTextClick', 'onAvatarClick', 'onHeaderClick', 'onFooterClick', 'onBubbleClick']);
    },

    mounted() {
      const {
        el,
        nameEl,
        textEl,
        avatarEl,
        headerEl,
        footerEl,
        bubbleEl
      } = this.$refs;
      el.addEventListener('click', this.onClick);
      if (nameEl) nameEl.addEventListener('click', this.onNameClick);
      if (textEl) textEl.addEventListener('click', this.onTextClick);
      if (avatarEl) avatarEl.addEventListener('click', this.onAvatarClick);
      if (headerEl) headerEl.addEventListener('click', this.onHeaderClick);
      if (footerEl) footerEl.addEventListener('click', this.onFooterClick);
      if (bubbleEl) bubbleEl.addEventListener('click', this.onBubbleClick);
    },

    beforeDestroy() {
      const {
        el,
        nameEl,
        textEl,
        avatarEl,
        headerEl,
        footerEl,
        bubbleEl
      } = this.$refs;
      el.removeEventListener('click', this.onClick);
      if (nameEl) nameEl.removeEventListener('click', this.onNameClick);
      if (textEl) textEl.removeEventListener('click', this.onTextClick);
      if (avatarEl) avatarEl.removeEventListener('click', this.onAvatarClick);
      if (headerEl) headerEl.removeEventListener('click', this.onHeaderClick);
      if (footerEl) footerEl.removeEventListener('click', this.onFooterClick);
      if (bubbleEl) bubbleEl.removeEventListener('click', this.onBubbleClick);
    },

    methods: {
      onClick(event) {
        this.dispatchEvent('click', event);
      },

      onNameClick(event) {
        this.dispatchEvent('click:name clickName', event);
      },

      onTextClick(event) {
        this.dispatchEvent('click:text clickText', event);
      },

      onAvatarClick(event) {
        this.dispatchEvent('click:avatar clickAvatar', event);
      },

      onHeaderClick(event) {
        this.dispatchEvent('click:header clickHeader', event);
      },

      onFooterClick(event) {
        this.dispatchEvent('click:footer clickFooter', event);
      },

      onBubbleClick(event) {
        this.dispatchEvent('click:bubble clickBubble', event);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    }
  });

  ({
    name: 'f7-messagebar-attachment',
    props: Object.assign({
      id: [String, Number],
      image: String,
      deletable: {
        type: Boolean,
        default: true
      }
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        deletable,
        image,
        className,
        id,
        style
      } = props;
      const classes = Utils.classNames(className, 'messagebar-attachment', Mixins.colorClasses(props));
      return _h('div', {
        ref: 'el',
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [image && _h('img', {
        attrs: {
          src: image
        }
      }), deletable && _h('span', {
        ref: 'deleteEl',
        class: 'messagebar-attachment-delete'
      }), this.$slots['default']]);
    },

    created() {
      Utils.bindMethods(this, ['onClick', 'onDeleteClick']);
    },

    mounted() {
      this.$refs.el.addEventListener('click', this.onClick);

      if (this.$refs.deleteEl) {
        this.$refs.deleteEl.addEventListener('click', this.onDeleteClick);
      }
    },

    beforeDestroy() {
      this.$refs.el.removeEventListener('click', this.onClick);

      if (this.$refs.deleteEl) {
        this.$refs.deleteEl.removeEventListener('click', this.onDeleteClick);
      }
    },

    methods: {
      onClick(event) {
        this.dispatchEvent('attachment:click attachmentClick', event);
      },

      onDeleteClick(event) {
        this.dispatchEvent('attachment:delete attachmentDelete', event);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-messagebar-attachments',
    props: Object.assign({
      id: [String, Number]
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        className,
        id,
        style
      } = props;
      const classes = Utils.classNames(className, 'messagebar-attachments', Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-messagebar-sheet-image',
    props: Object.assign({
      id: [String, Number],
      image: String,
      checked: Boolean
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        image,
        checked,
        id,
        className,
        style
      } = props;
      const classes = Utils.classNames(className, 'messagebar-sheet-image', 'checkbox', Mixins.colorClasses(props));
      const styles = Utils.extend({
        backgroundImage: image && `url(${image})`
      }, style || {});
      let inputEl;
      {
        inputEl = _h('input', {
          ref: 'inputEl',
          domProps: {
            checked
          },
          on: {
            change: self.onChange
          },
          attrs: {
            type: 'checkbox'
          }
        });
      }
      return _h('label', {
        class: classes,
        style: styles,
        attrs: {
          id: id
        }
      }, [inputEl, _h('i', {
        class: 'icon icon-checkbox'
      }), this.$slots['default']]);
    },

    created() {
      Utils.bindMethods(this, ['onChange']);
    },

    methods: {
      onChange(event) {
        if (this.props.checked) this.dispatchEvent('checked', event);else this.dispatchEvent('unchecked', event);
        this.dispatchEvent('change', event);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-messagebar-sheet-item',
    props: Object.assign({
      id: [String, Number]
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        className,
        id,
        style
      } = props;
      const classes = Utils.classNames(className, 'messagebar-sheet-item', Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-messagebar-sheet',
    props: Object.assign({
      id: [String, Number]
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        className,
        id,
        style
      } = props;
      const classes = Utils.classNames(className, 'messagebar-sheet', Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-messagebar',
    props: Object.assign({
      id: [String, Number],
      sheetVisible: Boolean,
      attachmentsVisible: Boolean,
      top: Boolean,
      resizable: {
        type: Boolean,
        default: true
      },
      bottomOffset: {
        type: Number,
        default: 0
      },
      topOffset: {
        type: Number,
        default: 0
      },
      maxHeight: Number,
      resizePage: {
        type: Boolean,
        default: true
      },
      sendLink: String,
      value: [String, Number, Array],
      disabled: Boolean,
      readonly: Boolean,
      textareaId: [Number, String],
      name: String,
      placeholder: {
        type: String,
        default: 'Message'
      },
      init: {
        type: Boolean,
        default: true
      }
    }, Mixins.colorProps),

    created() {
      Utils.bindMethods(this, ['onChange', 'onInput', 'onFocus', 'onBlur', 'onClick', 'onAttachmentDelete', 'onAttachmentClick,', 'onResizePage']);
    },

    render() {
      const _h = this.$createElement;
      const self = this;
      const {
        placeholder,
        disabled,
        name,
        readonly,
        resizable,
        value,
        sendLink,
        id,
        style
      } = self.props;
      const {
        default: slotsDefault,
        'before-inner': slotsBeforeInner,
        'after-inner': slotsAfterInner,
        'send-link': slotsSendLink,
        'inner-start': slotsInnerStart,
        'inner-end': slotsInnerEnd,
        'before-area': slotsBeforeArea,
        'after-area': slotsAfterArea
      } = self.$slots;
      const innerEndEls = [];
      let messagebarAttachmentsEl;
      let messagebarSheetEl;

      if (slotsDefault) {
        slotsDefault.forEach(child => {
          if (typeof child === 'undefined') return;
          let tag;
          tag = child.tag;

          if (tag && (tag.indexOf('messagebar-attachments') >= 0 || tag === 'F7MessagebarAttachments' || tag === 'f7-messagebar-attachments')) {
            messagebarAttachmentsEl = child;
          } else if (tag && (tag.indexOf('messagebar-sheet') >= 0 || tag === 'F7MessagebarSheet' || tag === 'f7-messagebar-sheet')) {
            messagebarSheetEl = child;
          } else {
            innerEndEls.push(child);
          }
        });
      }

      const valueProps = {};
      if ('value' in self.props) valueProps.value = value;
      return _h('div', {
        ref: 'el',
        style: style,
        class: self.classes,
        attrs: {
          id: id
        }
      }, [slotsBeforeInner, _h('div', {
        class: 'toolbar-inner'
      }, [slotsInnerStart, _h('div', {
        class: 'messagebar-area'
      }, [slotsBeforeArea, messagebarAttachmentsEl, _h(F7Input, __vueComponentTransformJSXProps(Object.assign({
        ref: 'area'
      }, valueProps, {
        on: {
          input: self.onInput,
          change: self.onChange,
          focus: self.onFocus,
          blur: self.onBlur
        },
        attrs: {
          type: 'textarea',
          wrap: false,
          placeholder: placeholder,
          disabled: disabled,
          name: name,
          readonly: readonly,
          resizable: resizable
        }
      }))), slotsAfterArea]), (sendLink && sendLink.length > 0 || slotsSendLink) && _h(F7Link, {
        on: {
          click: self.onClick
        }
      }, [slotsSendLink || sendLink]), slotsInnerEnd, innerEndEls]), slotsAfterInner, messagebarSheetEl]);
    },

    computed: {
      classes() {
        const self = this;
        const props = self.props;
        const {
          className,
          attachmentsVisible,
          sheetVisible
        } = props;
        return Utils.classNames(className, 'toolbar', 'messagebar', {
          'messagebar-attachments-visible': attachmentsVisible,
          'messagebar-sheet-visible': sheetVisible
        }, Mixins.colorClasses(props));
      },

      props() {
        return __vueComponentProps(this);
      }

    },
    watch: {
      'props.sheetVisible': function watchSheetVisible() {
        const self = this;
        if (!self.props.resizable || !self.f7Messagebar) return;
        self.updateSheetVisible = true;
      },
      'props.attachmentsVisible': function watchAttachmentsVisible() {
        const self = this;
        if (!self.props.resizable || !self.f7Messagebar) return;
        self.updateAttachmentsVisible = true;
      }
    },

    mounted() {
      const self = this;
      const {
        init,
        top,
        resizePage,
        bottomOffset,
        topOffset,
        maxHeight
      } = self.props;
      if (!init) return;
      const el = self.$refs.el;
      if (!el) return;
      const params = Utils.noUndefinedProps({
        el,
        top,
        resizePage,
        bottomOffset,
        topOffset,
        maxHeight,
        on: {
          attachmentDelete: self.onAttachmentDelete,
          attachmentClick: self.onAttachmentClick,
          resizePage: self.onResizePage
        }
      });
      self.$f7ready(() => {
        self.f7Messagebar = self.$f7.messagebar.create(params);
      });
    },

    updated() {
      const self = this;
      if (!self.f7Messagebar) return;
      const {
        sheetVisible,
        attachmentsVisible
      } = self.props;

      if (self.updateSheetVisible) {
        self.updateSheetVisible = false;
        self.f7Messagebar.sheetVisible = sheetVisible;
        self.f7Messagebar.resizePage();
      }

      if (self.updateAttachmentsVisible) {
        self.updateAttachmentsVisible = false;
        self.f7Messagebar.attachmentsVisible = attachmentsVisible;
        self.f7Messagebar.resizePage();
      }
    },

    beforeDestroy() {
      const self = this;
      if (self.f7Messagebar && self.f7Messagebar.destroy) self.f7Messagebar.destroy();
    },

    methods: {
      clear(...args) {
        if (!this.f7Messagebar) return undefined;
        return this.f7Messagebar.clear(...args);
      },

      getValue(...args) {
        if (!this.f7Messagebar) return undefined;
        return this.f7Messagebar.getValue(...args);
      },

      setValue(...args) {
        if (!this.f7Messagebar) return undefined;
        return this.f7Messagebar.setValue(...args);
      },

      setPlaceholder(...args) {
        if (!this.f7Messagebar) return undefined;
        return this.f7Messagebar.setPlaceholder(...args);
      },

      resize(...args) {
        if (!this.f7Messagebar) return undefined;
        return this.f7Messagebar.resizePage(...args);
      },

      focus(...args) {
        if (!this.f7Messagebar) return undefined;
        return this.f7Messagebar.focus(...args);
      },

      blur(...args) {
        if (!this.f7Messagebar) return undefined;
        return this.f7Messagebar.blur(...args);
      },

      attachmentsShow(...args) {
        if (!this.f7Messagebar) return undefined;
        return this.f7Messagebar.attachmentsShow(...args);
      },

      attachmentsHide(...args) {
        if (!this.f7Messagebar) return undefined;
        return this.f7Messagebar.attachmentsHide(...args);
      },

      attachmentsToggle(...args) {
        if (!this.f7Messagebar) return undefined;
        return this.f7Messagebar.attachmentsToggle(...args);
      },

      sheetShow(...args) {
        if (!this.f7Messagebar) return undefined;
        return this.f7Messagebar.sheetShow(...args);
      },

      sheetHide(...args) {
        if (!this.f7Messagebar) return undefined;
        return this.f7Messagebar.sheetHide(...args);
      },

      sheetToggle(...args) {
        if (!this.f7Messagebar) return undefined;
        return this.f7Messagebar.sheetToggle(...args);
      },

      onChange(event) {
        this.dispatchEvent('change', event);
      },

      onInput(event) {
        this.dispatchEvent('input', event);
      },

      onFocus(event) {
        this.dispatchEvent('focus', event);
      },

      onBlur(event) {
        this.dispatchEvent('blur', event);
      },

      onClick(event) {
        const self = this;
        let value;
        {
          value = self.$refs.area.$refs.inputEl.value;
        }
        const clear = self.f7Messagebar ? () => {
          self.f7Messagebar.clear();
        } : () => {};
        this.dispatchEvent('submit', value, clear);
        this.dispatchEvent('send', value, clear);
        this.dispatchEvent('click', event);
      },

      onAttachmentDelete(instance, attachmentEl, attachmentElIndex) {
        this.dispatchEvent('messagebar:attachmentdelete messagebarAttachmentDelete', instance, attachmentEl, attachmentElIndex);
      },

      onAttachmentClick(instance, attachmentEl, attachmentElIndex) {
        this.dispatchEvent('messagebar:attachmentclick messagebarAttachmentClick', instance, attachmentEl, attachmentElIndex);
      },

      onResizePage(instance) {
        this.dispatchEvent('messagebar:resizepage messagebarResizePage', instance);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    }
  });

  ({
    name: 'f7-messages-title',
    props: Object.assign({
      id: [String, Number]
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        className,
        id,
        style
      } = props;
      const classes = Utils.classNames(className, 'messages-title', Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-messages',
    props: Object.assign({
      id: [String, Number],
      autoLayout: {
        type: Boolean,
        default: false
      },
      messages: {
        type: Array,

        default() {
          return [];
        }

      },
      newMessagesFirst: {
        type: Boolean,
        default: false
      },
      scrollMessages: {
        type: Boolean,
        default: true
      },
      scrollMessagesOnEdge: {
        type: Boolean,
        default: true
      },
      firstMessageRule: Function,
      lastMessageRule: Function,
      tailMessageRule: Function,
      sameNameMessageRule: Function,
      sameHeaderMessageRule: Function,
      sameFooterMessageRule: Function,
      sameAvatarMessageRule: Function,
      customClassMessageRule: Function,
      renderMessage: Function,
      init: {
        type: Boolean,
        default: true
      }
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        id,
        style,
        className
      } = props;
      const classes = Utils.classNames(className, 'messages', Mixins.colorClasses(props));
      return _h('div', {
        ref: 'el',
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    beforeUpdate() {
      const self = this;
      if (!self.props.init) return;
      const el = self.$refs.el;
      if (!el) return;
      const children = el.children;
      if (!children) return;

      for (let i = 0; i < children.length; i += 1) {
        children[i].classList.add('message-appeared');
      }
    },

    updated() {
      const self = this;
      const {
        init,
        autoLayout,
        scrollMessages
      } = self.props;
      if (!init) return;
      const el = self.$refs.el;
      if (!el) return;
      const children = el.children;
      if (!children) return;

      for (let i = 0; i < children.length; i += 1) {
        if (!children[i].classList.contains('message-appeared')) {
          children[i].classList.add('message-appear-from-bottom');
        }
      }

      if (self.f7Messages && self.f7Messages.layout && autoLayout) {
        self.f7Messages.layout();
      }

      if (self.f7Messages && self.f7Messages.scroll && scrollMessages) {
        self.f7Messages.scroll();
      }
    },

    mounted() {
      const self = this;
      const {
        init,
        autoLayout,
        messages,
        newMessagesFirst,
        scrollMessages,
        scrollMessagesOnEdge,
        firstMessageRule,
        lastMessageRule,
        tailMessageRule,
        sameNameMessageRule,
        sameHeaderMessageRule,
        sameFooterMessageRule,
        sameAvatarMessageRule,
        customClassMessageRule,
        renderMessage
      } = self.props;
      if (!init) return;
      self.$f7ready(f7 => {
        self.f7Messages = f7.messages.create(Utils.noUndefinedProps({
          el: self.$refs.el,
          autoLayout,
          messages,
          newMessagesFirst,
          scrollMessages,
          scrollMessagesOnEdge,
          firstMessageRule,
          lastMessageRule,
          tailMessageRule,
          sameNameMessageRule,
          sameHeaderMessageRule,
          sameFooterMessageRule,
          sameAvatarMessageRule,
          customClassMessageRule,
          renderMessage
        }));
      });
    },

    beforeDestroy() {
      if (this.f7Messages && this.f7Messages.destroy) this.f7Messages.destroy();
    },

    methods: {
      renderMessages(messagesToRender, method) {
        if (!this.f7Messages) return undefined;
        return this.f7Messages.renderMessages(messagesToRender, method);
      },

      layout() {
        if (!this.f7Messages) return undefined;
        return this.f7Messages.layout();
      },

      scroll(duration, scrollTop) {
        if (!this.f7Messages) return undefined;
        return this.f7Messages.scroll(duration, scrollTop);
      },

      clear() {
        if (!this.f7Messages) return undefined;
        return this.f7Messages.clear();
      },

      removeMessage(messageToRemove, layout) {
        if (!this.f7Messages) return undefined;
        return this.f7Messages.removeMessage(messageToRemove, layout);
      },

      removeMessages(messagesToRemove, layout) {
        if (!this.f7Messages) return undefined;
        return this.f7Messages.removeMessages(messagesToRemove, layout);
      },

      addMessage(...args) {
        if (!this.f7Messages) return undefined;
        return this.f7Messages.addMessage(...args);
      },

      addMessages(...args) {
        if (!this.f7Messages) return undefined;
        return this.f7Messages.addMessages(...args);
      },

      showTyping(message) {
        if (!this.f7Messages) return undefined;
        return this.f7Messages.showTyping(message);
      },

      hideTyping() {
        if (!this.f7Messages) return undefined;
        return this.f7Messages.hideTyping();
      },

      destroy() {
        if (!this.f7Messages) return undefined;
        return this.f7Messages.destroy();
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  var F7NavLeft = {
    name: 'f7-nav-left',
    props: Object.assign({
      id: [String, Number],
      backLink: [Boolean, String],
      backLinkUrl: String,
      backLinkForce: Boolean,
      backLinkShowText: {
        type: Boolean,
        default: undefined
      },
      sliding: Boolean
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        backLink,
        backLinkUrl,
        backLinkForce,
        backLinkShowText,
        sliding,
        className,
        style,
        id
      } = props;
      let linkEl;
      let needBackLinkText = backLinkShowText;
      if (typeof needBackLinkText === 'undefined') needBackLinkText = !this.$theme.md;

      if (backLink) {
        const text = backLink !== true && needBackLinkText ? backLink : undefined;
        linkEl = _h(F7Link, {
          class: !text ? 'icon-only' : undefined,
          on: {
            click: this.onBackClick
          },
          attrs: {
            href: backLinkUrl || '#',
            back: true,
            icon: 'icon-back',
            force: backLinkForce || undefined,
            text: text
          }
        });
      }

      const classes = Utils.classNames(className, 'left', {
        sliding
      }, Mixins.colorClasses(props));
      const children = [];
      const slots = this.$slots;

      if (slots && Object.keys(slots).length) {
        Object.keys(slots).forEach(key => {
          children.push(...slots[key]);
        });
      }

      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [linkEl, children]);
    },

    created() {
      Utils.bindMethods(this, ['onBackClick']);
    },

    methods: {
      onBackClick(event) {
        this.dispatchEvent('back-click backClick click:back clickBack', event);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  };

  var F7NavRight = {
    name: 'f7-nav-right',
    props: Object.assign({
      id: [String, Number],
      sliding: Boolean
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        className,
        id,
        style,
        sliding
      } = props;
      const classes = Utils.classNames(className, 'right', {
        sliding
      }, Mixins.colorClasses(props));
      const children = [];
      const slots = this.$slots;

      if (slots && Object.keys(slots).length) {
        Object.keys(slots).forEach(key => {
          children.push(...slots[key]);
        });
      }

      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [children]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  };

  ({
    name: 'f7-nav-title',
    props: Object.assign({
      id: [String, Number]
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        id,
        style,
        className
      } = props;
      const classes = Utils.classNames(className, 'title-large', Mixins.colorClasses(props));
      const children = [];
      const slots = self.$slots;

      if (slots && Object.keys(slots).length) {
        Object.keys(slots).forEach(key => {
          children.push(...slots[key]);
        });
      }

      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [_h('div', {
        class: 'title-large-text'
      }, [children])]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  var F7NavTitle = {
    name: 'f7-nav-title',
    props: Object.assign({
      id: [String, Number],
      title: String,
      subtitle: String,
      sliding: Boolean
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        title,
        subtitle,
        id,
        style,
        sliding,
        className
      } = props;
      let subtitleEl;

      if (subtitle) {
        subtitleEl = _h('span', {
          class: 'subtitle'
        }, [subtitle]);
      }

      const classes = Utils.classNames(className, 'title', {
        sliding
      }, Mixins.colorClasses(props));
      let children;
      const slots = self.$slots;

      if (slots && Object.keys(slots).length) {
        children = [];
        Object.keys(slots).forEach(key => {
          children.push(...slots[key]);
        });
      }

      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [children, !children && title, !children && subtitleEl]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  };

  ({
    name: 'f7-navbar',
    props: Object.assign({
      id: [String, Number],
      backLink: [Boolean, String],
      backLinkUrl: String,
      backLinkForce: Boolean,
      backLinkShowText: {
        type: Boolean,
        default: undefined
      },
      sliding: {
        type: Boolean,
        default: true
      },
      title: String,
      subtitle: String,
      hidden: Boolean,
      noShadow: Boolean,
      noHairline: Boolean,
      innerClass: String,
      innerClassName: String,
      large: Boolean,
      largeTransparent: Boolean,
      transparent: Boolean,
      titleLarge: String
    }, Mixins.colorProps),

    data() {
      const props = __vueComponentProps(this);

      const state = (() => {
        const self = this;
        const $f7 = self.$f7;

        if (!$f7) {
          self.$f7ready(() => {
            self.setState({
              _theme: self.$theme
            });
          });
        }

        return {
          _theme: $f7 ? self.$theme : null,
          routerPositionClass: '',
          largeCollapsed: false,
          routerNavbarRole: null,
          routerNavbarRoleDetailRoot: false,
          routerNavbarMasterStack: false,
          transparentVisible: false
        };
      })();

      return {
        state
      };
    },

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        backLink,
        backLinkUrl,
        backLinkForce,
        backLinkShowText,
        sliding,
        title,
        subtitle,
        innerClass,
        innerClassName,
        className,
        id,
        style,
        hidden,
        noShadow,
        noHairline,
        large,
        largeTransparent,
        transparent,
        titleLarge
      } = props;
      const {
        _theme: theme,
        routerPositionClass,
        largeCollapsed,
        transparentVisible
      } = self.state;
      let leftEl;
      let titleEl;
      let rightEl;
      let titleLargeEl;
      const addLeftTitleClass = theme && theme.ios && self.$f7 && !self.$f7.params.navbar.iosCenterTitle;
      const addCenterTitleClass = theme && theme.md && self.$f7 && self.$f7.params.navbar.mdCenterTitle || theme && theme.aurora && self.$f7 && self.$f7.params.navbar.auroraCenterTitle;
      const slots = self.$slots;
      const isLarge = large || largeTransparent;
      const isTransparent = transparent || isLarge && largeTransparent;
      const isTransparentVisible = isTransparent && transparentVisible;
      const classes = Utils.classNames(className, 'navbar', routerPositionClass && routerPositionClass, {
        'navbar-hidden': hidden,
        'navbar-large': isLarge,
        'navbar-large-collapsed': isLarge && largeCollapsed,
        'navbar-transparent': isTransparent,
        'navbar-transparent-visible': isTransparentVisible,
        'navbar-master': this.state.routerNavbarRole === 'master',
        'navbar-master-detail': this.state.routerNavbarRole === 'detail',
        'navbar-master-detail-root': this.state.routerNavbarRoleDetailRoot === true,
        'navbar-master-stacked': this.state.routerNavbarMasterStack === true,
        'no-shadow': noShadow,
        'no-hairline': noHairline
      }, Mixins.colorClasses(props));

      if (backLink || slots['nav-left'] || slots.left) {
        leftEl = _h(F7NavLeft, {
          on: {
            backClick: self.onBackClick
          },
          attrs: {
            backLink: backLink,
            backLinkUrl: backLinkUrl,
            backLinkForce: backLinkForce,
            backLinkShowText: backLinkShowText
          }
        }, [slots['nav-left'], slots.left]);
      }

      if (title || subtitle || slots.title) {
        titleEl = _h(F7NavTitle, {
          attrs: {
            title: title,
            subtitle: subtitle
          }
        }, [slots.title]);
      }

      if (slots['nav-right'] || slots.right) {
        rightEl = _h(F7NavRight, [slots['nav-right'], slots.right]);
      }

      let largeTitle = titleLarge;
      if (!largeTitle && large && title) largeTitle = title;

      if (largeTitle || slots['title-large']) {
        titleLargeEl = _h('div', {
          class: 'title-large'
        }, [_h('div', {
          class: 'title-large-text'
        }, [largeTitle || '', this.$slots['title-large']])]);
      }

      const innerEl = _h('div', {
        class: Utils.classNames('navbar-inner', innerClass, innerClassName, {
          sliding,
          'navbar-inner-left-title': addLeftTitleClass,
          'navbar-inner-centered-title': addCenterTitleClass
        })
      }, [leftEl, titleEl, rightEl, titleLargeEl, this.$slots['default']]);

      return _h('div', {
        ref: 'el',
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [_h('div', {
        class: 'navbar-bg'
      }), this.$slots['before-inner'], innerEl, this.$slots['after-inner']]);
    },

    created() {
      Utils.bindMethods(this, ['onBackClick', 'onHide', 'onShow', 'onExpand', 'onCollapse', 'onNavbarPosition', 'onNavbarRole', 'onNavbarMasterStack', 'onNavbarMasterUnstack', 'onTransparentHide', 'onTransparentShow']);
    },

    mounted() {
      const self = this;
      const {
        el
      } = self.$refs;
      if (!el) return;
      self.$f7ready(f7 => {
        self.eventTargetEl = el;
        f7.on('navbarShow', self.onShow);
        f7.on('navbarHide', self.onHide);
        f7.on('navbarCollapse', self.onCollapse);
        f7.on('navbarExpand', self.onExpand);
        f7.on('navbarPosition', self.onNavbarPosition);
        f7.on('navbarRole', self.onNavbarRole);
        f7.on('navbarMasterStack', self.onNavbarMasterStack);
        f7.on('navbarMasterUnstack', self.onNavbarMasterUnstack);
        f7.on('navbarTransparentShow', self.onNavbarTransparentShow);
        f7.on('navbarTransparentHide', self.onNavbarTransparentHide);
      });
    },

    updated() {
      const self = this;
      if (!self.$f7) return;
      const el = self.$refs.el;
      self.$f7.navbar.size(el);
    },

    beforeDestroy() {
      const self = this;
      const {
        el
      } = self.$refs;
      if (!el || !self.$f7) return;
      const f7 = self.$f7;
      f7.off('navbarShow', self.onShow);
      f7.off('navbarHide', self.onHide);
      f7.off('navbarCollapse', self.onCollapse);
      f7.off('navbarExpand', self.onExpand);
      f7.off('navbarPosition', self.onNavbarPosition);
      f7.off('navbarRole', self.onNavbarRole);
      f7.off('navbarMasterStack', self.onNavbarMasterStack);
      f7.off('navbarMasterUnstack', self.onNavbarMasterUnstack);
      f7.off('navbarTransparentShow', self.onNavbarTransparentShow);
      f7.off('navbarTransparentHide', self.onNavbarTransparentHide);
      self.eventTargetEl = null;
      delete self.eventTargetEl;
    },

    methods: {
      onHide(navbarEl) {
        if (this.eventTargetEl !== navbarEl) return;
        this.dispatchEvent('navbar:hide navbarHide');
      },

      onShow(navbarEl) {
        if (this.eventTargetEl !== navbarEl) return;
        this.dispatchEvent('navbar:show navbarShow');
      },

      onExpand(navbarEl) {
        if (this.eventTargetEl !== navbarEl) return;
        this.setState({
          largeCollapsed: false
        });
        this.dispatchEvent('navbar:expand navbarExpand');
      },

      onCollapse(navbarEl) {
        if (this.eventTargetEl !== navbarEl) return;
        this.setState({
          largeCollapsed: true
        });
        this.dispatchEvent('navbar:collapse navbarCollapse');
      },

      onNavbarTransparentShow(navbarEl) {
        if (this.eventTargetEl !== navbarEl) return;
        this.setState({
          transparentVisible: true
        });
        this.dispatchEvent('navbar:transparentshow navbarTransparentShow');
      },

      onNavbarTransparentHide(navbarEl) {
        if (this.eventTargetEl !== navbarEl) return;
        this.setState({
          transparentVisible: false
        });
        this.dispatchEvent('navbar:transparenthide navbarTransparentHide');
      },

      onNavbarPosition(navbarEl, position) {
        if (this.eventTargetEl !== navbarEl) return;
        this.setState({
          routerPositionClass: position ? `navbar-${position}` : ''
        });
      },

      onNavbarRole(navbarEl, rolesData) {
        if (this.eventTargetEl !== navbarEl) return;
        this.setState({
          routerNavbarRole: rolesData.role,
          routerNavbarRoleDetailRoot: rolesData.detailRoot
        });
      },

      onNavbarMasterStack(navbarEl) {
        if (this.eventTargetEl !== navbarEl) return;
        this.setState({
          routerNavbarMasterStack: true
        });
      },

      onNavbarMasterUnstack(navbarEl) {
        if (this.eventTargetEl !== navbarEl) return;
        this.setState({
          routerNavbarMasterStack: false
        });
      },

      hide(animate) {
        const self = this;
        if (!self.$f7) return;
        self.$f7.navbar.hide(self.$refs.el, animate);
      },

      show(animate) {
        const self = this;
        if (!self.$f7) return;
        self.$f7.navbar.show(self.$refs.el, animate);
      },

      size() {
        const self = this;
        if (!self.$f7) return;
        self.$f7.navbar.size(self.$refs.el);
      },

      onBackClick(event) {
        this.dispatchEvent('back-click backClick click:back clickBack', event);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      },

      setState(updater, callback) {
        __vueComponentSetState(this, updater, callback);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  var Preloader = {
    name: 'f7-preloader',
    props: Object.assign({
      id: [String, Number],
      size: [Number, String]
    }, Mixins.colorProps),

    data() {
      const props = __vueComponentProps(this);

      const state = (() => {
        const self = this;
        const $f7 = self.$f7;

        if (!$f7) {
          self.$f7ready(() => {
            self.setState({
              _theme: self.$theme
            });
          });
        }

        return {
          _theme: $f7 ? self.$theme : null
        };
      })();

      return {
        state
      };
    },

    render() {
      const _h = this.$createElement;
      const self = this;
      const {
        sizeComputed,
        props
      } = self;
      const {
        id,
        style,
        className
      } = props;
      const theme = self.state._theme;
      const preloaderStyle = {};

      if (sizeComputed) {
        preloaderStyle.width = `${sizeComputed}px`;
        preloaderStyle.height = `${sizeComputed}px`;
        preloaderStyle['--f7-preloader-size'] = `${sizeComputed}px`;
      }

      if (style) Utils.extend(preloaderStyle, style || {});
      let innerEl;

      if (theme && theme.md) {
        innerEl = _h('span', {
          class: 'preloader-inner'
        }, [_h('span', {
          class: 'preloader-inner-gap'
        }), _h('span', {
          class: 'preloader-inner-left'
        }, [_h('span', {
          class: 'preloader-inner-half-circle'
        })]), _h('span', {
          class: 'preloader-inner-right'
        }, [_h('span', {
          class: 'preloader-inner-half-circle'
        })])]);
      } else if (theme && theme.ios) {
        innerEl = _h('span', {
          class: 'preloader-inner'
        }, [_h('span', {
          class: 'preloader-inner-line'
        }), _h('span', {
          class: 'preloader-inner-line'
        }), _h('span', {
          class: 'preloader-inner-line'
        }), _h('span', {
          class: 'preloader-inner-line'
        }), _h('span', {
          class: 'preloader-inner-line'
        }), _h('span', {
          class: 'preloader-inner-line'
        }), _h('span', {
          class: 'preloader-inner-line'
        }), _h('span', {
          class: 'preloader-inner-line'
        }), _h('span', {
          class: 'preloader-inner-line'
        }), _h('span', {
          class: 'preloader-inner-line'
        }), _h('span', {
          class: 'preloader-inner-line'
        }), _h('span', {
          class: 'preloader-inner-line'
        })]);
      } else if (theme && theme.aurora) {
        innerEl = _h('span', {
          class: 'preloader-inner'
        }, [_h('span', {
          class: 'preloader-inner-circle'
        })]);
      } else if (!theme) {
        innerEl = _h('span', {
          class: 'preloader-inner'
        });
      }

      const classes = Utils.classNames(className, 'preloader', Mixins.colorClasses(props));
      return _h('span', {
        style: preloaderStyle,
        class: classes,
        attrs: {
          id: id
        }
      }, [innerEl]);
    },

    computed: {
      sizeComputed() {
        let s = this.props.size;

        if (s && typeof s === 'string' && s.indexOf('px') >= 0) {
          s = s.replace('px', '');
        }

        return s;
      },

      props() {
        return __vueComponentProps(this);
      }

    },
    methods: {
      setState(updater, callback) {
        __vueComponentSetState(this, updater, callback);
      }

    }
  };

  var F7PageContent = {
    name: 'f7-page-content',
    props: Object.assign({
      id: [String, Number],
      tab: Boolean,
      tabActive: Boolean,
      ptr: Boolean,
      ptrDistance: Number,
      ptrPreloader: {
        type: Boolean,
        default: true
      },
      ptrBottom: Boolean,
      ptrMousewheel: Boolean,
      infinite: Boolean,
      infiniteTop: Boolean,
      infiniteDistance: Number,
      infinitePreloader: {
        type: Boolean,
        default: true
      },
      hideBarsOnScroll: Boolean,
      hideNavbarOnScroll: Boolean,
      hideToolbarOnScroll: Boolean,
      messagesContent: Boolean,
      loginScreen: Boolean
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        ptr,
        ptrPreloader,
        ptrDistance,
        ptrBottom,
        ptrMousewheel,
        infinite,
        infinitePreloader,
        id,
        style,
        infiniteDistance,
        infiniteTop
      } = props;
      let ptrEl;
      let infiniteEl;

      if (ptr && ptrPreloader) {
        ptrEl = _h('div', {
          class: 'ptr-preloader'
        }, [_h(Preloader), _h('div', {
          class: 'ptr-arrow'
        })]);
      }

      if (infinite && infinitePreloader) {
        infiniteEl = _h(Preloader, {
          class: 'infinite-scroll-preloader'
        });
      }

      return _h('div', {
        style: style,
        class: self.classes,
        ref: 'el',
        attrs: {
          id: id,
          'data-ptr-distance': ptrDistance || undefined,
          'data-ptr-mousewheel': ptrMousewheel || undefined,
          'data-infinite-distance': infiniteDistance || undefined
        }
      }, [ptrBottom ? null : ptrEl, infiniteTop ? infiniteEl : null, self.$slots.default, infiniteTop ? null : infiniteEl, ptrBottom ? ptrEl : null]);
    },

    computed: {
      classes() {
        const self = this;
        const props = self.props;
        const {
          className,
          tab,
          tabActive,
          ptr,
          ptrBottom,
          infinite,
          infiniteTop,
          hideBarsOnScroll,
          hideNavbarOnScroll,
          hideToolbarOnScroll,
          messagesContent,
          loginScreen
        } = props;
        return Utils.classNames(className, 'page-content', {
          tab,
          'tab-active': tabActive,
          'ptr-content': ptr,
          'ptr-bottom': ptrBottom,
          'infinite-scroll-content': infinite,
          'infinite-scroll-top': infiniteTop,
          'hide-bars-on-scroll': hideBarsOnScroll,
          'hide-navbar-on-scroll': hideNavbarOnScroll,
          'hide-toolbar-on-scroll': hideToolbarOnScroll,
          'messages-content': messagesContent,
          'login-screen-content': loginScreen
        }, Mixins.colorClasses(props));
      },

      props() {
        return __vueComponentProps(this);
      }

    },

    created() {
      Utils.bindMethods(this, ['onPtrPullStart', 'onPtrPullMove', 'onPtrPullEnd', 'onPtrRefresh', 'onPtrDone', 'onInfinite', 'onTabShow', 'onTabHide']);
    },

    mounted() {
      const self = this;
      const el = self.$refs.el;
      const {
        ptr,
        infinite,
        tab
      } = self.props;
      self.$f7ready(f7 => {
        self.eventTargetEl = el;

        if (ptr) {
          f7.on('ptrPullStart', self.onPtrPullStart);
          f7.on('ptrPullMove', self.onPtrPullMove);
          f7.on('ptrPullEnd', self.onPtrPullEnd);
          f7.on('ptrRefresh', self.onPtrRefresh);
          f7.on('ptrDone', self.onPtrDone);
        }

        if (infinite) {
          f7.on('infinite', self.onInfinite);
        }

        if (tab) {
          f7.on('tabShow', self.onTabShow);
          f7.on('tabHide', self.onTabHide);
        }
      });
    },

    beforeDestroy() {
      const self = this;
      if (!self.$f7) return;
      self.$f7.off('ptrPullStart', self.onPtrPullStart);
      self.$f7.off('ptrPullMove', self.onPtrPullMove);
      self.$f7.off('ptrPullEnd', self.onPtrPullEnd);
      self.$f7.off('ptrRefresh', self.onPtrRefresh);
      self.$f7.off('ptrDone', self.onPtrDone);
      self.$f7.off('infinite', self.onInfinite);
      self.$f7.off('tabShow', self.onTabShow);
      self.$f7.off('tabHide', self.onTabHide);
      self.eventTargetEl = null;
      delete self.eventTargetEl;
    },

    methods: {
      onPtrPullStart(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('ptr:pullstart ptrPullStart');
      },

      onPtrPullMove(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('ptr:pullmove ptrPullMove');
      },

      onPtrPullEnd(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('ptr:pullend ptrPullEnd');
      },

      onPtrRefresh(el, done) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('ptr:refresh ptrRefresh', done);
      },

      onPtrDone(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('ptr:done ptrDone');
      },

      onInfinite(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('infinite');
      },

      onTabShow(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('tab:show tabShow', el);
      },

      onTabHide(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('tab:hide tabHide', el);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    }
  };

  ({
    name: 'f7-page',
    props: Object.assign({
      id: [String, Number],
      name: String,
      stacked: Boolean,
      withSubnavbar: {
        type: Boolean,
        default: undefined
      },
      subnavbar: {
        type: Boolean,
        default: undefined
      },
      withNavbarLarge: {
        type: Boolean,
        default: undefined
      },
      navbarLarge: {
        type: Boolean,
        default: undefined
      },
      noNavbar: Boolean,
      noToolbar: Boolean,
      tabs: Boolean,
      pageContent: {
        type: Boolean,
        default: true
      },
      noSwipeback: Boolean,
      ptr: Boolean,
      ptrDistance: Number,
      ptrPreloader: {
        type: Boolean,
        default: true
      },
      ptrBottom: Boolean,
      ptrMousewheel: Boolean,
      infinite: Boolean,
      infiniteTop: Boolean,
      infiniteDistance: Number,
      infinitePreloader: {
        type: Boolean,
        default: true
      },
      hideBarsOnScroll: Boolean,
      hideNavbarOnScroll: Boolean,
      hideToolbarOnScroll: Boolean,
      messagesContent: Boolean,
      loginScreen: Boolean
    }, Mixins.colorProps),

    data() {
      const props = __vueComponentProps(this);

      const state = (() => {
        return {
          hasSubnavbar: false,
          hasNavbarLarge: false,
          hasNavbarLargeCollapsed: false,
          hasCardExpandableOpened: false,
          routerPositionClass: '',
          routerForceUnstack: false,
          routerPageRole: null,
          routerPageRoleDetailRoot: false,
          routerPageMasterStack: false
        };
      })();

      return {
        state
      };
    },

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        id,
        style,
        name,
        pageContent,
        messagesContent,
        ptr,
        ptrDistance,
        ptrPreloader,
        ptrBottom,
        ptrMousewheel,
        infinite,
        infiniteDistance,
        infinitePreloader,
        infiniteTop,
        hideBarsOnScroll,
        hideNavbarOnScroll,
        hideToolbarOnScroll,
        loginScreen,
        className,
        stacked,
        tabs,
        subnavbar,
        withSubnavbar,
        navbarLarge,
        withNavbarLarge,
        noNavbar,
        noToolbar,
        noSwipeback
      } = props;
      const fixedList = [];
      const staticList = [];
      const {
        static: slotsStatic,
        fixed: slotsFixed,
        default: slotsDefault
      } = self.$slots;
      let fixedTags;
      fixedTags = 'navbar toolbar tabbar subnavbar searchbar messagebar fab list-index'.split(' ');
      let hasSubnavbar;
      let hasMessages;
      let hasNavbarLarge;
      hasMessages = self.$options.propsData.messagesContent;

      if (slotsDefault) {
        slotsDefault.forEach(child => {
          if (typeof child === 'undefined') return;
          let isFixedTag = false;
          {
            const tag = child.tag;

            if (!tag) {
              if (pageContent) staticList.push(child);
              return;
            }

            if (tag.indexOf('subnavbar') >= 0) hasSubnavbar = true;

            if (tag.indexOf('navbar') >= 0) {
              if (child.componentOptions && child.componentOptions.propsData && 'large' in child.componentOptions.propsData && (child.componentOptions.propsData.large || child.componentOptions.propsData.large === '')) {
                hasNavbarLarge = true;
              }
            }

            if (typeof hasMessages === 'undefined' && tag.indexOf('messages') >= 0) hasMessages = true;

            for (let j = 0; j < fixedTags.length; j += 1) {
              if (tag.indexOf(fixedTags[j]) >= 0) {
                isFixedTag = true;
              }
            }
          }

          if (pageContent) {
            if (isFixedTag) fixedList.push(child);else staticList.push(child);
          }
        });
      }

      const forceSubnavbar = typeof subnavbar === 'undefined' && typeof withSubnavbar === 'undefined' ? hasSubnavbar || this.state.hasSubnavbar : false;
      const forceNavbarLarge = typeof navbarLarge === 'undefined' && typeof withNavbarLarge === 'undefined' ? hasNavbarLarge || this.state.hasNavbarLarge : false;
      const classes = Utils.classNames(className, 'page', this.state.routerPositionClass, {
        stacked: stacked && !this.state.routerForceUnstack,
        tabs,
        'page-with-subnavbar': subnavbar || withSubnavbar || forceSubnavbar,
        'page-with-navbar-large': navbarLarge || withNavbarLarge || forceNavbarLarge,
        'no-navbar': noNavbar,
        'no-toolbar': noToolbar,
        'no-swipeback': noSwipeback,
        'page-master': this.state.routerPageRole === 'master',
        'page-master-detail': this.state.routerPageRole === 'detail',
        'page-master-detail-root': this.state.routerPageRoleDetailRoot === true,
        'page-master-stacked': this.state.routerPageMasterStack === true,
        'page-with-navbar-large-collapsed': this.state.hasNavbarLargeCollapsed === true,
        'page-with-card-opened': this.state.hasCardExpandableOpened === true,
        'login-screen-page': loginScreen
      }, Mixins.colorClasses(props));

      if (!pageContent) {
        return _h('div', {
          ref: 'el',
          style: style,
          class: classes,
          attrs: {
            id: id,
            'data-name': name
          }
        }, [slotsFixed, slotsStatic, slotsDefault]);
      }

      const pageContentEl = _h(F7PageContent, {
        on: {
          ptrPullStart: self.onPtrPullStart,
          ptrPullMove: self.onPtrPullMove,
          ptrPullEnd: self.onPtrPullEnd,
          ptrRefresh: self.onPtrRefresh,
          ptrDone: self.onPtrDone,
          infinite: self.onInfinite
        },
        attrs: {
          ptr: ptr,
          ptrDistance: ptrDistance,
          ptrPreloader: ptrPreloader,
          ptrBottom: ptrBottom,
          ptrMousewheel: ptrMousewheel,
          infinite: infinite,
          infiniteTop: infiniteTop,
          infiniteDistance: infiniteDistance,
          infinitePreloader: infinitePreloader,
          hideBarsOnScroll: hideBarsOnScroll,
          hideNavbarOnScroll: hideNavbarOnScroll,
          hideToolbarOnScroll: hideToolbarOnScroll,
          messagesContent: messagesContent || hasMessages,
          loginScreen: loginScreen
        }
      }, [slotsStatic, staticList]);

      return _h('div', {
        ref: 'el',
        style: style,
        class: classes,
        attrs: {
          id: id,
          'data-name': name
        }
      }, [fixedList, slotsFixed, pageContentEl]);
    },

    created() {
      Utils.bindMethods(this, ['onPtrPullStart', 'onPtrPullMove', 'onPtrPullEnd', 'onPtrRefresh', 'onPtrDone', 'onInfinite', 'onPageMounted', 'onPageInit', 'onPageReinit', 'onPageBeforeIn', 'onPageBeforeOut', 'onPageAfterOut', 'onPageAfterIn', 'onPageBeforeRemove', 'onPageBeforeUnmount', 'onPageStack', 'onPageUnstack', 'onPagePosition', 'onPageRole', 'onPageMasterStack', 'onPageMasterUnstack', 'onPageNavbarLargeCollapsed', 'onPageNavbarLargeExpanded', 'onCardOpened', 'onCardClose', 'onPageTabShow', 'onPageTabHide']);
    },

    mounted() {
      const self = this;
      const el = self.$refs.el;
      self.$f7ready(f7 => {
        self.eventTargetEl = el;
        f7.on('pageMounted', self.onPageMounted);
        f7.on('pageInit', self.onPageInit);
        f7.on('pageReinit', self.onPageReinit);
        f7.on('pageBeforeIn', self.onPageBeforeIn);
        f7.on('pageBeforeOut', self.onPageBeforeOut);
        f7.on('pageAfterOut', self.onPageAfterOut);
        f7.on('pageAfterIn', self.onPageAfterIn);
        f7.on('pageBeforeRemove', self.onPageBeforeRemove);
        f7.on('pageBeforeUnmount', self.onPageBeforeUnmount);
        f7.on('pageStack', self.onPageStack);
        f7.on('pageUnstack', self.onPageUnstack);
        f7.on('pagePosition', self.onPagePosition);
        f7.on('pageRole', self.onPageRole);
        f7.on('pageMasterStack', self.onPageMasterStack);
        f7.on('pageMasterUnstack', self.onPageMasterUnstack);
        f7.on('pageNavbarLargeCollapsed', self.onPageNavbarLargeCollapsed);
        f7.on('pageNavbarLargeExpanded', self.onPageNavbarLargeExpanded);
        f7.on('cardOpened', self.onCardOpened);
        f7.on('cardClose', self.onCardClose);
        f7.on('pageTabShow', self.onPageTabShow);
        f7.on('pageTabHide', self.onPageTabHide);
      });
    },

    beforeDestroy() {
      const self = this;
      if (!self.$f7) return;
      const f7 = self.$f7;
      f7.off('pageMounted', self.onPageMounted);
      f7.off('pageInit', self.onPageInit);
      f7.off('pageReinit', self.onPageReinit);
      f7.off('pageBeforeIn', self.onPageBeforeIn);
      f7.off('pageBeforeOut', self.onPageBeforeOut);
      f7.off('pageAfterOut', self.onPageAfterOut);
      f7.off('pageAfterIn', self.onPageAfterIn);
      f7.off('pageBeforeRemove', self.onPageBeforeRemove);
      f7.off('pageBeforeUnmount', self.onPageBeforeUnmount);
      f7.off('pageStack', self.onPageStack);
      f7.off('pageUnstack', self.onPageUnstack);
      f7.off('pagePosition', self.onPagePosition);
      f7.off('pageRole', self.onPageRole);
      f7.off('pageMasterStack', self.onPageMasterStack);
      f7.off('pageMasterUnstack', self.onPageMasterUnstack);
      f7.off('pageNavbarLargeCollapsed', self.onPageNavbarLargeCollapsed);
      f7.off('pageNavbarLargeExpanded', self.onPageNavbarLargeExpanded);
      f7.off('cardOpened', self.onCardOpened);
      f7.off('cardClose', self.onCardClose);
      f7.off('pageTabShow', self.onPageTabShow);
      f7.off('pageTabHide', self.onPageTabHide);
      self.eventTargetEl = null;
      delete self.eventTargetEl;
    },

    methods: {
      onPtrPullStart(...args) {
        this.dispatchEvent('ptr:pullstart ptrPullStart', ...args);
      },

      onPtrPullMove(...args) {
        this.dispatchEvent('ptr:pullmove ptrPullMove', ...args);
      },

      onPtrPullEnd(...args) {
        this.dispatchEvent('ptr:pullend ptrPullEnd', ...args);
      },

      onPtrRefresh(...args) {
        this.dispatchEvent('ptr:refresh ptrRefresh', ...args);
      },

      onPtrDone(...args) {
        this.dispatchEvent('ptr:done ptrDone', ...args);
      },

      onInfinite(...args) {
        this.dispatchEvent('infinite', ...args);
      },

      onPageMounted(page) {
        if (this.eventTargetEl !== page.el) return;
        this.dispatchEvent('page:mounted pageMounted', page);
      },

      onPageInit(page) {
        if (this.eventTargetEl !== page.el) return;
        const {
          withSubnavbar,
          subnavbar,
          withNavbarLarge,
          navbarLarge
        } = this.props;

        if (typeof withSubnavbar === 'undefined' && typeof subnavbar === 'undefined') {
          if (page.$navbarEl && page.$navbarEl.length && page.$navbarEl.find('.subnavbar').length || page.$el.children('.navbar').find('.subnavbar').length) {
            this.setState({
              hasSubnavbar: true
            });
          }
        }

        if (typeof withNavbarLarge === 'undefined' && typeof navbarLarge === 'undefined') {
          if (page.$navbarEl && page.$navbarEl.hasClass('navbar-large')) {
            this.setState({
              hasNavbarLarge: true
            });
          }
        }

        this.dispatchEvent('page:init pageInit', page);
      },

      onPageReinit(page) {
        if (this.eventTargetEl !== page.el) return;
        this.dispatchEvent('page:reinit pageReinit', page);
      },

      onPageBeforeIn(page) {
        if (this.eventTargetEl !== page.el) return;

        if (!page.swipeBack) {
          if (page.from === 'next') {
            this.setState({
              routerPositionClass: 'page-next'
            });
          }

          if (page.from === 'previous') {
            this.setState({
              routerPositionClass: 'page-previous'
            });
          }
        }

        this.dispatchEvent('page:beforein pageBeforeIn', page);
      },

      onPageBeforeOut(page) {
        if (this.eventTargetEl !== page.el) return;
        this.dispatchEvent('page:beforeout pageBeforeOut', page);
      },

      onPageAfterOut(page) {
        if (this.eventTargetEl !== page.el) return;

        if (page.to === 'next') {
          this.setState({
            routerPositionClass: 'page-next'
          });
        }

        if (page.to === 'previous') {
          this.setState({
            routerPositionClass: 'page-previous'
          });
        }

        this.dispatchEvent('page:afterout pageAfterOut', page);
      },

      onPageAfterIn(page) {
        if (this.eventTargetEl !== page.el) return;
        this.setState({
          routerPositionClass: 'page-current'
        });
        this.dispatchEvent('page:afterin pageAfterIn', page);
      },

      onPageBeforeRemove(page) {
        if (this.eventTargetEl !== page.el) return;
        this.dispatchEvent('page:beforeremove pageBeforeRemove', page);
      },

      onPageBeforeUnmount(page) {
        if (this.eventTargetEl !== page.el) return;
        this.dispatchEvent('page:beforeunmount pageBeforeUnmount', page);
      },

      onPageStack(pageEl) {
        if (this.eventTargetEl !== pageEl) return;
        this.setState({
          routerForceUnstack: false
        });
      },

      onPageUnstack(pageEl) {
        if (this.eventTargetEl !== pageEl) return;
        this.setState({
          routerForceUnstack: true
        });
      },

      onPagePosition(pageEl, position) {
        if (this.eventTargetEl !== pageEl) return;
        this.setState({
          routerPositionClass: `page-${position}`
        });
      },

      onPageRole(pageEl, rolesData) {
        if (this.eventTargetEl !== pageEl) return;
        this.setState({
          routerPageRole: rolesData.role,
          routerPageRoleDetailRoot: rolesData.detailRoot
        });
      },

      onPageMasterStack(pageEl) {
        if (this.eventTargetEl !== pageEl) return;
        this.setState({
          routerPageMasterStack: true
        });
      },

      onPageMasterUnstack(pageEl) {
        if (this.eventTargetEl !== pageEl) return;
        this.setState({
          routerPageMasterStack: false
        });
      },

      onPageNavbarLargeCollapsed(pageEl) {
        if (this.eventTargetEl !== pageEl) return;
        this.setState({
          hasNavbarLargeCollapsed: true
        });
      },

      onPageNavbarLargeExpanded(pageEl) {
        if (this.eventTargetEl !== pageEl) return;
        this.setState({
          hasNavbarLargeCollapsed: false
        });
      },

      onCardOpened(cardEl, pageEl) {
        if (this.eventTargetEl !== pageEl) return;
        this.setState({
          hasCardExpandableOpened: true
        });
      },

      onCardClose(cardEl, pageEl) {
        if (this.eventTargetEl !== pageEl) return;
        this.setState({
          hasCardExpandableOpened: false
        });
      },

      onPageTabShow(pageEl) {
        if (this.eventTargetEl !== pageEl) return;
        this.dispatchEvent('page:tabshow pageTabShow');
      },

      onPageTabHide(pageEl) {
        if (this.eventTargetEl !== pageEl) return;
        this.dispatchEvent('page:tabhide pageTabHide');
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      },

      setState(updater, callback) {
        __vueComponentSetState(this, updater, callback);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-panel',
    props: Object.assign({
      id: [String, Number],
      side: String,
      effect: String,
      cover: Boolean,
      reveal: Boolean,
      left: Boolean,
      right: Boolean,
      opened: Boolean,
      resizable: Boolean,
      backdrop: {
        type: Boolean,
        default: true
      },
      backdropEl: {
        type: String,
        default: undefined
      },
      visibleBreakpoint: {
        type: Number,
        default: undefined
      },
      collapsedBreakpoint: {
        type: Number,
        default: undefined
      },
      swipe: Boolean,
      swipeNoFollow: Boolean,
      swipeOnlyClose: Boolean,
      swipeActiveArea: {
        type: Number,
        default: 0
      },
      swipeThreshold: {
        type: Number,
        default: 0
      }
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        id,
        style,
        resizable
      } = props;
      return _h('div', {
        ref: 'el',
        style: style,
        class: this.classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default'], resizable && _h('div', {
        class: 'panel-resize-handler'
      })]);
    },

    computed: {
      classes() {
        const self = this;
        const props = self.props;
        const {
          left,
          reveal,
          className,
          resizable
        } = props;
        let {
          side,
          effect
        } = props;
        side = side || (left ? 'left' : 'right');
        effect = effect || (reveal ? 'reveal' : 'cover');
        return Utils.classNames(className, 'panel', {
          'panel-resizable': resizable,
          [`panel-${side}`]: side,
          [`panel-${effect}`]: effect
        }, Mixins.colorClasses(props));
      },

      props() {
        return __vueComponentProps(this);
      }

    },
    watch: {
      'props.resizable': function watchResizable(resizable) {
        const self = this;
        if (!self.f7Panel) return;
        if (resizable) self.f7Panel.enableResizable();else self.f7Panel.disableResizable();
      },
      'props.opened': function watchOpened(opened) {
        const self = this;
        if (!self.f7Panel) return;

        if (opened) {
          self.f7Panel.open();
        } else {
          self.f7Panel.close();
        }
      }
    },

    created() {
      Utils.bindMethods(this, ['onOpen', 'onOpened', 'onClose', 'onClosed', 'onBackdropClick', 'onSwipe', 'onSwipeOpen', 'onBreakpoint', 'onCollapsedBreakpoint', 'onResize']);
    },

    mounted() {
      const self = this;
      const el = self.$refs.el;
      const {
        opened,
        resizable,
        backdrop,
        backdropEl,
        visibleBreakpoint,
        collapsedBreakpoint,
        swipe,
        swipeNoFollow,
        swipeOnlyClose,
        swipeActiveArea,
        swipeThreshold
      } = self.props;
      self.$f7ready(() => {
        const $ = self.$$;
        if (!$) return;

        if ($('.panel-backdrop').length === 0) {
          $('<div class="panel-backdrop"></div>').insertBefore(el);
        }

        const params = Utils.noUndefinedProps({
          el,
          resizable,
          backdrop,
          backdropEl,
          visibleBreakpoint,
          collapsedBreakpoint,
          swipe,
          swipeNoFollow,
          swipeOnlyClose,
          swipeActiveArea,
          swipeThreshold,
          on: {
            open: self.onOpen,
            opened: self.onOpened,
            close: self.onClose,
            closed: self.onClosed,
            backdropClick: self.onBackdropClick,
            swipe: self.onSwipe,
            swipeOpen: self.onSwipeOpen,
            collapsedBreakpoint: self.onCollapsedBreakpoint,
            breakpoint: self.onBreakpoint,
            resize: self.onResize
          }
        });
        self.f7Panel = self.$f7.panel.create(params);

        if (opened) {
          self.f7Panel.open(false);
        }
      });
    },

    beforeDestroy() {
      const self = this;

      if (self.f7Panel && self.f7Panel.destroy) {
        self.f7Panel.destroy();
      }
    },

    methods: {
      onOpen(event) {
        this.dispatchEvent('panel:open panelOpen', event);
      },

      onOpened(event) {
        this.dispatchEvent('panel:opened panelOpened', event);
      },

      onClose(event) {
        this.dispatchEvent('panel:close panelClose', event);
      },

      onClosed(event) {
        this.dispatchEvent('panel:closed panelClosed', event);
      },

      onBackdropClick(event) {
        this.dispatchEvent('panel:backdrop-click panelBackdropClick', event);
      },

      onSwipe(event) {
        this.dispatchEvent('panel:swipe panelSwipe', event);
      },

      onSwipeOpen(event) {
        this.dispatchEvent('panel:swipeopen panelSwipeOpen', event);
      },

      onBreakpoint(event) {
        this.dispatchEvent('panel:breakpoint panelBreakpoint', event);
      },

      onCollapsedBreakpoint(event) {
        this.dispatchEvent('panel:collapsedbreakpoint panelCollapsedBreakpoint', event);
      },

      onResize(...args) {
        this.dispatchEvent('panel:resize panelResize', ...args);
      },

      open(animate) {
        const self = this;
        if (!self.f7Panel) return;
        self.f7Panel.open(animate);
      },

      close(animate) {
        const self = this;
        if (!self.f7Panel) return;
        self.f7Panel.close(animate);
      },

      toggle(animate) {
        const self = this;
        if (!self.f7Panel) return;
        self.f7Panel.toggle(animate);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    }
  });

  ({
    name: 'f7-popover',
    props: Object.assign({
      id: [String, Number],
      opened: Boolean,
      target: [String, Object],
      backdrop: Boolean,
      backdropEl: [String, Object],
      closeByBackdropClick: Boolean,
      closeByOutsideClick: Boolean,
      closeOnEscape: Boolean
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        className,
        id,
        style
      } = props;
      const classes = Utils.classNames(className, 'popover', Mixins.colorClasses(props));
      return _h('div', {
        ref: 'el',
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [_h('div', {
        class: 'popover-angle'
      }), _h('div', {
        class: 'popover-inner'
      }, [this.$slots['default']])]);
    },

    watch: {
      'props.opened': function watchOpened(opened) {
        const self = this;
        if (!self.f7Popover) return;

        if (opened) {
          self.f7Popover.open();
        } else {
          self.f7Popover.close();
        }
      }
    },

    created() {
      Utils.bindMethods(this, ['onOpen', 'onOpened', 'onClose', 'onClosed']);
    },

    mounted() {
      const self = this;
      const el = self.$refs.el;
      if (!el) return;
      const props = self.props;
      const {
        target,
        opened,
        backdrop,
        backdropEl,
        closeByBackdropClick,
        closeByOutsideClick,
        closeOnEscape
      } = props;
      const popoverParams = {
        el,
        on: {
          open: self.onOpen,
          opened: self.onOpened,
          close: self.onClose,
          closed: self.onClosed
        }
      };
      if (target) popoverParams.targetEl = target;
      {
        const propsData = self.$options.propsData;
        if (typeof propsData.closeByBackdropClick !== 'undefined') popoverParams.closeByBackdropClick = closeByBackdropClick;
        if (typeof propsData.closeByOutsideClick !== 'undefined') popoverParams.closeByOutsideClick = closeByOutsideClick;
        if (typeof propsData.closeOnEscape !== 'undefined') popoverParams.closeOnEscape = closeOnEscape;
        if (typeof propsData.backdrop !== 'undefined') popoverParams.backdrop = backdrop;
        if (typeof propsData.backdropEl !== 'undefined') popoverParams.backdropEl = backdropEl;
      }
      self.$f7ready(() => {
        self.f7Popover = self.$f7.popover.create(popoverParams);

        if (opened && target) {
          self.f7Popover.open(target, false);
        }
      });
    },

    beforeDestroy() {
      const self = this;
      if (self.f7Popover) self.f7Popover.destroy();
    },

    methods: {
      onOpen(instance) {
        this.dispatchEvent('popover:open popoverOpen', instance);
      },

      onOpened(instance) {
        this.dispatchEvent('popover:opened popoverOpened', instance);
      },

      onClose(instance) {
        this.dispatchEvent('popover:close popoverClose', instance);
      },

      onClosed(instance) {
        this.dispatchEvent('popover:closed popoverClosed', instance);
      },

      open(animate) {
        const self = this;
        if (!self.f7Popover) return undefined;
        return self.f7Popover.open(animate);
      },

      close(animate) {
        const self = this;
        if (!self.f7Popover) return undefined;
        return self.f7Popover.close(animate);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-popup',
    props: Object.assign({
      id: [String, Number],
      tabletFullscreen: Boolean,
      opened: Boolean,
      animate: Boolean,
      backdrop: Boolean,
      backdropEl: [String, Object],
      closeByBackdropClick: Boolean,
      closeOnEscape: Boolean,
      swipeToClose: {
        type: [Boolean, String],
        default: false
      },
      swipeHandler: [String, Object],
      push: Boolean
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        className,
        id,
        style,
        tabletFullscreen,
        push
      } = props;
      const classes = Utils.classNames(className, 'popup', {
        'popup-tablet-fullscreen': tabletFullscreen,
        'popup-push': push
      }, Mixins.colorClasses(props));
      return _h('div', {
        ref: 'el',
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    watch: {
      'props.opened': function watchOpened(opened) {
        const self = this;
        if (!self.f7Popup) return;

        if (opened) {
          self.f7Popup.open();
        } else {
          self.f7Popup.close();
        }
      }
    },

    created() {
      Utils.bindMethods(this, ['onOpen', 'onOpened', 'onClose', 'onClosed', 'onSwipeStart', 'onSwipeMove', 'onSwipeEnd', 'onSwipeClose']);
    },

    mounted() {
      const self = this;
      const el = self.$refs.el;
      if (!el) return;
      const props = self.props;
      const {
        closeByBackdropClick,
        backdrop,
        backdropEl,
        animate,
        closeOnEscape,
        swipeToClose,
        swipeHandler
      } = props;
      const popupParams = {
        el,
        on: {
          swipeStart: self.onSwipeStart,
          swipeMove: self.onSwipeMove,
          swipeEnd: self.onSwipeEnd,
          swipeClose: self.onSwipeClose,
          open: self.onOpen,
          opened: self.onOpened,
          close: self.onClose,
          closed: self.onClosed
        }
      };
      {
        const propsData = self.$options.propsData;
        if (typeof propsData.closeByBackdropClick !== 'undefined') popupParams.closeByBackdropClick = closeByBackdropClick;
        if (typeof propsData.closeOnEscape !== 'undefined') popupParams.closeOnEscape = closeOnEscape;
        if (typeof propsData.animate !== 'undefined') popupParams.animate = animate;
        if (typeof propsData.backdrop !== 'undefined') popupParams.backdrop = backdrop;
        if (typeof propsData.backdropEl !== 'undefined') popupParams.backdropEl = backdropEl;
        if (typeof propsData.swipeToClose !== 'undefined') popupParams.swipeToClose = swipeToClose;
        if (typeof propsData.swipeHandler !== 'undefined') popupParams.swipeHandler = swipeHandler;
      }
      self.$f7ready(() => {
        self.f7Popup = self.$f7.popup.create(popupParams);

        if (self.props.opened) {
          self.f7Popup.open(false);
        }
      });
    },

    beforeDestroy() {
      const self = this;
      if (self.f7Popup) self.f7Popup.destroy();
    },

    methods: {
      onSwipeStart(instance) {
        this.dispatchEvent('popup:swipestart popupSwipeStart', instance);
      },

      onSwipeMove(instance) {
        this.dispatchEvent('popup:swipemove popupSwipeMove', instance);
      },

      onSwipeEnd(instance) {
        this.dispatchEvent('popup:swipeend popupSwipeEnd', instance);
      },

      onSwipeClose(instance) {
        this.dispatchEvent('popup:swipeclose popupSwipeClose', instance);
      },

      onOpen(instance) {
        this.dispatchEvent('popup:open popupOpen', instance);
      },

      onOpened(instance) {
        this.dispatchEvent('popup:opened popupOpened', instance);
      },

      onClose(instance) {
        this.dispatchEvent('popup:close popupClose', instance);
      },

      onClosed(instance) {
        this.dispatchEvent('popup:closed popupClosed', instance);
      },

      open(animate) {
        const self = this;
        if (!self.f7Popup) return undefined;
        return self.f7Popup.open(animate);
      },

      close(animate) {
        const self = this;
        if (!self.f7Popup) return undefined;
        return self.f7Popup.close(animate);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-progressbar',
    props: Object.assign({
      id: [String, Number],
      progress: Number,
      infinite: Boolean
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        progress,
        id,
        style,
        infinite,
        className
      } = props;
      const transformStyle = {
        transform: progress ? `translate3d(${-100 + progress}%, 0, 0)` : '',
        WebkitTransform: progress ? `translate3d(${-100 + progress}%, 0, 0)` : ''
      };
      const classes = Utils.classNames(className, 'progressbar', {
        'progressbar-infinite': infinite
      }, Mixins.colorClasses(props));
      return _h('span', {
        ref: 'el',
        style: style,
        class: classes,
        attrs: {
          id: id,
          'data-progress': progress
        }
      }, [_h('span', {
        style: transformStyle
      })]);
    },

    methods: {
      set(progress, speed) {
        const self = this;
        if (!self.$f7) return;
        self.$f7.progressbar.set(self.$refs.el, progress, speed);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-radio',
    props: Object.assign({
      id: [String, Number],
      checked: Boolean,
      name: [Number, String],
      value: [Number, String, Boolean],
      disabled: Boolean,
      readonly: Boolean,
      defaultChecked: Boolean
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        name,
        value,
        disabled,
        readonly,
        checked,
        defaultChecked,
        id,
        style,
        className
      } = props;
      let inputEl;
      {
        inputEl = _h('input', {
          ref: 'inputEl',
          domProps: {
            value,
            disabled,
            readonly,
            checked
          },
          on: {
            change: self.onChange
          },
          attrs: {
            type: 'radio',
            name: name
          }
        });
      }

      const iconEl = _h('i', {
        class: 'icon-radio'
      });

      const classes = Utils.classNames(className, 'radio', {
        disabled
      }, Mixins.colorClasses(props));
      return _h('label', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [inputEl, iconEl, this.$slots['default']]);
    },

    created() {
      Utils.bindMethods(this, ['onChange']);
    },

    methods: {
      onChange(event) {
        this.dispatchEvent('change', event);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-row',
    props: Object.assign({
      id: [String, Number],
      noGap: Boolean,
      tag: {
        type: String,
        default: 'div'
      },
      resizable: Boolean,
      resizableFixed: Boolean,
      resizableAbsolute: Boolean,
      resizableHandler: {
        type: Boolean,
        default: true
      }
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        className,
        id,
        style,
        tag,
        noGap,
        resizable,
        resizableFixed,
        resizableAbsolute,
        resizableHandler
      } = props;
      const RowTag = tag;
      const classes = Utils.classNames(className, 'row', {
        'no-gap': noGap,
        resizable,
        'resizable-fixed': resizableFixed,
        'resizable-absolute': resizableAbsolute
      }, Mixins.colorClasses(props));
      return _h(RowTag, {
        style: style,
        class: classes,
        ref: 'el',
        attrs: {
          id: id
        }
      }, [this.$slots['default'], resizable && resizableHandler && _h('span', {
        class: 'resize-handler'
      })]);
    },

    created() {
      Utils.bindMethods(this, ['onClick', 'onResize']);
    },

    mounted() {
      const self = this;
      self.eventTargetEl = self.$refs.el;
      self.eventTargetEl.addEventListener('click', self.onClick);
      self.$f7ready(f7 => {
        f7.on('gridResize', self.onResize);
      });
    },

    beforeDestroy() {
      const self = this;
      const el = self.$refs.el;
      if (!el || !self.$f7) return;
      el.removeEventListener('click', self.onClick);
      self.$f7.off('gridResize', self.onResize);
      delete self.eventTargetEl;
    },

    methods: {
      onClick(event) {
        this.dispatchEvent('click', event);
      },

      onResize(el) {
        if (el === this.eventTargetEl) {
          this.dispatchEvent('grid:resize gridResize');
        }
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-searchbar',
    props: Object.assign({
      id: [String, Number],
      noShadow: Boolean,
      noHairline: Boolean,
      form: {
        type: Boolean,
        default: true
      },
      placeholder: {
        type: String,
        default: 'Search'
      },
      spellcheck: {
        type: Boolean,
        default: undefined
      },
      disableButton: {
        type: Boolean,
        default: true
      },
      disableButtonText: {
        type: String,
        default: 'Cancel'
      },
      clearButton: {
        type: Boolean,
        default: true
      },
      value: [String, Number, Array],
      inputEvents: {
        type: String,
        default: 'change input compositionend'
      },
      expandable: Boolean,
      inline: Boolean,
      searchContainer: [String, Object],
      searchIn: {
        type: String,
        default: '.item-title'
      },
      searchItem: {
        type: String,
        default: 'li'
      },
      searchGroup: {
        type: String,
        default: '.list-group'
      },
      searchGroupTitle: {
        type: String,
        default: '.item-divider, .list-group-title'
      },
      foundEl: {
        type: [String, Object],
        default: '.searchbar-found'
      },
      notFoundEl: {
        type: [String, Object],
        default: '.searchbar-not-found'
      },
      backdrop: {
        type: Boolean,
        default: undefined
      },
      backdropEl: [String, Object],
      hideOnEnableEl: {
        type: [String, Object],
        default: '.searchbar-hide-on-enable'
      },
      hideOnSearchEl: {
        type: [String, Object],
        default: '.searchbar-hide-on-search'
      },
      ignore: {
        type: String,
        default: '.searchbar-ignore'
      },
      customSearch: {
        type: Boolean,
        default: false
      },
      removeDiacritics: {
        type: Boolean,
        default: false
      },
      hideDividers: {
        type: Boolean,
        default: true
      },
      hideGroups: {
        type: Boolean,
        default: true
      },
      init: {
        type: Boolean,
        default: true
      }
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      let clearEl;
      let disableEl;
      const props = self.props;
      const {
        placeholder,
        spellcheck,
        clearButton,
        disableButton,
        disableButtonText,
        form,
        noShadow,
        noHairline,
        expandable,
        className,
        style,
        id,
        value,
        inline
      } = props;

      if (clearButton) {
        clearEl = _h('span', {
          ref: 'clearEl',
          class: 'input-clear-button'
        });
      }

      if (disableButton) {
        disableEl = _h('span', {
          ref: 'disableEl',
          class: 'searchbar-disable-button'
        }, [disableButtonText]);
      }

      const SearchbarTag = form ? 'form' : 'div';
      const classes = Utils.classNames(className, 'searchbar', {
        'searchbar-inline': inline,
        'no-shadow': noShadow,
        'no-hairline': noHairline,
        'searchbar-expandable': expandable
      }, Mixins.colorClasses(props));
      let inputEl;
      {
        inputEl = _h('input', {
          ref: 'inputEl',
          domProps: {
            value
          },
          on: {
            input: self.onInput,
            change: self.onChange,
            focus: self.onFocus,
            blur: self.onBlur
          },
          attrs: {
            placeholder: placeholder,
            type: 'search',
            spellcheck: spellcheck
          }
        });
      }
      return _h(SearchbarTag, {
        ref: 'el',
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['before-inner'], _h('div', {
        class: 'searchbar-inner'
      }, [this.$slots['inner-start'], _h('div', {
        class: 'searchbar-input-wrap'
      }, [this.$slots['input-wrap-start'], inputEl, _h('i', {
        class: 'searchbar-icon'
      }), clearEl, this.$slots['input-wrap-end']]), disableEl, this.$slots['inner-end'], this.$slots['default']]), this.$slots['after-inner']]);
    },

    created() {
      Utils.bindMethods(this, ['onSubmit', 'onClearButtonClick', 'onDisableButtonClick', 'onInput', 'onChange', 'onFocus', 'onBlur']);
    },

    mounted() {
      const self = this;
      const {
        init,
        inputEvents,
        searchContainer,
        searchIn,
        searchItem,
        searchGroup,
        searchGroupTitle,
        hideOnEnableEl,
        hideOnSearchEl,
        foundEl,
        notFoundEl,
        backdrop,
        backdropEl,
        disableButton,
        ignore,
        customSearch,
        removeDiacritics,
        hideDividers,
        hideGroups,
        form,
        expandable,
        inline
      } = self.props;
      const {
        el,
        clearEl,
        disableEl
      } = self.$refs;

      if (form && el) {
        el.addEventListener('submit', self.onSubmit, false);
      }

      if (clearEl) {
        clearEl.addEventListener('click', self.onClearButtonClick);
      }

      if (disableEl) {
        disableEl.addEventListener('click', self.onDisableButtonClick);
      }

      if (!init) return;
      self.$f7ready(() => {
        const params = Utils.noUndefinedProps({
          el: self.$refs.el,
          inputEvents,
          searchContainer,
          searchIn,
          searchItem,
          searchGroup,
          searchGroupTitle,
          hideOnEnableEl,
          hideOnSearchEl,
          foundEl,
          notFoundEl,
          backdrop,
          backdropEl,
          disableButton,
          ignore,
          customSearch,
          removeDiacritics,
          hideDividers,
          hideGroups,
          expandable,
          inline,
          on: {
            search(searchbar, query, previousQuery) {
              self.dispatchEvent('searchbar:search searchbarSearch', searchbar, query, previousQuery);
            },

            clear(searchbar, previousQuery) {
              self.dispatchEvent('searchbar:clear searchbarClear', searchbar, previousQuery);
            },

            enable(searchbar) {
              self.dispatchEvent('searchbar:enable searchbarEnable', searchbar);
            },

            disable(searchbar) {
              self.dispatchEvent('searchbar:disable searchbarDisable', searchbar);
            }

          }
        });
        Object.keys(params).forEach(key => {
          if (params[key] === '') {
            delete params[key];
          }
        });
        self.f7Searchbar = self.$f7.searchbar.create(params);
      });
    },

    beforeDestroy() {
      const self = this;
      const {
        el,
        clearEl,
        disableEl
      } = self.$refs;

      if (self.props.form && el) {
        el.removeEventListener('submit', self.onSubmit, false);
      }

      if (clearEl) {
        clearEl.removeEventListener('click', self.onClearButtonClick);
      }

      if (disableEl) {
        disableEl.removeEventListener('click', self.onDisableButtonClick);
      }

      if (self.f7Searchbar && self.f7Searchbar.destroy) self.f7Searchbar.destroy();
    },

    methods: {
      search(query) {
        if (!this.f7Searchbar) return undefined;
        return this.f7Searchbar.search(query);
      },

      enable() {
        if (!this.f7Searchbar) return undefined;
        return this.f7Searchbar.enable();
      },

      disable() {
        if (!this.f7Searchbar) return undefined;
        return this.f7Searchbar.disable();
      },

      toggle() {
        if (!this.f7Searchbar) return undefined;
        return this.f7Searchbar.toggle();
      },

      clear() {
        if (!this.f7Searchbar) return undefined;
        return this.f7Searchbar.clear();
      },

      onChange(event) {
        this.dispatchEvent('change', event);
      },

      onInput(event) {
        this.dispatchEvent('input', event);
      },

      onFocus(event) {
        this.dispatchEvent('focus', event);
      },

      onBlur(event) {
        this.dispatchEvent('blur', event);
      },

      onSubmit(event) {
        this.dispatchEvent('submit', event);
      },

      onClearButtonClick(event) {
        this.dispatchEvent('click:clear clickClear', event);
      },

      onDisableButtonClick(event) {
        this.dispatchEvent('click:disable clickDisable', event);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-segmented',
    props: Object.assign({
      id: [String, Number],
      raised: Boolean,
      raisedIos: Boolean,
      raisedMd: Boolean,
      raisedAurora: Boolean,
      round: Boolean,
      roundIos: Boolean,
      roundMd: Boolean,
      roundAurora: Boolean,
      strong: Boolean,
      strongIos: Boolean,
      strongMd: Boolean,
      strongAurora: Boolean,
      tag: {
        type: String,
        default: 'div'
      }
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        className,
        raised,
        raisedIos,
        raisedAurora,
        raisedMd,
        round,
        roundIos,
        roundAurora,
        roundMd,
        strong,
        strongIos,
        strongMd,
        strongAurora,
        id,
        style,
        tag
      } = props;
      const classNames = Utils.classNames(className, {
        segmented: true,
        'segmented-raised': raised,
        'segmented-raised-ios': raisedIos,
        'segmented-raised-aurora': raisedAurora,
        'segmented-raised-md': raisedMd,
        'segmented-round': round,
        'segmented-round-ios': roundIos,
        'segmented-round-aurora': roundAurora,
        'segmented-round-md': roundMd,
        'segmented-strong': strong,
        'segmented-strong-ios': strongIos,
        'segmented-strong-md': strongMd,
        'segmented-strong-aurora': strongAurora
      }, Mixins.colorClasses(props));
      const SegmentedTag = tag;
      return _h(SegmentedTag, {
        style: style,
        class: classNames,
        attrs: {
          id: id
        }
      }, [this.$slots['default'], (strong || strongIos || strongMd || strongAurora) && _h('span', {
        class: 'segmented-highlight'
      })]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-sheet',
    props: Object.assign({
      id: [String, Number],
      opened: Boolean,
      top: Boolean,
      bottom: Boolean,
      position: String,
      backdrop: Boolean,
      backdropEl: [String, Object],
      closeByBackdropClick: Boolean,
      closeByOutsideClick: Boolean,
      closeOnEscape: Boolean,
      push: Boolean,
      swipeToClose: Boolean,
      swipeToStep: Boolean,
      swipeHandler: [String, Object]
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const fixedList = [];
      const staticList = [];
      const props = self.props;
      const {
        id,
        style,
        className,
        top,
        bottom,
        position,
        push
      } = props;
      let fixedTags;
      fixedTags = 'navbar toolbar tabbar subnavbar searchbar messagebar fab list-index'.split(' ');
      const slotsDefault = self.$slots.default;

      if (slotsDefault && slotsDefault.length) {
        slotsDefault.forEach(child => {
          if (typeof child === 'undefined') return;
          let isFixedTag = false;
          {
            const tag = child.tag;

            if (!tag) {
              return;
            }

            for (let j = 0; j < fixedTags.length; j += 1) {
              if (tag.indexOf(fixedTags[j]) >= 0) {
                isFixedTag = true;
              }
            }
          }
          if (isFixedTag) fixedList.push(child);else staticList.push(child);
        });
      }

      const innerEl = _h('div', {
        class: 'sheet-modal-inner'
      }, [staticList]);

      let positionComputed = 'bottom';
      if (position) positionComputed = position;else if (top) positionComputed = 'top';else if (bottom) positionComputed = 'bottom';
      const classes = Utils.classNames(className, 'sheet-modal', `sheet-modal-${positionComputed}`, {
        'sheet-modal-push': push
      }, Mixins.colorClasses(props));
      return _h('div', {
        ref: 'el',
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [fixedList, innerEl]);
    },

    watch: {
      'props.opened': function watchOpened(opened) {
        const self = this;
        if (!self.f7Sheet) return;

        if (opened) {
          self.f7Sheet.open();
        } else {
          self.f7Sheet.close();
        }
      }
    },

    created() {
      Utils.bindMethods(this, ['onOpen', 'onOpened', 'onClose', 'onClosed', 'onStepOpen', 'onStepClose', 'onStepProgress']);
    },

    mounted() {
      const self = this;
      const el = self.$refs.el;
      if (!el) return;
      const props = self.props;
      const {
        opened,
        backdrop,
        backdropEl,
        closeByBackdropClick,
        closeByOutsideClick,
        closeOnEscape,
        swipeToClose,
        swipeToStep,
        swipeHandler
      } = props;
      const sheetParams = {
        el: self.$refs.el,
        on: {
          open: self.onOpen,
          opened: self.onOpened,
          close: self.onClose,
          closed: self.onClosed,
          stepOpen: self.onStepOpen,
          stepClose: self.onStepClose,
          stepProgress: self.onStepProgress
        }
      };
      {
        const propsData = self.$options.propsData;
        if (typeof propsData.backdrop !== 'undefined') sheetParams.backdrop = backdrop;
        if (typeof propsData.backdropEl !== 'undefined') sheetParams.backdropEl = backdropEl;
        if (typeof propsData.closeByBackdropClick !== 'undefined') sheetParams.closeByBackdropClick = closeByBackdropClick;
        if (typeof propsData.closeByOutsideClick !== 'undefined') sheetParams.closeByOutsideClick = closeByOutsideClick;
        if (typeof propsData.closeOnEscape !== 'undefined') sheetParams.closeOnEscape = closeOnEscape;
        if (typeof propsData.swipeToClose !== 'undefined') sheetParams.swipeToClose = swipeToClose;
        if (typeof propsData.swipeToStep !== 'undefined') sheetParams.swipeToStep = swipeToStep;
        if (typeof propsData.swipeHandler !== 'undefined') sheetParams.swipeHandler = swipeHandler;
      }
      self.$f7ready(() => {
        self.f7Sheet = self.$f7.sheet.create(sheetParams);

        if (opened) {
          self.f7Sheet.open(false);
        }
      });
    },

    beforeDestroy() {
      const self = this;
      if (self.f7Sheet) self.f7Sheet.destroy();
    },

    methods: {
      onStepProgress(instance, progress) {
        this.dispatchEvent('sheet:stepprogress sheetStepProgress', instance, progress);
      },

      onStepOpen(instance) {
        this.dispatchEvent('sheet:stepopen sheetStepOpen', instance);
      },

      onStepClose(instance) {
        this.dispatchEvent('sheet:stepclose sheetStepClose', instance);
      },

      onOpen(instance) {
        this.dispatchEvent('sheet:open sheetOpen', instance);
      },

      onOpened(instance) {
        this.dispatchEvent('sheet:opened sheetOpened', instance);
      },

      onClose(instance) {
        this.dispatchEvent('sheet:close sheetClose', instance);
      },

      onClosed(instance) {
        this.dispatchEvent('sheet:closed sheetClosed', instance);
      },

      open(animate) {
        const self = this;
        if (!self.f7Sheet) return undefined;
        return self.f7Sheet.open(animate);
      },

      close(animate) {
        const self = this;
        if (!self.f7Sheet) return undefined;
        return self.f7Sheet.close(animate);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-skeleton-block',
    props: Object.assign({
      id: [String, Number],
      width: [Number, String],
      height: [Number, String],
      tag: {
        type: String,
        default: 'div'
      }
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        className,
        id,
        style,
        width,
        height,
        tag
      } = props;
      const classes = Utils.classNames('skeleton-block', className, Mixins.colorClasses(props));
      let styleAttribute = style;

      if (width) {
        const widthValue = typeof width === 'number' ? `${width}px` : width;

        if (!styleAttribute) {
          styleAttribute = {
            width: widthValue
          };
        } else if (typeof styleAttribute === 'object') {
          styleAttribute = Object.assign({
            width: widthValue
          }, styleAttribute);
        } else if (typeof styleAttribute === 'string') {
          styleAttribute = `width: ${widthValue}; ${styleAttribute}`;
        }
      }

      if (height) {
        const heightValue = typeof height === 'number' ? `${height}px` : height;

        if (!styleAttribute) {
          styleAttribute = {
            height: heightValue
          };
        } else if (typeof styleAttribute === 'object') {
          styleAttribute = Object.assign({
            height: heightValue
          }, styleAttribute);
        } else if (typeof styleAttribute === 'string') {
          styleAttribute = `height: ${heightValue}; ${styleAttribute}`;
        }
      }

      const Tag = tag;
      return _h(Tag, {
        style: styleAttribute,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-skeleton-text',
    props: Object.assign({
      id: [String, Number],
      width: [Number, String],
      height: [Number, String],
      tag: {
        type: String,
        default: 'span'
      }
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        className,
        id,
        style,
        width,
        height,
        tag
      } = props;
      const classes = Utils.classNames('skeleton-text', className, Mixins.colorClasses(props));
      let styleAttribute = style;

      if (width) {
        const widthValue = typeof width === 'number' ? `${width}px` : width;

        if (!styleAttribute) {
          styleAttribute = {
            width: widthValue
          };
        } else if (typeof styleAttribute === 'object') {
          styleAttribute = Object.assign({
            width: widthValue
          }, styleAttribute);
        } else if (typeof styleAttribute === 'string') {
          styleAttribute = `width: ${widthValue}; ${styleAttribute}`;
        }
      }

      if (height) {
        const heightValue = typeof height === 'number' ? `${height}px` : height;

        if (!styleAttribute) {
          styleAttribute = {
            height: heightValue
          };
        } else if (typeof styleAttribute === 'object') {
          styleAttribute = Object.assign({
            height: heightValue
          }, styleAttribute);
        } else if (typeof styleAttribute === 'string') {
          styleAttribute = `height: ${heightValue}; ${styleAttribute}`;
        }
      }

      const Tag = tag;
      return _h(Tag, {
        style: styleAttribute,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-stepper',
    props: Object.assign({
      id: [String, Number],
      init: {
        type: Boolean,
        default: true
      },
      value: {
        type: Number,
        default: 0
      },
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 100
      },
      step: {
        type: Number,
        default: 1
      },
      formatValue: Function,
      name: String,
      inputId: String,
      input: {
        type: Boolean,
        default: true
      },
      inputType: {
        type: String,
        default: 'text'
      },
      inputReadonly: {
        type: Boolean,
        default: false
      },
      autorepeat: {
        type: Boolean,
        default: false
      },
      autorepeatDynamic: {
        type: Boolean,
        default: false
      },
      wraps: {
        type: Boolean,
        default: false
      },
      manualInputMode: {
        type: Boolean,
        default: false
      },
      decimalPoint: {
        type: Number,
        default: 4
      },
      buttonsEndInputMode: {
        type: Boolean,
        default: true
      },
      disabled: Boolean,
      buttonsOnly: Boolean,
      round: Boolean,
      roundMd: Boolean,
      roundIos: Boolean,
      roundAurora: Boolean,
      fill: Boolean,
      fillMd: Boolean,
      fillIos: Boolean,
      fillAurora: Boolean,
      large: Boolean,
      largeMd: Boolean,
      largeIos: Boolean,
      largeAurora: Boolean,
      small: Boolean,
      smallMd: Boolean,
      smallIos: Boolean,
      smallAurora: Boolean,
      raised: Boolean,
      raisedMd: Boolean,
      raisedIos: Boolean,
      raisedAurora: Boolean
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        input,
        buttonsOnly,
        inputType,
        value,
        inputReadonly,
        min,
        max,
        step,
        id,
        style,
        name,
        inputId
      } = props;
      let inputWrapEl;
      let valueEl;

      if (input && !buttonsOnly) {
        let inputEl;
        {
          inputEl = _h('input', {
            ref: 'inputEl',
            domProps: {
              readOnly: inputReadonly,
              value
            },
            on: {
              input: self.onInput,
              change: self.onChange
            },
            attrs: {
              name: name,
              id: inputId,
              type: inputType,
              min: inputType === 'number' ? min : undefined,
              max: inputType === 'number' ? max : undefined,
              step: inputType === 'number' ? step : undefined
            }
          });
        }
        inputWrapEl = _h('div', {
          class: 'stepper-input-wrap'
        }, [inputEl]);
      }

      if (!input && !buttonsOnly) {
        valueEl = _h('div', {
          class: 'stepper-value'
        }, [value]);
      }

      return _h('div', {
        ref: 'el',
        style: style,
        class: self.classes,
        attrs: {
          id: id
        }
      }, [_h('div', {
        ref: 'minusEl',
        class: 'stepper-button-minus'
      }), inputWrapEl, valueEl, _h('div', {
        ref: 'plusEl',
        class: 'stepper-button-plus'
      })]);
    },

    computed: {
      classes() {
        const self = this;
        const props = self.props;
        const {
          round,
          roundIos,
          roundMd,
          roundAurora,
          fill,
          fillIos,
          fillMd,
          fillAurora,
          large,
          largeIos,
          largeMd,
          largeAurora,
          small,
          smallIos,
          smallMd,
          smallAurora,
          raised,
          raisedMd,
          raisedIos,
          raisedAurora,
          disabled
        } = props;
        return Utils.classNames(self.props.className, 'stepper', {
          disabled,
          'stepper-round': round,
          'stepper-round-ios': roundIos,
          'stepper-round-md': roundMd,
          'stepper-round-aurora': roundAurora,
          'stepper-fill': fill,
          'stepper-fill-ios': fillIos,
          'stepper-fill-md': fillMd,
          'stepper-fill-aurora': fillAurora,
          'stepper-large': large,
          'stepper-large-ios': largeIos,
          'stepper-large-md': largeMd,
          'stepper-large-aurora': largeAurora,
          'stepper-small': small,
          'stepper-small-ios': smallIos,
          'stepper-small-md': smallMd,
          'stepper-small-aurora': smallAurora,
          'stepper-raised': raised,
          'stepper-raised-ios': raisedIos,
          'stepper-raised-md': raisedMd,
          'stepper-raised-aurora': raisedAurora
        }, Mixins.colorClasses(props));
      },

      props() {
        return __vueComponentProps(this);
      }

    },
    watch: {
      'props.value': function watchValue(newValue) {
        const self = this;
        if (!self.f7Stepper) return;
        self.f7Stepper.setValue(newValue);
      }
    },

    created() {
      Utils.bindMethods(this, ['onInput', 'onMinusClick', 'onPlusClick']);
    },

    mounted() {
      const self = this;
      const {
        minusEl,
        plusEl
      } = self.$refs;

      if (minusEl) {
        minusEl.addEventListener('click', self.onMinusClick);
      }

      if (plusEl) {
        plusEl.addEventListener('click', self.onPlusClick);
      }

      if (!self.props.init) return;
      self.$f7ready(f7 => {
        const {
          min,
          max,
          value,
          step,
          formatValue,
          autorepeat,
          autorepeatDynamic,
          wraps,
          manualInputMode,
          decimalPoint,
          buttonsEndInputMode
        } = self.props;
        const el = self.$refs.el;
        if (!el) return;
        self.f7Stepper = f7.stepper.create(Utils.noUndefinedProps({
          el,
          min,
          max,
          value,
          step,
          formatValue,
          autorepeat,
          autorepeatDynamic,
          wraps,
          manualInputMode,
          decimalPoint,
          buttonsEndInputMode,
          on: {
            change(stepper, newValue) {
              self.dispatchEvent('stepper:change stepperChange', newValue);
            }

          }
        }));
      });
    },

    beforeDestroy() {
      const self = this;
      const {
        minusEl,
        plusEl
      } = self.$refs;

      if (minusEl) {
        minusEl.removeEventListener('click', self.onMinusClick);
      }

      if (plusEl) {
        plusEl.removeEventListener('click', self.onPlusClick);
      }

      if (!self.props.init) return;

      if (self.f7Stepper && self.f7Stepper.destroy) {
        self.f7Stepper.destroy();
      }
    },

    methods: {
      increment() {
        if (!this.f7Stepper) return;
        this.f7Stepper.increment();
      },

      decrement() {
        if (!this.f7Stepper) return;
        this.f7Stepper.decrement();
      },

      setValue(newValue) {
        const self = this;
        if (self.f7Stepper && self.f7Stepper.setValue) self.f7Stepper.setValue(newValue);
      },

      getValue() {
        const self = this;

        if (self.f7Stepper && self.f7Stepper.getValue) {
          return self.f7Stepper.getValue();
        }

        return undefined;
      },

      onInput(event) {
        const stepper = this.f7Stepper;
        this.dispatchEvent('input', event, stepper);
      },

      onChange(event) {
        const stepper = this.f7Stepper;
        this.dispatchEvent('change', event, stepper);
      },

      onMinusClick(event) {
        const stepper = this.f7Stepper;
        this.dispatchEvent('stepper:minusclick stepperMinusClick', event, stepper);
      },

      onPlusClick(event) {
        const stepper = this.f7Stepper;
        this.dispatchEvent('stepper:plusclick stepperPlusClick', event, stepper);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    }
  });

  ({
    name: 'f7-subnavbar',
    props: Object.assign({
      id: [String, Number],
      sliding: Boolean,
      title: String,
      inner: {
        type: Boolean,
        default: true
      }
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        inner,
        title,
        style,
        id,
        className,
        sliding
      } = props;
      const classes = Utils.classNames(className, 'subnavbar', {
        sliding
      }, Mixins.colorClasses(props));
      return _h('div', {
        class: classes,
        style: style,
        attrs: {
          id: id
        }
      }, [inner ? _h('div', {
        class: 'subnavbar-inner'
      }, [title && _h('div', {
        class: 'subnavbar-title'
      }, [title]), this.$slots['default']]) : this.$slots['default']]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-swipeout-actions',
    props: Object.assign({
      id: [String, Number],
      left: Boolean,
      right: Boolean,
      side: String
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        left,
        right,
        side,
        className,
        id,
        style
      } = props;
      let sideComputed = side;

      if (!sideComputed) {
        if (left) sideComputed = 'left';
        if (right) sideComputed = 'right';
      }

      const classes = Utils.classNames(className, `swipeout-actions-${sideComputed}`, Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-swipeout-button',
    props: Object.assign({
      id: [String, Number],
      text: String,
      confirmTitle: String,
      confirmText: String,
      overswipe: Boolean,
      close: Boolean,
      delete: Boolean,
      href: String
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        className,
        id,
        style,
        overswipe,
        delete: deleteProp,
        close,
        href,
        confirmTitle,
        confirmText,
        text
      } = props;
      const classes = Utils.classNames(className, {
        'swipeout-overswipe': overswipe,
        'swipeout-delete': deleteProp,
        'swipeout-close': close
      }, Mixins.colorClasses(props));
      return _h('a', {
        ref: 'el',
        style: style,
        class: classes,
        attrs: {
          href: href || '#',
          id: id,
          'data-confirm': confirmText || undefined,
          'data-confirm-title': confirmTitle || undefined
        }
      }, [this.$slots['default'] || [text]]);
    },

    created() {
      Utils.bindMethods(this, ['onClick']);
    },

    mounted() {
      this.$refs.el.addEventListener('click', this.onClick);
    },

    beforeDestroy() {
      this.$refs.el.removeEventListener('click', this.onClick);
    },

    methods: {
      onClick(event) {
        this.dispatchEvent('click', event);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-swiper',
    props: Object.assign({
      id: [String, Number],
      params: Object,
      pagination: Boolean,
      scrollbar: Boolean,
      navigation: Boolean,
      init: {
        type: Boolean,
        default: true
      }
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        id,
        style,
        className
      } = props;
      let paginationEl;
      let scrollbarEl;
      let buttonNextEl;
      let buttonPrevEl;

      if (self.paginationComputed) {
        paginationEl = _h('div', {
          ref: 'paginationEl',
          class: 'swiper-pagination'
        });
      }

      if (self.scrollbarComputed) {
        scrollbarEl = _h('div', {
          ref: 'scrollbarEl',
          class: 'swiper-scrollbar'
        });
      }

      if (self.navigationComputed) {
        buttonNextEl = _h('div', {
          ref: 'nextEl',
          class: 'swiper-button-next'
        });
        buttonPrevEl = _h('div', {
          ref: 'prevEl',
          class: 'swiper-button-prev'
        });
      }

      const classes = Utils.classNames(className, 'swiper-container', Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        ref: 'el',
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['before-wrapper'], _h('div', {
        class: 'swiper-wrapper'
      }, [this.$slots['default']]), paginationEl, scrollbarEl, buttonPrevEl, buttonNextEl, this.$slots['after-wrapper']]);
    },

    computed: {
      paginationComputed() {
        const self = this;
        const {
          pagination,
          params
        } = self.props;

        if (pagination === true || params && params.pagination && !params.pagination.el) {
          return true;
        }

        return false;
      },

      scrollbarComputed() {
        const self = this;
        const {
          scrollbar,
          params
        } = self.props;

        if (scrollbar === true || params && params.scrollbar && !params.scrollbar.el) {
          return true;
        }

        return false;
      },

      navigationComputed() {
        const self = this;
        const {
          navigation,
          params
        } = self.props;

        if (navigation === true || params && params.navigation && !params.navigation.nextEl && !params.navigation.prevEl) {
          return true;
        }

        return false;
      },

      props() {
        return __vueComponentProps(this);
      }

    },

    updated() {
      const self = this;

      if (!self.initialUpdate) {
        self.initialUpdate = true;
        return;
      }

      if (self.swiper && self.swiper.update) self.swiper.update();
    },

    mounted() {
      const self = this;
      if (!self.props.init) return;
      self.$f7ready(f7 => {
        const newParams = {
          pagination: {},
          navigation: {},
          scrollbar: {}
        };
        const {
          params,
          pagination,
          navigation,
          scrollbar
        } = self.props;
        if (params) Utils.extend(newParams, params);
        if (pagination && !newParams.pagination.el) newParams.pagination.el = self.$refs.paginationEl;

        if (navigation && !newParams.navigation.nextEl && !newParams.navigation.prevEl) {
          newParams.navigation.nextEl = self.$refs.nextEl;
          newParams.navigation.prevEl = self.$refs.prevEl;
        }

        if (scrollbar && !newParams.scrollbar.el) newParams.scrollbar.el = self.$refs.scrollbarEl;
        self.swiper = f7.swiper.create(self.$refs.el, newParams);
      });
    },

    beforeDestroy() {
      const self = this;
      if (!self.props.init) return;
      if (self.swiper && self.swiper.destroy) self.swiper.destroy();
    }

  });

  ({
    name: 'f7-tab',
    props: Object.assign({
      id: [String, Number],
      tabActive: Boolean
    }, Mixins.colorProps),

    data() {
      const props = __vueComponentProps(this);

      const state = (() => {
        return {
          tabContent: null
        };
      })();

      return {
        state
      };
    },

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        tabActive,
        id,
        className,
        style
      } = props;
      const tabContent = self.state.tabContent;
      const classes = Utils.classNames(className, 'tab', {
        'tab-active': tabActive
      }, Mixins.colorClasses(props));
      let TabContent;
      if (tabContent) TabContent = tabContent.component;
      {
        return _h('div', {
          style: style,
          ref: 'el',
          class: classes,
          attrs: {
            id: id
          }
        }, [tabContent ? _h(TabContent, {
          key: tabContent.id,
          props: tabContent.props
        }) : this.$slots['default']]);
      }
    },

    created() {
      Utils.bindMethods(this, ['onTabShow', 'onTabHide']);
    },

    updated() {
      const self = this;
      if (!self.routerData) return;
      f7.events.emit('tabRouterDidUpdate', self.routerData);
    },

    beforeDestroy() {
      const self = this;

      if (self.$f7) {
        self.$f7.off('tabShow', self.onTabShow);
        self.$f7.off('tabHide', self.onTabHide);
      }

      if (!self.routerData) return;
      f7.routers.tabs.splice(f7.routers.tabs.indexOf(self.routerData), 1);
      self.routerData = null;
      self.eventTargetEl = null;
      delete self.routerData;
      delete self.eventTargetEl;
    },

    mounted() {
      const self = this;
      const el = self.$refs.el;
      self.setState({
        tabContent: null
      });
      self.$f7ready(() => {
        self.$f7.on('tabShow', self.onTabShow);
        self.$f7.on('tabHide', self.onTabHide);
        self.eventTargetEl = el;
        self.routerData = {
          el,
          component: self,

          setTabContent(tabContent) {
            self.setState({
              tabContent
            });
          }

        };
        f7.routers.tabs.push(self.routerData);
      });
    },

    methods: {
      show(animate) {
        if (!this.$f7) return;
        this.$f7.tab.show(this.$refs.el, animate);
      },

      onTabShow(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('tab:show tabShow', el);
      },

      onTabHide(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('tab:hide tabHide', el);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      },

      setState(updater, callback) {
        __vueComponentSetState(this, updater, callback);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-tabs',
    props: Object.assign({
      id: [String, Number],
      animated: Boolean,
      swipeable: Boolean,
      routable: Boolean,
      swiperParams: {
        type: Object,
        default: undefined
      }
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        animated,
        swipeable,
        id,
        style,
        className,
        routable
      } = props;
      const classes = Utils.classNames(className, Mixins.colorClasses(props));
      const wrapClasses = Utils.classNames({
        'tabs-animated-wrap': animated,
        'tabs-swipeable-wrap': swipeable
      });
      const tabsClasses = Utils.classNames({
        tabs: true,
        'tabs-routable': routable
      });

      if (animated || swipeable) {
        return _h('div', {
          style: style,
          class: Utils.classNames(wrapClasses, classes),
          ref: 'wrapEl',
          attrs: {
            id: id
          }
        }, [_h('div', {
          class: tabsClasses
        }, [this.$slots['default']])]);
      }

      return _h('div', {
        style: style,
        class: Utils.classNames(tabsClasses, classes),
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    mounted() {
      const self = this;
      const {
        swipeable,
        swiperParams
      } = self.props;
      if (!swipeable || !swiperParams) return;
      const wrapEl = self.$refs.wrapEl;
      if (!wrapEl) return;
      wrapEl.f7SwiperParams = swiperParams;
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-toolbar',
    props: Object.assign({
      id: [String, Number],
      tabbar: Boolean,
      labels: Boolean,
      scrollable: Boolean,
      hidden: Boolean,
      noShadow: Boolean,
      noHairline: Boolean,
      noBorder: Boolean,
      position: {
        type: String,
        default: undefined
      },
      topMd: {
        type: Boolean,
        default: undefined
      },
      topIos: {
        type: Boolean,
        default: undefined
      },
      topAurora: {
        type: Boolean,
        default: undefined
      },
      top: {
        type: Boolean,
        default: undefined
      },
      bottomMd: {
        type: Boolean,
        default: undefined
      },
      bottomIos: {
        type: Boolean,
        default: undefined
      },
      bottomAurora: {
        type: Boolean,
        default: undefined
      },
      bottom: {
        type: Boolean,
        default: undefined
      },
      inner: {
        type: Boolean,
        default: true
      }
    }, Mixins.colorProps),

    data() {
      const props = __vueComponentProps(this);

      const state = (() => {
        const self = this;
        const $f7 = self.$f7;

        if (!$f7) {
          self.$f7ready(() => {
            self.setState({
              _theme: self.$theme
            });
          });
        }

        return {
          _theme: $f7 ? self.$theme : null
        };
      })();

      return {
        state
      };
    },

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        id,
        style,
        className,
        inner,
        tabbar,
        labels,
        scrollable,
        hidden,
        noShadow,
        noHairline,
        noBorder,
        topMd,
        topIos,
        topAurora,
        top,
        bottomMd,
        bottomIos,
        bottomAurora,
        bottom,
        position
      } = props;
      const theme = self.state._theme;
      const classes = Utils.classNames(className, 'toolbar', {
        tabbar,
        'toolbar-bottom': theme && theme.md && bottomMd || theme && theme.ios && bottomIos || theme && theme.aurora && bottomAurora || bottom || position === 'bottom',
        'toolbar-top': theme && theme.md && topMd || theme && theme.ios && topIos || theme && theme.aurora && topAurora || top || position === 'top',
        'tabbar-labels': labels,
        'tabbar-scrollable': scrollable,
        'toolbar-hidden': hidden,
        'no-shadow': noShadow,
        'no-hairline': noHairline || noBorder
      }, Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        ref: 'el',
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['before-inner'], inner ? _h('div', {
        class: 'toolbar-inner'
      }, [this.$slots['default']]) : this.$slots['default'], this.$slots['after-inner']]);
    },

    created() {
      Utils.bindMethods(this, ['onHide', 'onShow']);
    },

    updated() {
      const self = this;

      if (self.props.tabbar && self.$f7) {
        self.$f7.toolbar.setHighlight(self.$refs.el);
      }
    },

    mounted() {
      const self = this;
      const {
        el
      } = self.$refs;
      if (!el) return;
      self.$f7ready(f7 => {
        self.eventTargetEl = el;
        if (self.props.tabbar) f7.toolbar.setHighlight(el);
        f7.on('toolbarShow', self.onShow);
        f7.on('toolbarHide', self.onHide);
      });
    },

    beforeDestroy() {
      const self = this;
      const {
        el
      } = self.$refs;
      if (!el || !self.$f7) return;
      const f7 = self.$f7;
      f7.off('toolbarShow', self.onShow);
      f7.off('toolbarHide', self.onHide);
      self.eventTargetEl = null;
      delete self.eventTargetEl;
    },

    methods: {
      onHide(navbarEl) {
        if (this.eventTargetEl !== navbarEl) return;
        this.dispatchEvent('toolbar:hide toolbarHide');
      },

      onShow(navbarEl) {
        if (this.eventTargetEl !== navbarEl) return;
        this.dispatchEvent('toolbar:show toolbarShow');
      },

      hide(animate) {
        const self = this;
        if (!self.$f7) return;
        self.$f7.toolbar.hide(this.$refs.el, animate);
      },

      show(animate) {
        const self = this;
        if (!self.$f7) return;
        self.$f7.toolbar.show(this.$refs.el, animate);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      },

      setState(updater, callback) {
        __vueComponentSetState(this, updater, callback);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    props: Object.assign({
      id: [String, Number],
      toggle: {
        type: Boolean,
        default: undefined
      },
      itemToggle: Boolean,
      selectable: Boolean,
      selected: Boolean,
      opened: Boolean,
      label: String,
      loadChildren: Boolean,
      link: {
        type: [Boolean, String],
        default: undefined
      }
    }, Mixins.colorProps, {}, Mixins.linkActionsProps, {}, Mixins.linkRouterProps, {}, Mixins.linkIconProps),
    name: 'f7-treeview-item',

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        id,
        style,
        toggle,
        label,
        icon,
        iconMaterial,
        iconF7,
        iconMd,
        iconIos,
        iconAurora,
        iconSize,
        iconColor,
        link
      } = props;
      const slots = self.$slots;
      const hasChildren = slots.default && slots.default.length || slots.children && slots.children.length || slots['children-start'] && slots['children-start'].length;
      const needToggle = typeof toggle === 'undefined' ? hasChildren : toggle;
      let iconEl;

      if (icon || iconMaterial || iconF7 || iconMd || iconIos || iconAurora) {
        iconEl = _h(F7Icon, {
          attrs: {
            material: iconMaterial,
            f7: iconF7,
            icon: icon,
            md: iconMd,
            ios: iconIos,
            aurora: iconAurora,
            color: iconColor,
            size: iconSize
          }
        });
      }

      const TreeviewRootTag = link || link === '' ? 'a' : 'div';
      return _h('div', {
        ref: 'el',
        style: style,
        class: self.classes,
        attrs: {
          id: id
        }
      }, [_h(TreeviewRootTag, __vueComponentTransformJSXProps(Object.assign({
        ref: 'rootEl',
        class: self.itemRootClasses
      }, self.itemRootAttrs)), [this.$slots['root-start'], needToggle && _h('div', {
        class: 'treeview-toggle'
      }), _h('div', {
        class: 'treeview-item-content'
      }, [this.$slots['content-start'], iconEl, this.$slots['media'], _h('div', {
        class: 'treeview-item-label'
      }, [this.$slots['label-start'], label, this.$slots['label']]), this.$slots['content'], this.$slots['content-end']]), this.$slots['root'], this.$slots['root-end']]), hasChildren && _h('div', {
        class: 'treeview-item-children'
      }, [this.$slots['children-start'], this.$slots['default'], this.$slots['children']])]);
    },

    computed: {
      itemRootAttrs() {
        const self = this;
        const props = self.props;
        const {
          link
        } = props;
        let href = link;
        if (link === true) href = '#';
        if (link === false) href = undefined;
        return Utils.extend({
          href
        }, Mixins.linkRouterAttrs(props), Mixins.linkActionsAttrs(props));
      },

      itemRootClasses() {
        const self = this;
        const props = self.props;
        const {
          selectable,
          selected,
          itemToggle
        } = props;
        return Utils.classNames('treeview-item-root', {
          'treeview-item-selectable': selectable,
          'treeview-item-selected': selected,
          'treeview-item-toggle': itemToggle
        }, Mixins.linkRouterClasses(props), Mixins.linkActionsClasses(props));
      },

      classes() {
        const self = this;
        const props = self.props;
        const {
          className,
          opened,
          loadChildren
        } = props;
        return Utils.classNames(className, 'treeview-item', {
          'treeview-item-opened': opened,
          'treeview-load-children': loadChildren
        }, Mixins.colorClasses(props));
      },

      props() {
        return __vueComponentProps(this);
      }

    },

    created() {
      Utils.bindMethods(this, ['onClick', 'onOpen', 'onClose', 'onLoadChildren']);
    },

    mounted() {
      const self = this;
      const {
        el,
        rootEl
      } = self.$refs;
      rootEl.addEventListener('click', self.onClick);
      if (!el) return;
      self.eventTargetEl = el;
      self.$f7ready(f7 => {
        f7.on('treeviewOpen', self.onOpen);
        f7.on('treeviewClose', self.onClose);
        f7.on('treeviewLoadChildren', self.onLoadChildren);
      });
    },

    beforeDestroy() {
      const self = this;
      const {
        el,
        rootEl
      } = self.$refs;
      rootEl.removeEventListener('click', self.onClick);
      if (!el || self.$f7) return;
      self.$f7.off('treeviewOpen', self.onOpen);
      self.$f7.off('treeviewClose', self.onClose);
      self.$f7.off('treeviewLoadChildren', self.onLoadChildren);
      self.eventTargetEl = null;
      delete self.eventTargetEl;
    },

    methods: {
      onClick(event) {
        this.dispatchEvent('click', event);
      },

      onOpen(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('treeview:open treeviewOpen', el);
      },

      onClose(el) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('treeview:close treeviewClose', el);
      },

      onLoadChildren(el, done) {
        if (this.eventTargetEl !== el) return;
        this.dispatchEvent('treeview:loadchildren treeviewLoadChildren', el, done);
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      }

    }
  });

  ({
    props: Object.assign({
      id: [String, Number]
    }, Mixins.colorProps),
    name: 'f7-treeview',

    render() {
      const _h = this.$createElement;
      const props = this.props;
      const {
        className,
        id,
        style
      } = props;
      const classes = Utils.classNames(className, 'treeview', Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-view',
    props: Object.assign({
      id: [String, Number],
      tab: Boolean,
      tabActive: Boolean,
      name: String,
      router: Boolean,
      linksView: [Object, String],
      url: String,
      main: Boolean,
      stackPages: Boolean,
      xhrCache: Boolean,
      xhrCacheIgnore: Array,
      xhrCacheIgnoreGetParameters: Boolean,
      xhrCacheDuration: Number,
      preloadPreviousPage: Boolean,
      allowDuplicateUrls: Boolean,
      reloadPages: Boolean,
      reloadDetail: Boolean,
      masterDetailResizable: Boolean,
      masterDetailBreakpoint: Number,
      removeElements: Boolean,
      removeElementsWithTimeout: Boolean,
      removeElementsTimeout: Number,
      restoreScrollTopOnBack: Boolean,
      loadInitialPage: Boolean,
      iosSwipeBack: Boolean,
      iosSwipeBackAnimateShadow: Boolean,
      iosSwipeBackAnimateOpacity: Boolean,
      iosSwipeBackActiveArea: Number,
      iosSwipeBackThreshold: Number,
      mdSwipeBack: Boolean,
      mdSwipeBackAnimateShadow: Boolean,
      mdSwipeBackAnimateOpacity: Boolean,
      mdSwipeBackActiveArea: Number,
      mdSwipeBackThreshold: Number,
      auroraSwipeBack: Boolean,
      auroraSwipeBackAnimateShadow: Boolean,
      auroraSwipeBackAnimateOpacity: Boolean,
      auroraSwipeBackActiveArea: Number,
      auroraSwipeBackThreshold: Number,
      pushState: Boolean,
      pushStateRoot: String,
      pushStateAnimate: Boolean,
      pushStateAnimateOnLoad: Boolean,
      pushStateSeparator: String,
      pushStateOnLoad: Boolean,
      animate: Boolean,
      transition: String,
      iosDynamicNavbar: Boolean,
      iosAnimateNavbarBackIcon: Boolean,
      materialPageLoadDelay: Number,
      passRouteQueryToRequest: Boolean,
      passRouteParamsToRequest: Boolean,
      routes: Array,
      routesAdd: Array,
      routesBeforeEnter: [Function, Array],
      routesBeforeLeave: [Function, Array],
      init: {
        type: Boolean,
        default: true
      }
    }, Mixins.colorProps),

    data() {
      const props = __vueComponentProps(this);

      const state = (() => {
        return {
          pages: []
        };
      })();

      return {
        state
      };
    },

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        id,
        style,
        tab,
        main,
        tabActive,
        className
      } = props;
      const classes = Utils.classNames(className, 'view', {
        'view-main': main,
        'tab-active': tabActive,
        tab
      }, Mixins.colorClasses(props));
      return _h('div', {
        ref: 'el',
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default'], self.state.pages.map(page => {
        const PageComponent = page.component;
        {
          return _h(PageComponent, {
            key: page.id,
            props: page.props
          });
        }
      })]);
    },

    created() {
      const self = this;
      Utils.bindMethods(self, ['onSwipeBackMove', 'onSwipeBackBeforeChange', 'onSwipeBackAfterChange', 'onSwipeBackBeforeReset', 'onSwipeBackAfterReset', 'onTabShow', 'onTabHide', 'onViewInit']);
    },

    mounted() {
      const self = this;
      const el = self.$refs.el;
      self.$f7ready(f7Instance => {
        f7Instance.on('tabShow', self.onTabShow);
        f7Instance.on('tabHide', self.onTabHide);
        self.routerData = {
          el,
          component: self,
          pages: self.state.pages,
          instance: null,

          setPages(pages) {
            self.setState({
              pages
            });
          }

        };
        f7.routers.views.push(self.routerData);
        if (!self.props.init) return;
        self.routerData.instance = f7Instance.views.create(el, Object.assign({
          on: {
            init: self.onViewInit
          }
        }, Utils.noUndefinedProps(self.$options.propsData || {})));
        self.f7View = self.routerData.instance;
        self.f7View.on('resize', self.onResize);
        self.f7View.on('swipebackMove', self.onSwipeBackMove);
        self.f7View.on('swipebackBeforeChange', self.onSwipeBackBeforeChange);
        self.f7View.on('swipebackAfterChange', self.onSwipeBackAfterChange);
        self.f7View.on('swipebackBeforeReset', self.onSwipeBackBeforeReset);
        self.f7View.on('swipebackAfterReset', self.onSwipeBackAfterReset);
      });
    },

    beforeDestroy() {
      const self = this;

      if (f7.instance) {
        f7.instance.off('tabShow', self.onTabShow);
        f7.instance.off('tabHide', self.onTabHide);
      }

      if (self.f7View) {
        self.f7View.off('resize', self.onResize);
        self.f7View.off('swipebackMove', self.onSwipeBackMove);
        self.f7View.off('swipebackBeforeChange', self.onSwipeBackBeforeChange);
        self.f7View.off('swipebackAfterChange', self.onSwipeBackAfterChange);
        self.f7View.off('swipebackBeforeReset', self.onSwipeBackBeforeReset);
        self.f7View.off('swipebackAfterReset', self.onSwipeBackAfterReset);
        if (self.f7View.destroy) self.f7View.destroy();
      }

      f7.routers.views.splice(f7.routers.views.indexOf(self.routerData), 1);
      self.routerData = null;
      delete self.routerData;
    },

    updated() {
      const self = this;
      if (!self.routerData) return;
      f7.events.emit('viewRouterDidUpdate', self.routerData);
    },

    methods: {
      onViewInit(view) {
        const self = this;
        self.dispatchEvent('view:init viewInit', view);

        if (!self.props.init) {
          self.routerData.instance = view;
          self.f7View = self.routerData.instance;
        }
      },

      onResize(view, width) {
        this.dispatchEvent('view:resize viewResize', width);
      },

      onSwipeBackMove(data) {
        const swipeBackData = data;
        this.dispatchEvent('swipeback:move swipeBackMove', swipeBackData);
      },

      onSwipeBackBeforeChange(data) {
        const swipeBackData = data;
        this.dispatchEvent('swipeback:beforechange swipeBackBeforeChange', swipeBackData);
      },

      onSwipeBackAfterChange(data) {
        const swipeBackData = data;
        this.dispatchEvent('swipeback:afterchange swipeBackAfterChange', swipeBackData);
      },

      onSwipeBackBeforeReset(data) {
        const swipeBackData = data;
        this.dispatchEvent('swipeback:beforereset swipeBackBeforeReset', swipeBackData);
      },

      onSwipeBackAfterReset(data) {
        const swipeBackData = data;
        this.dispatchEvent('swipeback:afterreset swipeBackAfterReset', swipeBackData);
      },

      onTabShow(el) {
        if (el === this.$refs.el) {
          this.dispatchEvent('tab:show tabShow', el);
        }
      },

      onTabHide(el) {
        if (el === this.$refs.el) {
          this.dispatchEvent('tab:hide tabHide', el);
        }
      },

      dispatchEvent(events, ...args) {
        __vueComponentDispatchEvent(this, events, ...args);
      },

      setState(updater, callback) {
        __vueComponentSetState(this, updater, callback);
      }

    },
    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  ({
    name: 'f7-views',
    props: Object.assign({
      id: [String, Number],
      tabs: Boolean
    }, Mixins.colorProps),

    render() {
      const _h = this.$createElement;
      const self = this;
      const props = self.props;
      const {
        className,
        id,
        style,
        tabs
      } = props;
      const classes = Utils.classNames(className, 'views', {
        tabs
      }, Mixins.colorClasses(props));
      return _h('div', {
        style: style,
        class: classes,
        attrs: {
          id: id
        }
      }, [this.$slots['default']]);
    },

    computed: {
      props() {
        return __vueComponentProps(this);
      }

    }
  });

  function noop() { }
  function add_location(element, file, line, column, char) {
      element.__svelte_meta = {
          loc: { file, line, column, char }
      };
  }
  function run(fn) {
      return fn();
  }
  function blank_object() {
      return Object.create(null);
  }
  function run_all(fns) {
      fns.forEach(run);
  }
  function is_function(thing) {
      return typeof thing === 'function';
  }
  function safe_not_equal(a, b) {
      return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
  }
  function is_empty(obj) {
      return Object.keys(obj).length === 0;
  }

  function append(target, node) {
      target.appendChild(node);
  }
  function insert(target, node, anchor) {
      target.insertBefore(node, anchor || null);
  }
  function detach(node) {
      node.parentNode.removeChild(node);
  }
  function element(name) {
      return document.createElement(name);
  }
  function text(data) {
      return document.createTextNode(data);
  }
  function space() {
      return text(' ');
  }
  function listen(node, event, handler, options) {
      node.addEventListener(event, handler, options);
      return () => node.removeEventListener(event, handler, options);
  }
  function attr(node, attribute, value) {
      if (value == null)
          node.removeAttribute(attribute);
      else if (node.getAttribute(attribute) !== value)
          node.setAttribute(attribute, value);
  }
  function children(element) {
      return Array.from(element.childNodes);
  }
  function custom_event(type, detail) {
      const e = document.createEvent('CustomEvent');
      e.initCustomEvent(type, false, false, detail);
      return e;
  }
  class HtmlTag {
      constructor(anchor = null) {
          this.a = anchor;
          this.e = this.n = null;
      }
      m(html, target, anchor = null) {
          if (!this.e) {
              this.e = element(target.nodeName);
              this.t = target;
              this.h(html);
          }
          this.i(anchor);
      }
      h(html) {
          this.e.innerHTML = html;
          this.n = Array.from(this.e.childNodes);
      }
      i(anchor) {
          for (let i = 0; i < this.n.length; i += 1) {
              insert(this.t, this.n[i], anchor);
          }
      }
      p(html) {
          this.d();
          this.h(html);
          this.i(this.a);
      }
      d() {
          this.n.forEach(detach);
      }
  }

  let current_component;
  function set_current_component(component) {
      current_component = component;
  }

  const dirty_components = [];
  const binding_callbacks = [];
  const render_callbacks = [];
  const flush_callbacks = [];
  const resolved_promise = Promise.resolve();
  let update_scheduled = false;
  function schedule_update() {
      if (!update_scheduled) {
          update_scheduled = true;
          resolved_promise.then(flush);
      }
  }
  function add_render_callback(fn) {
      render_callbacks.push(fn);
  }
  let flushing = false;
  const seen_callbacks = new Set();
  function flush() {
      if (flushing)
          return;
      flushing = true;
      do {
          // first, call beforeUpdate functions
          // and update components
          for (let i = 0; i < dirty_components.length; i += 1) {
              const component = dirty_components[i];
              set_current_component(component);
              update(component.$$);
          }
          set_current_component(null);
          dirty_components.length = 0;
          while (binding_callbacks.length)
              binding_callbacks.pop()();
          // then, once components are updated, call
          // afterUpdate functions. This may cause
          // subsequent updates...
          for (let i = 0; i < render_callbacks.length; i += 1) {
              const callback = render_callbacks[i];
              if (!seen_callbacks.has(callback)) {
                  // ...so guard against infinite loops
                  seen_callbacks.add(callback);
                  callback();
              }
          }
          render_callbacks.length = 0;
      } while (dirty_components.length);
      while (flush_callbacks.length) {
          flush_callbacks.pop()();
      }
      update_scheduled = false;
      flushing = false;
      seen_callbacks.clear();
  }
  function update($$) {
      if ($$.fragment !== null) {
          $$.update();
          run_all($$.before_update);
          const dirty = $$.dirty;
          $$.dirty = [-1];
          $$.fragment && $$.fragment.p($$.ctx, dirty);
          $$.after_update.forEach(add_render_callback);
      }
  }
  const outroing = new Set();
  function transition_in(block, local) {
      if (block && block.i) {
          outroing.delete(block);
          block.i(local);
      }
  }
  function mount_component(component, target, anchor) {
      const { fragment, on_mount, on_destroy, after_update } = component.$$;
      fragment && fragment.m(target, anchor);
      // onMount happens before the initial afterUpdate
      add_render_callback(() => {
          const new_on_destroy = on_mount.map(run).filter(is_function);
          if (on_destroy) {
              on_destroy.push(...new_on_destroy);
          }
          else {
              // Edge case - component was destroyed immediately,
              // most likely as a result of a binding initialising
              run_all(new_on_destroy);
          }
          component.$$.on_mount = [];
      });
      after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
      const $$ = component.$$;
      if ($$.fragment !== null) {
          run_all($$.on_destroy);
          $$.fragment && $$.fragment.d(detaching);
          // TODO null out other refs, including component.$$ (but need to
          // preserve final state?)
          $$.on_destroy = $$.fragment = null;
          $$.ctx = [];
      }
  }
  function make_dirty(component, i) {
      if (component.$$.dirty[0] === -1) {
          dirty_components.push(component);
          schedule_update();
          component.$$.dirty.fill(0);
      }
      component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
  }
  function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
      const parent_component = current_component;
      set_current_component(component);
      const prop_values = options.props || {};
      const $$ = component.$$ = {
          fragment: null,
          ctx: null,
          // state
          props,
          update: noop,
          not_equal,
          bound: blank_object(),
          // lifecycle
          on_mount: [],
          on_destroy: [],
          before_update: [],
          after_update: [],
          context: new Map(parent_component ? parent_component.$$.context : []),
          // everything else
          callbacks: blank_object(),
          dirty,
          skip_bound: false
      };
      let ready = false;
      $$.ctx = instance
          ? instance(component, prop_values, (i, ret, ...rest) => {
              const value = rest.length ? rest[0] : ret;
              if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                  if (!$$.skip_bound && $$.bound[i])
                      $$.bound[i](value);
                  if (ready)
                      make_dirty(component, i);
              }
              return ret;
          })
          : [];
      $$.update();
      ready = true;
      run_all($$.before_update);
      // `false` as a special case of no DOM component
      $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
      if (options.target) {
          if (options.hydrate) {
              const nodes = children(options.target);
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              $$.fragment && $$.fragment.l(nodes);
              nodes.forEach(detach);
          }
          else {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              $$.fragment && $$.fragment.c();
          }
          if (options.intro)
              transition_in(component.$$.fragment);
          mount_component(component, options.target, options.anchor);
          flush();
      }
      set_current_component(parent_component);
  }
  /**
   * Base class for Svelte components. Used when dev=false.
   */
  class SvelteComponent {
      $destroy() {
          destroy_component(this, 1);
          this.$destroy = noop;
      }
      $on(type, callback) {
          const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
          callbacks.push(callback);
          return () => {
              const index = callbacks.indexOf(callback);
              if (index !== -1)
                  callbacks.splice(index, 1);
          };
      }
      $set($$props) {
          if (this.$$set && !is_empty($$props)) {
              this.$$.skip_bound = true;
              this.$$set($$props);
              this.$$.skip_bound = false;
          }
      }
  }

  function dispatch_dev(type, detail) {
      document.dispatchEvent(custom_event(type, Object.assign({ version: '3.31.0' }, detail)));
  }
  function append_dev(target, node) {
      dispatch_dev('SvelteDOMInsert', { target, node });
      append(target, node);
  }
  function insert_dev(target, node, anchor) {
      dispatch_dev('SvelteDOMInsert', { target, node, anchor });
      insert(target, node, anchor);
  }
  function detach_dev(node) {
      dispatch_dev('SvelteDOMRemove', { node });
      detach(node);
  }
  function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
      const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
      if (has_prevent_default)
          modifiers.push('preventDefault');
      if (has_stop_propagation)
          modifiers.push('stopPropagation');
      dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
      const dispose = listen(node, event, handler, options);
      return () => {
          dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
          dispose();
      };
  }
  function attr_dev(node, attribute, value) {
      attr(node, attribute, value);
      if (value == null)
          dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
      else
          dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
  }
  function set_data_dev(text, data) {
      data = '' + data;
      if (text.wholeText === data)
          return;
      dispatch_dev('SvelteDOMSetData', { node: text, data });
      text.data = data;
  }
  function validate_slots(name, slot, keys) {
      for (const slot_key of Object.keys(slot)) {
          if (!~keys.indexOf(slot_key)) {
              console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
          }
      }
  }
  /**
   * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
   */
  class SvelteComponentDev extends SvelteComponent {
      constructor(options) {
          if (!options || (!options.target && !options.$$inline)) {
              throw new Error("'target' is a required option");
          }
          super();
      }
      $destroy() {
          super.$destroy();
          this.$destroy = () => {
              console.warn('Component was already destroyed'); // eslint-disable-line no-console
          };
      }
      $capture_state() { }
      $inject_state() { }
  }

  /* src/App.svelte generated by Svelte v3.31.0 */
  const file = "src/App.svelte";

  // (51:2) {#if user.loggedIn}
  function create_if_block_1(ctx) {
  	let button;
  	let mounted;
  	let dispose;

  	const block = {
  		c: function create() {
  			button = element("button");
  			button.textContent = "Out";
  			attr_dev(button, "class", "dummyButton2 svelte-101pb5h");
  			add_location(button, file, 51, 2, 1386);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, button, anchor);

  			if (!mounted) {
  				dispose = listen_dev(button, "click", /*toggle*/ ctx[9], false, false, false);
  				mounted = true;
  			}
  		},
  		p: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(button);
  			mounted = false;
  			dispose();
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_if_block_1.name,
  		type: "if",
  		source: "(51:2) {#if user.loggedIn}",
  		ctx
  	});

  	return block;
  }

  // (58:3) {#if !user.loggedIn}
  function create_if_block(ctx) {
  	let button;
  	let mounted;
  	let dispose;

  	const block = {
  		c: function create() {
  			button = element("button");
  			button.textContent = "In";
  			attr_dev(button, "class", "dummyButton2 svelte-101pb5h");
  			add_location(button, file, 58, 3, 1491);
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, button, anchor);

  			if (!mounted) {
  				dispose = listen_dev(button, "click", /*toggle*/ ctx[9], false, false, false);
  				mounted = true;
  			}
  		},
  		p: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(button);
  			mounted = false;
  			dispose();
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_if_block.name,
  		type: "if",
  		source: "(58:3) {#if !user.loggedIn}",
  		ctx
  	});

  	return block;
  }

  function create_fragment(ctx) {
  	let main;
  	let img0;
  	let img0_src_value;
  	let t0;
  	let h30;
  	let t1;
  	let t2;
  	let t3;
  	let t4;
  	let h1;
  	let t5;
  	let t6;
  	let t7;
  	let t8;
  	let p0;
  	let t9;
  	let t10;
  	let t11;
  	let t12;
  	let p1;
  	let t13;
  	let t14;
  	let h2;
  	let t15;
  	let t16;
  	let h31;
  	let t18;
  	let p2;
  	let t20;
  	let button0;
  	let t21;

  	let t22_value = (/*count*/ ctx[6] === 0
  	? "nobody clicked this button yet :( "
  	: " to make this button happy!") + "";

  	let t22;
  	let t23;
  	let p3;
  	let t24;
  	let t25;
  	let t26;
  	let t27;
  	let button1;
  	let t29;
  	let h32;
  	let t31;
  	let t32;
  	let t33;
  	let h33;
  	let t35;
  	let a0;
  	let img1;
  	let img1_src_value;
  	let t36;
  	let a1;
  	let img2;
  	let img2_src_value;
  	let t37;
  	let a2;
  	let img3;
  	let img3_src_value;
  	let t38;
  	let p4;
  	let t39;
  	let a3;
  	let t41;
  	let mounted;
  	let dispose;
  	let if_block0 = /*user*/ ctx[7].loggedIn && create_if_block_1(ctx);
  	let if_block1 = !/*user*/ ctx[7].loggedIn && create_if_block(ctx);

  	const block = {
  		c: function create() {
  			main = element("main");
  			img0 = element("img");
  			t0 = space();
  			h30 = element("h3");
  			t1 = text("-this is ");
  			t2 = text(/*name*/ ctx[0]);
  			t3 = text("-");
  			t4 = space();
  			h1 = element("h1");
  			t5 = text("Hello ");
  			t6 = text(/*message*/ ctx[3]);
  			t7 = text("!");
  			t8 = space();
  			p0 = element("p");
  			t9 = text("/* ");
  			t10 = text(/*expText*/ ctx[2]);
  			t11 = text(" */");
  			t12 = space();
  			p1 = element("p");
  			t13 = text(/*entry*/ ctx[4]);
  			t14 = space();
  			h2 = element("h2");
  			t15 = text(/*drummers*/ ctx[5]);
  			t16 = space();
  			h31 = element("h3");
  			h31.textContent = "Let's start with basic";
  			t18 = space();
  			p2 = element("p");
  			p2.textContent = "if i use svelte, it must have meaning. this all text are came from 'props' don't you believe? look to the source.";
  			t20 = space();
  			button0 = element("button");
  			t21 = text("Click this button! ");
  			t22 = text(t22_value);
  			t23 = space();
  			p3 = element("p");
  			t24 = text("people clicked this button ");
  			t25 = text(/*count*/ ctx[6]);
  			t26 = text(" times!");
  			t27 = space();
  			button1 = element("button");
  			button1.textContent = "Button Fire";
  			t29 = space();
  			h32 = element("h3");
  			h32.textContent = "or try this!";
  			t31 = space();
  			if (if_block0) if_block0.c();
  			t32 = space();
  			if (if_block1) if_block1.c();
  			t33 = space();
  			h33 = element("h3");
  			h33.textContent = "here's my links!";
  			t35 = space();
  			a0 = element("a");
  			img1 = element("img");
  			t36 = space();
  			a1 = element("a");
  			img2 = element("img");
  			t37 = space();
  			a2 = element("a");
  			img3 = element("img");
  			t38 = space();
  			p4 = element("p");
  			t39 = text("/* Visit the ");
  			a3 = element("a");
  			a3.textContent = "Svelte tutorial";
  			t41 = text(" to learn how to build Svelte apps. */");
  			if (img0.src !== (img0_src_value = /*src*/ ctx[1])) attr_dev(img0, "src", img0_src_value);
  			attr_dev(img0, "class", "headImg svelte-101pb5h");
  			attr_dev(img0, "alt", "self portrait");
  			add_location(img0, file, 33, 1, 659);
  			attr_dev(h30, "class", "svelte-101pb5h");
  			add_location(h30, file, 34, 1, 713);
  			attr_dev(h1, "class", "svelte-101pb5h");
  			add_location(h1, file, 35, 1, 742);
  			add_location(p0, file, 36, 1, 769);
  			add_location(p1, file, 37, 1, 793);
  			add_location(h2, file, 38, 2, 812);
  			attr_dev(h31, "class", "svelte-101pb5h");
  			add_location(h31, file, 39, 2, 835);
  			add_location(p2, file, 40, 2, 871);
  			attr_dev(button0, "class", "dummyButton svelte-101pb5h");
  			add_location(button0, file, 44, 2, 1022);
  			add_location(p3, file, 45, 2, 1191);
  			attr_dev(button1, "id", "buttonFire");
  			add_location(button1, file, 46, 2, 1268);
  			attr_dev(h32, "class", "svelte-101pb5h");
  			add_location(h32, file, 49, 2, 1340);
  			attr_dev(h33, "class", "links svelte-101pb5h");
  			add_location(h33, file, 71, 2, 1579);
  			if (img1.src !== (img1_src_value = "tw-logo.png")) attr_dev(img1, "src", img1_src_value);
  			attr_dev(img1, "class", "tw-logo svelte-101pb5h");
  			attr_dev(img1, "alt", "twitter logo");
  			add_location(img1, file, 73, 53, 1673);
  			attr_dev(a0, "href", "https://www.twitter.com/ibrahimcankarta");
  			add_location(a0, file, 73, 2, 1622);
  			if (img2.src !== (img2_src_value = "github.png")) attr_dev(img2, "src", img2_src_value);
  			attr_dev(img2, "class", "logo svelte-101pb5h");
  			attr_dev(img2, "alt", "github logo");
  			add_location(img2, file, 75, 52, 1790);
  			attr_dev(a1, "href", "https://www.github.com/ibrahimcankarta");
  			add_location(a1, file, 75, 2, 1740);
  			if (img3.src !== (img3_src_value = "linkedin.png")) attr_dev(img3, "src", img3_src_value);
  			attr_dev(img3, "class", "logo svelte-101pb5h");
  			attr_dev(img3, "alt", "linkedin logo");
  			add_location(img3, file, 77, 57, 1907);
  			attr_dev(a2, "href", "https://www.linkedin.com/in/ibrahimcankarta");
  			add_location(a2, file, 77, 2, 1852);
  			attr_dev(a3, "href", "https://svelte.dev/tutorial");
  			add_location(a3, file, 81, 18, 1995);
  			add_location(p4, file, 81, 1, 1978);
  			attr_dev(main, "class", "svelte-101pb5h");
  			add_location(main, file, 31, 0, 649);
  		},
  		l: function claim(nodes) {
  			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		},
  		m: function mount(target, anchor) {
  			insert_dev(target, main, anchor);
  			append_dev(main, img0);
  			append_dev(main, t0);
  			append_dev(main, h30);
  			append_dev(h30, t1);
  			append_dev(h30, t2);
  			append_dev(h30, t3);
  			append_dev(main, t4);
  			append_dev(main, h1);
  			append_dev(h1, t5);
  			append_dev(h1, t6);
  			append_dev(h1, t7);
  			append_dev(main, t8);
  			append_dev(main, p0);
  			append_dev(p0, t9);
  			append_dev(p0, t10);
  			append_dev(p0, t11);
  			append_dev(main, t12);
  			append_dev(main, p1);
  			append_dev(p1, t13);
  			append_dev(main, t14);
  			append_dev(main, h2);
  			append_dev(h2, t15);
  			append_dev(main, t16);
  			append_dev(main, h31);
  			append_dev(main, t18);
  			append_dev(main, p2);
  			append_dev(main, t20);
  			append_dev(main, button0);
  			append_dev(button0, t21);
  			append_dev(button0, t22);
  			append_dev(main, t23);
  			append_dev(main, p3);
  			append_dev(p3, t24);
  			append_dev(p3, t25);
  			append_dev(p3, t26);
  			append_dev(main, t27);
  			append_dev(main, button1);
  			append_dev(main, t29);
  			append_dev(main, h32);
  			append_dev(main, t31);
  			if (if_block0) if_block0.m(main, null);
  			append_dev(main, t32);
  			if (if_block1) if_block1.m(main, null);
  			append_dev(main, t33);
  			append_dev(main, h33);
  			append_dev(main, t35);
  			append_dev(main, a0);
  			append_dev(a0, img1);
  			append_dev(main, t36);
  			append_dev(main, a1);
  			append_dev(a1, img2);
  			append_dev(main, t37);
  			append_dev(main, a2);
  			append_dev(a2, img3);
  			append_dev(main, t38);
  			append_dev(main, p4);
  			append_dev(p4, t39);
  			append_dev(p4, a3);
  			append_dev(p4, t41);

  			if (!mounted) {
  				dispose = [
  					listen_dev(button0, "click", /*handleClick*/ ctx[8], false, false, false),
  					listen_dev(button1, "click", buttonFire, false, false, false)
  				];

  				mounted = true;
  			}
  		},
  		p: function update(ctx, [dirty]) {
  			if (dirty & /*src*/ 2 && img0.src !== (img0_src_value = /*src*/ ctx[1])) {
  				attr_dev(img0, "src", img0_src_value);
  			}

  			if (dirty & /*name*/ 1) set_data_dev(t2, /*name*/ ctx[0]);
  			if (dirty & /*message*/ 8) set_data_dev(t6, /*message*/ ctx[3]);
  			if (dirty & /*expText*/ 4) set_data_dev(t10, /*expText*/ ctx[2]);
  			if (dirty & /*entry*/ 16) set_data_dev(t13, /*entry*/ ctx[4]);
  			if (dirty & /*drummers*/ 32) set_data_dev(t15, /*drummers*/ ctx[5]);

  			if (dirty & /*count*/ 64 && t22_value !== (t22_value = (/*count*/ ctx[6] === 0
  			? "nobody clicked this button yet :( "
  			: " to make this button happy!") + "")) set_data_dev(t22, t22_value);

  			if (dirty & /*count*/ 64) set_data_dev(t25, /*count*/ ctx[6]);

  			if (/*user*/ ctx[7].loggedIn) {
  				if (if_block0) {
  					if_block0.p(ctx, dirty);
  				} else {
  					if_block0 = create_if_block_1(ctx);
  					if_block0.c();
  					if_block0.m(main, t32);
  				}
  			} else if (if_block0) {
  				if_block0.d(1);
  				if_block0 = null;
  			}

  			if (!/*user*/ ctx[7].loggedIn) {
  				if (if_block1) {
  					if_block1.p(ctx, dirty);
  				} else {
  					if_block1 = create_if_block(ctx);
  					if_block1.c();
  					if_block1.m(main, t33);
  				}
  			} else if (if_block1) {
  				if_block1.d(1);
  				if_block1 = null;
  			}
  		},
  		i: noop,
  		o: noop,
  		d: function destroy(detaching) {
  			if (detaching) detach_dev(main);
  			if (if_block0) if_block0.d();
  			if (if_block1) if_block1.d();
  			mounted = false;
  			run_all(dispose);
  		}
  	};

  	dispatch_dev("SvelteRegisterBlock", {
  		block,
  		id: create_fragment.name,
  		type: "component",
  		source: "",
  		ctx
  	});

  	return block;
  }

  function buttonFire() {
  	
  }

  function instance($$self, $$props, $$invalidate) {
  	let { $$slots: slots = {}, $$scope } = $$props;
  	validate_slots("App", slots, []);
  	let { name } = $$props;
  	let { src } = $$props;
  	let { expText } = $$props;
  	let { message } = $$props;
  	let { entry } = $$props;
  	let { drummers } = $$props;
  	let kod = "You are the <p>{count} </p>'th person to clicked this button! ";
  	let count = 0;

  	function handleClick() {
  		$$invalidate(6, count += 1);
  	}

  	let user = { loggedIn: false };

  	function toggle() {
  		$$invalidate(7, user.loggedIn = !user.loggedIn, user);
  	}

  	const writable_props = ["name", "src", "expText", "message", "entry", "drummers"];

  	Object.keys($$props).forEach(key => {
  		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
  	});

  	$$self.$$set = $$props => {
  		if ("name" in $$props) $$invalidate(0, name = $$props.name);
  		if ("src" in $$props) $$invalidate(1, src = $$props.src);
  		if ("expText" in $$props) $$invalidate(2, expText = $$props.expText);
  		if ("message" in $$props) $$invalidate(3, message = $$props.message);
  		if ("entry" in $$props) $$invalidate(4, entry = $$props.entry);
  		if ("drummers" in $$props) $$invalidate(5, drummers = $$props.drummers);
  	};

  	$$self.$capture_state = () => ({
  		HtmlTag,
  		name,
  		src,
  		expText,
  		message,
  		entry,
  		drummers,
  		kod,
  		count,
  		handleClick,
  		buttonFire,
  		user,
  		toggle
  	});

  	$$self.$inject_state = $$props => {
  		if ("name" in $$props) $$invalidate(0, name = $$props.name);
  		if ("src" in $$props) $$invalidate(1, src = $$props.src);
  		if ("expText" in $$props) $$invalidate(2, expText = $$props.expText);
  		if ("message" in $$props) $$invalidate(3, message = $$props.message);
  		if ("entry" in $$props) $$invalidate(4, entry = $$props.entry);
  		if ("drummers" in $$props) $$invalidate(5, drummers = $$props.drummers);
  		if ("kod" in $$props) kod = $$props.kod;
  		if ("count" in $$props) $$invalidate(6, count = $$props.count);
  		if ("user" in $$props) $$invalidate(7, user = $$props.user);
  	};

  	if ($$props && "$$inject" in $$props) {
  		$$self.$inject_state($$props.$$inject);
  	}

  	return [name, src, expText, message, entry, drummers, count, user, handleClick, toggle];
  }

  class App extends SvelteComponentDev {
  	constructor(options) {
  		super(options);

  		init(this, options, instance, create_fragment, safe_not_equal, {
  			name: 0,
  			src: 1,
  			expText: 2,
  			message: 3,
  			entry: 4,
  			drummers: 5
  		});

  		dispatch_dev("SvelteRegisterComponent", {
  			component: this,
  			tagName: "App",
  			options,
  			id: create_fragment.name
  		});

  		const { ctx } = this.$$;
  		const props = options.props || {};

  		if (/*name*/ ctx[0] === undefined && !("name" in props)) {
  			console.warn("<App> was created without expected prop 'name'");
  		}

  		if (/*src*/ ctx[1] === undefined && !("src" in props)) {
  			console.warn("<App> was created without expected prop 'src'");
  		}

  		if (/*expText*/ ctx[2] === undefined && !("expText" in props)) {
  			console.warn("<App> was created without expected prop 'expText'");
  		}

  		if (/*message*/ ctx[3] === undefined && !("message" in props)) {
  			console.warn("<App> was created without expected prop 'message'");
  		}

  		if (/*entry*/ ctx[4] === undefined && !("entry" in props)) {
  			console.warn("<App> was created without expected prop 'entry'");
  		}

  		if (/*drummers*/ ctx[5] === undefined && !("drummers" in props)) {
  			console.warn("<App> was created without expected prop 'drummers'");
  		}
  	}

  	get name() {
  		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set name(value) {
  		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get src() {
  		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set src(value) {
  		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get expText() {
  		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set expText(value) {
  		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get message() {
  		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set message(value) {
  		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get entry() {
  		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set entry(value) {
  		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	get drummers() {
  		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}

  	set drummers(value) {
  		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  	}
  }

  const app = new App({
  	target: document.body,
  	props: {
  		name: 'Kreatos',
  		message:'world',
  		expText: 'Hi Guys! this is my personal web site, made with "svelte" and lots of fun. I am half developer and half designer. if you want to cantact with me, scroll the end! Peace out::',
  		src : '/self.jpg',
  		entry: "Yeah yeah yeah, i know it's boring to looking at someone's web site especially he/she is a developer. Maybe it can be fun, maybe i can do it.  ",
  		drummers:"So, why not?"
  	}

  	
  	
  });
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    var firebaseConfig = {
      apiKey: "AIzaSyArB1duLFjbbVPelpfuH8XVUcfCNi4WBdM",
      authDomain: "kreatos-853c2.firebaseapp.com",
      projectId: "kreatos-853c2",
      storageBucket: "kreatos-853c2.appspot.com",
      messagingSenderId: "395741123458",
      appId: "1:395741123458:web:01c18579fa4eeffa13f59b",
      measurementId: "G-5L2RQRJ805"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

  return app;

}());
//# sourceMappingURL=bundle.js.map
