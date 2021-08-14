import createHeading from "./heading.js";
import "./main.css";
import icon from "./icon.png";
import content from "./test.md";

const heading = createHeading();

document.body.append(heading);

const img = new Image();
img.src = icon;
document.body.append(img);

setTimeout(() => {
  console.log("hello");
}, 0);

console.log(content);
