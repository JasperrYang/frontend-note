'use strict';

var _ = require('lodash');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var ___default = /*#__PURE__*/_interopDefaultLegacy(_);

const log = (msg) => {
  console.log("---------- INFO ----------");
  console.log(msg);
  console.log("--------------------------");
};

var messages = {
  hi: "Hi~",
};

var name = "rollup";
var version = "1.0.0";

// 导入模块成员

// 使用模块成员
const msg = messages.hi;

log(msg);

log(name); // 使用json
log(version);

___default['default'].upperCase("hello world");
