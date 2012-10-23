d3.svg.casualLink = function() {
  var source = d3_svg_chordSource,
      target = d3_svg_chordTarget,
			corner = 15,
			margin = 10;

	  function casualLink(d, i) {
	    var p0 = source.call(this, d, i),
	        p3 = target.call(this, d, i);

			switch (true) {
				case p0 === false && p3 !== false:
					p0 = {
						x: p3.x,
						y: p3.y - margin * 2
					}
					break;
				case p0 !== false && p3 === false:
					p3 = {
						x: p0.x,
						y: p0.y + margin * 2
					}
					break;
			}

	        p = [
				p0,
				{x: p0.x, y: p0.y + 40},
				{x: p3.x, y: p3.y - 40},
				p3
			];
		
			p = p.map(function (o) { return [o.x, o.y]; });

			return 'M' + p[0] + 'C' + p[1] + ' ' + p[2] + ' ' + p[3];
	  }
  
  // function casualLink(d, i) {
  //     var p0 = source.call(this, d, i),
  //         p3 = target.call(this, d, i),
  // 					p = [],
  // 					dv = p3.y - p0.y > 0,
  // 					dh = p3.x - p0.x > 0;
  // 					
  // 					// debugger;
  // 
  // 					switch (true) {
  // 						case p0.x == p3.x:
  // 							return 'M' + [p0.x, p0.y] + 'L' + [p3.x, p3.y];
  // 						default:
  // 			 				p.push(p0); // 0
  // 							p.push({x: p0.x, y: p0.y + margin}); // 1
  // 							p.push({x: p0.x, y: p0.y + margin + corner}); // 2
  // 							p.push({x: p0.x + corner, y: p0.y + margin + corner}); // 3
  // 							p.push({x: p3.x - corner, y: p0.y + margin + corner}); // 4
  // 							p.push({x: p3.x, y: p0.y + margin + corner}); // 5
  // 							p.push({x: p3.x, y: p0.y + margin + corner * 2}); // 6
  // 							p.push(p3)
  // 
  // 			 	    p = p.map(function (o) { return [o.x, o.y]; });
  // 		  
  // 			 			return 'M' + p[0] + 'L' + p[1] + 'Q' + p[2] + ' ' + p[3] + 'L' + p[4] + 'Q' + p[5] + ' ' + p[6] + 'L' + p[7];
  // 					}
  // }

  casualLink.source = function(x) { 
    if (!arguments.length) return source;
    source = d3_functor(x);
    return casualLink;
  };

  casualLink.target = function(x) {
    if (!arguments.length) return target;
    target = d3_functor(x);
    return casualLink;
  };

  return casualLink;
};
