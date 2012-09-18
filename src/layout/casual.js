d3.layout.casual = function() {
	var _nodes = {},
		_trans = {
			bySource: {},
			byTarget: {},
			list: {}
		},
		_axis,
		casual = {};
		
	casual.init = function (svg) {
		svg.append("defs").selectAll("marker")
		    .data(["std"])
		  .enter().append("marker")
		    .attr("id", String)
		    .attr("viewBox", "0 -5 10 10")
		    .attr("refX", 0)
		    .attr("refY", 0)
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
				(!_trans.bySource[v['source']] && (_trans.bySource[v['source']] = []) || _trans.bySource[v['source']]).push(v['target']);
				(!_trans.byTarget[v['target']] && (_trans.byTarget[v['target']] = []) || _trans.byTarget[v['target']]).push(v['source']);
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
		var res = [];
		$.each(_trans.list, function (i, o) {
			var s = _nodes[o['source']],
				d = _nodes[o['target']];
				
			o.sourceColId = s && s['colId'];
			o.sourceRowId = s && s['rowId'];
			o.destColId = d && d['colId'];
			o.destRowId = d && d['rowId'];
			o.cName = s['status'].substr(0, 1) + d['status'].substr(0, 1);
			
			res.push(o);
		})
		return res;
	}
	
	return casual;
}