/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/css-loader/index.js!./node_modules/resolve-url-loader/index.js!./node_modules/stylus-loader/index.js!./src/components/Header/Header.styl":
/*!************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/resolve-url-loader!./node_modules/stylus-loader!./src/components/Header/Header.styl ***!
  \************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ \"./node_modules/css-loader/lib/css-base.js\")(undefined);\n// imports\n\n\n// module\nexports.push([module.i, \".header {\\n  border-bottom: 1px solid #eee;\\n  display: flex;\\n  font-size: 2rem;\\n  justify-content: space-around;\\n  padding: 0.5rem;\\n  width: 100%;\\n}\\n\\n.site-style-switcher {\\n  cursor: pointer;\\n  user-select: none;\\n}\\n\\n.dark .header {\\n  border-bottom: 1px solid #333;\\n}\\n\\n.dark .site-title {\\n  color: #eee;\\n}\\n\\n.site-title {\\n  font-weight: 100;\\n}\\n\\n.site-title:hover {\\n  animation: 2s hue infinite alternate;\\n}\\n\\n@-moz-keyframes hue {\\n  0% {\\n    filter: hue-rotate(0deg);\\n  }\\n\\n  100% {\\n    filter: hue-rotate(360deg);\\n  }\\n}\\n\\n@-webkit-keyframes hue {\\n  0% {\\n    filter: hue-rotate(0deg);\\n  }\\n\\n  100% {\\n    filter: hue-rotate(360deg);\\n  }\\n}\\n\\n@-o-keyframes hue {\\n  0% {\\n    filter: hue-rotate(0deg);\\n  }\\n\\n  100% {\\n    filter: hue-rotate(360deg);\\n  }\\n}\\n\\n@keyframes hue {\\n  0% {\\n    filter: hue-rotate(0deg);\\n  }\\n\\n  100% {\\n    filter: hue-rotate(360deg);\\n  }\\n}\", \"\"]);\n\n// exports\n\n\n//# sourceURL=webpack:///./src/components/Header/Header.styl?./node_modules/css-loader!./node_modules/resolve-url-loader!./node_modules/stylus-loader");

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/resolve-url-loader/index.js!./node_modules/stylus-loader/index.js!./src/components/List/List.styl":
/*!********************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/resolve-url-loader!./node_modules/stylus-loader!./src/components/List/List.styl ***!
  \********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ \"./node_modules/css-loader/lib/css-base.js\")(undefined);\n// imports\n\n\n// module\nexports.push([module.i, \".list {\\n  font-size: 1.25rem;\\n  list-style-type: none;\\n  margin: 1rem;\\n}\\n\\n.list-item {\\n  margin-bottom: 1em;\\n  position: relative;\\n}\\n\\n@media screen and (max-width: 640px) {\\n  .list-item {\\n    margin: 0.5rem;\\n  }\\n}\\n\\n.list-item a {\\n  color: #222;\\n  text-decoration: none;\\n}\\n\\n.list-item a:hover {\\n  color: #2c7eff;\\n}\\n\\n.list-item:hover .project-overlay .tags .tag {\\n  border: 1px solid transparent;\\n  color: #111;\\n}\\n\\n.list-item:hover .tags .tag:nth-child(1) {\\n  transition-delay: 20ms;\\n  background-color: #e8bd7d;\\n}\\n\\n.list-item:hover .tags .tag:nth-child(2) {\\n  transition-delay: 40ms;\\n  background-color: #d3e87d;\\n}\\n\\n.list-item:hover .tags .tag:nth-child(3) {\\n  transition-delay: 60ms;\\n  background-color: #92e87d;\\n}\\n\\n.list-item:hover .tags .tag:nth-child(4) {\\n  transition-delay: 80ms;\\n  background-color: #7de8a8;\\n}\\n\\n.list-item:hover .tags .tag:nth-child(5) {\\n  transition-delay: 100ms;\\n  background-color: #7de8e8;\\n}\\n\\n.list-item:hover .tags .tag:nth-child(6) {\\n  transition-delay: 120ms;\\n  background-color: #7da8e8;\\n}\\n\\n.list-item:hover .tags .tag:nth-child(7) {\\n  transition-delay: 140ms;\\n  background-color: #927de8;\\n}\\n\\n.list-item:hover .tags .tag:nth-child(8) {\\n  transition-delay: 160ms;\\n  background-color: #d37de8;\\n}\\n\\n.list-item:hover .tags .tag:nth-child(9) {\\n  transition-delay: 180ms;\\n  background-color: #e87dbd;\\n}\\n\\n.list-item:hover .tags .tag:nth-child(10) {\\n  transition-delay: 200ms;\\n  background-color: #e87d7d;\\n}\\n\\n.item-description,\\n.item-date {\\n  color: #666;\\n  font-size: 0.95rem;\\n}\\n\\n.item-emoji {\\n  display: inline-block;\\n  margin-left: -2.5rem;\\n  text-align: right;\\n  width: 2.25rem;\\n}\\n\\n.item-date {\\n  font-family: monospace;\\n}\\n\\n.dark .list-item a {\\n  color: #fff;\\n}\\n\\n.dark .list-item a:hover {\\n  color: #7d95c6;\\n}\\n\\n.item-wip-badge {\\n  background: #eee;\\n  color: #333;\\n  font-size: 0.9rem;\\n}\\n\\n.dark .item-wip-badge {\\n  background: rgba(0,0,0,0.3);\\n  color: #eee;\\n}\\n\\n.item-last-updated {\\n  position: absolute;\\n  right: 0.5rem;\\n  top: 0.5rem;\\n}\\n\\n.projects {\\n  display: flex;\\n  flex-wrap: wrap;\\n}\\n\\n@media screen and (max-width: 640px) {\\n  .projects {\\n    flex-wrap: wrap;\\n  }\\n}\\n\\n.projects .item-emoji,\\n.projects .item-description,\\n.projects .item-link {\\n  background: #222;\\n}\\n\\n.projects .list-item {\\n  background: #fafafa;\\n  background-size: cover;\\n  border: 1px solid #eee;\\n  border-radius: 0.25rem;\\n  flex-wrap: wrap;\\n  height: 12rem;\\n  margin: 0.25rem;\\n  overflow: hidden;\\n  transition: 350ms all;\\n  width: 36rem;\\n}\\n\\n@media screen and (max-width: 640px) {\\n  .projects .list-item {\\n    width: 45%;\\n  }\\n}\\n\\n.projects .list-item:hover {\\n  border: 1px solid #ddd;\\n  box-shadow: 0 0 3px #eee;\\n  transition: 350ms all;\\n}\\n\\n.projects .item-emoji {\\n  all: initial;\\n  align-content: center;\\n  border-radius: 50%;\\n  display: flex;\\n  font-size: 1.25rem;\\n  justify-content: center;\\n  padding: 0.25rem;\\n  text-align: center;\\n}\\n\\n.projects .project-overlay {\\n  align-items: center;\\n  background: rgba(0,0,0,0.75);\\n  color: #fff !important;\\n  cursor: pointer;\\n  display: flex;\\n  justify-content: flex-start;\\n  padding: 3rem;\\n  height: 100%;\\n  width: 100%;\\n}\\n\\n.projects .project-overlay h4 {\\n  align-items: center;\\n  display: flex;\\n}\\n\\n.projects .project-overlay p {\\n  margin: 0;\\n}\\n\\n.projects .project-overlay .tags .tag {\\n  background: transparent;\\n  border: 1px solid #fff;\\n  color: #fff;\\n  border-radius: 1rem;\\n  padding: 0.25rem 1rem;\\n  transition: 300ms all;\\n}\\n\\n.projects .project-overlay .item-wip-badge {\\n  background: #fff;\\n  border-radius: 1rem;\\n  display: block;\\n  margin-left: 0.5rem;\\n  padding: 0.25rem 1rem;\\n}\\n\\n.projects .project-overlay:hover {\\n  color: #fff !important;\\n}\", \"\"]);\n\n// exports\n\n\n//# sourceURL=webpack:///./src/components/List/List.styl?./node_modules/css-loader!./node_modules/resolve-url-loader!./node_modules/stylus-loader");

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/resolve-url-loader/index.js!./node_modules/stylus-loader/index.js!./src/components/Tags/Tags.styl":
/*!********************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/resolve-url-loader!./node_modules/stylus-loader!./src/components/Tags/Tags.styl ***!
  \********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ \"./node_modules/css-loader/lib/css-base.js\")(undefined);\n// imports\n\n\n// module\nexports.push([module.i, \".tags {\\n  display: flex;\\n  justify-content: flex-start;\\n  margin-top: 0.5rem;\\n}\\n\\n.tags .tag {\\n  background: #eee;\\n  border-radius: 0.5rem;\\n  color: #555;\\n  display: span;\\n  font-size: 0.95rem;\\n  margin-right: 0.25rem;\\n  padding: 0.25rem 0.5rem;\\n  transition: 250ms all;\\n}\", \"\"]);\n\n// exports\n\n\n//# sourceURL=webpack:///./src/components/Tags/Tags.styl?./node_modules/css-loader!./node_modules/resolve-url-loader!./node_modules/stylus-loader");

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/resolve-url-loader/index.js!./node_modules/stylus-loader/index.js!./src/global.styl":
/*!******************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/resolve-url-loader!./node_modules/stylus-loader!./src/global.styl ***!
  \******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(/*! ../node_modules/css-loader/lib/css-base.js */ \"./node_modules/css-loader/lib/css-base.js\")(undefined);\n// imports\nexports.push([module.i, \"@import url(https://cdn.rawgit.com/tonsky/FiraCode/1.204/distr/fira_code.css);\", \"\"]);\n\n// module\nexports.push([module.i, \"::-moz-selection {\\n  color: #242830;\\n  background: #42f4f4;\\n}\\n\\n::selection {\\n  color: darkc-olor;\\n  background: #42f4f4;\\n}\\n\\nbody {\\n  font-family: 'Open Sans', sans-serif;\\n  overflow-x: hidden;\\n}\\n\\nbody.dark {\\n  background: #242830;\\n  color: #eee;\\n}\\n\\n@media screen and (max-width: 640px) {\\n  body {\\n    font-size: 20px;\\n  }\\n}\\n\\na {\\n  color: #121212;\\n  text-decoration: none;\\n}\\n\\n@media screen and (max-width: 640px) {\\n  .palm-trees {\\n    width: 100%;\\n  }\\n}\\n\\nh2 {\\n  font-size: 1.5rem;\\n  font-weight: lighter;\\n  margin: 0.25rem;\\n}\\n\\n.posts {\\n  margin: 0 auto;\\n  max-width: 40rem;\\n}\\n\\n.button-container {\\n  background: #eee;\\n  display: flex;\\n  margin: 0 auto;\\n  justify-content: center;\\n  max-width: 20rem;\\n  padding: 0.5rem;\\n}\\n\\nbutton {\\n  background: #355ce3;\\n  color: #fff;\\n  border: 1px solid #ddd;\\n  border-radius: 0.25rem;\\n  padding: 0.25rem;\\n  font-size: 1rem;\\n  margin: 0.25rem;\\n  text-align: center;\\n  transition: 250ms all;\\n}\\n\\nbutton:hover {\\n  background: ligthen(#355ce3, 10%);\\n  transition: 250ms all;\\n}\\n\\ndialog {\\n  box-shadow: 0 0 4px rgba(0,0,0,0.33);\\n  border-radius: 0.5rem;\\n  border: 1px solid #ccc;\\n  max-width: 50rem;\\n  position: fixed;\\n  top: 15rem;\\n  left: auto;\\n  right: auto;\\n  z-index: 10;\\n}\\n\\ndialog button {\\n  margin: 0 auto;\\n  display: block;\\n}\\n\\n.monospace {\\n  font-family: monospace;\\n  margin: 0.5rem;\\n}\\n\\n.elsewhere-link {\\n  opacity: 0.85;\\n}\\n\\n.elsewhere-link:hover {\\n  opacity: 1;\\n}\\n\\n.dark .elsewhere-link {\\n  filter: invert(100%);\\n}\\n\\n.blog-post {\\n  font-size: 1.15rem;\\n  margin: 0 auto;\\n  max-width: 55rem;\\n  padding: 0 1rem;\\n  padding-bottom: 5rem;\\n}\\n\\n.blog-post h1 {\\n  font-size: 2rem;\\n  font-weight: light;\\n  margin-bottom: 1rem;\\n  margin-left: 1rem;\\n  margin-top: 3rem;\\n}\\n\\n.blog-post h2 {\\n  margin-top: 2rem;\\n  margin-left: 1rem;\\n}\\n\\n.blog-post blockquote {\\n  color: #444;\\n  border-left: 0.25rem solid #ccc;\\n}\\n\\n.blog-post blockquote p {\\n  padding: 0.25rem;\\n}\\n\\n.blog-post p {\\n  font-size: 1.25rem;\\n  line-height: 1.4;\\n  margin: 1rem;\\n}\\n\\n.blog-post code {\\n  background: #eee;\\n  font-family: 'Fira Code';\\n  font-size: 1rem;\\n}\\n\\n.blog-post pre {\\n  background: #1d1f21;\\n  font-family: 'Fira Code';\\n  line-height: 1.45;\\n  margin-left: 2rem;\\n  padding: 0.5rem;\\n}\\n\\n.blog-post pre code {\\n  background: transparent;\\n  display: block;\\n  font-family: 'Fira Code';\\n}\\n\\n.markdown-body ul {\\n  font-size: 1.15rem;\\n  line-height: 1.4;\\n  padding-left: 4rem;\\n}\\n\\n.markdown-body img {\\n  width: 100%;\\n}\\n\\n.markdown-body .caption {\\n  color: #bbb;\\n  font-size: 80%;\\n  text-align: center;\\n}\\n\\n.markdown-body .blog-post a {\\n  color: #4286f4;\\n}\\n\\n.dark .blog-post code {\\n  background: #20242b;\\n  color: #fff;\\n  outline: 1px solid #2e2c2c;\\n}\\n\\n.stats {\\n  background: #efefef;\\n  bottom: 0;\\n  left: 0;\\n  position: fixed;\\n  text-align: center;\\n  width: 100%;\\n}\\n\\n.dark .stats {\\n  background: rgba(0,0,0,0.3);\\n}\\n\\n#disqus_thread {\\n  margin: 0 auto;\\n  max-width: 50rem;\\n}\", \"\"]);\n\n// exports\n\n\n//# sourceURL=webpack:///./src/global.styl?./node_modules/css-loader!./node_modules/resolve-url-loader!./node_modules/stylus-loader");

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/resolve-url-loader/index.js!./node_modules/stylus-loader/index.js!./src/reset.styl":
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/resolve-url-loader!./node_modules/stylus-loader!./src/reset.styl ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(/*! ../node_modules/css-loader/lib/css-base.js */ \"./node_modules/css-loader/lib/css-base.js\")(undefined);\n// imports\n\n\n// module\nexports.push([module.i, \"*,\\n*::before,\\n*::after {\\n  box-sizing: border-box;\\n}\\n\\nhtml,\\nbody,\\ndiv,\\nspan,\\nobject,\\niframe,\\nh1,\\nh2,\\nh3,\\nh4,\\nh5,\\nh6,\\np,\\nblockquote,\\npre,\\nabbr,\\naddress,\\ncite,\\ncode,\\ndel,\\ndfn,\\nem,\\nimg,\\nins,\\nkbd,\\nq,\\nsamp,\\nsmall,\\nstrong,\\nsub,\\nsup,\\nvar,\\nb,\\ni,\\ndl,\\ndt,\\ndd,\\nol,\\nul,\\nli,\\nfieldset,\\nform,\\nlabel,\\nlegend,\\ntable,\\ncaption,\\ntbody,\\ntfoot,\\nthead,\\ntr,\\nth,\\ntd,\\narticle,\\naside,\\ncanvas,\\ndetails,\\nfigcaption,\\nfigure,\\nfooter,\\nheader,\\nhgroup,\\nmenu,\\nnav,\\nsection,\\nsummary,\\ntime,\\nmark,\\naudio,\\nvideo {\\n  background: transparent;\\n  border: 0;\\n  font-size: 100%;\\n  margin: 0;\\n  outline: 0;\\n  padding: 0;\\n  vertical-align: baseline;\\n}\\n\\nbody {\\n  line-height: 1;\\n}\\n\\narticle,\\naside,\\ndetails,\\nfigcaption,\\nfigure,\\nfooter,\\nheader,\\nhgroup,\\nmenu,\\nnav,\\nsection {\\n  display: block;\\n}\\n\\nnav ul {\\n  list-style: none;\\n}\\n\\nblockquote,\\nq {\\n  quotes: none;\\n}\\n\\nblockquote:before,\\nblockquote:after,\\nq:before,\\nq:after {\\n  content: '';\\n  content: none;\\n}\\n\\na {\\n  background: transparent;\\n  font-size: 100%;\\n  margin: 0;\\n  padding: 0;\\n  vertical-align: baseline;\\n}\\n\\ndel {\\n  text-decoration: line-through;\\n}\\n\\nabbr[title],\\ndfn[title] {\\n  border-bottom: 1px dotted;\\n  cursor: help;\\n}\\n\\ntable {\\n  border-collapse: collapse;\\n  border-spacing: 0;\\n}\\n\\nhr {\\n  border: 0;\\n  border-top: 1px solid #ccc;\\n  display: block;\\n  height: 1px;\\n  margin: 1em 0;\\n  padding: 0;\\n}\\n\\ninput,\\nselect {\\n  vertical-align: middle;\\n}\", \"\"]);\n\n// exports\n\n\n//# sourceURL=webpack:///./src/reset.styl?./node_modules/css-loader!./node_modules/resolve-url-loader!./node_modules/stylus-loader");

/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/*!*************************************************!*\
  !*** ./node_modules/css-loader/lib/css-base.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\n// css base code, injected by the css-loader\nmodule.exports = function(useSourceMap) {\n\tvar list = [];\n\n\t// return the list of modules as css string\n\tlist.toString = function toString() {\n\t\treturn this.map(function (item) {\n\t\t\tvar content = cssWithMappingToString(item, useSourceMap);\n\t\t\tif(item[2]) {\n\t\t\t\treturn \"@media \" + item[2] + \"{\" + content + \"}\";\n\t\t\t} else {\n\t\t\t\treturn content;\n\t\t\t}\n\t\t}).join(\"\");\n\t};\n\n\t// import a list of modules into the list\n\tlist.i = function(modules, mediaQuery) {\n\t\tif(typeof modules === \"string\")\n\t\t\tmodules = [[null, modules, \"\"]];\n\t\tvar alreadyImportedModules = {};\n\t\tfor(var i = 0; i < this.length; i++) {\n\t\t\tvar id = this[i][0];\n\t\t\tif(typeof id === \"number\")\n\t\t\t\talreadyImportedModules[id] = true;\n\t\t}\n\t\tfor(i = 0; i < modules.length; i++) {\n\t\t\tvar item = modules[i];\n\t\t\t// skip already imported module\n\t\t\t// this implementation is not 100% perfect for weird media query combinations\n\t\t\t//  when a module is imported multiple times with different media queries.\n\t\t\t//  I hope this will never occur (Hey this way we have smaller bundles)\n\t\t\tif(typeof item[0] !== \"number\" || !alreadyImportedModules[item[0]]) {\n\t\t\t\tif(mediaQuery && !item[2]) {\n\t\t\t\t\titem[2] = mediaQuery;\n\t\t\t\t} else if(mediaQuery) {\n\t\t\t\t\titem[2] = \"(\" + item[2] + \") and (\" + mediaQuery + \")\";\n\t\t\t\t}\n\t\t\t\tlist.push(item);\n\t\t\t}\n\t\t}\n\t};\n\treturn list;\n};\n\nfunction cssWithMappingToString(item, useSourceMap) {\n\tvar content = item[1] || '';\n\tvar cssMapping = item[3];\n\tif (!cssMapping) {\n\t\treturn content;\n\t}\n\n\tif (useSourceMap && typeof btoa === 'function') {\n\t\tvar sourceMapping = toComment(cssMapping);\n\t\tvar sourceURLs = cssMapping.sources.map(function (source) {\n\t\t\treturn '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'\n\t\t});\n\n\t\treturn [content].concat(sourceURLs).concat([sourceMapping]).join('\\n');\n\t}\n\n\treturn [content].join('\\n');\n}\n\n// Adapted from convert-source-map (MIT)\nfunction toComment(sourceMap) {\n\t// eslint-disable-next-line no-undef\n\tvar base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));\n\tvar data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;\n\n\treturn '/*# ' + data + ' */';\n}\n\n\n//# sourceURL=webpack:///./node_modules/css-loader/lib/css-base.js?");

/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/*!****************************************************!*\
  !*** ./node_modules/style-loader/lib/addStyles.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\n\nvar stylesInDom = {};\n\nvar\tmemoize = function (fn) {\n\tvar memo;\n\n\treturn function () {\n\t\tif (typeof memo === \"undefined\") memo = fn.apply(this, arguments);\n\t\treturn memo;\n\t};\n};\n\nvar isOldIE = memoize(function () {\n\t// Test for IE <= 9 as proposed by Browserhacks\n\t// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805\n\t// Tests for existence of standard globals is to allow style-loader\n\t// to operate correctly into non-standard environments\n\t// @see https://github.com/webpack-contrib/style-loader/issues/177\n\treturn window && document && document.all && !window.atob;\n});\n\nvar getElement = (function (fn) {\n\tvar memo = {};\n\n\treturn function(selector) {\n\t\tif (typeof memo[selector] === \"undefined\") {\n\t\t\tvar styleTarget = fn.call(this, selector);\n\t\t\t// Special case to return head of iframe instead of iframe itself\n\t\t\tif (styleTarget instanceof window.HTMLIFrameElement) {\n\t\t\t\ttry {\n\t\t\t\t\t// This will throw an exception if access to iframe is blocked\n\t\t\t\t\t// due to cross-origin restrictions\n\t\t\t\t\tstyleTarget = styleTarget.contentDocument.head;\n\t\t\t\t} catch(e) {\n\t\t\t\t\tstyleTarget = null;\n\t\t\t\t}\n\t\t\t}\n\t\t\tmemo[selector] = styleTarget;\n\t\t}\n\t\treturn memo[selector]\n\t};\n})(function (target) {\n\treturn document.querySelector(target)\n});\n\nvar singleton = null;\nvar\tsingletonCounter = 0;\nvar\tstylesInsertedAtTop = [];\n\nvar\tfixUrls = __webpack_require__(/*! ./urls */ \"./node_modules/style-loader/lib/urls.js\");\n\nmodule.exports = function(list, options) {\n\tif (typeof DEBUG !== \"undefined\" && DEBUG) {\n\t\tif (typeof document !== \"object\") throw new Error(\"The style-loader cannot be used in a non-browser environment\");\n\t}\n\n\toptions = options || {};\n\n\toptions.attrs = typeof options.attrs === \"object\" ? options.attrs : {};\n\n\t// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>\n\t// tags it will allow on a page\n\tif (!options.singleton && typeof options.singleton !== \"boolean\") options.singleton = isOldIE();\n\n\t// By default, add <style> tags to the <head> element\n\tif (!options.insertInto) options.insertInto = \"head\";\n\n\t// By default, add <style> tags to the bottom of the target\n\tif (!options.insertAt) options.insertAt = \"bottom\";\n\n\tvar styles = listToStyles(list, options);\n\n\taddStylesToDom(styles, options);\n\n\treturn function update (newList) {\n\t\tvar mayRemove = [];\n\n\t\tfor (var i = 0; i < styles.length; i++) {\n\t\t\tvar item = styles[i];\n\t\t\tvar domStyle = stylesInDom[item.id];\n\n\t\t\tdomStyle.refs--;\n\t\t\tmayRemove.push(domStyle);\n\t\t}\n\n\t\tif(newList) {\n\t\t\tvar newStyles = listToStyles(newList, options);\n\t\t\taddStylesToDom(newStyles, options);\n\t\t}\n\n\t\tfor (var i = 0; i < mayRemove.length; i++) {\n\t\t\tvar domStyle = mayRemove[i];\n\n\t\t\tif(domStyle.refs === 0) {\n\t\t\t\tfor (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();\n\n\t\t\t\tdelete stylesInDom[domStyle.id];\n\t\t\t}\n\t\t}\n\t};\n};\n\nfunction addStylesToDom (styles, options) {\n\tfor (var i = 0; i < styles.length; i++) {\n\t\tvar item = styles[i];\n\t\tvar domStyle = stylesInDom[item.id];\n\n\t\tif(domStyle) {\n\t\t\tdomStyle.refs++;\n\n\t\t\tfor(var j = 0; j < domStyle.parts.length; j++) {\n\t\t\t\tdomStyle.parts[j](item.parts[j]);\n\t\t\t}\n\n\t\t\tfor(; j < item.parts.length; j++) {\n\t\t\t\tdomStyle.parts.push(addStyle(item.parts[j], options));\n\t\t\t}\n\t\t} else {\n\t\t\tvar parts = [];\n\n\t\t\tfor(var j = 0; j < item.parts.length; j++) {\n\t\t\t\tparts.push(addStyle(item.parts[j], options));\n\t\t\t}\n\n\t\t\tstylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};\n\t\t}\n\t}\n}\n\nfunction listToStyles (list, options) {\n\tvar styles = [];\n\tvar newStyles = {};\n\n\tfor (var i = 0; i < list.length; i++) {\n\t\tvar item = list[i];\n\t\tvar id = options.base ? item[0] + options.base : item[0];\n\t\tvar css = item[1];\n\t\tvar media = item[2];\n\t\tvar sourceMap = item[3];\n\t\tvar part = {css: css, media: media, sourceMap: sourceMap};\n\n\t\tif(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});\n\t\telse newStyles[id].parts.push(part);\n\t}\n\n\treturn styles;\n}\n\nfunction insertStyleElement (options, style) {\n\tvar target = getElement(options.insertInto)\n\n\tif (!target) {\n\t\tthrow new Error(\"Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.\");\n\t}\n\n\tvar lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];\n\n\tif (options.insertAt === \"top\") {\n\t\tif (!lastStyleElementInsertedAtTop) {\n\t\t\ttarget.insertBefore(style, target.firstChild);\n\t\t} else if (lastStyleElementInsertedAtTop.nextSibling) {\n\t\t\ttarget.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);\n\t\t} else {\n\t\t\ttarget.appendChild(style);\n\t\t}\n\t\tstylesInsertedAtTop.push(style);\n\t} else if (options.insertAt === \"bottom\") {\n\t\ttarget.appendChild(style);\n\t} else if (typeof options.insertAt === \"object\" && options.insertAt.before) {\n\t\tvar nextSibling = getElement(options.insertInto + \" \" + options.insertAt.before);\n\t\ttarget.insertBefore(style, nextSibling);\n\t} else {\n\t\tthrow new Error(\"[Style Loader]\\n\\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\\n Must be 'top', 'bottom', or Object.\\n (https://github.com/webpack-contrib/style-loader#insertat)\\n\");\n\t}\n}\n\nfunction removeStyleElement (style) {\n\tif (style.parentNode === null) return false;\n\tstyle.parentNode.removeChild(style);\n\n\tvar idx = stylesInsertedAtTop.indexOf(style);\n\tif(idx >= 0) {\n\t\tstylesInsertedAtTop.splice(idx, 1);\n\t}\n}\n\nfunction createStyleElement (options) {\n\tvar style = document.createElement(\"style\");\n\n\toptions.attrs.type = \"text/css\";\n\n\taddAttrs(style, options.attrs);\n\tinsertStyleElement(options, style);\n\n\treturn style;\n}\n\nfunction createLinkElement (options) {\n\tvar link = document.createElement(\"link\");\n\n\toptions.attrs.type = \"text/css\";\n\toptions.attrs.rel = \"stylesheet\";\n\n\taddAttrs(link, options.attrs);\n\tinsertStyleElement(options, link);\n\n\treturn link;\n}\n\nfunction addAttrs (el, attrs) {\n\tObject.keys(attrs).forEach(function (key) {\n\t\tel.setAttribute(key, attrs[key]);\n\t});\n}\n\nfunction addStyle (obj, options) {\n\tvar style, update, remove, result;\n\n\t// If a transform function was defined, run it on the css\n\tif (options.transform && obj.css) {\n\t    result = options.transform(obj.css);\n\n\t    if (result) {\n\t    \t// If transform returns a value, use that instead of the original css.\n\t    \t// This allows running runtime transformations on the css.\n\t    \tobj.css = result;\n\t    } else {\n\t    \t// If the transform function returns a falsy value, don't add this css.\n\t    \t// This allows conditional loading of css\n\t    \treturn function() {\n\t    \t\t// noop\n\t    \t};\n\t    }\n\t}\n\n\tif (options.singleton) {\n\t\tvar styleIndex = singletonCounter++;\n\n\t\tstyle = singleton || (singleton = createStyleElement(options));\n\n\t\tupdate = applyToSingletonTag.bind(null, style, styleIndex, false);\n\t\tremove = applyToSingletonTag.bind(null, style, styleIndex, true);\n\n\t} else if (\n\t\tobj.sourceMap &&\n\t\ttypeof URL === \"function\" &&\n\t\ttypeof URL.createObjectURL === \"function\" &&\n\t\ttypeof URL.revokeObjectURL === \"function\" &&\n\t\ttypeof Blob === \"function\" &&\n\t\ttypeof btoa === \"function\"\n\t) {\n\t\tstyle = createLinkElement(options);\n\t\tupdate = updateLink.bind(null, style, options);\n\t\tremove = function () {\n\t\t\tremoveStyleElement(style);\n\n\t\t\tif(style.href) URL.revokeObjectURL(style.href);\n\t\t};\n\t} else {\n\t\tstyle = createStyleElement(options);\n\t\tupdate = applyToTag.bind(null, style);\n\t\tremove = function () {\n\t\t\tremoveStyleElement(style);\n\t\t};\n\t}\n\n\tupdate(obj);\n\n\treturn function updateStyle (newObj) {\n\t\tif (newObj) {\n\t\t\tif (\n\t\t\t\tnewObj.css === obj.css &&\n\t\t\t\tnewObj.media === obj.media &&\n\t\t\t\tnewObj.sourceMap === obj.sourceMap\n\t\t\t) {\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tupdate(obj = newObj);\n\t\t} else {\n\t\t\tremove();\n\t\t}\n\t};\n}\n\nvar replaceText = (function () {\n\tvar textStore = [];\n\n\treturn function (index, replacement) {\n\t\ttextStore[index] = replacement;\n\n\t\treturn textStore.filter(Boolean).join('\\n');\n\t};\n})();\n\nfunction applyToSingletonTag (style, index, remove, obj) {\n\tvar css = remove ? \"\" : obj.css;\n\n\tif (style.styleSheet) {\n\t\tstyle.styleSheet.cssText = replaceText(index, css);\n\t} else {\n\t\tvar cssNode = document.createTextNode(css);\n\t\tvar childNodes = style.childNodes;\n\n\t\tif (childNodes[index]) style.removeChild(childNodes[index]);\n\n\t\tif (childNodes.length) {\n\t\t\tstyle.insertBefore(cssNode, childNodes[index]);\n\t\t} else {\n\t\t\tstyle.appendChild(cssNode);\n\t\t}\n\t}\n}\n\nfunction applyToTag (style, obj) {\n\tvar css = obj.css;\n\tvar media = obj.media;\n\n\tif(media) {\n\t\tstyle.setAttribute(\"media\", media)\n\t}\n\n\tif(style.styleSheet) {\n\t\tstyle.styleSheet.cssText = css;\n\t} else {\n\t\twhile(style.firstChild) {\n\t\t\tstyle.removeChild(style.firstChild);\n\t\t}\n\n\t\tstyle.appendChild(document.createTextNode(css));\n\t}\n}\n\nfunction updateLink (link, options, obj) {\n\tvar css = obj.css;\n\tvar sourceMap = obj.sourceMap;\n\n\t/*\n\t\tIf convertToAbsoluteUrls isn't defined, but sourcemaps are enabled\n\t\tand there is no publicPath defined then lets turn convertToAbsoluteUrls\n\t\ton by default.  Otherwise default to the convertToAbsoluteUrls option\n\t\tdirectly\n\t*/\n\tvar autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;\n\n\tif (options.convertToAbsoluteUrls || autoFixUrls) {\n\t\tcss = fixUrls(css);\n\t}\n\n\tif (sourceMap) {\n\t\t// http://stackoverflow.com/a/26603875\n\t\tcss += \"\\n/*# sourceMappingURL=data:application/json;base64,\" + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + \" */\";\n\t}\n\n\tvar blob = new Blob([css], { type: \"text/css\" });\n\n\tvar oldSrc = link.href;\n\n\tlink.href = URL.createObjectURL(blob);\n\n\tif(oldSrc) URL.revokeObjectURL(oldSrc);\n}\n\n\n//# sourceURL=webpack:///./node_modules/style-loader/lib/addStyles.js?");

/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/*!***********************************************!*\
  !*** ./node_modules/style-loader/lib/urls.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\n/**\n * When source maps are enabled, `style-loader` uses a link element with a data-uri to\n * embed the css on the page. This breaks all relative urls because now they are relative to a\n * bundle instead of the current page.\n *\n * One solution is to only use full urls, but that may be impossible.\n *\n * Instead, this function \"fixes\" the relative urls to be absolute according to the current page location.\n *\n * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.\n *\n */\n\nmodule.exports = function (css) {\n  // get current location\n  var location = typeof window !== \"undefined\" && window.location;\n\n  if (!location) {\n    throw new Error(\"fixUrls requires window.location\");\n  }\n\n\t// blank or null?\n\tif (!css || typeof css !== \"string\") {\n\t  return css;\n  }\n\n  var baseUrl = location.protocol + \"//\" + location.host;\n  var currentDir = baseUrl + location.pathname.replace(/\\/[^\\/]*$/, \"/\");\n\n\t// convert each url(...)\n\t/*\n\tThis regular expression is just a way to recursively match brackets within\n\ta string.\n\n\t /url\\s*\\(  = Match on the word \"url\" with any whitespace after it and then a parens\n\t   (  = Start a capturing group\n\t     (?:  = Start a non-capturing group\n\t         [^)(]  = Match anything that isn't a parentheses\n\t         |  = OR\n\t         \\(  = Match a start parentheses\n\t             (?:  = Start another non-capturing groups\n\t                 [^)(]+  = Match anything that isn't a parentheses\n\t                 |  = OR\n\t                 \\(  = Match a start parentheses\n\t                     [^)(]*  = Match anything that isn't a parentheses\n\t                 \\)  = Match a end parentheses\n\t             )  = End Group\n              *\\) = Match anything and then a close parens\n          )  = Close non-capturing group\n          *  = Match anything\n       )  = Close capturing group\n\t \\)  = Match a close parens\n\n\t /gi  = Get all matches, not the first.  Be case insensitive.\n\t */\n\tvar fixedCss = css.replace(/url\\s*\\(((?:[^)(]|\\((?:[^)(]+|\\([^)(]*\\))*\\))*)\\)/gi, function(fullMatch, origUrl) {\n\t\t// strip quotes (if they exist)\n\t\tvar unquotedOrigUrl = origUrl\n\t\t\t.trim()\n\t\t\t.replace(/^\"(.*)\"$/, function(o, $1){ return $1; })\n\t\t\t.replace(/^'(.*)'$/, function(o, $1){ return $1; });\n\n\t\t// already a full url? no change\n\t\tif (/^(#|data:|http:\\/\\/|https:\\/\\/|file:\\/\\/\\/)/i.test(unquotedOrigUrl)) {\n\t\t  return fullMatch;\n\t\t}\n\n\t\t// convert the url to a full url\n\t\tvar newUrl;\n\n\t\tif (unquotedOrigUrl.indexOf(\"//\") === 0) {\n\t\t  \t//TODO: should we add protocol?\n\t\t\tnewUrl = unquotedOrigUrl;\n\t\t} else if (unquotedOrigUrl.indexOf(\"/\") === 0) {\n\t\t\t// path should be relative to the base url\n\t\t\tnewUrl = baseUrl + unquotedOrigUrl; // already starts with '/'\n\t\t} else {\n\t\t\t// path should be relative to current directory\n\t\t\tnewUrl = currentDir + unquotedOrigUrl.replace(/^\\.\\//, \"\"); // Strip leading './'\n\t\t}\n\n\t\t// send back the fixed url(...)\n\t\treturn \"url(\" + JSON.stringify(newUrl) + \")\";\n\t});\n\n\t// send back the fixed css\n\treturn fixedCss;\n};\n\n\n//# sourceURL=webpack:///./node_modules/style-loader/lib/urls.js?");

/***/ }),

/***/ "./src/components/App/index.ts":
/*!*************************************!*\
  !*** ./src/components/App/index.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = Object.setPrototypeOf ||\n        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar List_1 = __webpack_require__(/*! components/List */ \"./src/components/List/index.ts\");\nvar utils_1 = __webpack_require__(/*! utils */ \"./src/utils/index.ts\");\nvar data = __webpack_require__(/*! data.json */ \"./src/data.json\");\nvar App = (function (_super) {\n    __extends(App, _super);\n    function App(props) {\n        var _this = _super.call(this, props) || this;\n        _this.articles = new List_1.List({\n            items: _this.props.data.articles || []\n        });\n        _this.projects = new List_1.List({\n            items: _this.props.data.projects || [],\n            options: {\n                target: '_blank'\n            },\n            type: 'projects'\n        });\n        return _this;\n    }\n    App.prototype.appBody = function () {\n        if (document.body.className === 'markdown-body') {\n            var md = document.getElementById('markdown');\n            var markdown = (md ? md : { innerHTML: false }).innerHTML;\n            (md ? md : { innerHTML: false }).innerHTML = '';\n            return markdown;\n        }\n        return \"\\n      <div class='posts'>\\n          <h2>Writing</h2>\\n          \" + this.articles.render() + \"\\n          <h2>Projects</h2>\\n          \" + this.projects.render() + \"\\n          <h2>\\uD83C\\uDF34</h2>\\n          <div class='stats'>\\n            <p><a href=\\\"https://travis-ci.org/EmmaRamirez/emmaramirez.me\\\" rel=\\\"nofollow\\\"><img src=\\\"https://camo.githubusercontent.com/b70123a10e32ce6a5fbc9095092238fee4e78e0f/68747470733a2f2f696d672e736869656c64732e696f2f7472617669732f456d6d6152616d6972657a2f656d6d6172616d6972657a2e6d652e7376673f7374796c653d666c61742d737175617265\\\" alt=\\\"Build Status\\\" data-canonical-src=\\\"https://img.shields.io/travis/EmmaRamirez/emmaramirez.me.svg?style=flat-square\\\" style=\\\"max-width:100%;\\\"></a>\\n            <a href=\\\"/EmmaRamirez/emmaramirez.me/blob/master\\\"><img src=\\\"https://camo.githubusercontent.com/447f3afa7024326905ca2c2876b9bc5e6cc9b09e/68747470733a2f2f696d672e736869656c64732e696f2f636f766572616c6c732f6769746875622f456d6d6152616d6972657a2f656d6d6172616d6972657a2e6d652f6d61737465722e7376673f7374796c653d666c61742d737175617265\\\" alt=\\\"Coveralls github branch\\\" data-canonical-src=\\\"https://img.shields.io/coveralls/github/EmmaRamirez/emmaramirez.me/master.svg?style=flat-square\\\" style=\\\"max-width:100%;\\\"></a>\\n            <a href=\\\"https://github.com/EmmaRamirez/emmaramirez.me/releases\\\"><img src=\\\"https://camo.githubusercontent.com/269a97dd4464cbcdf95a7997795577f8aa258a20/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f72656c656173652f656d6d6172616d6972657a2f656d6d6172616d6972657a2e6d652e7376673f7374796c653d666c61742d737175617265\\\" alt=\\\"npm\\\" data-canonical-src=\\\"https://img.shields.io/github/release/emmaramirez/emmaramirez.me.svg?style=flat-square\\\" style=\\\"max-width:100%;\\\"></a>\\n            <a href=\\\"https://github.com/EmmaRamirez/emmaramirez.me/blob/master/LICENSE.md\\\"><img src=\\\"https://camo.githubusercontent.com/71b19f8e18d3b94461ee83e974f54504feb2ed8a/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6c6963656e73652d4d49542532304c6963656e73652d626c75652e7376673f7374796c653d666c61742d737175617265\\\" alt=\\\"license\\\" data-canonical-src=\\\"https://img.shields.io/badge/license-MIT%20License-blue.svg?style=flat-square\\\" style=\\\"max-width:100%;\\\"></a>\\n          </div>\\n      </div>\";\n    };\n    App.prototype.render = function () {\n        return \"\\n            <div class='app'>\\n                \" + this.props.Header.render() + \"\\n                <div class='blog-post'>\\n                  \" + this.appBody() + \"\\n                </div>\\n            </div>\\n        \";\n    };\n    App.prototype.postRender = function () {\n        this.articles.postRender();\n        this.projects.postRender();\n    };\n    return App;\n}(utils_1.Component));\nexports.App = App;\n\n\n//# sourceURL=webpack:///./src/components/App/index.ts?");

/***/ }),

/***/ "./src/components/Header/Header.styl":
/*!*******************************************!*\
  !*** ./src/components/Header/Header.styl ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// style-loader: Adds some css to the DOM by adding a <style> tag\n\n// load the styles\nvar content = __webpack_require__(/*! !../../../node_modules/css-loader!../../../node_modules/resolve-url-loader!../../../node_modules/stylus-loader!./Header.styl */ \"./node_modules/css-loader/index.js!./node_modules/resolve-url-loader/index.js!./node_modules/stylus-loader/index.js!./src/components/Header/Header.styl\");\nif(typeof content === 'string') content = [[module.i, content, '']];\n// Prepare cssTransformation\nvar transform;\n\nvar options = {\"hmr\":true}\noptions.transform = transform\n// add the styles to the DOM\nvar update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ \"./node_modules/style-loader/lib/addStyles.js\")(content, options);\nif(content.locals) module.exports = content.locals;\n// Hot Module Replacement\nif(false) {}\n\n//# sourceURL=webpack:///./src/components/Header/Header.styl?");

/***/ }),

/***/ "./src/components/Header/index.ts":
/*!****************************************!*\
  !*** ./src/components/Header/index.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\n__webpack_require__(/*! ./Header.styl */ \"./src/components/Header/Header.styl\");\nvar Header = (function () {\n    function Header() {\n    }\n    Header.prototype.render = function () {\n        return \"<header class='header'><a href='/' class='site-title'>\\uD83C\\uDF4D emmaramirez</a></header>\";\n    };\n    return Header;\n}());\nexports.Header = Header;\n\n\n//# sourceURL=webpack:///./src/components/Header/index.ts?");

/***/ }),

/***/ "./src/components/List/List.styl":
/*!***************************************!*\
  !*** ./src/components/List/List.styl ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// style-loader: Adds some css to the DOM by adding a <style> tag\n\n// load the styles\nvar content = __webpack_require__(/*! !../../../node_modules/css-loader!../../../node_modules/resolve-url-loader!../../../node_modules/stylus-loader!./List.styl */ \"./node_modules/css-loader/index.js!./node_modules/resolve-url-loader/index.js!./node_modules/stylus-loader/index.js!./src/components/List/List.styl\");\nif(typeof content === 'string') content = [[module.i, content, '']];\n// Prepare cssTransformation\nvar transform;\n\nvar options = {\"hmr\":true}\noptions.transform = transform\n// add the styles to the DOM\nvar update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ \"./node_modules/style-loader/lib/addStyles.js\")(content, options);\nif(content.locals) module.exports = content.locals;\n// Hot Module Replacement\nif(false) {}\n\n//# sourceURL=webpack:///./src/components/List/List.styl?");

/***/ }),

/***/ "./src/components/List/index.ts":
/*!**************************************!*\
  !*** ./src/components/List/index.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = Object.setPrototypeOf ||\n        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", { value: true });\n__webpack_require__(/*! ./List.styl */ \"./src/components/List/List.styl\");\nvar utils_1 = __webpack_require__(/*! utils */ \"./src/utils/index.ts\");\nvar Tags_1 = __webpack_require__(/*! ../Tags */ \"./src/components/Tags/index.ts\");\nvar List = (function (_super) {\n    __extends(List, _super);\n    function List(props) {\n        return _super.call(this, props) || this;\n    }\n    List.prototype.postRender = function () {\n        var projectOverlays = Array.from(document.querySelectorAll('.project-overlay'));\n        projectOverlays.forEach(function (projectOverlay) {\n            projectOverlay.addEventListener('click', function (event) {\n                if (!event.target.classList.contains('tag')) {\n                    window.open(projectOverlay.dataset.link, '_blank');\n                }\n            });\n        });\n    };\n    List.prototype.render = function () {\n        var _a = this.props, items = _a.items, options = _a.options, type = _a.type;\n        var condition = function (condition, str) {\n            if (condition)\n                return str;\n            return '';\n        };\n        var ul = function (innerContent) {\n            return \"<ul class='\" + ('list ' + (type || '')) + \"'>\" + innerContent + \"</ul>\";\n        };\n        if (type === 'projects') {\n            return ul(items\n                .map(function (item, key) {\n                return condition(!item.hide, \"\\n                    <li class='list-item project-item' data-key=\" + key + \" style='background-image: url(\" + (item.image || '') + \")'>\\n                      <div class='item-last-updated'><img src=\" + item.lastUpdated + \" /></div>\\n                      <div data-link=\" + item.link + \" class='project-overlay'  target=\" + (options ? options.target : '_self') + \">\\n                        <div class='project-item-inner'>\\n                          <h4><span class='item-emoji'>\" + item.emoji + \"</span> \" + item.title + condition(item.wip, \"<span class='item-wip-badge'>WIP</span>\") + \"</h4>\\n                          <p>\" + item.description + \"</p>\\n                          \" + condition(item.tags, \"<br/>\" + new Tags_1.Tags({ tags: item.tags }).render()) + \"\\n                        </div>\\n                      </div>\\n                    </li>\\n                  \");\n            }).join(''));\n        }\n        return ul(items\n            .filter(function (i) { return (i.draft == null ? true : !i.draft); })\n            .map(function (item, key) {\n            return \"\\n                        <li class='list-item' data-key=\" + key + \">\\n                            \" + condition(item.emoji, \"<span class='item-emoji'>\" + item.emoji + \"</span>\") + \"\\n                            <a href='\" + item.link + \"' target=\" + (options ? options.target : '_self') + \">\" + item.title + \"</a>\\n                            \" + condition(item.wip, \"<span class='item-wip-badge'>WIP</span>\") + \"\\n                            \" + condition(item.description, \"<span class='item-description'>\" + item.description + \"</span>\") + \"\\n                            \" + condition(item.date, \"<span class='item-date'>\" + item.date + \"</span>\") + \"\\n                            \" + condition(item.tags, \"<br/>\" + new Tags_1.Tags({ tags: item.tags }).render()) + \"\\n                        </li>\";\n        })\n            .join(''));\n    };\n    return List;\n}(utils_1.Component));\nexports.List = List;\n\n\n//# sourceURL=webpack:///./src/components/List/index.ts?");

/***/ }),

/***/ "./src/components/Tags/Tags.styl":
/*!***************************************!*\
  !*** ./src/components/Tags/Tags.styl ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// style-loader: Adds some css to the DOM by adding a <style> tag\n\n// load the styles\nvar content = __webpack_require__(/*! !../../../node_modules/css-loader!../../../node_modules/resolve-url-loader!../../../node_modules/stylus-loader!./Tags.styl */ \"./node_modules/css-loader/index.js!./node_modules/resolve-url-loader/index.js!./node_modules/stylus-loader/index.js!./src/components/Tags/Tags.styl\");\nif(typeof content === 'string') content = [[module.i, content, '']];\n// Prepare cssTransformation\nvar transform;\n\nvar options = {\"hmr\":true}\noptions.transform = transform\n// add the styles to the DOM\nvar update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ \"./node_modules/style-loader/lib/addStyles.js\")(content, options);\nif(content.locals) module.exports = content.locals;\n// Hot Module Replacement\nif(false) {}\n\n//# sourceURL=webpack:///./src/components/Tags/Tags.styl?");

/***/ }),

/***/ "./src/components/Tags/index.ts":
/*!**************************************!*\
  !*** ./src/components/Tags/index.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = Object.setPrototypeOf ||\n        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar utils_1 = __webpack_require__(/*! utils */ \"./src/utils/index.ts\");\n__webpack_require__(/*! ./Tags.styl */ \"./src/components/Tags/Tags.styl\");\nexports.Tag = function (title) { return \"<a href='tags/\" + title.replace(/\\s/g, '-') + \"' class='tag'>\" + title + \"</a>\"; };\nvar Tags = (function (_super) {\n    __extends(Tags, _super);\n    function Tags(props) {\n        return _super.call(this, props) || this;\n    }\n    Tags.prototype.render = function () {\n        return this.props.tags\n            ? \"<div class='tags'>\" + this.props.tags\n                .sort()\n                .map(function (t) { return exports.Tag(t); })\n                .join('') + \"</div>\"\n            : '';\n    };\n    return Tags;\n}(utils_1.Component));\nexports.Tags = Tags;\n\n\n//# sourceURL=webpack:///./src/components/Tags/index.ts?");

/***/ }),

/***/ "./src/components/index.ts":
/*!*********************************!*\
  !*** ./src/components/index.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nfunction __export(m) {\n    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];\n}\nObject.defineProperty(exports, \"__esModule\", { value: true });\n__export(__webpack_require__(/*! ./App */ \"./src/components/App/index.ts\"));\n__export(__webpack_require__(/*! ./Header */ \"./src/components/Header/index.ts\"));\n__export(__webpack_require__(/*! ./List */ \"./src/components/List/index.ts\"));\n__export(__webpack_require__(/*! ./Tags */ \"./src/components/Tags/index.ts\"));\n\n\n//# sourceURL=webpack:///./src/components/index.ts?");

/***/ }),

/***/ "./src/data.json":
/*!***********************!*\
  !*** ./src/data.json ***!
  \***********************/
/*! exports provided: articles, projects, links, default */
/***/ (function(module) {

eval("module.exports = {\"articles\":[{\"link\":\"./posts/the-dialog-element\",\"title\":\"The Dialog Element\",\"date\":\"06/23/18\",\"emoji\":\"💬\",\"tags\":[\"html5\",\"dialog\",\"w3c\"]},{\"link\":\"./posts/building-the-nuzlocke-generator\",\"title\":\"Building the Nuzlocke Generator\",\"date\":\"06/13/18\",\"emoji\":\"📃\",\"tags\":[\"generator\",\"nuzlocke\",\"pokemon\",\"react\",\"typescript\"]},{\"link\":\"./posts/ill-be-giving-a-talk-at-forwardjs\",\"title\":\"I'll be Giving A Talk At ForwardJS!\",\"date\":\"02/10/18\",\"emoji\":\"🎤\",\"tags\":[\"talk\",\"presentation\",\"forwardjs\"]},{\"link\":\"./posts/the-glories-and-pitfalls-of-monorepos\",\"title\":\"The Glories and Pitfalls of Monorepos\",\"date\":\"01/14/18\",\"emoji\":\"🐉\",\"tags\":[\"lerna\",\"monorepo\",\"yarn\",\"npm\",\"semver\",\"rush\"]},{\"link\":\"./posts/piping-hot-a-rundown-on-the-pipeline-operator\",\"title\":\"Piping Hot: A Rundown on the Pipeline Operator\",\"date\":\"01/05/18\",\"tags\":[\"pipeline operator\",\"tc39\",\"proposal\"],\"emoji\":\"🛢️\"},{\"link\":\"./posts/on-joining-and-leaving-a-techstars-company\",\"title\":\"On Joining (and Leaving) a Techstars Company\",\"date\":\"01/01/18\",\"tags\":[\"personal\",\"startups\"],\"emoji\":\"🚀\"},{\"link\":\"./posts/the-safe-navigation-operator\",\"title\":\"The Safe Navigation Operator\",\"date\":\"12/29/17\",\"tags\":[\"safe navigation\",\"proposal\",\"tc39\",\"existential operator\"],\"emoji\":\"❓\"},{\"link\":\"./posts/yet-another-blog-post\",\"title\":\"Yet Another Blog Post\",\"date\":\"12/25/17\",\"tags\":[\"personal\"],\"emoji\":\"✏️\"},{\"link\":\"./posts/my-first-day-at-npm\",\"title\":\"My First Day at npm\",\"date\":\"06/06/16\",\"tags\":[\"personal\",\"startups\",\"npm\"],\"emoji\":\"📆\"}],\"projects\":[{\"link\":\"https://nuzlocke-generator.herokuapp.com/\",\"title\":\"nuzlocke template generator\",\"description\":\"a nuzlocke documentation engine\",\"wip\":false,\"lastUpdated\":\"https://camo.githubusercontent.com/7c31e88ac4aa846ee95742c76c4f4b43d544133c/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f72656c656173652f456d6d6152616d6972657a2f6e757a6c6f636b652d67656e657261746f722e7376673f7374796c653d666c61742d737175617265\",\"image\":\"./img/nuzlocke-generator.png\",\"tags\":[\"react\",\"redux\",\"typescript\"],\"emoji\":\"📃\"},{\"link\":\"https://pokemon-nicknames.herokuapp.com/\",\"title\":\"pokemon nicknames\",\"description\":\"a database for pokémon nicknames\",\"image\":\"./img/pokemon-nicknames.png\",\"emoji\":\"📛\",\"lastUpdated\":\"https://camo.githubusercontent.com/c42dbe544ace2bb6b813058994056a1e89278fa8/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f72656c656173652f7175627974652f727562696469756d2e7376673f7374796c653d666c61742d737175617265\",\"tags\":[\"angular\",\"typescript\"]},{\"link\":\"https://github.com/Clickopolis\",\"title\":\"clickopolis\",\"description\":\"an incremental empire management game\",\"lastUpdated\":\"https://camo.githubusercontent.com/b598c0601f488d8b1a2603804d0fdf8c8649ca99/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f40636c69636b6f706f6c69732f636f72652e7376673f7374796c653d666c61742d737175617265\",\"wip\":true,\"image\":\"./img/clickopolis-screen.png\",\"tags\":[\"react\",\"typescript\",\"redux\",\"nodeJS\",\"graphQL\"],\"emoji\":\"🗽\"},{\"link\":\"http://emmaramirez.github.io/fakemon-idea-generator/\",\"title\":\"fakemon idea generator\",\"image\":\"./img/fakemon-idea-generator.png\",\"description\":\"generate fake pokémon dex entries\",\"emoji\":\"🎲\",\"hide\":true}],\"links\":[{\"link\":\"https://github.com/EmmaRamirez/emmaramirez.me\",\"name\":\"github\"},{\"link\":\"https://keybase.io/emmaramirez\",\"name\":\"keybase\"},{\"link\":\"https://twitter.com/emmagramirez\",\"name\":\"twitter\"}]};\n\n//# sourceURL=webpack:///./src/data.json?");

/***/ }),

/***/ "./src/global.styl":
/*!*************************!*\
  !*** ./src/global.styl ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// style-loader: Adds some css to the DOM by adding a <style> tag\n\n// load the styles\nvar content = __webpack_require__(/*! !../node_modules/css-loader!../node_modules/resolve-url-loader!../node_modules/stylus-loader!./global.styl */ \"./node_modules/css-loader/index.js!./node_modules/resolve-url-loader/index.js!./node_modules/stylus-loader/index.js!./src/global.styl\");\nif(typeof content === 'string') content = [[module.i, content, '']];\n// Prepare cssTransformation\nvar transform;\n\nvar options = {\"hmr\":true}\noptions.transform = transform\n// add the styles to the DOM\nvar update = __webpack_require__(/*! ../node_modules/style-loader/lib/addStyles.js */ \"./node_modules/style-loader/lib/addStyles.js\")(content, options);\nif(content.locals) module.exports = content.locals;\n// Hot Module Replacement\nif(false) {}\n\n//# sourceURL=webpack:///./src/global.styl?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar components_1 = __webpack_require__(/*! components */ \"./src/components/index.ts\");\nvar utils_1 = __webpack_require__(/*! utils */ \"./src/utils/index.ts\");\nvar data = __webpack_require__(/*! data.json */ \"./src/data.json\");\n__webpack_require__(/*! ./reset.styl */ \"./src/reset.styl\");\n__webpack_require__(/*! ./global.styl */ \"./src/global.styl\");\nvar endpoint = document.getElementById('app');\nvar app = new components_1.App({ Header: new components_1.Header(), data: data });\nfunction selectText() {\n    var preTags = document.querySelectorAll('pre');\n    preTags.forEach(function (item) {\n        return item.addEventListener('click', function () {\n            return window.getSelection().selectAllChildren(item);\n        });\n    });\n}\nutils_1.render(app, endpoint, function (app) { return app.postRender(); });\nselectText();\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/reset.styl":
/*!************************!*\
  !*** ./src/reset.styl ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// style-loader: Adds some css to the DOM by adding a <style> tag\n\n// load the styles\nvar content = __webpack_require__(/*! !../node_modules/css-loader!../node_modules/resolve-url-loader!../node_modules/stylus-loader!./reset.styl */ \"./node_modules/css-loader/index.js!./node_modules/resolve-url-loader/index.js!./node_modules/stylus-loader/index.js!./src/reset.styl\");\nif(typeof content === 'string') content = [[module.i, content, '']];\n// Prepare cssTransformation\nvar transform;\n\nvar options = {\"hmr\":true}\noptions.transform = transform\n// add the styles to the DOM\nvar update = __webpack_require__(/*! ../node_modules/style-loader/lib/addStyles.js */ \"./node_modules/style-loader/lib/addStyles.js\")(content, options);\nif(content.locals) module.exports = content.locals;\n// Hot Module Replacement\nif(false) {}\n\n//# sourceURL=webpack:///./src/reset.styl?");

/***/ }),

/***/ "./src/utils/Component.ts":
/*!********************************!*\
  !*** ./src/utils/Component.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar Component = (function () {\n    function Component(props) {\n        this.props = props;\n        this.props = props;\n    }\n    return Component;\n}());\nexports.Component = Component;\n\n\n//# sourceURL=webpack:///./src/utils/Component.ts?");

/***/ }),

/***/ "./src/utils/index.ts":
/*!****************************!*\
  !*** ./src/utils/index.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar noop_1 = __webpack_require__(/*! ./noop */ \"./src/utils/noop.ts\");\nexports.noop = noop_1.noop;\nvar render_1 = __webpack_require__(/*! ./render */ \"./src/utils/render.ts\");\nexports.render = render_1.render;\nvar Component_1 = __webpack_require__(/*! ./Component */ \"./src/utils/Component.ts\");\nexports.Component = Component_1.Component;\n\n\n//# sourceURL=webpack:///./src/utils/index.ts?");

/***/ }),

/***/ "./src/utils/noop.ts":
/*!***************************!*\
  !*** ./src/utils/noop.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.noop = function () { };\n\n\n//# sourceURL=webpack:///./src/utils/noop.ts?");

/***/ }),

/***/ "./src/utils/render.ts":
/*!*****************************!*\
  !*** ./src/utils/render.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.render = function (component, endpoint, callback) {\n    if (endpoint != null)\n        endpoint.innerHTML = \"\" + component.render();\n    setTimeout(function () { return callback(component); }, 1000);\n};\n\n\n//# sourceURL=webpack:///./src/utils/render.ts?");

/***/ })

/******/ });