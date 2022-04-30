
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
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
    	let div2;
    	let div1;
    	let h1;
    	let t1;
    	let h2;
    	let t3;
    	let h3;
    	let t5;
    	let div0;
    	let a;
    	let button;

    	const block = {
    		c: function create() {
    			body = element("body");
    			div2 = element("div");
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Get in contact with me.";
    			t1 = space();
    			h2 = element("h2");
    			h2.textContent = "I don't have any social media that I actively look at or anything so email is the best way to reach me with any inquiries.";
    			t3 = space();
    			h3 = element("h3");
    			h3.textContent = "Press the button below to send me an email.";
    			t5 = space();
    			div0 = element("div");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Email Me";
    			attr_dev(h1, "class", "text-bold text-3xl text-primary my-3");
    			add_location(h1, file$6, 3, 12, 101);
    			attr_dev(h2, "class", "text-bold text-2xl text-secondary");
    			add_location(h2, file$6, 4, 12, 191);
    			attr_dev(h3, "class", "text-bold text-xl text-accent my-2");
    			add_location(h3, file$6, 5, 12, 377);
    			attr_dev(button, "class", "btn btn-secondary btn-sm md:btn-md lg:btn-lg m-4");
    			add_location(button, file$6, 8, 20, 637);
    			attr_dev(a, "href", "mailto:nkoch@jaaku.xyz");
    			add_location(a, file$6, 7, 16, 583);
    			attr_dev(div0, "class", "tooltip tooltip-bottom tooltip-secondary");
    			attr_dev(div0, "data-tip", "nkoch@jaaku.xyz");
    			add_location(div0, file$6, 6, 12, 485);
    			attr_dev(div1, "class", "text-center max-w-3xl");
    			add_location(div1, file$6, 2, 8, 53);
    			attr_dev(div2, "class", "flex justify-center");
    			add_location(div2, file$6, 1, 4, 11);
    			add_location(body, file$6, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div2);
    			append_dev(div2, div1);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, h2);
    			append_dev(div1, t3);
    			append_dev(div1, h3);
    			append_dev(div1, t5);
    			append_dev(div1, div0);
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
    	let div3;
    	let div2;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let h1;
    	let t2;
    	let p;

    	const block = {
    		c: function create() {
    			body = element("body");
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Hello There! I am Nate Koch.";
    			t2 = space();
    			p = element("p");
    			p.textContent = "I am currently a third-year computer and information science major with a minor in audio production at the University of Oregon. \n                While I am currently attending school and residing in Eugene, Oregon, I was born and raised in beautiful Portland, Oregon. \n                From a young age, I have always found myself drawn to figuring out how computers and various pieces of technology work. \n                I discovered my passion for computer programming in late middle school. \n                Beyond simply just computers, I have also found a love for music. \n                A love that I find myself an avid listener and creator. \n                I invest time into audio production and sound design through analog and digital methods. \n                I also love exploring nature with the Canon F-1 my late-grandfather gave to me years ago. \n                I have showcased some of my adventures on the photography page of this website. \n                If you have any further questions about me please don't hesitate to ask by contacting me through the \"Contact Me\" page on this website.";
    			if (!src_url_equal(img.src, img_src_value = "https://natekochportfolio.s3.us-west-2.amazonaws.com/IMG_0109.JPG")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "profile picture");
    			add_location(img, file$5, 6, 20, 322);
    			attr_dev(div0, "class", "w-48 xl:w-64 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2");
    			add_location(div0, file$5, 4, 16, 143);
    			attr_dev(div1, "class", "avatar my-3");
    			add_location(div1, file$5, 3, 12, 101);
    			attr_dev(h1, "class", "text-bold text-2xl text-secondary");
    			add_location(h1, file$5, 9, 12, 477);
    			attr_dev(p, "class", "text-lg text-accent");
    			add_location(p, file$5, 10, 12, 569);
    			attr_dev(div2, "class", "text-center max-w-3xl");
    			add_location(div2, file$5, 2, 8, 53);
    			attr_dev(div3, "class", "flex justify-center");
    			add_location(div3, file$5, 1, 4, 11);
    			add_location(body, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div2, t0);
    			append_dev(div2, h1);
    			append_dev(div2, t2);
    			append_dev(div2, p);
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
    	let br0;
    	let t0;
    	let div0;
    	let h1;
    	let t2;
    	let h2;
    	let t4;
    	let br1;
    	let t5;
    	let div1;
    	let pre0;
    	let code0;
    	let t7;
    	let pre1;
    	let code1;
    	let t9;
    	let a0;
    	let pre2;
    	let code2;
    	let t11;
    	let a1;
    	let pre3;
    	let code3;
    	let t13;
    	let a2;
    	let pre4;
    	let code4;
    	let t15;
    	let a3;
    	let pre5;
    	let code5;
    	let t17;
    	let a4;
    	let pre6;
    	let code6;

    	const block = {
    		c: function create() {
    			body = element("body");
    			br0 = element("br");
    			t0 = space();
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "My Programming Portfolio";
    			t2 = space();
    			h2 = element("h2");
    			h2.textContent = "Click on one of the projects below to be taken to the corresponding git repository.";
    			t4 = space();
    			br1 = element("br");
    			t5 = space();
    			div1 = element("div");
    			pre0 = element("pre");
    			code0 = element("code");
    			code0.textContent = "cd programming_projects";
    			t7 = space();
    			pre1 = element("pre");
    			code1 = element("code");
    			code1.textContent = "ls";
    			t9 = space();
    			a0 = element("a");
    			pre2 = element("pre");
    			code2 = element("code");
    			code2.textContent = "NextUp";
    			t11 = space();
    			a1 = element("a");
    			pre3 = element("pre");
    			code3 = element("code");
    			code3.textContent = "portfolio";
    			t13 = space();
    			a2 = element("a");
    			pre4 = element("pre");
    			code4 = element("code");
    			code4.textContent = "LFDucky";
    			t15 = space();
    			a3 = element("a");
    			pre5 = element("pre");
    			code5 = element("code");
    			code5.textContent = "Route-Finder";
    			t17 = space();
    			a4 = element("a");
    			pre6 = element("pre");
    			code6 = element("code");
    			code6.textContent = "tac";
    			add_location(br0, file$3, 1, 4, 11);
    			attr_dev(h1, "class", "text-bold text-3xl text-primary");
    			add_location(h1, file$3, 3, 8, 54);
    			attr_dev(h2, "class", "text-xl text-accent");
    			add_location(h2, file$3, 4, 8, 136);
    			attr_dev(div0, "class", "text-center");
    			add_location(div0, file$3, 2, 4, 20);
    			add_location(br1, file$3, 6, 4, 272);
    			add_location(code0, file$3, 8, 49, 393);
    			attr_dev(pre0, "data-prefix", "$");
    			attr_dev(pre0, "class", "text-accent");
    			add_location(pre0, file$3, 8, 8, 352);
    			add_location(code1, file$3, 9, 49, 486);
    			attr_dev(pre1, "data-prefix", "$");
    			attr_dev(pre1, "class", "text-accent");
    			add_location(pre1, file$3, 9, 8, 445);
    			add_location(code2, file$3, 10, 191, 700);
    			attr_dev(pre2, "data-prefix", ">");
    			attr_dev(pre2, "class", "hover:bg-secondary hover:text-secondary-content");
    			add_location(pre2, file$3, 10, 114, 623);
    			attr_dev(a0, "href", "https://github.com/natekoch/NextUp");
    			attr_dev(a0, "target", "_blank");
    			set_style(a0, "text-decoration", "none");
    			set_style(a0, "color", "white");
    			add_location(a0, file$3, 10, 8, 517);
    			add_location(code3, file$3, 11, 194, 924);
    			attr_dev(pre3, "data-prefix", ">");
    			attr_dev(pre3, "class", "hover:bg-secondary hover:text-secondary-content");
    			add_location(pre3, file$3, 11, 117, 847);
    			attr_dev(a1, "href", "https://github.com/natekoch/portfolio");
    			attr_dev(a1, "target", "_blank");
    			set_style(a1, "text-decoration", "none");
    			set_style(a1, "color", "white");
    			add_location(a1, file$3, 11, 8, 738);
    			add_location(code4, file$3, 12, 192, 1149);
    			attr_dev(pre4, "data-prefix", ">");
    			attr_dev(pre4, "class", "hover:bg-secondary hover:text-secondary-content");
    			add_location(pre4, file$3, 12, 115, 1072);
    			attr_dev(a2, "href", "https://github.com/natekoch/LFDucky");
    			attr_dev(a2, "target", "_blank");
    			set_style(a2, "text-decoration", "none");
    			set_style(a2, "color", "white");
    			add_location(a2, file$3, 12, 8, 965);
    			add_location(code5, file$3, 13, 197, 1377);
    			attr_dev(pre5, "data-prefix", ">");
    			attr_dev(pre5, "class", "hover:bg-secondary hover:text-secondary-content");
    			add_location(pre5, file$3, 13, 120, 1300);
    			attr_dev(a3, "href", "https://github.com/natekoch/Route-Finder");
    			attr_dev(a3, "target", "_blank");
    			set_style(a3, "text-decoration", "none");
    			set_style(a3, "color", "white");
    			add_location(a3, file$3, 13, 8, 1188);
    			add_location(code6, file$3, 14, 188, 1601);
    			attr_dev(pre6, "data-prefix", ">");
    			attr_dev(pre6, "class", "hover:bg-secondary hover:text-secondary-content");
    			add_location(pre6, file$3, 14, 111, 1524);
    			attr_dev(a4, "href", "https://github.com/natekoch/tac");
    			attr_dev(a4, "target", "_blank");
    			set_style(a4, "text-decoration", "none");
    			set_style(a4, "color", "white");
    			add_location(a4, file$3, 14, 8, 1421);
    			attr_dev(div1, "class", "mockup-code shadow-2xl border-2 border-secondary");
    			add_location(div1, file$3, 7, 4, 281);
    			add_location(body, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, br0);
    			append_dev(body, t0);
    			append_dev(body, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t2);
    			append_dev(div0, h2);
    			append_dev(body, t4);
    			append_dev(body, br1);
    			append_dev(body, t5);
    			append_dev(body, div1);
    			append_dev(div1, pre0);
    			append_dev(pre0, code0);
    			append_dev(div1, t7);
    			append_dev(div1, pre1);
    			append_dev(pre1, code1);
    			append_dev(div1, t9);
    			append_dev(div1, a0);
    			append_dev(a0, pre2);
    			append_dev(pre2, code2);
    			append_dev(div1, t11);
    			append_dev(div1, a1);
    			append_dev(a1, pre3);
    			append_dev(pre3, code3);
    			append_dev(div1, t13);
    			append_dev(div1, a2);
    			append_dev(a2, pre4);
    			append_dev(pre4, code4);
    			append_dev(div1, t15);
    			append_dev(div1, a3);
    			append_dev(a3, pre5);
    			append_dev(pre5, code5);
    			append_dev(div1, t17);
    			append_dev(div1, a4);
    			append_dev(a4, pre6);
    			append_dev(pre6, code6);
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

    var photos = [
    	{
    		title: "crater lake",
    		url: "https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610001.jpg"
    	},
    	{
    		title: "crater lake",
    		url: "https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610002.jpg"
    	},
    	{
    		title: "crater lake",
    		url: "https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610003.jpg"
    	},
    	{
    		title: "crater lake",
    		url: "https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610004.jpg"
    	},
    	{
    		title: "crater lake",
    		url: "https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610005.jpg"
    	},
    	{
    		title: "crater lake",
    		url: "https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610006.jpg"
    	},
    	{
    		title: "crater lake",
    		url: "https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610007.jpg"
    	},
    	{
    		title: "crater lake",
    		url: "https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610008.jpg"
    	},
    	{
    		title: "crater lake",
    		url: "https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610009.jpg"
    	},
    	{
    		title: "crater lake",
    		url: "https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610010.jpg"
    	},
    	{
    		title: "crater lake",
    		url: "https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610011.jpg"
    	},
    	{
    		title: "crater lake",
    		url: "https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610012.jpg"
    	},
    	{
    		title: "crater lake",
    		url: "https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610013.jpg"
    	},
    	{
    		title: "crater lake",
    		url: "https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610014.jpg"
    	},
    	{
    		title: "crater lake",
    		url: "https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610015.jpg"
    	},
    	{
    		title: "crater lake",
    		url: "https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610016.jpg"
    	},
    	{
    		title: "crater lake",
    		url: "https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610017.jpg"
    	},
    	{
    		title: "crater lake",
    		url: "https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610018.jpg"
    	},
    	{
    		title: "crater lake",
    		url: "https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610019.jpg"
    	},
    	{
    		title: "crater lake",
    		url: "https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610020.jpg"
    	},
    	{
    		title: "crater lake",
    		url: "https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610021.jpg"
    	},
    	{
    		title: "crater lake",
    		url: "https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610022.jpg"
    	},
    	{
    		title: "crater lake",
    		url: "https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610023.jpg"
    	},
    	{
    		title: "crater lake",
    		url: "https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610024.jpg"
    	},
    	{
    		title: "crater lake",
    		url: "https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610025.jpg"
    	},
    	{
    		title: "crater lake",
    		url: "https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610026.jpg"
    	}
    ];

    /* src/Photography.svelte generated by Svelte v3.47.0 */
    const file$2 = "src/Photography.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i];
    	return child_ctx;
    }

    // (11:5) {:else}
    function create_else_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "loading...";
    			add_location(p, file$2, 12, 6, 406);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(11:5) {:else}",
    		ctx
    	});

    	return block;
    }

    // (7:8) {#each photos as photo}
    function create_each_block$1(ctx) {
    	let a;
    	let img;
    	let img_src_value;
    	let t;

    	const block = {
    		c: function create() {
    			a = element("a");
    			img = element("img");
    			t = space();
    			if (!src_url_equal(img.src, img_src_value = /*photo*/ ctx[0].url)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*photo*/ ctx[0].title);
    			attr_dev(img, "class", "rounded shadow-xl");
    			add_location(img, file$2, 8, 10, 245);
    			attr_dev(a, "href", /*photo*/ ctx[0].url);
    			add_location(a, file$2, 7, 12, 214);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, img);
    			append_dev(a, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(7:8) {#each photos as photo}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let body;
    	let div;
    	let each_value = photos;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block(ctx);
    	}

    	const block = {
    		c: function create() {
    			body = element("body");
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			attr_dev(div, "class", "pt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5");
    			add_location(div, file$2, 5, 4, 68);
    			add_location(body, file$2, 4, 0, 57);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*photos*/ 0) {
    				each_value = photos;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;

    				if (!each_value.length && each_1_else) {
    					each_1_else.p(ctx, dirty);
    				} else if (!each_value.length) {
    					each_1_else = create_else_block(ctx);
    					each_1_else.c();
    					each_1_else.m(div, null);
    				} else if (each_1_else) {
    					each_1_else.d(1);
    					each_1_else = null;
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    			destroy_each(each_blocks, detaching);
    			if (each_1_else) each_1_else.d();
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

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Photography', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Photography> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ photos });
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
    	let img;
    	let img_src_value;
    	let t1;
    	let h1;
    	let t2;
    	let span;
    	let t4;
    	let t5;
    	let p;

    	const block = {
    		c: function create() {
    			body = element("body");
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t1 = space();
    			h1 = element("h1");
    			t2 = text("Hello there! I am ");
    			span = element("span");
    			span.textContent = "Nate Koch";
    			t4 = text(". Welcome to my site.");
    			t5 = space();
    			p = element("p");
    			p.textContent = "Enjoy your stay, please check out all of the available pages. There are photos to see, programming projects to dive into, a blog to read, and a page all about me. Use the contact page to get in contact with me for whatever your need may be.";
    			attr_dev(div0, "class", "rounded-box hero-overlay bg-opacity-20");
    			add_location(div0, file$1, 2, 8, 164);
    			attr_dev(img, "class", "mask mask-circle mb-3 mx-auto");
    			if (!src_url_equal(img.src, img_src_value = "https://natekochportfolio.s3.us-west-2.amazonaws.com/07EC667B-4464-4ADB-BB23-8B5B0B322D0A_1_105_c.jpeg")) attr_dev(img, "src", img_src_value);
    			set_style(img, "max-height", "250px");
    			set_style(img, "max-width", "250px");
    			attr_dev(img, "alt", "profile picture");
    			add_location(img, file$1, 6, 12, 394);
    			attr_dev(span, "class", "text-secondary");
    			add_location(span, file$1, 7, 78, 693);
    			attr_dev(h1, "class", "mb-5 text-4xl sm:text-5xl font-bold");
    			add_location(h1, file$1, 7, 12, 627);
    			attr_dev(p, "class", "mb-5");
    			add_location(p, file$1, 8, 12, 777);
    			attr_dev(div1, "class", "max-w-md");
    			add_location(div1, file$1, 4, 10, 301);
    			attr_dev(div2, "class", "hero-content text-center text-neutral-content");
    			add_location(div2, file$1, 3, 8, 231);
    			attr_dev(div3, "class", "hero rounded-box min-h-screen");
    			set_style(div3, "background-image", "url(https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610021.jpg)");
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
    			append_dev(div1, img);
    			append_dev(div1, t1);
    			append_dev(div1, h1);
    			append_dev(h1, t2);
    			append_dev(h1, span);
    			append_dev(h1, t4);
    			append_dev(div1, t5);
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
    		page: 'Photography (WIP)',
    		component: Photography
    	},
    	{
    		page: 'Programming',
    		component: Programming
    	},
    	{ page: 'Blog (WIP)', component: Blog },
    	{ page: 'About Me', component: About },
    	{ page: 'Contact Me', component: Contact }
    ];

    /* src/App.svelte generated by Svelte v3.47.0 */
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (37:4) {#each navOptions as option, i}
    function create_each_block(ctx) {
    	let li;
    	let button;
    	let t0_value = /*option*/ ctx[7].page + "";
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
    			attr_dev(button, "id", /*i*/ ctx[9]);
    			add_location(button, file, 38, 5, 1138);
    			add_location(li, file, 37, 4, 1128);
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
    		source: "(37:4) {#each navOptions as option, i}",
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
    			add_location(path0, file, 33, 108, 873);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "class", "h-5 w-5");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "stroke", "white");
    			add_location(svg0, file, 33, 5, 770);
    			attr_dev(label, "tabindex", "0");
    			attr_dev(label, "class", "btn btn-ghost btn-circle");
    			attr_dev(label, "for", "dropdown");
    			add_location(label, file, 32, 3, 696);
    			attr_dev(ul, "tabindex", "0");
    			attr_dev(ul, "class", "menu dropdown-content mt-3 p-2 shadow bg-secondary rounded-box w-52");
    			add_location(ul, file, 35, 3, 994);
    			attr_dev(div0, "class", "dropdown");
    			add_location(div0, file, 31, 4, 670);
    			attr_dev(div1, "class", "navbar-start");
    			add_location(div1, file, 30, 2, 639);
    			attr_dev(button0, "class", "btn btn-ghost normal-case text-white hover:text-secondary text-xl");
    			attr_dev(button0, "id", "0");
    			add_location(button0, file, 45, 4, 1395);
    			attr_dev(div2, "class", "navbar-center");
    			add_location(div2, file, 44, 2, 1363);
    			attr_dev(path1, "d", "M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z");
    			add_location(path1, file, 49, 314, 1982);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "class", "h-7 w-7");
    			attr_dev(svg1, "viewBox", "0 0 496 512");
    			set_style(svg1, "fill", "white");
    			add_location(svg1, file, 49, 4, 1672);
    			attr_dev(button1, "class", "btn btn-ghost btn-circle");
    			attr_dev(button1, "onclick", "window.open('https://github.com/natekoch', '_blank');");
    			add_location(button1, file, 48, 3, 1562);
    			attr_dev(path2, "d", "M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z");
    			add_location(path2, file, 52, 314, 3751);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "class", "h-7 w-7");
    			attr_dev(svg2, "viewBox", "0 0 448 512");
    			set_style(svg2, "fill", "white");
    			add_location(svg2, file, 52, 4, 3441);
    			attr_dev(button2, "class", "btn btn-ghost btn-circle");
    			attr_dev(button2, "onclick", "window.open('https://www.linkedin.com/in/nate-koch', '_blank');");
    			add_location(button2, file, 51, 3, 3321);
    			attr_dev(div3, "class", "navbar-end");
    			add_location(div3, file, 47, 2, 1534);
    			attr_dev(div4, "class", "navbar bg-primary rounded-box");
    			add_location(div4, file, 29, 1, 593);
    			add_location(main, file, 28, 0, 585);
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
    				dispose = listen_dev(button0, "click", /*changePage*/ ctx[1], false, false, false);
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
    		document.activeElement.blur();
    		$$invalidate(0, selected = navOptions[event.srcElement.id]);
    		intSelected = event.srcElement.id;
    	}

    	const html = document.querySelector("html");
    	let time = new Date();
    	let hours = time.getHours();
    	let darkMode = false;

    	if (hours <= 8 || hours >= 18) {
    		darkMode = true;
    	} else {
    		darkMode = false;
    	}

    	darkMode
    	? html.setAttribute("data-theme", "forest")
    	: html.setAttribute("data-theme", "acid");

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		navOptions,
    		selected,
    		intSelected,
    		changePage,
    		html,
    		time,
    		hours,
    		darkMode
    	});

    	$$self.$inject_state = $$props => {
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('intSelected' in $$props) intSelected = $$props.intSelected;
    		if ('time' in $$props) time = $$props.time;
    		if ('hours' in $$props) hours = $$props.hours;
    		if ('darkMode' in $$props) darkMode = $$props.darkMode;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selected, changePage];
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
