d3.svg.casualLink = function() {
  var source = d3_source,
      target = d3_target,
      corner = 15,
      margin = 10,
      abs = Math.abs;

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

      // switch (true) {
      //     case abs(p0.x - p3.x) < 30 && p0.y < p3.y:
      //     case abs(p0.x - p3.x) < 30 && p0.y >= p3.y:
      //     case abs(p0.y - p3.y) < 60
      // }

      var cx = (p0.x - p3.x) / 2,
          cy = (p0.y - p3.y) / 2,
          p = [
            p0,
            {x: p0.x, y: p0.y + 30},
            {x: p0.x - cx, y: p0.y - cy},
            p3
          ].map(function (o) { return [o.x, o.y]; });

      // return 'M' + p[0] + 'C' + p[1] + ' ' + p[2] + ' ' + p[3];
      return 'M' + p[0] + 'Q' + p[1] + ' ' + p[2] + 'T' + p[3];// + 'L' + p[5];
    }

  // function casualLink(d, i) {
  //     var p0 = source.call(this, d, i),
  //         p3 = target.call(this, d, i),
  //           p = [],
  //           dv = p3.y - p0.y > 0,
  //           dh = p3.x - p0.x > 0;
  //
  //           // debugger;
  //
  //           switch (true) {
  //             case p0.x == p3.x:
  //               return 'M' + [p0.x, p0.y] + 'L' + [p3.x, p3.y];
  //             default:
  //                p.push(p0); // 0
  //               p.push({x: p0.x, y: p0.y + margin}); // 1
  //               p.push({x: p0.x, y: p0.y + margin + corner}); // 2
  //               p.push({x: p0.x + corner, y: p0.y + margin + corner}); // 3
  //               p.push({x: p3.x - corner, y: p0.y + margin + corner}); // 4
  //               p.push({x: p3.x, y: p0.y + margin + corner}); // 5
  //               p.push({x: p3.x, y: p0.y + margin + corner * 2}); // 6
  //               p.push(p3)
  //
  //              p = p.map(function (o) { return [o.x, o.y]; });
  //
  //              return 'M' + p[0] + 'L' + p[1] + 'Q' + p[2] + ' ' + p[3] + 'L' + p[4] + 'Q' + p[5] + ' ' + p[6] + 'L' + p[7];
  //           }
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
