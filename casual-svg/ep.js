(function () {
	
	var dtasks,
		dlinks,
		pInfo,
		nodes,
		axis = new core.Classes.AxisGrid(0, 0, _.INIT_COL, _.INIT_ROW, _.COL_WIDTH, _.ROW_HEIGHT, 0, 0, _.COL_INC, _.ROW_INC),
		ntasks,
		nlinks;

	window.__init = function () {
		console.log('SVG::init');
		ntasks = d3.select('#tasksLayer');
		nlinks = d3.select('#linksLayer');
		sendMsg(_.epReady);
	}
	
	function sendMsg(msgType, data) {
		var msg = {
			msgType: msgType,
			data: data
		}
		console.log('SVG::sendMsg', msg);
		window.top.postMessage(msg, '*');
	}
		
		
	function updateTasks() {
		nodes = ntasks.selectAll('foreignObject')
			.data(d3.values(dtasks));
			
		nodes.enter().append('foreignObject')
			.classed('taskWrapper', true)
			.attr('x', function (d) {
				return axis.x.axisById(d['colId']);
			})
			.attr('y', function (d) {
				return axis.y.axisById(d['rowId']);
			})
			.html(function (d) { 
				return '<div>' + d.name + '</div>'
			})
			// .attr('width', _.TASK_WIDTH)
			.attr('height', function (d) {
				return this.childNodes[0].offsetHeight;
			})
			.on('click', function (data) {
				// selectNode(this, data);
				d3.event.stopPropagation();
			})
			.call(function (selection) {
				// selection.each(function (d) {
				// 	nodes_map[d['id']] = this;
				// })
			});
			// .call(drag);
			
		nodes.exit().remove();
		
	}

	d3.select(window).on('message', function () {
		var msg = d3.event.data,
			d = msg.data;
			
		console.log('SVG::message', msg);
		
		switch (msg.msgType) {
			case _.epSetData:
				axis.clear();
				
				dtasks = {};
				msg.data['tasks'].forEach(function (v) {
					dtasks[v['id']] = v;
					axis.x.add(Number(v['colId']));
					axis.y.add(Number(v['rowId']));
				});
				
				axis.update(true);
				
				dlinks = {
					bySource: {},
					byTarget: {},
					linksByTargetNode: {},
					linksBySourceNode: {},
					list: {}
				};
				msg.data['transitions'].forEach(function (v) {
					dlinks.list[v['id']] = v;
					(!dlinks.bySource[v['fromId']] && (dlinks.bySource[v['fromId']] = []) || dlinks.bySource[v['fromId']]).push(v['toId']);
					(!dlinks.byTarget[v['toId']] && (dlinks.byTarget[v['toId']] = []) || dlinks.byTarget[v['toId']]).push(v['fromId']);
					(!dlinks.linksBySourceNode[v['fromId']] && (dlinks.linksBySourceNode[v['fromId']] = []) || dlinks.linksBySourceNode[v['fromId']]).push(v['id']);
					(!dlinks.linksByTargetNode[v['toId']] && (dlinks.linksByTargetNode[v['toId']] = []) || dlinks.linksByTargetNode[v['toId']]).push(v['id']);
				});
				
				pInfo = msg.data['projectInfo'];
				
				updateTasks();
				break;
		}
	});

})();


