le._apps.pkg93 = {
  exec: function() {
    const args = this.arg.arguments;
    const version = "v0.1.0";
    if (localStorage[".config/pkg93.json"] == undefined) {
      localStorage[".config/pkg93.json"] = '{"sources": [], "pkgs": [], "cache": []}';
    }
    if (args.length == 0) {
      $log.info(`pkg93 ${version} help`);
      $log(`Usage: pkg93 [command]
Command can be one of the below:
update                    Updates package listing
get [package]             Installs a package
rm [package]              Uninstalls a package
add-repo [url]            Adds a repository
rm-repo [id]              Removes a repository
ls [pkgs|installed|repos] Lists all packages, installed
                          packages or repositories.
help                      Gets help for a command

Examples:
pkg93 get gud
pkg93 rm kebab
pkg93 help ivefallenandicantgetup`);
    } else {
      if (args[0] == "update") {
        var config = JSON.parse(localStorage[".config/pkg93.json"]);
        config.sources.forEach((value) => {

        });
      }
    }
  },
  icon: "/c/sys/skins/w93/install.png",
  terminal: true,
  hascli: true
}
