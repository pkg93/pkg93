// ==UserScript==
// @name         pkg93 injecter
// @namespace    pkg93inject
// @version      0.1
// @description  Injects pkg93!
// @author       1024x2
// @match        *://*.windows93.net/*
// ==/UserScript==

// Thanks, Draco!
function loadJS (source, onready){
  var sc = document.createElement("script");
  sc.src = source;
  sc.type = "text/javascript";
  if (onready) sc.addEventListener("load", onready);
  document.head.appendChild(sc);
  return sc;
}

var interval = setInterval(function () {
  try {
    if (!!le) {
      clearInterval(interval);
      loadJS("https://cdn.rawgit.com/1024x2/pkg93/ae2c5fe1/pkg93.js", function () {});
      $notif("pkg93 loaded successfully!");
    }
  } catch (err) {
    console.error(err);
  }
}, 5000);
