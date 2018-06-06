module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": "eslint:recommended",
  "rules": {
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "double", {"allowTemplateLiterals": true}],
    "semi": ["error", "always"],
    "no-console": 0
  },
  "parserOptions": {
    "ecmaVersion": 2017
  },
  globals: {
    "$log": function(a){},
    "le": {apps: {}}
  }
};