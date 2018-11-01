import { pkg93 } from "./api.js";
import { _pkg93execdonotcallplsusetheapi } from "./cli.js";

window.pkg93 = pkg93;

async function wrap(f) {
  var originalPrompt = this.cli.prompt.innerHTML;
  var originalOnenter = this.cli.onenter;
  try {
    this.cli.prompt.innerHTML = "";
    this.cli.onenter = () => false;
    var lastLog = $log("");
    await f({
      log: (...args) => {
        var newLog = $log(...args);
        newLog.parentElement.insertBefore(newLog, lastLog.nextSibling);
        lastLog = newLog;
        return newLog;
      },
      arg: this.arg
    });
  } catch (err) {
    console.error(err);
    this.cli.prompt.innerHTML = originalPrompt;
    this.cli.onenter = originalOnenter;
  } finally {
    this.cli.prompt.innerHTML = originalPrompt;
    this.cli.onenter = originalOnenter;
  }
}

console.group("[pkg93]");
console.log("%c[pkg93]%c Injecting packages...", "font-weight:bold", "font-weight:normal");
try {
  if (localStorage[".pkg93/config.json"] === undefined) {
    console.log("%c[pkg93]%c You seem new. Creating config...", "font-weight:bold", "font-weight:normal");
    localStorage[".pkg93/config.json"] = `{"repos": ["https://1024x2.xyz/main-repo"], "installed": [], "pkglist": []}`;
  }
  var config = JSON.parse(localStorage[".pkg93/config.json"]);
  for (let pkg of config.installed) {
    eval(localStorage[".pkg93/packages/" + pkg + ".js"]);
  }
} catch (err) {
  console.error("%c[pkg93]%c Couldn't load pkg93!", "font-weight:bold", "font-weight:normal");
  console.error("%c[pkg93]%c %o", "font-weight:bold", "font-weight:normal", err);
  $alert({
    title: "Couldn't load pkg93!",
    msg: "<pre style='text-align: left'>" + (err.stack || err.toString()) + "</pre>",
    img: "/c/sys/skins/w93/error.png",
    icon: "//cdn.rawgit.com/1024x2/pkg93/70039c02/pkg.png"
  });
}
console.log("%c[pkg93]%c Done!", "font-weight:bold", "font-weight:normal");
console.groupEnd();

le._apps.pkg93 = {
  exec: function() { wrap.call(this, _pkg93execdonotcallplsusetheapi); },
  icon: "//cdn.rawgit.com/pkg93/pkg93/70039c02/pkg.png",
  terminal: true,
  hascli: true,
  categories: "Network;Utility;Settings;PackageManager"
};
