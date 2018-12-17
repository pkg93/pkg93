var errbar = "[<span style=\"color:#0f0\"></span><span style=\"color:#555\">---------------------------------------------------</span>] ERR! <span style=\"color:#f00\">!</span>";
// thanks robbie! sauce: https://gist.github.com/robbie0630/e1386fb10676598e7d60d4f406a41042
// NOTE: this is a modified version
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
    return new Promise(async (res, rej) => {
      for (let source of config.repos) {
        await new Promise(async (reso) => {
          try {
            cli.log("<b><span style='color:#f0f'>GET</span></b>  " + source + "/repo.json");
            var bardiv = cli.log(_abarpkg93uses(60, 0));
            var xhr = new XMLHttpRequest();
            xhr.open("GET", source + "/repo.json", true);
            xhr.onprogress = e => {
              bardiv.innerHTML = _abarpkg93uses(60, e.loaded / e.total);
            };
            xhr.onerror = () => {
              bardiv.innerHTML = errbar;
              cli.log("<b><span style='color:#f00'>ERR</span></b>  Fatal error while retriving package.json.");
              if (xhr.status != 0) {
                cli.log("<b><span style='color:#f00'>ERR</span></b>  " + xhr.status + " " + xhr.statusText);
              }
            };
            xhr.onload = () => {
              try {
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
                reso();
              } catch (err) {
                console.error(err);
                cli.log("<b><span style='color:#f00'>ERR</span></b>  " + err.message);
                rej();
              }
            };
            xhr.send();
          } catch (err) {
            cli.log("<b><span style='color:#f00'>ERR</span></b>  " + err.message);
            rej();
          }
        });
      }
      localStorage[".pkg93/config.json"] = JSON.stringify(config);
      res();
    });
  },
  get: async function(pkg, version, cli) {
    cli = cli || {log: (i) => {$log(i);}};
    version = version || "latest";
    var config = pkg93.getConfig();
    cli.log("<b><span style='color:#f0f'>SRCH</span></b> " + pkg);
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
      xhr.onprogress = e => {
        try {
          bardiv.innerHTML = _abarpkg93uses(60, e.loaded / e.total);
        } catch (err) {
          // fail silently
        }
      };
      return new Promise((res, rej) => {
        xhr.onerror = () => {
          bardiv.innerHTML = errbar;
          cli.log("<b><span style='color:#f00'>ERR</span></b>  Fatal error while retriving package.json.");
          if (xhr.status == 0) {
            cli.log("<b><span style='color:#f00'>ERR</span></b>  " + xhr.status + " " + xhr.statusText);
          }
          rej();
        };
        xhr.onload = () => {
          try {
            cli.log("<b><span style='color:#0f0'>DONE</span></b> " + dest);
            var json = JSON.parse(xhr.responseText);
            localStorage[".pkg93/packages/" + pkgname + ".json"] = JSON.stringify(json);
            if (!json.versions) {
              cli.log("<b><span style='color:#ff0'>WARN</span></b> This package does not support versioning, using latest\n<b>    </b> version instead.");
            } else {
              version = (version == "latest") ? json.versions[0] : version;
            }
            var dest2 = pkgsource + "/" + pkgname + "/" + (json.versions ? version + "/" : "") + json.inject;
            cli.log("<b><span style='color:#f0f'>GET</span></b>  " + dest2);
            var bardiv2 = cli.log(_abarpkg93uses(60, 0));
            var xhr2 = new XMLHttpRequest();
            xhr2.open("GET", dest2, true);
            xhr2.onprogress = e => {
              try {
                bardiv2.innerHTML = _abarpkg93uses(60, e.loaded / e.total);
              } catch (err) {
                // fail silently
              }
            };
            xhr2.onerror = () => {
              bardiv2.innerHTML = errbar;
              cli.log("<b><span style='color:#f00'>ERR</span></b>  Fatal error while retriving " + dest2);
              if (xhr2.status != 0) {
                cli.log("<b><span style='color:#f00'>ERR</span></b>  " + xhr2.status + " " + xhr2.statusText);
              }
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
                  var uninst = await (await (fetch(pkgsource + "/" + pkgname + "/" + (json.versions ? version + "/" : "") + json.uninstall))).text();
                  localStorage[".pkg93/packages/" + pkgname + ".rm.js"] = uninst;
                }
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
      return true;
    } else {
      try {
        delete le._apps[config.installed[index]];
        delete localStorage[".pkg93/packages/" + config.installed[index] + ".js"];
        delete localStorage[".pkg93/packages/" + config.installed[index] + ".json"];
        config.installed.splice(index, 1);
        cli.log("<b><span style='color:#0f0'>OK</span></b>   Removed!");
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

export { pkg93 };
