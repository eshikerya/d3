d3.svg.casualLink = function() {
  var source = d3_svg_chordSource,
      target = d3_svg_chordTarget;

  function casualLink(d, i) {
    var p0 = source.call(this, d, i),
        p3 = target.call(this, d, i),
        my = (p0.y + p3.y) / 2,
		mx = (p0.x + p3.x) / 2,
        p = [
			p0,
			{x: p0.x, y: p0.y + 30},
			{x: mx, y: my},
			p3
		];
		
    p = p.map(function (o) { return [o.x, o.y]; });
	return 'M' + p[0] + 'Q' + p[1] + ' ' + p[2] + 'T' + p[3];
  }

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
