d3.layout.casual = function() {
	var _nodes = {},
		_trans = {
			bySource: {},
			byTarget: {},
			list: {}
		},
		casual = {};
		
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
	
	casual.nodes = function (tasks, transitions) {
		if (arguments.length == 0) {
			return _nodes;
		}
		
		if (transitions) {
			transitions.forEach(function (v) {
				_trans.list[v['id']] = v;
				(!_trans.bySource[v['source']] && (_trans.bySource[v['source']] = []) || _trans.bySource[v['source']]).push(_trans.list[v['id']]);
				(!_trans.byTarget[v['target']] && (_trans.byTarget[v['target']] = []) || _trans.byTarget[v['target']]).push(_trans.list[v['id']]);
			});
		}
		
		tasks.forEach(function (v) {
			_nodes[v['id']] = v;
			v['source'] = _trans.byTarget[v.id] || [];
			v['target'] = _trans.bySource[v.id] || [];
		});
		
		return casual;
	}
	
	casual.links = function () {
		return _trans.list;
	}
	
	return casual;
}