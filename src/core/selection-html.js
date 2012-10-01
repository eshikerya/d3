d3_selectionPrototype.html = function(value) {
	var fo = this.node().tagName == 'foreignObject';
	
	function createEl(trg) {
		var b = document.createElementNS('http://www.w3.org/1999/xhtml', "body");
		trg.appendChild(b);
		return true;
	}
  return arguments.length < 1
      ? (fo && this.node() || this.node().childNodes[0]).innerHTML
			: this.each(
				typeof value === "function"
	      ? function() { 
						var v = value.apply(this, arguments);
						fo && this.childElementCount == 0 && createEl(this);
						(fo && this.childNodes[0] || this).innerHTML = v == null ? "" : v; 
					}
				: value == null
	      ? function() {
					fo && this.childElementCount == 0 && createEl(this);
					(fo && this.childNodes[0] || this).innerHTML = "";
				}
	      : function() {
					fo && this.childElementCount == 0 && createEl(this);
					(fo && this.childNodes[0] || this).innerHTML = value; 
				}
			);
};
