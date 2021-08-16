import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default {
  input: "src/index.js",
  output: {
    dir: "dist",
    format: "cjs",
  },
  plugins: [json(), resolve(), commonjs()],
  // 指出应将哪些模块视为外部模块
  external: ["lodash"],
};
