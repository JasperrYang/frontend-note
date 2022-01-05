import "./editor.css";

export default () => {
  const editorElement = document.createElement("div");

  editorElement.contentEditable = true;
  editorElement.className = "editor";

  console.log("editor init completed");

  alert("12");

  return editorElement;

  function test() {
    console.log("jasper");
  }
};

export const Link = () => {
  return document.createElement("a");
};
