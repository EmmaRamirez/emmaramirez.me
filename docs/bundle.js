!function(n){function e(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return n[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var t={};e.m=n,e.c=t,e.d=function(n,t,r){e.o(n,t)||Object.defineProperty(n,t,{configurable:!1,enumerable:!0,get:r})},e.n=function(n){var t=n&&n.__esModule?function(){return n.default}:function(){return n};return e.d(t,"a",t),t},e.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},e.p="",e(e.s=5)}([function(n,e){function t(n,e){var t=n[1]||"",o=n[3];if(!o)return t;if(e&&"function"==typeof btoa){var i=r(o);return[t].concat(o.sources.map(function(n){return"/*# sourceURL="+o.sourceRoot+n+" */"})).concat([i]).join("\n")}return[t].join("\n")}function r(n){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(n))))+" */"}n.exports=function(n){var e=[];return e.toString=function(){return this.map(function(e){var r=t(e,n);return e[2]?"@media "+e[2]+"{"+r+"}":r}).join("")},e.i=function(n,t){"string"==typeof n&&(n=[[null,n,""]]);for(var r={},o=0;o<this.length;o++){var i=this[o][0];"number"==typeof i&&(r[i]=!0)}for(o=0;o<n.length;o++){var s=n[o];"number"==typeof s[0]&&r[s[0]]||(t&&!s[2]?s[2]=t:t&&(s[2]="("+s[2]+") and ("+t+")"),e.push(s))}},e}},function(n,e,t){function r(n,e){for(var t=0;t<n.length;t++){var r=n[t],o=h[r.id];if(o){o.refs++;for(var i=0;i<o.parts.length;i++)o.parts[i](r.parts[i]);for(;i<r.parts.length;i++)o.parts.push(u(r.parts[i],e))}else{for(var s=[],i=0;i<r.parts.length;i++)s.push(u(r.parts[i],e));h[r.id]={id:r.id,refs:1,parts:s}}}}function o(n,e){for(var t=[],r={},o=0;o<n.length;o++){var i=n[o],s=e.base?i[0]+e.base:i[0],a=i[1],c=i[2],l=i[3],u={css:a,media:c,sourceMap:l};r[s]?r[s].parts.push(u):t.push(r[s]={id:s,parts:[u]})}return t}function i(n,e){var t=v(n.insertInto);if(!t)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var r=y[y.length-1];if("top"===n.insertAt)r?r.nextSibling?t.insertBefore(e,r.nextSibling):t.appendChild(e):t.insertBefore(e,t.firstChild),y.push(e);else if("bottom"===n.insertAt)t.appendChild(e);else{if("object"!=typeof n.insertAt||!n.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var o=v(n.insertInto+" "+n.insertAt.before);t.insertBefore(e,o)}}function s(n){if(null===n.parentNode)return!1;n.parentNode.removeChild(n);var e=y.indexOf(n);e>=0&&y.splice(e,1)}function a(n){var e=document.createElement("style");return n.attrs.type="text/css",l(e,n.attrs),i(n,e),e}function c(n){var e=document.createElement("link");return n.attrs.type="text/css",n.attrs.rel="stylesheet",l(e,n.attrs),i(n,e),e}function l(n,e){Object.keys(e).forEach(function(t){n.setAttribute(t,e[t])})}function u(n,e){var t,r,o,i;if(e.transform&&n.css){if(!(i=e.transform(n.css)))return function(){};n.css=i}if(e.singleton){var l=g++;t=b||(b=a(e)),r=f.bind(null,t,l,!1),o=f.bind(null,t,l,!0)}else n.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(t=c(e),r=p.bind(null,t,e),o=function(){s(t),t.href&&URL.revokeObjectURL(t.href)}):(t=a(e),r=d.bind(null,t),o=function(){s(t)});return r(n),function(e){if(e){if(e.css===n.css&&e.media===n.media&&e.sourceMap===n.sourceMap)return;r(n=e)}else o()}}function f(n,e,t,r){var o=t?"":r.css;if(n.styleSheet)n.styleSheet.cssText=k(e,o);else{var i=document.createTextNode(o),s=n.childNodes;s[e]&&n.removeChild(s[e]),s.length?n.insertBefore(i,s[e]):n.appendChild(i)}}function d(n,e){var t=e.css,r=e.media;if(r&&n.setAttribute("media",r),n.styleSheet)n.styleSheet.cssText=t;else{for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(document.createTextNode(t))}}function p(n,e,t){var r=t.css,o=t.sourceMap,i=void 0===e.convertToAbsoluteUrls&&o;(e.convertToAbsoluteUrls||i)&&(r=w(r)),o&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var s=new Blob([r],{type:"text/css"}),a=n.href;n.href=URL.createObjectURL(s),a&&URL.revokeObjectURL(a)}var h={},m=function(n){var e;return function(){return void 0===e&&(e=n.apply(this,arguments)),e}}(function(){return window&&document&&document.all&&!window.atob}),v=function(n){var e={};return function(t){if(void 0===e[t]){var r=n.call(this,t);if(r instanceof window.HTMLIFrameElement)try{r=r.contentDocument.head}catch(n){r=null}e[t]=r}return e[t]}}(function(n){return document.querySelector(n)}),b=null,g=0,y=[],w=t(10);n.exports=function(n,e){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");e=e||{},e.attrs="object"==typeof e.attrs?e.attrs:{},e.singleton||"boolean"==typeof e.singleton||(e.singleton=m()),e.insertInto||(e.insertInto="head"),e.insertAt||(e.insertAt="bottom");var t=o(n,e);return r(t,e),function(n){for(var i=[],s=0;s<t.length;s++){var a=t[s],c=h[a.id];c.refs--,i.push(c)}if(n){r(o(n,e),e)}for(var s=0;s<i.length;s++){var c=i[s];if(0===c.refs){for(var l=0;l<c.parts.length;l++)c.parts[l]();delete h[c.id]}}}};var k=function(){var n=[];return function(e,t){return n[e]=t,n.filter(Boolean).join("\n")}}()},function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),t(8);var r=function(){function n(n){this.onStyleSwitch=n,this.onStyleSwitch=n}return n.prototype.postRender=function(){var n=this,e=document.querySelector(".site-style-switcher");null!=e&&e.addEventListener("click",function(t){return n.onStyleSwitch(t,e)})},n.prototype.render=function(){return"<header class='header'><span class='site-title'>🍍 emmaramirez</span><span class='site-style-switcher'>🌙</span></header>"},n}();e.Header=r},function(n,e,t){"use strict";var r=this&&this.__assign||Object.assign||function(n){for(var e,t=1,r=arguments.length;t<r;t++){e=arguments[t];for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(n[o]=e[o])}return n};Object.defineProperty(e,"__esModule",{value:!0}),t(11);var o=function(){function n(n,e){null==e&&(e={}),this.items=n,this.options=r({target:"_self"},e)}return n.prototype.render=function(){var n=this;return"\n            <ul class='list'>\n            "+this.items.map(function(e,t){return"\n                        <li class='list-item' data-key="+t+">\n                            <a href='"+e.link+"' target="+n.options.target+">"+e.title+"</a>\n                            "+(e.wip?"<span class='item-wip-badge'>WIP</span>":"")+"\n                            "+(e.description?"<span class='item-description'>"+e.description+"</span>":"")+"\n                        </li>"}).join("")+"\n            </ul>\n        "},n}();e.List=o},function(n,e){n.exports={articles:[{link:"#",title:"None Yet"}],projects:[{link:"http://emmaramirez.github.io/fakemon-idea-generator/",title:"fakemon idea generator"},{link:"https://github.com/Clickopolis",title:"clickopolis",description:"an incremental empire management game",wip:!0},{link:"https://github.com/EmmaRamirez/nuzlocke-generator",title:"nuzlocke template generator",description:"a nuzlocke documentation engine",wip:!0}],links:[{link:"https://github.com/EmmaRamirez/emmaramirez.me",name:"github"},{link:"https://keybase.io/emmaramirez",name:"keybase"},{link:"https://twitter.com/emmagramirez",name:"twitter"}]}},function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=t(6),o=t(13),i=t(4);t(16),t(18);var s=document.getElementById("app"),a=new r.App(i);o.render(a,s,function(n){return n.postRender()})},function(n,e,t){"use strict";function r(n){for(var t in n)e.hasOwnProperty(t)||(e[t]=n[t])}Object.defineProperty(e,"__esModule",{value:!0}),r(t(7)),r(t(2)),r(t(3))},function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=t(2),o=t(3),i=t(20),s=(t(4),function(){function n(n){var e=this;this.data=n,this.theme="🌙",this.Header=new r.Header(function(n,t){var r=document.body;"🌙"===t.textContent?(e.theme="☀️",t.textContent="☀️",r&&(r.className="dark")):(e.theme="🌙",t.textContent="🌙",r&&(r.className="light"))}),this.data=n||{articles:[],projects:[]}}return n.prototype.render=function(){return"\n            <div class='app'>\n                "+this.Header.render()+"\n                <div class='posts'>\n                    <h2>Writing</h2>\n                    "+new o.List(this.data.articles).render()+"\n                    <h2>Projects</h2>\n                    "+new o.List(this.data.projects,{target:"_blank"}).render()+"\n                    <img style='display: block; margin: 3rem auto' src='./palms.webp' />\n                    <br />\n                    <h2>Elsewhere</h2>\n                    "+new i.ElsewhereLinks(this.data.links,{target:"_blank"}).render()+"\n                    <div class='monospace'>Bitcoin: 16mM8fFqLsAFZ9J6v1Efr3Ba8mT18RuZLW</div>\n                    <div class='monospace'>Ethereum: 0x67cee0981f84Cc86A0eC7491e2d19cd8476d0A42</div>\n                </div>\n            </div>\n        "},n.prototype.postRender=function(){this.Header.postRender()},n}());e.App=s},function(n,e,t){var r=t(9);"string"==typeof r&&(r=[[n.i,r,""]]);var o={hmr:!0};o.transform=void 0;t(1)(r,o);r.locals&&(n.exports=r.locals)},function(n,e,t){e=n.exports=t(0)(void 0),e.push([n.i,".header {\n  border-bottom: 1px solid #eee;\n  display: flex;\n  font-size: 2rem;\n  justify-content: space-around;\n  padding: 0.5rem;\n  width: 100%;\n}\n\n.site-style-switcher {\n  cursor: pointer;\n  user-select: none;\n}\n\n.dark .header {\n  border-bottom: 1px solid #333;\n}",""])},function(n,e){n.exports=function(n){var e="undefined"!=typeof window&&window.location;if(!e)throw new Error("fixUrls requires window.location");if(!n||"string"!=typeof n)return n;var t=e.protocol+"//"+e.host,r=t+e.pathname.replace(/\/[^\/]*$/,"/");return n.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(n,e){var o=e.trim().replace(/^"(.*)"$/,function(n,e){return e}).replace(/^'(.*)'$/,function(n,e){return e});if(/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(o))return n;var i;return i=0===o.indexOf("//")?o:0===o.indexOf("/")?t+o:r+o.replace(/^\.\//,""),"url("+JSON.stringify(i)+")"})}},function(n,e,t){var r=t(12);"string"==typeof r&&(r=[[n.i,r,""]]);var o={hmr:!0};o.transform=void 0;t(1)(r,o);r.locals&&(n.exports=r.locals)},function(n,e,t){e=n.exports=t(0)(void 0),e.push([n.i,".list {\n  font-size: 1.25rem;\n  list-style-type: none;\n  margin: 1rem;\n}\n\n.list-item {\n  margin-bottom: 0.5rem;\n}\n\n.list-item a {\n  color: #222;\n  text-decoration: none;\n}\n\n.list-item a:hover {\n  color: #2c7eff;\n}\n\n.item-description {\n  color: #ccc;\n  font-size: 0.95rem;\n}\n\n.dark .list-item a {\n  color: #fff;\n}\n\n.dark .list-item a:hover {\n  color: #7d95c6;\n}\n\n.item-wip-badge {\n  background: #eee;\n  color: #333;\n  font-size: 0.9rem;\n}\n\n.dark .item-wip-badge {\n  background: rgba(0,0,0,0.3);\n  color: #eee;\n}",""])},function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=t(14);e.noop=r.noop;var o=t(15);e.render=o.render},function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.noop=function(){}},function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.render=function(n,e,t){null!=e&&(e.innerHTML=""+n.render()),setTimeout(function(){return t(n)},1e3)}},function(n,e,t){var r=t(17);"string"==typeof r&&(r=[[n.i,r,""]]);var o={hmr:!0};o.transform=void 0;t(1)(r,o);r.locals&&(n.exports=r.locals)},function(n,e,t){e=n.exports=t(0)(void 0),e.push([n.i,"html,\nbody,\ndiv,\nspan,\nobject,\niframe,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\np,\nblockquote,\npre,\nabbr,\naddress,\ncite,\ncode,\ndel,\ndfn,\nem,\nimg,\nins,\nkbd,\nq,\nsamp,\nsmall,\nstrong,\nsub,\nsup,\nvar,\nb,\ni,\ndl,\ndt,\ndd,\nol,\nul,\nli,\nfieldset,\nform,\nlabel,\nlegend,\ntable,\ncaption,\ntbody,\ntfoot,\nthead,\ntr,\nth,\ntd,\narticle,\naside,\ncanvas,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\nsection,\nsummary,\ntime,\nmark,\naudio,\nvideo {\n  background: transparent;\n  border: 0;\n  font-size: 100%;\n  margin: 0;\n  outline: 0;\n  padding: 0;\n  vertical-align: baseline;\n}\n\nbody {\n  line-height: 1;\n}\n\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\nsection {\n  display: block;\n}\n\nnav ul {\n  list-style: none;\n}\n\nblockquote,\nq {\n  quotes: none;\n}\n\nblockquote:before,\nblockquote:after,\nq:before,\nq:after {\n  content: '';\n  content: none;\n}\n\na {\n  background: transparent;\n  font-size: 100%;\n  margin: 0;\n  padding: 0;\n  vertical-align: baseline;\n}\n\ndel {\n  text-decoration: line-through;\n}\n\nabbr[title],\ndfn[title] {\n  border-bottom: 1px dotted;\n  cursor: help;\n}\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n\nhr {\n  border: 0;\n  border-top: 1px solid #ccc;\n  display: block;\n  height: 1px;\n  margin: 1em 0;\n  padding: 0;\n}\n\ninput,\nselect {\n  vertical-align: middle;\n}",""])},function(n,e,t){var r=t(19);"string"==typeof r&&(r=[[n.i,r,""]]);var o={hmr:!0};o.transform=void 0;t(1)(r,o);r.locals&&(n.exports=r.locals)},function(n,e,t){e=n.exports=t(0)(void 0),e.push([n.i,"body {\n  font-family: 'Open Sans', sans-serif;\n  overflow-x: hidden;\n}\n\nbody.dark {\n  background: #242830;\n  color: #eee;\n}\n\na {\n  color: #121212;\n  text-decoration: none;\n}\n\nh2 {\n  font-size: 1.5rem;\n  font-weight: lighter;\n  margin: 0.25rem;\n}\n\n.posts {\n  margin: 2rem auto;\n  max-width: 40rem;\n}\n\n.monospace {\n  font-family: monospace;\n  margin: 0.5rem;\n}\n\n.elsewhere-link {\n  opacity: 0.85;\n}\n\n.elsewhere-link:hover {\n  opacity: 1;\n}\n\n.dark .elsewhere-link {\n  filter: invert(100%);\n}",""])},function(n,e,t){"use strict";var r=this&&this.__assign||Object.assign||function(n){for(var e,t=1,r=arguments.length;t<r;t++){e=arguments[t];for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(n[o]=e[o])}return n};Object.defineProperty(e,"__esModule",{value:!0});var o=function(){function n(n,e){null==e&&(e={}),this.items=n,this.options=r({target:"_self"},e)}return n.prototype.render=function(){return"\n            <span class='elswhere-links'>\n            "+this.items.map(function(n,e){return"\n                    <a class='elsewhere-link' title="+n.name+" style='margin: .25rem' href="+n.link+">\n                        <img alt="+n.name+" src='./"+n.name+".svg' height='32' />\n                    </a>"}).join("")+"\n            </span>\n        "},n}();e.ElsewhereLinks=o}]);