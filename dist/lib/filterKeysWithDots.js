'use strict';

module.exports = function (obj) {
  var key,
      keys = [];
  for (key in obj) {
    if (obj.hasOwnProperty(key) && key.indexOf('.') > -1) {
      keys.push(key);
    }
  }
  return keys;
};