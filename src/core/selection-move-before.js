d3_selectionPrototype.moveBefore = function(src, node) {
	for (var j = 0, m = this.length; j < m; j++) {
		for (var group = this[j], i = 0, n = group.length; i < n; i++) {
			var n = group.indexOf(node), si;
				
			if (n > -1) {
				if (si = group.indexOf(src) > -1) {
					group.splice(si, 1);
					n = group.indexOf(node);
				}
				group.splice(n + 1, 0, src);
				return this;
			}
		}
	}
	return this;
};
