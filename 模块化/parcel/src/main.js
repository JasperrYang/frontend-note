// import $ from "jquery";
import foo from "./foo";
import "./style.css";
import logo from "./zce.png";

foo.bar();

// $(document.body).append(`<img src="${logo}" />`);
// $(document.body).append("<h1>Hello Parcel</h1>");

import("jquery").then(($) => {
  $(document.body).append("<h1>Hello Parcel</h1>");

  $(document.body).append(`<img src="${logo}" />`);
});

// if (module.hot) {
//   module.hot.accept(() => {
//     console.log("hmr");
//   });
// }
