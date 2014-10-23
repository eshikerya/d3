d3.behavior.drag = function() {}
/** @typedef {zoomType} */
d3.behavior.zoom = function () {}

/** @typedef {{Array.<number>}} */
var Point;

/**
 * @param {?Point} x
 * @return {zoomType|Point}
 */
d3.behavior.translate = function(x) {}

/**
 * @param {?number} x
 * @return {zoomType|number}
 */
d3.behavior.scale = function(x) {}

/**
 * @param {Array.<number>} x
 * @return {zoomType|Array.<number>}
 */
d3.behavior.scaleExtent = function(x) {}

/**
 * @param {?Point}
 * @return {zoomType|Point}
 */
d3.behavior.center = function(_) {}

/**
 * @param {?Array.<number>}
 * @return {zoomType|Array.<number>|null}
 */
d3.behavior.x = function(z) {}

/**
 * @param {?Array.<number>}
 * @return {zoomType|Array.<number>|null}
 */
d3.behavior.y = function (z) {}

/** type {Event} */
d3.event.sourceEvent = {};/** @return {Array} */
d3.mouse = function (){}

/**
 * @param {!string} name
 * @return {d3_selectionPrototype}
 */
d3_selectionPrototype.append = function(name) {}
/**
 * @param {!string} name
 * @param {?*} value
 * @return {d3_selectionPrototype|string}
 */
d3_selectionPrototype.attr = function (name, value) {}
/**
 * @return {{x: number, y: number, width: number, height: number}} */
d3_selectionPrototype.bbox = function () {}
/**
 * @param {!Function} callback
 * @return {d3_selectionPrototype}
 */
d3_selectionPrototype.call = function(callback) {}
/**
 * @param {!string} name
 * @param {?string} value
 * @return {boolean}
 */
d3_selectionPrototype.classed = function (name, value) {}
/**
 * @param {?Array.<*>} value
 * @param {?string} key
 * @return {d3_selectionPrototype}
 */
d3_selectionPrototype.data = function(value, key) {
    /** @type {d3_selectionPrototype} */
    var r = d3.select([]);

    /** @type {d3_selectionPrototype} */
    r.enter = d3.select([]);

    /** @type {d3_selectionPrototype} */
    r.exit = d3.select([]);

    return r;
}
/**
 * @param {?*} value
 * @return {d3_selectionPrototype|*}
 */
d3_selectionPrototype.datum = function(value) {}
/**
 * @param {!function (Node, *, number, number)} callback
 * @return {d3_selectionPrototype}
 */
d3_selectionPrototype.each = function(callback) {}
/** @return {boolean} */
d3_selectionPrototype.empty = function() {}
/**
 * @param {!string|function(number, number): boolean}
 * @return {d3_selectionPrototype}
 */
d3_selectionPrototype.filter = function(filter) {}
/**
 * @param {?string} value
 * @return {d3_selectionPrototype|string}
 */
d3_selectionPrototype.html = function(value) {}
/**
 * @param {!string|SVGElement|HTMLElement} name
 * @param {!string|SVGElement|HTMLElement} before
 * @return {d3_selectionPrototype}
 */
d3_selectionPrototype.insert = function(name, before) {}
/**
 * @param {!Function} callback
 * @return {Array.<*>}
 */
d3_selectionPrototype.map = function(callback) {}
/**
 * @param {!Node} src
 * @param {!Node} node
 * @return {d3_selectionPrototype}
 */
d3_selectionPrototype.moveAfter = function(src, node) {}
/**
 * @param {!Node} src
 * @param {!Node} node
 * @return {d3_selectionPrototype}
 */
d3_selectionPrototype.moveBefore = function(src, node) {}
/**
 * @param {!Node} node
 * @return {d3_selectionPrototype}
 */
d3_selectionPrototype.moveOnTop = function(node) {}
/** @return {Node|null} */
d3_selectionPrototype.node = function() {}
/**
 * @param {!string|Object.<string, function>} type
 * @param {?Function|boolean} listener
 * @param {?boolean} capture
 * @return {d3_selectionPrototype}
 */
d3_selectionPrototype.on = function(type, listener, capture) {}
/** @return {d3_selectionPrototype} */
d3_selectionPrototype.order = function() {}
/**
 * @param {!string} name
 * @param {?*} value
 * @return {d3_selectionPrototype|*}
 */
d3_selectionPrototype.property = function(name, value) {}
/** @return {d3_selectionPrototype} */
d3_selectionPrototype.remove = function() {}
/** @return {d3_selectionPrototype} */
d3_selectionPrototype.select = function () {};
/** @return {d3_selectionPrototype} */
d3_selectionPrototype.selectAll = function () {}/** @return {d3_selectionPrototype} */
d3.selection = function () {};

/** @typedef {d3_selectionPrototype} */
var d3_selectionPrototype = d3.selection.prototype = [];
/** @return {number} */
d3_selectionPrototype.size = function() {}
/**
 * @param {Function} comparator
 * @return {d3_selectionPrototype}
 */
d3_selectionPrototype.sort = function(comparator) {}
/**
 * @param {!string} name
 * @param {?string} value
 * @param {?number} priority
 * @return {*}
 */
d3_selectionPrototype.style = function(name, value, priority) {}
/**
 * @param {?string} value
 * @return {d3_selectionPrototype|string}
 */
d3_selectionPrototype.text = function(value) {}
/** @return {d3_transitionPrototype} */
d3_selectionPrototype.transition = function() {}
/** @namespace */
var d3 = function () {};
/**
 * @typedef {{
 *      source: function (function): casualLink
 *      target: function (function): casualLink
 * }}
 */
var casualLink;

/**
 * @return {casualLink}
 */
d3.svg.casualLink = function() {}
/** @namespace */
d3.svg = {};d3_transitionPrototype.ease = function(value) {}