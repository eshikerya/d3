(function () {
	
	var c = d3.layout.casual().nodes(data.tasks, data.transitions);
	
	var svg = d3.select("body").append("svg")
	    .attr("width", '100%')
	    .attr("height", '100%')
		.append('g');
		
	c.init(svg);
	
	var nodes = svg.selectAll('foreignObject')
		.data(d3.values(c.nodes()))
		.enter().append('foreignObject')
			.attr('x', function (d) { return d.colId * 100 })
			.attr('y', function (d) { return d.rowId * 100 })
			.attr('width', 80)
			.attr('height', '2em')
			.html(function (d) { return '<div>' + d.name + '</div>'});
			
	var links = svg.selectAll('path.links')
			.data(d3.values(c.links()))
			.enter().append('path.links');
			
})();