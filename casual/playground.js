(function () {
	var 
	/** @const */INIT_ROW = 1e6,
	/** @const */ROW_INC = 100,
	/** @const */INIT_COL = 1e6,
	/** @const */COL_INC = 100,
	/** @const */ROW_HEIGHT = 15,
	/** @const */COL_WIDTH = 15;
	
	var svg = d3.select("body").append("svg")
	    .attr("width", '100%')
	    .attr("height", '100%')
		.on('click', function (ev) {
			console.log('svg.click', ev);
			clearSelection();
		})
	    .call(d3.behavior.zoom().scaleExtent([0.5, 1]).on("zoom", zoom))
		.append('g');
		
	function zoom() {
		svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	}
		
	var drag = d3.behavior.drag()
	    .origin(function (d) {
			var el = d3.select(this);
	    	return {
	    		x: el.attr('x'),
				y: el.attr('y')
	    	}
	    })
		.on('dragstart', dragstart)
	    .on('drag', dragmove)
		.on('dragend', dragend);
		
	var dragLines = [],
		dragged = false;
	
	function getLinksOfNode(node) {
		var t = c.transitions();
		return [].concat(t.linksByTargetNode[node['id']] || [], t.linksBySourceNode[node['id']] || []);
	}
	
	function adjustXY(x, y) {
		var nx = Math.round(x / COL_WIDTH),
			ny = Math.round(y / ROW_HEIGHT);

		return {
			x: nx * COL_WIDTH,
			y: ny * ROW_HEIGHT
		}
	}

	function CR2XY(row, col) {
		return {
			x: c.axis().x.axisById(col),
			y: c.axis().y.axisById(row)
		}
	}
	
	function XY2CR(x, y) {
		if (Object.isObject(x)) {
			y = x.y;
			x = x.x;
		}
		return {
			col: c.axis().x.idByAxis(x, true),
			row: c.axis().y.idByAxis(y, true)
		}
	}
	
	function moveNode2CR(node, col, row, animate) {
		var xy = CR2XY(row, col);
		
		node.transition()
			.attr('x', xy.x)
			.attr('y', xy.y)
			.duration(250)
			.ease('bounce');
	}
	
	function moveNode2XY(node, x, y, animate) {
		if (animate) {
			// node.transition()
			// 	.attr('x', x)
			// 	.attr('y', y)
			// 	.duration(250)
			// 	.ease('bounce');
		} else {
			node.attr('x', x).attr('y', y);
			// d3.selectAll(getLinksOfNode(node)).attr('d', diagonal);
		}
	}

	function dragstart(d) {
		dragged = false;
	}
	
	function dragmove(d) {
		if (dragged == false) {
			dragLines = [];
			if (selection.length && selection.indexOf(this) > -1) {
				selection.forEach(function (v) {
					dragLines = dragLines.concat(getLinksOfNode(d3.select(v).data()[0]).map(function (n) {
						return links_map[n];
					}));
				});
			} else {
				selectNode(this, d);
				dragLines = getLinksOfNode(d).map(function (n) {
					return links_map[n];
				});
			}
		}
		
		dragged = true;
		
		if (selection.length) {
			var ev = d3.event,
				actual = d['id'];
				
			d3.selectAll(selection).each(function (d) {
				var el = d3.select(this);
				if (d['id'] == actual) {
					el.attr('x', ev.x).attr('y', ev.y);
				} else {
					el.attr('x', Number(el.attr('x')) + ev.dx).attr('y', Number(el.attr('y')) + ev.dy);
				}
			});
		} else {
			d3.select(this)
				.attr("x", d3.event.x)
				.attr("y", d3.event.y);
		}
			
		// links.attr('d', diagonal);
		d3.selectAll(dragLines).attr('d', diagonal);
	}
	
	function dragend(d) {
		dragged = false;
		
		d3.selectAll(selection)
			.attr('x', function (d) {
				var el = d3.select(this),
					ox = Number(el.attr('x')),
					oy = Number(el.attr('y')),
					xy = adjustXY(ox, oy),
					cr = XY2CR(xy);
					
				if (d['colId'] != cr.col) {
					d['colId'] = cr.col;
					return xy.x;
				} else {
					return ox;
				}
			})
			.attr('y', function (d) {
				var el = d3.select(this),
					ox = Number(el.attr('x')),
					oy = Number(el.attr('y')),
					xy = adjustXY(ox, oy),
					cr = XY2CR(xy);
					
				if (d['rowId'] != cr.row) {
					d['rowId'] = cr.row;
					return xy.y;
				} else {
					return oy;
				}
			})
			
		d3.selectAll(dragLines).attr('d', diagonal);
	}
	
	function linkStartXY(d) {
		var e = nodes_map[d['fromId']],
			bb = e && e.getBBox(),
			x = Number(e.getAttribute('x')),
			y = Number(e.getAttribute('y'));
				
		return {
			x: x + bb.width / 2,
			y: y + bb.height
		}
	}
	
	function linkEndXY(d) {
		var e = nodes_map[d['toId']],
			bb = e && e.getBBox(),
			x = Number(e.getAttribute('x')),
			y = Number(e.getAttribute('y'));
				
		return {
			x: x + bb.width / 2,
			y: y
		}
	}
				
	var diagonal = d3.svg.casualLink()
			.source(linkStartXY)
			.target(linkEndXY);
		
	var c = d3.layout.casual().init(svg).nodes(data.tasks, data.transitions);
	
	var nodes_map = {},
		links_map = {},
		selection = [];
		
	function clearSelection() {
		if (selection.length == 0) { return }
		nodes.classed('selected', false);
		selection = [];
	}
	
	function updateLinks() {
		links = svg.selectAll('path.links')
			.data(d3.values(c.links()));
			
		links.enter().append('path')
			.attr('class', function (d) { return 'link ' + d.cName })
			.attr("marker-end", 'url(#std)')
			// .attr('marker-start', 'url(#diamond)')
			.on('click', function (d) {
				console.log('path.click', d);
				selectLink(this, d);
				d3.event.stopPropagation();
				clearSelection();
			})
			.call(function (selection) {
				selection.each(function (d) {
					links_map[d['id']] = this;
				})
			});
			
		links.exit().remove();
	}
	
	var links, linkEdit;
			
	updateLinks();
				
	function selectNode(node, data) {
		console.log('selectNode', data, d3.event);

		if (!d3.event.metaKey && !d3.event.ctrlKey) {
			clearSelection();
		}
				
		if (selection.indexOf(node) == -1) {
			selection.push(node);
			nodes.moveOnTop(node).order();
		} else {
			var r = selection.splice(selection.indexOf(node), 1);
			d3.select(r[0]).classed('selected', false);
		}
		
		d3.selectAll(selection).classed('selected', true);
	}
	
	function selectLink(link, data) {
		console.log('selectLink', data);
		var c = [];
		if (link && !data) {
			data = link.data();
		}
		
		if (data) {
			c.push(linkStartXY(data));
			c.push(linkEndXY(data));
		}

console.log(c);
		
		linkEdit = svg.selectAll('circle.linkHandle').data(c, function(d) { return d; });
				
		linkEdit.enter().append('circle')
			.classed('linkHandle', true)
			.attr('cx', function (d) { 
				return d.x; 
			})
			.attr('cy', function (d) {
				return d.y;
			})
			.attr('r', 1)
			.transition()
				.attr('r', 8)
				.duration(250)
				.ease('bounce');
			
		linkEdit.exit()
			.transition()
				.attr('r', 1)
				.duration(200)
				.remove();
	}
	
	function updateNodes() {
		nodes = svg.selectAll('foreignObject')
			.data(d3.values(c.nodes()));
			
		nodes.enter().append('foreignObject')
			.attr('x', function (d) {
				return c.axis().x.axisById(d['colId']);
			})
			.attr('y', function (d) {
				return c.axis().y.axisById(d['rowId']);
			})
			.html(function (d) { 
				return '<div>' + d.name + '</div>'
			})
			.attr('width', 80)
			.attr('height', function (d) {
				return this.childNodes[0].offsetHeight;
			})
			.on('click', function (data) {
				selectNode(this, data);
				d3.event.stopPropagation();
			})
			.call(function (selection) {
				selection.each(function (d) {
					nodes_map[d['id']] = this;
				})
			})
			.call(drag);
			
		nodes.exit().remove();
	}

	var nodes;
		
	updateNodes();
	
	links.attr('d', diagonal);

})();