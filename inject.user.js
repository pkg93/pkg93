// ==UserScript==
// @name         pkg93 injecter
// @namespace    pkg93inject
// @version      0.2
// @description  Injects pkg93!
// @author       1024x2
// @match        *://www.windows93.net/*
// @match        *://windows93.net/*
// @match        *://v2.windows93.net/*
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
      localStorage[".pkg93/userscript"] = "";
      clearInterval(interval);
      loadJS("https://rawgit.com/pkg93/pkg93/master/pkg93.js", function () {});
      $notif("pkg93 loaded successfully!");
    }
  } catch (err) {
    console.error(err);
  }
}, 5000);
