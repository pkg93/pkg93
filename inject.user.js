// ==UserScript==
// @name         pkg93 injecter
// @namespace    pkg93inject
// @version      0.1
// @description  Injects pkg93!
// @author       1024x2
// @match        *://*.windows93.net/*
// ==/UserScript==

// Thanks, Draco!
function loadJS(source, onready)
{
  var sc = document.createElement("script");
  sc.src = source;
  sc.type = "text/javascript";
  if (onready) sc.addEventListener("load", onready);
  document.head.appendChild(sc);
  return sc;
}

var hook = function()
{
  try
  {
    if (le)
    {
      loadJS("https://rawgit.com/1024x2/pkg93/master/pkg93.js", function()
      {
        $notif("pkg93 loaded successfully!");
      });
    }
  }
  catch (err)
  {
    console.error(err);
  }
};
if (system42 && "function" === typeof system42.on) system42.on("splash:ready", hook);
