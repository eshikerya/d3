d3.layout.casual = function() {
	var 
	/** @const */INIT_ROW = 1e6,
	/** @const */ROW_INC = 100,
	/** @const */INIT_COL = 1e6,
	/** @const */COL_INC = 100,
	/** @const */ROW_HEIGHT = 15,
	/** @const */COL_WIDTH = 15;

	var _nodes = {},
		_trans = {
			bySource: {},
			byTarget: {},
			linksByTargetNode: {},
			linksBySourceNode: {},
			list: {}
		},
		_axis,
		casual = {};
		
	casual.init = function (svg) {
		svg.append("defs").selectAll("marker")
		    .data([
				{
					id: 'std',
					path: 'M0,-5L10,0L0,5',
					viewBox: '0 -5 10 10'
				},
				{
					id: 'oval',
					path: 'M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z'
				},
				{
					id: 'diamond',
					path: 'M0,5L5,0L10,5L5,10z',
					refX: 2,
					refY: 5
				}
			])
		  .enter().append("marker")
		    .attr("id", function (d) { return d.id; })
		    .attr("viewBox", function (d) {return d.viewBox || "0 0 10 10"})
		    .attr("refX", function (d) { return d.refX || 8; })
		    .attr("refY", function (d) { return d.refY || 0; })
		    .attr("markerWidth", 6)
		    .attr("markerHeight", 6)
		    .attr("orient", "auto")
		  .append("path")
		    .attr("d", function (d) { return d.path; });
			
		_axis = new core.Classes.AxisGrid(0, 0, INIT_COL, INIT_ROW, COL_WIDTH, ROW_HEIGHT, 0, 0, COL_INC, ROW_INC);
		
		return casual;
	}
	
	casual.nodes = function (tasks, transitions) {
		if (arguments.length == 0) {
			return _nodes;
		}
		
		if (transitions) {
			transitions.forEach(function (v) {
				_trans.list[v['id']] = v;
				(!_trans.bySource[v['fromId']] && (_trans.bySource[v['fromId']] = []) || _trans.bySource[v['fromId']]).push(v['toId']);
				(!_trans.byTarget[v['toId']] && (_trans.byTarget[v['toId']] = []) || _trans.byTarget[v['toId']]).push(v['fromId']);
				(!_trans.linksBySourceNode[v['fromId']] && (_trans.linksBySourceNode[v['fromId']] = []) || _trans.linksBySourceNode[v['fromId']]).push(v['id']);
				(!_trans.linksByTargetNode[v['toId']] && (_trans.linksByTargetNode[v['toId']] = []) || _trans.linksByTargetNode[v['toId']]).push(v['id']);
			});
		}
		
		tasks.forEach(function (v) {
			_nodes[v['id']] = v;
			v['fromId'] = _trans.byTarget[v.id] || [];
			v['toId'] = _trans.bySource[v.id] || [];
			_axis.x.add(v['colId']);
			_axis.y.add(v['rowId']);
		});
		
		_axis.x.balanceSpace().update();
		_axis.y.balanceSpace().update();
		
		return casual;
	}
	
	casual.links = function () {
		var res = [];
		$.each(_trans.list, function (i, o) {
			var s = _nodes[o['fromId']],
				d = _nodes[o['toId']];
				
			o.sourceColId = s && s['colId'];
			o.sourceRowId = s && s['rowId'];
			o.destColId = d && d['colId'];
			o.destRowId = d && d['rowId'];
			o.cName = s['state'].substr(0, 1) + d['state'].substr(0, 1);
			
			res.push(o);
		})
		return res;
	}
	
	casual.transitions = function () {
		return _trans;
	}
	
	casual.axis = function () {
		return _axis;
	}
	
	// casual.process = function () {
	// 	
	// }
	
	return casual;
};
