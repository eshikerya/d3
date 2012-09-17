d3.layout.casual = function() {
	var nodes = [],
		links = [],
		casual = {}
		
	casual.init = function (svg) {
		svg.append("defs").selectAll("marker")
		    .data(["std"])
		  .enter().append("marker")
		    .attr("id", String)
		    .attr("viewBox", "0 -5 10 10")
		    .attr("refX", 15)
		    .attr("refY", -1.5)
		    .attr("markerWidth", 6)
		    .attr("markerHeight", 6)
		    .attr("orient", "auto")
		  .append("path")
		    .attr("d", "M0,-5L10,0L0,5");
	}
	
	casual.nodes = function () {
		return nodes;
	}
	
	casual.links = function () {
		return links;
	}
}