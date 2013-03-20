d3_selectionPrototype.bbox = function() {
  var bb = this.property("__bbox__");
  if (bb) {
    return bb;
  } else {
    var tmp = this.node().getBBox();
    this.property("__bbox__", bb = {'x': tmp.x, 'y': tmp.y, 'width': tmp.width, 'height': tmp.height});
    return bb;
  }
};

d3_resetElemBBoxCache = function (el) {
    d3.select(el).property("__bbox__", null);
};
