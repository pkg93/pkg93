var _main = `function loadJS (source, onready){
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
}, 5000);`
localStorage["boot/pkg93.js"]=_main;
eval(_main);
