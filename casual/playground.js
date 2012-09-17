(function () {

var tree = d3.layout.casual();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// Per-type markers, as they don't inherit styles.
svg.append("defs").selectAll("marker")
    .data(["suit", "licensing", "resolved"])
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
	

})();