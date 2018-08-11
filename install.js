var _pkg93tagtoinstall = "master";   // tag/branch to install
var _pkg93cdn = false;               // set this to true to load from the cdn (doesn't work with branches)
$alert({
  msg: "Welcome to teh pkg93 " + _pkg93tagtoinstall + " installer, what do you want to do?",
  title: "pkg93 installer",
  btnOk: "Install/upgrade pkg93",
  btnCancel: "Run away",
  img: "//cdn.rawgit.com/1024x2/pkg93/70039c02/pkg.png"
}, function(isOK) {
  if (isOK) {
    var _main = `var interval = setInterval(function () {
  try {
    if (!!le) {
      clearInterval(interval);
      $loader.script("https://${_pkg93cdn ? "cdn." : ""}rawgit.com/pkg93/pkg93/${_pkg93tagtoinstall}/pkg93.js");
    }
  } catch (err) {
    console.error(err);
  }
}, 5000);`;
    localStorage["boot/pkg93.js"] = _main;
    eval(_main);
    $alert({
      msg: "pkg93 has installed successfully!",
      title: "pkg93 installer",
      btnOk: "kthxbai",
      img: "//cdn.rawgit.com/1024x2/pkg93/70039c02/pkg.png"
    });
  }
});
