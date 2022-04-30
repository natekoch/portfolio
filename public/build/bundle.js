var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function a(t){return"function"==typeof t}function r(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function s(t,e){t.appendChild(e)}function c(t,e,n){t.insertBefore(e,n||null)}function i(t){t.parentNode.removeChild(t)}function l(t){return document.createElement(t)}function d(t){return document.createTextNode(t)}function h(){return d(" ")}function u(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function p(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}let m;function g(t){m=t}const f=[],x=[],b=[],y=[],v=Promise.resolve();let w=!1;function k(t){b.push(t)}const $=new Set;let _=0;function M(){const t=m;do{for(;_<f.length;){const t=f[_];_++,g(t),z(t.$$)}for(g(null),f.length=0,_=0;x.length;)x.pop()();for(let t=0;t<b.length;t+=1){const e=b[t];$.has(e)||($.add(e),e())}b.length=0}while(f.length);for(;y.length;)y.pop()();w=!1,$.clear(),g(t)}function z(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(k)}}const j=new Set;let I;function E(t,e){t&&t.i&&(j.delete(t),t.i(e))}function H(t,e,n,o){if(t&&t.o){if(j.has(t))return;j.add(t),I.c.push((()=>{j.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}}function B(t){t&&t.c()}function C(t,n,r,s){const{fragment:c,on_mount:i,on_destroy:l,after_update:d}=t.$$;c&&c.m(n,r),s||k((()=>{const n=i.map(e).filter(a);l?l.push(...n):o(n),t.$$.on_mount=[]})),d.forEach(k)}function P(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function L(t,e){-1===t.$$.dirty[0]&&(f.push(t),w||(w=!0,v.then(M)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function A(e,a,r,s,c,l,d,h=[-1]){const u=m;g(e);const p=e.$$={fragment:null,ctx:null,props:l,update:t,not_equal:c,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(a.context||(u?u.$$.context:[])),callbacks:n(),dirty:h,skip_bound:!1,root:a.target||u.$$.root};d&&d(p.root);let f=!1;if(p.ctx=r?r(e,a.props||{},((t,n,...o)=>{const a=o.length?o[0]:n;return p.ctx&&c(p.ctx[t],p.ctx[t]=a)&&(!p.skip_bound&&p.bound[t]&&p.bound[t](a),f&&L(e,t)),n})):[],p.update(),f=!0,o(p.before_update),p.fragment=!!s&&s(p.ctx),a.target){if(a.hydrate){const t=function(t){return Array.from(t.childNodes)}(a.target);p.fragment&&p.fragment.l(t),t.forEach(i)}else p.fragment&&p.fragment.c();a.intro&&E(e.$$.fragment),C(e,a.target,a.anchor,a.customElement),M()}g(u)}class T{$destroy(){P(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function F(e){let n;return{c(){n=l("body"),n.innerHTML='<div class="flex justify-center"><div class="text-center max-w-3xl"><h1 class="text-bold text-3xl text-primary my-3">Get in contact with me.</h1> \n            <h2 class="text-bold text-2xl text-secondary">I don&#39;t have any social media that I actively look at or anything so email is the best way to reach me with any inquiries.</h2> \n            <h3 class="text-bold text-xl text-accent my-2">Press the button below to send me an email.</h3> \n            <div class="tooltip tooltip-bottom tooltip-secondary" data-tip="nkoch@jaaku.xyz"><a href="mailto:nkoch@jaaku.xyz"><button class="btn btn-secondary btn-sm md:btn-md lg:btn-lg m-4">Email Me</button></a></div></div></div>'},m(t,e){c(t,n,e)},p:t,i:t,o:t,d(t){t&&i(n)}}}function N(e){let n;return{c(){n=l("body"),n.innerHTML='<div class="flex justify-center"><div class="text-center max-w-3xl"><div class="avatar my-3"><div class="w-48 xl:w-64 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"><img src="https://natekochportfolio.s3.us-west-2.amazonaws.com/IMG_0109.JPG" alt="profile picture"/></div></div> \n            <h1 class="text-bold text-2xl text-secondary">Hello There! I am Nate Koch.</h1> \n            <p class="text-lg text-accent">I am currently a third-year computer and information science major with a minor in audio production at the University of Oregon. \n                While I am currently attending school and residing in Eugene, Oregon, I was born and raised in beautiful Portland, Oregon. \n                From a young age, I have always found myself drawn to figuring out how computers and various pieces of technology work. \n                I discovered my passion for computer programming in late middle school. \n                Beyond simply just computers, I have also found a love for music. \n                A love that I find myself an avid listener and creator. \n                I invest time into audio production and sound design through analog and digital methods. \n                I also love exploring nature with the Canon F-1 my late-grandfather gave to me years ago. \n                I have showcased some of my adventures on the photography page of this website. \n                If you have any further questions about me please don&#39;t hesitate to ask by contacting me through the &quot;Contact Me&quot; page on this website.</p></div></div>'},m(t,e){c(t,n,e)},p:t,i:t,o:t,d(t){t&&i(n)}}}function V(e){let n,o,a;return{c(){n=l("body"),o=l("div"),a=l("h1"),a.textContent=`Yes, a blog in ${e[0]}. Welcome.`,p(a,"class","text-bold text-3xl text-secondary"),p(o,"class","text-center")},m(t,e){c(t,n,e),s(n,o),s(o,a)},p:t,i:t,o:t,d(t){t&&i(n)}}}function q(t){return[(new Date).getFullYear()]}function D(e){let n;return{c(){n=l("body"),n.innerHTML='<br/> \n    <div class="text-center"><h1 class="text-bold text-3xl text-primary">My Programming Portfolio</h1> \n        <h2 class="text-xl text-accent">Click on one of the projects below to be taken to the corresponding git repository.</h2></div> \n    <br/> \n    <div class="mockup-code shadow-2xl border-2 border-secondary"><pre data-prefix="$" class="text-accent"><code>cd programming_projects</code></pre>  \n        <pre data-prefix="$" class="text-accent"><code>ls</code></pre>  \n        <a href="https://github.com/natekoch/NextUp" target="_blank" style="text-decoration: none; color: white;"><pre data-prefix="&gt;" class="hover:bg-secondary hover:text-secondary-content"><code>NextUp</code></pre></a> \n        <a href="https://github.com/natekoch/portfolio" target="_blank" style="text-decoration: none; color: white;"><pre data-prefix="&gt;" class="hover:bg-secondary hover:text-secondary-content"><code>portfolio</code></pre></a> \n        <a href="https://github.com/natekoch/LFDucky" target="_blank" style="text-decoration: none; color: white;"><pre data-prefix="&gt;" class="hover:bg-secondary hover:text-secondary-content"><code>LFDucky</code></pre></a> \n        <a href="https://github.com/natekoch/Route-Finder" target="_blank" style="text-decoration: none; color: white;"><pre data-prefix="&gt;" class="hover:bg-secondary hover:text-secondary-content"><code>Route-Finder</code></pre></a> \n        <a href="https://github.com/natekoch/tac" target="_blank" style="text-decoration: none; color: white;"><pre data-prefix="&gt;" class="hover:bg-secondary hover:text-secondary-content"><code>tac</code></pre></a></div>'},m(t,e){c(t,n,e)},p:t,i:t,o:t,d(t){t&&i(n)}}}function O(e){let n;return{c(){n=l("body"),n.innerHTML='<div class="pt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"><div class="stack"><img src="https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610001.jpg" style="max-height: 300px; max-width: 300px;" alt="topstack" class="rounded shadow-xl"/> \n            <img src="https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610002.jpg" style="max-height: 300px; max-width: 305px;" alt="middlestasck" class="rounded shadow-lg"/> \n            <img src="https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610003.jpg" style="max-height: 300px; max-width: 310px;" alt="bottomstack" class="rounded shadow-md"/></div></div>'},m(t,e){c(t,n,e)},p:t,i:t,o:t,d(t){t&&i(n)}}}function W(e){let n;return{c(){n=l("body"),n.innerHTML='<div class="hero rounded-box min-h-screen" style="background-image: url(https://natekochportfolio.s3.us-west-2.amazonaws.com/000432610021.jpg)"><div class="rounded-box hero-overlay bg-opacity-20"></div> \n        <div class="hero-content text-center text-neutral-content"><div class="max-w-md"><img class="mask mask-circle mb-3 mx-auto" src="https://natekochportfolio.s3.us-west-2.amazonaws.com/07EC667B-4464-4ADB-BB23-8B5B0B322D0A_1_105_c.jpeg" style="max-height: 250px; max-width: 250px;" alt="profile picture"/> \n            <h1 class="mb-5 text-4xl sm:text-5xl font-bold">Hello there! I am <span class="text-secondary">Nate Koch</span>. Welcome to my site.</h1> \n            <p class="mb-5">Enjoy your stay, please check out all of the available pages. There are photos to see, programming projects to dive into, a blog to read, and a page all about me. Use the contact page to get in contact with me for whatever your need may be.</p></div></div></div>'},m(t,e){c(t,n,e)},p:t,i:t,o:t,d(t){t&&i(n)}}}const S=[{page:"Homepage",component:class extends T{constructor(t){super(),A(this,t,null,W,r,{})}}},{page:"Photography (WIP)",component:class extends T{constructor(t){super(),A(this,t,null,O,r,{})}}},{page:"Programming",component:class extends T{constructor(t){super(),A(this,t,null,D,r,{})}}},{page:"Blog (WIP)",component:class extends T{constructor(t){super(),A(this,t,q,V,r,{})}}},{page:"About Me",component:class extends T{constructor(t){super(),A(this,t,null,N,r,{})}}},{page:"Contact Me",component:class extends T{constructor(t){super(),A(this,t,null,F,r,{})}}}];function U(t,e,n){const o=t.slice();return o[7]=e[n],o[9]=n,o}function G(e){let n,o,a,r,m,g,f,x=e[7].page+"";return{c(){var t,s,c,i;n=l("li"),o=l("button"),a=d(x),m=h(),p(o,"class","text-white btn btn-ghost normal-case my-1 border-transparent hover:border-accent"),t=o,s="color",null===(c="white")?t.style.removeProperty(s):t.style.setProperty(s,c,i?"important":""),p(o,"id",r=e[9])},m(t,r){c(t,n,r),s(n,o),s(o,a),s(n,m),g||(f=u(o,"click",e[1]),g=!0)},p:t,d(t){t&&i(n),g=!1,f()}}}function K(t){let e,n,a,r,d,m,g,f,x,b,y,v,w,k,$,_,M,z=S,j=[];for(let e=0;e<z.length;e+=1)j[e]=G(U(t,z,e));var L=t[0].component;return L&&(k=new L({})),{c(){e=l("main"),n=l("div"),a=l("div"),r=l("div"),d=l("label"),d.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>',m=h(),g=l("ul");for(let t=0;t<j.length;t+=1)j[t].c();f=h(),x=l("div"),b=l("button"),b.textContent="nate koch",y=h(),v=l("div"),v.innerHTML='<button class="btn btn-ghost btn-circle" onclick="window.open(&#39;https://github.com/natekoch&#39;, &#39;_blank&#39;);"><svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 496 512" style="fill: white;"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg></button> \n\t\t\t<button class="btn btn-ghost btn-circle" onclick="window.open(&#39;https://www.linkedin.com/in/nate-koch&#39;, &#39;_blank&#39;);"><svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 448 512" style="fill: white;"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"></path></svg></button>',w=h(),k&&B(k.$$.fragment),p(d,"tabindex","0"),p(d,"class","btn btn-ghost btn-circle"),p(d,"for","dropdown"),p(g,"tabindex","0"),p(g,"class","menu dropdown-content mt-3 p-2 shadow bg-secondary rounded-box w-52"),p(r,"class","dropdown"),p(a,"class","navbar-start"),p(b,"class","btn btn-ghost normal-case text-white hover:text-secondary text-xl"),p(b,"id","0"),p(x,"class","navbar-center"),p(v,"class","navbar-end"),p(n,"class","navbar bg-primary rounded-box")},m(o,i){c(o,e,i),s(e,n),s(n,a),s(a,r),s(r,d),s(r,m),s(r,g);for(let t=0;t<j.length;t+=1)j[t].m(g,null);s(n,f),s(n,x),s(x,b),s(n,y),s(n,v),s(e,w),k&&C(k,e,null),$=!0,_||(M=u(b,"click",t[1]),_=!0)},p(t,[n]){if(2&n){let e;for(z=S,e=0;e<z.length;e+=1){const o=U(t,z,e);j[e]?j[e].p(o,n):(j[e]=G(o),j[e].c(),j[e].m(g,null))}for(;e<j.length;e+=1)j[e].d(1);j.length=z.length}if(L!==(L=t[0].component)){if(k){I={r:0,c:[],p:I};const t=k;H(t.$$.fragment,1,0,(()=>{P(t,1)})),I.r||o(I.c),I=I.p}L?(k=new L({}),B(k.$$.fragment),E(k.$$.fragment,1),C(k,e,null)):k=null}},i(t){$||(k&&E(k.$$.fragment,t),$=!0)},o(t){k&&H(k.$$.fragment,t),$=!1},d(t){t&&i(e),function(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}(j,t),k&&P(k),_=!1,M()}}}function R(t,e,n){let o=S[0];const a=document.querySelector("html");let r=(new Date).getHours(),s=!1;return s=r<=8||r>=18,s?a.setAttribute("data-theme","forest"):a.setAttribute("data-theme","acid"),[o,function(t){document.activeElement.blur(),n(0,o=S[t.srcElement.id]),t.srcElement.id}]}return new class extends T{constructor(t){super(),A(this,t,R,K,r,{})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map
