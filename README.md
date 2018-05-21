# pkg93
A package manager for Windows 93!

**NOTE:** If you're going to make a pull-request, please, for the love of god, try to keep the same coding style as the rest of the code.

## Table of Contents
- [Installation](#installation)
- [Adding my package to the main repoistory](#adding-my-package-to-the-main-repoistory)
- [Making a Repository](#making-a-repository)
- [Making a Package](#making-a-package)
- [API](#api)

## Installation
Install the userscript in this repository named "inject.user.js".

## Adding my package to the main repoistory
Go [here](https://github.com/1024x2/pkg93-mainrepo) for more info.

## Making a repository
Firstly, make sure that [CORS is enabled on your webserver](https://enable-cors.org/server.html).
If it isn't on, your users will be unable to download packages!
Secondly you need to create a repo.json in the folder where you want your repository to be in.
In it, there should be 4 keys.
- `name` This is your repo's name.
- `msg` This is your repo's message to all users. You can set it to anything you want!
- `packages` This is an array containing all the names of packages.
Here's an example:
```json
{
  "name": "Example of a repo.json",
  "msg": "This is an example repo.json",
  "packages": [
    "examplepkg1",
    "examplepkg2",
    "examplepkg3"
  ]
}
```
Finally put all the packages in seperate folders named after the package.
The end result should look like this:
```
example-repo
├── repo.json
├── examplepkg1
│   │ (package files go here)
│   └── package.json
├── examplepkg2
│   │ (package files go here)
│   └── package.json
└── examplepkg3
    │ (package files go here)
    └── package.json
```

## Making a package
Firstly, you want to make a new folder called the name of the package.
Then, you want to make a file called package.json in the folder.
In it, there should be 4 keys.
- `name`: **Must be the same as the folder name and command name!** (unless you've provided a uninstaller)
- `description` A description of your package.
- `inject`: It should be the name of the injection script.
- `uninstall`: Optional, It should be the name of the uninstaller script, if it doesn't exist pkg93 will simply delete the command for you.
- `dependencies`: Optional, Packages this package depends on. These will be automatically installed.
Here's a example:
```json
{
  "name": "examplepkg",
  "description": "my kewl pakeg!!11",
  "inject": "installer.js",
  "uninstall": "optionaluninstaller.js",
  "dependencies": [
    "anoptionaldependency",
    "anotherone"
  ]
}
```
And the directory structure:
```
examplepkg
├── package.json
├── installer.js
└── optionaluninstaller.js
```

## API
### `pkg93.getConfig()`
Gets the configuration, or returns `false` if something went wrong.
Example:
```js
var config = pkg93.getConfig();
if (config == false) {
  alert("Something went wrong...");
} else {
  alert("You have " + config.pkglist.length + " packages available!");
}
```

#### Configuration Format:
The configuration is a object with the following keys:
- `repos` - All added repos.
- `installed` - All installed packages.
- `pkglist` - All available packages.
All of these keys are arrays.

### `pkg93.pull()`
Refreshes the list of packages available.
Example:
```js
alert("You previously had " + config.pkglist.length + " packages available.");
pkg93.pull();
alert("Now you have " + config.pkglist.length + " packages available!");
```

### `pkg93.get(package)`
Tries to install `package`, then returns `true` if the package was installed or `false` if the package couldn't be installed.
```js
succeded = pkg93.get("wget93");
if (succeded) {
  alert("Installed wget93!");  
} else {
  alert("Something went wrong...");
}
```

### `pkg93.rm(package)`
Tries to remove `package`, then returns `true` if the package was removed or `false` if the package couldn't be removed.
```js
succeded = pkg93.rm("wget93");
if (succeded) {
  alert("Removed wget93!");
} else {
  alert("Something went wrong...");
}
```

### `pkg93.pkginfo(package)`
Returns the package.json of `package` or `false` if it failed.
```js
package = pkg93.pkgInfo("wget93");
if (package == false) {
  alert("Something went wrong...");
} else {
  alert("wget93's description is: " + package.description);
}
```
