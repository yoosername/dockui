var keyMirror = require("keymirror");

var HTMLResourceTypes = keyMirror({
  INLINE_STYLE: null,
  EXTERNAL_STYLE: null,
  INLINE_SCRIPT: null,
  EXTERNAL_SCRIPT: null
});

module.exports = HTMLResourceTypes;
