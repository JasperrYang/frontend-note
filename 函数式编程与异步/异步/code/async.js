var fs = require("fs");

var readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function (error, data) {
      if (error) reject(error);
      resolve(data);
    });
  });
};

// let gen = function* () {
//   var f1 = yield readFile("./users.json");
//   var f2 = yield readFile("./posts.json");
//   // console.log(f1.toString());
//   // console.log(f2.toString());
// };

// var x = gen();

// console.log(x.next().value.then((value) => console.log(value.toString())));

// console.log(x.next().value.then((value) => console.log(value.toString())));

// console.log(x.next());

// console.log(x.next());

async function asyncReadFile() {
  var f1 = await readFile("./users.json");
  var f2 = await readFile("./posts.json");
  console.log(f1.toString());
  console.log(f2.toString());
}

asyncReadFile();
