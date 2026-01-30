// index.js
import _ from "lodash";
import "./common.css";

function component() {
  var element = document.createElement("div");

  /* lodash is required for the next line to work */
  element.innerHTML = _.join(["Hello", "webpack"], " ");

  console.log("css loaded");

  return element;
}

document.body.appendChild(component());
