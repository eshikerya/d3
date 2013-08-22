import "selection";

d3_selectionPrototype.datum = function(value) {
  return arguments.length
      ? this.property(dataProperty, value)
      : this.property(dataProperty);
};
