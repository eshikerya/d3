d3.layout.casual = function() {
	var 
	/** @const */INIT_ROW = 1e6,
	/** @const */ROW_INC = 100,
	/** @const */INIT_COL = 1e6,
	/** @const */COL_INC = 100,
	/** @const */ROW_HEIGHT = 30,
	/** @const */COL_WIDTH = 30;

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
		var defs = svg.append("defs");
		
		defs.append('marker')
			.attr('id', 'std')
			.attr('viewBox', '0 0 10 10')
			.attr('refX', '8')
			.attr('refY', '5')
			.attr('markerUnits', 'strokeWidth')
			.attr('orient', 'auto')
			.attr('markerWidth', '6')
			.attr('markerHeight', '5')
			.append('polyline')
				.attr('points', '0,0 10,5 0,10 1,5');

			defs.append('marker')
				.attr('id', 'circle')
				.attr('viewBox', '0 0 10 10')
				.attr('refX', '5')
				.attr('refY', '5')
				.attr('markerUnits', 'strokeWidth')
				.attr('orient', 'auto')
				.attr('markerWidth', '5')
				.attr('markerHeight', '5')
				.append('circle')
					.attr('r', '5')
					.attr('cx', '5')
					.attr('cy', '5')
					.attr('fill', 'red');
			
		defs.append('pattern')
			.attr('id', 'squares')
			.attr('patternUnits', 'userSpaceOnUse')
			.attr('width', 894)
			.attr('height', 791)
			.append('image')
				.attr('xlink:href', '../casual-svg/images/project-panel-bg.png')
				.attr('x', 0)
				.attr('y', 0)
				.attr('width', 894)
				.attr('height', 791);

		var colors = {
			'C': '#71e294',
			'U': '#56c3da',
			'B': '#c7d2d6'
		}
		for (var c1 in colors) {
			for (var c2 in colors) {
				var bb = defs.append('linearGradient').attr('id', c1 + c2);//.attr('gradientUnits', 'userSpaceOnUse');
				['25%', '75%'].forEach(function (s, i) {
					bb.append('stop')
						.attr('offset', s)
						.attr('stop-color', i % 2 == 0 && colors[c1] || colors[c2]);
				});
			}
		}
				
		svg.append('rect')
			.attr('width', '100%')
			.attr('height', '100%')
			.attr('fill', 'url(#squares)');
			
		var gs = svg.selectAll('g').data(['linksLayer', 'tasksLayer', 'helperLayer']);
		
		gs.enter().append('g')
			.attr('id', function (d) { return d; });
			
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
			// v['fromId'] = _trans.byTarget[v.id] || [];
			// v['toId'] = _trans.bySource[v.id] || [];
			_axis.x.add(Number(v['colId'] || 0));
			_axis.y.add(Number(v['rowId'] || 0));
		});
		
		_axis.x.balanceSpace().update();
		_axis.y.balanceSpace().update();
		
		return casual;
	}
	
	casual.links = function () {
		var res = d3.values(_trans.list);
		// $.each(_trans.list, function (i, o) {
		// 	var s = _nodes[o['fromId']],
		// 		d = _nodes[o['toId']];
		// 		
		// 	// o.sourceColId = s && s['colId'];
		// 	// o.sourceRowId = s && s['rowId'];
		// 	// o.destColId = d && d['colId'];
		// 	// o.destRowId = d && d['rowId'];
		// 	// o.cName = s['state'].substr(0, 1) + d['state'].substr(0, 1);
		// 	
		// 	res.push(o);
		// })
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
