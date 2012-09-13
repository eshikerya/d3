d3_selectionPrototype.html = function(value) {
	var fo = this.node().tagName == 'foreignObject';
  return arguments.length < 1
      ? (fo && this.node() || this.node().childNodes[0]).innerHTML
			: this.each(
				typeof value === "function"
	      ? function() { 
						var v = value.apply(this, arguments);
						fo && this.childElementCount == 0 && this.appendChild(document.createElement('body'));
						(fo && this.childNodes[0] || this).innerHTML = v == null ? "" : v; 
					}
				: value == null
	      ? function() {
					fo && this.childElementCount == 0 && this.appendChild(document.createElement('body'));
					(fo && this.childNodes[0] || this).innerHTML = "";
				}
	      : function() {
					fo && this.childElementCount == 0 && this.appendChild(document.createElement('body'));
					(fo && this.childNodes[0] || this).innerHTML = value; 
				}
			);
};
