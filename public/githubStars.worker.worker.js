/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/js/queries/index.js":
/*!***************************************!*\
  !*** ./resources/js/queries/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchStarsQuery": () => (/* binding */ fetchStarsQuery)
/* harmony export */ });
var fetchStarsQuery = function fetchStarsQuery() {
  var cursor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'DESC';
  var perPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 50;
  var cursorFilter = cursor ? "after:\"".concat(cursor, "\"") : 'after:null';
  return "query {\n    viewer {\n    starredRepositories(first: ".concat(perPage, ", orderBy: {field: STARRED_AT, direction: ").concat(direction, "},  ").concat(cursorFilter, ") {\n        totalCount\n        edges {\n        node {\n            id\n            nameWithOwner\n            description\n            url\n            databaseId\n            isArchived\n            defaultBranchRef {\n            name\n            }\n            primaryLanguage {\n            name\n            }\n            stargazers {\n            totalCount\n            }\n            forkCount,\n            releases(first: 1, orderBy: {field: CREATED_AT, direction: DESC}) {\n                edges{\n                    node {\n                        tagName\n                    }\n                }\n            }\n        }\n        cursor\n        }\n        pageInfo {\n        startCursor\n        endCursor\n        hasNextPage\n        }\n    }\n    }\n  }");
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!****************************************************!*\
  !*** ./resources/js/workers/githubStars.worker.js ***!
  \****************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _queries__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/queries */ "./resources/js/queries/index.js");


self.addEventListener('message', async ({ data }) => {
  const result = await (
    await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${data.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: (0,_queries__WEBPACK_IMPORTED_MODULE_0__.fetchStarsQuery)(),
      }),
    })
  ).json()

  self.postMessage(result.data)
})

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (self);

})();

/******/ })()
;