module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "rules": {
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "double", {
      "allowTemplateLiterals": true
    }],
    "semi": ["error", "always"],
    "no-console": 0
  },
  "parserOptions": {
    "ecmaVersion": 9,
    "sourceType": "module"
  },
  "globals": {
    "$log": function(){},
    "le": {
      "_apps": {}
    },
    "$window": function(){},
    "$alert": function(){},
    "pkg93": {}
  }
};
