#!/usr/bin/env node

console.log("start......");

const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");

inquirer
  .prompt([
    {
      type: "input",
      name: "name",
      message: "project name",
    },
  ])
  .then((answer) => {
    console.log(answer);

    // 模板目录
    const tmplDir = path.join(__dirname, "templates");
    // 目标目录
    const destDir = process.cwd();

    // 将模板下的文件全部转换到目标目录
    fs.readdir(tmplDir, (err, files) => {
      if (err) throw err;
      files.forEach((file) => {
        // 通过模板引擎渲染文件
        ejs.renderFile(path.join(tmplDir, file), answer, (err, result) => {
          if (err) throw err;

          // 将结果写入目标文件路径
          fs.writeFileSync(path.join(destDir, file), result);
        });
      });
    });
  });
