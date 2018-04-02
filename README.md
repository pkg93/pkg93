# pkg93

## Installation
Unfinished!

## Making a repository
Firstly, make sure that [CORS is enabled on your webserver](https://enable-cors.org/server.html).
If it isn't on, your users will be unable to download packages!
Secondly you need to create a repo.json in the folder where you want your repository to be in.
Here's an example:
```json
{
  "name": "Example of a repo.json",
  "motd": "This is an example repo.json",
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
│   │ (package files go here)
    └── package.json
```

## Making a package
Firstly, you want to make a new folder called the name of the package.
Then, you want to make a file called package.json in the folder.
In it, there should be 4 keys.
- `"name"`: **Must be the same as the folder name and command name!**
- `"version"`: An array of 3 numbers, 1st number is major, 2nd number is minor, 3rd number is patch.
- `"inject"`: It should be the name of the injection script.
- `"uninstall"`: Optional, It should be the name of the uninstaller script, if it doesn't exist pkg93 will simply delete the command for you.
Here's a example:
```json
{
  "name": "examplepkg",
  "version": [1, 3, 7],
  "inject": "installer.js",
  "uninstall": "mypointlessuninstaller.js"
}
```
And the directory structure:
```
examplepkg
├── package.json
├── installer.js
└── mypointlessuninstaller.js
```
