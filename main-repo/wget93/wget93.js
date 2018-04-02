le._apps.wget93 = {
  exec: function()
  {
    try {
      if (this.arg.arguments.length == 0) {
        $log(`wget93 v0.1.0 by 1024x2
wget93 [url] [output]
example: wget93 http://tobefa.ir/youhavetoha.ve /a/veryhightounderstand/rickandmor.ty

NOTE: Downloading binary files doesn't work, only text.`);
      } else if (this.arg.arguments.length != 2) {
        throw new Error("missing url/destination");
      } else {
        $log.info("Downloading...");
        var url = this.arg.arguments[0];
        if (this.arg.arguments[1].startsWith("/a/")) {
          var output = this.arg.arguments[1].substring(3);
        } else {
          var output = this.arg.arguments[1];
        }
        var request = new XMLHttpRequest();
        request.addEventListener("load", function () {
          if (request.status != 200) {
            $log.error("❌ wget93: " + request.statusText);
          } else {
            $log.succes("✔️ Downloaded!");
            $log.info("Saving...");
            $store.set(output, request.responseText);
            $log.succes("✔️ Saved!");
            $explorer.refresh();
          }
        });
        request.addEventListener("error", function () {
          $log.error("❌ wget93: couldn't download file");
          if (!!window.chrome) {
            $log.info("This may be caused by \"Allow-Control-Allow-Origin\" garbage. <a target=\"_blank\" href=\"https://chrome.google.com/webstore/detail/nlfbmbojpeacfghkpbjhddihlkkiljbi\">Click here to download an extension that fixes this.</a>");
          } else if (navigator.userAgent.indexOf("Firefox") > 0) {
            $log.info("This may be caused by \"Allow-Control-Allow-Origin\" garbage. <a target=\"_blank\" href=\"https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/\">Click here to download an addon that fixes this.</a>");
          } else {
            $log.info("This may be caused by \"Allow-Control-Allow-Origin\" garbage.");
          }
        });
        request.open("GET", url);
        request.send();
      }
    } catch(error) {
      $log.error("❌ wget93: " + error.message);
    }
  },
  hascli: true,
  terminal: true
};