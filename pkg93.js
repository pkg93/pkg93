//                         ....
//                       ..****..
//                     ..,,****,,....
//                   ..,,,,....,,,,,,....
//                 ..,,..        ..,,,,,,....
//               ..,,..              ..,,**//,,..
//             ..**,,..                ,,((##//,,....
//           ..,,****,,..            ,,((##((,,,,,,,,....
//         ..,,,,..,,,,,,,,..      ,,((##((,,..,,**,,,,,,..
//       ..,,..      ..,,,,,,,,..,,//##((,,  ..**//****,,,,,,
//     ..,,..            ..,,****//((//,,    ..,,**//**,,**//..
//   ..,,..                ..,,//((//**..        ..,,,,,,((##,,
// ..,,,,..              ,,**,,,,********,,..        ,,//####,,
// ..****,,..          ,,****,,......,,******,,....,,//((####,,
// ..**//****,,....  ..**//,,..        ..,,********//((((####,,
// ..**//////******,,,,**,,..              ..,,//####((((##((..
// ..//((////////**//((**..                ..,,((%%##((##((,,
// ..//##((((//////((##//,,..              ,,//##%%####((,,
//   ..**((((((((//((%%((****,,....      ,,//((##&&%%((,,
//       ..**((##((##%%((////****,,....,,//((((##&#,,
//           ..**((##%%##////////******//((((((####**
//               ..**((##((((//////////((((((##((,,
//                   ..**((((((((//////((((##((,,
//                       ..**((##((((//((##((,,
//                           ..**((((((##((,,
//                               ..**((((,,
//                                   ....

async function wrap(f) {
  var originalPrompt = this.cli.prompt.innerHTML;
  var originalOnenter = this.cli.onenter;
  try  {
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
    localStorage[".pkg93/config.json"] = `{"repos": ["//codinggamerhd.com/main-repo"], "installed": [], "pkglist": []}`;
  }
  var config = JSON.parse(localStorage[".pkg93/config.json"]);
  for (let pkg of config.installed) {
    eval(localStorage[".pkg93/packages/" + pkg + ".js"]);
  }
} catch (err) {
  console.error("%c[pkg93]%c Couldn't load package information.", "font-weight:bold", "font-weight:normal");
}
console.log("%c[pkg93]%c Done!", "font-weight:bold", "font-weight:normal");
console.groupEnd();

// thanks robbie! sauce: https://gist.github.com/robbie0630/e1386fb10676598e7d60d4f406a41042
// note: this is a modified version
var _abarpkg93uses = (width, percent) => {
  if (percent > 1) percent = 1;
  let barwidth = width - 9;
  let ticker = "\\";
  switch (Math.floor(percent * 100) % 4) {
  case 1:
    ticker = "|";
    break;
  case 2:
    ticker = "/";
    break;
  case 3:
    ticker = "-";
    break;
  default:
    ticker = "\\";
    break;
  }
  ticker = Math.floor(percent) == 1 ? "<span style='color:#0f0'>✔️</span>" : ticker;
  let pbar = "[<span style='color:#0f0'>";
  for (let i = 0; i < Math.floor(percent*barwidth); ++i) pbar += "=";
  pbar += "</span><span style='color:#555'>";
  for (let i = 0; i < Math.ceil((1-percent)*barwidth); ++i) pbar += "-";
  pbar += "</span>] " + Math.floor(percent * 100) + "% " + ticker.padStart(4 - (percent * 100).toFixed().length);
  return pbar;
};

var pkg93 = {
  getConfig: function() {
    try {
      return JSON.parse(localStorage[".pkg93/config.json"]);
    } catch (err) {
      return err;
    }
  },
  pull: async function(cli) {
    cli = cli || {log: (i) => {$log(i);}};
    var config = pkg93.getConfig();
    config.pkglist = [];
    return new Promise((res, rej) => {
      for (let source of config.repos) {
        try {
          console.log(source);
          cli.log("<b><span style='color:#f0f'>GET</span></b>  " + source + "/repo.json");
          var bardiv = cli.log(_abarpkg93uses(60, 0));
          var xhr = new XMLHttpRequest();
          xhr.open("GET", source + "/repo.json", true);
          xhr.onprogress = e => {
            bardiv.innerHTML = _abarpkg93uses(60, e.loaded / e.total);
          };
          xhr.onerror = () => {
            cli.log("<b><span style='color:#f00'>ERR</span></b>  Fatal error while retriving package.json.");
          };
          xhr.onload = () => {
            try {
              console.log(xhr.responseText);
              var json = JSON.parse(xhr.responseText);
              cli.log("<b><span style='color:#0f0'>NAME</span></b> " + json.name);
              cli.log("<b><span style='color:#0f0'>MSG</span></b>  " + json.msg);
              for (let item of json.packages) {
                try {
                  config.pkglist.push(item + "@" + source);
                  cli.log("<b><span style='color:#0f0'>OK</span></b>   " + item + "@" + source);
                } catch (err) {
                  cli.log("<b><span style='color:#f00'>ERR</span></b>  " + err.message);
                }
              }
            } catch (err) {
              console.error(err);
              cli.log("<b><span style='color:#f00'>ERR</span></b>  " + err.message);
              console.log(xhr.responseText);
              rej();
            }
          };
          xhr.send();
        } catch (err) {
          cli.log("<b><span style='color:#f00'>ERR</span></b>  " + err.message);
        } finally {
          delete window.xhr;
        }
      }
      localStorage[".pkg93/config.json"] = JSON.stringify(config);
      res();
    });
  },
  get: async function(pkg, ver, cli) {
    cli = cli || {log: (i) => {$log(i);}};
    ver = ver || "latest";
    var config = pkg93.getConfig();
    cli.log("<b><span style='color:#f0f'>SRCH</span></b> " + pkg + "@" + ver);
    var index = config.pkglist.findIndex(function(string) {
      return string.split("@")[0] == pkg;
    });
    if (index < 0) {
      cli.log("<b><span style='color:#f00'>ERR</span></b>  Not found.");
      return false;
    } else {
      cli.log("<b><span style='color:#0f0'>OK</span></b>   Found!");
      var pkgname = config.pkglist[index].split("@")[0];
      var pkgsource = config.pkglist[index].split("@")[1];
      var dest = pkgsource + "/" + pkgname + "/package.json";
      cli.log("<b><span style='color:#f0f'>GET</span></b>  " + dest);
      var bardiv = cli.log(_abarpkg93uses(60, 0));
      var xhr = new XMLHttpRequest();
      xhr.open("GET", dest, true);
      xhr.setRequestHeader("X-Requested-With", "pkg93");
      xhr.onprogress = e => {
        try {
          bardiv.innerHTML = _abarpkg93uses(60, e.loaded / e.total);
        } catch (err) {
          // fail silently
        }
      };
      return new Promise((res, rej) => {
        xhr.onerror = () => {
          cli.log("<b><span style='color:#f00'>ERR</span></b>  Fatal error while retriving package.json.");
          rej();
        };
        xhr.onload = () => {
          try {
            if (xhr.status != 200) {
              throw new Error("Got status " + xhr.status + " from server.");
            }
            cli.log("<b><span style='color:#0f0'>DONE</span></b> " + dest);
            var json = JSON.parse(xhr.responseText);
            localStorage[".pkg93/packages/" + pkgname + ".json"] = JSON.stringify(json);
            if (ver == "latest") {
              ver = json.versions[0];
            }
            var dest2 = pkgsource + "/" + pkgname + "/" + ver + "/" + json.inject;
            cli.log("<b><span style='color:#f0f'>GET</span></b>  " + dest2);
            var bardiv2 = cli.log(_abarpkg93uses(60, 0));
            var xhr2 = new XMLHttpRequest();
            xhr2.open("GET", dest2, true);
            xhr2.setRequestHeader("X-Requested-With", "pkg93");
            xhr2.onprogress = e => {
              try {
                bardiv2.innerHTML = _abarpkg93uses(60, e.loaded / e.total);
              } catch (err) {
                // fail silently
              }
            };
            xhr2.onerror = () => {
              cli.log("<b><span style='color:#f00'>ERR</span></b>  Fatal error while retriving " + dest2);
              rej();
            };
            xhr2.onload = async () => {
              try {
                if (xhr2.status != 200) {
                  throw new Error("Got status " + xhr2.status + " from server.");
                }
                cli.log("<b><span style='color:#0f0'>DONE</span></b> " + dest2);
                var script = xhr2.responseText;
                localStorage[".pkg93/packages/" + pkgname + ".js"] = script;
                eval(script);
                if (json.uninstall) {
                  // no xhr this time
                  var uninst = await (await (fetch(pkgsource + "/" + pkgname + "/" + ver + "/" + json.uninstall))).text();
                  localStorage[".pkg93/packages/" + pkgname + ".rm.js"] = uninst;
                }
                cli.log("<b><span style='color:#0f0'>OK</span></b>   Injected package!");
                if (!config.installed.includes(pkgname)) {
                  config.installed.push(pkgname);
                }
                localStorage[".pkg93/config.json"] = JSON.stringify(config);
                res();
                // can i go home now
              } catch (err) {
                cli.log("<b><span style='color:#f00'>ERR</span></b>  " + err.message);
                rej(err);
              }
            };
            xhr2.send();
          } catch (err) {
            cli.log("<b><span style='color:#f00'>ERR</span></b>  " + err.message);
            rej(err);
          }
        };
        try {
          xhr.send();
        } catch (err) {
          cli.log("<b><span style='color:#f00'>ERR</span></b>  " + err.message);
          rej(err);
        }
      });
    }
  },
  rm: function(pkg, cli) {
    cli = cli || {log: (i) => {$log(i);}};
    var config = pkg93.getConfig();
    var index = config.installed.indexOf(pkg);
    if (index < 0) {
      cli.log("<b><span style='color:#f00'>ERR</span></b>  Not found.");
      return false;
    } else if (localStorage[".pkg93/packages/" + pkg + ".rm.js"]) {
      eval(localStorage[".pkg93/packages/" + pkg + ".rm.js"]); // Typing eval makes me feel dirty.
      delete le._apps[config.installed[index]];
      delete localStorage[".pkg93/packages/" + pkg + ".rm.js"];
      delete localStorage[".pkg93/packages/" + pkg + ".js"];
      delete localStorage[".pkg93/packages/" + pkg + ".json"];
      config.installed.splice(index, 1);
      cli.log("<b><span style='color:#0f0'>OK</span></b>   Removed!");
    } else {
      try {
        if (le._apps[config.installed[index]] === null) {
          cli.log("<b><span style='color:#f00'>ERR</span></b>  Already removed.");
          return false;
        } else {
          delete le._apps[config.installed[index]];
          delete localStorage[".pkg93/packages/" + config.installed[index] + ".js"];
          delete localStorage[".pkg93/packages/" + config.installed[index] + ".json"];
          config.installed.splice(index, 1);
          cli.log("<b><span style='color:#0f0'>OK</span></b>   Removed!");
        }
        localStorage[".pkg93/config.json"] = JSON.stringify(config);
        return true;
      } catch (err) {
        cli.log("<b><span style='color:#f00'>ERR</span></b>  " + err.message);
        return false;
      }
    }
  },
  pkgInfo: async function(pkg, onlineOnly) {
    var config = pkg93.getConfig();
    try {
      if (localStorage[".pkg93/packages/" + pkg + ".json"] && !onlineOnly) {
        return JSON.parse(localStorage[".pkg93/packages/" + pkg + ".json"]);
      } else {
        var index = config.pkglist.findIndex(function(string) {
          return string.split("@")[0] == pkg;
        });
        if (index < 0) {
          return false;
        } else {
          var pkgname = config.pkglist[index].split("@")[0];
          var pkgsource = config.pkglist[index].split("@")[1];
          var json = await (await (fetch(pkgsource + "/" + pkgname + "/package.json"))).json();
          localStorage[".pkg93/packages/" + pkgname + ".json"] = JSON.stringify(json); // save it for later
          return json;
        }
      }
    } catch (err) {
      console.error("[pkg93] " + err.stack);
      return err;
    }
  },
  shutUp: {
    log: ()=>{},
    arg: {arguments:[]}
  },
  version: "v2.0.0"
};

async function _pkg93execdonotcallplsusetheapi(cli) {
  pkg93.version = "v2.0.0";
  var protected = ["3d", "acid", "acidbox", "ansi", "anthology", "arena93", "bananamp", "base64", "bytebeat", "calc", "castlegafa", "catex", "cd", "clear", "clearhist", "clippy", "code", "contact", "crazy", "defrag", "dmg", "do a barrel roll", "doctor", "download", "find", "font", "format", "fullscreen", "fx", "gameoflife", "glitch", "global thermonuclear war", "gravity", "hampster", "hello", "help", "hexed", "history", "hl3", "hydra", "ie6", "iframe", "img", "info", "js", "key", "killall", "layer", "lenna", "lisa", "ls", "manifesto", "marburg", "messenger", "mines", "necronomicoin", "pd", "piskel", "pkg93", "pony", "potato", "progressquest", "pwd", "reboot", "robby", "rotate", "shutdown", "skifree", "solitude", "speech", "starwars", "superplayer", "takethis", "terminal", "textarea", "tree", "trollbox", "vega", "virtualpc", "vm", "wat", "whatif", "whois", "win", "zkype", "peng"];
  var args = cli.arg.arguments;
  var help = `<b>pkg93 ${pkg93.version}</b>
<b>Usage:</b> pkg93 [command]

<b><u>List of Commands</u></b>
<span style="color:#0f0">pull</span>                      Updates package listing
<span style="color:#0f0">get</span> <span style="color:#77f">[package]</span>             Installs a package
<span style="color:#0f0">rm</span> <span style="color:#77f">[package]</span>              Uninstalls a package
<span style="color:#0f0">add-repo</span> <span style="color:#77f">[url]</span>            Adds a repository
<span style="color:#0f0">rm-repo</span> <span style="color:#77f">[id]</span>              Removes a repository
<span style="color:#0f0">info</span> <span style="color:#77f">[pkg]</span>                Gets information on a package
<span style="color:#0f0">ls</span> <span style="color:#77f">[pkgs|installed|repos]</span> Lists packages, installed
                          packages or repositories.
<span style="color:#0f0">credits</span>                   Displays the credits

<b><u>Color meanings</u></b>
<b><span style="color:#f0f">Executing</span> <span style="color:#0f0">OK</span> <span style="color:#f00">Error</span> <span style="color:#ff0">Warning</span> <span style="color:#00f">Info</span></b>

If you find my software useful, consider donating <a style="color: #00f;" href="http://codinggamerhd.com/donate.html">here</a>.
`;
  if (localStorage[".pkg93/config.json"] === undefined) {
    localStorage[".pkg93/config.json"] = "{\"repos\": [\"//codinggamerhd.com/main-repo\"], \"installed\": [], \"pkglist\": []}";
  }
  if (localStorage[".pkg93/packages/"] === undefined) {
    localStorage[".pkg93/packages/"] = "";
  }
  localStorage[".pkg93/README.txt"] = "WARNING!\nThis folder contains important data about pkg93. Do not edit anything in here unless you want pkg93 to not work!\n\n~1024x2";
  var config = pkg93.getConfig();
  if (args.length === 0) {
    cli.log(help);
  } else if (args[0] == "pull") {
    await pkg93.pull(cli);
  } else if (args[0] == "get") {
    if (args.length < 2) {
      cli.log("<b><span style='color:#f00'>ERR</span></b>  No package specified.");
    } else if (protected.includes(args[1])) {
      cli.log("<b><span style='color:#f00'>ERR</span></b>  You're trying to modify a pre-installed Windows93 app.\n      <b>Don't do that!</b>");
    } else {
      var split = args[1].split("@");
      await pkg93.get(split[0], split[1], cli);
    }
  } else if (args[0] == "rm") {
    if (args.length < 2) {
      cli.log("<b><span style='color:#f00'>ERR</span></b>  No package specified.");
    } else if (protected.includes(args[1])) {
      cli.log("<b><span style='color:#f00'>ERR</span></b>  You're trying to modify a pre-installed Windows93 app.\n      <b>Don't do that!</b>");
    } else {
      pkg93.rm(args[1], cli);
    }
  } else if (args[0] == "add-repo") {
    if (args.length < 2) {
      cli.log("<b><span style='color:#f00'>ERR</span></b>  No repository specified.");
    } else {
      try {
        config.repos.push(args[1]); // well, that was easy
        localStorage[".pkg93/config.json"] = JSON.stringify(config);
        cli.log("<b><span style='color:#0f0'>OK</span></b>   Done!\n     Run \"pkg93 pull\" to update the package listing.");
      } catch (err) {
        cli.log("<b><span style='color:#f00'>ERR</span></b>  " + err.message);
      }
    }
  } else if (args[0] == "rm-repo") {
    if (args.length < 2) {
      cli.log("<b><span style='color:#f00'>ERR</span></b>  No repository specified.");
    } else {
      try {
        config.repos.splice(parseInt(args[1]), 1);
        localStorage[".pkg93/config.json"] = JSON.stringify(config);
        cli.log("<b><span style='color:#0f0'>OK</span></b>   Done!\n     Run \"pkg93 pull\" to update the package listing.");
      } catch (err) {
        cli.log("<b><span style='color:#f00'>ERR</span></b>  " + err.message);
      }
    }
  } else if (args[0] == "ls") {
    if (args[1] == "pkgs") {
      cli.log(config.pkglist.join("\n"));
    } else if (args[1] == "installed") {
      cli.log(config.installed.join("\n"));
    } else if (args[1] == "repos") {
      var lerepos = "";
      for (let index in config.repos) {
        lerepos += "[" + index + "] " + config.repos[index] + "<br>";
      }
      cli.log(lerepos);
    } else {
      cli.log("<b><span style='color:#f00'>ERR</span></b>  You must select either pkgs, installed, or repos.");
    }
  } else if (args[0] == "info") {
    if (args.length > 2) {
      cli.log("<b><span style='color:#f00'>ERR</span></b>  No package specified.");
    } else {
      var pkgInfo = await pkg93.pkgInfo(args[1]);
      if (!pkgInfo) {
        cli.log("<b><span style='color:#f00'>ERR</span></b>  Either the package doesn't exist, or an error occoured.");
      } else {
        var depends = pkgInfo.dependencies ? pkgInfo.dependencies.join(" , ") : "<i><span style='color:#444'>None!</span></i>";
        var description = pkgInfo.description ? pkgInfo.description : "<i><span style='color:#444'>None!</span></i>";
        console.log(pkgInfo);
        cli.log(`<b><u>${pkgInfo.name}</u></b>
Description: ${description}
Dependencies: ${depends}`);
      }
    }
  } else if (args[0] == "help") {
    cli.log(help);
  } else if (args[0] == "wtf") {
    // for teh lulz
    new Audio("/c/sys/sounds/QUACK.ogg").play();
    var wtf = ["mudkipz", "pkg93", "memes", "linux", "javascript", "git", "cpu", "windows93", "discord", "kirb", "apt93", "delays", /* those last 2 go well together */ "trash", "kernel panic", "bash", "package manager", "recusion"];
    cli.log("<b><span style='color:#0f0'>WTF?</span></b> " + wtf[Math.floor(Math.random() * wtf.length)] + " + " + wtf[Math.floor(Math.random() * wtf.length)] + " = " + wtf[Math.floor(Math.random() * wtf.length)]);
  } else {
    cli.log("<b><span style='color:#f00'>ERR</span></b>  Invalid command. Type \"pkg93\" without any arguments for help.");
  }
}

le._apps.pkg93 = {
  exec: function() { wrap.call(this, _pkg93execdonotcallplsusetheapi); },
  icon: "//cdn.rawgit.com/1024x2/pkg93/70039c02/pkg.png",
  terminal: true,
  hascli: true,
  categories: "Network;Utility;Settings;PackageManager"
};
