// runtime can't be in strict mode because a global variable is assign and maybe created.
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[826],{

/***/ 67:
/***/ ((module) => {

"use strict";
module.exports = require("node:async_hooks");

/***/ }),

/***/ 195:
/***/ ((module) => {

"use strict";
module.exports = require("node:buffer");

/***/ }),

/***/ 720:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ nHandler)
});

// NAMESPACE OBJECT: ./middleware.ts
var middleware_namespaceObject = {};
__webpack_require__.r(middleware_namespaceObject);
__webpack_require__.d(middleware_namespaceObject, {
  config: () => (config),
  middleware: () => (middleware)
});

// EXTERNAL MODULE: ./node_modules/next/dist/esm/server/web/globals.js
var globals = __webpack_require__(355);
// EXTERNAL MODULE: ./node_modules/next/dist/esm/server/web/adapter.js + 19 modules
var adapter = __webpack_require__(801);
// EXTERNAL MODULE: ./node_modules/next/dist/esm/server/web/exports/next-response.js
var next_response = __webpack_require__(172);
;// CONCATENATED MODULE: ./middleware.ts

function middleware(request) {
    const token = request.cookies.get("token")?.value;
    if (!token && (request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/orders"))) {
        return next_response/* default */.Z.redirect(new URL("/login", request.url));
    }
    if (token && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register")) {
        return next_response/* default */.Z.redirect(new URL("/dashboard", request.url));
    }
    return next_response/* default */.Z.next();
}
const config = {
    matcher: [
        "/dashboard/:path*",
        "/orders/:path*",
        "/login",
        "/register"
    ]
};

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-middleware-loader.js?absolutePagePath=private-next-root-dir%2Fmiddleware.ts&page=%2Fmiddleware&rootDir=E%3A%5Crozgaar-mongodb%5Cfrontend&matchers=W3sicmVnZXhwIjoiXig%2FOlxcLyhfbmV4dFxcL2RhdGFcXC9bXi9dezEsfSkpP1xcL2Rhc2hib2FyZCg%2FOlxcLygoPzpbXlxcLyNcXD9dKz8pKD86XFwvKD86W15cXC8jXFw%2FXSs%2FKSkqKSk%2FKC5qc29uKT9bXFwvI1xcP10%2FJCIsIm9yaWdpbmFsU291cmNlIjoiL2Rhc2hib2FyZC86cGF0aCoifSx7InJlZ2V4cCI6Il4oPzpcXC8oX25leHRcXC9kYXRhXFwvW14vXXsxLH0pKT9cXC9vcmRlcnMoPzpcXC8oKD86W15cXC8jXFw%2FXSs%2FKSg%2FOlxcLyg%2FOlteXFwvI1xcP10rPykpKikpPyguanNvbik%2FW1xcLyNcXD9dPyQiLCJvcmlnaW5hbFNvdXJjZSI6Ii9vcmRlcnMvOnBhdGgqIn0seyJyZWdleHAiOiJeKD86XFwvKF9uZXh0XFwvZGF0YVxcL1teL117MSx9KSk%2FXFwvbG9naW4oLmpzb24pP1tcXC8jXFw%2FXT8kIiwib3JpZ2luYWxTb3VyY2UiOiIvbG9naW4ifSx7InJlZ2V4cCI6Il4oPzpcXC8oX25leHRcXC9kYXRhXFwvW14vXXsxLH0pKT9cXC9yZWdpc3RlciguanNvbik%2FW1xcLyNcXD9dPyQiLCJvcmlnaW5hbFNvdXJjZSI6Ii9yZWdpc3RlciJ9XQ%3D%3D&preferredRegion=&middlewareConfig=eyJtYXRjaGVycyI6W3sicmVnZXhwIjoiXig%2FOlxcLyhfbmV4dFxcL2RhdGFcXC9bXi9dezEsfSkpP1xcL2Rhc2hib2FyZCg%2FOlxcLygoPzpbXlxcLyNcXD9dKz8pKD86XFwvKD86W15cXC8jXFw%2FXSs%2FKSkqKSk%2FKC5qc29uKT9bXFwvI1xcP10%2FJCIsIm9yaWdpbmFsU291cmNlIjoiL2Rhc2hib2FyZC86cGF0aCoifSx7InJlZ2V4cCI6Il4oPzpcXC8oX25leHRcXC9kYXRhXFwvW14vXXsxLH0pKT9cXC9vcmRlcnMoPzpcXC8oKD86W15cXC8jXFw%2FXSs%2FKSg%2FOlxcLyg%2FOlteXFwvI1xcP10rPykpKikpPyguanNvbik%2FW1xcLyNcXD9dPyQiLCJvcmlnaW5hbFNvdXJjZSI6Ii9vcmRlcnMvOnBhdGgqIn0seyJyZWdleHAiOiJeKD86XFwvKF9uZXh0XFwvZGF0YVxcL1teL117MSx9KSk%2FXFwvbG9naW4oLmpzb24pP1tcXC8jXFw%2FXT8kIiwib3JpZ2luYWxTb3VyY2UiOiIvbG9naW4ifSx7InJlZ2V4cCI6Il4oPzpcXC8oX25leHRcXC9kYXRhXFwvW14vXXsxLH0pKT9cXC9yZWdpc3RlciguanNvbik%2FW1xcLyNcXD9dPyQiLCJvcmlnaW5hbFNvdXJjZSI6Ii9yZWdpc3RlciJ9XX0%3D!


// Import the userland code.

const mod = {
    ...middleware_namespaceObject
};
const handler = mod.middleware || mod.default;
const page = "/middleware";
if (typeof handler !== "function") {
    throw new Error(`The Middleware "${page}" must export a \`middleware\` or a \`default\` function`);
}
function nHandler(opts) {
    return (0,adapter/* adapter */.V)({
        ...opts,
        page,
        handler
    });
}

//# sourceMappingURL=middleware.js.map

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, [780], () => (__webpack_exec__(720)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ (_ENTRIES = typeof _ENTRIES === "undefined" ? {} : _ENTRIES).middleware_middleware = __webpack_exports__;
/******/ }
]);
//# sourceMappingURL=middleware.js.map