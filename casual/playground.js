(function () {
	
	var c = d3.layout.casual().nodes(data.tasks, data.transitions);
	
	var svg = d3.select("body").append("svg")
	    .attr("width", 1000)
	    .attr("height", 600)
		.append('g');
		
	var diagonal = d3.svg.diagonal()
		.source(function (d) {
			// debugger;
			return {
				x: d.sourceColId * 100 - 500,
				y: d.sourceRowId * 100
			}
		})
		.target(function (d) {
			return {
				x: d.destColId * 100 - 500,
				y: d.destRowId * 100
			}
		});
		
	c.init(svg);
	
	var links = svg.selectAll('path.links')
			.data(d3.values(c.links()))
			.enter().append('path')
				.attr('class', function (d) { return 'link ' + d.cName })
				.attr('d', diagonal)
				.attr("marker-end", 'url(#std)')

	var nodes = svg.selectAll('foreignObject')
		.data(d3.values(c.nodes()))
		.enter().append('foreignObject')
			.attr('x', function (d) { return d.colId * 100 - 500})
			.attr('y', function (d) { return d.rowId * 100 })
			.html(function (d) { 
				console.log(d);
				return '<div>' + d.name + '</div>'
			})
			.attr('width', 80)
			.attr('height', '2em');
			
	console.dir(c.links());
})();