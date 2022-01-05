// // 导入模块成员
// import { log } from "./logger";
// import messages from "./messages";
// import { name, version } from "../package.json";
// import _ from "lodash";

// // 使用模块成员
// const msg = messages.hi;

// log(msg);

// log(name); // 使用json
// log(version);

// _.upperCase("hello world");

import("./logger").then(({ log }) => {
  log("code splitting~");
});
