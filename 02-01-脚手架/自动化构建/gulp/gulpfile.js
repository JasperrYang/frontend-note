const { src, dest } = require("gulp");
const cleanCss = require("gulp-clean-css");
const rename = require("gulp-rename");

exports.default = () => {
  return src("src/*.css") //创建文件读取流
    .pipe(cleanCss())
    .pipe(rename({ extname: ".min.css" })) //重命名扩展名
    .pipe(dest("dist")); //导出到dest写入流中  参数写入目标目录
};
//yarn gulp    文件dist下多出一个css
//相比于nodeapi，gulp更强大，可以添加通配符
//yarn add gulp-clean-css --dev 压缩css代码的转换流
//yarn add gulp-rename --dev 重命名文件转换流
