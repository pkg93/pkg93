const path = require("path");

module.exports = {
  entry: "./src/install.js",
  output: {
    filename: "installer.js",
    path: path.resolve(__dirname, "dist")
  }
};
