d3_selectionPrototype.moveOnTop = function(node) {
  for (var j = 0, m = this.length; j < m; j++) {
    for (var group = this[j], i = 0, n = group.length; i < n; i++) {
      var n = group.indexOf(node);
      if (n > -1) {
        group.push(node);
        group.splice(n, 1);
        return this;
      }
    }
  }
  return this;
};
