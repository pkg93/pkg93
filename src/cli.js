async function _pkg93execdonotcallplsusetheapi(cli) {
  pkg93.version = "v2.0.0beta2";
  var protect = ["3d", "acid", "acidbox", "ansi", "anthology", "arena93", "bananamp", "base64", "bytebeat", "calc", "castlegafa", "catex", "cd", "clear", "clearhist", "clippy", "code", "contact", "crazy", "defrag", "dmg", "do a barrel roll", "doctor", "download", "find", "font", "format", "fullscreen", "fx", "gameoflife", "glitch", "global thermonuclear war", "gravity", "hampster", "hello", "help", "hexed", "history", "hl3", "hydra", "ie6", "iframe", "img", "info", "js", "key", "killall", "layer", "lenna", "lisa", "ls", "manifesto", "marburg", "messenger", "mines", "necronomicoin", "pd", "piskel", "pkg93", "pony", "potato", "progressquest", "pwd", "reboot", "robby", "rotate", "shutdown", "skifree", "solitude", "speech", "starwars", "superplayer", "takethis", "terminal", "textarea", "tree", "trollbox", "vega", "virtualpc", "vm", "wat", "whatif", "whois", "win", "zkype", "peng"];
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

<b><u>Color meanings</u></b>
<b><span style="color:#f0f">Executing</span> <span style="color:#0f0">OK</span> <span style="color:#f00">Error</span> <span style="color:#ff0">Warning</span> <span style="color:#00f">Info</span></b>

If you find my software useful, consider donating <a style="color: #00f;" href="https://1024x2.xyz/donate.html">here</a>.
`;
  if (localStorage[".pkg93/config.json"] === undefined) {
    localStorage[".pkg93/config.json"] = "{\"repos\": [\"https://1024x2.xyz/main-repo\"], \"installed\": [], \"pkglist\": []}";
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
    } else if (protect.includes(args[1])) {
      cli.log("<b><span style='color:#f00'>ERR</span></b>  You're trying to modify a pre-installed Windows93 app.\n      <b>Don't do that!</b>");
    } else {
      var name = args[1].split("@")[0];
      var version = args[1].split("@")[1];
      await pkg93.get(name, version, cli);
    }
  } else if (args[0] == "rm") {
    if (args.length < 2) {
      cli.log("<b><span style='color:#f00'>ERR</span></b>  No package specified.");
    } else if (protect.includes(args[1])) {
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
      try {
        var pkgInfo = await pkg93.pkgInfo(args[1]);
        if (pkgInfo instanceof Error) {
          // There's a Error in my pkgInfo!
          throw pkgInfo;
        }
        if (!pkgInfo) {
          cli.log("<b><span style='color:#f00'>ERR</span></b>  Package not found.");
        } else {
          var description = pkgInfo.description ? pkgInfo.description : "<i><span style='color:#444'>None!</span></i>";
          var vers = pkgInfo.versions ? pkgInfo.versions.join(", ") : "<i><span style='color:#444'>None!</span></i>";
          cli.log(`<b><u>${args[1]}</u></b>
Description: ${description}
Versions: ${vers}`);
        }
      } catch (err) {
        cli.log("<b><span style='color:#f00'>ERR</span></b>  Error while getting package info.\n" + err.stack);
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

export { _pkg93execdonotcallplsusetheapi };
