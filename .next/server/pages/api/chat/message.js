"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/chat/message";
exports.ids = ["pages/api/chat/message"];
exports.modules = {

/***/ "(api)/./constants.ts":
/*!**********************!*\
  !*** ./constants.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   METHODS: () => (/* binding */ METHODS)\n/* harmony export */ });\nvar METHODS;\n(function(METHODS) {\n    METHODS[\"GET\"] = \"GET\";\n    METHODS[\"POST\"] = \"POST\";\n    METHODS[\"PUT\"] = \"PUT\";\n    METHODS[\"DELETE\"] = \"DELETE\";\n})(METHODS || (METHODS = {}));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9jb25zdGFudHMudHMiLCJtYXBwaW5ncyI6Ijs7OztJQUFPO1VBQUtBLE9BQU87SUFBUEEsUUFDVkMsU0FBQUE7SUFEVUQsUUFFVkUsVUFBQUE7SUFGVUYsUUFHVkcsU0FBQUE7SUFIVUgsUUFJVkksWUFBQUE7R0FKVUosWUFBQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYWxsLVdpbldpbi8uL2NvbnN0YW50cy50cz9kZDRlIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBlbnVtIE1FVEhPRFMge1xyXG4gIEdFVCA9ICdHRVQnLFxyXG4gIFBPU1QgPSAnUE9TVCcsXHJcbiAgUFVUID0gJ1BVVCcsXHJcbiAgREVMRVRFID0gJ0RFTEVURScsXHJcbn1cclxuIl0sIm5hbWVzIjpbIk1FVEhPRFMiLCJHRVQiLCJQT1NUIiwiUFVUIiwiREVMRVRFIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./constants.ts\n");

/***/ }),

/***/ "(api)/./pages/api/chat/message.ts":
/*!***********************************!*\
  !*** ./pages/api/chat/message.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/constants */ \"(api)/./constants.ts\");\n\nasync function handler(req, res) {\n    if (req.method !== _constants__WEBPACK_IMPORTED_MODULE_0__.METHODS.POST) {\n        return res.status(405).json({\n            error: \"Method Not Allowed\"\n        });\n    }\n    const messages = JSON.parse(req.body);\n    let response;\n    try {\n        response = await fetch(\"https://api.openai.com/v1/chat/completions\", {\n            method: \"POST\",\n            headers: {\n                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,\n                \"Content-Type\": \"application/json\"\n            },\n            body: JSON.stringify({\n                model: \"gpt-3.5-turbo\",\n                messages\n            })\n        });\n    } catch (error) {\n        console.error(\"Error:\", error);\n        return res.json({\n            error: \"An error occurred\"\n        });\n    }\n    try {\n        const data = await response.json();\n        return res.status(200).json(data);\n    } catch (error) {\n        console.error(\"Error:\", error);\n        return res.json({\n            error: \"An error occurred\"\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvY2hhdC9tZXNzYWdlLnRzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQXNDO0FBUXZCLGVBQWVDLFFBQVFDLEdBQWlCLEVBQUVDLEdBQW9CO0lBQzNFLElBQUlELElBQUlFLE1BQU0sS0FBS0osK0NBQU9BLENBQUNLLElBQUksRUFBRTtRQUMvQixPQUFPRixJQUFJRyxNQUFNLENBQUMsS0FBS0MsSUFBSSxDQUFDO1lBQUVDLE9BQU87UUFBcUI7SUFDNUQ7SUFDQSxNQUFNQyxXQUFXQyxLQUFLQyxLQUFLLENBQUNULElBQUlVLElBQUk7SUFDcEMsSUFBSUM7SUFDSixJQUFJO1FBQ0ZBLFdBQVcsTUFBTUMsTUFBTSw4Q0FBOEM7WUFDbkVWLFFBQVE7WUFDUlcsU0FBUztnQkFDUEMsZUFBZSxDQUFDLE9BQU8sRUFBRUMsUUFBUUMsR0FBRyxDQUFDQyxjQUFjLENBQUMsQ0FBQztnQkFDckQsZ0JBQWdCO1lBQ2xCO1lBQ0FQLE1BQU1GLEtBQUtVLFNBQVMsQ0FBQztnQkFDbkJDLE9BQU87Z0JBQ1BaO1lBQ0Y7UUFDRjtJQUNGLEVBQUUsT0FBT0QsT0FBTztRQUNkYyxRQUFRZCxLQUFLLENBQUMsVUFBVUE7UUFDeEIsT0FBT0wsSUFBSUksSUFBSSxDQUFDO1lBQUVDLE9BQU87UUFBb0I7SUFDL0M7SUFFQSxJQUFJO1FBQ0YsTUFBTWUsT0FBTyxNQUFNVixTQUFTTixJQUFJO1FBQ2hDLE9BQU9KLElBQUlHLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUNnQjtJQUM5QixFQUFFLE9BQU9mLE9BQU87UUFDZGMsUUFBUWQsS0FBSyxDQUFDLFVBQVVBO1FBQ3hCLE9BQU9MLElBQUlJLElBQUksQ0FBQztZQUFFQyxPQUFPO1FBQW9CO0lBQy9DO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYWxsLVdpbldpbi8uL3BhZ2VzL2FwaS9jaGF0L21lc3NhZ2UudHM/YmZiYyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNRVRIT0RTIH0gZnJvbSAnQC9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBOZXh0QXBpUmVzcG9uc2UgfSBmcm9tICduZXh0JztcclxuXHJcbmludGVyZmFjZSBSZXF1ZXN0UGFyYW0ge1xyXG4gIG1ldGhvZDogTUVUSE9EUztcclxuICBib2R5OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIocmVxOiBSZXF1ZXN0UGFyYW0sIHJlczogTmV4dEFwaVJlc3BvbnNlKSB7XHJcbiAgaWYgKHJlcS5tZXRob2QgIT09IE1FVEhPRFMuUE9TVCkge1xyXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA1KS5qc29uKHsgZXJyb3I6ICdNZXRob2QgTm90IEFsbG93ZWQnIH0pO1xyXG4gIH1cclxuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UocmVxLmJvZHkpO1xyXG4gIGxldCByZXNwb25zZTtcclxuICB0cnkge1xyXG4gICAgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS92MS9jaGF0L2NvbXBsZXRpb25zJywge1xyXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtwcm9jZXNzLmVudi5PUEVOQUlfQVBJX0tFWX1gLFxyXG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgIH0sXHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICBtb2RlbDogJ2dwdC0zLjUtdHVyYm8nLFxyXG4gICAgICAgIG1lc3NhZ2VzLFxyXG4gICAgICB9KSxcclxuICAgIH0pO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvcjonLCBlcnJvcik7XHJcbiAgICByZXR1cm4gcmVzLmpzb24oeyBlcnJvcjogJ0FuIGVycm9yIG9jY3VycmVkJyB9KTtcclxuICB9XHJcblxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKGRhdGEpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvcjonLCBlcnJvcik7XHJcbiAgICByZXR1cm4gcmVzLmpzb24oeyBlcnJvcjogJ0FuIGVycm9yIG9jY3VycmVkJyB9KTtcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbIk1FVEhPRFMiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwibWV0aG9kIiwiUE9TVCIsInN0YXR1cyIsImpzb24iLCJlcnJvciIsIm1lc3NhZ2VzIiwiSlNPTiIsInBhcnNlIiwiYm9keSIsInJlc3BvbnNlIiwiZmV0Y2giLCJoZWFkZXJzIiwiQXV0aG9yaXphdGlvbiIsInByb2Nlc3MiLCJlbnYiLCJPUEVOQUlfQVBJX0tFWSIsInN0cmluZ2lmeSIsIm1vZGVsIiwiY29uc29sZSIsImRhdGEiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./pages/api/chat/message.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/chat/message.ts"));
module.exports = __webpack_exports__;

})();