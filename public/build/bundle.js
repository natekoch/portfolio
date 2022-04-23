
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
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
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
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
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
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
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
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
        seen_callbacks.clear();
        set_current_component(saved_component);
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
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
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
        }
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
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
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
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
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
            mount_component(component, options.target, options.anchor, options.customElement);
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.47.0' }, detail), true));
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

    /* src/Blog.svelte generated by Svelte v3.47.0 */

    const file$6 = "src/Blog.svelte";

    function create_fragment$6(ctx) {
    	let body;
    	let div;
    	let h1;

    	const block = {
    		c: function create() {
    			body = element("body");
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = `Yes, a blog in ${/*year*/ ctx[0]}. Welcome.`;
    			attr_dev(h1, "class", "text-bold text-3xl text-white");
    			add_location(h1, file$6, 7, 2, 121);
    			attr_dev(div, "class", "text-center");
    			add_location(div, file$6, 6, 4, 93);
    			add_location(body, file$6, 5, 0, 82);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div);
    			append_dev(div, h1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Blog', slots, []);
    	let time = new Date();
    	let year = time.getFullYear();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Blog> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ time, year });

    	$$self.$inject_state = $$props => {
    		if ('time' in $$props) time = $$props.time;
    		if ('year' in $$props) $$invalidate(0, year = $$props.year);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [year];
    }

    class Blog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Blog",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/Home.svelte generated by Svelte v3.47.0 */

    const file$5 = "src/Home.svelte";

    function create_fragment$5(ctx) {
    	let body;
    	let div;
    	let h1;

    	const block = {
    		c: function create() {
    			body = element("body");
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Welcome!";
    			attr_dev(h1, "class", "text-bold text-2xl text-secondary");
    			add_location(h1, file$5, 2, 8, 45);
    			attr_dev(div, "class", "text-center");
    			add_location(div, file$5, 1, 4, 11);
    			add_location(body, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div);
    			append_dev(div, h1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/About.svelte generated by Svelte v3.47.0 */

    const file$4 = "src/About.svelte";

    function create_fragment$4(ctx) {
    	let body;
    	let div;
    	let h1;

    	const block = {
    		c: function create() {
    			body = element("body");
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Hello There! I am Nate Koch.";
    			attr_dev(h1, "class", "text-bold text-2xl text-white");
    			add_location(h1, file$4, 2, 8, 45);
    			attr_dev(div, "class", "text-center");
    			add_location(div, file$4, 1, 4, 11);
    			add_location(body, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div);
    			append_dev(div, h1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/Contact.svelte generated by Svelte v3.47.0 */

    const file$3 = "src/Contact.svelte";

    function create_fragment$3(ctx) {
    	let body;
    	let div1;
    	let div0;
    	let h1;
    	let t1;
    	let a;
    	let button;

    	const block = {
    		c: function create() {
    			body = element("body");
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Get in contact with me.";
    			t1 = space();
    			a = element("a");
    			button = element("button");
    			button.textContent = "Email Me";
    			attr_dev(h1, "class", "text-bold text-2xl text-white");
    			add_location(h1, file$3, 3, 8, 150);
    			attr_dev(button, "class", "btn btn-secondary btn-sm md:btn-md lg:btn-lg m-4");
    			add_location(button, file$3, 5, 12, 275);
    			attr_dev(a, "href", "mailto:nkoch@jaaku.xyz");
    			add_location(a, file$3, 4, 8, 229);
    			attr_dev(div0, "class", "text-center");
    			add_location(div0, file$3, 2, 8, 116);
    			attr_dev(div1, "class", "grid grid-cols-1 grid-rows-2 grid-flow-row-dense place-items-center gap-0 h-screen");
    			add_location(div1, file$3, 1, 4, 11);
    			add_location(body, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, a);
    			append_dev(a, button);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contact', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Photography.svelte generated by Svelte v3.47.0 */

    const file$2 = "src/Photography.svelte";

    function create_fragment$2(ctx) {
    	let body;
    	let div10;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let img1;
    	let img1_src_value;
    	let t1;
    	let img2;
    	let img2_src_value;
    	let t2;
    	let div1;
    	let img3;
    	let img3_src_value;
    	let t3;
    	let img4;
    	let img4_src_value;
    	let t4;
    	let img5;
    	let img5_src_value;
    	let t5;
    	let div2;
    	let img6;
    	let img6_src_value;
    	let t6;
    	let img7;
    	let img7_src_value;
    	let t7;
    	let img8;
    	let img8_src_value;
    	let t8;
    	let div3;
    	let img9;
    	let img9_src_value;
    	let t9;
    	let img10;
    	let img10_src_value;
    	let t10;
    	let img11;
    	let img11_src_value;
    	let t11;
    	let div4;
    	let img12;
    	let img12_src_value;
    	let t12;
    	let img13;
    	let img13_src_value;
    	let t13;
    	let img14;
    	let img14_src_value;
    	let t14;
    	let div5;
    	let img15;
    	let img15_src_value;
    	let t15;
    	let img16;
    	let img16_src_value;
    	let t16;
    	let img17;
    	let img17_src_value;
    	let t17;
    	let div6;
    	let img18;
    	let img18_src_value;
    	let t18;
    	let img19;
    	let img19_src_value;
    	let t19;
    	let img20;
    	let img20_src_value;
    	let t20;
    	let div7;
    	let img21;
    	let img21_src_value;
    	let t21;
    	let img22;
    	let img22_src_value;
    	let t22;
    	let img23;
    	let img23_src_value;
    	let t23;
    	let div8;
    	let img24;
    	let img24_src_value;
    	let t24;
    	let img25;
    	let img25_src_value;
    	let t25;
    	let img26;
    	let img26_src_value;
    	let t26;
    	let div9;
    	let img27;
    	let img27_src_value;
    	let t27;
    	let img28;
    	let img28_src_value;
    	let t28;
    	let img29;
    	let img29_src_value;

    	const block = {
    		c: function create() {
    			body = element("body");
    			div10 = element("div");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			img1 = element("img");
    			t1 = space();
    			img2 = element("img");
    			t2 = space();
    			div1 = element("div");
    			img3 = element("img");
    			t3 = space();
    			img4 = element("img");
    			t4 = space();
    			img5 = element("img");
    			t5 = space();
    			div2 = element("div");
    			img6 = element("img");
    			t6 = space();
    			img7 = element("img");
    			t7 = space();
    			img8 = element("img");
    			t8 = space();
    			div3 = element("div");
    			img9 = element("img");
    			t9 = space();
    			img10 = element("img");
    			t10 = space();
    			img11 = element("img");
    			t11 = space();
    			div4 = element("div");
    			img12 = element("img");
    			t12 = space();
    			img13 = element("img");
    			t13 = space();
    			img14 = element("img");
    			t14 = space();
    			div5 = element("div");
    			img15 = element("img");
    			t15 = space();
    			img16 = element("img");
    			t16 = space();
    			img17 = element("img");
    			t17 = space();
    			div6 = element("div");
    			img18 = element("img");
    			t18 = space();
    			img19 = element("img");
    			t19 = space();
    			img20 = element("img");
    			t20 = space();
    			div7 = element("div");
    			img21 = element("img");
    			t21 = space();
    			img22 = element("img");
    			t22 = space();
    			img23 = element("img");
    			t23 = space();
    			div8 = element("div");
    			img24 = element("img");
    			t24 = space();
    			img25 = element("img");
    			t25 = space();
    			img26 = element("img");
    			t26 = space();
    			div9 = element("div");
    			img27 = element("img");
    			t27 = space();
    			img28 = element("img");
    			t28 = space();
    			img29 = element("img");
    			if (!src_url_equal(img0.src, img0_src_value = "00043261/000432610001.jpg")) attr_dev(img0, "src", img0_src_value);
    			set_style(img0, "max-height", "300px");
    			set_style(img0, "max-width", "300px");
    			attr_dev(img0, "alt", "topstack");
    			attr_dev(img0, "class", "rounded shadow-xl");
    			add_location(img0, file$2, 3, 12, 153);
    			if (!src_url_equal(img1.src, img1_src_value = "00043261/000432610002.jpg")) attr_dev(img1, "src", img1_src_value);
    			set_style(img1, "max-height", "300px");
    			set_style(img1, "max-width", "305px");
    			attr_dev(img1, "alt", "middlestasck");
    			attr_dev(img1, "class", "rounded shadow-lg");
    			add_location(img1, file$2, 4, 12, 291);
    			if (!src_url_equal(img2.src, img2_src_value = "00043261/000432610003.jpg")) attr_dev(img2, "src", img2_src_value);
    			set_style(img2, "max-height", "300px");
    			set_style(img2, "max-width", "310px");
    			attr_dev(img2, "alt", "bottomstack");
    			attr_dev(img2, "class", "rounded shadow-md");
    			add_location(img2, file$2, 5, 12, 433);
    			attr_dev(div0, "class", "stack");
    			add_location(div0, file$2, 2, 8, 121);
    			if (!src_url_equal(img3.src, img3_src_value = "00043261/000432610004.jpg")) attr_dev(img3, "src", img3_src_value);
    			set_style(img3, "max-height", "300px");
    			set_style(img3, "max-width", "300px");
    			attr_dev(img3, "alt", "topstack");
    			attr_dev(img3, "class", "rounded shadow-xl");
    			add_location(img3, file$2, 8, 12, 617);
    			if (!src_url_equal(img4.src, img4_src_value = "00043261/000432610005.jpg")) attr_dev(img4, "src", img4_src_value);
    			set_style(img4, "max-height", "300px");
    			set_style(img4, "max-width", "305px");
    			attr_dev(img4, "alt", "middlestasck");
    			attr_dev(img4, "class", "rounded shadow-lg");
    			add_location(img4, file$2, 9, 12, 755);
    			if (!src_url_equal(img5.src, img5_src_value = "00043261/000432610006.jpg")) attr_dev(img5, "src", img5_src_value);
    			set_style(img5, "max-height", "300px");
    			set_style(img5, "max-width", "310px");
    			attr_dev(img5, "alt", "bottomstack");
    			attr_dev(img5, "class", "rounded shadow-md");
    			add_location(img5, file$2, 10, 12, 897);
    			attr_dev(div1, "class", "stack");
    			add_location(div1, file$2, 7, 8, 585);
    			if (!src_url_equal(img6.src, img6_src_value = "00043261/000432610007.jpg")) attr_dev(img6, "src", img6_src_value);
    			set_style(img6, "max-height", "300px");
    			set_style(img6, "max-width", "300px");
    			attr_dev(img6, "alt", "topstack");
    			attr_dev(img6, "class", "rounded shadow-xl");
    			add_location(img6, file$2, 13, 12, 1081);
    			if (!src_url_equal(img7.src, img7_src_value = "00043261/000432610008.jpg")) attr_dev(img7, "src", img7_src_value);
    			set_style(img7, "max-height", "300px");
    			set_style(img7, "max-width", "305px");
    			attr_dev(img7, "alt", "middlestasck");
    			attr_dev(img7, "class", "rounded shadow-lg");
    			add_location(img7, file$2, 14, 12, 1219);
    			if (!src_url_equal(img8.src, img8_src_value = "00043261/000432610009.jpg")) attr_dev(img8, "src", img8_src_value);
    			set_style(img8, "max-height", "300px");
    			set_style(img8, "max-width", "310px");
    			attr_dev(img8, "alt", "bottomstack");
    			attr_dev(img8, "class", "rounded shadow-md");
    			add_location(img8, file$2, 15, 12, 1361);
    			attr_dev(div2, "class", "stack");
    			add_location(div2, file$2, 12, 8, 1049);
    			if (!src_url_equal(img9.src, img9_src_value = "00043261/000432610010.jpg")) attr_dev(img9, "src", img9_src_value);
    			set_style(img9, "max-height", "300px");
    			set_style(img9, "max-width", "300px");
    			attr_dev(img9, "alt", "topstack");
    			attr_dev(img9, "class", "rounded shadow-xl");
    			add_location(img9, file$2, 18, 12, 1545);
    			if (!src_url_equal(img10.src, img10_src_value = "00043261/000432610011.jpg")) attr_dev(img10, "src", img10_src_value);
    			set_style(img10, "max-height", "300px");
    			set_style(img10, "max-width", "305px");
    			attr_dev(img10, "alt", "middlestasck");
    			attr_dev(img10, "class", "rounded shadow-lg");
    			add_location(img10, file$2, 19, 12, 1683);
    			if (!src_url_equal(img11.src, img11_src_value = "00043261/000432610012.jpg")) attr_dev(img11, "src", img11_src_value);
    			set_style(img11, "max-height", "300px");
    			set_style(img11, "max-width", "310px");
    			attr_dev(img11, "alt", "bottomstack");
    			attr_dev(img11, "class", "rounded shadow-md");
    			add_location(img11, file$2, 20, 12, 1825);
    			attr_dev(div3, "class", "stack");
    			add_location(div3, file$2, 17, 8, 1513);
    			if (!src_url_equal(img12.src, img12_src_value = "00043261/000432610013.jpg")) attr_dev(img12, "src", img12_src_value);
    			set_style(img12, "max-height", "300px");
    			set_style(img12, "max-width", "300px");
    			attr_dev(img12, "alt", "topstack");
    			attr_dev(img12, "class", "rounded shadow-xl");
    			add_location(img12, file$2, 23, 12, 2009);
    			if (!src_url_equal(img13.src, img13_src_value = "00043261/000432610014.jpg")) attr_dev(img13, "src", img13_src_value);
    			set_style(img13, "max-height", "300px");
    			set_style(img13, "max-width", "305px");
    			attr_dev(img13, "alt", "middlestasck");
    			attr_dev(img13, "class", "rounded shadow-lg");
    			add_location(img13, file$2, 24, 12, 2147);
    			if (!src_url_equal(img14.src, img14_src_value = "00043261/000432610015.jpg")) attr_dev(img14, "src", img14_src_value);
    			set_style(img14, "max-height", "300px");
    			set_style(img14, "max-width", "310px");
    			attr_dev(img14, "alt", "bottomstack");
    			attr_dev(img14, "class", "rounded shadow-md");
    			add_location(img14, file$2, 25, 12, 2289);
    			attr_dev(div4, "class", "stack");
    			add_location(div4, file$2, 22, 8, 1977);
    			if (!src_url_equal(img15.src, img15_src_value = "00043261/000432610016.jpg")) attr_dev(img15, "src", img15_src_value);
    			set_style(img15, "max-height", "300px");
    			set_style(img15, "max-width", "300px");
    			attr_dev(img15, "alt", "topstack");
    			attr_dev(img15, "class", "rounded shadow-xl");
    			add_location(img15, file$2, 28, 12, 2473);
    			if (!src_url_equal(img16.src, img16_src_value = "00043261/000432610017.jpg")) attr_dev(img16, "src", img16_src_value);
    			set_style(img16, "max-height", "300px");
    			set_style(img16, "max-width", "305px");
    			attr_dev(img16, "alt", "middlestasck");
    			attr_dev(img16, "class", "rounded shadow-lg");
    			add_location(img16, file$2, 29, 12, 2611);
    			if (!src_url_equal(img17.src, img17_src_value = "00043261/000432610018.jpg")) attr_dev(img17, "src", img17_src_value);
    			set_style(img17, "max-height", "300px");
    			set_style(img17, "max-width", "310px");
    			attr_dev(img17, "alt", "bottomstack");
    			attr_dev(img17, "class", "rounded shadow-md");
    			add_location(img17, file$2, 30, 12, 2753);
    			attr_dev(div5, "class", "stack");
    			add_location(div5, file$2, 27, 8, 2441);
    			if (!src_url_equal(img18.src, img18_src_value = "00043261/000432610019.jpg")) attr_dev(img18, "src", img18_src_value);
    			set_style(img18, "max-height", "300px");
    			set_style(img18, "max-width", "300px");
    			attr_dev(img18, "alt", "topstack");
    			attr_dev(img18, "class", "rounded shadow-xl");
    			add_location(img18, file$2, 33, 12, 2937);
    			if (!src_url_equal(img19.src, img19_src_value = "00043261/000432610020.jpg")) attr_dev(img19, "src", img19_src_value);
    			set_style(img19, "max-height", "300px");
    			set_style(img19, "max-width", "305px");
    			attr_dev(img19, "alt", "middlestasck");
    			attr_dev(img19, "class", "rounded shadow-lg");
    			add_location(img19, file$2, 34, 12, 3075);
    			if (!src_url_equal(img20.src, img20_src_value = "00043261/000432610021.jpg")) attr_dev(img20, "src", img20_src_value);
    			set_style(img20, "max-height", "300px");
    			set_style(img20, "max-width", "310px");
    			attr_dev(img20, "alt", "bottomstack");
    			attr_dev(img20, "class", "rounded shadow-md");
    			add_location(img20, file$2, 35, 12, 3217);
    			attr_dev(div6, "class", "stack");
    			add_location(div6, file$2, 32, 8, 2905);
    			if (!src_url_equal(img21.src, img21_src_value = "00043261/000432610022.jpg")) attr_dev(img21, "src", img21_src_value);
    			set_style(img21, "max-height", "300px");
    			set_style(img21, "max-width", "300px");
    			attr_dev(img21, "alt", "topstack");
    			attr_dev(img21, "class", "rounded shadow-xl");
    			add_location(img21, file$2, 38, 12, 3401);
    			if (!src_url_equal(img22.src, img22_src_value = "00043261/000432610023.jpg")) attr_dev(img22, "src", img22_src_value);
    			set_style(img22, "max-height", "300px");
    			set_style(img22, "max-width", "305px");
    			attr_dev(img22, "alt", "middlestasck");
    			attr_dev(img22, "class", "rounded shadow-lg");
    			add_location(img22, file$2, 39, 12, 3539);
    			if (!src_url_equal(img23.src, img23_src_value = "00043261/000432610024.jpg")) attr_dev(img23, "src", img23_src_value);
    			set_style(img23, "max-height", "300px");
    			set_style(img23, "max-width", "310px");
    			attr_dev(img23, "alt", "bottomstack");
    			attr_dev(img23, "class", "rounded shadow-md");
    			add_location(img23, file$2, 40, 12, 3681);
    			attr_dev(div7, "class", "stack");
    			add_location(div7, file$2, 37, 8, 3369);
    			if (!src_url_equal(img24.src, img24_src_value = "00043261/000432610025.jpg")) attr_dev(img24, "src", img24_src_value);
    			set_style(img24, "max-height", "300px");
    			set_style(img24, "max-width", "300px");
    			attr_dev(img24, "alt", "topstack");
    			attr_dev(img24, "class", "rounded shadow-xl");
    			add_location(img24, file$2, 43, 12, 3865);
    			if (!src_url_equal(img25.src, img25_src_value = "00043261/000432610026.jpg")) attr_dev(img25, "src", img25_src_value);
    			set_style(img25, "max-height", "300px");
    			set_style(img25, "max-width", "305px");
    			attr_dev(img25, "alt", "middlestasck");
    			attr_dev(img25, "class", "rounded shadow-lg");
    			add_location(img25, file$2, 44, 12, 4003);
    			if (!src_url_equal(img26.src, img26_src_value = "00043261/000432610027.jpg")) attr_dev(img26, "src", img26_src_value);
    			set_style(img26, "max-height", "300px");
    			set_style(img26, "max-width", "310px");
    			attr_dev(img26, "alt", "bottomstack");
    			attr_dev(img26, "class", "rounded shadow-md");
    			add_location(img26, file$2, 45, 12, 4145);
    			attr_dev(div8, "class", "stack");
    			add_location(div8, file$2, 42, 8, 3833);
    			if (!src_url_equal(img27.src, img27_src_value = "00043261/000432610028.jpg")) attr_dev(img27, "src", img27_src_value);
    			set_style(img27, "max-height", "300px");
    			set_style(img27, "max-width", "300px");
    			attr_dev(img27, "alt", "topstack");
    			attr_dev(img27, "class", "rounded shadow-xl");
    			add_location(img27, file$2, 48, 12, 4329);
    			if (!src_url_equal(img28.src, img28_src_value = "00043261/000432610029.jpg")) attr_dev(img28, "src", img28_src_value);
    			set_style(img28, "max-height", "300px");
    			set_style(img28, "max-width", "305px");
    			attr_dev(img28, "alt", "middlestasck");
    			attr_dev(img28, "class", "rounded shadow-lg");
    			add_location(img28, file$2, 49, 12, 4467);
    			if (!src_url_equal(img29.src, img29_src_value = "00043261/000432610030.jpg")) attr_dev(img29, "src", img29_src_value);
    			set_style(img29, "max-height", "300px");
    			set_style(img29, "max-width", "310px");
    			attr_dev(img29, "alt", "bottomstack");
    			attr_dev(img29, "class", "rounded shadow-md");
    			add_location(img29, file$2, 50, 12, 4609);
    			attr_dev(div9, "class", "stack");
    			add_location(div9, file$2, 47, 8, 4297);
    			attr_dev(div10, "class", "pt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5");
    			add_location(div10, file$2, 1, 4, 11);
    			add_location(body, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div10);
    			append_dev(div10, div0);
    			append_dev(div0, img0);
    			append_dev(div0, t0);
    			append_dev(div0, img1);
    			append_dev(div0, t1);
    			append_dev(div0, img2);
    			append_dev(div10, t2);
    			append_dev(div10, div1);
    			append_dev(div1, img3);
    			append_dev(div1, t3);
    			append_dev(div1, img4);
    			append_dev(div1, t4);
    			append_dev(div1, img5);
    			append_dev(div10, t5);
    			append_dev(div10, div2);
    			append_dev(div2, img6);
    			append_dev(div2, t6);
    			append_dev(div2, img7);
    			append_dev(div2, t7);
    			append_dev(div2, img8);
    			append_dev(div10, t8);
    			append_dev(div10, div3);
    			append_dev(div3, img9);
    			append_dev(div3, t9);
    			append_dev(div3, img10);
    			append_dev(div3, t10);
    			append_dev(div3, img11);
    			append_dev(div10, t11);
    			append_dev(div10, div4);
    			append_dev(div4, img12);
    			append_dev(div4, t12);
    			append_dev(div4, img13);
    			append_dev(div4, t13);
    			append_dev(div4, img14);
    			append_dev(div10, t14);
    			append_dev(div10, div5);
    			append_dev(div5, img15);
    			append_dev(div5, t15);
    			append_dev(div5, img16);
    			append_dev(div5, t16);
    			append_dev(div5, img17);
    			append_dev(div10, t17);
    			append_dev(div10, div6);
    			append_dev(div6, img18);
    			append_dev(div6, t18);
    			append_dev(div6, img19);
    			append_dev(div6, t19);
    			append_dev(div6, img20);
    			append_dev(div10, t20);
    			append_dev(div10, div7);
    			append_dev(div7, img21);
    			append_dev(div7, t21);
    			append_dev(div7, img22);
    			append_dev(div7, t22);
    			append_dev(div7, img23);
    			append_dev(div10, t23);
    			append_dev(div10, div8);
    			append_dev(div8, img24);
    			append_dev(div8, t24);
    			append_dev(div8, img25);
    			append_dev(div8, t25);
    			append_dev(div8, img26);
    			append_dev(div10, t26);
    			append_dev(div10, div9);
    			append_dev(div9, img27);
    			append_dev(div9, t27);
    			append_dev(div9, img28);
    			append_dev(div9, t28);
    			append_dev(div9, img29);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Photography', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Photography> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Photography extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Photography",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Programming.svelte generated by Svelte v3.47.0 */

    const file$1 = "src/Programming.svelte";

    function create_fragment$1(ctx) {
    	let body;
    	let div;
    	let h1;

    	const block = {
    		c: function create() {
    			body = element("body");
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "My Programming Portfolio";
    			attr_dev(h1, "class", "text-bold text-2xl text-white");
    			add_location(h1, file$1, 2, 8, 45);
    			attr_dev(div, "class", "text-center");
    			add_location(div, file$1, 1, 4, 11);
    			add_location(body, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div);
    			append_dev(div, h1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Programming', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Programming> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Programming extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Programming",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.47.0 */
    const file = "src/App.svelte";

    // (91:1) {:else}
    function create_else_block(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Page Not Found";
    			add_location(h1, file, 91, 2, 6383);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(91:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (89:22) 
    function create_if_block_5(ctx) {
    	let contact;
    	let current;
    	contact = new Contact({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(contact.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contact, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contact.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contact.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(contact, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(89:22) ",
    		ctx
    	});

    	return block;
    }

    // (87:22) 
    function create_if_block_4(ctx) {
    	let about;
    	let current;
    	about = new About({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(about.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(about, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(about.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(about.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(about, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(87:22) ",
    		ctx
    	});

    	return block;
    }

    // (85:22) 
    function create_if_block_3(ctx) {
    	let blog;
    	let current;
    	blog = new Blog({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(blog.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(blog, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(blog.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(blog.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(blog, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(85:22) ",
    		ctx
    	});

    	return block;
    }

    // (83:22) 
    function create_if_block_2(ctx) {
    	let programming;
    	let current;
    	programming = new Programming({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(programming.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(programming, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(programming.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(programming.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(programming, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(83:22) ",
    		ctx
    	});

    	return block;
    }

    // (81:22) 
    function create_if_block_1(ctx) {
    	let photography;
    	let current;
    	photography = new Photography({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(photography.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(photography, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(photography.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(photography.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(photography, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(81:22) ",
    		ctx
    	});

    	return block;
    }

    // (79:1) {#if menu === 1}
    function create_if_block(ctx) {
    	let home;
    	let current;
    	home = new Home({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(home.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(79:1) {#if menu === 1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div4;
    	let div1;
    	let div0;
    	let label;
    	let svg0;
    	let path0;
    	let t0;
    	let ul;
    	let li0;
    	let button0;
    	let t2;
    	let li1;
    	let button1;
    	let t4;
    	let li2;
    	let button2;
    	let t6;
    	let li3;
    	let button3;
    	let t8;
    	let li4;
    	let button4;
    	let t10;
    	let li5;
    	let button5;
    	let t12;
    	let div2;
    	let button6;
    	let t14;
    	let div3;
    	let button7;
    	let svg1;
    	let path1;
    	let t15;
    	let button8;
    	let svg2;
    	let path2;
    	let t16;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;

    	const if_block_creators = [
    		create_if_block,
    		create_if_block_1,
    		create_if_block_2,
    		create_if_block_3,
    		create_if_block_4,
    		create_if_block_5,
    		create_else_block
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*menu*/ ctx[0] === 1) return 0;
    		if (/*menu*/ ctx[0] === 2) return 1;
    		if (/*menu*/ ctx[0] === 3) return 2;
    		if (/*menu*/ ctx[0] === 4) return 3;
    		if (/*menu*/ ctx[0] === 5) return 4;
    		if (/*menu*/ ctx[0] === 6) return 5;
    		return 6;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			label = element("label");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t0 = space();
    			ul = element("ul");
    			li0 = element("li");
    			button0 = element("button");
    			button0.textContent = "Homepage";
    			t2 = space();
    			li1 = element("li");
    			button1 = element("button");
    			button1.textContent = "Photography";
    			t4 = space();
    			li2 = element("li");
    			button2 = element("button");
    			button2.textContent = "Programming";
    			t6 = space();
    			li3 = element("li");
    			button3 = element("button");
    			button3.textContent = "Blog";
    			t8 = space();
    			li4 = element("li");
    			button4 = element("button");
    			button4.textContent = "Blog";
    			t10 = space();
    			li5 = element("li");
    			button5 = element("button");
    			button5.textContent = "Contact";
    			t12 = space();
    			div2 = element("div");
    			button6 = element("button");
    			button6.textContent = "nate koch";
    			t14 = space();
    			div3 = element("div");
    			button7 = element("button");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t15 = space();
    			button8 = element("button");
    			svg2 = svg_element("svg");
    			path2 = svg_element("path");
    			t16 = space();
    			if_block.c();
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "stroke-width", "2");
    			attr_dev(path0, "d", "M4 6h16M4 12h16M4 18h7");
    			add_location(path0, file, 54, 108, 2024);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "class", "h-5 w-5");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "stroke", "white");
    			add_location(svg0, file, 54, 5, 1921);
    			attr_dev(label, "tabindex", "0");
    			attr_dev(label, "class", "btn btn-ghost btn-circle");
    			attr_dev(label, "for", "dropdown");
    			add_location(label, file, 53, 3, 1847);
    			attr_dev(button0, "class", "text-white btn btn-ghost normal-case my-1 border-transparent hover:border-accent");
    			set_style(button0, "color", "white");
    			add_location(button0, file, 57, 9, 2248);
    			add_location(li0, file, 57, 5, 2244);
    			attr_dev(button1, "class", "text-white btn btn-ghost normal-case my-1 border-transparent hover:border-accent");
    			set_style(button1, "color", "white");
    			add_location(button1, file, 58, 9, 2441);
    			add_location(li1, file, 58, 5, 2437);
    			attr_dev(button2, "class", "text-white btn btn-ghost normal-case my-1 border-transparent hover:border-accent");
    			set_style(button2, "color", "white");
    			add_location(button2, file, 59, 9, 2637);
    			add_location(li2, file, 59, 5, 2633);
    			attr_dev(button3, "class", "text-white btn btn-ghost normal-case my-1 border-transparent hover:border-accent");
    			set_style(button3, "color", "white");
    			add_location(button3, file, 60, 9, 2833);
    			add_location(li3, file, 60, 5, 2829);
    			attr_dev(button4, "class", "text-white btn btn-ghost normal-case my-1 border-transparent hover:border-accent");
    			set_style(button4, "color", "white");
    			add_location(button4, file, 61, 9, 3022);
    			add_location(li4, file, 61, 5, 3018);
    			attr_dev(button5, "class", "text-white btn btn-ghost normal-case my-1 border-transparent hover:border-accent");
    			set_style(button5, "color", "white");
    			add_location(button5, file, 62, 9, 3211);
    			add_location(li5, file, 62, 5, 3207);
    			attr_dev(ul, "tabindex", "0");
    			attr_dev(ul, "class", "menu dropdown-content mt-3 p-2 shadow bg-secondary rounded-box w-52");
    			add_location(ul, file, 56, 3, 2145);
    			attr_dev(div0, "class", "dropdown");
    			add_location(div0, file, 52, 4, 1821);
    			attr_dev(div1, "class", "navbar-start");
    			add_location(div1, file, 51, 2, 1790);
    			attr_dev(button6, "class", "btn btn-ghost normal-case text-white hover:text-secondary text-xl");
    			add_location(button6, file, 67, 4, 3457);
    			attr_dev(div2, "class", "navbar-center");
    			add_location(div2, file, 66, 2, 3425);
    			attr_dev(path1, "d", "M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z");
    			add_location(path1, file, 71, 308, 3990);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "class", "h-7 w-7");
    			attr_dev(svg1, "viewBox", "0 0 496 512");
    			attr_dev(svg1, "stroke", "white");
    			add_location(svg1, file, 71, 4, 3686);
    			attr_dev(button7, "class", "btn btn-ghost btn-circle");
    			add_location(button7, file, 70, 3, 3640);
    			attr_dev(path2, "d", "M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z");
    			add_location(path2, file, 74, 308, 5679);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "class", "h-7 w-7");
    			attr_dev(svg2, "viewBox", "0 0 448 512");
    			attr_dev(svg2, "stroke", "white");
    			add_location(svg2, file, 74, 4, 5375);
    			attr_dev(button8, "class", "btn btn-ghost btn-circle");
    			add_location(button8, file, 73, 3, 5329);
    			attr_dev(div3, "class", "navbar-end");
    			add_location(div3, file, 69, 2, 3612);
    			attr_dev(div4, "class", "navbar bg-primary rounded-box");
    			add_location(div4, file, 50, 1, 1744);
    			add_location(main, file, 11, 0, 283);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div4);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, label);
    			append_dev(label, svg0);
    			append_dev(svg0, path0);
    			append_dev(div0, t0);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			append_dev(li0, button0);
    			append_dev(ul, t2);
    			append_dev(ul, li1);
    			append_dev(li1, button1);
    			append_dev(ul, t4);
    			append_dev(ul, li2);
    			append_dev(li2, button2);
    			append_dev(ul, t6);
    			append_dev(ul, li3);
    			append_dev(li3, button3);
    			append_dev(ul, t8);
    			append_dev(ul, li4);
    			append_dev(li4, button4);
    			append_dev(ul, t10);
    			append_dev(ul, li5);
    			append_dev(li5, button5);
    			append_dev(div4, t12);
    			append_dev(div4, div2);
    			append_dev(div2, button6);
    			append_dev(div4, t14);
    			append_dev(div4, div3);
    			append_dev(div3, button7);
    			append_dev(button7, svg1);
    			append_dev(svg1, path1);
    			append_dev(div3, t15);
    			append_dev(div3, button8);
    			append_dev(button8, svg2);
    			append_dev(svg2, path2);
    			append_dev(main, t16);
    			if_blocks[current_block_type_index].m(main, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", prevent_default(/*click_handler*/ ctx[1]), false, true, false),
    					listen_dev(button1, "click", prevent_default(/*click_handler_1*/ ctx[2]), false, true, false),
    					listen_dev(button2, "click", prevent_default(/*click_handler_2*/ ctx[3]), false, true, false),
    					listen_dev(button3, "click", prevent_default(/*click_handler_3*/ ctx[4]), false, true, false),
    					listen_dev(button4, "click", prevent_default(/*click_handler_4*/ ctx[5]), false, true, false),
    					listen_dev(button5, "click", prevent_default(/*click_handler_5*/ ctx[6]), false, true, false),
    					listen_dev(button6, "click", prevent_default(/*click_handler_6*/ ctx[7]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
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

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let menu = 2;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, menu = 1);
    	const click_handler_1 = () => $$invalidate(0, menu = 2);
    	const click_handler_2 = () => $$invalidate(0, menu = 3);
    	const click_handler_3 = () => $$invalidate(0, menu = 4);
    	const click_handler_4 = () => $$invalidate(0, menu = 5);
    	const click_handler_5 = () => $$invalidate(0, menu = 6);
    	const click_handler_6 = () => $$invalidate(0, menu = 1);

    	$$self.$capture_state = () => ({
    		Blog,
    		Home,
    		About,
    		Contact,
    		Photography,
    		Programming,
    		menu
    	});

    	$$self.$inject_state = $$props => {
    		if ('menu' in $$props) $$invalidate(0, menu = $$props.menu);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		menu,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
