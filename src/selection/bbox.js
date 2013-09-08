/** @const */ var bboxProperty = '__bbox';
d3_selectionPrototype.bbox = function () {
  var bb = this.property(bboxProperty);
  if (bb) {
    return bb;
  } else {
    try {
      var tmp = this.node().getBBox();
    } catch (e) {
      return {
        'x': 0,
        'y': 0,
        'width': 0,
        'height': 0
      }
    }
    this.property(bboxProperty, bb = {'x': tmp.x, 'y': tmp.y, 'width': tmp.width, 'height': tmp.height});
    return bb;
  }
};

d3_resetElemBBoxCache = function (el) {
    d3.select(el).property(bboxProperty, null);
};
