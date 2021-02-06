
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

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

    // (44:2) {#if user.loggedIn}
    function create_if_block_1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Out";
    			attr_dev(button, "class", "dummyButton2 svelte-101pb5h");
    			add_location(button, file, 44, 2, 1282);
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
    		source: "(44:2) {#if user.loggedIn}",
    		ctx
    	});

    	return block;
    }

    // (51:3) {#if !user.loggedIn}
    function create_if_block(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "In";
    			attr_dev(button, "class", "dummyButton2 svelte-101pb5h");
    			add_location(button, file, 51, 3, 1387);
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
    		source: "(51:3) {#if !user.loggedIn}",
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
    	let button;
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
    	let h32;
    	let t29;
    	let t30;
    	let t31;
    	let h33;
    	let t33;
    	let a0;
    	let img1;
    	let img1_src_value;
    	let t34;
    	let a1;
    	let img2;
    	let img2_src_value;
    	let t35;
    	let a2;
    	let img3;
    	let img3_src_value;
    	let t36;
    	let p4;
    	let t37;
    	let a3;
    	let t39;
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
    			button = element("button");
    			t21 = text("Click this button! ");
    			t22 = text(t22_value);
    			t23 = space();
    			p3 = element("p");
    			t24 = text("people clicked this button ");
    			t25 = text(/*count*/ ctx[6]);
    			t26 = text(" times!");
    			t27 = space();
    			h32 = element("h3");
    			h32.textContent = "or try this!";
    			t29 = space();
    			if (if_block0) if_block0.c();
    			t30 = space();
    			if (if_block1) if_block1.c();
    			t31 = space();
    			h33 = element("h3");
    			h33.textContent = "here's my links!";
    			t33 = space();
    			a0 = element("a");
    			img1 = element("img");
    			t34 = space();
    			a1 = element("a");
    			img2 = element("img");
    			t35 = space();
    			a2 = element("a");
    			img3 = element("img");
    			t36 = space();
    			p4 = element("p");
    			t37 = text("/* Visit the ");
    			a3 = element("a");
    			a3.textContent = "Svelte tutorial";
    			t39 = text(" to learn how to build Svelte apps. */");
    			if (img0.src !== (img0_src_value = /*src*/ ctx[1])) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", "headImg svelte-101pb5h");
    			attr_dev(img0, "alt", "self portrait");
    			add_location(img0, file, 27, 1, 625);
    			attr_dev(h30, "class", "svelte-101pb5h");
    			add_location(h30, file, 28, 1, 679);
    			attr_dev(h1, "class", "svelte-101pb5h");
    			add_location(h1, file, 29, 1, 708);
    			add_location(p0, file, 30, 1, 735);
    			add_location(p1, file, 31, 1, 759);
    			add_location(h2, file, 32, 2, 778);
    			attr_dev(h31, "class", "svelte-101pb5h");
    			add_location(h31, file, 33, 2, 801);
    			add_location(p2, file, 34, 2, 837);
    			attr_dev(button, "class", "dummyButton svelte-101pb5h");
    			add_location(button, file, 38, 2, 988);
    			add_location(p3, file, 39, 2, 1157);
    			attr_dev(h32, "class", "svelte-101pb5h");
    			add_location(h32, file, 42, 2, 1236);
    			attr_dev(h33, "class", "links svelte-101pb5h");
    			add_location(h33, file, 64, 2, 1475);
    			if (img1.src !== (img1_src_value = "tw-logo.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "class", "tw-logo svelte-101pb5h");
    			attr_dev(img1, "alt", "twitter logo");
    			add_location(img1, file, 66, 53, 1569);
    			attr_dev(a0, "href", "https://www.twitter.com/ibrahimcankarta");
    			add_location(a0, file, 66, 2, 1518);
    			if (img2.src !== (img2_src_value = "github.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "class", "logo svelte-101pb5h");
    			attr_dev(img2, "alt", "github logo");
    			add_location(img2, file, 68, 52, 1686);
    			attr_dev(a1, "href", "https://www.github.com/ibrahimcankarta");
    			add_location(a1, file, 68, 2, 1636);
    			if (img3.src !== (img3_src_value = "linkedin.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "class", "logo svelte-101pb5h");
    			attr_dev(img3, "alt", "linkedin logo");
    			add_location(img3, file, 70, 57, 1803);
    			attr_dev(a2, "href", "https://www.linkedin.com/in/ibrahimcankarta");
    			add_location(a2, file, 70, 2, 1748);
    			attr_dev(a3, "href", "https://svelte.dev/tutorial");
    			add_location(a3, file, 74, 18, 1891);
    			add_location(p4, file, 74, 1, 1874);
    			attr_dev(main, "class", "svelte-101pb5h");
    			add_location(main, file, 25, 0, 615);
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
    			append_dev(main, button);
    			append_dev(button, t21);
    			append_dev(button, t22);
    			append_dev(main, t23);
    			append_dev(main, p3);
    			append_dev(p3, t24);
    			append_dev(p3, t25);
    			append_dev(p3, t26);
    			append_dev(main, t27);
    			append_dev(main, h32);
    			append_dev(main, t29);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t30);
    			if (if_block1) if_block1.m(main, null);
    			append_dev(main, t31);
    			append_dev(main, h33);
    			append_dev(main, t33);
    			append_dev(main, a0);
    			append_dev(a0, img1);
    			append_dev(main, t34);
    			append_dev(main, a1);
    			append_dev(a1, img2);
    			append_dev(main, t35);
    			append_dev(main, a2);
    			append_dev(a2, img3);
    			append_dev(main, t36);
    			append_dev(main, p4);
    			append_dev(p4, t37);
    			append_dev(p4, a3);
    			append_dev(p4, t39);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleClick*/ ctx[8], false, false, false);
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
    					if_block0.m(main, t30);
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
    					if_block1.m(main, t31);
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
    			dispose();
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

    return app;

}());
//# sourceMappingURL=bundle.js.map
