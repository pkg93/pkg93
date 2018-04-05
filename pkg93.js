/***************************
 * This code was created   *
 * by 1024x2, and is       *
 * licensed under the MIT  *
 * License, which means    *
 * you can do whatever you *
 * want on it as long as   *
 * you keep this copyright *
 * notice included with    *
 * this software. Please   *
 * respect that by not     *
 * deleting 'LICENSE' or   *
 * this notice. Thank you! *
 *               ~1024x2   *
 ***************************/

// Thanks, Draco!
function loadJS (source, onready){
  var sc = document.createElement("script");
  sc.src = source;
  sc.type = "text/javascript";
  if (onready) sc.addEventListener("load", onready);
  document.head.appendChild(sc);
  return sc;
}

// Taken from https://github.com/substack/semver-compare, thanks substack!
function cmp (a, b) {
  var pa = a.split('.');
  var pb = b.split('.');
  for (var i = 0; i < 3; i++) {
    var na = Number(pa[i]);
    var nb = Number(pb[i]);
    if (na > nb) return 1;
    if (nb > na) return -1;
    if (!isNaN(na) && isNaN(nb)) return 1;
    if (isNaN(na) && !isNaN(nb)) return -1;
  }
  return 0;
}

console.group("[pkg93]");
console.log("[pkg93] Injecting packages...");
try {
  var config = JSON.parse(localStorage[".pkg93/config.json"]);
  config.installed.forEach(function (pkg) {
    eval(localStorage[".pkg93/packages/" + pkg + ".js"]);
  });
} catch (err) {
  console.error("[pkg93] Couldn't load package information.");
}
console.log("[pkg93] Done!");
console.groupEnd();

var pkg93 = {
  getConfig: function() {
    try {
      return JSON.parse(localStorage[".pkg93/config.json"]);
    } catch (err) {
      return false;
    }
  },
  pull: function() {
    var request = new XMLHttpRequest();
    $log("<b><span style='color:#ff0'>WARN</span></b> Windows93 may lag while getting packages.\n      This is a normal thing.");
    var pkgs = [];
    config.pkglist = [];
    config.repos.forEach(function (source) {
      $log("<b><span style='color:#f0f'>GET</span></b>  " + source);
      request.open('GET', source + "/repo.json", false);
      try {
        request.send(null);
        var json = JSON.parse(request.responseText);
        $log("<b><span style='color:#0f0'>NAME</span></b> " + json.name);
        $log("<b><span style='color:#0f0'>MOTD</span></b> \"" + json.motd + "\"");
        json.packages.forEach(function(item) {
          try {
            $log("<b><span style='color:#0f0'>OK</span></b>   " + item + "@" + source);
            pkgs.push(item + "@" + source);
          } catch (err) {
            $log("<b><span style='color:#f00'>ERR</span></b>  " + err.message);
          }
        });
        config.pkglist = config.pkglist.concat(pkgs);
      } catch (err) {
        $log("<b><span style='color:#f00'>ERR</span></b>  " + err.message);
        $log(request.responseText);
      }
    });
  },
  get: function(pkg) {
    var request = new XMLHttpRequest();
    $log("<b><span style='color:#f0f'>SRCH</span></b> " + pkg);
    var index = config.pkglist.findIndex(function(string) {
      return string.split("@")[0] == pkg;
    });
    if (index < 0) {
      $log("<b><span style='color:#f00'>ERR</span></b>  Not found.");
      return false;
    } else {
      $log("<b><span style='color:#0f0'>OK</span></b>   Found!");
      var pkgname = config.pkglist[index].split("@")[0];
      var pkgsource = config.pkglist[index].split("@")[1];
      request.open('GET', pkgsource + "/" + pkgname + "/package.json", false);
      try {
        request.send(null);
        var json = JSON.parse(request.responseText);
        localStorage[".pkg93/packages/" + pkgname + ".json"] = request.responseText;
        request.open('GET', pkgsource + "/" + pkgname + "/" + json.inject, false);
        request.send(null);
        localStorage[".pkg93/packages/" + pkgname + ".js"] = request.responseText;
        if (!!json.uninstall) {
          request.open('GET', pkgsource + "/" + pkgname + "/" + json.inject, false);
          request.send(null);
          localStorage[".pkg93/packages/" + pkgname + ".rm.js"] = request.responseText;
        }
        eval(request.responseText);
        $log("<b><span style='color:#0f0'>OK</span></b>   Injected package!");
        config.installed.push(pkgname);
        return true;
      } catch (err) {
        $log("<b><span style='color:#f00'>ERR</span></b>  " + err.message);
        return false;
      }
    }
  },
  rm: function(pkg) {
    var request = new XMLHttpRequest();
    var index = config.installed.indexOf(pkg);
    if (index < 0) {
      $log("<b><span style='color:#f00'>ERR</span></b>  Not found.");
      return false;
    } else if (!!localStorage[".pkg93/packages/" + pkg + ".rm.js"]) {
      eval(localStorage[".pkg93/packages/" + pkg + ".rm.js"]); // Typing eval makes me feel dirty.
      delete le._apps[config.installed[index]];
      delete localStorage[".pkg93/packages/" + pkg + ".rm.js"]
      delete localStorage[".pkg93/packages/" + pkg + ".js"]
      delete localStorage[".pkg93/packages/" + pkg + ".json"]
    } else {
      try {
        if (le._apps[config.installed[index]] === null) {
          $log("<b><span style='color:#f00'>ERR</span></b>  Already removed.");
        } else {
          delete le._apps[config.installed[index]];
          delete localStorage[".pkg93/packages/" + config.installed[index] + ".js"];
          delete localStorage[".pkg93/packages/" + config.installed[index] + ".json"];
          config.installed.splice(index, 1);
          $log("<b><span style='color:#0f0'>OK</span></b>   Removed!");
        }
        return true;
      } catch (err) {
        $log("<b><span style='color:#f00'>ERR</span></b>  " + err.message);
        return false;
      }
    }
  }
}

le._apps.pkg93 = {
  exec: function() {
    const protected = ["3d","acid","acidbox","ansi","anthology","arena93","bananamp","base64","bytebeat","calc","castlegafa","catex","cd","clear","clearhist","clippy","code","contact","crazy","defrag","dmg","do a barrel roll","doctor","download","find","font","format","fullscreen","fx","gameoflife","glitch","global thermonuclear war","gravity","hampster","hello","help","hexed","history","hl3","hydra","ie6","iframe","img","info","js","key","killall","layer","lenna","lisa","ls","manifesto","marburg","messenger","mines","necronomicoin","pd","piskel","pkg93","pony","potato","progressquest","pwd","reboot","robby","rotate","shutdown","skifree","solitude","speech","starwars","superplayer","takethis","terminal","textarea","tree","trollbox","vega","virtualpc","vm","wat","whatif","whois","win","zkype"];
    const args = this.arg.arguments;
    const version = "v1.1.0";
    const help = `<b>pkg93 ${version}</b>
<b>Usage:</b> pkg93 [command]

<b><u>List of Commands</u></b>
<span style='color:#0f0'>pull</span>                      Updates package listing
<span style='color:#0f0'>get</span> <span style='color:#77f'>[package]</span>             Installs a package
<span style='color:#0f0'>rm</span> <span style='color:#77f'>[package]</span>              Uninstalls a package
<span style='color:#0f0'>add-repo</span> <span style='color:#77f'>[url]</span>            Adds a repository
<span style='color:#0f0'>rm-repo</span> <span style='color:#77f'>[id]</span>              Removes a repository
<span style='color:#0f0'>ls</span> <span style='color:#77f'>[pkgs|installed|repos]</span> Lists all packages, installed
                          packages or repositories.
<b><u>Color meanings</u></b>
<b><span style='color:#f0f'>Executing</span> <span style='color:#0f0'>OK</span> <span style='color:#f00'>Error</span> <span style='color:#ff0'>Warning</span></b>

<b><u>Examples</u></b>
pkg93 <span style='color:#0f0'>get</span> <span style='color:#77f'>gud</span>
pkg93 <span style='color:#0f0'>rm</span> <span style='color:#77f'>kebab</span>`;
    if (localStorage[".pkg93/config.json"] === undefined) {
      localStorage[".pkg93/config.json"] = '{"repos": ["http://codinggamerhd.com/main-repo"], "installed": [], "pkglist": []}';
    }
    if (localStorage[".pkg93/packages/"] === undefined) {
      localStorage[".pkg93/packages/"] = "";
    }
    localStorage[".pkg93/README.txt"] = "WARNING!\nThis folder contains important data about pkg93. Do not edit anything in here unless you want pkg93 to not work!\n\n~1024x2";
    var config = JSON.parse(localStorage[".pkg93/config.json"]);
    if (args.length === 0) {
      $log(help);
    } else if (args[0] == "pull") {
      pkg93.pull();
    } else if (args[0] == "get") {
      if (args.length < 2) {
        $log("<b><span style='color:#f00'>ERR</span></b>  No package specified.");
      } else if (protected.includes(args[1])) {
        $log("<b><span style='color:#f00'>ERR</span></b>  You're trying to modify a pre-installed Windows93 app.\n      <b>Don't do that!</b>");
      } else {
        pkg93.get(args[1]);
      }
    } else if (args[0] == "rm") {
      if (args.length < 2) {
        $log("<b><span style='color:#f00'>ERR</span></b>  No package specified.");
      } else if (protected.includes(args[1])) {
        $log("<b><span style='color:#f00'>ERR</span></b>  You're trying to modify a pre-installed Windows93 app.\n      <b>Don't do that!</b>");
      } else {
        pkg93.rm(args[1]);
      }
    } else if (args[0] == "add-repo") {
      try {
        config.repos.push(args[1]); // well, that was easy
        $log("<b><span style='color:#0f0'>OK</span></b>   Done!\n     Run \"pkg93 pull\" to update the package listing.");
      } catch (err) {
        $log("<b><span style='color:#f00'>ERR</span></b>  " + err.message);
      }
    } else if (args[0] == "rm-repo") {
      try {
        config.repos.splice(parseInt(args[1]), 1);
        localStorage[".pkg93/config.json"] = JSON.stringify(config);
        $log("<b><span style='color:#0f0'>OK</span></b>   Done!\n     Run \"pkg93 pull\" to update the package listing.");
      } catch (err) {
        $log("<b><span style='color:#f00'>ERR</span></b>  " + err.message);
      }
    } else if (args[0] == "ls") {
      if (args[1] == "pkgs") {
        $log(config.pkglist.join("\n"));
      } else if (args[1] == "installed") {
        $log(config.installed.join("\n"));
      } else if (args[1] == "repos") {
        lerepos = "";
        config.repos.forEach(function (repo, index) {
          lerepos += "[" + index + "] " + repo;
        });
        $log(lerepos);
      } else {
        $log("<b><span style='color:#f00'>ERR</span></b>  You must select either pkgs, installed, or repos.");
      }
    } else if (args[0] == "help") {
      $log(help);
    } else if (args[0] == "wtf") {
      // for teh lulz
      new Audio("/c/sys/sounds/QUACK.ogg").play();
      wtf = ["mudkipz", "pkg93", "memes", "linux", "javascript", "git", "cpu", "windows93", "discord", "kirb", "apt93", "delays", /* those last 2 go well together */ "trash", "kernel panic", "bash", "package manager", "recusion"];
      $log("<b><span style='color:#0f0'>WTF?</span></b> " + wtf[Math.floor(Math.random() * wtf.length)] + " + " + wtf[Math.floor(Math.random() * wtf.length)] + " = " + wtf[Math.floor(Math.random() * wtf.length)]);
    } else {
      $log("<b><span style='color:#f00'>ERR</span></b>  Invalid command. Type \"pkg93\" without any arguments for help.");
    }
    localStorage[".pkg93/config.json"] = JSON.stringify(config);
  },
  icon: "//cdn.rawgit.com/1024x2/pkg93/70039c02/pkg.png",
  terminal: true,
  hascli: true,
  categories: "Network;"
};
