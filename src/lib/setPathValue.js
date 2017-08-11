module.exports = function (layer, path, value) {
  var i = 0,
    path = path.split('.');

  for (; i < path.length; i++) {
    // if value and is last item
    if (value != null && i + 1 === path.length)
        layer[path[i]] = value;
    layer = layer[path[i]] = layer[path[i]] || {};
  }

  return layer;
}
