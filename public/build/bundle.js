
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
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
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
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
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

    /* src/Contact.svelte generated by Svelte v3.47.0 */

    const file$6 = "src/Contact.svelte";

    function create_fragment$6(ctx) {
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
    			add_location(h1, file$6, 3, 8, 150);
    			attr_dev(button, "class", "btn btn-secondary btn-sm md:btn-md lg:btn-lg m-4");
    			add_location(button, file$6, 5, 12, 275);
    			attr_dev(a, "href", "mailto:nkoch@jaaku.xyz");
    			add_location(a, file$6, 4, 8, 229);
    			attr_dev(div0, "class", "text-center");
    			add_location(div0, file$6, 2, 8, 116);
    			attr_dev(div1, "class", "grid grid-cols-1 grid-rows-2 grid-flow-row-dense place-items-center gap-0 h-screen");
    			add_location(div1, file$6, 1, 4, 11);
    			add_location(body, file$6, 0, 0, 0);
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
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props) {
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
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/About.svelte generated by Svelte v3.47.0 */

    const file$5 = "src/About.svelte";

    function create_fragment$5(ctx) {
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
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/Blog.svelte generated by Svelte v3.47.0 */

    const file$4 = "src/Blog.svelte";

    function create_fragment$4(ctx) {
    	let body;
    	let div;
    	let h1;

    	const block = {
    		c: function create() {
    			body = element("body");
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = `Yes, a blog in ${/*year*/ ctx[0]}. Welcome.`;
    			attr_dev(h1, "class", "text-bold text-3xl text-secondary");
    			add_location(h1, file$4, 7, 2, 121);
    			attr_dev(div, "class", "text-center");
    			add_location(div, file$4, 6, 4, 93);
    			add_location(body, file$4, 5, 0, 82);
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

    function instance$4($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Blog",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/Programming.svelte generated by Svelte v3.47.0 */

    const file$3 = "src/Programming.svelte";

    function create_fragment$3(ctx) {
    	let body;
    	let div;
    	let h1;
    	let t1;
    	let br;
    	let t2;
    	let h2;
    	let t3;
    	let a;
    	let t5;

    	const block = {
    		c: function create() {
    			body = element("body");
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "My Programming Portfolio";
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			h2 = element("h2");
    			t3 = text("This page is currently underdevelopment please instead refer to my ");
    			a = element("a");
    			a.textContent = "github";
    			t5 = text(".");
    			attr_dev(h1, "class", "text-bold text-2xl text-secondary");
    			add_location(h1, file$3, 2, 8, 45);
    			add_location(br, file$3, 3, 8, 129);
    			attr_dev(a, "href", "https://github.com/natekoch");
    			add_location(a, file$3, 4, 107, 241);
    			attr_dev(h2, "class", "text-xl text-accent");
    			add_location(h2, file$3, 4, 8, 142);
    			attr_dev(div, "class", "text-center");
    			add_location(div, file$3, 1, 4, 11);
    			add_location(body, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, br);
    			append_dev(div, t2);
    			append_dev(div, h2);
    			append_dev(h2, t3);
    			append_dev(h2, a);
    			append_dev(h2, t5);
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
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Programming",
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

    /* src/Home.svelte generated by Svelte v3.47.0 */

    const file$1 = "src/Home.svelte";

    function create_fragment$1(ctx) {
    	let body;
    	let div3;
    	let div0;
    	let t0;
    	let div2;
    	let div1;
    	let h1;
    	let t1;
    	let span;
    	let t3;
    	let t4;
    	let p;

    	const block = {
    		c: function create() {
    			body = element("body");
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			h1 = element("h1");
    			t1 = text("Hello there! I am ");
    			span = element("span");
    			span.textContent = "Nate Koch";
    			t3 = text(". Welcome to my site.");
    			t4 = space();
    			p = element("p");
    			p.textContent = "Enjoy your stay, please check out all of the available pages. There are photos to see, programming projects to dive into, a blog to read, and a page all about me. Use the contact page to get in contact with me for whatever your need may be.";
    			attr_dev(div0, "class", "rounded-box hero-overlay bg-opacity-20");
    			add_location(div0, file$1, 2, 8, 120);
    			attr_dev(span, "class", "text-secondary");
    			add_location(span, file$1, 5, 66, 346);
    			attr_dev(h1, "class", "mb-5 text-5xl font-bold");
    			add_location(h1, file$1, 5, 12, 292);
    			attr_dev(p, "class", "mb-5");
    			add_location(p, file$1, 6, 12, 430);
    			attr_dev(div1, "class", "max-w-md");
    			add_location(div1, file$1, 4, 10, 257);
    			attr_dev(div2, "class", "hero-content text-center text-neutral-content");
    			add_location(div2, file$1, 3, 8, 187);
    			attr_dev(div3, "class", "hero rounded-box min-h-screen");
    			set_style(div3, "background-image", "url(00043261/000432610021.jpg)");
    			add_location(div3, file$1, 1, 4, 11);
    			add_location(body, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div3);
    			append_dev(div3, div0);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, h1);
    			append_dev(h1, t1);
    			append_dev(h1, span);
    			append_dev(h1, t3);
    			append_dev(div1, t4);
    			append_dev(div1, p);
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
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/Nav.svelte generated by Svelte v3.47.0 */

    const navOptions = [
    	{ page: 'Homepage', component: Home },
    	{
    		page: 'Photography',
    		component: Photography
    	},
    	{
    		page: 'Programming',
    		component: Programming
    	},
    	{ page: 'Blog', component: Blog },
    	{ page: 'About Me', component: About },
    	{ page: 'Contact Me', component: Contact }
    ];

    /* src/App.svelte generated by Svelte v3.47.0 */
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (21:4) {#each navOptions as option, i}
    function create_each_block(ctx) {
    	let li;
    	let button;
    	let t0_value = /*option*/ ctx[4].page + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(button, "class", "text-white btn btn-ghost normal-case my-1 border-transparent hover:border-accent");
    			set_style(button, "color", "white");
    			attr_dev(button, "id", /*i*/ ctx[6]);
    			add_location(button, file, 22, 5, 789);
    			add_location(li, file, 21, 4, 779);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, button);
    			append_dev(button, t0);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*changePage*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(21:4) {#each navOptions as option, i}",
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
    	let t1;
    	let div2;
    	let button0;
    	let t3;
    	let div3;
    	let button1;
    	let svg1;
    	let path1;
    	let t4;
    	let button2;
    	let svg2;
    	let path2;
    	let t5;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = navOptions;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	var switch_value = /*selected*/ ctx[0].component;

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

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

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "nate koch";
    			t3 = space();
    			div3 = element("div");
    			button1 = element("button");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t4 = space();
    			button2 = element("button");
    			svg2 = svg_element("svg");
    			path2 = svg_element("path");
    			t5 = space();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "stroke-width", "2");
    			attr_dev(path0, "d", "M4 6h16M4 12h16M4 18h7");
    			add_location(path0, file, 17, 108, 524);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "class", "h-5 w-5");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "stroke", "white");
    			add_location(svg0, file, 17, 5, 421);
    			attr_dev(label, "tabindex", "0");
    			attr_dev(label, "class", "btn btn-ghost btn-circle");
    			attr_dev(label, "for", "dropdown");
    			add_location(label, file, 16, 3, 347);
    			attr_dev(ul, "tabindex", "0");
    			attr_dev(ul, "class", "menu dropdown-content mt-3 p-2 shadow bg-secondary rounded-box w-52");
    			add_location(ul, file, 19, 3, 645);
    			attr_dev(div0, "class", "dropdown");
    			add_location(div0, file, 15, 4, 321);
    			attr_dev(div1, "class", "navbar-start");
    			add_location(div1, file, 14, 2, 290);
    			attr_dev(button0, "class", "btn btn-ghost normal-case text-white hover:text-secondary text-xl");
    			add_location(button0, file, 29, 4, 1046);
    			attr_dev(div2, "class", "navbar-center");
    			add_location(div2, file, 28, 2, 1014);
    			attr_dev(path1, "d", "M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z");
    			add_location(path1, file, 33, 314, 1649);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "class", "h-7 w-7");
    			attr_dev(svg1, "viewBox", "0 0 496 512");
    			set_style(svg1, "fill", "white");
    			add_location(svg1, file, 33, 4, 1339);
    			attr_dev(button1, "class", "btn btn-ghost btn-circle");
    			attr_dev(button1, "onclick", "window.open('https://github.com/natekoch', '_blank');");
    			add_location(button1, file, 32, 3, 1229);
    			attr_dev(path2, "d", "M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z");
    			add_location(path2, file, 36, 314, 3418);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "class", "h-7 w-7");
    			attr_dev(svg2, "viewBox", "0 0 448 512");
    			set_style(svg2, "fill", "white");
    			add_location(svg2, file, 36, 4, 3108);
    			attr_dev(button2, "class", "btn btn-ghost btn-circle");
    			attr_dev(button2, "onclick", "window.open('https://www.linkedin.com/in/nate-koch', '_blank');");
    			add_location(button2, file, 35, 3, 2988);
    			attr_dev(div3, "class", "navbar-end");
    			add_location(div3, file, 31, 2, 1201);
    			attr_dev(div4, "class", "navbar bg-primary rounded-box");
    			add_location(div4, file, 13, 1, 244);
    			add_location(main, file, 12, 0, 236);
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

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(div4, t1);
    			append_dev(div4, div2);
    			append_dev(div2, button0);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div3, button1);
    			append_dev(button1, svg1);
    			append_dev(svg1, path1);
    			append_dev(div3, t4);
    			append_dev(div3, button2);
    			append_dev(button2, svg2);
    			append_dev(svg2, path2);
    			append_dev(main, t5);

    			if (switch_instance) {
    				mount_component(switch_instance, main, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button0, "click", prevent_default(/*click_handler*/ ctx[2]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*changePage, navOptions*/ 2) {
    				each_value = navOptions;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (switch_value !== (switch_value = /*selected*/ ctx[0].component)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, main, null);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    			if (switch_instance) destroy_component(switch_instance);
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
    	validate_slots('App', slots, []);
    	let selected = navOptions[0];
    	let intSelected = 0;

    	function changePage(event) {
    		$$invalidate(0, selected = navOptions[event.srcElement.id]);
    		intSelected = event.srcElement.id;
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => menu = 1;

    	$$self.$capture_state = () => ({
    		navOptions,
    		selected,
    		intSelected,
    		changePage
    	});

    	$$self.$inject_state = $$props => {
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('intSelected' in $$props) intSelected = $$props.intSelected;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selected, changePage, click_handler];
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
