import "selection";

d3_selectionPrototype.map = function(callback) {
  var res = [];
  d3_selection_each(this, function(node, i, j) {
    var r = callback.call(node, node[dataProperty], i, j);
    r !== null && r !== undefined && res.push(r);
  });
  return res;
};
