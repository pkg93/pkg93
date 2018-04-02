le._apps.pkg93 = {
  exec: function() {
    // if ur reading this can u don't hack into my pc
    // kthx
    const args = this.arg.arguments;
    const version = "le private beta";
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
pkg93 help ivefallenandicantgetup
`);
    }
  },
  icon: "/c/",
  terminal: true
}
